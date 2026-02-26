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
      process.env.SEALPAY_CREATE_PIX_URL || "https://abacate-5eo1.onrender.com/create-pix";
    const apiKey = process.env.SEALPAY_API_KEY || body.api_key || "";

    if (!Number.isInteger(amount) || amount < 100) {
      return res.status(400).json({ error: "amount inválido (centavos, mínimo 100)" });
    }
    if (!customer.name || !customer.email) {
      return res
        .status(400)
        .json({ error: "customer.name e customer.email são obrigatórios" });
    }
    if (!apiKey) {
      return res.status(500).json({
        error: "SEALPAY_API_KEY não configurada",
        detalhes: { message: "Configure env var SEALPAY_API_KEY na Vercel" },
      });
    }

    const payload = {
      amount,
      description: body.description || "Doação",
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

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      return res.status(upstream.status).json(data);
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
        },
      });
    }

    return res.status(200).json({
      pix_qr_code: qr,
      pix_code: code,
      txid,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar pagamento",
      detalhes: { message: error.message || "Falha inesperada" },
    });
  }
};
