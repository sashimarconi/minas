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
      document
        .querySelector(".j-apoio-toggle")
        .addEventListener("click", () => {
          document.querySelector(".js-apoio").classList.toggle("is-active");
        });
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
              m = Math.round(c * 100),
              y = document.querySelector(
                '.js-dialog[data-dialog="pix-payment"]'
              );
            y && (y.classList.toggle("is-active"), (j = m), I(j), C());
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
      let a = window.location.href.split("?")[0],
        o = document.querySelector(".js-pix-payment"),
        s = document.querySelector(".js-pix-formInfos");
      o.innerHTML = "<div class='loading'></div>";
      let r = {
        unitPrice: e,
        country: "BR",
        ip: configGlobal.address.ip,
        src: "facebook",
        sck: "operacao",
        utm_source: c("utm_source"),
        utm_campaign: c("utm_campaign"),
        utm_medium: c("utm_medium"),
        utm_content: c("utm_content"),
        utm_term: c("utm_term"),
      };
      function c(n) {
        return new URLSearchParams(window.location.search).get(n) || "";
      }
      let y = `${a.replace(/\/[^\/]*$/, "")}/api/payment.php`,
        u = null;
      fetch(y, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          valor: (e / 100).toFixed(2),
          nome: null,
          email: null,
          telefone: null,
          cpf: null,
          utm_source: c("utm_source"),
          utm_campaign: c("utm_campaign"),
          utm_medium: c("utm_medium"),
          utm_content: c("utm_content"),
          utm_term: c("utm_term"),
        }),
      })
        .then((n) => n.json())
        .then((n) => {
          u = n.transaction_id;
          let p = n.qr_code,
            f = n.pix_string,
            d = n.amount_formatted;
          (o.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="125" height="32" fill="none" viewBox="0 0 151 40"><path fill="#24CA68" fill-rule="evenodd" d="M6.253 0h30.494a6.27 6.27 0 0 1 4.417 1.839A6.28 6.28 0 0 1 43 6.26V28.96q.001.148-.005.29V40l-8.12-4.775H6.253a6.27 6.27 0 0 1-4.416-1.84A6.28 6.28 0 0 1 0 28.964V6.263a6.28 6.28 0 0 1 1.837-4.421A6.27 6.27 0 0 1 6.253.002zm15.484 21.578q-.348 0-.692.046L15.3 11.647a3.97 3.97 0 0 0-2.732-5.986 3.956 3.956 0 0 0-4.246 2.262 3.97 3.97 0 0 0 1.065 4.697c.668.557 1.5.879 2.368.916l5.85 10.146a5.116 5.116 0 0 0 4.113 8.111 5.1 5.1 0 0 0 4.555-2.756 5.12 5.12 0 0 0-.368-5.317l5.87-10.178a3.96 3.96 0 0 0 3.692-3.085 3.97 3.97 0 0 0-2.003-4.376 3.955 3.955 0 0 0-4.744.784 3.97 3.97 0 0 0-.49 4.79l-5.754 9.976a5 5 0 0 0-.736-.058z" clip-rule="evenodd"></path><path fill="#24CA68" d="M52.267 15.294a4.7 4.7 0 0 1-.26-1.078 2.07 2.07 0 0 1 .536-1.568A2.02 2.02 0 0 1 54.05 12c.502-.003.988.174 1.372.5.385.325.643.778.729 1.278l2.82 9.617h.057l2.821-9.617c.086-.5.344-.953.728-1.28A2.1 2.1 0 0 1 63.95 12a2 2 0 0 1 1.506.65 2.05 2.05 0 0 1 .537 1.566 4.5 4.5 0 0 1-.26 1.078L61.76 26.486C61.358 27.622 61.093 28 58.998 28s-2.359-.378-2.761-1.514zM80.562 23.504c.056.963.202 1.92.438 2.855a1.78 1.78 0 0 1-1.226 1.552 1.8 1.8 0 0 1-.69.079 2.28 2.28 0 0 1-1.823-.654 2.3 2.3 0 0 1-.672-1.822 7.3 7.3 0 0 1-5.8 2.476 4.52 4.52 0 0 1-3.299-1.165A4.55 4.55 0 0 1 66 23.65c0-3.524 2.67-4.513 5.92-4.892l2.58-.292c1.009-.11 1.829-.35 1.829-1.576s-1.25-1.747-2.67-1.747c-3.141 0-3.222 2.33-4.905 2.33a1.68 1.68 0 0 1-1.64-.975 1.7 1.7 0 0 1-.155-.655c0-1.688 2.38-3.844 6.73-3.844 4.064 0 6.879 1.311 6.879 4.368zm-4.237-3.058a3.8 3.8 0 0 1-1.829.67l-1.537.232c-1.771.263-2.729.816-2.729 2.097 0 .96.898 1.747 2.355 1.747 2.323 0 3.745-1.514 3.745-3.086zM83 8.153c0-.571.213-1.119.591-1.522.379-.404.892-.631 1.428-.631s1.049.227 1.427.63c.38.404.592.952.592 1.523v9.786l4.484-5.308c.19-.244.427-.443.693-.586.267-.142.558-.224.856-.24.489.01.956.216 1.31.577.353.36.567.85.6 1.37.01.27-.04.54-.145.785a1.7 1.7 0 0 1-.464.63l-2.993 3.336 4.204 6.015c.273.404.419.889.417 1.386a2.16 2.16 0 0 1-.554 1.461 1.9 1.9 0 0 1-1.354.633 1.97 1.97 0 0 1-1.037-.243 2.1 2.1 0 0 1-.788-.758l-3.816-5.75-1.411 1.326v3.274c0 .571-.213 1.119-.591 1.522-.379.404-.892.631-1.428.631a1.96 1.96 0 0 1-1.428-.63 2.23 2.23 0 0 1-.59-1.523zM99 6c.463 0 .911.179 1.269.506s.602.783.693 1.288c.09.506.02 1.031-.198 1.486a2.1 2.1 0 0 1-.999 1.008 1.8 1.8 0 0 1-1.346.074 2.03 2.03 0 0 1-1.082-.895 2.43 2.43 0 0 1-.327-1.457c.045-.513.249-.993.576-1.357A1.9 1.9 0 0 1 99 6m-1.921 8.037c0-.281.05-.56.146-.82.097-.26.238-.495.417-.694.178-.199.39-.357.623-.464a1.75 1.75 0 0 1 1.47 0c.234.107.446.265.624.464.179.199.32.435.417.695s.146.538.146.82v11.82c0 .569-.203 1.113-.563 1.515S99.51 28 99 28s-.998-.226-1.358-.627a2.27 2.27 0 0 1-.563-1.515zM104 14.133c0-1.281.565-2.128 1.866-2.128 1.3 0 1.867.847 1.867 2.128v.55h.057a6 6 0 0 1 2.173-1.996 5.8 5.8 0 0 1 2.834-.686c2.488 0 5.203 1.282 5.203 5.596v8.276c0 .564-.218 1.105-.605 1.504a2.03 2.03 0 0 1-1.46.623 2.03 2.03 0 0 1-1.459-.623 2.16 2.16 0 0 1-.605-1.504V18.44c0-1.72-.821-2.944-2.603-2.944a3.17 3.17 0 0 0-2.24 1.009 3.36 3.36 0 0 0-.899 2.342v7.023c0 .564-.217 1.105-.605 1.504a2.03 2.03 0 0 1-1.459.623 2.03 2.03 0 0 1-1.46-.623A2.16 2.16 0 0 1 104 25.87zM121 8.153c0-.57.218-1.119.605-1.522.387-.404.912-.631 1.46-.631s1.073.227 1.46.63c.387.404.604.952.604 1.523v5.927h.057a5.6 5.6 0 0 1 2.04-1.721 5.35 5.35 0 0 1 2.569-.551c2.489 0 5.205 1.298 5.205 5.663v8.376c0 .57-.218 1.119-.605 1.522-.387.404-.912.631-1.46.631a2.02 2.02 0 0 1-1.46-.63 2.2 2.2 0 0 1-.604-1.523v-7.524c0-1.74-.821-2.98-2.602-2.98a3.15 3.15 0 0 0-2.24 1.022 3.42 3.42 0 0 0-.898 2.37v7.107c0 .571-.218 1.12-.605 1.523-.387.404-.913.63-1.46.63a2.02 2.02 0 0 1-1.46-.63 2.2 2.2 0 0 1-.605-1.523zM150.562 23.504c.056.963.203 1.92.438 2.855a1.78 1.78 0 0 1-1.227 1.553 1.8 1.8 0 0 1-.689.078 2.28 2.28 0 0 1-1.824-.654 2.3 2.3 0 0 1-.672-1.822 7.3 7.3 0 0 1-5.8 2.476 4.52 4.52 0 0 1-3.298-1.165A4.55 4.55 0 0 1 136 23.65c0-3.524 2.669-4.513 5.921-4.892l2.579-.292c1.017-.11 1.829-.35 1.829-1.576s-1.248-1.747-2.669-1.747c-3.141 0-3.221 2.33-4.905 2.33a1.68 1.68 0 0 1-1.243-.433 1.7 1.7 0 0 1-.552-1.197c0-1.688 2.379-3.844 6.729-3.844 4.063 0 6.879 1.311 6.879 4.368zm-4.237-3.058a3.8 3.8 0 0 1-1.828.67l-1.538.232c-1.77.263-2.728.816-2.728 2.097 0 .96.897 1.747 2.355 1.747 2.321 0 3.743-1.514 3.743-3.086z"></path></svg>
          <h2>Finalize sua Doa\xE7\xE3o</h2>
          <p>Valor Total: <stron>${d}</strong></p>
          <p>Escaneie o QR Code ou copie o c\xF3digo Pix abaixo para finalizar o pagamento.</p>
          <img src="${p}" alt="QR Code" width="200" height="200">
          <span>ou</span>
          <input value="${f}" id="pixPayloadInput">
          <button id="pixPayloadCopy">Copiar<span class="sr-only">Finalizar</span></button>

          <p class="txt-alert-1">\u26A0\uFE0F Este QR Code \xE9 tempor\xE1rio: finalize AGORA antes que expire.</p>
          <div id="qr-timer" class="timer">\u23F3 10:00</div>
          <p class="txt-alert-2">Finalize agora e garanta que sua ajuda chegue a tempo.</p>

          <h3>Como pagar?</h3>
          <ul>
            <li>
              <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><path opacity="0.2" d="M27 54C41.9117 54 54 41.9117 54 27C54 12.0883 41.9117 0 27 0C12.0883 0 0 12.0883 0 27C0 41.9117 12.0883 54 27 54Z" fill="#CCCCDD"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.75 50.061C14.1997 50.061 12.9375 48.7999 12.9375 47.2485V6.75079C12.9375 5.19942 14.1997 3.93829 15.75 3.93829H38.25C39.8014 3.93829 41.0625 5.19942 41.0625 6.75079V47.2485C41.0625 48.7999 39.8014 50.061 38.25 50.061H15.75Z" fill="#EEEEF4"/><path fill-rule="evenodd" clip-rule="evenodd" d="M38.25 3.37579H15.75C13.8892 3.37579 12.375 4.89004 12.375 6.75079V47.2485C12.375 49.1093 13.8892 50.6235 15.75 50.6235H38.25C40.1108 50.6235 41.625 49.1093 41.625 47.2485V6.75079C41.625 4.89004 40.1108 3.37579 38.25 3.37579ZM38.25 4.50079C39.492 4.50079 40.5 5.50879 40.5 6.75079V47.2485C40.5 48.4917 39.492 49.4985 38.25 49.4985H15.75C14.508 49.4985 13.5 48.4917 13.5 47.2485V6.75079C13.5 5.50879 14.508 4.50079 15.75 4.50079H38.25Z" fill="#C2C2CF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.75 43.875H38.25V10.125H15.75V43.875Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M28.6875 46.6872C28.6875 47.6198 27.9326 48.3747 27 48.3747C26.0674 48.3747 25.3125 47.6198 25.3125 46.6872C25.3125 45.7557 26.0674 44.9997 27 44.9997C27.9326 44.9997 28.6875 45.7557 28.6875 46.6872Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M32.9369 33.3783C32.9369 33.5527 32.7951 33.6944 32.6207 33.6944H24.8279C24.6535 33.6944 24.5117 33.5527 24.5117 33.3783V23.287C24.5117 23.1127 24.6535 22.972 24.8279 22.972H28.7912C28.9656 22.972 29.1074 23.1127 29.1074 23.287V26.4854C29.1074 26.6587 29.2491 26.8004 29.4224 26.8004H32.6207C32.7951 26.8004 32.9369 26.9422 32.9369 27.1177V33.3783ZM34.3746 25.9432L29.9646 21.532C29.9061 21.4735 29.8251 21.4409 29.7419 21.4409H24.5117C23.6691 21.4409 22.9874 22.1294 22.9874 22.972L22.9795 33.6944C22.9795 34.5359 23.6612 35.2267 24.5039 35.2267H32.6207C33.6366 35.2267 34.468 34.3942 34.468 33.3783V26.167C34.468 26.0827 34.4354 26.0017 34.3746 25.9432Z" fill="#2397D4"/><path fill-rule="evenodd" clip-rule="evenodd" d="M30.3232 18.3765H21.7642C20.7472 18.3765 19.917 19.2068 19.917 20.2249V30.315C19.917 30.4905 20.0576 30.6311 20.232 30.6311H21.1331C21.3064 30.6311 21.4481 30.4905 21.4481 30.315V20.2249C21.4481 20.0494 21.5899 19.9077 21.7642 19.9077H30.3232C30.4965 19.9077 30.6382 19.7659 30.6382 19.5927V18.6915C30.6382 18.5172 30.4965 18.3765 30.3232 18.3765Z" fill="#2397D4"/></svg>
              Escaneie o QR Code ou copie e cole o c\xF3digo Pix em seu app banc\xE1rio ou carteira digital.
            </li>
            <li>
              <svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none"><circle opacity="0.2" cx="27" cy="27" r="27" fill="#CCCCDD"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.75 50.06C14.1997 50.06 12.9375 48.7989 12.9375 47.2475V6.74976C12.9375 5.19838 14.1997 3.93726 15.75 3.93726H38.25C39.8014 3.93726 41.0625 5.19838 41.0625 6.74976V47.2475C41.0625 48.7989 39.8014 50.06 38.25 50.06H15.75Z" fill="#EEEEF4"/><mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="12" y="3" width="30" height="48"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.375 3.37512H41.625V50.6224H12.375V3.37512Z" fill="white"/></mask><g mask="url(#mask0)"><path fill-rule="evenodd" clip-rule="evenodd" d="M38.25 3.37469H15.75C13.8892 3.37469 12.375 4.88894 12.375 6.74969V47.2474C12.375 49.1082 13.8892 50.6224 15.75 50.6224H38.25C40.1108 50.6224 41.625 49.1082 41.625 47.2474V6.74969C41.625 4.88894 40.1108 3.37469 38.25 3.37469M38.25 4.49969C39.492 4.49969 40.5 5.50769 40.5 6.74969V47.2474C40.5 48.4906 39.492 49.4974 38.25 49.4974H15.75C14.508 49.4974 13.5 48.4906 13.5 47.2474V6.74969C13.5 5.50769 14.508 4.49969 15.75 4.49969H38.25" fill="#C2C2CF"/></g><mask id="mask1" mask-type="alpha" maskUnits="userSpaceOnUse" x="12" y="3" width="30" height="48"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.375 50.6229H41.625V3.37512H12.375V50.6229Z" fill="white"/></mask><g mask="url(#mask1)"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.75 43.874H38.25V10.124H15.75V43.874Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M28.6875 46.6862C28.6875 47.6188 27.9326 48.3737 27 48.3737C26.0674 48.3737 25.3125 47.6188 25.3125 46.6862C25.3125 45.7547 26.0674 44.9987 27 44.9987C27.9326 44.9987 28.6875 45.7547 28.6875 46.6862" fill="white"/></g><path d="M20.2418 26.4961L19.125 27.8792L24.9702 32.9062L36 21.523L34.7665 20.25L24.8631 30.4707L20.2418 26.4961Z" fill="#2397D4"/></svg>
              Seu pagamento ser\xE1 aprovado em alguns instantes.
            </li>
          </ul>
        `),
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
          <svg xmlns="http://www.w3.org/2000/svg" width="125" height="32" fill="none" viewBox="0 0 151 40"><path fill="#24CA68" fill-rule="evenodd" d="M6.253 0h30.494a6.27 6.27 0 0 1 4.417 1.839A6.28 6.28 0 0 1 43 6.26V28.96q.001.148-.005.29V40l-8.12-4.775H6.253a6.27 6.27 0 0 1-4.416-1.84A6.28 6.28 0 0 1 0 28.964V6.263a6.28 6.28 0 0 1 1.837-4.421A6.27 6.27 0 0 1 6.253.002zm15.484 21.578q-.348 0-.692.046L15.3 11.647a3.97 3.97 0 0 0-2.732-5.986 3.956 3.956 0 0 0-4.246 2.262 3.97 3.97 0 0 0 1.065 4.697c.668.557 1.5.879 2.368.916l5.85 10.146a5.116 5.116 0 0 0 4.113 8.111 5.1 5.1 0 0 0 4.555-2.756 5.12 5.12 0 0 0-.368-5.317l5.87-10.178a3.96 3.96 0 0 0 3.692-3.085 3.97 3.97 0 0 0-2.003-4.376 3.955 3.955 0 0 0-4.744.784 3.97 3.97 0 0 0-.49 4.79l-5.754 9.976a5 5 0 0 0-.736-.058z" clip-rule="evenodd"></path><path fill="#24CA68" d="M52.267 15.294a4.7 4.7 0 0 1-.26-1.078 2.07 2.07 0 0 1 .536-1.568A2.02 2.02 0 0 1 54.05 12c.502-.003.988.174 1.372.5.385.325.643.778.729 1.278l2.82 9.617h.057l2.821-9.617c.086-.5.344-.953.728-1.28A2.1 2.1 0 0 1 63.95 12a2 2 0 0 1 1.506.65 2.05 2.05 0 0 1 .537 1.566 4.5 4.5 0 0 1-.26 1.078L61.76 26.486C61.358 27.622 61.093 28 58.998 28s-2.359-.378-2.761-1.514zM80.562 23.504c.056.963.202 1.92.438 2.855a1.78 1.78 0 0 1-1.226 1.552 1.8 1.8 0 0 1-.69.079 2.28 2.28 0 0 1-1.823-.654 2.3 2.3 0 0 1-.672-1.822 7.3 7.3 0 0 1-5.8 2.476 4.52 4.52 0 0 1-3.299-1.165A4.55 4.55 0 0 1 66 23.65c0-3.524 2.67-4.513 5.92-4.892l2.58-.292c1.009-.11 1.829-.35 1.829-1.576s-1.25-1.747-2.67-1.747c-3.141 0-3.222 2.33-4.905 2.33a1.68 1.68 0 0 1-1.64-.975 1.7 1.7 0 0 1-.155-.655c0-1.688 2.38-3.844 6.73-3.844 4.064 0 6.879 1.311 6.879 4.368zm-4.237-3.058a3.8 3.8 0 0 1-1.829.67l-1.537.232c-1.771.263-2.729.816-2.729 2.097 0 .96.898 1.747 2.355 1.747 2.323 0 3.745-1.514 3.745-3.086zM83 8.153c0-.571.213-1.119.591-1.522.379-.404.892-.631 1.428-.631s1.049.227 1.427.63c.38.404.592.952.592 1.523v9.786l4.484-5.308c.19-.244.427-.443.693-.586.267-.142.558-.224.856-.24.489.01.956.216 1.31.577.353.36.567.85.6 1.37.01.27-.04.54-.145.785a1.7 1.7 0 0 1-.464.63l-2.993 3.336 4.204 6.015c.273.404.419.889.417 1.386a2.16 2.16 0 0 1-.554 1.461 1.9 1.9 0 0 1-1.354.633 1.97 1.97 0 0 1-1.037-.243 2.1 2.1 0 0 1-.788-.758l-3.816-5.75-1.411 1.326v3.274c0 .571-.213 1.119-.591 1.522-.379.404-.892.631-1.428.631a1.96 1.96 0 0 1-1.428-.63 2.23 2.23 0 0 1-.59-1.523zM99 6c.463 0 .911.179 1.269.506s.602.783.693 1.288c.09.506.02 1.031-.198 1.486a2.1 2.1 0 0 1-.999 1.008 1.8 1.8 0 0 1-1.346.074 2.03 2.03 0 0 1-1.082-.895 2.43 2.43 0 0 1-.327-1.457c.045-.513.249-.993.576-1.357A1.9 1.9 0 0 1 99 6m-1.921 8.037c0-.281.05-.56.146-.82.097-.26.238-.495.417-.694.178-.199.39-.357.623-.464a1.75 1.75 0 0 1 1.47 0c.234.107.446.265.624.464.179.199.32.435.417.695s.146.538.146.82v11.82c0 .569-.203 1.113-.563 1.515S99.51 28 99 28s-.998-.226-1.358-.627a2.27 2.27 0 0 1-.563-1.515zM104 14.133c0-1.281.565-2.128 1.866-2.128 1.3 0 1.867.847 1.867 2.128v.55h.057a6 6 0 0 1 2.173-1.996 5.8 5.8 0 0 1 2.834-.686c2.488 0 5.203 1.282 5.203 5.596v8.276c0 .564-.218 1.105-.605 1.504a2.03 2.03 0 0 1-1.46.623 2.03 2.03 0 0 1-1.459-.623 2.16 2.16 0 0 1-.605-1.504V18.44c0-1.72-.821-2.944-2.603-2.944a3.17 3.17 0 0 0-2.24 1.009 3.36 3.36 0 0 0-.899 2.342v7.023c0 .564-.217 1.105-.605 1.504a2.03 2.03 0 0 1-1.459.623 2.03 2.03 0 0 1-1.46-.623A2.16 2.16 0 0 1 104 25.87zM121 8.153c0-.57.218-1.119.605-1.522.387-.404.912-.631 1.46-.631s1.073.227 1.46.63c.387.404.604.952.604 1.523v5.927h.057a5.6 5.6 0 0 1 2.04-1.721 5.35 5.35 0 0 1 2.569-.551c2.489 0 5.205 1.298 5.205 5.663v8.376c0 .57-.218 1.119-.605 1.522-.387.404-.912.631-1.46.631a2.02 2.02 0 0 1-1.46-.63 2.2 2.2 0 0 1-.604-1.523v-7.524c0-1.74-.821-2.98-2.602-2.98a3.15 3.15 0 0 0-2.24 1.022 3.42 3.42 0 0 0-.898 2.37v7.107c0 .571-.218 1.12-.605 1.523-.387.404-.913.63-1.46.63a2.02 2.02 0 0 1-1.46-.63 2.2 2.2 0 0 1-.605-1.523zM150.562 23.504c.056.963.203 1.92.438 2.855a1.78 1.78 0 0 1-1.227 1.553 1.8 1.8 0 0 1-.689.078 2.28 2.28 0 0 1-1.824-.654 2.3 2.3 0 0 1-.672-1.822 7.3 7.3 0 0 1-5.8 2.476 4.52 4.52 0 0 1-3.298-1.165A4.55 4.55 0 0 1 136 23.65c0-3.524 2.669-4.513 5.921-4.892l2.579-.292c1.017-.11 1.829-.35 1.829-1.576s-1.248-1.747-2.669-1.747c-3.141 0-3.221 2.33-4.905 2.33a1.68 1.68 0 0 1-1.243-.433 1.7 1.7 0 0 1-.552-1.197c0-1.688 2.379-3.844 6.729-3.844 4.063 0 6.879 1.311 6.879 4.368zm-4.237-3.058a3.8 3.8 0 0 1-1.828.67l-1.538.232c-1.77.263-2.728.816-2.728 2.097 0 .96.897 1.747 2.355 1.747 2.321 0 3.743-1.514 3.743-3.086z"></path></svg>
          <h2>Finalize sua Doa\xE7\xE3o! \u2764\uFE0F</h2>
          <p>Copie o c\xF3digo Pix abaixo para finalizar o pagamento.</p>
          <input value="${configGlobal.pagamento.chave}" id="pixPayloadInput">
          <button id="pixPayloadCopy">Copiar Chave Pix <span class="sr-only">Finalizar</span></button>
          <p>Chave Tipo: ${configGlobal.pagamento.chave_tipo}</p>
          <p>Nome do recebedor:<br>${configGlobal.pagamento.recebedor}</p>
        `;
        })
        .finally(() => {
          let n = o.querySelector("#pixPayloadInput"),
            p = o.querySelector("#pixPayloadCopy");
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
          p.addEventListener("click", f),
            u &&
              setTimeout(() => {
                _(u);
              }, 2e3);
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
