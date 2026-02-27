function formatUtcDateTime(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return (
    date.getUTCFullYear() +
    "-" +
    pad(date.getUTCMonth() + 1) +
    "-" +
    pad(date.getUTCDate()) +
    " " +
    pad(date.getUTCHours()) +
    ":" +
    pad(date.getUTCMinutes()) +
    ":" +
    pad(date.getUTCSeconds())
  );
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function firstIpFromHeaders(req) {
  const xff = req.headers["x-forwarded-for"];
  if (typeof xff === "string" && xff.trim()) {
    return xff.split(",")[0].trim();
  }
  return null;
}

async function sendOrderToUtmify(orderPayload, token, timeoutMs) {
  if (!token) return { skipped: true, reason: "missing_token" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch("https://api.utmify.com.br/api-credentials/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": token,
      },
      body: JSON.stringify(orderPayload),
      signal: controller.signal,
    });
    const body = await resp.json().catch(() => ({}));
    return { ok: resp.ok, status: resp.status, body };
  } catch (error) {
    return { ok: false, status: 0, body: { message: error.message || "request_failed" } };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const amount = Number(body.amount);
    const customer = body.customer || {};
    const endpoint =
      process.env.SEALPAY_CREATE_PIX_URL ||
      process.env.PIX_GATEWAY_URL ||
      process.env.CREATE_PIX_URL ||
      "";
    const apiKey = process.env.SEALPAY_API_KEY || body.api_key || "";
    const timeoutMs = Number(process.env.SEALPAY_TIMEOUT_MS || 20000);

    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ error: "amount invalido (centavos, minimo 100)" });
    }
    if (!customer.name || !customer.email) {
      return res.status(400).json({ error: "customer.name e customer.email sao obrigatorios" });
    }
    if (!apiKey) {
      return res.status(500).json({
        error: "SEALPAY_API_KEY nao configurada",
        detalhes: { message: "Configure env var SEALPAY_API_KEY na Vercel" },
      });
    }
    if (!endpoint) {
      return res.status(500).json({
        error: "SEALPAY_CREATE_PIX_URL nao configurada",
        detalhes: {
          message:
            "Configure SEALPAY_CREATE_PIX_URL (ou PIX_GATEWAY_URL / CREATE_PIX_URL) na Vercel",
        },
      });
    }

    const payload = {
      amount,
      description: body.description || "Doacao",
      customer: {
        name: customer.name,
        email: customer.email,
        cellphone: customer.cellphone || "",
        taxId: customer.taxId || "",
      },
      tracking: body.tracking || { utm: {}, src: "" },
      api_key: apiKey,
      fbp: body.fbp || "",
      fbc: body.fbc || "",
      user_agent: body.user_agent || req.headers["user-agent"] || "",
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    }).finally(() => clearTimeout(timer));

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
    }

    if (
      (data && typeof data === "object" && data.error) ||
      (data && typeof data === "object" && data.success === false)
    ) {
      return res.status(502).json(
        typeof data === "object" ? data : { error: "Gateway retornou erro inesperado" }
      );
    }

    const root = data && typeof data === "object" ? data : {};
    const nested =
      root.data && typeof root.data === "object"
        ? root.data
        : root.payment && typeof root.payment === "object"
          ? root.payment
          : root.pix && typeof root.pix === "object"
            ? root.pix
            : {};
    const source = { ...root, ...nested };

    const qr =
      source.pix_qr_code ||
      source.pixQrCode ||
      source.qr_code ||
      source.qrCode ||
      source.qr_code_base64 ||
      source.qrCodeBase64 ||
      (source.pix && source.pix.qr_code) ||
      (source.pix && source.pix.qrCode);
    const code =
      source.pix_code ||
      source.pixCode ||
      source.pix_string ||
      source.emv ||
      source.payload ||
      source.brcode ||
      (source.pix && source.pix.code) ||
      (source.pix && source.pix.pix_code);
    const txid =
      source.txid ||
      source.id ||
      source.transaction_id ||
      source.payment_id ||
      (source.pix && source.pix.txid) ||
      null;

    if (!qr || !code) {
      return res.status(500).json({
        error: "Erro ao gerar QR Code Pix",
        detalhes: {
          message: "Resposta inesperada do gateway",
          keys: Object.keys(root),
          raw: root,
        },
      });
    }

    const utmifyToken =
      process.env.UTMIFY_API_TOKEN || process.env.UTMIFY_TOKEN || body.utmify_api_token || "";
    const nowUtc = new Date();
    const orderId = String(txid || `pix-${Date.now()}`);
    const utm = body?.tracking?.utm || {};
    const trackingParameters = {
      src: body?.tracking?.src || null,
      sck: body?.tracking?.sck || body?.sck || null,
      utm_source: utm.utm_source || null,
      utm_campaign: utm.utm_campaign || null,
      utm_medium: utm.utm_medium || null,
      utm_content: utm.utm_content || null,
      utm_term: utm.utm_term || null,
    };

    const utmifyOrderPayload = {
      orderId,
      platform: process.env.UTMIFY_PLATFORM || "VakinhaOnline",
      paymentMethod: "pix",
      status: "waiting_payment",
      createdAt: formatUtcDateTime(nowUtc),
      approvedDate: null,
      refundedAt: null,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.cellphone ? onlyDigits(customer.cellphone) : null,
        document: customer.taxId ? onlyDigits(customer.taxId) : null,
        country: customer.country || null,
        ip: body.ip || firstIpFromHeaders(req) || null,
      },
      products: [
        {
          id: process.env.UTMIFY_PRODUCT_ID || "donation",
          name: body.description || "Doacao",
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: amount,
        },
      ],
      trackingParameters,
      commission: {
        totalPriceInCents: amount,
        gatewayFeeInCents: 0,
        userCommissionInCents: amount,
      },
      isTest: body.isTest === true,
    };

    // Best effort: nao bloqueia geracao do PIX em caso de indisponibilidade da UTMify.
    const utmifyResult = await sendOrderToUtmify(
      utmifyOrderPayload,
      utmifyToken,
      Number(process.env.UTMIFY_TIMEOUT_MS || 8000)
    );

    return res.status(200).json({
      pix_qr_code: qr,
      pix_code: code,
      txid,
      utmify: utmifyResult,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar pagamento",
      detalhes: { message: error.message || "Falha inesperada" },
    });
  }
};
