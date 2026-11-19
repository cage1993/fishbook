"use strict";
const o = require("electron");
o.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...e) {
    const [n, t] = e;
    o.ipcRenderer.on(n, (r, ...a) => t(r, ...a));
  },
  off(...e) {
    const [n, ...t] = e;
    o.ipcRenderer.off(n, ...t);
  },
  send(...e) {
    const [n, ...t] = e;
    o.ipcRenderer.send(n, ...t);
  },
  invoke(...e) {
    return o.ipcRenderer.invoke(...e);
  },
  once(...e) {
    const [n, t] = e;
    o.ipcRenderer.once(n, (r, ...a) => t(r, ...a));
  },
  removeAllListeners(e) {
    o.ipcRenderer.removeAllListeners(e);
  },
});
function s(e = ["complete", "interactive"]) {
  return new Promise((n) => {
    e.includes(document.readyState)
      ? n(!0)
      : document.addEventListener("readystatechange", () => {
          e.includes(document.readyState) && n(!0);
        });
  });
}
const i = {
  append(e, n) {
    if (!Array.from(e.children).find((t) => t === n)) return e.appendChild(n);
  },
  remove(e, n) {
    if (Array.from(e.children).find((t) => t === n)) return e.removeChild(n);
  },
};
function c() {
  const e = "loaders-css__square-spin",
    n = `
@keyframes square-spin {
  25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
  50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
  75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
  100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${e} > div {
  animation-fill-mode: both;
  width: 50px;
  height: 50px;
  background: #fff;
  animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282c34;
  z-index: 9;
}
    `,
    t = document.createElement("style"),
    r = document.createElement("div");
  return (
    (t.id = "app-loading-style"),
    (t.innerHTML = n),
    (r.className = "app-loading-wrap"),
    (r.innerHTML = `<div class="${e}"><div></div></div>`),
    {
      appendLoading() {
        (i.append(document.head, t), i.append(document.body, r));
      },
      removeLoading() {
        (i.remove(document.head, t), i.remove(document.body, r));
      },
    }
  );
}
const { appendLoading: p, removeLoading: d } = c();
s().then(p);
window.onmessage = (e) => {
  e.data.payload === "removeLoading" && d();
};
setTimeout(d, 4999);
