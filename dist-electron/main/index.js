var _n = Object.defineProperty;
var In = (e, t, n) =>
  t in e
    ? _n(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n })
    : (e[t] = n);
var Te = (e, t, n) => In(e, typeof t != "symbol" ? t + "" : t, n);
import {
  ipcMain as w,
  app as v,
  shell as et,
  globalShortcut as fe,
  BrowserWindow as K,
  screen as On,
  Tray as Dn,
  Menu as Tn,
} from "electron";
import Ln from "electron-updater";
import { fileURLToPath as lt } from "node:url";
import { release as Rn } from "node:os";
import { dirname as ut, join as G } from "node:path";
import Pe from "axios";
import Nn from "electron-store";
import * as bt from "fs";
import ie from "fs";
import * as Un from "path";
import C from "path";
import Mn from "jschardet";
import Wn from "iconv-lite";
import Bn from "epub";
import { createRequire as jn } from "module";
import An from "font-list";
import { spawn as Vn, exec as tt } from "child_process";
import ge from "winston";
import zn from "constants";
import qn from "stream";
import Jn from "util";
import Hn from "assert";
import { randomBytes as Yn } from "crypto";
if (!v.isPackaged) {
  v.setPath("userData", C.join(v.getPath("appData"), "fish-book-source-dev"));
}
const ve = Boolean(process.env.VITE_DEV_SERVER_URL),
  { autoUpdater: H } = Ln;
H.autoDownload = !1;
class Gn {
  // 添加更新状态标志
  constructor(t) {
    Te(this, "mainWindow");
    Te(this, "url");
    Te(this, "isUpdating");
    ((this.mainWindow = t),
      (this.isUpdating = !1),
      H.on("error", (n) => {
        (this.sendUpdateMessage({
          cmd: "error",
          message: n,
        }),
          (this.isUpdating = !1));
      }),
      H.on("checking-for-update", (n) => {
        this.sendUpdateMessage({
          cmd: "checking-for-update",
          message: n,
        });
      }),
      H.on("update-available", (n) => {
        (console.log("发现可更新软件"),
          this.sendUpdateMessage({
            cmd: "update-available",
            message: n,
          }));
      }),
      H.on("update-not-available", (n) => {
        (this.sendUpdateMessage({
          cmd: "update-not-available",
          message: n,
        }),
          (this.isUpdating = !1));
      }),
      H.on("download-progress", (n) => {
        this.sendUpdateMessage({
          cmd: "download-progress",
          message: n,
        });
      }),
      H.on("update-downloaded", (n, r, o, i, s) => {
        (console.log(n),
          this.sendUpdateMessage({
            cmd: "update-downloaded",
            message: {
              releaseNotes: r,
              releaseName: o,
              releaseDate: i,
              updateUrl: s,
            },
          }),
          H.quitAndInstall());
      }),
      w.on("downloadUpdate", () => {
        (this.isUpdating
          ? console.log("Update is already in progress, skipping check.")
          : (console.log("开始下载更新包了======"), H.downloadUpdate()),
          (this.isUpdating = !0));
      }));
  }
  /**
   * @author viga
   * 设置版本包地址
   */
  setUpdateUrl() {
    H.setFeedURL(this.url);
  }
  /**
   * @author viga
   * 主进程向渲染发送信息
   * @text 需要传送的信息，这里是放置对应的回调信息
   */
  sendUpdateMessage(t) {
    this.mainWindow.webContents.send("message", t);
  }
  /**
   * @author viga
   * 检查更新
   */
  checkForUpdates(t) {
    ((this.url = t), this.setUpdateUrl(), H.checkForUpdates());
  }
}
const Kn = {
    // 小说每页字数
    wordsPerPage: 40,
    // 小说字体颜色
    textColor: "#ffffff",
    // 小说背景颜色
    textBgColor: "#000000",
    // 窗口透明度
    bgOpacity: 0.7,
    // 阅读器背景色透明度
    bgColorOpacity: 0.4,
    // 是否允许调整窗口宽高
    resizable: !0,
    // 小说字体大小
    fontSize: 16,
    // 小说字间距
    letterSpacing: 0,
    // 小说行距
    lineHeight: 40,
    // 是否显示进度条
    progressVisible: !0,
    // 进度条显示位置 - true 右，false 左
    progressPosition: !0,
    // 滚轮翻页
    scrollWheelPageLockOfMini: !1,
    // 窗口位置和大小
    windowBounds: { width: 800, height: 40, x: 0, y: 0 },
    // 是否记住上次窗口大小
    rememberWindowSize: !0,
    // 字体样式
    fontFamilyOfMini: "微软雅黑",
    // 自动翻页状态，软件重启需要恢复到 false
    autoPage: !1,
    // 自动翻页时间间隔（秒）
    autoPageInterval: 5,
    // 保留小说格式
    novelFormat: !1,
  },
  qt = {
    // 上一页
    key1: "alt + z",
    // 下一页
    key2: "alt + c",
    // 阅读器显隐切换
    key3: "alt + v",
  },
  Qn = {
    // 当前是否打开了沉浸阅读器
    immersedReadWindowVisible: !1,
    // 小说每页字数
    wordsPerPageOfImmersed: 300,
    // 字体大小
    fontSizeOfImmersed: 24,
    // 字体样式
    fontFamily: "楷体",
    // 字体颜色
    colorOfImmersed: "#628393",
    // 背景颜色
    bgColorOfImmersed: "#1C1C1D",
    // 字体颜色锁定
    colorOfImmersedLock: !1,
    // 背景颜色锁定
    bgColorOfImmersedLock: !1,
    // 滚轮翻页
    scrollWheelPageLock: !1,
    // 行间距
    lineHeightOfImmersed: 54,
    // 字体间距
    letterSpacingOfImmersed: 0,
  },
  Xn = {
    bookSourceList: [],
    currentBookSource: [],
  },
  Zn = {
    starBookList: [],
    currentBookOnline: {},
    bookContentCaches: "",
    socketUrl: "",
  },
  er = {
    userInfo: {},
  },
  $e = {
    // 主题 dark || white
    theme: "dark",
    // 书架显示类型
    shelfViewType: "text",
    // 是否开启开机自启动
    autoStart: !1,
    // 存储小说列表、书名、阅读进度等信息
    booksInfo: [
      {
        bookName: "说明文档.txt",
        bookProgress: 0,
        start: 0,
        // 当前小说显示文本
        content: "欢迎使用fish-book！",
        // 总字数
        total: -1,
        sortIndex: -1,
        star: !1,
      },
    ],
    // 上次阅读开始时间
    time: "",
    // 当前在阅读的小说名
    currentBookName: "说明文档.txt",
    // 当前小说进度
    currentBookProgress: 0,
    // 当前小说显示文本
    currentBookContent: "",
    // 小说当前阅读字数
    start: 0,
    // 阅读器相关设置
    ...Kn,
    // 快捷键相关设置
    ...qt,
    // 沉浸阅读器配置
    ...Qn,
    // 用户信息
    ...er,
    // 当前版本
    version: "1.3.0",
    // 下载进度
    currentDownloadProgress: 0,
    // 用户Id
    uniqueId: "",
    ...Xn,
    ...Zn,
    readMode: "",
  },
  g = new Nn({
    name: "sysConfig",
    defaults: $e,
  }),
  tr = v.isPackaged,
  Et = C.dirname(v.getPath("exe"));
let nt, Ie;
if (tr) {
  nt =
    process.platform === "darwin"
      ? C.join(process.resourcesPath, "..", "books")
      : C.join(Et, "books");
} else {
  const e = v.getAppPath();
  nt = C.resolve(e, "books");
}
Ie = C.join(v.getPath("userData"), "books");
g.set("books_folder_path", Ie);
console.log(Ie);
const nr = async (e) => {
    try {
      const t = await rr(e),
        n = await or(t),
        r = await sr(t);
      return { cover: n, content: r };
    } catch (t) {
      throw (console.error("Error processing EPUB file:", t), t);
    }
  },
  rr = (e) =>
    new Promise((t, n) => {
      const r = new Bn(e);
      (r.on("error", (o) => n(o)), r.on("end", () => t(r)), r.parse());
    }),
  or = async (e) => {
    if (e.metadata && e.metadata.cover)
      try {
        const t = await ir(e.metadata.cover, e);
        return `data:${t.mimeType};base64,${t.buffer.toString("base64")}`;
      } catch (t) {
        return (console.error("Error fetching cover image:", t), null);
      }
    return null;
  },
  ir = (e, t) =>
    new Promise((n, r) => {
      t.getImage(e, (o, i, s) => {
        if (o) return r(o);
        n({ buffer: i, mimeType: s });
      });
    }),
  sr = async (e) => {
    let t = "";
    if (e.flow && e.flow.length > 0)
      for (const n of e.flow)
        try {
          const r = await ar(n.id, e);
          ((t += `${n.title || ""}

`),
            (t += `${r.replace(/<\/?.+?>/g, "")}

`));
        } catch (r) {
          console.error(`Error fetching chapter ${n.id}:`, r);
        }
    else throw new Error("Failed to parse EPUB content");
    return t;
  },
  ar = (e, t) =>
    new Promise((n, r) => {
      t.getChapter(e, (o, i) => {
        if (o) return r(o);
        n(i);
      });
    }),
  cr = jn(import.meta.url),
  lr = cr("js-mobi/dist/Mobi"),
  ur = async (e) => {
    try {
      let t = Uint8Array.from(e);
      return {
        content: lr.default
          .read(t)
          .getTextContent()
          .replace(/<\/?[^>]+(>|$)/g, ""),
      };
    } catch (t) {
      return {
        content: "[mobi] 此文件可能损坏，解析失败。 => " + t,
        code: -1,
      };
    }
  };
let rt;
const fr = (e) => {
    rt = e;
  },
  dr = (e, t) => {
    rt
      ? rt.webContents.send("display-notification", { type: e, content: t })
      : console.error("Main window is not set.");
  },
  Jt = async (e, t, n, r) => {
    let o = await Oe(t);
    if (o)
      return o.code === -1
        ? o
        : {
            content: o.content.substr(n, r),
            total: o.content.length,
            code: 200,
          };
  };
let We = {};
try {
  (w.handle("read-file", Jt),
    w.handle("read-file-total-words", async (e, t) => {
      let n = 0,
        r = await Oe(t);
      if (r) return ((n = r.content.length), n);
    }),
    w.handle("open-books-folder", async (e) => {
      const t = C.join(v.getPath("userData"), "books");
      try {
        et.openPath(t);
      } catch (n) {
        return (console.error(n), null);
      }
    }),
    w.handle("update-books-cache", async (e) => {
      We = {};
    }),
    w.handle("notify-renderer", (e, { type: t, content: n }) => ({
      type: t,
      content: n,
    })));
} catch (e) {
  throw new Error(e);
}
const Oe = async (e) => {
    const t = C.join(Ie, e);
    try {
      if (!We[t]) {
        const n = t.split("/").pop() || "",
          r = hr(n);
        let o;
        if (r === "epub")
          try {
            o = await nr(t);
          } catch (i) {
            ((o = {
              content: "[epub] 此文件可能损坏，解析失败。 => " + i,
              code: -1,
              cover: null,
            }),
              dr("danger", "此文件可能损坏，解析失败"));
          }
        else if (r === "txt")
          o = {
            content: mr(ie.readFileSync(t)),
            cover: null,
            //txt没有封面
          };
        else if (r === "mobi") {
          let i = ie.readFileSync(t);
          o = ur(i);
        } else
          o = {
            buffer: ie.readFileSync(t),
          };
        We[t] = o;
      }
      return We[t];
    } catch (n) {
      return (console.error(n), null);
    }
  },
  mr = (e) => {
    if (!e || e.length === 0) return "";
    const t = Math.min(e.length, 2500),
      n = e.slice(0, t),
      { encoding: r, confidence: o } = Mn.detect(n),
      i = o > 0.45 ? r : "utf-8";
    let s = Wn.decode(e, i);
    return (console.log("长度", s.length), s);
  },
  hr = (e) => e.split(".").pop();
let le, oe, Be, Pt, ot, Y, Le;
const Ae = async (e, t = !0) => {
    (g.get("immersedReadWindowVisible")
      ? (oe = g.get("wordsPerPageOfImmersed"))
      : (oe = g.get("wordsPerPage")),
      (Be = g.get("booksInfo")),
      (ot = g.get("currentBookName")),
      (Pt = yr(Be, ot).index),
      (Y = Be[Pt]),
      (Le = Y),
      t && (Le.start = Math.max(Le.start + (e ? oe : -oe), 0)),
      console.log(Le.start),
      pr(t));
  },
  yr = (e, t) => {
    for (let n = 0; n < e.length; n++)
      if (e[n].bookName === t)
        return {
          index: n,
          ...e[n],
        };
    return -1;
  },
  pr = async (e) => {
    try {
      const t = await Jt("", ot, Y.start, oe);
      Y.total = t.total;
      let n = t.content;
      if (!n.replace(/\s+/g, "").length)
        (console.log(Y.bookProgress),
          Y.bookProgress >= 100
            ? (le = "这本书你已经读完了，针不戳 ~")
            : (le =
                "检测到您的小说有改动，之前保留的进度无法与当前进行匹配，请重新选取小说章节阅读。"),
          e && (Y.start -= oe));
      else {
        le = n;
        const r = ((Y.start + oe) * 100) / Y.total;
        Y.bookProgress =
          Number(r.toFixed(2)) > 100 ? 100 : Number(r.toFixed(2));
      }
      (g.set("booksInfo", Be),
        g.set("currentBookContent", le),
        g.set("currentBookProgress", Y.bookProgress),
        console.log("--------thebook--------", le));
    } catch (t) {
      (console.error(t), (le = "读取文件时发生错误，请同步书架后重新打开书籍"));
    }
  };
let E = g.get("currentBookOnline") || {},
  Q = 1,
  Ge = 1,
  ke = "";
const se = {},
  Ve = async (e, t = !0, n = !1) => {
    n && (Q = 1);
    let r = g.get("wordsPerPage") || 100;
    try {
      if (((E = g.get("currentBookOnline") || {}), !E || !E.bookUrl)) {
        console.error("当前没有有效的书籍信息");
        return;
      }
      if ((await it(), (Ge = Math.ceil(ke.length / r)), t))
        if (e)
          Q < Ge
            ? Q++
            : (console.log("已经是当前章节的最后一页了"),
              await $t(1),
              E.durChapterIndex < E.totalChapterNum - 1
                ? (Q = 1)
                : console.log("已经是全书的最后一页了"));
        else if (Q > 1) Q--;
        else if (
          (console.log("已经是当前章节的第一页了"), E.durChapterIndex > 0)
        ) {
          await $t(-1);
          const d = await ft(E.durChapterIndex);
          Q = Math.ceil(d.length / r);
        } else console.log("已经是全书的第一页了");
      const o = (Q - 1) * r,
        i = o + r,
        s = ke.slice(o, i);
      return (Sr(s, Q), { fileContent: s, currentPage: Q, totalPages: Ge });
    } catch (o) {
      console.error("翻页失败:", o);
    }
  },
  it = async () => {
    const e = E.durChapterIndex;
    (se[e] ? (ke = se[e]) : ((ke = await ft(e)), (se[e] = ke)), wr());
    try {
      let t = g.get("socketUrl"),
        n = await Pe.get(t + "/getChapterList?url=" + E.bookUrl);
      gr({
        name: E.name,
        author: E.author,
        durChapterIndex: E.durChapterIndex,
        durChapterPos: E.durChapterPos,
        durChapterTime: /* @__PURE__ */ new Date().getTime(),
        durChapterTitle: n.data.data[E.durChapterIndex].title,
      });
    } catch {}
  },
  wr = async () => {
    const e = E.durChapterIndex + 1;
    e < E.totalChapterNum && !se[e] && (se[e] = await ft(e));
  },
  gr = async (e) => {
    let t = g.get("socketUrl");
    await Pe.post(t + "/saveBookProgress", e);
  },
  $t = async (e) => {
    e === 1
      ? E.durChapterIndex < E.totalChapterNum - 1 &&
        (E.durChapterIndex++, g.set("currentBookOnline", E), await it())
      : e === -1 &&
        E.durChapterIndex > 0 &&
        (E.durChapterIndex--, g.set("currentBookOnline", E), await it());
  },
  ft = async (e) => {
    if (se[e]) return se[e];
    try {
      let t = g.get("socketUrl");
      const n = await Pe.get(t + "/getBookContent", {
        params: {
          url: E.bookUrl,
          index: e,
        },
      });
      return (
        (await Pe.get(t + "/getChapterList?url=" + E.bookUrl)).data.data[e]
          .title + n.data.data || ""
      );
    } catch (t) {
      return (console.error("获取指定章节内容失败:", t), "");
    }
  },
  Sr = (e) => {
    let t = (E.durChapterIndex / E.totalChapterNum) * 100;
    ((t = Number(t.toFixed(2)) > 100 ? 100 : Number(t.toFixed(2))),
      g.set("bookProgress", t),
      g.set("currentBookContent", e),
      g.set("currentBookProgress", t));
  },
  Re = (e) => {
    let t = {};
    for (let r in qt) t[r] = g.get(r);
    const n = {
      // 上一页
      [t.key1]: () => {
        let r = g.get("readMode");
        (console.log(r),
          r === "onlineRead" ? (console.log("在线读"), Ve(!1)) : Ae(!1));
      },
      // 下一页
      [t.key2]: () => {
        let r = g.get("readMode");
        (console.log(r),
          r === "onlineRead" ? (console.log("在线读"), Ve(!0)) : Ae(!0));
      },
      // 阅读器窗口显隐切换
      [t.key3]: () => {
        (console.log("触发了", e),
          e && e.webContents.send("show-hide-readWin"));
      },
      // 其他快捷键...
    };
    Object.entries(n).forEach(([r, o]) => {
      fe.register(r, o);
    });
  },
  Se = () => {
    fe.unregisterAll();
  },
  vr = async (e) => {
    const n = (await Oe(e)).content,
      r =
        /(正文){0,1}(第)([零〇一二三四五六七八九十壹贰叁肆伍陆柒捌玖拾两百千万a-zA-Z0-9]{1,7})[章节卷篇回]([\s:：、\-\u3000]+)((?! {4}).)((?!\t{1,4}).){0,30}\r?\n/g,
      o = [];
    let i,
      s = !0,
      d = 0;
    for (; (i = r.exec(n)) !== null; ) {
      const l = i[0].trim(),
        c = i.index,
        a = c > d && s;
      (a && (s = !1),
        o.push({
          id: o.length + 1,
          title: l,
          position: c,
          isCur: a,
        }));
    }
    return (
      o.length === 0 &&
        o.push({
          id: 1,
          title: "整篇小说",
          position: 0,
          isCur: !1,
        }),
      o
    );
  },
  kr = async (e, t) => (await Oe(e)).content.substr(t, 300),
  br = 10,
  Er = async (e, t, n) => {
    const r = await Oe(e);
    return Pr(r.content, t, n);
  };
function Pr(e, t, n) {
  const r = [];
  let o = n;
  for (; r.length < br; ) {
    const i = e.indexOf(t, o);
    if (i === -1) break;
    const s = e.slice(Math.max(i - 15, 0), i),
      d = e.slice(i + t.length, i + t.length + 15),
      l = s + t + d,
      c = e.slice(Math.max(i - 100, 0), i),
      a = e.slice(i + t.length, i + t.length + 100),
      u = c + t + a;
    (r.push({
      CurPosition: i,
      // 当前关键词出现的起始位置
      startPosition: i + t.length,
      readContent: l,
      readContentMax: u,
    }),
      (o = i + t.length));
  }
  return r;
}
function $r(e) {
  const t = v.getPath("userData"),
    n = C.join(t, "app.log"),
    o = `${/* @__PURE__ */ new Date().toISOString()}: ${e}
`;
  ie.appendFile(n, o, (i) => {
    i && console.error("Error writing to log file:", i);
  });
}
const Cr = ge.createLogger({
  level: "error",
  // 只记录错误级别及以上的日志
  format: ge.format.json(),
  // 输出格式为 JSON
  transports: [
    // 将日志记录到文件
    new ge.transports.File({ filename: "error.log", level: "error" }),
    // 在控制台输出错误日志
    new ge.transports.Console({
      format: ge.format.simple(),
      level: "error",
    }),
  ],
});
process.on("uncaughtException", (e) => {
  Cr.error(`Uncaught Exception: ${e.message}`);
});
var st =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {},
  q = {},
  L = {};
L.fromCallback = function (e) {
  return Object.defineProperty(
    function (...t) {
      if (typeof t[t.length - 1] == "function") e.apply(this, t);
      else
        return new Promise((n, r) => {
          (t.push((o, i) => (o != null ? r(o) : n(i))), e.apply(this, t));
        });
    },
    "name",
    { value: e.name },
  );
};
L.fromPromise = function (e) {
  return Object.defineProperty(
    function (...t) {
      const n = t[t.length - 1];
      if (typeof n != "function") return e.apply(this, t);
      (t.pop(), e.apply(this, t).then((r) => n(null, r), n));
    },
    "name",
    { value: e.name },
  );
};
var te = zn,
  xr = process.cwd,
  je = null,
  Fr = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function () {
  return (je || (je = xr.call(process)), je);
};
try {
  process.cwd();
} catch {}
if (typeof process.chdir == "function") {
  var Ct = process.chdir;
  ((process.chdir = function (e) {
    ((je = null), Ct.call(process, e));
  }),
    Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Ct));
}
var _r = Ir;
function Ir(e) {
  (te.hasOwnProperty("O_SYMLINK") &&
    process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) &&
    t(e),
    e.lutimes || n(e),
    (e.chown = i(e.chown)),
    (e.fchown = i(e.fchown)),
    (e.lchown = i(e.lchown)),
    (e.chmod = r(e.chmod)),
    (e.fchmod = r(e.fchmod)),
    (e.lchmod = r(e.lchmod)),
    (e.chownSync = s(e.chownSync)),
    (e.fchownSync = s(e.fchownSync)),
    (e.lchownSync = s(e.lchownSync)),
    (e.chmodSync = o(e.chmodSync)),
    (e.fchmodSync = o(e.fchmodSync)),
    (e.lchmodSync = o(e.lchmodSync)),
    (e.stat = d(e.stat)),
    (e.fstat = d(e.fstat)),
    (e.lstat = d(e.lstat)),
    (e.statSync = l(e.statSync)),
    (e.fstatSync = l(e.fstatSync)),
    (e.lstatSync = l(e.lstatSync)),
    e.chmod &&
      !e.lchmod &&
      ((e.lchmod = function (a, u, m) {
        m && process.nextTick(m);
      }),
      (e.lchmodSync = function () {})),
    e.chown &&
      !e.lchown &&
      ((e.lchown = function (a, u, m, f) {
        f && process.nextTick(f);
      }),
      (e.lchownSync = function () {})),
    Fr === "win32" &&
      (e.rename =
        typeof e.rename != "function"
          ? e.rename
          : (function (a) {
              function u(m, f, h) {
                var $ = Date.now(),
                  b = 0;
                a(m, f, function F(J) {
                  if (
                    J &&
                    (J.code === "EACCES" ||
                      J.code === "EPERM" ||
                      J.code === "EBUSY") &&
                    Date.now() - $ < 6e4
                  ) {
                    (setTimeout(function () {
                      e.stat(f, function (A, we) {
                        A && A.code === "ENOENT" ? a(m, f, F) : h(J);
                      });
                    }, b),
                      b < 100 && (b += 10));
                    return;
                  }
                  h && h(J);
                });
              }
              return (Object.setPrototypeOf && Object.setPrototypeOf(u, a), u);
            })(e.rename)),
    (e.read =
      typeof e.read != "function"
        ? e.read
        : (function (a) {
            function u(m, f, h, $, b, F) {
              var J;
              if (F && typeof F == "function") {
                var A = 0;
                J = function (we, vt, kt) {
                  if (we && we.code === "EAGAIN" && A < 10)
                    return (A++, a.call(e, m, f, h, $, b, J));
                  F.apply(this, arguments);
                };
              }
              return a.call(e, m, f, h, $, b, J);
            }
            return (Object.setPrototypeOf && Object.setPrototypeOf(u, a), u);
          })(e.read)),
    (e.readSync =
      typeof e.readSync != "function"
        ? e.readSync
        : /* @__PURE__ */ (function (a) {
            return function (u, m, f, h, $) {
              for (var b = 0; ; )
                try {
                  return a.call(e, u, m, f, h, $);
                } catch (F) {
                  if (F.code === "EAGAIN" && b < 10) {
                    b++;
                    continue;
                  }
                  throw F;
                }
            };
          })(e.readSync)));
  function t(a) {
    ((a.lchmod = function (u, m, f) {
      a.open(u, te.O_WRONLY | te.O_SYMLINK, m, function (h, $) {
        if (h) {
          f && f(h);
          return;
        }
        a.fchmod($, m, function (b) {
          a.close($, function (F) {
            f && f(b || F);
          });
        });
      });
    }),
      (a.lchmodSync = function (u, m) {
        var f = a.openSync(u, te.O_WRONLY | te.O_SYMLINK, m),
          h = !0,
          $;
        try {
          (($ = a.fchmodSync(f, m)), (h = !1));
        } finally {
          if (h)
            try {
              a.closeSync(f);
            } catch {}
          else a.closeSync(f);
        }
        return $;
      }));
  }
  function n(a) {
    te.hasOwnProperty("O_SYMLINK") && a.futimes
      ? ((a.lutimes = function (u, m, f, h) {
          a.open(u, te.O_SYMLINK, function ($, b) {
            if ($) {
              h && h($);
              return;
            }
            a.futimes(b, m, f, function (F) {
              a.close(b, function (J) {
                h && h(F || J);
              });
            });
          });
        }),
        (a.lutimesSync = function (u, m, f) {
          var h = a.openSync(u, te.O_SYMLINK),
            $,
            b = !0;
          try {
            (($ = a.futimesSync(h, m, f)), (b = !1));
          } finally {
            if (b)
              try {
                a.closeSync(h);
              } catch {}
            else a.closeSync(h);
          }
          return $;
        }))
      : a.futimes &&
        ((a.lutimes = function (u, m, f, h) {
          h && process.nextTick(h);
        }),
        (a.lutimesSync = function () {}));
  }
  function r(a) {
    return (
      a &&
      function (u, m, f) {
        return a.call(e, u, m, function (h) {
          (c(h) && (h = null), f && f.apply(this, arguments));
        });
      }
    );
  }
  function o(a) {
    return (
      a &&
      function (u, m) {
        try {
          return a.call(e, u, m);
        } catch (f) {
          if (!c(f)) throw f;
        }
      }
    );
  }
  function i(a) {
    return (
      a &&
      function (u, m, f, h) {
        return a.call(e, u, m, f, function ($) {
          (c($) && ($ = null), h && h.apply(this, arguments));
        });
      }
    );
  }
  function s(a) {
    return (
      a &&
      function (u, m, f) {
        try {
          return a.call(e, u, m, f);
        } catch (h) {
          if (!c(h)) throw h;
        }
      }
    );
  }
  function d(a) {
    return (
      a &&
      function (u, m, f) {
        typeof m == "function" && ((f = m), (m = null));
        function h($, b) {
          (b &&
            (b.uid < 0 && (b.uid += 4294967296),
            b.gid < 0 && (b.gid += 4294967296)),
            f && f.apply(this, arguments));
        }
        return m ? a.call(e, u, m, h) : a.call(e, u, h);
      }
    );
  }
  function l(a) {
    return (
      a &&
      function (u, m) {
        var f = m ? a.call(e, u, m) : a.call(e, u);
        return (
          f &&
            (f.uid < 0 && (f.uid += 4294967296),
            f.gid < 0 && (f.gid += 4294967296)),
          f
        );
      }
    );
  }
  function c(a) {
    if (!a || a.code === "ENOSYS") return !0;
    var u = !process.getuid || process.getuid() !== 0;
    return !!(u && (a.code === "EINVAL" || a.code === "EPERM"));
  }
}
var xt = qn.Stream,
  Or = Dr;
function Dr(e) {
  return {
    ReadStream: t,
    WriteStream: n,
  };
  function t(r, o) {
    if (!(this instanceof t)) return new t(r, o);
    xt.call(this);
    var i = this;
    ((this.path = r),
      (this.fd = null),
      (this.readable = !0),
      (this.paused = !1),
      (this.flags = "r"),
      (this.mode = 438),
      (this.bufferSize = 64 * 1024),
      (o = o || {}));
    for (var s = Object.keys(o), d = 0, l = s.length; d < l; d++) {
      var c = s[d];
      this[c] = o[c];
    }
    if (
      (this.encoding && this.setEncoding(this.encoding), this.start !== void 0)
    ) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0) this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end) throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function () {
        i._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function (a, u) {
      if (a) {
        (i.emit("error", a), (i.readable = !1));
        return;
      }
      ((i.fd = u), i.emit("open", u), i._read());
    });
  }
  function n(r, o) {
    if (!(this instanceof n)) return new n(r, o);
    (xt.call(this),
      (this.path = r),
      (this.fd = null),
      (this.writable = !0),
      (this.flags = "w"),
      (this.encoding = "binary"),
      (this.mode = 438),
      (this.bytesWritten = 0),
      (o = o || {}));
    for (var i = Object.keys(o), s = 0, d = i.length; s < d; s++) {
      var l = i[s];
      this[l] = o[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0) throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    ((this.busy = !1),
      (this._queue = []),
      this.fd === null &&
        ((this._open = e.open),
        this._queue.push([
          this._open,
          this.path,
          this.flags,
          this.mode,
          void 0,
        ]),
        this.flush()));
  }
}
var Tr = Rr,
  Lr =
    Object.getPrototypeOf ||
    function (e) {
      return e.__proto__;
    };
function Rr(e) {
  if (e === null || typeof e != "object") return e;
  if (e instanceof Object) var t = { __proto__: Lr(e) };
  else var t = /* @__PURE__ */ Object.create(null);
  return (
    Object.getOwnPropertyNames(e).forEach(function (n) {
      Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
    }),
    t
  );
}
var I = ie,
  Nr = _r,
  Ur = Or,
  Mr = Tr,
  Ne = Jn,
  B,
  ze;
typeof Symbol == "function" && typeof Symbol.for == "function"
  ? ((B = Symbol.for("graceful-fs.queue")),
    (ze = Symbol.for("graceful-fs.previous")))
  : ((B = "___graceful-fs.queue"), (ze = "___graceful-fs.previous"));
function Wr() {}
function Ht(e, t) {
  Object.defineProperty(e, B, {
    get: function () {
      return t;
    },
  });
}
var ae = Wr;
Ne.debuglog
  ? (ae = Ne.debuglog("gfs4"))
  : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") &&
    (ae = function () {
      var e = Ne.format.apply(Ne, arguments);
      ((e =
        "GFS4: " +
        e.split(/\n/).join(`
GFS4: `)),
        console.error(e));
    });
if (!I[B]) {
  var Br = st[B] || [];
  (Ht(I, Br),
    (I.close = (function (e) {
      function t(n, r) {
        return e.call(I, n, function (o) {
          (o || Ft(), typeof r == "function" && r.apply(this, arguments));
        });
      }
      return (
        Object.defineProperty(t, ze, {
          value: e,
        }),
        t
      );
    })(I.close)),
    (I.closeSync = (function (e) {
      function t(n) {
        (e.apply(I, arguments), Ft());
      }
      return (
        Object.defineProperty(t, ze, {
          value: e,
        }),
        t
      );
    })(I.closeSync)),
    /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") &&
      process.on("exit", function () {
        (ae(I[B]), Hn.equal(I[B].length, 0));
      }));
}
st[B] || Ht(st, I[B]);
var ye = dt(Mr(I));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH &&
  !I.__patched &&
  ((ye = dt(I)), (I.__patched = !0));
function dt(e) {
  (Nr(e),
    (e.gracefulify = dt),
    (e.createReadStream = vt),
    (e.createWriteStream = kt));
  var t = e.readFile;
  e.readFile = n;
  function n(y, k, S) {
    return (typeof k == "function" && ((S = k), (k = null)), U(y, k, S));
    function U(M, R, _, O) {
      return t(M, R, function (P) {
        P && (P.code === "EMFILE" || P.code === "ENFILE")
          ? ue([U, [M, R, _], P, O || Date.now(), Date.now()])
          : typeof _ == "function" && _.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = o;
  function o(y, k, S, U) {
    return (typeof S == "function" && ((U = S), (S = null)), M(y, k, S, U));
    function M(R, _, O, P, W) {
      return r(R, _, O, function (x) {
        x && (x.code === "EMFILE" || x.code === "ENFILE")
          ? ue([M, [R, _, O, P], x, W || Date.now(), Date.now()])
          : typeof P == "function" && P.apply(this, arguments);
      });
    }
  }
  var i = e.appendFile;
  i && (e.appendFile = s);
  function s(y, k, S, U) {
    return (typeof S == "function" && ((U = S), (S = null)), M(y, k, S, U));
    function M(R, _, O, P, W) {
      return i(R, _, O, function (x) {
        x && (x.code === "EMFILE" || x.code === "ENFILE")
          ? ue([M, [R, _, O, P], x, W || Date.now(), Date.now()])
          : typeof P == "function" && P.apply(this, arguments);
      });
    }
  }
  var d = e.copyFile;
  d && (e.copyFile = l);
  function l(y, k, S, U) {
    return (typeof S == "function" && ((U = S), (S = 0)), M(y, k, S, U));
    function M(R, _, O, P, W) {
      return d(R, _, O, function (x) {
        x && (x.code === "EMFILE" || x.code === "ENFILE")
          ? ue([M, [R, _, O, P], x, W || Date.now(), Date.now()])
          : typeof P == "function" && P.apply(this, arguments);
      });
    }
  }
  var c = e.readdir;
  e.readdir = u;
  var a = /^v[0-5]\./;
  function u(y, k, S) {
    typeof k == "function" && ((S = k), (k = null));
    var U = a.test(process.version)
      ? function (_, O, P, W) {
          return c(_, M(_, O, P, W));
        }
      : function (_, O, P, W) {
          return c(_, O, M(_, O, P, W));
        };
    return U(y, k, S);
    function M(R, _, O, P) {
      return function (W, x) {
        W && (W.code === "EMFILE" || W.code === "ENFILE")
          ? ue([U, [R, _, O], W, P || Date.now(), Date.now()])
          : (x && x.sort && x.sort(),
            typeof O == "function" && O.call(this, W, x));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var m = Ur(e);
    ((F = m.ReadStream), (A = m.WriteStream));
  }
  var f = e.ReadStream;
  f && ((F.prototype = Object.create(f.prototype)), (F.prototype.open = J));
  var h = e.WriteStream;
  (h && ((A.prototype = Object.create(h.prototype)), (A.prototype.open = we)),
    Object.defineProperty(e, "ReadStream", {
      get: function () {
        return F;
      },
      set: function (y) {
        F = y;
      },
      enumerable: !0,
      configurable: !0,
    }),
    Object.defineProperty(e, "WriteStream", {
      get: function () {
        return A;
      },
      set: function (y) {
        A = y;
      },
      enumerable: !0,
      configurable: !0,
    }));
  var $ = F;
  Object.defineProperty(e, "FileReadStream", {
    get: function () {
      return $;
    },
    set: function (y) {
      $ = y;
    },
    enumerable: !0,
    configurable: !0,
  });
  var b = A;
  Object.defineProperty(e, "FileWriteStream", {
    get: function () {
      return b;
    },
    set: function (y) {
      b = y;
    },
    enumerable: !0,
    configurable: !0,
  });
  function F(y, k) {
    return this instanceof F
      ? (f.apply(this, arguments), this)
      : F.apply(Object.create(F.prototype), arguments);
  }
  function J() {
    var y = this;
    Ye(y.path, y.flags, y.mode, function (k, S) {
      k
        ? (y.autoClose && y.destroy(), y.emit("error", k))
        : ((y.fd = S), y.emit("open", S), y.read());
    });
  }
  function A(y, k) {
    return this instanceof A
      ? (h.apply(this, arguments), this)
      : A.apply(Object.create(A.prototype), arguments);
  }
  function we() {
    var y = this;
    Ye(y.path, y.flags, y.mode, function (k, S) {
      k ? (y.destroy(), y.emit("error", k)) : ((y.fd = S), y.emit("open", S));
    });
  }
  function vt(y, k) {
    return new e.ReadStream(y, k);
  }
  function kt(y, k) {
    return new e.WriteStream(y, k);
  }
  var Fn = e.open;
  e.open = Ye;
  function Ye(y, k, S, U) {
    return (typeof S == "function" && ((U = S), (S = null)), M(y, k, S, U));
    function M(R, _, O, P, W) {
      return Fn(R, _, O, function (x, as) {
        x && (x.code === "EMFILE" || x.code === "ENFILE")
          ? ue([M, [R, _, O, P], x, W || Date.now(), Date.now()])
          : typeof P == "function" && P.apply(this, arguments);
      });
    }
  }
  return e;
}
function ue(e) {
  (ae("ENQUEUE", e[0].name, e[1]), I[B].push(e), mt());
}
var Ue;
function Ft() {
  for (var e = Date.now(), t = 0; t < I[B].length; ++t)
    I[B][t].length > 2 && ((I[B][t][3] = e), (I[B][t][4] = e));
  mt();
}
function mt() {
  if ((clearTimeout(Ue), (Ue = void 0), I[B].length !== 0)) {
    var e = I[B].shift(),
      t = e[0],
      n = e[1],
      r = e[2],
      o = e[3],
      i = e[4];
    if (o === void 0) (ae("RETRY", t.name, n), t.apply(null, n));
    else if (Date.now() - o >= 6e4) {
      ae("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var d = Date.now() - i,
        l = Math.max(i - o, 1),
        c = Math.min(l * 1.2, 100);
      d >= c
        ? (ae("RETRY", t.name, n), t.apply(null, n.concat([o])))
        : I[B].push(e);
    }
    Ue === void 0 && (Ue = setTimeout(mt, 0));
  }
}
(function (e) {
  const t = L.fromCallback,
    n = ye,
    r = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "cp",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "glob",
      "lchmod",
      "lchown",
      "lutimes",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "opendir",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "statfs",
      "symlink",
      "truncate",
      "unlink",
      "utimes",
      "writeFile",
    ].filter((o) => typeof n[o] == "function");
  (Object.assign(e, n),
    r.forEach((o) => {
      e[o] = t(n[o]);
    }),
    (e.exists = function (o, i) {
      return typeof i == "function"
        ? n.exists(o, i)
        : new Promise((s) => n.exists(o, s));
    }),
    (e.read = function (o, i, s, d, l, c) {
      return typeof c == "function"
        ? n.read(o, i, s, d, l, c)
        : new Promise((a, u) => {
            n.read(o, i, s, d, l, (m, f, h) => {
              if (m) return u(m);
              a({ bytesRead: f, buffer: h });
            });
          });
    }),
    (e.write = function (o, i, ...s) {
      return typeof s[s.length - 1] == "function"
        ? n.write(o, i, ...s)
        : new Promise((d, l) => {
            n.write(o, i, ...s, (c, a, u) => {
              if (c) return l(c);
              d({ bytesWritten: a, buffer: u });
            });
          });
    }),
    (e.readv = function (o, i, ...s) {
      return typeof s[s.length - 1] == "function"
        ? n.readv(o, i, ...s)
        : new Promise((d, l) => {
            n.readv(o, i, ...s, (c, a, u) => {
              if (c) return l(c);
              d({ bytesRead: a, buffers: u });
            });
          });
    }),
    (e.writev = function (o, i, ...s) {
      return typeof s[s.length - 1] == "function"
        ? n.writev(o, i, ...s)
        : new Promise((d, l) => {
            n.writev(o, i, ...s, (c, a, u) => {
              if (c) return l(c);
              d({ bytesWritten: a, buffers: u });
            });
          });
    }),
    typeof n.realpath.native == "function"
      ? (e.realpath.native = t(n.realpath.native))
      : process.emitWarning(
          "fs.realpath.native is not a function. Is fs being monkey-patched?",
          "Warning",
          "fs-extra-WARN0003",
        ));
})(q);
var ht = {},
  Yt = {};
const jr = C;
Yt.checkPath = function (t) {
  if (
    process.platform === "win32" &&
    /[<>:"|?*]/.test(t.replace(jr.parse(t).root, ""))
  ) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw ((r.code = "EINVAL"), r);
  }
};
const Gt = q,
  { checkPath: Kt } = Yt,
  Qt = (e) => {
    const t = { mode: 511 };
    return typeof e == "number" ? e : { ...t, ...e }.mode;
  };
ht.makeDir = async (e, t) => (
  Kt(e),
  Gt.mkdir(e, {
    mode: Qt(t),
    recursive: !0,
  })
);
ht.makeDirSync = (e, t) => (
  Kt(e),
  Gt.mkdirSync(e, {
    mode: Qt(t),
    recursive: !0,
  })
);
const Ar = L.fromPromise,
  { makeDir: Vr, makeDirSync: Ke } = ht,
  Qe = Ar(Vr);
var Z = {
  mkdirs: Qe,
  mkdirsSync: Ke,
  // alias
  mkdirp: Qe,
  mkdirpSync: Ke,
  ensureDir: Qe,
  ensureDirSync: Ke,
};
const zr = L.fromPromise,
  Xt = q;
function qr(e) {
  return Xt.access(e)
    .then(() => !0)
    .catch(() => !1);
}
var ce = {
  pathExists: zr(qr),
  pathExistsSync: Xt.existsSync,
};
const de = q,
  Jr = L.fromPromise;
async function Hr(e, t, n) {
  const r = await de.open(e, "r+");
  let o = null;
  try {
    await de.futimes(r, t, n);
  } finally {
    try {
      await de.close(r);
    } catch (i) {
      o = i;
    }
  }
  if (o) throw o;
}
function Yr(e, t, n) {
  const r = de.openSync(e, "r+");
  return (de.futimesSync(r, t, n), de.closeSync(r));
}
var Zt = {
  utimesMillis: Jr(Hr),
  utimesMillisSync: Yr,
};
const me = q,
  N = C,
  _t = L.fromPromise;
function Gr(e, t, n) {
  const r = n.dereference
    ? (o) => me.stat(o, { bigint: !0 })
    : (o) => me.lstat(o, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((o) => {
      if (o.code === "ENOENT") return null;
      throw o;
    }),
  ]).then(([o, i]) => ({ srcStat: o, destStat: i }));
}
function Kr(e, t, n) {
  let r;
  const o = n.dereference
      ? (s) => me.statSync(s, { bigint: !0 })
      : (s) => me.lstatSync(s, { bigint: !0 }),
    i = o(e);
  try {
    r = o(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: i, destStat: null };
    throw s;
  }
  return { srcStat: i, destStat: r };
}
async function Qr(e, t, n, r) {
  const { srcStat: o, destStat: i } = await Gr(e, t, r);
  if (i) {
    if (De(o, i)) {
      const s = N.basename(e),
        d = N.basename(t);
      if (n === "move" && s !== d && s.toLowerCase() === d.toLowerCase())
        return { srcStat: o, destStat: i, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (o.isDirectory() && !i.isDirectory())
      throw new Error(
        `Cannot overwrite non-directory '${t}' with directory '${e}'.`,
      );
    if (!o.isDirectory() && i.isDirectory())
      throw new Error(
        `Cannot overwrite directory '${t}' with non-directory '${e}'.`,
      );
  }
  if (o.isDirectory() && yt(e, t)) throw new Error(qe(e, t, n));
  return { srcStat: o, destStat: i };
}
function Xr(e, t, n, r) {
  const { srcStat: o, destStat: i } = Kr(e, t, r);
  if (i) {
    if (De(o, i)) {
      const s = N.basename(e),
        d = N.basename(t);
      if (n === "move" && s !== d && s.toLowerCase() === d.toLowerCase())
        return { srcStat: o, destStat: i, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (o.isDirectory() && !i.isDirectory())
      throw new Error(
        `Cannot overwrite non-directory '${t}' with directory '${e}'.`,
      );
    if (!o.isDirectory() && i.isDirectory())
      throw new Error(
        `Cannot overwrite directory '${t}' with non-directory '${e}'.`,
      );
  }
  if (o.isDirectory() && yt(e, t)) throw new Error(qe(e, t, n));
  return { srcStat: o, destStat: i };
}
async function en(e, t, n, r) {
  const o = N.resolve(N.dirname(e)),
    i = N.resolve(N.dirname(n));
  if (i === o || i === N.parse(i).root) return;
  let s;
  try {
    s = await me.stat(i, { bigint: !0 });
  } catch (d) {
    if (d.code === "ENOENT") return;
    throw d;
  }
  if (De(t, s)) throw new Error(qe(e, n, r));
  return en(e, t, i, r);
}
function tn(e, t, n, r) {
  const o = N.resolve(N.dirname(e)),
    i = N.resolve(N.dirname(n));
  if (i === o || i === N.parse(i).root) return;
  let s;
  try {
    s = me.statSync(i, { bigint: !0 });
  } catch (d) {
    if (d.code === "ENOENT") return;
    throw d;
  }
  if (De(t, s)) throw new Error(qe(e, n, r));
  return tn(e, t, i, r);
}
function De(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function yt(e, t) {
  const n = N.resolve(e)
      .split(N.sep)
      .filter((o) => o),
    r = N.resolve(t)
      .split(N.sep)
      .filter((o) => o);
  return n.every((o, i) => r[i] === o);
}
function qe(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var pe = {
  // checkPaths
  checkPaths: _t(Qr),
  checkPathsSync: Xr,
  // checkParent
  checkParentPaths: _t(en),
  checkParentPathsSync: tn,
  // Misc
  isSrcSubdir: yt,
  areIdentical: De,
};
const j = q,
  Ce = C,
  { mkdirs: Zr } = Z,
  { pathExists: eo } = ce,
  { utimesMillis: to } = Zt,
  xe = pe;
async function no(e, t, n = {}) {
  (typeof n == "function" && (n = { filter: n }),
    (n.clobber = "clobber" in n ? !!n.clobber : !0),
    (n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber),
    n.preserveTimestamps &&
      process.arch === "ia32" &&
      process.emitWarning(
        `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
        "Warning",
        "fs-extra-WARN0001",
      ));
  const { srcStat: r, destStat: o } = await xe.checkPaths(e, t, "copy", n);
  if ((await xe.checkParentPaths(e, r, t, "copy"), !(await nn(e, t, n))))
    return;
  const s = Ce.dirname(t);
  ((await eo(s)) || (await Zr(s)), await rn(o, e, t, n));
}
async function nn(e, t, n) {
  return n.filter ? n.filter(e, t) : !0;
}
async function rn(e, t, n, r) {
  const i = await (r.dereference ? j.stat : j.lstat)(t);
  if (i.isDirectory()) return so(i, e, t, n, r);
  if (i.isFile() || i.isCharacterDevice() || i.isBlockDevice())
    return ro(i, e, t, n, r);
  if (i.isSymbolicLink()) return ao(e, t, n, r);
  throw i.isSocket()
    ? new Error(`Cannot copy a socket file: ${t}`)
    : i.isFIFO()
      ? new Error(`Cannot copy a FIFO pipe: ${t}`)
      : new Error(`Unknown file: ${t}`);
}
async function ro(e, t, n, r, o) {
  if (!t) return It(e, n, r, o);
  if (o.overwrite) return (await j.unlink(r), It(e, n, r, o));
  if (o.errorOnExist) throw new Error(`'${r}' already exists`);
}
async function It(e, t, n, r) {
  if ((await j.copyFile(t, n), r.preserveTimestamps)) {
    oo(e.mode) && (await io(n, e.mode));
    const o = await j.stat(t);
    await to(n, o.atime, o.mtime);
  }
  return j.chmod(n, e.mode);
}
function oo(e) {
  return (e & 128) === 0;
}
function io(e, t) {
  return j.chmod(e, t | 128);
}
async function so(e, t, n, r, o) {
  t || (await j.mkdir(r));
  const i = [];
  for await (const s of await j.opendir(n)) {
    const d = Ce.join(n, s.name),
      l = Ce.join(r, s.name);
    i.push(
      nn(d, l, o).then((c) => {
        if (c)
          return xe
            .checkPaths(d, l, "copy", o)
            .then(({ destStat: a }) => rn(a, d, l, o));
      }),
    );
  }
  (await Promise.all(i), t || (await j.chmod(r, e.mode)));
}
async function ao(e, t, n, r) {
  let o = await j.readlink(t);
  if ((r.dereference && (o = Ce.resolve(process.cwd(), o)), !e))
    return j.symlink(o, n);
  let i = null;
  try {
    i = await j.readlink(n);
  } catch (s) {
    if (s.code === "EINVAL" || s.code === "UNKNOWN") return j.symlink(o, n);
    throw s;
  }
  if (
    (r.dereference && (i = Ce.resolve(process.cwd(), i)), xe.isSrcSubdir(o, i))
  )
    throw new Error(`Cannot copy '${o}' to a subdirectory of itself, '${i}'.`);
  if (xe.isSrcSubdir(i, o))
    throw new Error(`Cannot overwrite '${i}' with '${o}'.`);
  return (await j.unlink(n), j.symlink(o, n));
}
var co = no;
const V = ye,
  Fe = C,
  lo = Z.mkdirsSync,
  uo = Zt.utimesMillisSync,
  _e = pe;
function fo(e, t, n) {
  (typeof n == "function" && (n = { filter: n }),
    (n = n || {}),
    (n.clobber = "clobber" in n ? !!n.clobber : !0),
    (n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber),
    n.preserveTimestamps &&
      process.arch === "ia32" &&
      process.emitWarning(
        `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
        "Warning",
        "fs-extra-WARN0002",
      ));
  const { srcStat: r, destStat: o } = _e.checkPathsSync(e, t, "copy", n);
  if ((_e.checkParentPathsSync(e, r, t, "copy"), n.filter && !n.filter(e, t)))
    return;
  const i = Fe.dirname(t);
  return (V.existsSync(i) || lo(i), on(o, e, t, n));
}
function on(e, t, n, r) {
  const i = (r.dereference ? V.statSync : V.lstatSync)(t);
  if (i.isDirectory()) return So(i, e, t, n, r);
  if (i.isFile() || i.isCharacterDevice() || i.isBlockDevice())
    return mo(i, e, t, n, r);
  if (i.isSymbolicLink()) return bo(e, t, n, r);
  throw i.isSocket()
    ? new Error(`Cannot copy a socket file: ${t}`)
    : i.isFIFO()
      ? new Error(`Cannot copy a FIFO pipe: ${t}`)
      : new Error(`Unknown file: ${t}`);
}
function mo(e, t, n, r, o) {
  return t ? ho(e, n, r, o) : sn(e, n, r, o);
}
function ho(e, t, n, r) {
  if (r.overwrite) return (V.unlinkSync(n), sn(e, t, n, r));
  if (r.errorOnExist) throw new Error(`'${n}' already exists`);
}
function sn(e, t, n, r) {
  return (
    V.copyFileSync(t, n),
    r.preserveTimestamps && yo(e.mode, t, n),
    pt(n, e.mode)
  );
}
function yo(e, t, n) {
  return (po(e) && wo(n, e), go(t, n));
}
function po(e) {
  return (e & 128) === 0;
}
function wo(e, t) {
  return pt(e, t | 128);
}
function pt(e, t) {
  return V.chmodSync(e, t);
}
function go(e, t) {
  const n = V.statSync(e);
  return uo(t, n.atime, n.mtime);
}
function So(e, t, n, r, o) {
  return t ? an(n, r, o) : vo(e.mode, n, r, o);
}
function vo(e, t, n, r) {
  return (V.mkdirSync(n), an(t, n, r), pt(n, e));
}
function an(e, t, n) {
  const r = V.opendirSync(e);
  try {
    let o;
    for (; (o = r.readSync()) !== null; ) ko(o.name, e, t, n);
  } finally {
    r.closeSync();
  }
}
function ko(e, t, n, r) {
  const o = Fe.join(t, e),
    i = Fe.join(n, e);
  if (r.filter && !r.filter(o, i)) return;
  const { destStat: s } = _e.checkPathsSync(o, i, "copy", r);
  return on(s, o, i, r);
}
function bo(e, t, n, r) {
  let o = V.readlinkSync(t);
  if ((r.dereference && (o = Fe.resolve(process.cwd(), o)), e)) {
    let i;
    try {
      i = V.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN")
        return V.symlinkSync(o, n);
      throw s;
    }
    if (
      (r.dereference && (i = Fe.resolve(process.cwd(), i)),
      _e.isSrcSubdir(o, i))
    )
      throw new Error(
        `Cannot copy '${o}' to a subdirectory of itself, '${i}'.`,
      );
    if (_e.isSrcSubdir(i, o))
      throw new Error(`Cannot overwrite '${i}' with '${o}'.`);
    return Eo(o, n);
  } else return V.symlinkSync(o, n);
}
function Eo(e, t) {
  return (V.unlinkSync(t), V.symlinkSync(e, t));
}
var Po = fo;
const $o = L.fromPromise;
var wt = {
  copy: $o(co),
  copySync: Po,
};
const cn = ye,
  Co = L.fromCallback;
function xo(e, t) {
  cn.rm(e, { recursive: !0, force: !0 }, t);
}
function Fo(e) {
  cn.rmSync(e, { recursive: !0, force: !0 });
}
var Je = {
  remove: Co(xo),
  removeSync: Fo,
};
const _o = L.fromPromise,
  ln = q,
  un = C,
  fn = Z,
  dn = Je,
  Ot = _o(async function (t) {
    let n;
    try {
      n = await ln.readdir(t);
    } catch {
      return fn.mkdirs(t);
    }
    return Promise.all(n.map((r) => dn.remove(un.join(t, r))));
  });
function Dt(e) {
  let t;
  try {
    t = ln.readdirSync(e);
  } catch {
    return fn.mkdirsSync(e);
  }
  t.forEach((n) => {
    ((n = un.join(e, n)), dn.removeSync(n));
  });
}
var Io = {
  emptyDirSync: Dt,
  emptydirSync: Dt,
  emptyDir: Ot,
  emptydir: Ot,
};
const Oo = L.fromPromise,
  mn = C,
  ee = q,
  hn = Z;
async function Do(e) {
  let t;
  try {
    t = await ee.stat(e);
  } catch {}
  if (t && t.isFile()) return;
  const n = mn.dirname(e);
  let r = null;
  try {
    r = await ee.stat(n);
  } catch (o) {
    if (o.code === "ENOENT") {
      (await hn.mkdirs(n), await ee.writeFile(e, ""));
      return;
    } else throw o;
  }
  r.isDirectory() ? await ee.writeFile(e, "") : await ee.readdir(n);
}
function To(e) {
  let t;
  try {
    t = ee.statSync(e);
  } catch {}
  if (t && t.isFile()) return;
  const n = mn.dirname(e);
  try {
    ee.statSync(n).isDirectory() || ee.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") hn.mkdirsSync(n);
    else throw r;
  }
  ee.writeFileSync(e, "");
}
var Lo = {
  createFile: Oo(Do),
  createFileSync: To,
};
const Ro = L.fromPromise,
  yn = C,
  ne = q,
  pn = Z,
  { pathExists: No } = ce,
  { areIdentical: wn } = pe;
async function Uo(e, t) {
  let n;
  try {
    n = await ne.lstat(t);
  } catch {}
  let r;
  try {
    r = await ne.lstat(e);
  } catch (s) {
    throw ((s.message = s.message.replace("lstat", "ensureLink")), s);
  }
  if (n && wn(r, n)) return;
  const o = yn.dirname(t);
  ((await No(o)) || (await pn.mkdirs(o)), await ne.link(e, t));
}
function Mo(e, t) {
  let n;
  try {
    n = ne.lstatSync(t);
  } catch {}
  try {
    const i = ne.lstatSync(e);
    if (n && wn(i, n)) return;
  } catch (i) {
    throw ((i.message = i.message.replace("lstat", "ensureLink")), i);
  }
  const r = yn.dirname(t);
  return (ne.existsSync(r) || pn.mkdirsSync(r), ne.linkSync(e, t));
}
var Wo = {
  createLink: Ro(Uo),
  createLinkSync: Mo,
};
const re = C,
  be = q,
  { pathExists: Bo } = ce,
  jo = L.fromPromise;
async function Ao(e, t) {
  if (re.isAbsolute(e)) {
    try {
      await be.lstat(e);
    } catch (i) {
      throw ((i.message = i.message.replace("lstat", "ensureSymlink")), i);
    }
    return {
      toCwd: e,
      toDst: e,
    };
  }
  const n = re.dirname(t),
    r = re.join(n, e);
  if (await Bo(r))
    return {
      toCwd: r,
      toDst: e,
    };
  try {
    await be.lstat(e);
  } catch (i) {
    throw ((i.message = i.message.replace("lstat", "ensureSymlink")), i);
  }
  return {
    toCwd: e,
    toDst: re.relative(n, e),
  };
}
function Vo(e, t) {
  if (re.isAbsolute(e)) {
    if (!be.existsSync(e)) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e,
    };
  }
  const n = re.dirname(t),
    r = re.join(n, e);
  if (be.existsSync(r))
    return {
      toCwd: r,
      toDst: e,
    };
  if (!be.existsSync(e)) throw new Error("relative srcpath does not exist");
  return {
    toCwd: e,
    toDst: re.relative(n, e),
  };
}
var zo = {
  symlinkPaths: jo(Ao),
  symlinkPathsSync: Vo,
};
const gn = q,
  qo = L.fromPromise;
async function Jo(e, t) {
  if (t) return t;
  let n;
  try {
    n = await gn.lstat(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
function Ho(e, t) {
  if (t) return t;
  let n;
  try {
    n = gn.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var Yo = {
  symlinkType: qo(Jo),
  symlinkTypeSync: Ho,
};
const Go = L.fromPromise,
  Sn = C,
  X = q,
  { mkdirs: Ko, mkdirsSync: Qo } = Z,
  { symlinkPaths: Xo, symlinkPathsSync: Zo } = zo,
  { symlinkType: ei, symlinkTypeSync: ti } = Yo,
  { pathExists: ni } = ce,
  { areIdentical: vn } = pe;
async function ri(e, t, n) {
  let r;
  try {
    r = await X.lstat(t);
  } catch {}
  if (r && r.isSymbolicLink()) {
    const [d, l] = await Promise.all([X.stat(e), X.stat(t)]);
    if (vn(d, l)) return;
  }
  const o = await Xo(e, t);
  e = o.toDst;
  const i = await ei(o.toCwd, n),
    s = Sn.dirname(t);
  return ((await ni(s)) || (await Ko(s)), X.symlink(e, t, i));
}
function oi(e, t, n) {
  let r;
  try {
    r = X.lstatSync(t);
  } catch {}
  if (r && r.isSymbolicLink()) {
    const d = X.statSync(e),
      l = X.statSync(t);
    if (vn(d, l)) return;
  }
  const o = Zo(e, t);
  ((e = o.toDst), (n = ti(o.toCwd, n)));
  const i = Sn.dirname(t);
  return (X.existsSync(i) || Qo(i), X.symlinkSync(e, t, n));
}
var ii = {
  createSymlink: Go(ri),
  createSymlinkSync: oi,
};
const { createFile: Tt, createFileSync: Lt } = Lo,
  { createLink: Rt, createLinkSync: Nt } = Wo,
  { createSymlink: Ut, createSymlinkSync: Mt } = ii;
var si = {
  // file
  createFile: Tt,
  createFileSync: Lt,
  ensureFile: Tt,
  ensureFileSync: Lt,
  // link
  createLink: Rt,
  createLinkSync: Nt,
  ensureLink: Rt,
  ensureLinkSync: Nt,
  // symlink
  createSymlink: Ut,
  createSymlinkSync: Mt,
  ensureSymlink: Ut,
  ensureSymlinkSync: Mt,
};
function ai(
  e,
  {
    EOL: t = `
`,
    finalEOL: n = !0,
    replacer: r = null,
    spaces: o,
  } = {},
) {
  const i = n ? t : "";
  return JSON.stringify(e, r, o).replace(/\n/g, t) + i;
}
function ci(e) {
  return (
    Buffer.isBuffer(e) && (e = e.toString("utf8")),
    e.replace(/^\uFEFF/, "")
  );
}
var gt = { stringify: ai, stripBom: ci };
let he;
try {
  he = ye;
} catch {
  he = ie;
}
const He = L,
  { stringify: kn, stripBom: bn } = gt;
async function li(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || he,
    r = "throws" in t ? t.throws : !0;
  let o = await He.fromCallback(n.readFile)(e, t);
  o = bn(o);
  let i;
  try {
    i = JSON.parse(o, t ? t.reviver : null);
  } catch (s) {
    if (r) throw ((s.message = `${e}: ${s.message}`), s);
    return null;
  }
  return i;
}
const ui = He.fromPromise(li);
function fi(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || he,
    r = "throws" in t ? t.throws : !0;
  try {
    let o = n.readFileSync(e, t);
    return ((o = bn(o)), JSON.parse(o, t.reviver));
  } catch (o) {
    if (r) throw ((o.message = `${e}: ${o.message}`), o);
    return null;
  }
}
async function di(e, t, n = {}) {
  const r = n.fs || he,
    o = kn(t, n);
  await He.fromCallback(r.writeFile)(e, o, n);
}
const mi = He.fromPromise(di);
function hi(e, t, n = {}) {
  const r = n.fs || he,
    o = kn(t, n);
  return r.writeFileSync(e, o, n);
}
const yi = {
  readFile: ui,
  readFileSync: fi,
  writeFile: mi,
  writeFileSync: hi,
};
var pi = yi;
const Me = pi;
var wi = {
  // jsonfile exports
  readJson: Me.readFile,
  readJsonSync: Me.readFileSync,
  writeJson: Me.writeFile,
  writeJsonSync: Me.writeFileSync,
};
const gi = L.fromPromise,
  at = q,
  En = C,
  Pn = Z,
  Si = ce.pathExists;
async function vi(e, t, n = "utf-8") {
  const r = En.dirname(e);
  return ((await Si(r)) || (await Pn.mkdirs(r)), at.writeFile(e, t, n));
}
function ki(e, ...t) {
  const n = En.dirname(e);
  (at.existsSync(n) || Pn.mkdirsSync(n), at.writeFileSync(e, ...t));
}
var St = {
  outputFile: gi(vi),
  outputFileSync: ki,
};
const { stringify: bi } = gt,
  { outputFile: Ei } = St;
async function Pi(e, t, n = {}) {
  const r = bi(t, n);
  await Ei(e, r, n);
}
var $i = Pi;
const { stringify: Ci } = gt,
  { outputFileSync: xi } = St;
function Fi(e, t, n) {
  const r = Ci(t, n);
  xi(e, r, n);
}
var _i = Fi;
const Ii = L.fromPromise,
  z = wi;
z.outputJson = Ii($i);
z.outputJsonSync = _i;
z.outputJSON = z.outputJson;
z.outputJSONSync = z.outputJsonSync;
z.writeJSON = z.writeJson;
z.writeJSONSync = z.writeJsonSync;
z.readJSON = z.readJson;
z.readJSONSync = z.readJsonSync;
var Oi = z;
const Di = q,
  Wt = C,
  { copy: Ti } = wt,
  { remove: $n } = Je,
  { mkdirp: Li } = Z,
  { pathExists: Ri } = ce,
  Bt = pe;
async function Ni(e, t, n = {}) {
  const r = n.overwrite || n.clobber || !1,
    { srcStat: o, isChangingCase: i = !1 } = await Bt.checkPaths(
      e,
      t,
      "move",
      n,
    );
  await Bt.checkParentPaths(e, o, t, "move");
  const s = Wt.dirname(t);
  return (Wt.parse(s).root !== s && (await Li(s)), Ui(e, t, r, i));
}
async function Ui(e, t, n, r) {
  if (!r) {
    if (n) await $n(t);
    else if (await Ri(t)) throw new Error("dest already exists.");
  }
  try {
    await Di.rename(e, t);
  } catch (o) {
    if (o.code !== "EXDEV") throw o;
    await Mi(e, t, n);
  }
}
async function Mi(e, t, n) {
  return (
    await Ti(e, t, {
      overwrite: n,
      errorOnExist: !0,
      preserveTimestamps: !0,
    }),
    $n(e)
  );
}
var Wi = Ni;
const Cn = ye,
  ct = C,
  Bi = wt.copySync,
  xn = Je.removeSync,
  ji = Z.mkdirpSync,
  jt = pe;
function Ai(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1,
    { srcStat: o, isChangingCase: i = !1 } = jt.checkPathsSync(e, t, "move", n);
  return (
    jt.checkParentPathsSync(e, o, t, "move"),
    Vi(t) || ji(ct.dirname(t)),
    zi(e, t, r, i)
  );
}
function Vi(e) {
  const t = ct.dirname(e);
  return ct.parse(t).root === t;
}
function zi(e, t, n, r) {
  if (r) return Xe(e, t, n);
  if (n) return (xn(t), Xe(e, t, n));
  if (Cn.existsSync(t)) throw new Error("dest already exists.");
  return Xe(e, t, n);
}
function Xe(e, t, n) {
  try {
    Cn.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return qi(e, t, n);
  }
}
function qi(e, t, n) {
  return (
    Bi(e, t, {
      overwrite: n,
      errorOnExist: !0,
      preserveTimestamps: !0,
    }),
    xn(e)
  );
}
var Ji = Ai;
const Hi = L.fromPromise;
var Yi = {
    move: Hi(Wi),
    moveSync: Ji,
  },
  At = {
    // Export promiseified graceful-fs:
    ...q,
    // Export extra methods:
    ...wt,
    ...Io,
    ...si,
    ...Oi,
    ...Z,
    ...Yi,
    ...St,
    ...ce,
    ...Je,
  };
function Gi() {
  const e = v.getPath("userData");
  console.log(`userDataPath: ${e}`);
  const t = Un.join(e, "books"),
    n = nt;
  At.ensureDirSync(e);
  try {
    if (bt.existsSync(n))
      if (bt.lstatSync(n).isDirectory())
        (At.copySync(n, t, { overwrite: !1 }),
          console.log("Books folder content copied to appData successfully."),
          console.log("Source books folder removed successfully."));
      else throw new Error(`Source path ${n} is not a directory.`);
    else {
      console.log("不存在 books 文件夹");
      return;
    }
  } catch (r) {
    console.error("Error during moving:", r);
  }
}
globalThis.__filename = lt(import.meta.url);
globalThis.__dirname = ut(__filename);
process.env.DIST_ELECTRON = G(__dirname, "..");
process.env.DIST = G(process.env.DIST_ELECTRON, "../dist");
const Ki = G(__dirname, "../preload/index.mjs"),
  Qi = G(process.env.DIST, "index.html");
let D = null;
function Xi(e) {
  if (D && !D.isDestroyed()) {
    D.show();
    return;
  }
  return (
    (D = new K({
      width: 1024,
      height: 768,
      frame: !1,
      modal: !1,
      resizable: !0,
      minimizable: !0,
      maximizable: !0,
      webPreferences: {
        nodeIntegration: !0,
        // contextIsolation: false,
        webSecurity: !1,
        preload: Ki,
      },
    })),
    D.setParentWindow(e),
    setTimeout(() => {
      (D.webContents.send("getImmersedWindowVisible", D.isVisible()),
        console.log("getImmersedWindowVisible,已发送", D.isVisible()));
    }, 200),
    ve
      ? D.loadURL("http://localhost:5173/#/immersedRead")
      : D.loadFile(Qi, {
          hash: "immersedRead",
        }),
    D.on("closed", () => {
      (console.log("窗口被销毁啦~~~~~~~"), (D = null));
    }),
    D.on("maximize", () => {
      D.webContents.send("window-maximized");
    }),
    D.on("unmaximize", () => {
      D.webContents.send("window-unmaximized");
    }),
    g.onDidAnyChange((t) => {
      const n = Zi(t);
      D.webContents.send("update-data", n);
    }),
    D
  );
}
w.on("window-min-immersed", (e) => {
  const t = e.sender;
  (K.fromWebContents(t), D.minimize());
});
w.on("window-max-immersed", (e) => {
  const t = e.sender;
  (K.fromWebContents(t), D.maximize());
});
w.on("window-unmax-immersed", (e) => {
  const t = e.sender;
  (K.fromWebContents(t), D.unmaximize());
});
w.on("window-close-immersed", (e) => {
  const t = e.sender;
  (K.fromWebContents(t), D.hide());
});
w.on("on-turnpage", (e, t, n, r) => {
  g.get("readMode") === "onlineRead" ? Ve(t, n, r) : Ae(t);
});
function Zi(e) {
  for (let t in $e)
    t in e ||
      (console.log(t + "不在curentConfig中"), (e[t] = $e[t]), g.set(t, e[t]));
  return e;
}
function es() {
  let e = g.get("uniqueId");
  (e || ((e = ts()), g.set("uniqueId", e)), console.log("uniqueId", e));
}
function ts() {
  const e = /* @__PURE__ */ new Date(),
    t = e.getFullYear(),
    n = (e.getMonth() + 1).toString().padStart(2, "0"),
    r = e.getDate().toString().padStart(2, "0"),
    o = e.getHours().toString().padStart(2, "0"),
    i = e.getMinutes().toString().padStart(2, "0"),
    s = e.getSeconds().toString().padStart(2, "0"),
    d = `${t}${n}${r}${o}${i}${s}`,
    l = Yn(4).toString("hex");
  return `${d}-${l}`;
}
globalThis.__filename = lt(import.meta.url);
globalThis.__dirname = ut(__filename);
es();
let Vt,
  T = null,
  p = null,
  ns = null;
try {
  let e = function () {
    (os(),
      (i = On.getPrimaryDisplay().workAreaSize.width),
      console.log(i),
      (p = new K({
        width: 800,
        height: 40,
        minHeight: 40,
        x: Math.floor((i - 800) / 2),
        // 窗口在 X 轴上的位置居中
        y: 0,
        // 窗口在 Y 轴上的位置放置在屏幕底部
        frame: !1,
        fullscreenable: !0,
        maximizable: !1,
        alwaysOnTop: !1,
        hasShadow: !1,
        transparent: !0,
        resizable: !0,
        movable: !0,
        show: !1,
        // type: 'toolbar',
        webPreferences: {
          nodeIntegration: !0,
          // contextIsolation: false,
          webSecurity: !1,
          preload: t,
        },
        modal: !1,
      })),
      p.setSkipTaskbar(!0),
      console.log("env => ", ve),
      ve
        ? p.loadURL("http://localhost:5173/#/read")
        : (console.log("indexHtml-index", r),
          p.loadFile(r, {
            hash: "read",
          })),
      p.on("closed", () => {
        p = null;
      }),
      p.on("moved", () => {
        const [c, a] = p.getPosition(),
          [u, m] = p.getSize(),
          f = { x: c, y: a, width: u, height: m };
        (console.log("窗口已移动，新位置和尺寸：", f),
          g.set("windowBounds", f));
      }),
      p.on("resized", () => {
        const [c, a] = p.getPosition(),
          [u, m] = p.getSize(),
          f = { x: c, y: a, width: u, height: m };
        (console.log("窗口已调整大小，新位置和尺寸：", f),
          g.set("windowBounds", f));
      }));
    const l = g.get("windowBounds");
    (l && (p.setSize(l.width, l.height), p.setPosition(l.x, l.y)),
      Se(),
      Re(p),
      process.platform === "win32" &&
        p.hookWindowMessage(278, function (c) {
          return (
            p.setEnabled(!1),
            setTimeout(() => {
              p.setEnabled(!0);
            }, 100),
            !0
          );
        }),
      (global.readWindow = p));
  };
  ((globalThis.__filename = lt(import.meta.url)),
    (globalThis.__dirname = ut(__filename)),
    console.log("dirname::", __dirname),
    (process.env.DIST_ELECTRON = G(__dirname, "..")),
    (process.env.DIST = G(process.env.DIST_ELECTRON, "../dist")),
    (process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
      ? G(process.env.DIST_ELECTRON, "../public")
      : process.env.DIST),
    Rn().startsWith("6.1") && v.disableHardwareAcceleration(),
    process.platform === "win32" && v.setAppUserModelId(v.getName()),
    v.requestSingleInstanceLock() || (v.quit(), process.exit(0)));
  const t = G(__dirname, "../preload/index.mjs"),
    n = process.env.VITE_DEV_SERVER_URL + "/#/home",
    r = G(process.env.DIST, "index.html");
  console.log(G(process.env.VITE_PUBLIC, "favicon.ico"));
  async function o() {
    ((T = new K({
      title: "fish-book",
      icon: G(process.env.VITE_PUBLIC, "favicon.ico"),
      width: 1024,
      height: 700,
      // backgroundColor: '#1e222d',
      minWidth: 1024,
      minHeight: 700,
      // 768
      frame: !1,
      hasShadow: !1,
      resizable: !0,
      // titleBarStyle: 'hidden',
      transparent: !0,
      modal: !1,
      webPreferences: {
        preload: t,
        webSecurity: !1,
        session: {
          cookies: !0,
        },
        // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
        // nodeIntegration: true,
        // Consider using contextBridge.exposeInMainWorld
        // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
        // contextIsolation: true,
      },
    })),
      fr(T),
      ve || Gi(),
      console.log(process.env.VITE_DEV_SERVER_URL),
      process.env.VITE_DEV_SERVER_URL
        ? (T.loadURL(n), T.webContents.openDevTools())
        : T.loadFile(r, {
            hash: "home",
          }),
      T.webContents.setWindowOpenHandler(
        ({ url: a }) => (
          a.startsWith("https:") && et.openExternal(a),
          { action: "deny" }
        ),
      ));
    const l = new Dn(Ze("./images/logo.png"));
    l.setToolTip("fish-book");
    const c = Tn.buildFromTemplate([
      {
        label: "打开主界面",
        icon: Ze("./images/app.png"),
        click: () => {
          T.show();
        },
      },
      // { label: '设置', icon: path.join(__dirname, '../public/images/setting.png') },
      // { label: '关于', icon: path.join(__dirname, '../public/images/about.png') },
      {
        label: "退出",
        icon: Ze("./images/quit.png"),
        click: function () {
          v.quit();
        },
      },
    ]);
    (l.setContextMenu(c),
      l.on("double-click", () => {
        T.show();
      }));
  }
  let i = 0;
  (w.on("readFiles", async (l, c) => {
    try {
      const u = (await ie.promises.readdir(Ie)).filter((m) =>
        [".epub", ".txt", ".mobi"].includes(C.extname(m)),
      );
      l.reply("fileContent", u);
    } catch (a) {
      l.reply("readFilesError", a);
    }
  }),
    w.on("register-shortcuts", (l) => {
      Re(p);
    }),
    w.on("unregister-shortcuts", (l) => {
      Se();
    }),
    w.on("window-min", (l) => {
      const c = l.sender;
      K.fromWebContents(c).hide();
    }),
    w.on("window-max", (l) => {
      const c = l.sender;
      K.fromWebContents(c).maximize();
    }),
    w.on("window-close", (l) => {
      const c = l.sender;
      K.fromWebContents(c).hide();
    }),
    w.on("readWin-toggle", () => {
      (p.isVisible() ? p.hide() : p.show(),
        p.webContents.send("getCurrentWindowVisible", p.isVisible()));
    }),
    w.on("show-read-win", () => {
      p === null
        ? (console.log("摸鱼窗口是null"), e())
        : (p.show(),
          p.webContents.send("getCurrentWindowVisible", p.isVisible()));
    }),
    w.on("show-immersed-read", () => {
      ((ns = Xi(T)),
        p && (p == null || p.hide()),
        Ee && clearInterval(Ee),
        Se(),
        Re(p));
    }),
    w.on("set-resizable", (l, c) => {
      p.setResizable(c);
    }),
    w.on("update-sys-config", async (l, c = "moyu") => {
      (console.log("readMode ==>", c),
        c === "onlineRead"
          ? (console.log("当前是在线阅读"), await Ve(!1, !1))
          : (console.log("当前是本地阅读"), await Ae(!1, !1)));
    }),
    w.on("change-shortcut", () => {
      (Se(), Re(p));
    }),
    w.on("openURL", (l, c) => {
      (console.log(c), et.openExternal(c));
    }),
    w.on("window-reset", function () {
      (v.relaunch(), v.exit());
    }),
    w.on("quit-app", () => {
      v.quit();
    }),
    w.handle("getSysConfig", (l, c) => g.get(c)),
    w.handle("getAllSysConfig", (l) => g.store),
    w.handle("setSysConfig", (l, c, a) => {
      g.set(c, a);
    }),
    w.handle("deleteSysConfig", (l, c, a) => {
      g.delete(c);
    }),
    w.handle("get-chapters", (l, c) => vr(c)),
    w.handle("get-chapters-line-content", (l, c, a) => kr(c, a)),
    w.handle("search-book-content", (l, c, a, u) => Er(c, a, u)),
    w.on("get-sys-fonts", async (l) => {
      try {
        const c = await An.getFonts();
        l.reply("font-list", c);
      } catch (c) {
        (console.error("Failed to get system fonts:", c),
          l.reply("font-list", []));
      }
    }),
    w.on("reset-window-bounds", (l) => {
      const c = {
        width: 800,
        height: 40,
        x: Math.floor((i - 800) / 2),
        y: 0,
      };
      (g.set("windowBounds", c),
        p.setSize(c.width, c.height),
        p.setPosition(c.x, c.y));
    }));
  let s = null;
  (w.on("start-exe", (l, c) => {
    if (process.platform !== "win32") {
      l.reply("exe-status", {
        status: "closed",
        message: "当前系统不支持此 Windows 工具",
      });
      return;
    }
    if (s && !s.killed) {
      (console.log("程序已在运行"),
        l.reply("exe-status", { status: "running", message: "程序已在运行" }));
      return;
    }
    let a = "";
    (v.isPackaged
      ? (a = C.join(process.resourcesPath, "extraResources", c))
      : (a = C.join(v.getAppPath(), "resources", "extraResources", c)),
      $r(`正在启动：${a}`),
      console.log("正在启动：", a),
      (s = Vn(a, { detached: !0, stdio: "ignore" })),
      l.reply("exe-status", { status: "running", message: "程序启动成功" }),
      s.on("close", (u) => {
        ((s = null),
          u === 0
            ? (console.log("程序正常退出"),
              l.reply("exe-status", {
                status: "closed",
                message: "程序正常退出",
              }))
            : (console.error(`外部程序异常退出，退出码: ${u}`),
              l.reply("exe-status", {
                status: "closed",
                message: `异常退出，退出码: ${u}`,
              })));
      }),
      s.on("error", (u) => {
        (console.error("启动失败：", u),
          (s = null),
          l.reply("exe-status", {
            status: "closed",
            message: `启动失败：${u.message}`,
          }));
      }),
      s.unref());
  }),
    w.on("stop-exe", (l, c) => {
      zt(c);
    }),
    v.on("window-all-closed", () => {
      ((T = null), process.platform !== "darwin" && v.quit());
    }),
    v.on("activate", () => {
      K.getAllWindows().length === 0 && o();
    }),
    v.requestSingleInstanceLock()
      ? (v.on("second-instance", (l, c, a) => {
          T && (T.isMinimized() && T.restore(), T.show());
        }),
        v.on("ready", async () => {
          (zt(is),
            o(),
            e(),
            (Vt = new Gn(T)),
            w.on("check2update", function () {
              (console.log("开始检查---------------"),
                Pe.get("https://api.fish-book.com/checkUpdate")
                  .then((u) => {
                    (console.log(u.data),
                      g.set("update-info", u.data),
                      Vt.checkForUpdates(u.data.download_url));
                  })
                  .catch((u) => {
                    console.error("Error fetching data:", u);
                  }));
            }),
            g.set("version", v.getVersion()),
            T.on("focus", () => {
              (fe.register("f5", function () {
                console.log("f5 is pressed");
              }),
                fe.register("CommandOrControl+R", function () {
                  console.log("CommandOrControl+R is pressed");
                }),
                T.webContents.send("display-modal"));
            }),
            T.on("blur", () => {
              (fe.unregister("CommandOrControl+R"), fe.unregister("f5"));
            }));
          const l = 1e3,
            c = 400;
          let a = "";
        }))
      : v.quit(),
    v.on("will-quit", () => {
      Se();
    }),
    v.on("before-quit", () => {}),
    g.onDidAnyChange((l) => {
      const c = rs(l);
      (T.webContents.send("update-data", c),
        p.webContents.send("update-data", c));
    }));
} catch (e) {
  throw new Error(e);
}
w.on("set-auto-start", (e, t) => {
  (console.log("set-auto-start"),
    v.isPackaged &&
      (t
        ? v.setLoginItemSettings({
            openAtLogin: !0,
          })
        : v.setLoginItemSettings({
            openAtLogin: !1,
          })));
});
function rs(e) {
  for (let t in $e)
    t in e ||
      (console.log(t + "不在curentConfig中"), (e[t] = $e[t]), g.set(t, e[t]));
  return e;
}
function Ze(e) {
  return ve
    ? C.join(__dirname, "../../", "public", e)
    : C.join(process.env.VITE_PUBLIC, e);
}
let Ee = null;
const os = () => {
    (Ee && clearInterval(Ee),
      (Ee = setInterval(() => {
        (console.log("设置置顶"),
          p && p.setAlwaysOnTop(!0, "pop-up-menu"),
          setTimeout(() => {
            p && p.setAlwaysOnTop(!0, "screen-saver");
          }, 200));
      }, 1e3)));
  },
  is = "fish-opacity.exe";
function zt(e) {
  if (process.platform !== "win32") return;
  (console.log(`正在查找并关闭 ${e} ...`),
    tt(`tasklist | findstr /I ${e}`, (t, n) => {
      n.trim()
        ? tt(`taskkill /F /IM ${e} /T`, (r, o, i) => {
            r
              ? console.error(`❌ 关闭 ${e} 失败:`, i)
              : console.log(`✅ ${e} 已成功终止`);
          })
        : console.log(`ℹ️ 进程 ${e} 未运行`);
    }));
}
function ss(e) {
  if (process.platform !== "win32") return Promise.resolve(!1);
  return new Promise((t) => {
    tt("tasklist", (n, r) => {
      if (n) {
        (console.error("Error executing tasklist:", n), t(!1));
        return;
      }
      t(r.toLowerCase().includes(e.toLowerCase()));
    });
  });
}
w.handle("check-process", async (e, t) => await ss(t));
export { os as alwaysOnTopFunction };
