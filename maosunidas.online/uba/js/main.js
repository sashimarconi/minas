(() => {
  var j = 0;
  document.addEventListener("keydown", function (v) {
    let C = v.key.toLowerCase();
    (C === "f12" ||
      (v.ctrlKey && v.shiftKey && (C === "i" || C === "c")) ||
      (v.ctrlKey && C === "u") ||
      (v.ctrlKey && v.shiftKey && (C === "j" || C === "k")) ||
      C === "f11" ||
      (v.metaKey && C === "i")) &&
      (v.preventDefault(), triggerDebugger());
  });
  document.addEventListener("DOMContentLoaded", () => {
    function trackMetaPurchase(value, transactionId) {
      if (typeof window.fbq !== "function") return;
      let payload = {
        currency: "BRL",
        value: Number(value) || 0,
      };
      if (transactionId) payload.eventID = String(transactionId);
      window.fbq("track", "Purchase", payload);
    }

    document.addEventListener("contextmenu", (e) => e.preventDefault()),
      document.addEventListener("selectstart", (e) => e.preventDefault()),
      document.addEventListener("dragstart", (e) => e.preventDefault()),
      document.addEventListener("keydown", (e) => {
        let a = e.key.toLowerCase();
        (a === "f12" ||
          (e.ctrlKey && e.shiftKey && (a === "i" || a === "j" || a === "c")) ||
          (e.ctrlKey && (a === "u" || a === "s" || a === "p"))) &&
          (e.preventDefault(), e.stopPropagation());
      }),
      document.querySelectorAll("a[href='#']").forEach((e) => {
        e.addEventListener("click", (a) => {
          a.preventDefault();
        });
      }),
      (() => {
        let e = document.querySelector(".js-apoio-toggle"),
          a = document.querySelector(".js-apoio");
        e &&
          a &&
          e.addEventListener("click", () => {
            a.classList.toggle("is-active");
          });
      })();
    function v() {
      let e = document.getElementById("toast");
      e.classList.add("show"),
        setTimeout(() => {
          e.classList.remove("show");
        }, 3e3);
    }
    (() => {
      let e = document.querySelectorAll(".js-abas-toggle"),
        a = document.querySelectorAll(".js-abas");
      e.forEach((o) => {
        o.addEventListener("click", () => {
          let s = o.getAttribute("data-item");
          e.forEach((r) => r.classList.remove("is-active")),
            a.forEach((r) => r.classList.remove("is-active")),
            o.classList.add("is-active"),
            document
              .querySelector(`.js-abas[data-item="${s}"]`)
              .classList.add("is-active");
        });
      });
    })(),
      document.querySelectorAll(".js-copy-pix").forEach((a) => {
        a.addEventListener("click", (o) => {
          o.preventDefault(),
            navigator.clipboard
              .writeText(configGlobal.pagamento.chave)
              .then(() => {
                v();
              })
              .catch((s) => {
                console.error("Erro ao copiar:", s);
              });
        });
      }),
      document.querySelectorAll(".js-anchor").forEach((a) => {
        a.addEventListener("click", function (o) {
          o.preventDefault();
          let s = this.getAttribute("href"),
            r = document.querySelector(s);
          if (!r) return;
          let c = r.getBoundingClientRect().top + window.scrollY,
            m = window.scrollY,
            y = c - m,
            u = 800,
            n = null;
          function p(d) {
            n === null && (n = d);
            let t = d - n,
              i = f(t, m, y, u);
            window.scrollTo(0, i), t < u && requestAnimationFrame(p);
          }
          function f(d, t, i, h) {
            return (
              (d /= h / 2),
              d < 1
                ? (i / 2) * d * d * d + t
                : ((d -= 2), (i / 2) * (d * d * d + 2) + t)
            );
          }
          requestAnimationFrame(p);
        });
      }),
      (() => {
        let e = document.querySelector(".js-coracao-input"),
          a = document.querySelector(".js-coracao-view"),
          o = document.querySelector(".js-coracao-attr");
        e &&
          e.addEventListener("input", () => {
            let s = Number(e.value) * 0.85;
            (a.textContent = s.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })),
              (o.dataset.value = s.toFixed(2));
          });
      })();
    function C() {
      let e = !1;
      document.querySelectorAll(".js-dialog").forEach((o) => {
        o.classList.contains("is-active") && (e = !0);
      }),
        e
          ? (document.body.style.overflow = "hidden")
          : (document.body.style.overflow = "");
    }
    function D(e) {
      let a = Math.round(Number(e) * 100);
      if (!Number.isFinite(a) || a < 200) return;
      let o = document.querySelector('.js-dialog[data-dialog="pix-payment"]');
      o && !o.classList.contains("is-active") && o.classList.add("is-active");
      j = a;
      I(j);
      C();
    }
    window.startPixFlow = D;
    document.querySelectorAll(".js-dialog-toggle").forEach((a) => {
      a.addEventListener("click", (o) => {
        o.preventDefault();
        let s = a.getAttribute("data-dialog"),
          r = document.querySelector(`.js-dialog[data-dialog="${s}"]`);
        r && (r.classList.toggle("is-active"), C());
      });
    }),
      document.querySelectorAll(".js-apiPix-toggle").forEach((a) => {
        a.addEventListener("click", function (o) {
          o.preventDefault();
          let r = a.dataset.value.match(/[\d.,]+/);
          if (r) {
            let c = parseFloat(r[0].replace(",", ".")),
              m = Math.round(c * 100);
            D(m / 100);
          }
        });
      }),
      (() => {
        let e = document.querySelector(".js-apiPrices-input"),
          a = document.querySelector(".js-apiPrices-button"),
          o = document.querySelector(".js-apiPrices-error");
        function s(r) {
          let c = r.replace(/\D/g, "");
          if (c === "")
            return (e.value = "R$ 0,00"), (a.dataset.value = "0.00"), 0;
          let m = parseInt(c, 10) / 100;
          return (
            (e.value = new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(m)),
            (a.dataset.value = m.toFixed(2)),
            m
          );
        }
        e.addEventListener("input", (r) => {
          s(r.target.value) < 2
            ? ((o.style.display = "inline"), (a.disabled = !0))
            : ((o.style.display = "none"), (a.disabled = !1));
        }),
          a.addEventListener("click", () => {
            parseFloat(a.dataset.value) < 2
              ? ((o.style.display = "inline"), (a.disabled = !0))
              : ((o.style.display = "none"), (a.disabled = !1));
          }),
          e.dispatchEvent(new Event("input"));
      })();
    function I(e) {
      let o = document.querySelector(".js-pix-payment");
      o.innerHTML = "<div class='loading'></div>";
      function c(n) {
        return new URLSearchParams(window.location.search).get(n) || "";
      }
      let y = window.PIX_CONFIG?.endpoint || "/api/create-pix",
        u = null,
        p = Number((e / 100).toFixed(2)).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        }),
        g = window.PIX_CONFIG?.defaultCustomer || {},
        f = g.name || localStorage.getItem("pix_customer_name") || "Apoiador",
        d =
          g.email ||
          localStorage.getItem("pix_customer_email") ||
          "checkout@exemplo.com",
        P = g.cellphone || localStorage.getItem("pix_customer_cellphone") || "",
        N = g.taxId || localStorage.getItem("pix_customer_taxid") || "";
      if (!f || !d) {
        o.innerHTML =
          "<p style='text-align:center;'>Nome e e-mail são obrigatórios para gerar o Pix.</p>";
        return;
      }
      localStorage.setItem("pix_customer_name", f);
      localStorage.setItem("pix_customer_email", d);
      let t = {
        amount: e,
        description: "Doação",
        customer: {
          name: f,
          email: d,
          cellphone: P,
          taxId: N,
        },
        tracking: {
          utm: {
            utm_source: c("utm_source"),
            utm_campaign: c("utm_campaign"),
            utm_medium: c("utm_medium"),
            utm_content: c("utm_content"),
            utm_term: c("utm_term"),
          },
          src: window.location.href,
        },
        fbp: c("fbp"),
        fbc: c("fbc"),
        user_agent: navigator.userAgent,
      };
      if (window.PIX_CONFIG?.apiKey) t.api_key = window.PIX_CONFIG.apiKey;
      fetch(y, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(t),
      })
        .then((n) => n.json().then((k) => ({ ok: n.ok, status: n.status, body: k })))
        .then((n) => {
          if (!n.ok) {
            let k =
              n.body?.detalhes?.message ||
              n.body?.message ||
              n.body?.error ||
              "Erro ao criar pagamento";
            throw new Error(`${k} (HTTP ${n.status})`);
          }
          let k = n.body || {};
          u = k.txid || k.transaction_id || null;
          let q = k.pix_qr_code || k.pixQrCode || k.qr_code || "",
            B = k.pix_code || k.pixCode || k.pix_string || "",
            T = k.amount_formatted || p;
          if (!q || !B) {
            throw new Error("Resposta inválida da API Pix");
          }
          trackMetaPurchase(e / 100, u);
          q = String(q).trim();
          // Gateway pode retornar data URI, URL HTTP(S) ou base64 puro.
          if (!/^data:image/i.test(q) && !/^https?:\/\//i.test(q) && !q.startsWith("/")) {
            q = `data:image/png;base64,${q}`;
          }
          o.innerHTML = `
          <div class="pix-card-clean">
            <div class="pix-brand-icon">V</div>
            <h2>Vaquinha Verificada</h2>
            <p class="pix-subtitle">Sua doacao muda a vida de familias em Uba <span class="heart">💚</span></p>
            <p class="pix-total">Valor total: <strong>${T}</strong></p>
            <p class="pix-instruction">Escaneie o QR Code ou copie o codigo Pix abaixo para finalizar o pagamento.</p>
            <div class="pix-qr-wrap"><img src="${q}" alt="QR Code" width="170" height="170"></div>
            <div class="pix-divider"><span>ou</span></div>
            <input value="${B}" id="pixPayloadInput" readonly>
            <button id="pixPayloadCopy">COPIAR CODIGO PIX</button>
            <div class="pix-help-box">
              <h3>Como pagar?</h3>
              <ul>
                <li><span class="pix-bullet">+</span>Escaneie o QR Code ou copie e cole o codigo Pix em seu app bancario ou carteira digital.</li>
                <li><span class="pix-bullet">✓</span>Seu pagamento sera aprovado em alguns instantes.</li>
              </ul>
            </div>
          </div>
        `;
            
(function () {
              let t = "qr-timer",
                i = "qr_deadline_ms_" + btoa(f).slice(-8),
                h = 10,
                w = document.getElementById(t);
              if (!w) return;
              let b = (x) => {
                  let S = Math.max(0, Math.floor(x / 1e3)),
                    M = String(Math.floor(S / 60)).padStart(2, "0"),
                    V = String(S % 60).padStart(2, "0");
                  return `${M}:${V}`;
                },
                l = Date.now() + h * 60 * 1e3;
              sessionStorage.setItem(i, String(l));
              let g = null;
              function E() {
                let x = l - Date.now();
                if (x <= 0) {
                  clearInterval(g),
                    (g = null),
                    (w.textContent = "Aguardando..."),
                    w.classList.add("expired"),
                    sessionStorage.removeItem(i);
                  return;
                }
                w.textContent = `\u23F3 ${b(x)}`;
              }
              E(),
                (g = setInterval(E, 250)),
                (window.resetQrTimer = function (x = h) {
                  let S = x * 60 * 1e3;
                  (l = Date.now() + S),
                    sessionStorage.setItem(i, String(l)),
                    w.classList.remove("expired"),
                    g && clearInterval(g),
                    E(),
                    (g = setInterval(E, 250));
                });
            })();
        })
        .catch((n) => {
          o.innerHTML = `
          <div class="pix-card-clean">
            <div class="pix-brand-icon">V</div>
            <h2>Erro ao gerar Pix</h2>
            <p>${(n && n.message) || "Tente novamente em instantes."}</p>
          </div>
        `;

        })
        .finally(() => {
          let n = o.querySelector("#pixPayloadInput"),
            p = o.querySelector("#pixPayloadCopy");
          if (!n || !p) return;
          n.addEventListener("focus", () => n.select()),
            n.addEventListener("click", () => n.select());
          let f = async () => {
            let d = n.value;
            try {
              if (navigator.clipboard && window.isSecureContext)
                await navigator.clipboard.writeText(d);
              else throw new Error("Clipboard API indispon\xEDvel");
            } catch {
              n.removeAttribute("readonly"),
                n.select(),
                n.setSelectionRange(0, d.length),
                document.execCommand("copy"),
                n.setAttribute("readonly", "readonly"),
                window.getSelection?.().removeAllRanges();
            }
            (p.textContent = "Copiado!"),
              typeof v == "function" && v(),
              setTimeout(() => (p.textContent = "Copiar"), 2e3);
          };
          p.addEventListener("click", f);
        });
    }
    let A = !1,
      L = null;
    function _(e) {
      let a = e;
      if (A) return;
      A = !0;
      let s = window.location.href.split("?")[0].replace(/\/[^\/]*$/, ""),
        r = window.location.search || "",
        c = `${s}/api/payment-validation.php?id=${encodeURIComponent(e)}`,
        m = Date.now() + 600 * 1e3;
      function y() {
        if (Date.now() > m) {
          (A = !1), L && clearInterval(L);
          return;
        }
        fetch(c, { cache: "no-store" })
          .then((u) => u.json())
          .then((u) => {
            if (u && u.paid === !0) {
              (A = !1), L && clearInterval(L);
              let n = window.location.search || "",
                p = Number(u.amount || valueInCents / 100),
                f = new URLSearchParams(n);
              f.set("value", p.toFixed(2)),
                f.set("transaction_id", transaction_id),
                (window.location.href =
                  s + "/pagamento-aprovado.php?" + f.toString());
              return;
            }
          })
          .catch((u) => {
            console.error("Erro ao verificar pagamento:", u);
          });
      }
      y(), (L = setInterval(y, 3e3));
    }
    (() => {
      let e = document.querySelectorAll(".j-doacao-coracao"),
        a = document.querySelectorAll(".j-doacao-percent"),
        o = document.querySelectorAll(".j-doacao-value"),
        s = [
          {
            nome: "Marcela Aur\xE9lio",
            image: "img/doador/1.jpg",
            apoiador: 1,
            doado: 50,
            coracoes: 1,
          },
          {
            nome: "Juliana Aparecida",
            image: "img/doador/2.jpg",
            apoiador: 1,
            doado: 32.5,
            coracoes: 0,
          },
          {
            nome: "Maria Eduarda",
            image: "img/doador/3.jpg",
            apoiador: 1,
            doado: 100,
            coracoes: 1,
          },
          {
            nome: "Lorena Fonseca",
            image: "img/doador/4.jpg",
            apoiador: 1,
            doado: 113.2,
            coracoes: 0,
          },
          {
            nome: "Maria Eduarda",
            image: "img/doador/5.jpg",
            apoiador: 1,
            doado: 140.8,
            coracoes: 1,
          },
          {
            nome: "Raquel Oliveira",
            image: "img/doador/6.jpg",
            apoiador: 1,
            doado: 100,
            coracoes: 1,
          },
          {
            nome: "Juliana Aparecida",
            image: "img/doador/7.jpg",
            apoiador: 1,
            doado: 210,
            coracoes: 0,
          },
          {
            nome: "Maria Eduarda",
            image: "img/doador/8.jpg",
            apoiador: 1,
            doado: 55,
            coracoes: 1,
          },
          {
            nome: "Roberta de Souza",
            image: "img/doador/9.jpg",
            apoiador: 1,
            doado: 62,
            coracoes: 0,
          },
          {
            nome: "Juliana C\xE9sar",
            image: "img/doador/10.jpg",
            apoiador: 1,
            doado: 108,
            coracoes: 1,
          },
          {
            nome: "Marcela de Moraes",
            image: "img/doador/11.jpg",
            apoiador: 1,
            doado: 60,
            coracoes: 0,
          },
          {
            nome: "Roberta de Souza",
            image: "img/doador/12.jpg",
            apoiador: 1,
            doado: 150,
            coracoes: 1,
          },
          {
            nome: "Raquel Oliveira",
            image: "img/doador/13.jpg",
            apoiador: 1,
            doado: 256,
            coracoes: 0,
          },
          {
            nome: "Marcela Rodrigues",
            image: "img/doador/14.jpg",
            apoiador: 1,
            doado: 155,
            coracoes: 1,
          },
          {
            nome: "Ta\xEDs Costa",
            image: "img/doador/15.jpg",
            apoiador: 1,
            doado: 144,
            coracoes: 1,
          },
          {
            nome: "Manuela Ribeiro",
            image: "img/doador/16.jpg",
            apoiador: 1,
            doado: 105,
            coracoes: 0,
          },
          {
            nome: "Eduarda dos Santos",
            image: "img/doador/17.jpg",
            apoiador: 1,
            doado: 40.5,
            coracoes: 1,
          },
          {
            nome: "Manoela Caetano Santos",
            image: "img/doador/18.jpg",
            apoiador: 1,
            doado: 32,
            coracoes: 0,
          },
        ];
      function r() {
        let t = localStorage.getItem("doacao_atual");
        if (t == null || t === "") return 0;
        let i = isNaN(Number(t)) ? brlToFloat(String(t)) : Number(t);
        return isNaN(i) ? 0 : i;
      }
      function c(t) {
        localStorage.setItem("doacao_atual", String(Number(t || 0)));
      }
      function m() {
        let t = localStorage.getItem("coracao_atual"),
          i = Number(t || 0);
        return isNaN(i) ? 0 : i;
      }
      function y(t) {
        localStorage.setItem("coracao_atual", String(parseInt(t, 10) || 0));
      }
      function u(t) {
        return Number(t || 0).toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
      }
      function n() {
        let t = configGlobal?.doacao?.doacao_final;
        return t == null || t === ""
          ? 0
          : typeof t == "number"
          ? t
          : brlToFloat(String(t));
      }
      function p() {
        let t = r(),
          i = m(),
          h = n();
        e.forEach((l) => {
          l && (l.textContent = String(i));
        }),
          o.forEach((l) => {
            l && (l.textContent = u(t));
          });
        let b = ((t / h) * 100).toFixed(2) + "%";
        a.forEach((l) => {
          l.style.width = b;
        });
      }
      p();
      function f() {
        let t = JSON.parse(localStorage.getItem("doadores_usados")) || [],
          i = s
            .map((S, M) => ({ item: S, idx: M }))
            .filter(({ idx: S }) => !t.includes(S));
        if (i.length === 0) return;
        let h = Math.floor(Math.random() * i.length),
          { item: w, idx: b } = i[h];
        t.push(b), localStorage.setItem("doadores_usados", JSON.stringify(t));
        let l = r(),
          g = m(),
          E = Number(l) + Number(w.doado || 0),
          x = (parseInt(g, 10) || 0) + (parseInt(w.coracoes, 10) || 0);
        c(E), y(x), d(h), p();
      }
      function d(t) {
        let i = s[t],
          h = i.nome,
          w = i.image,
          b = i.doado,
          l = document.createElement("div");
        (l.className = "notificacao"),
          (l.innerHTML = `<div class="avatar"><img src="${w}" alt="${h}"></div><div class="content"><h4>${h}</h4><p>Acabou de doar <strong>R$ ${u(
            b
          )}</strong>.</p></div>`),
          document.body.appendChild(l),
          setTimeout(() => {
            let g = l.getBoundingClientRect();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: {
                x: (g.left + g.width / 2) / window.innerWidth,
                y: (g.top + g.height / 2) / window.innerHeight,
              },
            });
          }, 100),
          setTimeout(() => {
            (l.style.transform = "translatey(0)"),
              (l.style.opacity = "0"),
              setTimeout(() => l.remove(), 500);
          }, 6e3);
      }
      setInterval(f, 8e3);
    })();
  });
})();
