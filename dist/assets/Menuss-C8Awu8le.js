import {
  _ as y,
  d as g,
  c as p,
  o as m,
  a as l,
  n as $,
  b as c,
  g as b,
  e as k,
  i as C,
  r as N,
  f as Z,
  h as I,
  N as w,
  s as B,
  j as F,
  k as d,
  B as P,
  l as M,
  m as W,
  u as V,
  p as v,
  I as H,
} from "./index-DbXM9jFE.js";
const O = g({
    name: "IconThumbUpFill",
    props: {
      size: { type: [Number, String] },
      strokeWidth: { type: Number, default: 4 },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (e) => ["butt", "round", "square"].includes(e),
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (e) =>
          ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e),
      },
      rotate: Number,
      spin: Boolean,
    },
    emits: { click: (e) => !0 },
    setup(e, { emit: t }) {
      const o = b("icon"),
        s = k(() => [o, `${o}-thumb-up-fill`, { [`${o}-spin`]: e.spin }]),
        r = k(() => {
          const n = {};
          return (
            e.size && (n.fontSize = C(e.size) ? `${e.size}px` : e.size),
            e.rotate && (n.transform = `rotate(${e.rotate}deg)`),
            n
          );
        });
      return {
        cls: s,
        innerStyle: r,
        onClick: (n) => {
          t("click", n);
        },
      };
    },
  }),
  T = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function x(e, t, o, s, r, a) {
  return (
    m(),
    p(
      "svg",
      {
        viewBox: "0 0 48 48",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        stroke: "currentColor",
        class: c(e.cls),
        style: $(e.innerStyle),
        "stroke-width": e.strokeWidth,
        "stroke-linecap": e.strokeLinecap,
        "stroke-linejoin": e.strokeLinejoin,
        onClick: t[0] || (t[0] = (...n) => e.onClick && e.onClick(...n)),
      },
      t[1] ||
        (t[1] = [
          l(
            "path",
            {
              "fill-rule": "evenodd",
              "clip-rule": "evenodd",
              d: "M5 43V17h4v26H5Z",
              fill: "currentColor",
              stroke: "none",
            },
            null,
            -1,
          ),
          l(
            "path",
            {
              d: "M27.1 4.463a2 2 0 0 0-2.83.364L15.036 17H12v26h23.576a2 2 0 0 0 1.89-1.346l5.697-19.346c.899-2.598-1.03-5.308-3.78-5.308h-10.57l2.422-5.448a4 4 0 0 0-1.184-4.77L27.1 4.462Z",
              fill: "currentColor",
              stroke: "none",
            },
            null,
            -1,
          ),
        ]),
      14,
      T,
    )
  );
}
var S = y(O, [["render", x]]);
const D = Object.assign(S, {
    install: (e, t) => {
      var o;
      const s = (o = t == null ? void 0 : t.iconPrefix) != null ? o : "";
      e.component(s + S.name, S);
    },
  }),
  U = g({
    name: "IconHome",
    props: {
      size: { type: [Number, String] },
      strokeWidth: { type: Number, default: 4 },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (e) => ["butt", "round", "square"].includes(e),
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (e) =>
          ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e),
      },
      rotate: Number,
      spin: Boolean,
    },
    emits: { click: (e) => !0 },
    setup(e, { emit: t }) {
      const o = b("icon"),
        s = k(() => [o, `${o}-home`, { [`${o}-spin`]: e.spin }]),
        r = k(() => {
          const n = {};
          return (
            e.size && (n.fontSize = C(e.size) ? `${e.size}px` : e.size),
            e.rotate && (n.transform = `rotate(${e.rotate}deg)`),
            n
          );
        });
      return {
        cls: s,
        innerStyle: r,
        onClick: (n) => {
          t("click", n);
        },
      };
    },
  }),
  q = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function Q(e, t, o, s, r, a) {
  return (
    m(),
    p(
      "svg",
      {
        viewBox: "0 0 48 48",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        stroke: "currentColor",
        class: c(e.cls),
        style: $(e.innerStyle),
        "stroke-width": e.strokeWidth,
        "stroke-linecap": e.strokeLinecap,
        "stroke-linejoin": e.strokeLinejoin,
        onClick: t[0] || (t[0] = (...n) => e.onClick && e.onClick(...n)),
      },
      t[1] ||
        (t[1] = [
          l("path", { d: "M7 17 24 7l17 10v24H7V17Z" }, null, -1),
          l("path", { d: "M20 28h8v13h-8V28Z" }, null, -1),
        ]),
      14,
      q,
    )
  );
}
var h = y(U, [["render", Q]]);
const A = Object.assign(h, {
    install: (e, t) => {
      var o;
      const s = (o = t == null ? void 0 : t.iconPrefix) != null ? o : "";
      e.component(s + h.name, h);
    },
  }),
  R = g({
    name: "IconSettings",
    props: {
      size: { type: [Number, String] },
      strokeWidth: { type: Number, default: 4 },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (e) => ["butt", "round", "square"].includes(e),
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (e) =>
          ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e),
      },
      rotate: Number,
      spin: Boolean,
    },
    emits: { click: (e) => !0 },
    setup(e, { emit: t }) {
      const o = b("icon"),
        s = k(() => [o, `${o}-settings`, { [`${o}-spin`]: e.spin }]),
        r = k(() => {
          const n = {};
          return (
            e.size && (n.fontSize = C(e.size) ? `${e.size}px` : e.size),
            e.rotate && (n.transform = `rotate(${e.rotate}deg)`),
            n
          );
        });
      return {
        cls: s,
        innerStyle: r,
        onClick: (n) => {
          t("click", n);
        },
      };
    },
  }),
  E = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function _(e, t, o, s, r, a) {
  return (
    m(),
    p(
      "svg",
      {
        viewBox: "0 0 48 48",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        stroke: "currentColor",
        class: c(e.cls),
        style: $(e.innerStyle),
        "stroke-width": e.strokeWidth,
        "stroke-linecap": e.strokeLinecap,
        "stroke-linejoin": e.strokeLinejoin,
        onClick: t[0] || (t[0] = (...n) => e.onClick && e.onClick(...n)),
      },
      t[1] ||
        (t[1] = [
          l(
            "path",
            {
              d: "M18.797 6.732A1 1 0 0 1 19.76 6h8.48a1 1 0 0 1 .964.732l1.285 4.628a1 1 0 0 0 1.213.7l4.651-1.2a1 1 0 0 1 1.116.468l4.24 7.344a1 1 0 0 1-.153 1.2L38.193 23.3a1 1 0 0 0 0 1.402l3.364 3.427a1 1 0 0 1 .153 1.2l-4.24 7.344a1 1 0 0 1-1.116.468l-4.65-1.2a1 1 0 0 0-1.214.7l-1.285 4.628a1 1 0 0 1-.964.732h-8.48a1 1 0 0 1-.963-.732L17.51 36.64a1 1 0 0 0-1.213-.7l-4.65 1.2a1 1 0 0 1-1.116-.468l-4.24-7.344a1 1 0 0 1 .153-1.2L9.809 24.7a1 1 0 0 0 0-1.402l-3.364-3.427a1 1 0 0 1-.153-1.2l4.24-7.344a1 1 0 0 1 1.116-.468l4.65 1.2a1 1 0 0 0 1.213-.7l1.286-4.628Z",
            },
            null,
            -1,
          ),
          l("path", { d: "M30 24a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" }, null, -1),
        ]),
      14,
      E,
    )
  );
}
var z = y(R, [["render", _]]);
const G = Object.assign(z, {
    install: (e, t) => {
      var o;
      const s = (o = t == null ? void 0 : t.iconPrefix) != null ? o : "";
      e.component(s + z.name, z);
    },
  }),
  J = g({
    name: "IconFolderDelete",
    props: {
      size: { type: [Number, String] },
      strokeWidth: { type: Number, default: 4 },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (e) => ["butt", "round", "square"].includes(e),
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (e) =>
          ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e),
      },
      rotate: Number,
      spin: Boolean,
    },
    emits: { click: (e) => !0 },
    setup(e, { emit: t }) {
      const o = b("icon"),
        s = k(() => [o, `${o}-folder-delete`, { [`${o}-spin`]: e.spin }]),
        r = k(() => {
          const n = {};
          return (
            e.size && (n.fontSize = C(e.size) ? `${e.size}px` : e.size),
            e.rotate && (n.transform = `rotate(${e.rotate}deg)`),
            n
          );
        });
      return {
        cls: s,
        innerStyle: r,
        onClick: (n) => {
          t("click", n);
        },
      };
    },
  }),
  K = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function X(e, t, o, s, r, a) {
  return (
    m(),
    p(
      "svg",
      {
        viewBox: "0 0 48 48",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        stroke: "currentColor",
        class: c(e.cls),
        style: $(e.innerStyle),
        "stroke-width": e.strokeWidth,
        "stroke-linecap": e.strokeLinecap,
        "stroke-linejoin": e.strokeLinejoin,
        onClick: t[0] || (t[0] = (...n) => e.onClick && e.onClick(...n)),
      },
      t[1] ||
        (t[1] = [
          l(
            "path",
            {
              d: "M17 26h14M6 13h18l-2.527-3.557a1.077 1.077 0 0 0-.88-.443H7.06C6.474 9 6 9.448 6 10v3Zm0 0h33.882c1.17 0 2.118.895 2.118 2v21c0 1.105-.948 3-2.118 3H8.118C6.948 39 6 38.105 6 37V13Z",
            },
            null,
            -1,
          ),
        ]),
      14,
      K,
    )
  );
}
var L = y(J, [["render", X]]);
const Y = Object.assign(L, {
    install: (e, t) => {
      var o;
      const s = (o = t == null ? void 0 : t.iconPrefix) != null ? o : "";
      e.component(s + L.name, L);
    },
  }),
  ee = g({
    name: "IconPublic",
    props: {
      size: { type: [Number, String] },
      strokeWidth: { type: Number, default: 4 },
      strokeLinecap: {
        type: String,
        default: "butt",
        validator: (e) => ["butt", "round", "square"].includes(e),
      },
      strokeLinejoin: {
        type: String,
        default: "miter",
        validator: (e) =>
          ["arcs", "bevel", "miter", "miter-clip", "round"].includes(e),
      },
      rotate: Number,
      spin: Boolean,
    },
    emits: { click: (e) => !0 },
    setup(e, { emit: t }) {
      const o = b("icon"),
        s = k(() => [o, `${o}-public`, { [`${o}-spin`]: e.spin }]),
        r = k(() => {
          const n = {};
          return (
            e.size && (n.fontSize = C(e.size) ? `${e.size}px` : e.size),
            e.rotate && (n.transform = `rotate(${e.rotate}deg)`),
            n
          );
        });
      return {
        cls: s,
        innerStyle: r,
        onClick: (n) => {
          t("click", n);
        },
      };
    },
  }),
  te = ["stroke-width", "stroke-linecap", "stroke-linejoin"];
function ne(e, t, o, s, r, a) {
  return (
    m(),
    p(
      "svg",
      {
        viewBox: "0 0 48 48",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        stroke: "currentColor",
        class: c(e.cls),
        style: $(e.innerStyle),
        "stroke-width": e.strokeWidth,
        "stroke-linecap": e.strokeLinecap,
        "stroke-linejoin": e.strokeLinejoin,
        onClick: t[0] || (t[0] = (...n) => e.onClick && e.onClick(...n)),
      },
      t[1] ||
        (t[1] = [
          l(
            "path",
            {
              d: "M15 21.5 6.704 19M15 21.5l4.683 5.152a1 1 0 0 1 .25.814L18 40.976l10.918-16.117a1 1 0 0 0-.298-1.409L21.5 19 15 21.5Zm0 0 6.062-6.995a1 1 0 0 0 .138-1.103L18 7.024M42 24c0 9.941-8.059 18-18 18S6 33.941 6 24 14.059 6 24 6s18 8.059 18 18Z",
            },
            null,
            -1,
          ),
        ]),
      14,
      te,
    )
  );
}
var j = y(ee, [["render", ne]]);
const oe = Object.assign(j, {
    install: (e, t) => {
      var o;
      const s = (o = t == null ? void 0 : t.iconPrefix) != null ? o : "";
      e.component(s + j.name, j);
    },
  }),
  ie = { class: "main" },
  se = {
    __name: "CheckUpdate",
    setup(e) {
      const t = window.ipcRenderer,
        o = (u) =>
          d("div", null, [
            d(
              P,
              {
                size: "small",
                onClick: () => {
                  w.remove(u);
                },
              },
              { default: () => [M("取消")] },
            ),
            d(
              P,
              {
                type: "primary",
                size: "small",
                style: "margin-left:10rem",
                onClick: () => {
                  (w.remove(u), n());
                },
              },
              { default: () => [M("后台更新")] },
            ),
          ]),
        s = async () => {
          const u = `${Date.now()}`;
          let i = await I("update-info");
          (console.log("update-info", i),
            w.info({
              id: u,
              title: i.title,
              content: `最新版本 v${i.version}，` + i.update_content,
              footer: o(u),
              style: { marginTop: "50rem" },
              duration: 0,
            }));
        },
        r = N(""),
        a = async () => {
          await B("currentDownloadProgress", Math.round(r.value));
        },
        n = (u) => {
          t.send("downloadUpdate");
        };
      return (
        Z(() => {
          (t.send("check2update"),
            t.on("message", async (u, i) => {
              switch (i.cmd) {
                case "update-available":
                  s();
                  break;
                case "update-not-available":
                  ((await I("manualQuerySatae")) &&
                    w.info({
                      title: "提示",
                      content: "当前已经是最新版本 ~ 😊",
                      duration: 3e3,
                      closable: !0,
                    }),
                    await B("manualQuerySatae", !1));
                  break;
                case "checking-for-update":
                  break;
                case "download-progress":
                  ((r.value = i.message.percent), a());
                  break;
              }
            }));
        }),
        F(() => {
          t.removeAllListeners();
        }),
        (u, i) => (m(), p("div", ie))
      );
    },
  },
  re = W(se, [["__scopeId", "data-v-bf4292a6"]]),
  le = { class: "left-list" },
  ae = g({
    __name: "Menuss",
    emits: ["updateOpacity"],
    setup(e, { emit: t }) {
      let o = t;
      const s = V(),
        r = N("home"),
        a = N(1),
        n = (u) => {
          (console.log(u),
            console.log(s),
            s.push(u),
            (r.value = u),
            u === "yutang" || (a.value = 1),
            o("updateOpacity", a.value));
        };
      return (u, i) => (
        m(),
        p("div", null, [
          l(
            "div",
            { class: "menu-demo", style: $({ opacity: a.value }) },
            [
              l("div", le, [
                l(
                  "div",
                  {
                    onClick: i[0] || (i[0] = (f) => n("home")),
                    class: c({ active: r.value === "home" }),
                  },
                  [
                    d(v(A)),
                    i[6] ||
                      (i[6] = l("span", { class: "title-span" }, "首页", -1)),
                  ],
                  2,
                ),
                l(
                  "div",
                  {
                    onClick: i[1] || (i[1] = (f) => n("shelf")),
                    class: c({ active: r.value === "shelf" }),
                  },
                  [
                    d(v(H)),
                    i[7] ||
                      (i[7] = l(
                        "span",
                        { class: "title-span" },
                        "本地书架",
                        -1,
                      )),
                  ],
                  2,
                ),
                l(
                  "div",
                  {
                    onClick: i[2] || (i[2] = (f) => n("bookSource")),
                    class: c({ active: r.value === "bookSource" }),
                  },
                  [
                    d(v(oe)),
                    i[8] ||
                      (i[8] = l(
                        "span",
                        { class: "title-span" },
                        "在线书源",
                        -1,
                      )),
                  ],
                  2,
                ),
                l(
                  "div",
                  {
                    onClick: i[3] || (i[3] = (f) => n("moyuTools")),
                    class: c({ active: r.value === "moyuTools" }),
                  },
                  [
                    d(v(Y)),
                    i[9] ||
                      (i[9] = l(
                        "span",
                        { class: "title-span" },
                        "摸鱼工具",
                        -1,
                      )),
                  ],
                  2,
                ),
                l(
                  "div",
                  {
                    onClick: i[4] || (i[4] = (f) => n("settings")),
                    class: c({ active: r.value === "settings" }),
                  },
                  [
                    d(v(G)),
                    i[10] ||
                      (i[10] = l("span", { class: "title-span" }, "设置", -1)),
                  ],
                  2,
                ),
                l(
                  "div",
                  {
                    onClick: i[5] || (i[5] = (f) => n("reward")),
                    class: c({ active: r.value === "reward" }),
                  },
                  [
                    d(v(D)),
                    i[11] ||
                      (i[11] = l(
                        "span",
                        { class: "title-span" },
                        "打个赏",
                        -1,
                      )),
                  ],
                  2,
                ),
              ]),
              d(re),
            ],
            4,
          ),
        ])
      );
    },
  }),
  ce = W(ae, [["__scopeId", "data-v-c0a17283"]]);
export { ce as default };
