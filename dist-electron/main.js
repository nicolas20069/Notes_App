var rd = Object.defineProperty;
var pi = (e) => {
  throw TypeError(e);
};
var nd = (e, t, r) => t in e ? rd(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : e[t] = r;
var zr = (e, t, r) => nd(e, typeof t != "symbol" ? t + "" : t, r), Ps = (e, t, r) => t.has(e) || pi("Cannot " + r);
var B = (e, t, r) => (Ps(e, t, "read from private field"), r ? r.call(e) : t.get(e)), rt = (e, t, r) => t.has(e) ? pi("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, r), Ve = (e, t, r, n) => (Ps(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r), dt = (e, t, r) => (Ps(e, t, "access private method"), r);
import Gc, { ipcMain as ns, app as sd, BrowserWindow as ad } from "electron";
import { fileURLToPath as od } from "url";
import { dirname as id, join as $i } from "path";
import pe from "node:process";
import ae from "node:path";
import { promisify as Se, isDeepStrictEqual as yi } from "node:util";
import Y from "node:fs";
import Bt from "node:crypto";
import _i from "node:assert";
import ss from "node:os";
const ir = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Hc = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Wc = 1e6, cd = (e) => e >= "0" && e <= "9";
function Xc(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= Wc;
  }
  return !1;
}
function Ns(e, t) {
  return Hc.has(e) ? !1 : (e && Xc(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function ld(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let r = "", n = "start", s = !1, a = 0;
  for (const o of e) {
    if (a++, s) {
      r += o, s = !1;
      continue;
    }
    if (o === "\\") {
      if (n === "index")
        throw new Error(`Invalid character '${o}' in an index at position ${a}`);
      if (n === "indexEnd")
        throw new Error(`Invalid character '${o}' after an index at position ${a}`);
      s = !0, n = n === "start" ? "property" : n;
      continue;
    }
    switch (o) {
      case ".": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "property";
          break;
        }
        if (!Ns(r, t))
          return [];
        r = "", n = "property";
        break;
      }
      case "[": {
        if (n === "index")
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd") {
          n = "index";
          break;
        }
        if (n === "property" || n === "start") {
          if ((r || n === "property") && !Ns(r, t))
            return [];
          r = "";
        }
        n = "index";
        break;
      }
      case "]": {
        if (n === "index") {
          if (r === "")
            r = (t.pop() || "") + "[]", n = "property";
          else {
            const l = Number.parseInt(r, 10);
            !Number.isNaN(l) && Number.isFinite(l) && l >= 0 && l <= Number.MAX_SAFE_INTEGER && l <= Wc && r === String(l) ? t.push(l) : t.push(r), r = "", n = "indexEnd";
          }
          break;
        }
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        r += o;
        break;
      }
      default: {
        if (n === "index" && !cd(o))
          throw new Error(`Invalid character '${o}' in an index at position ${a}`);
        if (n === "indexEnd")
          throw new Error(`Invalid character '${o}' after an index at position ${a}`);
        n === "start" && (n = "property"), r += o;
      }
    }
  }
  switch (s && (r += "\\"), n) {
    case "property": {
      if (!Ns(r, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function as(e) {
  if (typeof e == "string")
    return ld(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [r, n] of e.entries()) {
      if (typeof n != "string" && typeof n != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${r}, got ${typeof n}`);
      if (typeof n == "number" && !Number.isFinite(n))
        throw new TypeError(`Path segment at index ${r} must be a finite number, got ${n}`);
      if (Hc.has(n))
        return [];
      typeof n == "string" && Xc(n) ? t.push(Number.parseInt(n, 10)) : t.push(n);
    }
    return t;
  }
  return [];
}
function gi(e, t, r) {
  if (!ir(e) || typeof t != "string" && !Array.isArray(t))
    return r === void 0 ? e : r;
  const n = as(t);
  if (n.length === 0)
    return r;
  for (let s = 0; s < n.length; s++) {
    const a = n[s];
    if (e = e[a], e == null) {
      if (s !== n.length - 1)
        return r;
      break;
    }
  }
  return e === void 0 ? r : e;
}
function pn(e, t, r) {
  if (!ir(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const n = e, s = as(t);
  if (s.length === 0)
    return e;
  for (let a = 0; a < s.length; a++) {
    const o = s[a];
    if (a === s.length - 1)
      e[o] = r;
    else if (!ir(e[o])) {
      const c = typeof s[a + 1] == "number";
      e[o] = c ? [] : {};
    }
    e = e[o];
  }
  return n;
}
function ud(e, t) {
  if (!ir(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = as(t);
  if (r.length === 0)
    return !1;
  for (let n = 0; n < r.length; n++) {
    const s = r[n];
    if (n === r.length - 1)
      return Object.hasOwn(e, s) ? (delete e[s], !0) : !1;
    if (e = e[s], !ir(e))
      return !1;
  }
}
function Rs(e, t) {
  if (!ir(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const r = as(t);
  if (r.length === 0)
    return !1;
  for (const n of r) {
    if (!ir(e) || !(n in e))
      return !1;
    e = e[n];
  }
  return !0;
}
const It = ss.homedir(), pa = ss.tmpdir(), { env: gr } = pe, dd = (e) => {
  const t = ae.join(It, "Library");
  return {
    data: ae.join(t, "Application Support", e),
    config: ae.join(t, "Preferences", e),
    cache: ae.join(t, "Caches", e),
    log: ae.join(t, "Logs", e),
    temp: ae.join(pa, e)
  };
}, fd = (e) => {
  const t = gr.APPDATA || ae.join(It, "AppData", "Roaming"), r = gr.LOCALAPPDATA || ae.join(It, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: ae.join(r, e, "Data"),
    config: ae.join(t, e, "Config"),
    cache: ae.join(r, e, "Cache"),
    log: ae.join(r, e, "Log"),
    temp: ae.join(pa, e)
  };
}, hd = (e) => {
  const t = ae.basename(It);
  return {
    data: ae.join(gr.XDG_DATA_HOME || ae.join(It, ".local", "share"), e),
    config: ae.join(gr.XDG_CONFIG_HOME || ae.join(It, ".config"), e),
    cache: ae.join(gr.XDG_CACHE_HOME || ae.join(It, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: ae.join(gr.XDG_STATE_HOME || ae.join(It, ".local", "state"), e),
    temp: ae.join(pa, t, e)
  };
};
function md(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), pe.platform === "darwin" ? dd(e) : pe.platform === "win32" ? fd(e) : hd(e);
}
const gt = (e, t) => function(...n) {
  return e.apply(void 0, n).catch(t);
}, ft = (e, t) => function(...n) {
  try {
    return e.apply(void 0, n);
  } catch (s) {
    return t(s);
  }
}, pd = pe.getuid ? !pe.getuid() : !1, $d = 1e4, Fe = () => {
}, de = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!de.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !pd && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!de.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!de.isNodeError(e))
      throw e;
    if (!de.isChangeErrorOk(e))
      throw e;
  }
};
class yd {
  constructor() {
    this.interval = 25, this.intervalId = void 0, this.limit = $d, this.queueActive = /* @__PURE__ */ new Set(), this.queueWaiting = /* @__PURE__ */ new Set(), this.init = () => {
      this.intervalId || (this.intervalId = setInterval(this.tick, this.interval));
    }, this.reset = () => {
      this.intervalId && (clearInterval(this.intervalId), delete this.intervalId);
    }, this.add = (t) => {
      this.queueWaiting.add(t), this.queueActive.size < this.limit / 2 ? this.tick() : this.init();
    }, this.remove = (t) => {
      this.queueWaiting.delete(t), this.queueActive.delete(t);
    }, this.schedule = () => new Promise((t) => {
      const r = () => this.remove(n), n = () => t(r);
      this.add(n);
    }), this.tick = () => {
      if (!(this.queueActive.size >= this.limit)) {
        if (!this.queueWaiting.size)
          return this.reset();
        for (const t of this.queueWaiting) {
          if (this.queueActive.size >= this.limit)
            break;
          this.queueWaiting.delete(t), this.queueActive.add(t), t();
        }
      }
    };
  }
}
const _d = new yd(), vt = (e, t) => function(n) {
  return function s(...a) {
    return _d.schedule().then((o) => {
      const l = (d) => (o(), d), c = (d) => {
        if (o(), Date.now() >= n)
          throw d;
        if (t(d)) {
          const u = Math.round(100 * Math.random());
          return new Promise((b) => setTimeout(b, u)).then(() => s.apply(void 0, a));
        }
        throw d;
      };
      return e.apply(void 0, a).then(l, c);
    });
  };
}, wt = (e, t) => function(n) {
  return function s(...a) {
    try {
      return e.apply(void 0, a);
    } catch (o) {
      if (Date.now() > n)
        throw o;
      if (t(o))
        return s.apply(void 0, a);
      throw o;
    }
  };
}, Re = {
  attempt: {
    /* ASYNC */
    chmod: gt(Se(Y.chmod), de.onChangeError),
    chown: gt(Se(Y.chown), de.onChangeError),
    close: gt(Se(Y.close), Fe),
    fsync: gt(Se(Y.fsync), Fe),
    mkdir: gt(Se(Y.mkdir), Fe),
    realpath: gt(Se(Y.realpath), Fe),
    stat: gt(Se(Y.stat), Fe),
    unlink: gt(Se(Y.unlink), Fe),
    /* SYNC */
    chmodSync: ft(Y.chmodSync, de.onChangeError),
    chownSync: ft(Y.chownSync, de.onChangeError),
    closeSync: ft(Y.closeSync, Fe),
    existsSync: ft(Y.existsSync, Fe),
    fsyncSync: ft(Y.fsync, Fe),
    mkdirSync: ft(Y.mkdirSync, Fe),
    realpathSync: ft(Y.realpathSync, Fe),
    statSync: ft(Y.statSync, Fe),
    unlinkSync: ft(Y.unlinkSync, Fe)
  },
  retry: {
    /* ASYNC */
    close: vt(Se(Y.close), de.isRetriableError),
    fsync: vt(Se(Y.fsync), de.isRetriableError),
    open: vt(Se(Y.open), de.isRetriableError),
    readFile: vt(Se(Y.readFile), de.isRetriableError),
    rename: vt(Se(Y.rename), de.isRetriableError),
    stat: vt(Se(Y.stat), de.isRetriableError),
    write: vt(Se(Y.write), de.isRetriableError),
    writeFile: vt(Se(Y.writeFile), de.isRetriableError),
    /* SYNC */
    closeSync: wt(Y.closeSync, de.isRetriableError),
    fsyncSync: wt(Y.fsyncSync, de.isRetriableError),
    openSync: wt(Y.openSync, de.isRetriableError),
    readFileSync: wt(Y.readFileSync, de.isRetriableError),
    renameSync: wt(Y.renameSync, de.isRetriableError),
    statSync: wt(Y.statSync, de.isRetriableError),
    writeSync: wt(Y.writeSync, de.isRetriableError),
    writeFileSync: wt(Y.writeFileSync, de.isRetriableError)
  }
}, gd = "utf8", vi = 438, vd = 511, wd = {}, Ed = ss.userInfo().uid, bd = ss.userInfo().gid, Sd = 1e3, Pd = !!pe.getuid;
pe.getuid && pe.getuid();
const wi = 128, Nd = (e) => e instanceof Error && "code" in e, Ei = (e) => typeof e == "string", Os = (e) => e === void 0, Rd = pe.platform === "linux", Jc = pe.platform === "win32", $a = ["SIGABRT", "SIGALRM", "SIGHUP", "SIGINT", "SIGTERM"];
Jc || $a.push("SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Rd && $a.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT", "SIGUNUSED");
class Od {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const r of this.callbacks)
          r();
        t && (Jc && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? pe.kill(pe.pid, "SIGTERM") : pe.kill(pe.pid, t));
      }
    }, this.hook = () => {
      pe.once("exit", () => this.exit());
      for (const t of $a)
        try {
          pe.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Id = new Od(), Td = Id.register, Oe = {
  /* VARIABLES */
  store: {},
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), s = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${s}`;
  },
  get: (e, t, r = !0) => {
    const n = Oe.truncate(t(e));
    return n in Oe.store ? Oe.get(e, t, r) : (Oe.store[n] = r, [n, () => delete Oe.store[n]]);
  },
  purge: (e) => {
    Oe.store[e] && (delete Oe.store[e], Re.attempt.unlink(e));
  },
  purgeSync: (e) => {
    Oe.store[e] && (delete Oe.store[e], Re.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in Oe.store)
      Oe.purgeSync(e);
  },
  truncate: (e) => {
    const t = ae.basename(e);
    if (t.length <= wi)
      return e;
    const r = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!r)
      return e;
    const n = t.length - wi;
    return `${e.slice(0, -t.length)}${r[1]}${r[2].slice(0, -n)}${r[3]}`;
  }
};
Td(Oe.purgeSyncAll);
function Bc(e, t, r = wd) {
  if (Ei(r))
    return Bc(e, t, { encoding: r });
  const n = Date.now() + ((r.timeout ?? Sd) || -1);
  let s = null, a = null, o = null;
  try {
    const l = Re.attempt.realpathSync(e), c = !!l;
    e = l || e, [a, s] = Oe.get(e, r.tmpCreate || Oe.create, r.tmpPurge !== !1);
    const d = Pd && Os(r.chown), u = Os(r.mode);
    if (c && (d || u)) {
      const h = Re.attempt.statSync(e);
      h && (r = { ...r }, d && (r.chown = { uid: h.uid, gid: h.gid }), u && (r.mode = h.mode));
    }
    if (!c) {
      const h = ae.dirname(e);
      Re.attempt.mkdirSync(h, {
        mode: vd,
        recursive: !0
      });
    }
    o = Re.retry.openSync(n)(a, "w", r.mode || vi), r.tmpCreated && r.tmpCreated(a), Ei(t) ? Re.retry.writeSync(n)(o, t, 0, r.encoding || gd) : Os(t) || Re.retry.writeSync(n)(o, t, 0, t.length, 0), r.fsync !== !1 && (r.fsyncWait !== !1 ? Re.retry.fsyncSync(n)(o) : Re.attempt.fsync(o)), Re.retry.closeSync(n)(o), o = null, r.chown && (r.chown.uid !== Ed || r.chown.gid !== bd) && Re.attempt.chownSync(a, r.chown.uid, r.chown.gid), r.mode && r.mode !== vi && Re.attempt.chmodSync(a, r.mode);
    try {
      Re.retry.renameSync(n)(a, e);
    } catch (h) {
      if (!Nd(h) || h.code !== "ENAMETOOLONG")
        throw h;
      Re.retry.renameSync(n)(a, Oe.truncate(e));
    }
    s(), a = null;
  } finally {
    o && Re.attempt.closeSync(o), a && Oe.purge(a);
  }
}
function Yc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ys = { exports: {} }, Qc = {}, Ze = {}, Pr = {}, cn = {}, Q = {}, an = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function b(m) {
    return new n(g(m));
  }
  e.stringify = b;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function y(m) {
    return new n(m.toString());
  }
  e.regexpCode = y;
})(an);
var Qs = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = an;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const b = this.toName(d), { prefix: g } = b, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, b);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = u.ref, b.setValue(u, { property: g, itemIndex: m }), b;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (b) => {
        if (b.value === void 0)
          throw new Error(`CodeGen: name "${b}" has no value`);
        return b.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, b) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const y = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (y.has(m))
            return;
          y.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = b == null ? void 0 : b(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          y.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(Qs);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = an, r = Qs;
  var n = an;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = Qs;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, E) {
      super(), this.varKind = i, this.name = f, this.rhs = E;
    }
    render({ es5: i, _n: f }) {
      const E = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${E} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, E) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = E;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return se(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, E, I) {
      super(i, E, I), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class b extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, E) => f + E.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const E = i[f].optimizeNodes();
        Array.isArray(E) ? i.splice(f, 1, ...E) : E ? i[f] = E : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: E } = this;
      let I = E.length;
      for (; I--; ) {
        const j = E[I];
        j.optimizeNames(i, f) || (k(i, j.names), E.splice(I, 1));
      }
      return E.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class y extends w {
  }
  y.kind = "else";
  class m extends w {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const E = f.optimizeNodes();
        f = this.else = Array.isArray(E) ? new y(E) : E;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(L(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var E;
      if (this.else = (E = this.else) === null || E === void 0 ? void 0 : E.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return se(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, E, I) {
      super(), this.varKind = i, this.name = f, this.from = E, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: E, from: I, to: j } = this;
      return `for(${f} ${E}=${I}; ${E}<${j}; ${E}++)` + super.render(i);
    }
    get names() {
      const i = se(super.names, this.from);
      return se(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, E, I) {
      super(), this.loop = i, this.varKind = f, this.name = E, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, E) {
      super(), this.name = i, this.args = f, this.async = E;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class J extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  J.kind = "return";
  class ue extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var E, I;
      return super.optimizeNames(i, f), (E = this.catch) === null || E === void 0 || E.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class fe extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  fe.kind = "catch";
  class $e extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class z {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const E = this._extScope.value(i, f);
      return (this._values[E.prefix] || (this._values[E.prefix] = /* @__PURE__ */ new Set())).add(E), E;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, E, I) {
      const j = this._scope.toName(f);
      return E !== void 0 && I && (this._constants[j.str] = E), this._leafNode(new o(i, j, E)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, E) {
      return this._def(r.varKinds.const, i, f, E);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, E) {
      return this._def(r.varKinds.let, i, f, E);
    }
    // `var` declaration with optional assignment
    var(i, f, E) {
      return this._def(r.varKinds.var, i, f, E);
    }
    // assignment code
    assign(i, f, E) {
      return this._leafNode(new l(i, f, E));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new b(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [E, I] of i)
        f.length > 1 && f.push(","), f.push(E), (E !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, E) {
      if (this._blockNode(new m(i)), f && E)
        this.code(f).else().code(E).endIf();
      else if (f)
        this.code(f).endIf();
      else if (E)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new y());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, y);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, E, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, E), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, E, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (V) => {
          this.var(j, (0, t._)`${F}[${V}]`), E(j);
        });
      }
      return this._for(new O("of", I, j, f), () => E(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, E, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, E);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => E(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new J();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(i, f, E) {
      if (!f && !E)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new ue();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new fe(j), f(j);
      }
      return E && (this._currNode = I.finally = new $e(), this.code(E)), this._endBlockNode(fe, $e);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const E = this._nodes.length - f;
      if (E < 0 || i !== void 0 && E !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${E} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, E, I) {
      return this._blockNode(new K(i, f, E)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const E = this._currNode;
      if (E instanceof i || f && E instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = z;
  function H($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) + (i[f] || 0);
    return $;
  }
  function se($, i) {
    return i instanceof t._CodeOrName ? H($, i.names) : $;
  }
  function T($, i, f) {
    if ($ instanceof t.Name)
      return E($);
    if (!I($))
      return $;
    return new t._Code($._items.reduce((j, F) => (F instanceof t.Name && (F = E(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function E(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function L($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = L;
  const D = p(e.operators.AND);
  function G(...$) {
    return $.reduce(D);
  }
  e.and = G;
  const M = p(e.operators.OR);
  function P(...$) {
    return $.reduce(M);
  }
  e.or = P;
  function p($) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${$} ${S(f)}`;
  }
  function S($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(Q);
var A = {};
Object.defineProperty(A, "__esModule", { value: !0 });
A.checkStrictMode = A.getErrorPath = A.Type = A.useFunc = A.setEvaluated = A.evaluatedPropsToName = A.mergeEvaluated = A.eachItem = A.unescapeJsonPointer = A.escapeJsonPointer = A.escapeFragment = A.unescapeFragment = A.schemaRefOrVal = A.schemaHasRulesButRef = A.schemaHasRules = A.checkUnknownRules = A.alwaysValidSchema = A.toHash = void 0;
const oe = Q, jd = an;
function kd(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
A.toHash = kd;
function Ad(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Zc(e, t), !xc(t, e.self.RULES.all));
}
A.alwaysValidSchema = Ad;
function Zc(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || rl(e, `unknown keyword: "${a}"`);
}
A.checkUnknownRules = Zc;
function xc(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
A.schemaHasRules = xc;
function Cd(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
A.schemaHasRulesButRef = Cd;
function Dd({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, oe._)`${r}`;
  }
  return (0, oe._)`${e}${t}${(0, oe.getProperty)(n)}`;
}
A.schemaRefOrVal = Dd;
function Md(e) {
  return el(decodeURIComponent(e));
}
A.unescapeFragment = Md;
function Ld(e) {
  return encodeURIComponent(ya(e));
}
A.escapeFragment = Ld;
function ya(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
A.escapeJsonPointer = ya;
function el(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
A.unescapeJsonPointer = el;
function Vd(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
A.eachItem = Vd;
function bi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof oe.Name ? (a instanceof oe.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof oe.Name ? (t(s, o, a), a) : r(a, o);
    return l === oe.Name && !(c instanceof oe.Name) ? n(s, c) : c;
  };
}
A.mergeEvaluated = {
  props: bi({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, oe._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, oe._)`${r} || {}`).code((0, oe._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, oe._)`${r} || {}`), _a(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: tl
  }),
  items: bi({
    mergeNames: (e, t, r) => e.if((0, oe._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, oe._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, oe._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, oe._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function tl(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, oe._)`{}`);
  return t !== void 0 && _a(e, r, t), r;
}
A.evaluatedPropsToName = tl;
function _a(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, oe._)`${t}${(0, oe.getProperty)(n)}`, !0));
}
A.setEvaluated = _a;
const Si = {};
function Fd(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Si[t.code] || (Si[t.code] = new jd._Code(t.code))
  });
}
A.useFunc = Fd;
var Zs;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Zs || (A.Type = Zs = {}));
function zd(e, t, r) {
  if (e instanceof oe.Name) {
    const n = t === Zs.Num;
    return r ? n ? (0, oe._)`"[" + ${e} + "]"` : (0, oe._)`"['" + ${e} + "']"` : n ? (0, oe._)`"/" + ${e}` : (0, oe._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, oe.getProperty)(e).toString() : "/" + ya(e);
}
A.getErrorPath = zd;
function rl(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
A.checkStrictMode = rl;
var ze = {};
Object.defineProperty(ze, "__esModule", { value: !0 });
const Pe = Q, Ud = {
  // validation function arguments
  data: new Pe.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Pe.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Pe.Name("instancePath"),
  parentData: new Pe.Name("parentData"),
  parentDataProperty: new Pe.Name("parentDataProperty"),
  rootData: new Pe.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Pe.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Pe.Name("vErrors"),
  // null or array of validation errors
  errors: new Pe.Name("errors"),
  // counter of validation errors
  this: new Pe.Name("this"),
  // "globals"
  self: new Pe.Name("self"),
  scope: new Pe.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Pe.Name("json"),
  jsonPos: new Pe.Name("jsonPos"),
  jsonLen: new Pe.Name("jsonLen"),
  jsonPart: new Pe.Name("jsonPart")
};
ze.default = Ud;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = Q, r = A, n = ze;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: O, compositeRule: K, allErrors: J } = R, ue = h(y, m, v);
    N ?? (K || J) ? c(O, ue) : d(R, (0, t._)`[${ue}]`);
  }
  e.reportError = s;
  function a(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: O, allErrors: K } = N, J = h(y, m, v);
    c(R, J), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = y.name("err");
    y.forRange("i", R, n.default.errors, (J) => {
      y.const(K, (0, t._)`${n.default.vErrors}[${J}]`), y.if((0, t._)`${K}.instancePath === undefined`, () => y.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), y.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && (y.assign((0, t._)`${K}.schema`, v), y.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : b(y, m, v);
  }
  function b(y, m, v = {}) {
    const { gen: N, it: R } = y, O = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, O), N.object(...O);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: J } = y, { opts: ue, propertyName: fe, topSchemaRef: $e, schemaPath: z } = J;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), ue.messages && N.push([u.message, typeof v == "function" ? v(y) : v]), ue.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${$e}${z}`], [n.default.data, O]), fe && N.push([u.propertyName, fe]);
  }
})(cn);
Object.defineProperty(Pr, "__esModule", { value: !0 });
Pr.boolOrEmptySchema = Pr.topBoolOrEmptySchema = void 0;
const qd = cn, Kd = Q, Gd = ze, Hd = {
  message: "boolean schema is false"
};
function Wd(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? nl(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(Gd.default.data) : (t.assign((0, Kd._)`${n}.errors`, null), t.return(!0));
}
Pr.topBoolOrEmptySchema = Wd;
function Xd(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), nl(e)) : r.var(t, !0);
}
Pr.boolOrEmptySchema = Xd;
function nl(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, qd.reportError)(s, Hd, void 0, t);
}
var ye = {}, cr = {};
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.getRules = cr.isJSONType = void 0;
const Jd = ["string", "number", "integer", "boolean", "null", "object", "array"], Bd = new Set(Jd);
function Yd(e) {
  return typeof e == "string" && Bd.has(e);
}
cr.isJSONType = Yd;
function Qd() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
cr.getRules = Qd;
var ht = {};
Object.defineProperty(ht, "__esModule", { value: !0 });
ht.shouldUseRule = ht.shouldUseGroup = ht.schemaHasRulesForType = void 0;
function Zd({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && sl(e, n);
}
ht.schemaHasRulesForType = Zd;
function sl(e, t) {
  return t.rules.some((r) => al(e, r));
}
ht.shouldUseGroup = sl;
function al(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
ht.shouldUseRule = al;
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.reportTypeError = ye.checkDataTypes = ye.checkDataType = ye.coerceAndCheckDataType = ye.getJSONTypes = ye.getSchemaTypes = ye.DataType = void 0;
const xd = cr, ef = ht, tf = cn, Z = Q, ol = A;
var vr;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(vr || (ye.DataType = vr = {}));
function rf(e) {
  const t = il(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
ye.getSchemaTypes = rf;
function il(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(xd.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
ye.getJSONTypes = il;
function nf(e, t) {
  const { gen: r, data: n, opts: s } = e, a = sf(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, ef.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = ga(t, n, s.strictNumbers, vr.Wrong);
    r.if(l, () => {
      a.length ? af(e, t, a) : va(e);
    });
  }
  return o;
}
ye.coerceAndCheckDataType = nf;
const cl = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function sf(e, t) {
  return t ? e.filter((r) => cl.has(r) || t === "array" && r === "array") : [];
}
function af(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, Z._)`typeof ${s}`), l = n.let("coerced", (0, Z._)`undefined`);
  a.coerceTypes === "array" && n.if((0, Z._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, Z._)`${s}[0]`).assign(o, (0, Z._)`typeof ${s}`).if(ga(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, Z._)`${l} !== undefined`);
  for (const d of r)
    (cl.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), va(e), n.endIf(), n.if((0, Z._)`${l} !== undefined`, () => {
    n.assign(s, l), of(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, Z._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, Z._)`"" + ${s}`).elseIf((0, Z._)`${s} === null`).assign(l, (0, Z._)`""`);
        return;
      case "number":
        n.elseIf((0, Z._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, Z._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, Z._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, Z._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, Z._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, Z._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, Z._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, Z._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, Z._)`[${s}]`);
    }
  }
}
function of({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, Z._)`${t} !== undefined`, () => e.assign((0, Z._)`${t}[${r}]`, n));
}
function xs(e, t, r, n = vr.Correct) {
  const s = n === vr.Correct ? Z.operators.EQ : Z.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, Z._)`${t} ${s} null`;
    case "array":
      a = (0, Z._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, Z._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, Z._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, Z._)`typeof ${t} ${s} ${e}`;
  }
  return n === vr.Correct ? a : (0, Z.not)(a);
  function o(l = Z.nil) {
    return (0, Z.and)((0, Z._)`typeof ${t} == "number"`, l, r ? (0, Z._)`isFinite(${t})` : Z.nil);
  }
}
ye.checkDataType = xs;
function ga(e, t, r, n) {
  if (e.length === 1)
    return xs(e[0], t, r, n);
  let s;
  const a = (0, ol.toHash)(e);
  if (a.array && a.object) {
    const o = (0, Z._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, Z._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = Z.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, Z.and)(s, xs(o, t, r, n));
  return s;
}
ye.checkDataTypes = ga;
const cf = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, Z._)`{type: ${e}}` : (0, Z._)`{type: ${t}}`
};
function va(e) {
  const t = lf(e);
  (0, tf.reportError)(t, cf);
}
ye.reportTypeError = va;
function lf(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, ol.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var os = {};
Object.defineProperty(os, "__esModule", { value: !0 });
os.assignDefaults = void 0;
const fr = Q, uf = A;
function df(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      Pi(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => Pi(e, a, s.default));
}
os.assignDefaults = df;
function Pi(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, fr._)`${a}${(0, fr.getProperty)(t)}`;
  if (s) {
    (0, uf.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, fr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, fr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, fr._)`${l} = ${(0, fr.stringify)(r)}`);
}
var it = {}, te = {};
Object.defineProperty(te, "__esModule", { value: !0 });
te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
const ce = Q, wa = A, Et = ze, ff = A;
function hf(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(ba(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, ce._)`${t}` }, !0), e.error();
  });
}
te.checkReportMissingProp = hf;
function mf({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, ce.or)(...n.map((a) => (0, ce.and)(ba(e, t, a, r.ownProperties), (0, ce._)`${s} = ${a}`)));
}
te.checkMissingProp = mf;
function pf(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
te.reportMissingProp = pf;
function ll(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, ce._)`Object.prototype.hasOwnProperty`
  });
}
te.hasPropFunc = ll;
function Ea(e, t, r) {
  return (0, ce._)`${ll(e)}.call(${t}, ${r})`;
}
te.isOwnProperty = Ea;
function $f(e, t, r, n) {
  const s = (0, ce._)`${t}${(0, ce.getProperty)(r)} !== undefined`;
  return n ? (0, ce._)`${s} && ${Ea(e, t, r)}` : s;
}
te.propertyInData = $f;
function ba(e, t, r, n) {
  const s = (0, ce._)`${t}${(0, ce.getProperty)(r)} === undefined`;
  return n ? (0, ce.or)(s, (0, ce.not)(Ea(e, t, r))) : s;
}
te.noPropertyInData = ba;
function ul(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
te.allSchemaProperties = ul;
function yf(e, t) {
  return ul(t).filter((r) => !(0, wa.alwaysValidSchema)(e, t[r]));
}
te.schemaProperties = yf;
function _f({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, ce._)`${e}, ${t}, ${n}${s}` : t, h = [
    [Et.default.instancePath, (0, ce.strConcat)(Et.default.instancePath, a)],
    [Et.default.parentData, o.parentData],
    [Et.default.parentDataProperty, o.parentDataProperty],
    [Et.default.rootData, Et.default.rootData]
  ];
  o.opts.dynamicRef && h.push([Et.default.dynamicAnchors, Et.default.dynamicAnchors]);
  const b = (0, ce._)`${u}, ${r.object(...h)}`;
  return c !== ce.nil ? (0, ce._)`${l}.call(${c}, ${b})` : (0, ce._)`${l}(${b})`;
}
te.callValidateCode = _f;
const gf = (0, ce._)`new RegExp`;
function vf({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, ce._)`${s.code === "new RegExp" ? gf : (0, ff.useFunc)(e, s)}(${r}, ${n})`
  });
}
te.usePattern = vf;
function wf(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, ce._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: wa.Type.Num
      }, a), t.if((0, ce.not)(a), l);
    });
  }
}
te.validateArray = wf;
function Ef(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, wa.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, ce._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, ce.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
te.validateUnion = Ef;
Object.defineProperty(it, "__esModule", { value: !0 });
it.validateKeywordUsage = it.validSchemaType = it.funcKeywordCode = it.macroKeywordCode = void 0;
const Ie = Q, Zt = ze, bf = te, Sf = cn;
function Pf(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = dl(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Ie.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
it.macroKeywordCode = Pf;
function Nf(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  Of(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = dl(n, s, d), h = n.let("valid");
  e.block$data(h, b), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function b() {
    if (t.errors === !1)
      _(), t.modifying && Ni(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && Ni(e), y(() => Rf(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Ie._)`await `), (v) => n.assign(h, !1).if((0, Ie._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Ie._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Ie._)`${u}.errors`;
    return n.assign(m, null), _(Ie.nil), m;
  }
  function _(m = t.async ? (0, Ie._)`await ` : Ie.nil) {
    const v = c.opts.passContext ? Zt.default.this : Zt.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Ie._)`${m}${(0, bf.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Ie.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
it.funcKeywordCode = Nf;
function Ni(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Ie._)`${n.parentData}[${n.parentDataProperty}]`));
}
function Rf(e, t) {
  const { gen: r } = e;
  r.if((0, Ie._)`Array.isArray(${t})`, () => {
    r.assign(Zt.default.vErrors, (0, Ie._)`${Zt.default.vErrors} === null ? ${t} : ${Zt.default.vErrors}.concat(${t})`).assign(Zt.default.errors, (0, Ie._)`${Zt.default.vErrors}.length`), (0, Sf.extendErrors)(e);
  }, () => e.error());
}
function Of({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function dl(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Ie.stringify)(r) });
}
function If(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
it.validSchemaType = If;
function Tf({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
it.validateKeywordUsage = Tf;
var At = {};
Object.defineProperty(At, "__esModule", { value: !0 });
At.extendSubschemaMode = At.extendSubschemaData = At.getSubschema = void 0;
const at = Q, fl = A;
function jf(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, at._)`${e.schemaPath}${(0, at.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, at._)`${e.schemaPath}${(0, at.getProperty)(t)}${(0, at.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, fl.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
At.getSubschema = jf;
function kf(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, b = l.let("data", (0, at._)`${t.data}${(0, at.getProperty)(r)}`, !0);
    c(b), e.errorPath = (0, at.str)`${d}${(0, fl.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, at._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof at.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
At.extendSubschemaData = kf;
function Af(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
At.extendSubschemaMode = Af;
var Ee = {}, is = function e(t, r) {
  if (t === r) return !0;
  if (t && r && typeof t == "object" && typeof r == "object") {
    if (t.constructor !== r.constructor) return !1;
    var n, s, a;
    if (Array.isArray(t)) {
      if (n = t.length, n != r.length) return !1;
      for (s = n; s-- !== 0; )
        if (!e(t[s], r[s])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === r.source && t.flags === r.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === r.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === r.toString();
    if (a = Object.keys(t), n = a.length, n !== Object.keys(r).length) return !1;
    for (s = n; s-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(r, a[s])) return !1;
    for (s = n; s-- !== 0; ) {
      var o = a[s];
      if (!e(t[o], r[o])) return !1;
    }
    return !0;
  }
  return t !== t && r !== r;
}, hl = { exports: {} }, jt = hl.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Mn(t, n, s, e, "", e);
};
jt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
jt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
jt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
jt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Mn(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in jt.arrayKeywords)
          for (var b = 0; b < h.length; b++)
            Mn(e, t, r, h[b], s + "/" + u + "/" + b, a, s, u, n, b);
      } else if (u in jt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Mn(e, t, r, h[g], s + "/" + u + "/" + Cf(g), a, s, u, n, g);
      } else (u in jt.keywords || e.allKeys && !(u in jt.skipKeywords)) && Mn(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function Cf(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Df = hl.exports;
Object.defineProperty(Ee, "__esModule", { value: !0 });
Ee.getSchemaRefs = Ee.resolveUrl = Ee.normalizeId = Ee._getFullPath = Ee.getFullPath = Ee.inlineRef = void 0;
const Mf = A, Lf = is, Vf = Df, Ff = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function zf(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !ea(e) : t ? ml(e) <= t : !1;
}
Ee.inlineRef = zf;
const Uf = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function ea(e) {
  for (const t in e) {
    if (Uf.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(ea) || typeof r == "object" && ea(r))
      return !0;
  }
  return !1;
}
function ml(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !Ff.has(r) && (typeof e[r] == "object" && (0, Mf.eachItem)(e[r], (n) => t += ml(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function pl(e, t = "", r) {
  r !== !1 && (t = wr(t));
  const n = e.parse(t);
  return $l(e, n);
}
Ee.getFullPath = pl;
function $l(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
Ee._getFullPath = $l;
const qf = /#\/?$/;
function wr(e) {
  return e ? e.replace(qf, "") : "";
}
Ee.normalizeId = wr;
function Kf(e, t, r) {
  return r = wr(r), e.resolve(t, r);
}
Ee.resolveUrl = Kf;
const Gf = /^[a-z_][-a-z0-9._]*$/i;
function Hf(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = wr(e[r] || t), a = { "": s }, o = pl(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return Vf(e, { allKeys: !0 }, (h, b, g, w) => {
    if (w === void 0)
      return;
    const _ = o + b;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[b] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = wr(y ? R(y, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== wr(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!Gf.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, b, g) {
    if (b !== void 0 && !Lf(h, b))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
Ee.getSchemaRefs = Hf;
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.getData = Ze.KeywordCxt = Ze.validateFunctionCode = void 0;
const yl = Pr, Ri = ye, Sa = ht, Wn = ye, Wf = os, Br = it, Is = At, U = Q, W = ze, Xf = Ee, mt = A, Ur = cn;
function Jf(e) {
  if (vl(e) && (wl(e), gl(e))) {
    Qf(e);
    return;
  }
  _l(e, () => (0, yl.topBoolOrEmptySchema)(e));
}
Ze.validateFunctionCode = Jf;
function _l({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, U._)`${W.default.data}, ${W.default.valCxt}`, n.$async, () => {
    e.code((0, U._)`"use strict"; ${Oi(r, s)}`), Yf(e, s), e.code(a);
  }) : e.func(t, (0, U._)`${W.default.data}, ${Bf(s)}`, n.$async, () => e.code(Oi(r, s)).code(a));
}
function Bf(e) {
  return (0, U._)`{${W.default.instancePath}="", ${W.default.parentData}, ${W.default.parentDataProperty}, ${W.default.rootData}=${W.default.data}${e.dynamicRef ? (0, U._)`, ${W.default.dynamicAnchors}={}` : U.nil}}={}`;
}
function Yf(e, t) {
  e.if(W.default.valCxt, () => {
    e.var(W.default.instancePath, (0, U._)`${W.default.valCxt}.${W.default.instancePath}`), e.var(W.default.parentData, (0, U._)`${W.default.valCxt}.${W.default.parentData}`), e.var(W.default.parentDataProperty, (0, U._)`${W.default.valCxt}.${W.default.parentDataProperty}`), e.var(W.default.rootData, (0, U._)`${W.default.valCxt}.${W.default.rootData}`), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, U._)`${W.default.valCxt}.${W.default.dynamicAnchors}`);
  }, () => {
    e.var(W.default.instancePath, (0, U._)`""`), e.var(W.default.parentData, (0, U._)`undefined`), e.var(W.default.parentDataProperty, (0, U._)`undefined`), e.var(W.default.rootData, W.default.data), t.dynamicRef && e.var(W.default.dynamicAnchors, (0, U._)`{}`);
  });
}
function Qf(e) {
  const { schema: t, opts: r, gen: n } = e;
  _l(e, () => {
    r.$comment && t.$comment && bl(e), rh(e), n.let(W.default.vErrors, null), n.let(W.default.errors, 0), r.unevaluated && Zf(e), El(e), ah(e);
  });
}
function Zf(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, U._)`${r}.evaluated`), t.if((0, U._)`${e.evaluated}.dynamicProps`, () => t.assign((0, U._)`${e.evaluated}.props`, (0, U._)`undefined`)), t.if((0, U._)`${e.evaluated}.dynamicItems`, () => t.assign((0, U._)`${e.evaluated}.items`, (0, U._)`undefined`));
}
function Oi(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, U._)`/*# sourceURL=${r} */` : U.nil;
}
function xf(e, t) {
  if (vl(e) && (wl(e), gl(e))) {
    eh(e, t);
    return;
  }
  (0, yl.boolOrEmptySchema)(e, t);
}
function gl({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function vl(e) {
  return typeof e.schema != "boolean";
}
function eh(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && bl(e), nh(e), sh(e);
  const a = n.const("_errs", W.default.errors);
  El(e, a), n.var(t, (0, U._)`${a} === ${W.default.errors}`);
}
function wl(e) {
  (0, mt.checkUnknownRules)(e), th(e);
}
function El(e, t) {
  if (e.opts.jtd)
    return Ii(e, [], !1, t);
  const r = (0, Ri.getSchemaTypes)(e.schema), n = (0, Ri.coerceAndCheckDataType)(e, r);
  Ii(e, r, !n, t);
}
function th(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, mt.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function rh(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, mt.checkStrictMode)(e, "default is ignored in the schema root");
}
function nh(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Xf.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function sh(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function bl({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, U._)`${W.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, U.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, U._)`${W.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function ah(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, U._)`${W.default.errors} === 0`, () => t.return(W.default.data), () => t.throw((0, U._)`new ${s}(${W.default.vErrors})`)) : (t.assign((0, U._)`${n}.errors`, W.default.vErrors), a.unevaluated && oh(e), t.return((0, U._)`${W.default.errors} === 0`));
}
function oh({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof U.Name && e.assign((0, U._)`${t}.props`, r), n instanceof U.Name && e.assign((0, U._)`${t}.items`, n);
}
function Ii(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, mt.schemaHasRulesButRef)(a, u))) {
    s.block(() => Nl(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || ih(e, t), s.block(() => {
    for (const b of u.rules)
      h(b);
    h(u.post);
  });
  function h(b) {
    (0, Sa.shouldUseGroup)(a, b) && (b.type ? (s.if((0, Wn.checkDataType)(b.type, o, c.strictNumbers)), Ti(e, b), t.length === 1 && t[0] === b.type && r && (s.else(), (0, Wn.reportTypeError)(e)), s.endIf()) : Ti(e, b), l || s.if((0, U._)`${W.default.errors} === ${n || 0}`));
  }
}
function Ti(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, Wf.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, Sa.shouldUseRule)(n, a) && Nl(e, a.keyword, a.definition, t.type);
  });
}
function ih(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (ch(e, t), e.opts.allowUnionTypes || lh(e, t), uh(e, e.dataTypes));
}
function ch(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Sl(e.dataTypes, r) || Pa(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), fh(e, t);
  }
}
function lh(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Pa(e, "use allowUnionTypes to allow union type keyword");
}
function uh(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, Sa.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => dh(t, o)) && Pa(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function dh(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Sl(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function fh(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Sl(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Pa(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, mt.checkStrictMode)(e, t, e.opts.strictTypes);
}
let Pl = class {
  constructor(t, r, n) {
    if ((0, Br.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, mt.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Rl(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Br.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", W.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, U.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, U.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, U._)`${r} !== undefined && (${(0, U.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Ur.reportExtraError : Ur.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Ur.reportError)(this, this.def.$dataError || Ur.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Ur.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = U.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = U.nil, r = U.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, U.or)((0, U._)`${s} === undefined`, r)), t !== U.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== U.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, U.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof U.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, U._)`${(0, Wn.checkDataTypes)(c, r, a.opts.strictNumbers, Wn.DataType.Wrong)}`;
      }
      return U.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, U._)`!${c}(${r})`;
      }
      return U.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Is.getSubschema)(this.it, t);
    (0, Is.extendSubschemaData)(n, this.it, t), (0, Is.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return xf(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = mt.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = mt.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, U.Name)), !0;
  }
};
Ze.KeywordCxt = Pl;
function Nl(e, t, r, n) {
  const s = new Pl(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, Br.funcKeywordCode)(s, r) : "macro" in r ? (0, Br.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, Br.funcKeywordCode)(s, r);
}
const hh = /^\/(?:[^~]|~0|~1)*$/, mh = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Rl(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return W.default.rootData;
  if (e[0] === "/") {
    if (!hh.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = W.default.rootData;
  } else {
    const d = mh.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, U._)`${a}${(0, U.getProperty)((0, mt.unescapeJsonPointer)(d))}`, o = (0, U._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
Ze.getData = Rl;
var ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
let ph = class extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
};
ln.default = ph;
var Ir = {};
Object.defineProperty(Ir, "__esModule", { value: !0 });
const Ts = Ee;
let $h = class extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ts.resolveUrl)(t, r, n), this.missingSchema = (0, Ts.normalizeId)((0, Ts.getFullPath)(t, this.missingRef));
  }
};
Ir.default = $h;
var je = {};
Object.defineProperty(je, "__esModule", { value: !0 });
je.resolveSchema = je.getCompilingSchema = je.resolveRef = je.compileSchema = je.SchemaEnv = void 0;
const He = Q, yh = ln, Yt = ze, Ye = Ee, ji = A, _h = Ze;
let cs = class {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Ye.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
};
je.SchemaEnv = cs;
function Na(e) {
  const t = Ol.call(this, e);
  if (t)
    return t;
  const r = (0, Ye.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new He.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: yh.default,
    code: (0, He._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Yt.default.data,
    parentData: Yt.default.parentData,
    parentDataProperty: Yt.default.parentDataProperty,
    dataNames: [Yt.default.data],
    dataPathArr: [He.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, He.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: He.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, He._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, _h.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Yt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Yt.default.self}`, `${Yt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof He.Name ? void 0 : w,
        items: _ instanceof He.Name ? void 0 : _,
        dynamicProps: w instanceof He.Name,
        dynamicItems: _ instanceof He.Name
      }, g.source && (g.source.evaluated = (0, He.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
je.compileSchema = Na;
function gh(e, t, r) {
  var n;
  r = (0, Ye.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = Eh.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new cs({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = vh.call(this, a);
}
je.resolveRef = gh;
function vh(e) {
  return (0, Ye.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Na.call(this, e);
}
function Ol(e) {
  for (const t of this._compilations)
    if (wh(t, e))
      return t;
}
je.getCompilingSchema = Ol;
function wh(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function Eh(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || ls.call(this, e, t);
}
function ls(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Ye._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Ye.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return js.call(this, r, e);
  const a = (0, Ye.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = ls.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : js.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Na.call(this, o), a === (0, Ye.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, Ye.resolveUrl)(this.opts.uriResolver, s, d)), new cs({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return js.call(this, r, o);
  }
}
je.resolveSchema = ls;
const bh = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function js(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, ji.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !bh.has(l) && d && (t = (0, Ye.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, ji.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Ye.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = ls.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new cs({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const Sh = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Ph = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Nh = "object", Rh = [
  "$data"
], Oh = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, Ih = !1, Th = {
  $id: Sh,
  description: Ph,
  type: Nh,
  required: Rh,
  properties: Oh,
  additionalProperties: Ih
};
var Ra = {}, us = { exports: {} };
const jh = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Il = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function Tl(e) {
  let t = "", r = 0, n = 0;
  for (n = 0; n < e.length; n++)
    if (r = e[n].charCodeAt(0), r !== 48) {
      if (!(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
        return "";
      t += e[n];
      break;
    }
  for (n += 1; n < e.length; n++) {
    if (r = e[n].charCodeAt(0), !(r >= 48 && r <= 57 || r >= 65 && r <= 70 || r >= 97 && r <= 102))
      return "";
    t += e[n];
  }
  return t;
}
const kh = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function ki(e) {
  return e.length = 0, !0;
}
function Ah(e, t, r) {
  if (e.length) {
    const n = Tl(e);
    if (n !== "")
      t.push(n);
    else
      return r.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Ch(e) {
  let t = 0;
  const r = { error: !1, address: "", zone: "" }, n = [], s = [];
  let a = !1, o = !1, l = Ah;
  for (let c = 0; c < e.length; c++) {
    const d = e[c];
    if (!(d === "[" || d === "]"))
      if (d === ":") {
        if (a === !0 && (o = !0), !l(s, n, r))
          break;
        if (++t > 7) {
          r.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (a = !0), n.push(":");
        continue;
      } else if (d === "%") {
        if (!l(s, n, r))
          break;
        l = ki;
      } else {
        s.push(d);
        continue;
      }
  }
  return s.length && (l === ki ? r.zone = s.join("") : o ? n.push(s.join("")) : n.push(Tl(s))), r.address = n.join(""), r;
}
function jl(e) {
  if (Dh(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Ch(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let r = t.address, n = t.address;
    return t.zone && (r += "%" + t.zone, n += "%25" + t.zone), { host: r, isIPV6: !0, escapedHost: n };
  }
}
function Dh(e, t) {
  let r = 0;
  for (let n = 0; n < e.length; n++)
    e[n] === t && r++;
  return r;
}
function Mh(e) {
  let t = e;
  const r = [];
  let n = -1, s = 0;
  for (; s = t.length; ) {
    if (s === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        r.push("/");
        break;
      } else {
        r.push(t);
        break;
      }
    } else if (s === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        r.push("/");
        break;
      }
    } else if (s === 3 && t === "/..") {
      r.length !== 0 && r.pop(), r.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), r.length !== 0 && r.pop();
        continue;
      }
    }
    if ((n = t.indexOf("/", 1)) === -1) {
      r.push(t);
      break;
    } else
      r.push(t.slice(0, n)), t = t.slice(n);
  }
  return r.join("");
}
function Lh(e, t) {
  const r = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = r(e.scheme)), e.userinfo !== void 0 && (e.userinfo = r(e.userinfo)), e.host !== void 0 && (e.host = r(e.host)), e.path !== void 0 && (e.path = r(e.path)), e.query !== void 0 && (e.query = r(e.query)), e.fragment !== void 0 && (e.fragment = r(e.fragment)), e;
}
function Vh(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let r = unescape(e.host);
    if (!Il(r)) {
      const n = jl(r);
      n.isIPV6 === !0 ? r = `[${n.escapedHost}]` : r = e.host;
    }
    t.push(r);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var kl = {
  nonSimpleDomain: kh,
  recomposeAuthority: Vh,
  normalizeComponentEncoding: Lh,
  removeDotSegments: Mh,
  isIPv4: Il,
  isUUID: jh,
  normalizeIPv6: jl
};
const { isUUID: Fh } = kl, zh = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Al(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Cl(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Dl(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Uh(e) {
  return e.secure = Al(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function qh(e) {
  if ((e.port === (Al(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, r] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = r, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Kh(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const r = e.path.match(zh);
  if (r) {
    const n = t.scheme || e.scheme || "urn";
    e.nid = r[1].toLowerCase(), e.nss = r[2];
    const s = `${n}:${t.nid || e.nid}`, a = Oa(s);
    e.path = void 0, a && (e = a.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function Gh(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const r = t.scheme || e.scheme || "urn", n = e.nid.toLowerCase(), s = `${r}:${t.nid || n}`, a = Oa(s);
  a && (e = a.serialize(e, t));
  const o = e, l = e.nss;
  return o.path = `${n || t.nid}:${l}`, t.skipEscape = !0, o;
}
function Hh(e, t) {
  const r = e;
  return r.uuid = r.nss, r.nss = void 0, !t.tolerant && (!r.uuid || !Fh(r.uuid)) && (r.error = r.error || "UUID is not valid."), r;
}
function Wh(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Ml = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Cl,
    serialize: Dl
  }
), Xh = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Ml.domainHost,
    parse: Cl,
    serialize: Dl
  }
), Ln = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Uh,
    serialize: qh
  }
), Jh = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Ln.domainHost,
    parse: Ln.parse,
    serialize: Ln.serialize
  }
), Bh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Kh,
    serialize: Gh,
    skipNormalize: !0
  }
), Yh = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: Hh,
    serialize: Wh,
    skipNormalize: !0
  }
), Xn = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Ml,
    https: Xh,
    ws: Ln,
    wss: Jh,
    urn: Bh,
    "urn:uuid": Yh
  }
);
Object.setPrototypeOf(Xn, null);
function Oa(e) {
  return e && (Xn[
    /** @type {SchemeName} */
    e
  ] || Xn[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var Qh = {
  SCHEMES: Xn,
  getSchemeHandler: Oa
};
const { normalizeIPv6: Zh, removeDotSegments: Wr, recomposeAuthority: xh, normalizeComponentEncoding: $n, isIPv4: em, nonSimpleDomain: tm } = kl, { SCHEMES: rm, getSchemeHandler: Ll } = Qh;
function nm(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  ct(yt(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  yt(ct(e, t), t)), e;
}
function sm(e, t, r) {
  const n = r ? Object.assign({ scheme: "null" }, r) : { scheme: "null" }, s = Vl(yt(e, n), yt(t, n), n, !0);
  return n.skipEscape = !0, ct(s, n);
}
function Vl(e, t, r, n) {
  const s = {};
  return n || (e = yt(ct(e, r), r), t = yt(ct(t, r), r)), r = r || {}, !r.tolerant && t.scheme ? (s.scheme = t.scheme, s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Wr(t.path || ""), s.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (s.userinfo = t.userinfo, s.host = t.host, s.port = t.port, s.path = Wr(t.path || ""), s.query = t.query) : (t.path ? (t.path[0] === "/" ? s.path = Wr(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? s.path = "/" + t.path : e.path ? s.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : s.path = t.path, s.path = Wr(s.path)), s.query = t.query) : (s.path = e.path, t.query !== void 0 ? s.query = t.query : s.query = e.query), s.userinfo = e.userinfo, s.host = e.host, s.port = e.port), s.scheme = e.scheme), s.fragment = t.fragment, s;
}
function am(e, t, r) {
  return typeof e == "string" ? (e = unescape(e), e = ct($n(yt(e, r), !0), { ...r, skipEscape: !0 })) : typeof e == "object" && (e = ct($n(e, !0), { ...r, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = ct($n(yt(t, r), !0), { ...r, skipEscape: !0 })) : typeof t == "object" && (t = ct($n(t, !0), { ...r, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function ct(e, t) {
  const r = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, n = Object.assign({}, t), s = [], a = Ll(n.scheme || r.scheme);
  a && a.serialize && a.serialize(r, n), r.path !== void 0 && (n.skipEscape ? r.path = unescape(r.path) : (r.path = escape(r.path), r.scheme !== void 0 && (r.path = r.path.split("%3A").join(":")))), n.reference !== "suffix" && r.scheme && s.push(r.scheme, ":");
  const o = xh(r);
  if (o !== void 0 && (n.reference !== "suffix" && s.push("//"), s.push(o), r.path && r.path[0] !== "/" && s.push("/")), r.path !== void 0) {
    let l = r.path;
    !n.absolutePath && (!a || !a.absolutePath) && (l = Wr(l)), o === void 0 && l[0] === "/" && l[1] === "/" && (l = "/%2F" + l.slice(2)), s.push(l);
  }
  return r.query !== void 0 && s.push("?", r.query), r.fragment !== void 0 && s.push("#", r.fragment), s.join("");
}
const om = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function yt(e, t) {
  const r = Object.assign({}, t), n = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let s = !1;
  r.reference === "suffix" && (r.scheme ? e = r.scheme + ":" + e : e = "//" + e);
  const a = e.match(om);
  if (a) {
    if (n.scheme = a[1], n.userinfo = a[3], n.host = a[4], n.port = parseInt(a[5], 10), n.path = a[6] || "", n.query = a[7], n.fragment = a[8], isNaN(n.port) && (n.port = a[5]), n.host)
      if (em(n.host) === !1) {
        const c = Zh(n.host);
        n.host = c.host.toLowerCase(), s = c.isIPV6;
      } else
        s = !0;
    n.scheme === void 0 && n.userinfo === void 0 && n.host === void 0 && n.port === void 0 && n.query === void 0 && !n.path ? n.reference = "same-document" : n.scheme === void 0 ? n.reference = "relative" : n.fragment === void 0 ? n.reference = "absolute" : n.reference = "uri", r.reference && r.reference !== "suffix" && r.reference !== n.reference && (n.error = n.error || "URI is not a " + r.reference + " reference.");
    const o = Ll(r.scheme || n.scheme);
    if (!r.unicodeSupport && (!o || !o.unicodeSupport) && n.host && (r.domainHost || o && o.domainHost) && s === !1 && tm(n.host))
      try {
        n.host = URL.domainToASCII(n.host.toLowerCase());
      } catch (l) {
        n.error = n.error || "Host's domain name can not be converted to ASCII: " + l;
      }
    (!o || o && !o.skipNormalize) && (e.indexOf("%") !== -1 && (n.scheme !== void 0 && (n.scheme = unescape(n.scheme)), n.host !== void 0 && (n.host = unescape(n.host))), n.path && (n.path = escape(unescape(n.path))), n.fragment && (n.fragment = encodeURI(decodeURIComponent(n.fragment)))), o && o.parse && o.parse(n, r);
  } else
    n.error = n.error || "URI can not be parsed.";
  return n;
}
const Ia = {
  SCHEMES: rm,
  normalize: nm,
  resolve: sm,
  resolveComponent: Vl,
  equal: am,
  serialize: ct,
  parse: yt
};
us.exports = Ia;
us.exports.default = Ia;
us.exports.fastUri = Ia;
var Fl = us.exports;
Object.defineProperty(Ra, "__esModule", { value: !0 });
const zl = Fl;
zl.code = 'require("ajv/dist/runtime/uri").default';
Ra.default = zl;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Ze;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = Q;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = ln, s = Ir, a = cr, o = je, l = Q, c = Ee, d = ye, u = A, h = Th, b = Ra, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), y = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, v = 200;
  function N(P) {
    var p, S, $, i, f, E, I, j, F, V, ne, Le, Dt, Mt, Lt, Vt, Ft, zt, Ut, qt, Kt, Gt, Ht, Wt, Xt;
    const Ge = P.strict, Jt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Vr = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, Fr = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, Ss = (i = P.uriResolver) !== null && i !== void 0 ? i : b.default;
    return {
      strictSchema: (E = (f = P.strictSchema) !== null && f !== void 0 ? f : Ge) !== null && E !== void 0 ? E : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : Ge) !== null && j !== void 0 ? j : !0,
      strictTypes: (V = (F = P.strictTypes) !== null && F !== void 0 ? F : Ge) !== null && V !== void 0 ? V : "log",
      strictTuples: (Le = (ne = P.strictTuples) !== null && ne !== void 0 ? ne : Ge) !== null && Le !== void 0 ? Le : "log",
      strictRequired: (Mt = (Dt = P.strictRequired) !== null && Dt !== void 0 ? Dt : Ge) !== null && Mt !== void 0 ? Mt : !1,
      code: P.code ? { ...P.code, optimize: Vr, regExp: Fr } : { optimize: Vr, regExp: Fr },
      loopRequired: (Lt = P.loopRequired) !== null && Lt !== void 0 ? Lt : v,
      loopEnum: (Vt = P.loopEnum) !== null && Vt !== void 0 ? Vt : v,
      meta: (Ft = P.meta) !== null && Ft !== void 0 ? Ft : !0,
      messages: (zt = P.messages) !== null && zt !== void 0 ? zt : !0,
      inlineRefs: (Ut = P.inlineRefs) !== null && Ut !== void 0 ? Ut : !0,
      schemaId: (qt = P.schemaId) !== null && qt !== void 0 ? qt : "$id",
      addUsedSchema: (Kt = P.addUsedSchema) !== null && Kt !== void 0 ? Kt : !0,
      validateSchema: (Gt = P.validateSchema) !== null && Gt !== void 0 ? Gt : !0,
      validateFormats: (Ht = P.validateFormats) !== null && Ht !== void 0 ? Ht : !0,
      unicodeRegExp: (Wt = P.unicodeRegExp) !== null && Wt !== void 0 ? Wt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Ss
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, y, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && ue.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && fe.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), J.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: $ } = this.opts;
      let i = h;
      $ === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const i = $(S);
      return "$async" in $ || (this.errors = $.errors), i;
    }
    compile(p, S) {
      const $ = this._addSchema(p, S);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return i.call(this, p, S);
      async function i(V, ne) {
        await f.call(this, V.$schema);
        const Le = this._addSchema(V, ne);
        return Le.validate || E.call(this, Le);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function E(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return I.call(this, ne), await j.call(this, ne.missingSchema), E.call(this, V);
        }
      }
      function I({ missingSchema: V, missingRef: ne }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${ne} cannot be resolved`);
      }
      async function j(V) {
        const ne = await F.call(this, V);
        this.refs[V] || await f.call(this, ne.$schema), this.refs[V] || this.addSchema(ne, V, S);
      }
      async function F(V) {
        const ne = this._loading[V];
        if (ne)
          return ne;
        try {
          return await (this._loading[V] = $(V));
        } finally {
          delete this._loading[V];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, $, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const E of p)
          this.addSchema(E, void 0, $, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: E } = this.opts;
        if (f = p[E], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${E} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, $, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, $ = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate($, p);
      if (!i && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: $ } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: $ });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let $;
      if (typeof p == "string")
        $ = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = $);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, $ = S.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, $, S), !S)
        return (0, u.eachItem)($, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)($, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((E) => k.call(this, f, i, E))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const $ of S.rules) {
        const i = $.rules.findIndex((f) => f.keyword === p);
        i >= 0 && $.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${$}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let E = p;
        for (const I of f)
          E = E[I];
        for (const I in $) {
          const j = $[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, V = E[I];
          F && V && (E[I] = M(V));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const $ in p) {
        const i = p[$];
        (!S || S.test($)) && (typeof i == "string" ? delete p[$] : i && !i.meta && (this._cache.delete(i.schema), delete p[$]));
      }
    }
    _addSchema(p, S, $, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let E;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        E = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      $ = (0, c.normalizeId)(E || $);
      const F = c.getSchemaRefs.call(this, p, $);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: $, localRefs: F }), this._cache.set(j.schema, j), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = j), i && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, $ = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[$](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function J() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function ue() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function fe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function $e() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!se.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var $;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let E = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (E || (E = { type: S, rules: [] }, f.rules.push(E)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? L.call(this, E, I, p.before) : E.rules.push(I), f.all[P] = I, ($ = p.implements) === null || $ === void 0 || $.forEach((j) => this.addKeyword(j));
  }
  function L(P, p, S) {
    const $ = P.rules.findIndex((i) => i.keyword === S);
    $ >= 0 ? P.rules.splice($, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, G] };
  }
})(Qc);
var Ta = {}, ja = {}, ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
const im = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ka.default = im;
var _t = {};
Object.defineProperty(_t, "__esModule", { value: !0 });
_t.callRef = _t.getValidate = void 0;
const cm = Ir, Ai = te, Ce = Q, hr = ze, Ci = je, yn = A, lm = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = Ci.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new cm.default(n.opts.uriResolver, s, r);
    if (u instanceof Ci.SchemaEnv)
      return b(u);
    return g(u);
    function h() {
      if (a === d)
        return Vn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return Vn(e, (0, Ce._)`${w}.validate`, d, d.$async);
    }
    function b(w) {
      const _ = Ul(e, w);
      Vn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, Ce.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: Ce.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function Ul(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, Ce._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
_t.getValidate = Ul;
function Vn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? hr.default.this : Ce.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, Ce._)`await ${(0, Ai.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, Ce._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), b(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, Ai.callValidateCode)(e, t, d), () => g(t), () => b(t));
  }
  function b(w) {
    const _ = (0, Ce._)`${w}.errors`;
    s.assign(hr.default.vErrors, (0, Ce._)`${hr.default.vErrors} === null ? ${_} : ${hr.default.vErrors}.concat(${_})`), s.assign(hr.default.errors, (0, Ce._)`${hr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = yn.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, Ce._)`${w}.evaluated.props`);
        a.props = yn.mergeEvaluated.props(s, m, a.props, Ce.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = yn.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, Ce._)`${w}.evaluated.items`);
        a.items = yn.mergeEvaluated.items(s, m, a.items, Ce.Name);
      }
  }
}
_t.callRef = Vn;
_t.default = lm;
Object.defineProperty(ja, "__esModule", { value: !0 });
const um = ka, dm = _t, fm = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  um.default,
  dm.default
];
ja.default = fm;
var Aa = {}, Ca = {};
Object.defineProperty(Ca, "__esModule", { value: !0 });
const Jn = Q, bt = Jn.operators, Bn = {
  maximum: { okStr: "<=", ok: bt.LTE, fail: bt.GT },
  minimum: { okStr: ">=", ok: bt.GTE, fail: bt.LT },
  exclusiveMaximum: { okStr: "<", ok: bt.LT, fail: bt.GTE },
  exclusiveMinimum: { okStr: ">", ok: bt.GT, fail: bt.LTE }
}, hm = {
  message: ({ keyword: e, schemaCode: t }) => (0, Jn.str)`must be ${Bn[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Jn._)`{comparison: ${Bn[e].okStr}, limit: ${t}}`
}, mm = {
  keyword: Object.keys(Bn),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: hm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, Jn._)`${r} ${Bn[t].fail} ${n} || isNaN(${r})`);
  }
};
Ca.default = mm;
var Da = {};
Object.defineProperty(Da, "__esModule", { value: !0 });
const Yr = Q, pm = {
  message: ({ schemaCode: e }) => (0, Yr.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, Yr._)`{multipleOf: ${e}}`
}, $m = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pm,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, Yr._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, Yr._)`${o} !== parseInt(${o})`;
    e.fail$data((0, Yr._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Da.default = $m;
var Ma = {}, La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
function ql(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
La.default = ql;
ql.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Ma, "__esModule", { value: !0 });
const xt = Q, ym = A, _m = La, gm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, xt.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, xt._)`{limit: ${e}}`
}, vm = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: gm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? xt.operators.GT : xt.operators.LT, o = s.opts.unicode === !1 ? (0, xt._)`${r}.length` : (0, xt._)`${(0, ym.useFunc)(e.gen, _m.default)}(${r})`;
    e.fail$data((0, xt._)`${o} ${a} ${n}`);
  }
};
Ma.default = vm;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
const wm = te, Yn = Q, Em = {
  message: ({ schemaCode: e }) => (0, Yn.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, Yn._)`{pattern: ${e}}`
}, bm = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Em,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, Yn._)`(new RegExp(${s}, ${o}))` : (0, wm.usePattern)(e, n);
    e.fail$data((0, Yn._)`!${l}.test(${t})`);
  }
};
Va.default = bm;
var Fa = {};
Object.defineProperty(Fa, "__esModule", { value: !0 });
const Qr = Q, Sm = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, Qr.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, Qr._)`{limit: ${e}}`
}, Pm = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Sm,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? Qr.operators.GT : Qr.operators.LT;
    e.fail$data((0, Qr._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Fa.default = Pm;
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
const qr = te, Zr = Q, Nm = A, Rm = {
  message: ({ params: { missingProperty: e } }) => (0, Zr.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, Zr._)`{missingProperty: ${e}}`
}, Om = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Rm,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, Nm.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(Zr.nil, h);
      else
        for (const g of r)
          (0, qr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => b(g, w)), e.ok(w);
      } else
        t.if((0, qr.checkMissingProp)(e, r, g)), (0, qr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, qr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function b(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, qr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, Zr.not)(w), () => {
          e.error(), t.break();
        });
      }, Zr.nil);
    }
  }
};
za.default = Om;
var Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
const xr = Q, Im = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, xr.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, xr._)`{limit: ${e}}`
}, Tm = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Im,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? xr.operators.GT : xr.operators.LT;
    e.fail$data((0, xr._)`${r}.length ${s} ${n}`);
  }
};
Ua.default = Tm;
var qa = {}, un = {};
Object.defineProperty(un, "__esModule", { value: !0 });
const Kl = is;
Kl.code = 'require("ajv/dist/runtime/equal").default';
un.default = Kl;
Object.defineProperty(qa, "__esModule", { value: !0 });
const ks = ye, ve = Q, jm = A, km = un, Am = {
  message: ({ params: { i: e, j: t } }) => (0, ve.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, ve._)`{i: ${e}, j: ${t}}`
}, Cm = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Am,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, ks.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, ve._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, ve._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, ve._)`${w} > 1`, () => (h() ? b : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function b(w, _) {
      const y = t.name("item"), m = (0, ks.checkDataTypes)(d, y, l.opts.strictNumbers, ks.DataType.Wrong), v = t.const("indices", (0, ve._)`{}`);
      t.for((0, ve._)`;${w}--;`, () => {
        t.let(y, (0, ve._)`${r}[${w}]`), t.if(m, (0, ve._)`continue`), d.length > 1 && t.if((0, ve._)`typeof ${y} == "string"`, (0, ve._)`${y} += "_"`), t.if((0, ve._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, ve._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, ve._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, jm.useFunc)(t, km.default), m = t.name("outer");
      t.label(m).for((0, ve._)`;${w}--;`, () => t.for((0, ve._)`${_} = ${w}; ${_}--;`, () => t.if((0, ve._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
qa.default = Cm;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
const ta = Q, Dm = A, Mm = un, Lm = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ta._)`{allowedValue: ${e}}`
}, Vm = {
  keyword: "const",
  $data: !0,
  error: Lm,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ta._)`!${(0, Dm.useFunc)(t, Mm.default)}(${r}, ${s})`) : e.fail((0, ta._)`${a} !== ${r}`);
  }
};
Ka.default = Vm;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
const Xr = Q, Fm = A, zm = un, Um = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Xr._)`{allowedValues: ${e}}`
}, qm = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Um,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Fm.useFunc)(t, zm.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, Xr.or)(...s.map((w, _) => b(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, Xr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function b(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, Xr._)`${d()}(${r}, ${g}[${w}])` : (0, Xr._)`${r} === ${_}`;
    }
  }
};
Ga.default = qm;
Object.defineProperty(Aa, "__esModule", { value: !0 });
const Km = Ca, Gm = Da, Hm = Ma, Wm = Va, Xm = Fa, Jm = za, Bm = Ua, Ym = qa, Qm = Ka, Zm = Ga, xm = [
  // number
  Km.default,
  Gm.default,
  // string
  Hm.default,
  Wm.default,
  // object
  Xm.default,
  Jm.default,
  // array
  Bm.default,
  Ym.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Qm.default,
  Zm.default
];
Aa.default = xm;
var Ha = {}, Tr = {};
Object.defineProperty(Tr, "__esModule", { value: !0 });
Tr.validateAdditionalItems = void 0;
const er = Q, ra = A, ep = {
  message: ({ params: { len: e } }) => (0, er.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, er._)`{limit: ${e}}`
}, tp = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: ep,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, ra.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Gl(e, n);
  }
};
function Gl(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, er._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, er._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, ra.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, er._)`${l} <= ${t.length}`);
    r.if((0, er.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: ra.Type.Num }, d), o.allErrors || r.if((0, er.not)(d), () => r.break());
    });
  }
}
Tr.validateAdditionalItems = Gl;
Tr.default = tp;
var Wa = {}, jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.validateTuple = void 0;
const Di = Q, Fn = A, rp = te, np = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Hl(e, "additionalItems", t);
    r.items = !0, !(0, Fn.alwaysValidSchema)(r, t) && e.ok((0, rp.validateArray)(e));
  }
};
function Hl(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Fn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, Di._)`${a}.length`);
  r.forEach((h, b) => {
    (0, Fn.alwaysValidSchema)(l, h) || (n.if((0, Di._)`${d} > ${b}`, () => e.subschema({
      keyword: o,
      schemaProp: b,
      dataProp: b
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: b, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (b.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Fn.checkStrictMode)(l, y, b.strictTuples);
    }
  }
}
jr.validateTuple = Hl;
jr.default = np;
Object.defineProperty(Wa, "__esModule", { value: !0 });
const sp = jr, ap = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, sp.validateTuple)(e, "items")
};
Wa.default = ap;
var Xa = {};
Object.defineProperty(Xa, "__esModule", { value: !0 });
const Mi = Q, op = A, ip = te, cp = Tr, lp = {
  message: ({ params: { len: e } }) => (0, Mi.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Mi._)`{limit: ${e}}`
}, up = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: lp,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, op.alwaysValidSchema)(n, t) && (s ? (0, cp.validateAdditionalItems)(e, s) : e.ok((0, ip.validateArray)(e)));
  }
};
Xa.default = up;
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
const qe = Q, _n = A, dp = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe.str)`must contain at least ${e} valid item(s)` : (0, qe.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, qe._)`{minContains: ${e}}` : (0, qe._)`{minContains: ${e}, maxContains: ${t}}`
}, fp = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: dp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, qe._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, _n.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, _n.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, _n.alwaysValidSchema)(a, r)) {
      let _ = (0, qe._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, qe._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, qe._)`${s}.length > 0`, b)) : (t.let(h, !1), b()), e.result(h, () => e.reset());
    function b() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: _n.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, qe._)`${_}++`), l === void 0 ? t.if((0, qe._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, qe._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, qe._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Ja.default = fp;
var ds = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = Q, r = A, n = te;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const b = Array.isArray(c[h]) ? d : u;
      b[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: b } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(u, h, w, b.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), b.allErrors ? u.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: b, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: b, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(ds);
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
const Wl = Q, hp = A, mp = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Wl._)`{propertyName: ${e.propertyName}}`
}, pp = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: mp,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, hp.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Wl.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Ba.default = pp;
var fs = {};
Object.defineProperty(fs, "__esModule", { value: !0 });
const gn = te, Xe = Q, $p = ze, vn = A, yp = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Xe._)`{additionalProperty: ${e.additionalProperty}}`
}, _p = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: yp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, vn.alwaysValidSchema)(o, r))
      return;
    const d = (0, gn.allSchemaProperties)(n.properties), u = (0, gn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Xe._)`${a} === ${$p.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !u.length ? w(y) : t.if(b(y), () => w(y));
      });
    }
    function b(y) {
      let m;
      if (d.length > 8) {
        const v = (0, vn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, gn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Xe.or)(...d.map((v) => (0, Xe._)`${y} === ${v}`)) : m = Xe.nil;
      return u.length && (m = (0, Xe.or)(m, ...u.map((v) => (0, Xe._)`${(0, gn.usePattern)(e, v)}.test(${y})`))), (0, Xe.not)(m);
    }
    function g(y) {
      t.code((0, Xe._)`delete ${s}[${y}]`);
    }
    function w(y) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g(y);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: y }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, vn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Xe.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), l || t.if((0, Xe.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: vn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
fs.default = _p;
var Ya = {};
Object.defineProperty(Ya, "__esModule", { value: !0 });
const gp = Ze, Li = te, As = A, Vi = fs, vp = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && Vi.default.code(new gp.KeywordCxt(a, Vi.default, "additionalProperties"));
    const o = (0, Li.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = As.mergeEvaluated.props(t, (0, As.toHash)(o), a.props));
    const l = o.filter((h) => !(0, As.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, Li.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Ya.default = vp;
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
const Fi = te, wn = Q, zi = A, Ui = A, wp = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, Fi.allSchemaProperties)(r), c = l.filter((_) => (0, zi.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof wn.Name) && (a.props = (0, Ui.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    b();
    function b() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, zi.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, wn._)`${(0, Fi.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: Ui.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, wn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, wn.not)(u), () => t.break());
        });
      });
    }
  }
};
Qa.default = wp;
var Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
const Ep = A, bp = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Ep.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Za.default = bp;
var xa = {};
Object.defineProperty(xa, "__esModule", { value: !0 });
const Sp = te, Pp = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Sp.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
xa.default = Pp;
var eo = {};
Object.defineProperty(eo, "__esModule", { value: !0 });
const zn = Q, Np = A, Rp = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, zn._)`{passingSchemas: ${e.passing}}`
}, Op = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Rp,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let b;
        (0, Np.alwaysValidSchema)(s, u) ? t.var(c, !0) : b = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, zn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, zn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), b && e.mergeEvaluated(b, zn.Name);
        });
      });
    }
  }
};
eo.default = Op;
var to = {};
Object.defineProperty(to, "__esModule", { value: !0 });
const Ip = A, Tp = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, Ip.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
to.default = Tp;
var ro = {};
Object.defineProperty(ro, "__esModule", { value: !0 });
const Qn = Q, Xl = A, jp = {
  message: ({ params: e }) => (0, Qn.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Qn._)`{failingKeyword: ${e.ifClause}}`
}, kp = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: jp,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Xl.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = qi(n, "then"), a = qi(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, Qn.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const b = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(b, o), h ? t.assign(h, (0, Qn._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function qi(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Xl.alwaysValidSchema)(e, r);
}
ro.default = kp;
var no = {};
Object.defineProperty(no, "__esModule", { value: !0 });
const Ap = A, Cp = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Ap.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
no.default = Cp;
Object.defineProperty(Ha, "__esModule", { value: !0 });
const Dp = Tr, Mp = Wa, Lp = jr, Vp = Xa, Fp = Ja, zp = ds, Up = Ba, qp = fs, Kp = Ya, Gp = Qa, Hp = Za, Wp = xa, Xp = eo, Jp = to, Bp = ro, Yp = no;
function Qp(e = !1) {
  const t = [
    // any
    Hp.default,
    Wp.default,
    Xp.default,
    Jp.default,
    Bp.default,
    Yp.default,
    // object
    Up.default,
    qp.default,
    zp.default,
    Kp.default,
    Gp.default
  ];
  return e ? t.push(Mp.default, Vp.default) : t.push(Dp.default, Lp.default), t.push(Fp.default), t;
}
Ha.default = Qp;
var so = {}, kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
kr.dynamicAnchor = void 0;
const Cs = Q, Zp = ze, Ki = je, xp = _t, e$ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Jl(e, e.schema)
};
function Jl(e, t) {
  const { gen: r, it: n } = e;
  n.schemaEnv.root.dynamicAnchors[t] = !0;
  const s = (0, Cs._)`${Zp.default.dynamicAnchors}${(0, Cs.getProperty)(t)}`, a = n.errSchemaPath === "#" ? n.validateName : t$(e);
  r.if((0, Cs._)`!${s}`, () => r.assign(s, a));
}
kr.dynamicAnchor = Jl;
function t$(e) {
  const { schemaEnv: t, schema: r, self: n } = e.it, { root: s, baseId: a, localRefs: o, meta: l } = t.root, { schemaId: c } = n.opts, d = new Ki.SchemaEnv({ schema: r, schemaId: c, root: s, baseId: a, localRefs: o, meta: l });
  return Ki.compileSchema.call(n, d), (0, xp.getValidate)(e, d);
}
kr.default = e$;
var Ar = {};
Object.defineProperty(Ar, "__esModule", { value: !0 });
Ar.dynamicRef = void 0;
const Gi = Q, r$ = ze, Hi = _t, n$ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Bl(e, e.schema)
};
function Bl(e, t) {
  const { gen: r, keyword: n, it: s } = e;
  if (t[0] !== "#")
    throw new Error(`"${n}" only supports hash fragment reference`);
  const a = t.slice(1);
  if (s.allErrors)
    o();
  else {
    const c = r.let("valid", !1);
    o(c), e.ok(c);
  }
  function o(c) {
    if (s.schemaEnv.root.dynamicAnchors[a]) {
      const d = r.let("_v", (0, Gi._)`${r$.default.dynamicAnchors}${(0, Gi.getProperty)(a)}`);
      r.if(d, l(d, c), l(s.validateName, c));
    } else
      l(s.validateName, c)();
  }
  function l(c, d) {
    return d ? () => r.block(() => {
      (0, Hi.callRef)(e, c), r.let(d, !0);
    }) : () => (0, Hi.callRef)(e, c);
  }
}
Ar.dynamicRef = Bl;
Ar.default = n$;
var ao = {};
Object.defineProperty(ao, "__esModule", { value: !0 });
const s$ = kr, a$ = A, o$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, s$.dynamicAnchor)(e, "") : (0, a$.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
ao.default = o$;
var oo = {};
Object.defineProperty(oo, "__esModule", { value: !0 });
const i$ = Ar, c$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, i$.dynamicRef)(e, e.schema)
};
oo.default = c$;
Object.defineProperty(so, "__esModule", { value: !0 });
const l$ = kr, u$ = Ar, d$ = ao, f$ = oo, h$ = [l$.default, u$.default, d$.default, f$.default];
so.default = h$;
var io = {}, co = {};
Object.defineProperty(co, "__esModule", { value: !0 });
const Wi = ds, m$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Wi.error,
  code: (e) => (0, Wi.validatePropertyDeps)(e)
};
co.default = m$;
var lo = {};
Object.defineProperty(lo, "__esModule", { value: !0 });
const p$ = ds, $$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, p$.validateSchemaDeps)(e)
};
lo.default = $$;
var uo = {};
Object.defineProperty(uo, "__esModule", { value: !0 });
const y$ = A, _$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: r }) {
    t.contains === void 0 && (0, y$.checkStrictMode)(r, `"${e}" without "contains" is ignored`);
  }
};
uo.default = _$;
Object.defineProperty(io, "__esModule", { value: !0 });
const g$ = co, v$ = lo, w$ = uo, E$ = [g$.default, v$.default, w$.default];
io.default = E$;
var fo = {}, ho = {};
Object.defineProperty(ho, "__esModule", { value: !0 });
const Rt = Q, Xi = A, b$ = ze, S$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Rt._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, P$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: S$,
  code(e) {
    const { gen: t, schema: r, data: n, errsCount: s, it: a } = e;
    if (!s)
      throw new Error("ajv implementation error");
    const { allErrors: o, props: l } = a;
    l instanceof Rt.Name ? t.if((0, Rt._)`${l} !== true`, () => t.forIn("key", n, (h) => t.if(d(l, h), () => c(h)))) : l !== !0 && t.forIn("key", n, (h) => l === void 0 ? c(h) : t.if(u(l, h), () => c(h))), a.props = !0, e.ok((0, Rt._)`${s} === ${b$.default.errors}`);
    function c(h) {
      if (r === !1) {
        e.setParams({ unevaluatedProperty: h }), e.error(), o || t.break();
        return;
      }
      if (!(0, Xi.alwaysValidSchema)(a, r)) {
        const b = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: h,
          dataPropType: Xi.Type.Str
        }, b), o || t.if((0, Rt.not)(b), () => t.break());
      }
    }
    function d(h, b) {
      return (0, Rt._)`!${h} || !${h}[${b}]`;
    }
    function u(h, b) {
      const g = [];
      for (const w in h)
        h[w] === !0 && g.push((0, Rt._)`${b} !== ${w}`);
      return (0, Rt.and)(...g);
    }
  }
};
ho.default = P$;
var mo = {};
Object.defineProperty(mo, "__esModule", { value: !0 });
const tr = Q, Ji = A, N$ = {
  message: ({ params: { len: e } }) => (0, tr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, tr._)`{limit: ${e}}`
}, R$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: N$,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e, a = s.items || 0;
    if (a === !0)
      return;
    const o = t.const("len", (0, tr._)`${n}.length`);
    if (r === !1)
      e.setParams({ len: a }), e.fail((0, tr._)`${o} > ${a}`);
    else if (typeof r == "object" && !(0, Ji.alwaysValidSchema)(s, r)) {
      const c = t.var("valid", (0, tr._)`${o} <= ${a}`);
      t.if((0, tr.not)(c), () => l(c, a)), e.ok(c);
    }
    s.items = !0;
    function l(c, d) {
      t.forRange("i", d, o, (u) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: u, dataPropType: Ji.Type.Num }, c), s.allErrors || t.if((0, tr.not)(c), () => t.break());
      });
    }
  }
};
mo.default = R$;
Object.defineProperty(fo, "__esModule", { value: !0 });
const O$ = ho, I$ = mo, T$ = [O$.default, I$.default];
fo.default = T$;
var po = {}, $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
const he = Q, j$ = {
  message: ({ schemaCode: e }) => (0, he.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, he._)`{format: ${e}}`
}, k$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: j$,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? b() : g();
    function b() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, he._)`${w}[${o}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, he._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, he._)`${_}.type || "string"`).assign(m, (0, he._)`${_}.validate`), () => r.assign(y, (0, he._)`"string"`).assign(m, _)), e.fail$data((0, he.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? he.nil : (0, he._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, he._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, he._)`${m}(${n})`, O = (0, he._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, he._)`${m} && ${m} !== true && ${y} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, y, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, he.regexpCode)(O) : c.code.formats ? (0, he._)`${c.code.formats}${(0, he.getProperty)(a)}` : void 0, J = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, he._)`${J}.validate`] : ["string", O, J];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, he._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, he._)`${m}(${n})` : (0, he._)`${m}.test(${n})`;
      }
    }
  }
};
$o.default = k$;
Object.defineProperty(po, "__esModule", { value: !0 });
const A$ = $o, C$ = [A$.default];
po.default = C$;
var Nr = {};
Object.defineProperty(Nr, "__esModule", { value: !0 });
Nr.contentVocabulary = Nr.metadataVocabulary = void 0;
Nr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Nr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Ta, "__esModule", { value: !0 });
const D$ = ja, M$ = Aa, L$ = Ha, V$ = so, F$ = io, z$ = fo, U$ = po, Bi = Nr, q$ = [
  V$.default,
  D$.default,
  M$.default,
  (0, L$.default)(!0),
  U$.default,
  Bi.metadataVocabulary,
  Bi.contentVocabulary,
  F$.default,
  z$.default
];
Ta.default = q$;
var yo = {}, hs = {};
Object.defineProperty(hs, "__esModule", { value: !0 });
hs.DiscrError = void 0;
var Yi;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(Yi || (hs.DiscrError = Yi = {}));
Object.defineProperty(yo, "__esModule", { value: !0 });
const yr = Q, na = hs, Qi = je, K$ = Ir, G$ = A, H$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === na.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, yr._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, W$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: H$,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, yr._)`${r}${(0, yr.getProperty)(l)}`);
    t.if((0, yr._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: na.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = b();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, yr._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: na.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, yr.Name), w;
    }
    function b() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, G$.schemaHasRulesButRef)(O, a.self.RULES)) {
          const J = O.$ref;
          if (O = Qi.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, J), O instanceof Qi.SchemaEnv && (O = O.schema), O === void 0)
            throw new K$.default(a.opts.uriResolver, a.baseId, J);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        y = y && (_ || m(O)), v(K, R);
      }
      if (!y)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
yo.default = W$;
var _o = {};
const X$ = "https://json-schema.org/draft/2020-12/schema", J$ = "https://json-schema.org/draft/2020-12/schema", B$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Y$ = "meta", Q$ = "Core and Validation specifications meta-schema", Z$ = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], x$ = [
  "object",
  "boolean"
], ey = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", ty = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, ry = {
  $schema: X$,
  $id: J$,
  $vocabulary: B$,
  $dynamicAnchor: Y$,
  title: Q$,
  allOf: Z$,
  type: x$,
  $comment: ey,
  properties: ty
}, ny = "https://json-schema.org/draft/2020-12/schema", sy = "https://json-schema.org/draft/2020-12/meta/applicator", ay = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, oy = "meta", iy = "Applicator vocabulary meta-schema", cy = [
  "object",
  "boolean"
], ly = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, uy = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, dy = {
  $schema: ny,
  $id: sy,
  $vocabulary: ay,
  $dynamicAnchor: oy,
  title: iy,
  type: cy,
  properties: ly,
  $defs: uy
}, fy = "https://json-schema.org/draft/2020-12/schema", hy = "https://json-schema.org/draft/2020-12/meta/unevaluated", my = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, py = "meta", $y = "Unevaluated applicator vocabulary meta-schema", yy = [
  "object",
  "boolean"
], _y = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, gy = {
  $schema: fy,
  $id: hy,
  $vocabulary: my,
  $dynamicAnchor: py,
  title: $y,
  type: yy,
  properties: _y
}, vy = "https://json-schema.org/draft/2020-12/schema", wy = "https://json-schema.org/draft/2020-12/meta/content", Ey = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, by = "meta", Sy = "Content vocabulary meta-schema", Py = [
  "object",
  "boolean"
], Ny = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Ry = {
  $schema: vy,
  $id: wy,
  $vocabulary: Ey,
  $dynamicAnchor: by,
  title: Sy,
  type: Py,
  properties: Ny
}, Oy = "https://json-schema.org/draft/2020-12/schema", Iy = "https://json-schema.org/draft/2020-12/meta/core", Ty = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, jy = "meta", ky = "Core vocabulary meta-schema", Ay = [
  "object",
  "boolean"
], Cy = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, Dy = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, My = {
  $schema: Oy,
  $id: Iy,
  $vocabulary: Ty,
  $dynamicAnchor: jy,
  title: ky,
  type: Ay,
  properties: Cy,
  $defs: Dy
}, Ly = "https://json-schema.org/draft/2020-12/schema", Vy = "https://json-schema.org/draft/2020-12/meta/format-annotation", Fy = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, zy = "meta", Uy = "Format vocabulary meta-schema for annotation results", qy = [
  "object",
  "boolean"
], Ky = {
  format: {
    type: "string"
  }
}, Gy = {
  $schema: Ly,
  $id: Vy,
  $vocabulary: Fy,
  $dynamicAnchor: zy,
  title: Uy,
  type: qy,
  properties: Ky
}, Hy = "https://json-schema.org/draft/2020-12/schema", Wy = "https://json-schema.org/draft/2020-12/meta/meta-data", Xy = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Jy = "meta", By = "Meta-data vocabulary meta-schema", Yy = [
  "object",
  "boolean"
], Qy = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, Zy = {
  $schema: Hy,
  $id: Wy,
  $vocabulary: Xy,
  $dynamicAnchor: Jy,
  title: By,
  type: Yy,
  properties: Qy
}, xy = "https://json-schema.org/draft/2020-12/schema", e0 = "https://json-schema.org/draft/2020-12/meta/validation", t0 = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, r0 = "meta", n0 = "Validation vocabulary meta-schema", s0 = [
  "object",
  "boolean"
], a0 = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, o0 = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, i0 = {
  $schema: xy,
  $id: e0,
  $vocabulary: t0,
  $dynamicAnchor: r0,
  title: n0,
  type: s0,
  properties: a0,
  $defs: o0
};
Object.defineProperty(_o, "__esModule", { value: !0 });
const c0 = ry, l0 = dy, u0 = gy, d0 = Ry, f0 = My, h0 = Gy, m0 = Zy, p0 = i0, $0 = ["/properties"];
function y0(e) {
  return [
    c0,
    l0,
    u0,
    d0,
    f0,
    t(this, h0),
    m0,
    t(this, p0)
  ].forEach((r) => this.addMetaSchema(r, void 0, !1)), this;
  function t(r, n) {
    return e ? r.$dataMetaSchema(n, $0) : n;
  }
}
_o.default = y0;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const r = Qc, n = Ta, s = yo, a = _o, o = "https://json-schema.org/draft/2020-12/schema";
  class l extends r.default {
    constructor(g = {}) {
      super({
        ...g,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((g) => this.addVocabulary(g)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: g, meta: w } = this.opts;
      w && (a.default.call(this, g), this.refs["http://json-schema.org/schema"] = o);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(o) ? o : void 0);
    }
  }
  t.Ajv2020 = l, e.exports = t = l, e.exports.Ajv2020 = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
  var c = Ze;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var d = Q;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return d._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return d.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return d.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return d.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return d.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return d.CodeGen;
  } });
  var u = ln;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return u.default;
  } });
  var h = Ir;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(Ys, Ys.exports);
var _0 = Ys.exports, sa = { exports: {} }, Yl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(z, H) {
    return { validate: z, compare: H };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(a, o),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), d),
    "date-time": t(b(!0), g),
    "iso-time": t(c(), u),
    "iso-date-time": t(b(), w),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: m,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: $e,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: N,
    // signed 32 bit integer
    int32: { type: "number", validate: K },
    // signed 64 bit integer
    int64: { type: "number", validate: J },
    // C-type float
    float: { type: "number", validate: ue },
    // C-type double
    double: { type: "number", validate: ue },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, o),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, u),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, w),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function r(z) {
    return z % 4 === 0 && (z % 100 !== 0 || z % 400 === 0);
  }
  const n = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, s = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function a(z) {
    const H = n.exec(z);
    if (!H)
      return !1;
    const se = +H[1], T = +H[2], k = +H[3];
    return T >= 1 && T <= 12 && k >= 1 && k <= (T === 2 && r(se) ? 29 : s[T]);
  }
  function o(z, H) {
    if (z && H)
      return z > H ? 1 : z < H ? -1 : 0;
  }
  const l = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(z) {
    return function(se) {
      const T = l.exec(se);
      if (!T)
        return !1;
      const k = +T[1], L = +T[2], D = +T[3], G = T[4], M = T[5] === "-" ? -1 : 1, P = +(T[6] || 0), p = +(T[7] || 0);
      if (P > 23 || p > 59 || z && !G)
        return !1;
      if (k <= 23 && L <= 59 && D < 60)
        return !0;
      const S = L - p * M, $ = k - P * M - (S < 0 ? 1 : 0);
      return ($ === 23 || $ === -1) && (S === 59 || S === -1) && D < 61;
    };
  }
  function d(z, H) {
    if (!(z && H))
      return;
    const se = (/* @__PURE__ */ new Date("2020-01-01T" + z)).valueOf(), T = (/* @__PURE__ */ new Date("2020-01-01T" + H)).valueOf();
    if (se && T)
      return se - T;
  }
  function u(z, H) {
    if (!(z && H))
      return;
    const se = l.exec(z), T = l.exec(H);
    if (se && T)
      return z = se[1] + se[2] + se[3], H = T[1] + T[2] + T[3], z > H ? 1 : z < H ? -1 : 0;
  }
  const h = /t|\s/i;
  function b(z) {
    const H = c(z);
    return function(T) {
      const k = T.split(h);
      return k.length === 2 && a(k[0]) && H(k[1]);
    };
  }
  function g(z, H) {
    if (!(z && H))
      return;
    const se = new Date(z).valueOf(), T = new Date(H).valueOf();
    if (se && T)
      return se - T;
  }
  function w(z, H) {
    if (!(z && H))
      return;
    const [se, T] = z.split(h), [k, L] = H.split(h), D = o(se, k);
    if (D !== void 0)
      return D || d(T, L);
  }
  const _ = /\/|:/, y = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function m(z) {
    return _.test(z) && y.test(z);
  }
  const v = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function N(z) {
    return v.lastIndex = 0, v.test(z);
  }
  const R = -2147483648, O = 2 ** 31 - 1;
  function K(z) {
    return Number.isInteger(z) && z <= O && z >= R;
  }
  function J(z) {
    return Number.isInteger(z);
  }
  function ue() {
    return !0;
  }
  const fe = /[^\\]\\Z/;
  function $e(z) {
    if (fe.test(z))
      return !1;
    try {
      return new RegExp(z), !0;
    } catch {
      return !1;
    }
  }
})(Yl);
var Ql = {}, aa = { exports: {} }, Zl = {}, xe = {}, Rr = {}, dn = {}, ee = {}, on = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class r extends t {
    constructor(v) {
      if (super(), !e.IDENTIFIER.test(v))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = r;
  class n extends t {
    constructor(v) {
      super(), this._items = typeof v == "string" ? [v] : v;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const v = this._items[0];
      return v === "" || v === '""';
    }
    get str() {
      var v;
      return (v = this._str) !== null && v !== void 0 ? v : this._str = this._items.reduce((N, R) => `${N}${R}`, "");
    }
    get names() {
      var v;
      return (v = this._names) !== null && v !== void 0 ? v : this._names = this._items.reduce((N, R) => (R instanceof r && (N[R.str] = (N[R.str] || 0) + 1), N), {});
    }
  }
  e._Code = n, e.nil = new n("");
  function s(m, ...v) {
    const N = [m[0]];
    let R = 0;
    for (; R < v.length; )
      l(N, v[R]), N.push(m[++R]);
    return new n(N);
  }
  e._ = s;
  const a = new n("+");
  function o(m, ...v) {
    const N = [g(m[0])];
    let R = 0;
    for (; R < v.length; )
      N.push(a), l(N, v[R]), N.push(a, g(m[++R]));
    return c(N), new n(N);
  }
  e.str = o;
  function l(m, v) {
    v instanceof n ? m.push(...v._items) : v instanceof r ? m.push(v) : m.push(h(v));
  }
  e.addCodeArg = l;
  function c(m) {
    let v = 1;
    for (; v < m.length - 1; ) {
      if (m[v] === a) {
        const N = d(m[v - 1], m[v + 1]);
        if (N !== void 0) {
          m.splice(v - 1, 3, N);
          continue;
        }
        m[v++] = "+";
      }
      v++;
    }
  }
  function d(m, v) {
    if (v === '""')
      return m;
    if (m === '""')
      return v;
    if (typeof m == "string")
      return v instanceof r || m[m.length - 1] !== '"' ? void 0 : typeof v != "string" ? `${m.slice(0, -1)}${v}"` : v[0] === '"' ? m.slice(0, -1) + v.slice(1) : void 0;
    if (typeof v == "string" && v[0] === '"' && !(m instanceof r))
      return `"${m}${v.slice(1)}`;
  }
  function u(m, v) {
    return v.emptyStr() ? m : m.emptyStr() ? v : o`${m}${v}`;
  }
  e.strConcat = u;
  function h(m) {
    return typeof m == "number" || typeof m == "boolean" || m === null ? m : g(Array.isArray(m) ? m.join(",") : m);
  }
  function b(m) {
    return new n(g(m));
  }
  e.stringify = b;
  function g(m) {
    return JSON.stringify(m).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = g;
  function w(m) {
    return typeof m == "string" && e.IDENTIFIER.test(m) ? new n(`.${m}`) : s`[${m}]`;
  }
  e.getProperty = w;
  function _(m) {
    if (typeof m == "string" && e.IDENTIFIER.test(m))
      return new n(`${m}`);
    throw new Error(`CodeGen: invalid export name: ${m}, use explicit $id name mapping`);
  }
  e.getEsmExportName = _;
  function y(m) {
    return new n(m.toString());
  }
  e.regexpCode = y;
})(on);
var oa = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = on;
  class r extends Error {
    constructor(d) {
      super(`CodeGen: "code" for ${d} not defined`), this.value = d.value;
    }
  }
  var n;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(n || (e.UsedValueState = n = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class s {
    constructor({ prefixes: d, parent: u } = {}) {
      this._names = {}, this._prefixes = d, this._parent = u;
    }
    toName(d) {
      return d instanceof t.Name ? d : this.name(d);
    }
    name(d) {
      return new t.Name(this._newName(d));
    }
    _newName(d) {
      const u = this._names[d] || this._nameGroup(d);
      return `${d}${u.index++}`;
    }
    _nameGroup(d) {
      var u, h;
      if (!((h = (u = this._parent) === null || u === void 0 ? void 0 : u._prefixes) === null || h === void 0) && h.has(d) || this._prefixes && !this._prefixes.has(d))
        throw new Error(`CodeGen: prefix "${d}" is not allowed in this scope`);
      return this._names[d] = { prefix: d, index: 0 };
    }
  }
  e.Scope = s;
  class a extends t.Name {
    constructor(d, u) {
      super(u), this.prefix = d;
    }
    setValue(d, { property: u, itemIndex: h }) {
      this.value = d, this.scopePath = (0, t._)`.${new t.Name(u)}[${h}]`;
    }
  }
  e.ValueScopeName = a;
  const o = (0, t._)`\n`;
  class l extends s {
    constructor(d) {
      super(d), this._values = {}, this._scope = d.scope, this.opts = { ...d, _n: d.lines ? o : t.nil };
    }
    get() {
      return this._scope;
    }
    name(d) {
      return new a(d, this._newName(d));
    }
    value(d, u) {
      var h;
      if (u.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const b = this.toName(d), { prefix: g } = b, w = (h = u.key) !== null && h !== void 0 ? h : u.ref;
      let _ = this._values[g];
      if (_) {
        const v = _.get(w);
        if (v)
          return v;
      } else
        _ = this._values[g] = /* @__PURE__ */ new Map();
      _.set(w, b);
      const y = this._scope[g] || (this._scope[g] = []), m = y.length;
      return y[m] = u.ref, b.setValue(u, { property: g, itemIndex: m }), b;
    }
    getValue(d, u) {
      const h = this._values[d];
      if (h)
        return h.get(u);
    }
    scopeRefs(d, u = this._values) {
      return this._reduceValues(u, (h) => {
        if (h.scopePath === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return (0, t._)`${d}${h.scopePath}`;
      });
    }
    scopeCode(d = this._values, u, h) {
      return this._reduceValues(d, (b) => {
        if (b.value === void 0)
          throw new Error(`CodeGen: name "${b}" has no value`);
        return b.value.code;
      }, u, h);
    }
    _reduceValues(d, u, h = {}, b) {
      let g = t.nil;
      for (const w in d) {
        const _ = d[w];
        if (!_)
          continue;
        const y = h[w] = h[w] || /* @__PURE__ */ new Map();
        _.forEach((m) => {
          if (y.has(m))
            return;
          y.set(m, n.Started);
          let v = u(m);
          if (v) {
            const N = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            g = (0, t._)`${g}${N} ${m} = ${v};${this.opts._n}`;
          } else if (v = b == null ? void 0 : b(m))
            g = (0, t._)`${g}${v}${this.opts._n}`;
          else
            throw new r(m);
          y.set(m, n.Completed);
        });
      }
      return g;
    }
  }
  e.ValueScope = l;
})(oa);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = on, r = oa;
  var n = on;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return n.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return n.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return n.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } });
  var s = oa;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return s.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return s.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return s.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return s.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class a {
    optimizeNodes() {
      return this;
    }
    optimizeNames(i, f) {
      return this;
    }
  }
  class o extends a {
    constructor(i, f, E) {
      super(), this.varKind = i, this.name = f, this.rhs = E;
    }
    render({ es5: i, _n: f }) {
      const E = i ? r.varKinds.var : this.varKind, I = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${E} ${this.name}${I};` + f;
    }
    optimizeNames(i, f) {
      if (i[this.name.str])
        return this.rhs && (this.rhs = T(this.rhs, i, f)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class l extends a {
    constructor(i, f, E) {
      super(), this.lhs = i, this.rhs = f, this.sideEffects = E;
    }
    render({ _n: i }) {
      return `${this.lhs} = ${this.rhs};` + i;
    }
    optimizeNames(i, f) {
      if (!(this.lhs instanceof t.Name && !i[this.lhs.str] && !this.sideEffects))
        return this.rhs = T(this.rhs, i, f), this;
    }
    get names() {
      const i = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return se(i, this.rhs);
    }
  }
  class c extends l {
    constructor(i, f, E, I) {
      super(i, E, I), this.op = f;
    }
    render({ _n: i }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + i;
    }
  }
  class d extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `${this.label}:` + i;
    }
  }
  class u extends a {
    constructor(i) {
      super(), this.label = i, this.names = {};
    }
    render({ _n: i }) {
      return `break${this.label ? ` ${this.label}` : ""};` + i;
    }
  }
  class h extends a {
    constructor(i) {
      super(), this.error = i;
    }
    render({ _n: i }) {
      return `throw ${this.error};` + i;
    }
    get names() {
      return this.error.names;
    }
  }
  class b extends a {
    constructor(i) {
      super(), this.code = i;
    }
    render({ _n: i }) {
      return `${this.code};` + i;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames(i, f) {
      return this.code = T(this.code, i, f), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class g extends a {
    constructor(i = []) {
      super(), this.nodes = i;
    }
    render(i) {
      return this.nodes.reduce((f, E) => f + E.render(i), "");
    }
    optimizeNodes() {
      const { nodes: i } = this;
      let f = i.length;
      for (; f--; ) {
        const E = i[f].optimizeNodes();
        Array.isArray(E) ? i.splice(f, 1, ...E) : E ? i[f] = E : i.splice(f, 1);
      }
      return i.length > 0 ? this : void 0;
    }
    optimizeNames(i, f) {
      const { nodes: E } = this;
      let I = E.length;
      for (; I--; ) {
        const j = E[I];
        j.optimizeNames(i, f) || (k(i, j.names), E.splice(I, 1));
      }
      return E.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce((i, f) => H(i, f.names), {});
    }
  }
  class w extends g {
    render(i) {
      return "{" + i._n + super.render(i) + "}" + i._n;
    }
  }
  class _ extends g {
  }
  class y extends w {
  }
  y.kind = "else";
  class m extends w {
    constructor(i, f) {
      super(f), this.condition = i;
    }
    render(i) {
      let f = `if(${this.condition})` + super.render(i);
      return this.else && (f += "else " + this.else.render(i)), f;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const i = this.condition;
      if (i === !0)
        return this.nodes;
      let f = this.else;
      if (f) {
        const E = f.optimizeNodes();
        f = this.else = Array.isArray(E) ? new y(E) : E;
      }
      if (f)
        return i === !1 ? f instanceof m ? f : f.nodes : this.nodes.length ? this : new m(L(i), f instanceof m ? [f] : f.nodes);
      if (!(i === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames(i, f) {
      var E;
      if (this.else = (E = this.else) === null || E === void 0 ? void 0 : E.optimizeNames(i, f), !!(super.optimizeNames(i, f) || this.else))
        return this.condition = T(this.condition, i, f), this;
    }
    get names() {
      const i = super.names;
      return se(i, this.condition), this.else && H(i, this.else.names), i;
    }
  }
  m.kind = "if";
  class v extends w {
  }
  v.kind = "for";
  class N extends v {
    constructor(i) {
      super(), this.iteration = i;
    }
    render(i) {
      return `for(${this.iteration})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iteration = T(this.iteration, i, f), this;
    }
    get names() {
      return H(super.names, this.iteration.names);
    }
  }
  class R extends v {
    constructor(i, f, E, I) {
      super(), this.varKind = i, this.name = f, this.from = E, this.to = I;
    }
    render(i) {
      const f = i.es5 ? r.varKinds.var : this.varKind, { name: E, from: I, to: j } = this;
      return `for(${f} ${E}=${I}; ${E}<${j}; ${E}++)` + super.render(i);
    }
    get names() {
      const i = se(super.names, this.from);
      return se(i, this.to);
    }
  }
  class O extends v {
    constructor(i, f, E, I) {
      super(), this.loop = i, this.varKind = f, this.name = E, this.iterable = I;
    }
    render(i) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(i);
    }
    optimizeNames(i, f) {
      if (super.optimizeNames(i, f))
        return this.iterable = T(this.iterable, i, f), this;
    }
    get names() {
      return H(super.names, this.iterable.names);
    }
  }
  class K extends w {
    constructor(i, f, E) {
      super(), this.name = i, this.args = f, this.async = E;
    }
    render(i) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(i);
    }
  }
  K.kind = "func";
  class J extends g {
    render(i) {
      return "return " + super.render(i);
    }
  }
  J.kind = "return";
  class ue extends w {
    render(i) {
      let f = "try" + super.render(i);
      return this.catch && (f += this.catch.render(i)), this.finally && (f += this.finally.render(i)), f;
    }
    optimizeNodes() {
      var i, f;
      return super.optimizeNodes(), (i = this.catch) === null || i === void 0 || i.optimizeNodes(), (f = this.finally) === null || f === void 0 || f.optimizeNodes(), this;
    }
    optimizeNames(i, f) {
      var E, I;
      return super.optimizeNames(i, f), (E = this.catch) === null || E === void 0 || E.optimizeNames(i, f), (I = this.finally) === null || I === void 0 || I.optimizeNames(i, f), this;
    }
    get names() {
      const i = super.names;
      return this.catch && H(i, this.catch.names), this.finally && H(i, this.finally.names), i;
    }
  }
  class fe extends w {
    constructor(i) {
      super(), this.error = i;
    }
    render(i) {
      return `catch(${this.error})` + super.render(i);
    }
  }
  fe.kind = "catch";
  class $e extends w {
    render(i) {
      return "finally" + super.render(i);
    }
  }
  $e.kind = "finally";
  class z {
    constructor(i, f = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...f, _n: f.lines ? `
` : "" }, this._extScope = i, this._scope = new r.Scope({ parent: i }), this._nodes = [new _()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name(i) {
      return this._scope.name(i);
    }
    // reserves unique name in the external scope
    scopeName(i) {
      return this._extScope.name(i);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue(i, f) {
      const E = this._extScope.value(i, f);
      return (this._values[E.prefix] || (this._values[E.prefix] = /* @__PURE__ */ new Set())).add(E), E;
    }
    getScopeValue(i, f) {
      return this._extScope.getValue(i, f);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs(i) {
      return this._extScope.scopeRefs(i, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def(i, f, E, I) {
      const j = this._scope.toName(f);
      return E !== void 0 && I && (this._constants[j.str] = E), this._leafNode(new o(i, j, E)), j;
    }
    // `const` declaration (`var` in es5 mode)
    const(i, f, E) {
      return this._def(r.varKinds.const, i, f, E);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let(i, f, E) {
      return this._def(r.varKinds.let, i, f, E);
    }
    // `var` declaration with optional assignment
    var(i, f, E) {
      return this._def(r.varKinds.var, i, f, E);
    }
    // assignment code
    assign(i, f, E) {
      return this._leafNode(new l(i, f, E));
    }
    // `+=` code
    add(i, f) {
      return this._leafNode(new c(i, e.operators.ADD, f));
    }
    // appends passed SafeExpr to code or executes Block
    code(i) {
      return typeof i == "function" ? i() : i !== t.nil && this._leafNode(new b(i)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...i) {
      const f = ["{"];
      for (const [E, I] of i)
        f.length > 1 && f.push(","), f.push(E), (E !== I || this.opts.es5) && (f.push(":"), (0, t.addCodeArg)(f, I));
      return f.push("}"), new t._Code(f);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if(i, f, E) {
      if (this._blockNode(new m(i)), f && E)
        this.code(f).else().code(E).endIf();
      else if (f)
        this.code(f).endIf();
      else if (E)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf(i) {
      return this._elseNode(new m(i));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new y());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(m, y);
    }
    _for(i, f) {
      return this._blockNode(i), f && this.code(f).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for(i, f) {
      return this._for(new N(i), f);
    }
    // `for` statement for a range of values
    forRange(i, f, E, I, j = this.opts.es5 ? r.varKinds.var : r.varKinds.let) {
      const F = this._scope.toName(i);
      return this._for(new R(j, F, f, E), () => I(F));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf(i, f, E, I = r.varKinds.const) {
      const j = this._scope.toName(i);
      if (this.opts.es5) {
        const F = f instanceof t.Name ? f : this.var("_arr", f);
        return this.forRange("_i", 0, (0, t._)`${F}.length`, (V) => {
          this.var(j, (0, t._)`${F}[${V}]`), E(j);
        });
      }
      return this._for(new O("of", I, j, f), () => E(j));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn(i, f, E, I = this.opts.es5 ? r.varKinds.var : r.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf(i, (0, t._)`Object.keys(${f})`, E);
      const j = this._scope.toName(i);
      return this._for(new O("in", I, j, f), () => E(j));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(v);
    }
    // `label` statement
    label(i) {
      return this._leafNode(new d(i));
    }
    // `break` statement
    break(i) {
      return this._leafNode(new u(i));
    }
    // `return` statement
    return(i) {
      const f = new J();
      if (this._blockNode(f), this.code(i), f.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(J);
    }
    // `try` statement
    try(i, f, E) {
      if (!f && !E)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const I = new ue();
      if (this._blockNode(I), this.code(i), f) {
        const j = this.name("e");
        this._currNode = I.catch = new fe(j), f(j);
      }
      return E && (this._currNode = I.finally = new $e(), this.code(E)), this._endBlockNode(fe, $e);
    }
    // `throw` statement
    throw(i) {
      return this._leafNode(new h(i));
    }
    // start self-balancing block
    block(i, f) {
      return this._blockStarts.push(this._nodes.length), i && this.code(i).endBlock(f), this;
    }
    // end the current self-balancing block
    endBlock(i) {
      const f = this._blockStarts.pop();
      if (f === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const E = this._nodes.length - f;
      if (E < 0 || i !== void 0 && E !== i)
        throw new Error(`CodeGen: wrong number of nodes: ${E} vs ${i} expected`);
      return this._nodes.length = f, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func(i, f = t.nil, E, I) {
      return this._blockNode(new K(i, f, E)), I && this.code(I).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(K);
    }
    optimize(i = 1) {
      for (; i-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode(i) {
      return this._currNode.nodes.push(i), this;
    }
    _blockNode(i) {
      this._currNode.nodes.push(i), this._nodes.push(i);
    }
    _endBlockNode(i, f) {
      const E = this._currNode;
      if (E instanceof i || f && E instanceof f)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${f ? `${i.kind}/${f.kind}` : i.kind}"`);
    }
    _elseNode(i) {
      const f = this._currNode;
      if (!(f instanceof m))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = f.else = i, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const i = this._nodes;
      return i[i.length - 1];
    }
    set _currNode(i) {
      const f = this._nodes;
      f[f.length - 1] = i;
    }
  }
  e.CodeGen = z;
  function H($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) + (i[f] || 0);
    return $;
  }
  function se($, i) {
    return i instanceof t._CodeOrName ? H($, i.names) : $;
  }
  function T($, i, f) {
    if ($ instanceof t.Name)
      return E($);
    if (!I($))
      return $;
    return new t._Code($._items.reduce((j, F) => (F instanceof t.Name && (F = E(F)), F instanceof t._Code ? j.push(...F._items) : j.push(F), j), []));
    function E(j) {
      const F = f[j.str];
      return F === void 0 || i[j.str] !== 1 ? j : (delete i[j.str], F);
    }
    function I(j) {
      return j instanceof t._Code && j._items.some((F) => F instanceof t.Name && i[F.str] === 1 && f[F.str] !== void 0);
    }
  }
  function k($, i) {
    for (const f in i)
      $[f] = ($[f] || 0) - (i[f] || 0);
  }
  function L($) {
    return typeof $ == "boolean" || typeof $ == "number" || $ === null ? !$ : (0, t._)`!${S($)}`;
  }
  e.not = L;
  const D = p(e.operators.AND);
  function G(...$) {
    return $.reduce(D);
  }
  e.and = G;
  const M = p(e.operators.OR);
  function P(...$) {
    return $.reduce(M);
  }
  e.or = P;
  function p($) {
    return (i, f) => i === t.nil ? f : f === t.nil ? i : (0, t._)`${S(i)} ${$} ${S(f)}`;
  }
  function S($) {
    return $ instanceof t.Name ? $ : (0, t._)`(${$})`;
  }
})(ee);
var C = {};
Object.defineProperty(C, "__esModule", { value: !0 });
C.checkStrictMode = C.getErrorPath = C.Type = C.useFunc = C.setEvaluated = C.evaluatedPropsToName = C.mergeEvaluated = C.eachItem = C.unescapeJsonPointer = C.escapeJsonPointer = C.escapeFragment = C.unescapeFragment = C.schemaRefOrVal = C.schemaHasRulesButRef = C.schemaHasRules = C.checkUnknownRules = C.alwaysValidSchema = C.toHash = void 0;
const ie = ee, g0 = on;
function v0(e) {
  const t = {};
  for (const r of e)
    t[r] = !0;
  return t;
}
C.toHash = v0;
function w0(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (xl(e, t), !eu(t, e.self.RULES.all));
}
C.alwaysValidSchema = w0;
function xl(e, t = e.schema) {
  const { opts: r, self: n } = e;
  if (!r.strictSchema || typeof t == "boolean")
    return;
  const s = n.RULES.keywords;
  for (const a in t)
    s[a] || nu(e, `unknown keyword: "${a}"`);
}
C.checkUnknownRules = xl;
function eu(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t[r])
      return !0;
  return !1;
}
C.schemaHasRules = eu;
function E0(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (r !== "$ref" && t.all[r])
      return !0;
  return !1;
}
C.schemaHasRulesButRef = E0;
function b0({ topSchemaRef: e, schemaPath: t }, r, n, s) {
  if (!s) {
    if (typeof r == "number" || typeof r == "boolean")
      return r;
    if (typeof r == "string")
      return (0, ie._)`${r}`;
  }
  return (0, ie._)`${e}${t}${(0, ie.getProperty)(n)}`;
}
C.schemaRefOrVal = b0;
function S0(e) {
  return tu(decodeURIComponent(e));
}
C.unescapeFragment = S0;
function P0(e) {
  return encodeURIComponent(go(e));
}
C.escapeFragment = P0;
function go(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
C.escapeJsonPointer = go;
function tu(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
C.unescapeJsonPointer = tu;
function N0(e, t) {
  if (Array.isArray(e))
    for (const r of e)
      t(r);
  else
    t(e);
}
C.eachItem = N0;
function Zi({ mergeNames: e, mergeToName: t, mergeValues: r, resultToName: n }) {
  return (s, a, o, l) => {
    const c = o === void 0 ? a : o instanceof ie.Name ? (a instanceof ie.Name ? e(s, a, o) : t(s, a, o), o) : a instanceof ie.Name ? (t(s, o, a), a) : r(a, o);
    return l === ie.Name && !(c instanceof ie.Name) ? n(s, c) : c;
  };
}
C.mergeEvaluated = {
  props: Zi({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => {
      e.if((0, ie._)`${t} === true`, () => e.assign(r, !0), () => e.assign(r, (0, ie._)`${r} || {}`).code((0, ie._)`Object.assign(${r}, ${t})`));
    }),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => {
      t === !0 ? e.assign(r, !0) : (e.assign(r, (0, ie._)`${r} || {}`), vo(e, r, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: ru
  }),
  items: Zi({
    mergeNames: (e, t, r) => e.if((0, ie._)`${r} !== true && ${t} !== undefined`, () => e.assign(r, (0, ie._)`${t} === true ? true : ${r} > ${t} ? ${r} : ${t}`)),
    mergeToName: (e, t, r) => e.if((0, ie._)`${r} !== true`, () => e.assign(r, t === !0 ? !0 : (0, ie._)`${r} > ${t} ? ${r} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function ru(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const r = e.var("props", (0, ie._)`{}`);
  return t !== void 0 && vo(e, r, t), r;
}
C.evaluatedPropsToName = ru;
function vo(e, t, r) {
  Object.keys(r).forEach((n) => e.assign((0, ie._)`${t}${(0, ie.getProperty)(n)}`, !0));
}
C.setEvaluated = vo;
const xi = {};
function R0(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: xi[t.code] || (xi[t.code] = new g0._Code(t.code))
  });
}
C.useFunc = R0;
var ia;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ia || (C.Type = ia = {}));
function O0(e, t, r) {
  if (e instanceof ie.Name) {
    const n = t === ia.Num;
    return r ? n ? (0, ie._)`"[" + ${e} + "]"` : (0, ie._)`"['" + ${e} + "']"` : n ? (0, ie._)`"/" + ${e}` : (0, ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return r ? (0, ie.getProperty)(e).toString() : "/" + go(e);
}
C.getErrorPath = O0;
function nu(e, t, r = e.opts.strictSchema) {
  if (r) {
    if (t = `strict mode: ${t}`, r === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
C.checkStrictMode = nu;
var ut = {};
Object.defineProperty(ut, "__esModule", { value: !0 });
const Ne = ee, I0 = {
  // validation function arguments
  data: new Ne.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new Ne.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new Ne.Name("instancePath"),
  parentData: new Ne.Name("parentData"),
  parentDataProperty: new Ne.Name("parentDataProperty"),
  rootData: new Ne.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new Ne.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new Ne.Name("vErrors"),
  // null or array of validation errors
  errors: new Ne.Name("errors"),
  // counter of validation errors
  this: new Ne.Name("this"),
  // "globals"
  self: new Ne.Name("self"),
  scope: new Ne.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new Ne.Name("json"),
  jsonPos: new Ne.Name("jsonPos"),
  jsonLen: new Ne.Name("jsonLen"),
  jsonPart: new Ne.Name("jsonPart")
};
ut.default = I0;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ee, r = C, n = ut;
  e.keywordError = {
    message: ({ keyword: y }) => (0, t.str)`must pass "${y}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: y, schemaType: m }) => m ? (0, t.str)`"${y}" keyword must be ${m} ($data)` : (0, t.str)`"${y}" keyword is invalid ($data)`
  };
  function s(y, m = e.keywordError, v, N) {
    const { it: R } = y, { gen: O, compositeRule: K, allErrors: J } = R, ue = h(y, m, v);
    N ?? (K || J) ? c(O, ue) : d(R, (0, t._)`[${ue}]`);
  }
  e.reportError = s;
  function a(y, m = e.keywordError, v) {
    const { it: N } = y, { gen: R, compositeRule: O, allErrors: K } = N, J = h(y, m, v);
    c(R, J), O || K || d(N, n.default.vErrors);
  }
  e.reportExtraError = a;
  function o(y, m) {
    y.assign(n.default.errors, m), y.if((0, t._)`${n.default.vErrors} !== null`, () => y.if(m, () => y.assign((0, t._)`${n.default.vErrors}.length`, m), () => y.assign(n.default.vErrors, null)));
  }
  e.resetErrorsCount = o;
  function l({ gen: y, keyword: m, schemaValue: v, data: N, errsCount: R, it: O }) {
    if (R === void 0)
      throw new Error("ajv implementation error");
    const K = y.name("err");
    y.forRange("i", R, n.default.errors, (J) => {
      y.const(K, (0, t._)`${n.default.vErrors}[${J}]`), y.if((0, t._)`${K}.instancePath === undefined`, () => y.assign((0, t._)`${K}.instancePath`, (0, t.strConcat)(n.default.instancePath, O.errorPath))), y.assign((0, t._)`${K}.schemaPath`, (0, t.str)`${O.errSchemaPath}/${m}`), O.opts.verbose && (y.assign((0, t._)`${K}.schema`, v), y.assign((0, t._)`${K}.data`, N));
    });
  }
  e.extendErrors = l;
  function c(y, m) {
    const v = y.const("err", m);
    y.if((0, t._)`${n.default.vErrors} === null`, () => y.assign(n.default.vErrors, (0, t._)`[${v}]`), (0, t._)`${n.default.vErrors}.push(${v})`), y.code((0, t._)`${n.default.errors}++`);
  }
  function d(y, m) {
    const { gen: v, validateName: N, schemaEnv: R } = y;
    R.$async ? v.throw((0, t._)`new ${y.ValidationError}(${m})`) : (v.assign((0, t._)`${N}.errors`, m), v.return(!1));
  }
  const u = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function h(y, m, v) {
    const { createErrors: N } = y.it;
    return N === !1 ? (0, t._)`{}` : b(y, m, v);
  }
  function b(y, m, v = {}) {
    const { gen: N, it: R } = y, O = [
      g(R, v),
      w(y, v)
    ];
    return _(y, m, O), N.object(...O);
  }
  function g({ errorPath: y }, { instancePath: m }) {
    const v = m ? (0, t.str)`${y}${(0, r.getErrorPath)(m, r.Type.Str)}` : y;
    return [n.default.instancePath, (0, t.strConcat)(n.default.instancePath, v)];
  }
  function w({ keyword: y, it: { errSchemaPath: m } }, { schemaPath: v, parentSchema: N }) {
    let R = N ? m : (0, t.str)`${m}/${y}`;
    return v && (R = (0, t.str)`${R}${(0, r.getErrorPath)(v, r.Type.Str)}`), [u.schemaPath, R];
  }
  function _(y, { params: m, message: v }, N) {
    const { keyword: R, data: O, schemaValue: K, it: J } = y, { opts: ue, propertyName: fe, topSchemaRef: $e, schemaPath: z } = J;
    N.push([u.keyword, R], [u.params, typeof m == "function" ? m(y) : m || (0, t._)`{}`]), ue.messages && N.push([u.message, typeof v == "function" ? v(y) : v]), ue.verbose && N.push([u.schema, K], [u.parentSchema, (0, t._)`${$e}${z}`], [n.default.data, O]), fe && N.push([u.propertyName, fe]);
  }
})(dn);
Object.defineProperty(Rr, "__esModule", { value: !0 });
Rr.boolOrEmptySchema = Rr.topBoolOrEmptySchema = void 0;
const T0 = dn, j0 = ee, k0 = ut, A0 = {
  message: "boolean schema is false"
};
function C0(e) {
  const { gen: t, schema: r, validateName: n } = e;
  r === !1 ? su(e, !1) : typeof r == "object" && r.$async === !0 ? t.return(k0.default.data) : (t.assign((0, j0._)`${n}.errors`, null), t.return(!0));
}
Rr.topBoolOrEmptySchema = C0;
function D0(e, t) {
  const { gen: r, schema: n } = e;
  n === !1 ? (r.var(t, !1), su(e)) : r.var(t, !0);
}
Rr.boolOrEmptySchema = D0;
function su(e, t) {
  const { gen: r, data: n } = e, s = {
    gen: r,
    keyword: "false schema",
    data: n,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, T0.reportError)(s, A0, void 0, t);
}
var _e = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.getRules = lr.isJSONType = void 0;
const M0 = ["string", "number", "integer", "boolean", "null", "object", "array"], L0 = new Set(M0);
function V0(e) {
  return typeof e == "string" && L0.has(e);
}
lr.isJSONType = V0;
function F0() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
lr.getRules = F0;
var pt = {};
Object.defineProperty(pt, "__esModule", { value: !0 });
pt.shouldUseRule = pt.shouldUseGroup = pt.schemaHasRulesForType = void 0;
function z0({ schema: e, self: t }, r) {
  const n = t.RULES.types[r];
  return n && n !== !0 && au(e, n);
}
pt.schemaHasRulesForType = z0;
function au(e, t) {
  return t.rules.some((r) => ou(e, r));
}
pt.shouldUseGroup = au;
function ou(e, t) {
  var r;
  return e[t.keyword] !== void 0 || ((r = t.definition.implements) === null || r === void 0 ? void 0 : r.some((n) => e[n] !== void 0));
}
pt.shouldUseRule = ou;
Object.defineProperty(_e, "__esModule", { value: !0 });
_e.reportTypeError = _e.checkDataTypes = _e.checkDataType = _e.coerceAndCheckDataType = _e.getJSONTypes = _e.getSchemaTypes = _e.DataType = void 0;
const U0 = lr, q0 = pt, K0 = dn, x = ee, iu = C;
var Er;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(Er || (_e.DataType = Er = {}));
function G0(e) {
  const t = cu(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
_e.getSchemaTypes = G0;
function cu(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(U0.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
_e.getJSONTypes = cu;
function H0(e, t) {
  const { gen: r, data: n, opts: s } = e, a = W0(t, s.coerceTypes), o = t.length > 0 && !(a.length === 0 && t.length === 1 && (0, q0.schemaHasRulesForType)(e, t[0]));
  if (o) {
    const l = wo(t, n, s.strictNumbers, Er.Wrong);
    r.if(l, () => {
      a.length ? X0(e, t, a) : Eo(e);
    });
  }
  return o;
}
_e.coerceAndCheckDataType = H0;
const lu = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function W0(e, t) {
  return t ? e.filter((r) => lu.has(r) || t === "array" && r === "array") : [];
}
function X0(e, t, r) {
  const { gen: n, data: s, opts: a } = e, o = n.let("dataType", (0, x._)`typeof ${s}`), l = n.let("coerced", (0, x._)`undefined`);
  a.coerceTypes === "array" && n.if((0, x._)`${o} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => n.assign(s, (0, x._)`${s}[0]`).assign(o, (0, x._)`typeof ${s}`).if(wo(t, s, a.strictNumbers), () => n.assign(l, s))), n.if((0, x._)`${l} !== undefined`);
  for (const d of r)
    (lu.has(d) || d === "array" && a.coerceTypes === "array") && c(d);
  n.else(), Eo(e), n.endIf(), n.if((0, x._)`${l} !== undefined`, () => {
    n.assign(s, l), J0(e, l);
  });
  function c(d) {
    switch (d) {
      case "string":
        n.elseIf((0, x._)`${o} == "number" || ${o} == "boolean"`).assign(l, (0, x._)`"" + ${s}`).elseIf((0, x._)`${s} === null`).assign(l, (0, x._)`""`);
        return;
      case "number":
        n.elseIf((0, x._)`${o} == "boolean" || ${s} === null
              || (${o} == "string" && ${s} && ${s} == +${s})`).assign(l, (0, x._)`+${s}`);
        return;
      case "integer":
        n.elseIf((0, x._)`${o} === "boolean" || ${s} === null
              || (${o} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(l, (0, x._)`+${s}`);
        return;
      case "boolean":
        n.elseIf((0, x._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(l, !1).elseIf((0, x._)`${s} === "true" || ${s} === 1`).assign(l, !0);
        return;
      case "null":
        n.elseIf((0, x._)`${s} === "" || ${s} === 0 || ${s} === false`), n.assign(l, null);
        return;
      case "array":
        n.elseIf((0, x._)`${o} === "string" || ${o} === "number"
              || ${o} === "boolean" || ${s} === null`).assign(l, (0, x._)`[${s}]`);
    }
  }
}
function J0({ gen: e, parentData: t, parentDataProperty: r }, n) {
  e.if((0, x._)`${t} !== undefined`, () => e.assign((0, x._)`${t}[${r}]`, n));
}
function ca(e, t, r, n = Er.Correct) {
  const s = n === Er.Correct ? x.operators.EQ : x.operators.NEQ;
  let a;
  switch (e) {
    case "null":
      return (0, x._)`${t} ${s} null`;
    case "array":
      a = (0, x._)`Array.isArray(${t})`;
      break;
    case "object":
      a = (0, x._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      a = o((0, x._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      a = o();
      break;
    default:
      return (0, x._)`typeof ${t} ${s} ${e}`;
  }
  return n === Er.Correct ? a : (0, x.not)(a);
  function o(l = x.nil) {
    return (0, x.and)((0, x._)`typeof ${t} == "number"`, l, r ? (0, x._)`isFinite(${t})` : x.nil);
  }
}
_e.checkDataType = ca;
function wo(e, t, r, n) {
  if (e.length === 1)
    return ca(e[0], t, r, n);
  let s;
  const a = (0, iu.toHash)(e);
  if (a.array && a.object) {
    const o = (0, x._)`typeof ${t} != "object"`;
    s = a.null ? o : (0, x._)`!${t} || ${o}`, delete a.null, delete a.array, delete a.object;
  } else
    s = x.nil;
  a.number && delete a.integer;
  for (const o in a)
    s = (0, x.and)(s, ca(o, t, r, n));
  return s;
}
_e.checkDataTypes = wo;
const B0 = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, x._)`{type: ${e}}` : (0, x._)`{type: ${t}}`
};
function Eo(e) {
  const t = Y0(e);
  (0, K0.reportError)(t, B0);
}
_e.reportTypeError = Eo;
function Y0(e) {
  const { gen: t, data: r, schema: n } = e, s = (0, iu.schemaRefOrVal)(e, n, "type");
  return {
    gen: t,
    keyword: "type",
    data: r,
    schema: n.type,
    schemaCode: s,
    schemaValue: s,
    parentSchema: n,
    params: {},
    it: e
  };
}
var ms = {};
Object.defineProperty(ms, "__esModule", { value: !0 });
ms.assignDefaults = void 0;
const mr = ee, Q0 = C;
function Z0(e, t) {
  const { properties: r, items: n } = e.schema;
  if (t === "object" && r)
    for (const s in r)
      ec(e, s, r[s].default);
  else t === "array" && Array.isArray(n) && n.forEach((s, a) => ec(e, a, s.default));
}
ms.assignDefaults = Z0;
function ec(e, t, r) {
  const { gen: n, compositeRule: s, data: a, opts: o } = e;
  if (r === void 0)
    return;
  const l = (0, mr._)`${a}${(0, mr.getProperty)(t)}`;
  if (s) {
    (0, Q0.checkStrictMode)(e, `default is ignored for: ${l}`);
    return;
  }
  let c = (0, mr._)`${l} === undefined`;
  o.useDefaults === "empty" && (c = (0, mr._)`${c} || ${l} === null || ${l} === ""`), n.if(c, (0, mr._)`${l} = ${(0, mr.stringify)(r)}`);
}
var lt = {}, re = {};
Object.defineProperty(re, "__esModule", { value: !0 });
re.validateUnion = re.validateArray = re.usePattern = re.callValidateCode = re.schemaProperties = re.allSchemaProperties = re.noPropertyInData = re.propertyInData = re.isOwnProperty = re.hasPropFunc = re.reportMissingProp = re.checkMissingProp = re.checkReportMissingProp = void 0;
const le = ee, bo = C, St = ut, x0 = C;
function e_(e, t) {
  const { gen: r, data: n, it: s } = e;
  r.if(Po(r, n, t, s.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, le._)`${t}` }, !0), e.error();
  });
}
re.checkReportMissingProp = e_;
function t_({ gen: e, data: t, it: { opts: r } }, n, s) {
  return (0, le.or)(...n.map((a) => (0, le.and)(Po(e, t, a, r.ownProperties), (0, le._)`${s} = ${a}`)));
}
re.checkMissingProp = t_;
function r_(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
re.reportMissingProp = r_;
function uu(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, le._)`Object.prototype.hasOwnProperty`
  });
}
re.hasPropFunc = uu;
function So(e, t, r) {
  return (0, le._)`${uu(e)}.call(${t}, ${r})`;
}
re.isOwnProperty = So;
function n_(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} !== undefined`;
  return n ? (0, le._)`${s} && ${So(e, t, r)}` : s;
}
re.propertyInData = n_;
function Po(e, t, r, n) {
  const s = (0, le._)`${t}${(0, le.getProperty)(r)} === undefined`;
  return n ? (0, le.or)(s, (0, le.not)(So(e, t, r))) : s;
}
re.noPropertyInData = Po;
function du(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
re.allSchemaProperties = du;
function s_(e, t) {
  return du(t).filter((r) => !(0, bo.alwaysValidSchema)(e, t[r]));
}
re.schemaProperties = s_;
function a_({ schemaCode: e, data: t, it: { gen: r, topSchemaRef: n, schemaPath: s, errorPath: a }, it: o }, l, c, d) {
  const u = d ? (0, le._)`${e}, ${t}, ${n}${s}` : t, h = [
    [St.default.instancePath, (0, le.strConcat)(St.default.instancePath, a)],
    [St.default.parentData, o.parentData],
    [St.default.parentDataProperty, o.parentDataProperty],
    [St.default.rootData, St.default.rootData]
  ];
  o.opts.dynamicRef && h.push([St.default.dynamicAnchors, St.default.dynamicAnchors]);
  const b = (0, le._)`${u}, ${r.object(...h)}`;
  return c !== le.nil ? (0, le._)`${l}.call(${c}, ${b})` : (0, le._)`${l}(${b})`;
}
re.callValidateCode = a_;
const o_ = (0, le._)`new RegExp`;
function i_({ gen: e, it: { opts: t } }, r) {
  const n = t.unicodeRegExp ? "u" : "", { regExp: s } = t.code, a = s(r, n);
  return e.scopeValue("pattern", {
    key: a.toString(),
    ref: a,
    code: (0, le._)`${s.code === "new RegExp" ? o_ : (0, x0.useFunc)(e, s)}(${r}, ${n})`
  });
}
re.usePattern = i_;
function c_(e) {
  const { gen: t, data: r, keyword: n, it: s } = e, a = t.name("valid");
  if (s.allErrors) {
    const l = t.let("valid", !0);
    return o(() => t.assign(l, !1)), l;
  }
  return t.var(a, !0), o(() => t.break()), a;
  function o(l) {
    const c = t.const("len", (0, le._)`${r}.length`);
    t.forRange("i", 0, c, (d) => {
      e.subschema({
        keyword: n,
        dataProp: d,
        dataPropType: bo.Type.Num
      }, a), t.if((0, le.not)(a), l);
    });
  }
}
re.validateArray = c_;
function l_(e) {
  const { gen: t, schema: r, keyword: n, it: s } = e;
  if (!Array.isArray(r))
    throw new Error("ajv implementation error");
  if (r.some((c) => (0, bo.alwaysValidSchema)(s, c)) && !s.opts.unevaluated)
    return;
  const o = t.let("valid", !1), l = t.name("_valid");
  t.block(() => r.forEach((c, d) => {
    const u = e.subschema({
      keyword: n,
      schemaProp: d,
      compositeRule: !0
    }, l);
    t.assign(o, (0, le._)`${o} || ${l}`), e.mergeValidEvaluated(u, l) || t.if((0, le.not)(o));
  })), e.result(o, () => e.reset(), () => e.error(!0));
}
re.validateUnion = l_;
Object.defineProperty(lt, "__esModule", { value: !0 });
lt.validateKeywordUsage = lt.validSchemaType = lt.funcKeywordCode = lt.macroKeywordCode = void 0;
const Te = ee, rr = ut, u_ = re, d_ = dn;
function f_(e, t) {
  const { gen: r, keyword: n, schema: s, parentSchema: a, it: o } = e, l = t.macro.call(o.self, s, a, o), c = fu(r, n, l);
  o.opts.validateSchema !== !1 && o.self.validateSchema(l, !0);
  const d = r.name("valid");
  e.subschema({
    schema: l,
    schemaPath: Te.nil,
    errSchemaPath: `${o.errSchemaPath}/${n}`,
    topSchemaRef: c,
    compositeRule: !0
  }, d), e.pass(d, () => e.error(!0));
}
lt.macroKeywordCode = f_;
function h_(e, t) {
  var r;
  const { gen: n, keyword: s, schema: a, parentSchema: o, $data: l, it: c } = e;
  p_(c, t);
  const d = !l && t.compile ? t.compile.call(c.self, a, o, c) : t.validate, u = fu(n, s, d), h = n.let("valid");
  e.block$data(h, b), e.ok((r = t.valid) !== null && r !== void 0 ? r : h);
  function b() {
    if (t.errors === !1)
      _(), t.modifying && tc(e), y(() => e.error());
    else {
      const m = t.async ? g() : w();
      t.modifying && tc(e), y(() => m_(e, m));
    }
  }
  function g() {
    const m = n.let("ruleErrs", null);
    return n.try(() => _((0, Te._)`await `), (v) => n.assign(h, !1).if((0, Te._)`${v} instanceof ${c.ValidationError}`, () => n.assign(m, (0, Te._)`${v}.errors`), () => n.throw(v))), m;
  }
  function w() {
    const m = (0, Te._)`${u}.errors`;
    return n.assign(m, null), _(Te.nil), m;
  }
  function _(m = t.async ? (0, Te._)`await ` : Te.nil) {
    const v = c.opts.passContext ? rr.default.this : rr.default.self, N = !("compile" in t && !l || t.schema === !1);
    n.assign(h, (0, Te._)`${m}${(0, u_.callValidateCode)(e, u, v, N)}`, t.modifying);
  }
  function y(m) {
    var v;
    n.if((0, Te.not)((v = t.valid) !== null && v !== void 0 ? v : h), m);
  }
}
lt.funcKeywordCode = h_;
function tc(e) {
  const { gen: t, data: r, it: n } = e;
  t.if(n.parentData, () => t.assign(r, (0, Te._)`${n.parentData}[${n.parentDataProperty}]`));
}
function m_(e, t) {
  const { gen: r } = e;
  r.if((0, Te._)`Array.isArray(${t})`, () => {
    r.assign(rr.default.vErrors, (0, Te._)`${rr.default.vErrors} === null ? ${t} : ${rr.default.vErrors}.concat(${t})`).assign(rr.default.errors, (0, Te._)`${rr.default.vErrors}.length`), (0, d_.extendErrors)(e);
  }, () => e.error());
}
function p_({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function fu(e, t, r) {
  if (r === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof r == "function" ? { ref: r } : { ref: r, code: (0, Te.stringify)(r) });
}
function $_(e, t, r = !1) {
  return !t.length || t.some((n) => n === "array" ? Array.isArray(e) : n === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == n || r && typeof e > "u");
}
lt.validSchemaType = $_;
function y_({ schema: e, opts: t, self: r, errSchemaPath: n }, s, a) {
  if (Array.isArray(s.keyword) ? !s.keyword.includes(a) : s.keyword !== a)
    throw new Error("ajv implementation error");
  const o = s.dependencies;
  if (o != null && o.some((l) => !Object.prototype.hasOwnProperty.call(e, l)))
    throw new Error(`parent schema must have dependencies of ${a}: ${o.join(",")}`);
  if (s.validateSchema && !s.validateSchema(e[a])) {
    const c = `keyword "${a}" value is invalid at path "${n}": ` + r.errorsText(s.validateSchema.errors);
    if (t.validateSchema === "log")
      r.logger.error(c);
    else
      throw new Error(c);
  }
}
lt.validateKeywordUsage = y_;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.extendSubschemaMode = Ct.extendSubschemaData = Ct.getSubschema = void 0;
const ot = ee, hu = C;
function __(e, { keyword: t, schemaProp: r, schema: n, schemaPath: s, errSchemaPath: a, topSchemaRef: o }) {
  if (t !== void 0 && n !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const l = e.schema[t];
    return r === void 0 ? {
      schema: l,
      schemaPath: (0, ot._)`${e.schemaPath}${(0, ot.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: l[r],
      schemaPath: (0, ot._)`${e.schemaPath}${(0, ot.getProperty)(t)}${(0, ot.getProperty)(r)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, hu.escapeFragment)(r)}`
    };
  }
  if (n !== void 0) {
    if (s === void 0 || a === void 0 || o === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: n,
      schemaPath: s,
      topSchemaRef: o,
      errSchemaPath: a
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
Ct.getSubschema = __;
function g_(e, t, { dataProp: r, dataPropType: n, data: s, dataTypes: a, propertyName: o }) {
  if (s !== void 0 && r !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: l } = t;
  if (r !== void 0) {
    const { errorPath: d, dataPathArr: u, opts: h } = t, b = l.let("data", (0, ot._)`${t.data}${(0, ot.getProperty)(r)}`, !0);
    c(b), e.errorPath = (0, ot.str)`${d}${(0, hu.getErrorPath)(r, n, h.jsPropertySyntax)}`, e.parentDataProperty = (0, ot._)`${r}`, e.dataPathArr = [...u, e.parentDataProperty];
  }
  if (s !== void 0) {
    const d = s instanceof ot.Name ? s : l.let("data", s, !0);
    c(d), o !== void 0 && (e.propertyName = o);
  }
  a && (e.dataTypes = a);
  function c(d) {
    e.data = d, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, d];
  }
}
Ct.extendSubschemaData = g_;
function v_(e, { jtdDiscriminator: t, jtdMetadata: r, compositeRule: n, createErrors: s, allErrors: a }) {
  n !== void 0 && (e.compositeRule = n), s !== void 0 && (e.createErrors = s), a !== void 0 && (e.allErrors = a), e.jtdDiscriminator = t, e.jtdMetadata = r;
}
Ct.extendSubschemaMode = v_;
var be = {}, mu = { exports: {} }, kt = mu.exports = function(e, t, r) {
  typeof t == "function" && (r = t, t = {}), r = t.cb || r;
  var n = typeof r == "function" ? r : r.pre || function() {
  }, s = r.post || function() {
  };
  Un(t, n, s, e, "", e);
};
kt.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
kt.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
kt.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
kt.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Un(e, t, r, n, s, a, o, l, c, d) {
  if (n && typeof n == "object" && !Array.isArray(n)) {
    t(n, s, a, o, l, c, d);
    for (var u in n) {
      var h = n[u];
      if (Array.isArray(h)) {
        if (u in kt.arrayKeywords)
          for (var b = 0; b < h.length; b++)
            Un(e, t, r, h[b], s + "/" + u + "/" + b, a, s, u, n, b);
      } else if (u in kt.propsKeywords) {
        if (h && typeof h == "object")
          for (var g in h)
            Un(e, t, r, h[g], s + "/" + u + "/" + w_(g), a, s, u, n, g);
      } else (u in kt.keywords || e.allKeys && !(u in kt.skipKeywords)) && Un(e, t, r, h, s + "/" + u, a, s, u, n);
    }
    r(n, s, a, o, l, c, d);
  }
}
function w_(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var E_ = mu.exports;
Object.defineProperty(be, "__esModule", { value: !0 });
be.getSchemaRefs = be.resolveUrl = be.normalizeId = be._getFullPath = be.getFullPath = be.inlineRef = void 0;
const b_ = C, S_ = is, P_ = E_, N_ = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function R_(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !la(e) : t ? pu(e) <= t : !1;
}
be.inlineRef = R_;
const O_ = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function la(e) {
  for (const t in e) {
    if (O_.has(t))
      return !0;
    const r = e[t];
    if (Array.isArray(r) && r.some(la) || typeof r == "object" && la(r))
      return !0;
  }
  return !1;
}
function pu(e) {
  let t = 0;
  for (const r in e) {
    if (r === "$ref")
      return 1 / 0;
    if (t++, !N_.has(r) && (typeof e[r] == "object" && (0, b_.eachItem)(e[r], (n) => t += pu(n)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function $u(e, t = "", r) {
  r !== !1 && (t = br(t));
  const n = e.parse(t);
  return yu(e, n);
}
be.getFullPath = $u;
function yu(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
be._getFullPath = yu;
const I_ = /#\/?$/;
function br(e) {
  return e ? e.replace(I_, "") : "";
}
be.normalizeId = br;
function T_(e, t, r) {
  return r = br(r), e.resolve(t, r);
}
be.resolveUrl = T_;
const j_ = /^[a-z_][-a-z0-9._]*$/i;
function k_(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: r, uriResolver: n } = this.opts, s = br(e[r] || t), a = { "": s }, o = $u(n, s, !1), l = {}, c = /* @__PURE__ */ new Set();
  return P_(e, { allKeys: !0 }, (h, b, g, w) => {
    if (w === void 0)
      return;
    const _ = o + b;
    let y = a[w];
    typeof h[r] == "string" && (y = m.call(this, h[r])), v.call(this, h.$anchor), v.call(this, h.$dynamicAnchor), a[b] = y;
    function m(N) {
      const R = this.opts.uriResolver.resolve;
      if (N = br(y ? R(y, N) : N), c.has(N))
        throw u(N);
      c.add(N);
      let O = this.refs[N];
      return typeof O == "string" && (O = this.refs[O]), typeof O == "object" ? d(h, O.schema, N) : N !== br(_) && (N[0] === "#" ? (d(h, l[N], N), l[N] = h) : this.refs[N] = _), N;
    }
    function v(N) {
      if (typeof N == "string") {
        if (!j_.test(N))
          throw new Error(`invalid anchor "${N}"`);
        m.call(this, `#${N}`);
      }
    }
  }), l;
  function d(h, b, g) {
    if (b !== void 0 && !S_(h, b))
      throw u(g);
  }
  function u(h) {
    return new Error(`reference "${h}" resolves to more than one schema`);
  }
}
be.getSchemaRefs = k_;
Object.defineProperty(xe, "__esModule", { value: !0 });
xe.getData = xe.KeywordCxt = xe.validateFunctionCode = void 0;
const _u = Rr, rc = _e, No = pt, Zn = _e, A_ = ms, en = lt, Ds = Ct, q = ee, X = ut, C_ = be, $t = C, Kr = dn;
function D_(e) {
  if (wu(e) && (Eu(e), vu(e))) {
    V_(e);
    return;
  }
  gu(e, () => (0, _u.topBoolOrEmptySchema)(e));
}
xe.validateFunctionCode = D_;
function gu({ gen: e, validateName: t, schema: r, schemaEnv: n, opts: s }, a) {
  s.code.es5 ? e.func(t, (0, q._)`${X.default.data}, ${X.default.valCxt}`, n.$async, () => {
    e.code((0, q._)`"use strict"; ${nc(r, s)}`), L_(e, s), e.code(a);
  }) : e.func(t, (0, q._)`${X.default.data}, ${M_(s)}`, n.$async, () => e.code(nc(r, s)).code(a));
}
function M_(e) {
  return (0, q._)`{${X.default.instancePath}="", ${X.default.parentData}, ${X.default.parentDataProperty}, ${X.default.rootData}=${X.default.data}${e.dynamicRef ? (0, q._)`, ${X.default.dynamicAnchors}={}` : q.nil}}={}`;
}
function L_(e, t) {
  e.if(X.default.valCxt, () => {
    e.var(X.default.instancePath, (0, q._)`${X.default.valCxt}.${X.default.instancePath}`), e.var(X.default.parentData, (0, q._)`${X.default.valCxt}.${X.default.parentData}`), e.var(X.default.parentDataProperty, (0, q._)`${X.default.valCxt}.${X.default.parentDataProperty}`), e.var(X.default.rootData, (0, q._)`${X.default.valCxt}.${X.default.rootData}`), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, q._)`${X.default.valCxt}.${X.default.dynamicAnchors}`);
  }, () => {
    e.var(X.default.instancePath, (0, q._)`""`), e.var(X.default.parentData, (0, q._)`undefined`), e.var(X.default.parentDataProperty, (0, q._)`undefined`), e.var(X.default.rootData, X.default.data), t.dynamicRef && e.var(X.default.dynamicAnchors, (0, q._)`{}`);
  });
}
function V_(e) {
  const { schema: t, opts: r, gen: n } = e;
  gu(e, () => {
    r.$comment && t.$comment && Su(e), K_(e), n.let(X.default.vErrors, null), n.let(X.default.errors, 0), r.unevaluated && F_(e), bu(e), W_(e);
  });
}
function F_(e) {
  const { gen: t, validateName: r } = e;
  e.evaluated = t.const("evaluated", (0, q._)`${r}.evaluated`), t.if((0, q._)`${e.evaluated}.dynamicProps`, () => t.assign((0, q._)`${e.evaluated}.props`, (0, q._)`undefined`)), t.if((0, q._)`${e.evaluated}.dynamicItems`, () => t.assign((0, q._)`${e.evaluated}.items`, (0, q._)`undefined`));
}
function nc(e, t) {
  const r = typeof e == "object" && e[t.schemaId];
  return r && (t.code.source || t.code.process) ? (0, q._)`/*# sourceURL=${r} */` : q.nil;
}
function z_(e, t) {
  if (wu(e) && (Eu(e), vu(e))) {
    U_(e, t);
    return;
  }
  (0, _u.boolOrEmptySchema)(e, t);
}
function vu({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const r in e)
    if (t.RULES.all[r])
      return !0;
  return !1;
}
function wu(e) {
  return typeof e.schema != "boolean";
}
function U_(e, t) {
  const { schema: r, gen: n, opts: s } = e;
  s.$comment && r.$comment && Su(e), G_(e), H_(e);
  const a = n.const("_errs", X.default.errors);
  bu(e, a), n.var(t, (0, q._)`${a} === ${X.default.errors}`);
}
function Eu(e) {
  (0, $t.checkUnknownRules)(e), q_(e);
}
function bu(e, t) {
  if (e.opts.jtd)
    return sc(e, [], !1, t);
  const r = (0, rc.getSchemaTypes)(e.schema), n = (0, rc.coerceAndCheckDataType)(e, r);
  sc(e, r, !n, t);
}
function q_(e) {
  const { schema: t, errSchemaPath: r, opts: n, self: s } = e;
  t.$ref && n.ignoreKeywordsWithRef && (0, $t.schemaHasRulesButRef)(t, s.RULES) && s.logger.warn(`$ref: keywords ignored in schema at path "${r}"`);
}
function K_(e) {
  const { schema: t, opts: r } = e;
  t.default !== void 0 && r.useDefaults && r.strictSchema && (0, $t.checkStrictMode)(e, "default is ignored in the schema root");
}
function G_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, C_.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function H_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function Su({ gen: e, schemaEnv: t, schema: r, errSchemaPath: n, opts: s }) {
  const a = r.$comment;
  if (s.$comment === !0)
    e.code((0, q._)`${X.default.self}.logger.log(${a})`);
  else if (typeof s.$comment == "function") {
    const o = (0, q.str)`${n}/$comment`, l = e.scopeValue("root", { ref: t.root });
    e.code((0, q._)`${X.default.self}.opts.$comment(${a}, ${o}, ${l}.schema)`);
  }
}
function W_(e) {
  const { gen: t, schemaEnv: r, validateName: n, ValidationError: s, opts: a } = e;
  r.$async ? t.if((0, q._)`${X.default.errors} === 0`, () => t.return(X.default.data), () => t.throw((0, q._)`new ${s}(${X.default.vErrors})`)) : (t.assign((0, q._)`${n}.errors`, X.default.vErrors), a.unevaluated && X_(e), t.return((0, q._)`${X.default.errors} === 0`));
}
function X_({ gen: e, evaluated: t, props: r, items: n }) {
  r instanceof q.Name && e.assign((0, q._)`${t}.props`, r), n instanceof q.Name && e.assign((0, q._)`${t}.items`, n);
}
function sc(e, t, r, n) {
  const { gen: s, schema: a, data: o, allErrors: l, opts: c, self: d } = e, { RULES: u } = d;
  if (a.$ref && (c.ignoreKeywordsWithRef || !(0, $t.schemaHasRulesButRef)(a, u))) {
    s.block(() => Ru(e, "$ref", u.all.$ref.definition));
    return;
  }
  c.jtd || J_(e, t), s.block(() => {
    for (const b of u.rules)
      h(b);
    h(u.post);
  });
  function h(b) {
    (0, No.shouldUseGroup)(a, b) && (b.type ? (s.if((0, Zn.checkDataType)(b.type, o, c.strictNumbers)), ac(e, b), t.length === 1 && t[0] === b.type && r && (s.else(), (0, Zn.reportTypeError)(e)), s.endIf()) : ac(e, b), l || s.if((0, q._)`${X.default.errors} === ${n || 0}`));
  }
}
function ac(e, t) {
  const { gen: r, schema: n, opts: { useDefaults: s } } = e;
  s && (0, A_.assignDefaults)(e, t.type), r.block(() => {
    for (const a of t.rules)
      (0, No.shouldUseRule)(n, a) && Ru(e, a.keyword, a.definition, t.type);
  });
}
function J_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (B_(e, t), e.opts.allowUnionTypes || Y_(e, t), Q_(e, e.dataTypes));
}
function B_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((r) => {
      Pu(e.dataTypes, r) || Ro(e, `type "${r}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), x_(e, t);
  }
}
function Y_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Ro(e, "use allowUnionTypes to allow union type keyword");
}
function Q_(e, t) {
  const r = e.self.RULES.all;
  for (const n in r) {
    const s = r[n];
    if (typeof s == "object" && (0, No.shouldUseRule)(e.schema, s)) {
      const { type: a } = s.definition;
      a.length && !a.some((o) => Z_(t, o)) && Ro(e, `missing type "${a.join(",")}" for keyword "${n}"`);
    }
  }
}
function Z_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function Pu(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function x_(e, t) {
  const r = [];
  for (const n of e.dataTypes)
    Pu(t, n) ? r.push(n) : t.includes("integer") && n === "number" && r.push("integer");
  e.dataTypes = r;
}
function Ro(e, t) {
  const r = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${r}" (strictTypes)`, (0, $t.checkStrictMode)(e, t, e.opts.strictTypes);
}
class Nu {
  constructor(t, r, n) {
    if ((0, en.validateKeywordUsage)(t, r, n), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = n, this.data = t.data, this.schema = t.schema[n], this.$data = r.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, $t.schemaRefOrVal)(t, this.schema, n, this.$data), this.schemaType = r.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = r, this.$data)
      this.schemaCode = t.gen.const("vSchema", Ou(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, en.validSchemaType)(this.schema, r.schemaType, r.allowUndefined))
      throw new Error(`${n} value must be ${JSON.stringify(r.schemaType)}`);
    ("code" in r ? r.trackErrors : r.errors !== !1) && (this.errsCount = t.gen.const("_errs", X.default.errors));
  }
  result(t, r, n) {
    this.failResult((0, q.not)(t), r, n);
  }
  failResult(t, r, n) {
    this.gen.if(t), n ? n() : this.error(), r ? (this.gen.else(), r(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, r) {
    this.failResult((0, q.not)(t), void 0, r);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: r } = this;
    this.fail((0, q._)`${r} !== undefined && (${(0, q.or)(this.invalid$data(), t)})`);
  }
  error(t, r, n) {
    if (r) {
      this.setParams(r), this._error(t, n), this.setParams({});
      return;
    }
    this._error(t, n);
  }
  _error(t, r) {
    (t ? Kr.reportExtraError : Kr.reportError)(this, this.def.error, r);
  }
  $dataError() {
    (0, Kr.reportError)(this, this.def.$dataError || Kr.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Kr.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, r) {
    r ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, r, n = q.nil) {
    this.gen.block(() => {
      this.check$data(t, n), r();
    });
  }
  check$data(t = q.nil, r = q.nil) {
    if (!this.$data)
      return;
    const { gen: n, schemaCode: s, schemaType: a, def: o } = this;
    n.if((0, q.or)((0, q._)`${s} === undefined`, r)), t !== q.nil && n.assign(t, !0), (a.length || o.validateSchema) && (n.elseIf(this.invalid$data()), this.$dataError(), t !== q.nil && n.assign(t, !1)), n.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: r, schemaType: n, def: s, it: a } = this;
    return (0, q.or)(o(), l());
    function o() {
      if (n.length) {
        if (!(r instanceof q.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(n) ? n : [n];
        return (0, q._)`${(0, Zn.checkDataTypes)(c, r, a.opts.strictNumbers, Zn.DataType.Wrong)}`;
      }
      return q.nil;
    }
    function l() {
      if (s.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: s.validateSchema });
        return (0, q._)`!${c}(${r})`;
      }
      return q.nil;
    }
  }
  subschema(t, r) {
    const n = (0, Ds.getSubschema)(this.it, t);
    (0, Ds.extendSubschemaData)(n, this.it, t), (0, Ds.extendSubschemaMode)(n, t);
    const s = { ...this.it, ...n, items: void 0, props: void 0 };
    return z_(s, r), s;
  }
  mergeEvaluated(t, r) {
    const { it: n, gen: s } = this;
    n.opts.unevaluated && (n.props !== !0 && t.props !== void 0 && (n.props = $t.mergeEvaluated.props(s, t.props, n.props, r)), n.items !== !0 && t.items !== void 0 && (n.items = $t.mergeEvaluated.items(s, t.items, n.items, r)));
  }
  mergeValidEvaluated(t, r) {
    const { it: n, gen: s } = this;
    if (n.opts.unevaluated && (n.props !== !0 || n.items !== !0))
      return s.if(r, () => this.mergeEvaluated(t, q.Name)), !0;
  }
}
xe.KeywordCxt = Nu;
function Ru(e, t, r, n) {
  const s = new Nu(e, r, t);
  "code" in r ? r.code(s, n) : s.$data && r.validate ? (0, en.funcKeywordCode)(s, r) : "macro" in r ? (0, en.macroKeywordCode)(s, r) : (r.compile || r.validate) && (0, en.funcKeywordCode)(s, r);
}
const eg = /^\/(?:[^~]|~0|~1)*$/, tg = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function Ou(e, { dataLevel: t, dataNames: r, dataPathArr: n }) {
  let s, a;
  if (e === "")
    return X.default.rootData;
  if (e[0] === "/") {
    if (!eg.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    s = e, a = X.default.rootData;
  } else {
    const d = tg.exec(e);
    if (!d)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const u = +d[1];
    if (s = d[2], s === "#") {
      if (u >= t)
        throw new Error(c("property/index", u));
      return n[t - u];
    }
    if (u > t)
      throw new Error(c("data", u));
    if (a = r[t - u], !s)
      return a;
  }
  let o = a;
  const l = s.split("/");
  for (const d of l)
    d && (a = (0, q._)`${a}${(0, q.getProperty)((0, $t.unescapeJsonPointer)(d))}`, o = (0, q._)`${o} && ${a}`);
  return o;
  function c(d, u) {
    return `Cannot access ${d} ${u} levels up, current level is ${t}`;
  }
}
xe.getData = Ou;
var fn = {};
Object.defineProperty(fn, "__esModule", { value: !0 });
class rg extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
fn.default = rg;
var Cr = {};
Object.defineProperty(Cr, "__esModule", { value: !0 });
const Ms = be;
class ng extends Error {
  constructor(t, r, n, s) {
    super(s || `can't resolve reference ${n} from id ${r}`), this.missingRef = (0, Ms.resolveUrl)(t, r, n), this.missingSchema = (0, Ms.normalizeId)((0, Ms.getFullPath)(t, this.missingRef));
  }
}
Cr.default = ng;
var Me = {};
Object.defineProperty(Me, "__esModule", { value: !0 });
Me.resolveSchema = Me.getCompilingSchema = Me.resolveRef = Me.compileSchema = Me.SchemaEnv = void 0;
const We = ee, sg = fn, Qt = ut, Qe = be, oc = C, ag = xe;
class ps {
  constructor(t) {
    var r;
    this.refs = {}, this.dynamicAnchors = {};
    let n;
    typeof t.schema == "object" && (n = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (r = t.baseId) !== null && r !== void 0 ? r : (0, Qe.normalizeId)(n == null ? void 0 : n[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = n == null ? void 0 : n.$async, this.refs = {};
  }
}
Me.SchemaEnv = ps;
function Oo(e) {
  const t = Iu.call(this, e);
  if (t)
    return t;
  const r = (0, Qe.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: n, lines: s } = this.opts.code, { ownProperties: a } = this.opts, o = new We.CodeGen(this.scope, { es5: n, lines: s, ownProperties: a });
  let l;
  e.$async && (l = o.scopeValue("Error", {
    ref: sg.default,
    code: (0, We._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = o.scopeName("validate");
  e.validateName = c;
  const d = {
    gen: o,
    allErrors: this.opts.allErrors,
    data: Qt.default.data,
    parentData: Qt.default.parentData,
    parentDataProperty: Qt.default.parentDataProperty,
    dataNames: [Qt.default.data],
    dataPathArr: [We.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, We.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: l,
    schema: e.schema,
    schemaEnv: e,
    rootId: r,
    baseId: e.baseId || r,
    schemaPath: We.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, We._)`""`,
    opts: this.opts,
    self: this
  };
  let u;
  try {
    this._compilations.add(e), (0, ag.validateFunctionCode)(d), o.optimize(this.opts.code.optimize);
    const h = o.toString();
    u = `${o.scopeRefs(Qt.default.scope)}return ${h}`, this.opts.code.process && (u = this.opts.code.process(u, e));
    const g = new Function(`${Qt.default.self}`, `${Qt.default.scope}`, u)(this, this.scope.get());
    if (this.scope.value(c, { ref: g }), g.errors = null, g.schema = e.schema, g.schemaEnv = e, e.$async && (g.$async = !0), this.opts.code.source === !0 && (g.source = { validateName: c, validateCode: h, scopeValues: o._values }), this.opts.unevaluated) {
      const { props: w, items: _ } = d;
      g.evaluated = {
        props: w instanceof We.Name ? void 0 : w,
        items: _ instanceof We.Name ? void 0 : _,
        dynamicProps: w instanceof We.Name,
        dynamicItems: _ instanceof We.Name
      }, g.source && (g.source.evaluated = (0, We.stringify)(g.evaluated));
    }
    return e.validate = g, e;
  } catch (h) {
    throw delete e.validate, delete e.validateName, u && this.logger.error("Error compiling schema, function code:", u), h;
  } finally {
    this._compilations.delete(e);
  }
}
Me.compileSchema = Oo;
function og(e, t, r) {
  var n;
  r = (0, Qe.resolveUrl)(this.opts.uriResolver, t, r);
  const s = e.refs[r];
  if (s)
    return s;
  let a = lg.call(this, e, r);
  if (a === void 0) {
    const o = (n = e.localRefs) === null || n === void 0 ? void 0 : n[r], { schemaId: l } = this.opts;
    o && (a = new ps({ schema: o, schemaId: l, root: e, baseId: t }));
  }
  if (a !== void 0)
    return e.refs[r] = ig.call(this, a);
}
Me.resolveRef = og;
function ig(e) {
  return (0, Qe.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Oo.call(this, e);
}
function Iu(e) {
  for (const t of this._compilations)
    if (cg(t, e))
      return t;
}
Me.getCompilingSchema = Iu;
function cg(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function lg(e, t) {
  let r;
  for (; typeof (r = this.refs[t]) == "string"; )
    t = r;
  return r || this.schemas[t] || $s.call(this, e, t);
}
function $s(e, t) {
  const r = this.opts.uriResolver.parse(t), n = (0, Qe._getFullPath)(this.opts.uriResolver, r);
  let s = (0, Qe.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && n === s)
    return Ls.call(this, r, e);
  const a = (0, Qe.normalizeId)(n), o = this.refs[a] || this.schemas[a];
  if (typeof o == "string") {
    const l = $s.call(this, e, o);
    return typeof (l == null ? void 0 : l.schema) != "object" ? void 0 : Ls.call(this, r, l);
  }
  if (typeof (o == null ? void 0 : o.schema) == "object") {
    if (o.validate || Oo.call(this, o), a === (0, Qe.normalizeId)(t)) {
      const { schema: l } = o, { schemaId: c } = this.opts, d = l[c];
      return d && (s = (0, Qe.resolveUrl)(this.opts.uriResolver, s, d)), new ps({ schema: l, schemaId: c, root: e, baseId: s });
    }
    return Ls.call(this, r, o);
  }
}
Me.resolveSchema = $s;
const ug = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function Ls(e, { baseId: t, schema: r, root: n }) {
  var s;
  if (((s = e.fragment) === null || s === void 0 ? void 0 : s[0]) !== "/")
    return;
  for (const l of e.fragment.slice(1).split("/")) {
    if (typeof r == "boolean")
      return;
    const c = r[(0, oc.unescapeFragment)(l)];
    if (c === void 0)
      return;
    r = c;
    const d = typeof r == "object" && r[this.opts.schemaId];
    !ug.has(l) && d && (t = (0, Qe.resolveUrl)(this.opts.uriResolver, t, d));
  }
  let a;
  if (typeof r != "boolean" && r.$ref && !(0, oc.schemaHasRulesButRef)(r, this.RULES)) {
    const l = (0, Qe.resolveUrl)(this.opts.uriResolver, t, r.$ref);
    a = $s.call(this, n, l);
  }
  const { schemaId: o } = this.opts;
  if (a = a || new ps({ schema: r, schemaId: o, root: n, baseId: t }), a.schema !== a.root.schema)
    return a;
}
const dg = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", fg = "Meta-schema for $data reference (JSON AnySchema extension proposal)", hg = "object", mg = [
  "$data"
], pg = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, $g = !1, yg = {
  $id: dg,
  description: fg,
  type: hg,
  required: mg,
  properties: pg,
  additionalProperties: $g
};
var Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const Tu = Fl;
Tu.code = 'require("ajv/dist/runtime/uri").default';
Io.default = Tu;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = xe;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var r = ee;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return r.CodeGen;
  } });
  const n = fn, s = Cr, a = lr, o = Me, l = ee, c = be, d = _e, u = C, h = yg, b = Io, g = (P, p) => new RegExp(P, p);
  g.code = "new RegExp";
  const w = ["removeAdditional", "useDefaults", "coerceTypes"], _ = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), y = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, m = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, v = 200;
  function N(P) {
    var p, S, $, i, f, E, I, j, F, V, ne, Le, Dt, Mt, Lt, Vt, Ft, zt, Ut, qt, Kt, Gt, Ht, Wt, Xt;
    const Ge = P.strict, Jt = (p = P.code) === null || p === void 0 ? void 0 : p.optimize, Vr = Jt === !0 || Jt === void 0 ? 1 : Jt || 0, Fr = ($ = (S = P.code) === null || S === void 0 ? void 0 : S.regExp) !== null && $ !== void 0 ? $ : g, Ss = (i = P.uriResolver) !== null && i !== void 0 ? i : b.default;
    return {
      strictSchema: (E = (f = P.strictSchema) !== null && f !== void 0 ? f : Ge) !== null && E !== void 0 ? E : !0,
      strictNumbers: (j = (I = P.strictNumbers) !== null && I !== void 0 ? I : Ge) !== null && j !== void 0 ? j : !0,
      strictTypes: (V = (F = P.strictTypes) !== null && F !== void 0 ? F : Ge) !== null && V !== void 0 ? V : "log",
      strictTuples: (Le = (ne = P.strictTuples) !== null && ne !== void 0 ? ne : Ge) !== null && Le !== void 0 ? Le : "log",
      strictRequired: (Mt = (Dt = P.strictRequired) !== null && Dt !== void 0 ? Dt : Ge) !== null && Mt !== void 0 ? Mt : !1,
      code: P.code ? { ...P.code, optimize: Vr, regExp: Fr } : { optimize: Vr, regExp: Fr },
      loopRequired: (Lt = P.loopRequired) !== null && Lt !== void 0 ? Lt : v,
      loopEnum: (Vt = P.loopEnum) !== null && Vt !== void 0 ? Vt : v,
      meta: (Ft = P.meta) !== null && Ft !== void 0 ? Ft : !0,
      messages: (zt = P.messages) !== null && zt !== void 0 ? zt : !0,
      inlineRefs: (Ut = P.inlineRefs) !== null && Ut !== void 0 ? Ut : !0,
      schemaId: (qt = P.schemaId) !== null && qt !== void 0 ? qt : "$id",
      addUsedSchema: (Kt = P.addUsedSchema) !== null && Kt !== void 0 ? Kt : !0,
      validateSchema: (Gt = P.validateSchema) !== null && Gt !== void 0 ? Gt : !0,
      validateFormats: (Ht = P.validateFormats) !== null && Ht !== void 0 ? Ht : !0,
      unicodeRegExp: (Wt = P.unicodeRegExp) !== null && Wt !== void 0 ? Wt : !0,
      int32range: (Xt = P.int32range) !== null && Xt !== void 0 ? Xt : !0,
      uriResolver: Ss
    };
  }
  class R {
    constructor(p = {}) {
      this.schemas = {}, this.refs = {}, this.formats = {}, this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), p = this.opts = { ...p, ...N(p) };
      const { es5: S, lines: $ } = this.opts.code;
      this.scope = new l.ValueScope({ scope: {}, prefixes: _, es5: S, lines: $ }), this.logger = H(p.logger);
      const i = p.validateFormats;
      p.validateFormats = !1, this.RULES = (0, a.getRules)(), O.call(this, y, p, "NOT SUPPORTED"), O.call(this, m, p, "DEPRECATED", "warn"), this._metaOpts = $e.call(this), p.formats && ue.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), p.keywords && fe.call(this, p.keywords), typeof p.meta == "object" && this.addMetaSchema(p.meta), J.call(this), p.validateFormats = i;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: p, meta: S, schemaId: $ } = this.opts;
      let i = h;
      $ === "id" && (i = { ...h }, i.id = i.$id, delete i.$id), S && p && this.addMetaSchema(i, i[$], !1);
    }
    defaultMeta() {
      const { meta: p, schemaId: S } = this.opts;
      return this.opts.defaultMeta = typeof p == "object" ? p[S] || p : void 0;
    }
    validate(p, S) {
      let $;
      if (typeof p == "string") {
        if ($ = this.getSchema(p), !$)
          throw new Error(`no schema with key or ref "${p}"`);
      } else
        $ = this.compile(p);
      const i = $(S);
      return "$async" in $ || (this.errors = $.errors), i;
    }
    compile(p, S) {
      const $ = this._addSchema(p, S);
      return $.validate || this._compileSchemaEnv($);
    }
    compileAsync(p, S) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: $ } = this.opts;
      return i.call(this, p, S);
      async function i(V, ne) {
        await f.call(this, V.$schema);
        const Le = this._addSchema(V, ne);
        return Le.validate || E.call(this, Le);
      }
      async function f(V) {
        V && !this.getSchema(V) && await i.call(this, { $ref: V }, !0);
      }
      async function E(V) {
        try {
          return this._compileSchemaEnv(V);
        } catch (ne) {
          if (!(ne instanceof s.default))
            throw ne;
          return I.call(this, ne), await j.call(this, ne.missingSchema), E.call(this, V);
        }
      }
      function I({ missingSchema: V, missingRef: ne }) {
        if (this.refs[V])
          throw new Error(`AnySchema ${V} is loaded but ${ne} cannot be resolved`);
      }
      async function j(V) {
        const ne = await F.call(this, V);
        this.refs[V] || await f.call(this, ne.$schema), this.refs[V] || this.addSchema(ne, V, S);
      }
      async function F(V) {
        const ne = this._loading[V];
        if (ne)
          return ne;
        try {
          return await (this._loading[V] = $(V));
        } finally {
          delete this._loading[V];
        }
      }
    }
    // Adds schema to the instance
    addSchema(p, S, $, i = this.opts.validateSchema) {
      if (Array.isArray(p)) {
        for (const E of p)
          this.addSchema(E, void 0, $, i);
        return this;
      }
      let f;
      if (typeof p == "object") {
        const { schemaId: E } = this.opts;
        if (f = p[E], f !== void 0 && typeof f != "string")
          throw new Error(`schema ${E} must be string`);
      }
      return S = (0, c.normalizeId)(S || f), this._checkUnique(S), this.schemas[S] = this._addSchema(p, $, S, i, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(p, S, $ = this.opts.validateSchema) {
      return this.addSchema(p, S, !0, $), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(p, S) {
      if (typeof p == "boolean")
        return !0;
      let $;
      if ($ = p.$schema, $ !== void 0 && typeof $ != "string")
        throw new Error("$schema must be a string");
      if ($ = $ || this.opts.defaultMeta || this.defaultMeta(), !$)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const i = this.validate($, p);
      if (!i && S) {
        const f = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(f);
        else
          throw new Error(f);
      }
      return i;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(p) {
      let S;
      for (; typeof (S = K.call(this, p)) == "string"; )
        p = S;
      if (S === void 0) {
        const { schemaId: $ } = this.opts, i = new o.SchemaEnv({ schema: {}, schemaId: $ });
        if (S = o.resolveSchema.call(this, i, p), !S)
          return;
        this.refs[p] = S;
      }
      return S.validate || this._compileSchemaEnv(S);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(p) {
      if (p instanceof RegExp)
        return this._removeAllSchemas(this.schemas, p), this._removeAllSchemas(this.refs, p), this;
      switch (typeof p) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const S = K.call(this, p);
          return typeof S == "object" && this._cache.delete(S.schema), delete this.schemas[p], delete this.refs[p], this;
        }
        case "object": {
          const S = p;
          this._cache.delete(S);
          let $ = p[this.opts.schemaId];
          return $ && ($ = (0, c.normalizeId)($), delete this.schemas[$], delete this.refs[$]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(p) {
      for (const S of p)
        this.addKeyword(S);
      return this;
    }
    addKeyword(p, S) {
      let $;
      if (typeof p == "string")
        $ = p, typeof S == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), S.keyword = $);
      else if (typeof p == "object" && S === void 0) {
        if (S = p, $ = S.keyword, Array.isArray($) && !$.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (T.call(this, $, S), !S)
        return (0, u.eachItem)($, (f) => k.call(this, f)), this;
      D.call(this, S);
      const i = {
        ...S,
        type: (0, d.getJSONTypes)(S.type),
        schemaType: (0, d.getJSONTypes)(S.schemaType)
      };
      return (0, u.eachItem)($, i.type.length === 0 ? (f) => k.call(this, f, i) : (f) => i.type.forEach((E) => k.call(this, f, i, E))), this;
    }
    getKeyword(p) {
      const S = this.RULES.all[p];
      return typeof S == "object" ? S.definition : !!S;
    }
    // Remove keyword
    removeKeyword(p) {
      const { RULES: S } = this;
      delete S.keywords[p], delete S.all[p];
      for (const $ of S.rules) {
        const i = $.rules.findIndex((f) => f.keyword === p);
        i >= 0 && $.rules.splice(i, 1);
      }
      return this;
    }
    // Add format
    addFormat(p, S) {
      return typeof S == "string" && (S = new RegExp(S)), this.formats[p] = S, this;
    }
    errorsText(p = this.errors, { separator: S = ", ", dataVar: $ = "data" } = {}) {
      return !p || p.length === 0 ? "No errors" : p.map((i) => `${$}${i.instancePath} ${i.message}`).reduce((i, f) => i + S + f);
    }
    $dataMetaSchema(p, S) {
      const $ = this.RULES.all;
      p = JSON.parse(JSON.stringify(p));
      for (const i of S) {
        const f = i.split("/").slice(1);
        let E = p;
        for (const I of f)
          E = E[I];
        for (const I in $) {
          const j = $[I];
          if (typeof j != "object")
            continue;
          const { $data: F } = j.definition, V = E[I];
          F && V && (E[I] = M(V));
        }
      }
      return p;
    }
    _removeAllSchemas(p, S) {
      for (const $ in p) {
        const i = p[$];
        (!S || S.test($)) && (typeof i == "string" ? delete p[$] : i && !i.meta && (this._cache.delete(i.schema), delete p[$]));
      }
    }
    _addSchema(p, S, $, i = this.opts.validateSchema, f = this.opts.addUsedSchema) {
      let E;
      const { schemaId: I } = this.opts;
      if (typeof p == "object")
        E = p[I];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof p != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let j = this._cache.get(p);
      if (j !== void 0)
        return j;
      $ = (0, c.normalizeId)(E || $);
      const F = c.getSchemaRefs.call(this, p, $);
      return j = new o.SchemaEnv({ schema: p, schemaId: I, meta: S, baseId: $, localRefs: F }), this._cache.set(j.schema, j), f && !$.startsWith("#") && ($ && this._checkUnique($), this.refs[$] = j), i && this.validateSchema(p, !0), j;
    }
    _checkUnique(p) {
      if (this.schemas[p] || this.refs[p])
        throw new Error(`schema with key or id "${p}" already exists`);
    }
    _compileSchemaEnv(p) {
      if (p.meta ? this._compileMetaSchema(p) : o.compileSchema.call(this, p), !p.validate)
        throw new Error("ajv implementation error");
      return p.validate;
    }
    _compileMetaSchema(p) {
      const S = this.opts;
      this.opts = this._metaOpts;
      try {
        o.compileSchema.call(this, p);
      } finally {
        this.opts = S;
      }
    }
  }
  R.ValidationError = n.default, R.MissingRefError = s.default, e.default = R;
  function O(P, p, S, $ = "error") {
    for (const i in P) {
      const f = i;
      f in p && this.logger[$](`${S}: option ${i}. ${P[f]}`);
    }
  }
  function K(P) {
    return P = (0, c.normalizeId)(P), this.schemas[P] || this.refs[P];
  }
  function J() {
    const P = this.opts.schemas;
    if (P)
      if (Array.isArray(P))
        this.addSchema(P);
      else
        for (const p in P)
          this.addSchema(P[p], p);
  }
  function ue() {
    for (const P in this.opts.formats) {
      const p = this.opts.formats[P];
      p && this.addFormat(P, p);
    }
  }
  function fe(P) {
    if (Array.isArray(P)) {
      this.addVocabulary(P);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const p in P) {
      const S = P[p];
      S.keyword || (S.keyword = p), this.addKeyword(S);
    }
  }
  function $e() {
    const P = { ...this.opts };
    for (const p of w)
      delete P[p];
    return P;
  }
  const z = { log() {
  }, warn() {
  }, error() {
  } };
  function H(P) {
    if (P === !1)
      return z;
    if (P === void 0)
      return console;
    if (P.log && P.warn && P.error)
      return P;
    throw new Error("logger must implement log, warn and error methods");
  }
  const se = /^[a-z_$][a-z0-9_$:-]*$/i;
  function T(P, p) {
    const { RULES: S } = this;
    if ((0, u.eachItem)(P, ($) => {
      if (S.keywords[$])
        throw new Error(`Keyword ${$} is already defined`);
      if (!se.test($))
        throw new Error(`Keyword ${$} has invalid name`);
    }), !!p && p.$data && !("code" in p || "validate" in p))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function k(P, p, S) {
    var $;
    const i = p == null ? void 0 : p.post;
    if (S && i)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: f } = this;
    let E = i ? f.post : f.rules.find(({ type: j }) => j === S);
    if (E || (E = { type: S, rules: [] }, f.rules.push(E)), f.keywords[P] = !0, !p)
      return;
    const I = {
      keyword: P,
      definition: {
        ...p,
        type: (0, d.getJSONTypes)(p.type),
        schemaType: (0, d.getJSONTypes)(p.schemaType)
      }
    };
    p.before ? L.call(this, E, I, p.before) : E.rules.push(I), f.all[P] = I, ($ = p.implements) === null || $ === void 0 || $.forEach((j) => this.addKeyword(j));
  }
  function L(P, p, S) {
    const $ = P.rules.findIndex((i) => i.keyword === S);
    $ >= 0 ? P.rules.splice($, 0, p) : (P.rules.push(p), this.logger.warn(`rule ${S} is not defined`));
  }
  function D(P) {
    let { metaSchema: p } = P;
    p !== void 0 && (P.$data && this.opts.$data && (p = M(p)), P.validateSchema = this.compile(p, !0));
  }
  const G = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function M(P) {
    return { anyOf: [P, G] };
  }
})(Zl);
var To = {}, jo = {}, ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
const _g = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ko.default = _g;
var ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.callRef = ur.getValidate = void 0;
const gg = Cr, ic = re, De = ee, pr = ut, cc = Me, En = C, vg = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: r, it: n } = e, { baseId: s, schemaEnv: a, validateName: o, opts: l, self: c } = n, { root: d } = a;
    if ((r === "#" || r === "#/") && s === d.baseId)
      return h();
    const u = cc.resolveRef.call(c, d, s, r);
    if (u === void 0)
      throw new gg.default(n.opts.uriResolver, s, r);
    if (u instanceof cc.SchemaEnv)
      return b(u);
    return g(u);
    function h() {
      if (a === d)
        return qn(e, o, a, a.$async);
      const w = t.scopeValue("root", { ref: d });
      return qn(e, (0, De._)`${w}.validate`, d, d.$async);
    }
    function b(w) {
      const _ = ju(e, w);
      qn(e, _, w, w.$async);
    }
    function g(w) {
      const _ = t.scopeValue("schema", l.code.source === !0 ? { ref: w, code: (0, De.stringify)(w) } : { ref: w }), y = t.name("valid"), m = e.subschema({
        schema: w,
        dataTypes: [],
        schemaPath: De.nil,
        topSchemaRef: _,
        errSchemaPath: r
      }, y);
      e.mergeEvaluated(m), e.ok(y);
    }
  }
};
function ju(e, t) {
  const { gen: r } = e;
  return t.validate ? r.scopeValue("validate", { ref: t.validate }) : (0, De._)`${r.scopeValue("wrapper", { ref: t })}.validate`;
}
ur.getValidate = ju;
function qn(e, t, r, n) {
  const { gen: s, it: a } = e, { allErrors: o, schemaEnv: l, opts: c } = a, d = c.passContext ? pr.default.this : De.nil;
  n ? u() : h();
  function u() {
    if (!l.$async)
      throw new Error("async schema referenced by sync schema");
    const w = s.let("valid");
    s.try(() => {
      s.code((0, De._)`await ${(0, ic.callValidateCode)(e, t, d)}`), g(t), o || s.assign(w, !0);
    }, (_) => {
      s.if((0, De._)`!(${_} instanceof ${a.ValidationError})`, () => s.throw(_)), b(_), o || s.assign(w, !1);
    }), e.ok(w);
  }
  function h() {
    e.result((0, ic.callValidateCode)(e, t, d), () => g(t), () => b(t));
  }
  function b(w) {
    const _ = (0, De._)`${w}.errors`;
    s.assign(pr.default.vErrors, (0, De._)`${pr.default.vErrors} === null ? ${_} : ${pr.default.vErrors}.concat(${_})`), s.assign(pr.default.errors, (0, De._)`${pr.default.vErrors}.length`);
  }
  function g(w) {
    var _;
    if (!a.opts.unevaluated)
      return;
    const y = (_ = r == null ? void 0 : r.validate) === null || _ === void 0 ? void 0 : _.evaluated;
    if (a.props !== !0)
      if (y && !y.dynamicProps)
        y.props !== void 0 && (a.props = En.mergeEvaluated.props(s, y.props, a.props));
      else {
        const m = s.var("props", (0, De._)`${w}.evaluated.props`);
        a.props = En.mergeEvaluated.props(s, m, a.props, De.Name);
      }
    if (a.items !== !0)
      if (y && !y.dynamicItems)
        y.items !== void 0 && (a.items = En.mergeEvaluated.items(s, y.items, a.items));
      else {
        const m = s.var("items", (0, De._)`${w}.evaluated.items`);
        a.items = En.mergeEvaluated.items(s, m, a.items, De.Name);
      }
  }
}
ur.callRef = qn;
ur.default = vg;
Object.defineProperty(jo, "__esModule", { value: !0 });
const wg = ko, Eg = ur, bg = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  wg.default,
  Eg.default
];
jo.default = bg;
var Ao = {}, Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
const xn = ee, Pt = xn.operators, es = {
  maximum: { okStr: "<=", ok: Pt.LTE, fail: Pt.GT },
  minimum: { okStr: ">=", ok: Pt.GTE, fail: Pt.LT },
  exclusiveMaximum: { okStr: "<", ok: Pt.LT, fail: Pt.GTE },
  exclusiveMinimum: { okStr: ">", ok: Pt.GT, fail: Pt.LTE }
}, Sg = {
  message: ({ keyword: e, schemaCode: t }) => (0, xn.str)`must be ${es[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, xn._)`{comparison: ${es[e].okStr}, limit: ${t}}`
}, Pg = {
  keyword: Object.keys(es),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Sg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e;
    e.fail$data((0, xn._)`${r} ${es[t].fail} ${n} || isNaN(${r})`);
  }
};
Co.default = Pg;
var Do = {};
Object.defineProperty(Do, "__esModule", { value: !0 });
const tn = ee, Ng = {
  message: ({ schemaCode: e }) => (0, tn.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, tn._)`{multipleOf: ${e}}`
}, Rg = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: Ng,
  code(e) {
    const { gen: t, data: r, schemaCode: n, it: s } = e, a = s.opts.multipleOfPrecision, o = t.let("res"), l = a ? (0, tn._)`Math.abs(Math.round(${o}) - ${o}) > 1e-${a}` : (0, tn._)`${o} !== parseInt(${o})`;
    e.fail$data((0, tn._)`(${n} === 0 || (${o} = ${r}/${n}, ${l}))`);
  }
};
Do.default = Rg;
var Mo = {}, Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
function ku(e) {
  const t = e.length;
  let r = 0, n = 0, s;
  for (; n < t; )
    r++, s = e.charCodeAt(n++), s >= 55296 && s <= 56319 && n < t && (s = e.charCodeAt(n), (s & 64512) === 56320 && n++);
  return r;
}
Lo.default = ku;
ku.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Mo, "__esModule", { value: !0 });
const nr = ee, Og = C, Ig = Lo, Tg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxLength" ? "more" : "fewer";
    return (0, nr.str)`must NOT have ${r} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, nr._)`{limit: ${e}}`
}, jg = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: Tg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n, it: s } = e, a = t === "maxLength" ? nr.operators.GT : nr.operators.LT, o = s.opts.unicode === !1 ? (0, nr._)`${r}.length` : (0, nr._)`${(0, Og.useFunc)(e.gen, Ig.default)}(${r})`;
    e.fail$data((0, nr._)`${o} ${a} ${n}`);
  }
};
Mo.default = jg;
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
const kg = re, ts = ee, Ag = {
  message: ({ schemaCode: e }) => (0, ts.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, ts._)`{pattern: ${e}}`
}, Cg = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: Ag,
  code(e) {
    const { data: t, $data: r, schema: n, schemaCode: s, it: a } = e, o = a.opts.unicodeRegExp ? "u" : "", l = r ? (0, ts._)`(new RegExp(${s}, ${o}))` : (0, kg.usePattern)(e, n);
    e.fail$data((0, ts._)`!${l}.test(${t})`);
  }
};
Vo.default = Cg;
var Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const rn = ee, Dg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxProperties" ? "more" : "fewer";
    return (0, rn.str)`must NOT have ${r} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, rn._)`{limit: ${e}}`
}, Mg = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: Dg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxProperties" ? rn.operators.GT : rn.operators.LT;
    e.fail$data((0, rn._)`Object.keys(${r}).length ${s} ${n}`);
  }
};
Fo.default = Mg;
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
const Gr = re, nn = ee, Lg = C, Vg = {
  message: ({ params: { missingProperty: e } }) => (0, nn.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, nn._)`{missingProperty: ${e}}`
}, Fg = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Vg,
  code(e) {
    const { gen: t, schema: r, schemaCode: n, data: s, $data: a, it: o } = e, { opts: l } = o;
    if (!a && r.length === 0)
      return;
    const c = r.length >= l.loopRequired;
    if (o.allErrors ? d() : u(), l.strictRequired) {
      const g = e.parentSchema.properties, { definedProperties: w } = e.it;
      for (const _ of r)
        if ((g == null ? void 0 : g[_]) === void 0 && !w.has(_)) {
          const y = o.schemaEnv.baseId + o.errSchemaPath, m = `required property "${_}" is not defined at "${y}" (strictRequired)`;
          (0, Lg.checkStrictMode)(o, m, o.opts.strictRequired);
        }
    }
    function d() {
      if (c || a)
        e.block$data(nn.nil, h);
      else
        for (const g of r)
          (0, Gr.checkReportMissingProp)(e, g);
    }
    function u() {
      const g = t.let("missing");
      if (c || a) {
        const w = t.let("valid", !0);
        e.block$data(w, () => b(g, w)), e.ok(w);
      } else
        t.if((0, Gr.checkMissingProp)(e, r, g)), (0, Gr.reportMissingProp)(e, g), t.else();
    }
    function h() {
      t.forOf("prop", n, (g) => {
        e.setParams({ missingProperty: g }), t.if((0, Gr.noPropertyInData)(t, s, g, l.ownProperties), () => e.error());
      });
    }
    function b(g, w) {
      e.setParams({ missingProperty: g }), t.forOf(g, n, () => {
        t.assign(w, (0, Gr.propertyInData)(t, s, g, l.ownProperties)), t.if((0, nn.not)(w), () => {
          e.error(), t.break();
        });
      }, nn.nil);
    }
  }
};
zo.default = Fg;
var Uo = {};
Object.defineProperty(Uo, "__esModule", { value: !0 });
const sn = ee, zg = {
  message({ keyword: e, schemaCode: t }) {
    const r = e === "maxItems" ? "more" : "fewer";
    return (0, sn.str)`must NOT have ${r} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, sn._)`{limit: ${e}}`
}, Ug = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: zg,
  code(e) {
    const { keyword: t, data: r, schemaCode: n } = e, s = t === "maxItems" ? sn.operators.GT : sn.operators.LT;
    e.fail$data((0, sn._)`${r}.length ${s} ${n}`);
  }
};
Uo.default = Ug;
var qo = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
const Au = is;
Au.code = 'require("ajv/dist/runtime/equal").default';
hn.default = Au;
Object.defineProperty(qo, "__esModule", { value: !0 });
const Vs = _e, we = ee, qg = C, Kg = hn, Gg = {
  message: ({ params: { i: e, j: t } }) => (0, we.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, we._)`{i: ${e}, j: ${t}}`
}, Hg = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Gg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, parentSchema: a, schemaCode: o, it: l } = e;
    if (!n && !s)
      return;
    const c = t.let("valid"), d = a.items ? (0, Vs.getSchemaTypes)(a.items) : [];
    e.block$data(c, u, (0, we._)`${o} === false`), e.ok(c);
    function u() {
      const w = t.let("i", (0, we._)`${r}.length`), _ = t.let("j");
      e.setParams({ i: w, j: _ }), t.assign(c, !0), t.if((0, we._)`${w} > 1`, () => (h() ? b : g)(w, _));
    }
    function h() {
      return d.length > 0 && !d.some((w) => w === "object" || w === "array");
    }
    function b(w, _) {
      const y = t.name("item"), m = (0, Vs.checkDataTypes)(d, y, l.opts.strictNumbers, Vs.DataType.Wrong), v = t.const("indices", (0, we._)`{}`);
      t.for((0, we._)`;${w}--;`, () => {
        t.let(y, (0, we._)`${r}[${w}]`), t.if(m, (0, we._)`continue`), d.length > 1 && t.if((0, we._)`typeof ${y} == "string"`, (0, we._)`${y} += "_"`), t.if((0, we._)`typeof ${v}[${y}] == "number"`, () => {
          t.assign(_, (0, we._)`${v}[${y}]`), e.error(), t.assign(c, !1).break();
        }).code((0, we._)`${v}[${y}] = ${w}`);
      });
    }
    function g(w, _) {
      const y = (0, qg.useFunc)(t, Kg.default), m = t.name("outer");
      t.label(m).for((0, we._)`;${w}--;`, () => t.for((0, we._)`${_} = ${w}; ${_}--;`, () => t.if((0, we._)`${y}(${r}[${w}], ${r}[${_}])`, () => {
        e.error(), t.assign(c, !1).break(m);
      })));
    }
  }
};
qo.default = Hg;
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
const ua = ee, Wg = C, Xg = hn, Jg = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, ua._)`{allowedValue: ${e}}`
}, Bg = {
  keyword: "const",
  $data: !0,
  error: Jg,
  code(e) {
    const { gen: t, data: r, $data: n, schemaCode: s, schema: a } = e;
    n || a && typeof a == "object" ? e.fail$data((0, ua._)`!${(0, Wg.useFunc)(t, Xg.default)}(${r}, ${s})`) : e.fail((0, ua._)`${a} !== ${r}`);
  }
};
Ko.default = Bg;
var Go = {};
Object.defineProperty(Go, "__esModule", { value: !0 });
const Jr = ee, Yg = C, Qg = hn, Zg = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Jr._)`{allowedValues: ${e}}`
}, xg = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Zg,
  code(e) {
    const { gen: t, data: r, $data: n, schema: s, schemaCode: a, it: o } = e;
    if (!n && s.length === 0)
      throw new Error("enum must have non-empty array");
    const l = s.length >= o.opts.loopEnum;
    let c;
    const d = () => c ?? (c = (0, Yg.useFunc)(t, Qg.default));
    let u;
    if (l || n)
      u = t.let("valid"), e.block$data(u, h);
    else {
      if (!Array.isArray(s))
        throw new Error("ajv implementation error");
      const g = t.const("vSchema", a);
      u = (0, Jr.or)(...s.map((w, _) => b(g, _)));
    }
    e.pass(u);
    function h() {
      t.assign(u, !1), t.forOf("v", a, (g) => t.if((0, Jr._)`${d()}(${r}, ${g})`, () => t.assign(u, !0).break()));
    }
    function b(g, w) {
      const _ = s[w];
      return typeof _ == "object" && _ !== null ? (0, Jr._)`${d()}(${r}, ${g}[${w}])` : (0, Jr._)`${r} === ${_}`;
    }
  }
};
Go.default = xg;
Object.defineProperty(Ao, "__esModule", { value: !0 });
const ev = Co, tv = Do, rv = Mo, nv = Vo, sv = Fo, av = zo, ov = Uo, iv = qo, cv = Ko, lv = Go, uv = [
  // number
  ev.default,
  tv.default,
  // string
  rv.default,
  nv.default,
  // object
  sv.default,
  av.default,
  // array
  ov.default,
  iv.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  cv.default,
  lv.default
];
Ao.default = uv;
var Ho = {}, Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.validateAdditionalItems = void 0;
const sr = ee, da = C, dv = {
  message: ({ params: { len: e } }) => (0, sr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, sr._)`{limit: ${e}}`
}, fv = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: dv,
  code(e) {
    const { parentSchema: t, it: r } = e, { items: n } = t;
    if (!Array.isArray(n)) {
      (0, da.checkStrictMode)(r, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Cu(e, n);
  }
};
function Cu(e, t) {
  const { gen: r, schema: n, data: s, keyword: a, it: o } = e;
  o.items = !0;
  const l = r.const("len", (0, sr._)`${s}.length`);
  if (n === !1)
    e.setParams({ len: t.length }), e.pass((0, sr._)`${l} <= ${t.length}`);
  else if (typeof n == "object" && !(0, da.alwaysValidSchema)(o, n)) {
    const d = r.var("valid", (0, sr._)`${l} <= ${t.length}`);
    r.if((0, sr.not)(d), () => c(d)), e.ok(d);
  }
  function c(d) {
    r.forRange("i", t.length, l, (u) => {
      e.subschema({ keyword: a, dataProp: u, dataPropType: da.Type.Num }, d), o.allErrors || r.if((0, sr.not)(d), () => r.break());
    });
  }
}
Dr.validateAdditionalItems = Cu;
Dr.default = fv;
var Wo = {}, Mr = {};
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.validateTuple = void 0;
const lc = ee, Kn = C, hv = re, mv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: r } = e;
    if (Array.isArray(t))
      return Du(e, "additionalItems", t);
    r.items = !0, !(0, Kn.alwaysValidSchema)(r, t) && e.ok((0, hv.validateArray)(e));
  }
};
function Du(e, t, r = e.schema) {
  const { gen: n, parentSchema: s, data: a, keyword: o, it: l } = e;
  u(s), l.opts.unevaluated && r.length && l.items !== !0 && (l.items = Kn.mergeEvaluated.items(n, r.length, l.items));
  const c = n.name("valid"), d = n.const("len", (0, lc._)`${a}.length`);
  r.forEach((h, b) => {
    (0, Kn.alwaysValidSchema)(l, h) || (n.if((0, lc._)`${d} > ${b}`, () => e.subschema({
      keyword: o,
      schemaProp: b,
      dataProp: b
    }, c)), e.ok(c));
  });
  function u(h) {
    const { opts: b, errSchemaPath: g } = l, w = r.length, _ = w === h.minItems && (w === h.maxItems || h[t] === !1);
    if (b.strictTuples && !_) {
      const y = `"${o}" is ${w}-tuple, but minItems or maxItems/${t} are not specified or different at path "${g}"`;
      (0, Kn.checkStrictMode)(l, y, b.strictTuples);
    }
  }
}
Mr.validateTuple = Du;
Mr.default = mv;
Object.defineProperty(Wo, "__esModule", { value: !0 });
const pv = Mr, $v = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, pv.validateTuple)(e, "items")
};
Wo.default = $v;
var Xo = {};
Object.defineProperty(Xo, "__esModule", { value: !0 });
const uc = ee, yv = C, _v = re, gv = Dr, vv = {
  message: ({ params: { len: e } }) => (0, uc.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, uc._)`{limit: ${e}}`
}, wv = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: vv,
  code(e) {
    const { schema: t, parentSchema: r, it: n } = e, { prefixItems: s } = r;
    n.items = !0, !(0, yv.alwaysValidSchema)(n, t) && (s ? (0, gv.validateAdditionalItems)(e, s) : e.ok((0, _v.validateArray)(e)));
  }
};
Xo.default = wv;
var Jo = {};
Object.defineProperty(Jo, "__esModule", { value: !0 });
const Ke = ee, bn = C, Ev = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ke.str)`must contain at least ${e} valid item(s)` : (0, Ke.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Ke._)`{minContains: ${e}}` : (0, Ke._)`{minContains: ${e}, maxContains: ${t}}`
}, bv = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: Ev,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    let o, l;
    const { minContains: c, maxContains: d } = n;
    a.opts.next ? (o = c === void 0 ? 1 : c, l = d) : o = 1;
    const u = t.const("len", (0, Ke._)`${s}.length`);
    if (e.setParams({ min: o, max: l }), l === void 0 && o === 0) {
      (0, bn.checkStrictMode)(a, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (l !== void 0 && o > l) {
      (0, bn.checkStrictMode)(a, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, bn.alwaysValidSchema)(a, r)) {
      let _ = (0, Ke._)`${u} >= ${o}`;
      l !== void 0 && (_ = (0, Ke._)`${_} && ${u} <= ${l}`), e.pass(_);
      return;
    }
    a.items = !0;
    const h = t.name("valid");
    l === void 0 && o === 1 ? g(h, () => t.if(h, () => t.break())) : o === 0 ? (t.let(h, !0), l !== void 0 && t.if((0, Ke._)`${s}.length > 0`, b)) : (t.let(h, !1), b()), e.result(h, () => e.reset());
    function b() {
      const _ = t.name("_valid"), y = t.let("count", 0);
      g(_, () => t.if(_, () => w(y)));
    }
    function g(_, y) {
      t.forRange("i", 0, u, (m) => {
        e.subschema({
          keyword: "contains",
          dataProp: m,
          dataPropType: bn.Type.Num,
          compositeRule: !0
        }, _), y();
      });
    }
    function w(_) {
      t.code((0, Ke._)`${_}++`), l === void 0 ? t.if((0, Ke._)`${_} >= ${o}`, () => t.assign(h, !0).break()) : (t.if((0, Ke._)`${_} > ${l}`, () => t.assign(h, !1).break()), o === 1 ? t.assign(h, !0) : t.if((0, Ke._)`${_} >= ${o}`, () => t.assign(h, !0)));
    }
  }
};
Jo.default = bv;
var Mu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ee, r = C, n = re;
  e.error = {
    message: ({ params: { property: c, depsCount: d, deps: u } }) => {
      const h = d === 1 ? "property" : "properties";
      return (0, t.str)`must have ${h} ${u} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: d, deps: u, missingProperty: h } }) => (0, t._)`{property: ${c},
    missingProperty: ${h},
    depsCount: ${d},
    deps: ${u}}`
    // TODO change to reference
  };
  const s = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [d, u] = a(c);
      o(c, d), l(c, u);
    }
  };
  function a({ schema: c }) {
    const d = {}, u = {};
    for (const h in c) {
      if (h === "__proto__")
        continue;
      const b = Array.isArray(c[h]) ? d : u;
      b[h] = c[h];
    }
    return [d, u];
  }
  function o(c, d = c.schema) {
    const { gen: u, data: h, it: b } = c;
    if (Object.keys(d).length === 0)
      return;
    const g = u.let("missing");
    for (const w in d) {
      const _ = d[w];
      if (_.length === 0)
        continue;
      const y = (0, n.propertyInData)(u, h, w, b.opts.ownProperties);
      c.setParams({
        property: w,
        depsCount: _.length,
        deps: _.join(", ")
      }), b.allErrors ? u.if(y, () => {
        for (const m of _)
          (0, n.checkReportMissingProp)(c, m);
      }) : (u.if((0, t._)`${y} && (${(0, n.checkMissingProp)(c, _, g)})`), (0, n.reportMissingProp)(c, g), u.else());
    }
  }
  e.validatePropertyDeps = o;
  function l(c, d = c.schema) {
    const { gen: u, data: h, keyword: b, it: g } = c, w = u.name("valid");
    for (const _ in d)
      (0, r.alwaysValidSchema)(g, d[_]) || (u.if(
        (0, n.propertyInData)(u, h, _, g.opts.ownProperties),
        () => {
          const y = c.subschema({ keyword: b, schemaProp: _ }, w);
          c.mergeValidEvaluated(y, w);
        },
        () => u.var(w, !0)
        // TODO var
      ), c.ok(w));
  }
  e.validateSchemaDeps = l, e.default = s;
})(Mu);
var Bo = {};
Object.defineProperty(Bo, "__esModule", { value: !0 });
const Lu = ee, Sv = C, Pv = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Lu._)`{propertyName: ${e.propertyName}}`
}, Nv = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: Pv,
  code(e) {
    const { gen: t, schema: r, data: n, it: s } = e;
    if ((0, Sv.alwaysValidSchema)(s, r))
      return;
    const a = t.name("valid");
    t.forIn("key", n, (o) => {
      e.setParams({ propertyName: o }), e.subschema({
        keyword: "propertyNames",
        data: o,
        dataTypes: ["string"],
        propertyName: o,
        compositeRule: !0
      }, a), t.if((0, Lu.not)(a), () => {
        e.error(!0), s.allErrors || t.break();
      });
    }), e.ok(a);
  }
};
Bo.default = Nv;
var ys = {};
Object.defineProperty(ys, "__esModule", { value: !0 });
const Sn = re, Je = ee, Rv = ut, Pn = C, Ov = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, Je._)`{additionalProperty: ${e.additionalProperty}}`
}, Iv = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: Ov,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, errsCount: a, it: o } = e;
    if (!a)
      throw new Error("ajv implementation error");
    const { allErrors: l, opts: c } = o;
    if (o.props = !0, c.removeAdditional !== "all" && (0, Pn.alwaysValidSchema)(o, r))
      return;
    const d = (0, Sn.allSchemaProperties)(n.properties), u = (0, Sn.allSchemaProperties)(n.patternProperties);
    h(), e.ok((0, Je._)`${a} === ${Rv.default.errors}`);
    function h() {
      t.forIn("key", s, (y) => {
        !d.length && !u.length ? w(y) : t.if(b(y), () => w(y));
      });
    }
    function b(y) {
      let m;
      if (d.length > 8) {
        const v = (0, Pn.schemaRefOrVal)(o, n.properties, "properties");
        m = (0, Sn.isOwnProperty)(t, v, y);
      } else d.length ? m = (0, Je.or)(...d.map((v) => (0, Je._)`${y} === ${v}`)) : m = Je.nil;
      return u.length && (m = (0, Je.or)(m, ...u.map((v) => (0, Je._)`${(0, Sn.usePattern)(e, v)}.test(${y})`))), (0, Je.not)(m);
    }
    function g(y) {
      t.code((0, Je._)`delete ${s}[${y}]`);
    }
    function w(y) {
      if (c.removeAdditional === "all" || c.removeAdditional && r === !1) {
        g(y);
        return;
      }
      if (r === !1) {
        e.setParams({ additionalProperty: y }), e.error(), l || t.break();
        return;
      }
      if (typeof r == "object" && !(0, Pn.alwaysValidSchema)(o, r)) {
        const m = t.name("valid");
        c.removeAdditional === "failing" ? (_(y, m, !1), t.if((0, Je.not)(m), () => {
          e.reset(), g(y);
        })) : (_(y, m), l || t.if((0, Je.not)(m), () => t.break()));
      }
    }
    function _(y, m, v) {
      const N = {
        keyword: "additionalProperties",
        dataProp: y,
        dataPropType: Pn.Type.Str
      };
      v === !1 && Object.assign(N, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(N, m);
    }
  }
};
ys.default = Iv;
var Yo = {};
Object.defineProperty(Yo, "__esModule", { value: !0 });
const Tv = xe, dc = re, Fs = C, fc = ys, jv = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, parentSchema: n, data: s, it: a } = e;
    a.opts.removeAdditional === "all" && n.additionalProperties === void 0 && fc.default.code(new Tv.KeywordCxt(a, fc.default, "additionalProperties"));
    const o = (0, dc.allSchemaProperties)(r);
    for (const h of o)
      a.definedProperties.add(h);
    a.opts.unevaluated && o.length && a.props !== !0 && (a.props = Fs.mergeEvaluated.props(t, (0, Fs.toHash)(o), a.props));
    const l = o.filter((h) => !(0, Fs.alwaysValidSchema)(a, r[h]));
    if (l.length === 0)
      return;
    const c = t.name("valid");
    for (const h of l)
      d(h) ? u(h) : (t.if((0, dc.propertyInData)(t, s, h, a.opts.ownProperties)), u(h), a.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(h), e.ok(c);
    function d(h) {
      return a.opts.useDefaults && !a.compositeRule && r[h].default !== void 0;
    }
    function u(h) {
      e.subschema({
        keyword: "properties",
        schemaProp: h,
        dataProp: h
      }, c);
    }
  }
};
Yo.default = jv;
var Qo = {};
Object.defineProperty(Qo, "__esModule", { value: !0 });
const hc = re, Nn = ee, mc = C, pc = C, kv = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: r, data: n, parentSchema: s, it: a } = e, { opts: o } = a, l = (0, hc.allSchemaProperties)(r), c = l.filter((_) => (0, mc.alwaysValidSchema)(a, r[_]));
    if (l.length === 0 || c.length === l.length && (!a.opts.unevaluated || a.props === !0))
      return;
    const d = o.strictSchema && !o.allowMatchingProperties && s.properties, u = t.name("valid");
    a.props !== !0 && !(a.props instanceof Nn.Name) && (a.props = (0, pc.evaluatedPropsToName)(t, a.props));
    const { props: h } = a;
    b();
    function b() {
      for (const _ of l)
        d && g(_), a.allErrors ? w(_) : (t.var(u, !0), w(_), t.if(u));
    }
    function g(_) {
      for (const y in d)
        new RegExp(_).test(y) && (0, mc.checkStrictMode)(a, `property ${y} matches pattern ${_} (use allowMatchingProperties)`);
    }
    function w(_) {
      t.forIn("key", n, (y) => {
        t.if((0, Nn._)`${(0, hc.usePattern)(e, _)}.test(${y})`, () => {
          const m = c.includes(_);
          m || e.subschema({
            keyword: "patternProperties",
            schemaProp: _,
            dataProp: y,
            dataPropType: pc.Type.Str
          }, u), a.opts.unevaluated && h !== !0 ? t.assign((0, Nn._)`${h}[${y}]`, !0) : !m && !a.allErrors && t.if((0, Nn.not)(u), () => t.break());
        });
      });
    }
  }
};
Qo.default = kv;
var Zo = {};
Object.defineProperty(Zo, "__esModule", { value: !0 });
const Av = C, Cv = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if ((0, Av.alwaysValidSchema)(n, r)) {
      e.fail();
      return;
    }
    const s = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, s), e.failResult(s, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
Zo.default = Cv;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
const Dv = re, Mv = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: Dv.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
xo.default = Mv;
var ei = {};
Object.defineProperty(ei, "__esModule", { value: !0 });
const Gn = ee, Lv = C, Vv = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Gn._)`{passingSchemas: ${e.passing}}`
}, Fv = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: Vv,
  code(e) {
    const { gen: t, schema: r, parentSchema: n, it: s } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    if (s.opts.discriminator && n.discriminator)
      return;
    const a = r, o = t.let("valid", !1), l = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: l }), t.block(d), e.result(o, () => e.reset(), () => e.error(!0));
    function d() {
      a.forEach((u, h) => {
        let b;
        (0, Lv.alwaysValidSchema)(s, u) ? t.var(c, !0) : b = e.subschema({
          keyword: "oneOf",
          schemaProp: h,
          compositeRule: !0
        }, c), h > 0 && t.if((0, Gn._)`${c} && ${o}`).assign(o, !1).assign(l, (0, Gn._)`[${l}, ${h}]`).else(), t.if(c, () => {
          t.assign(o, !0), t.assign(l, h), b && e.mergeEvaluated(b, Gn.Name);
        });
      });
    }
  }
};
ei.default = Fv;
var ti = {};
Object.defineProperty(ti, "__esModule", { value: !0 });
const zv = C, Uv = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: r, it: n } = e;
    if (!Array.isArray(r))
      throw new Error("ajv implementation error");
    const s = t.name("valid");
    r.forEach((a, o) => {
      if ((0, zv.alwaysValidSchema)(n, a))
        return;
      const l = e.subschema({ keyword: "allOf", schemaProp: o }, s);
      e.ok(s), e.mergeEvaluated(l);
    });
  }
};
ti.default = Uv;
var ri = {};
Object.defineProperty(ri, "__esModule", { value: !0 });
const rs = ee, Vu = C, qv = {
  message: ({ params: e }) => (0, rs.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, rs._)`{failingKeyword: ${e.ifClause}}`
}, Kv = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: qv,
  code(e) {
    const { gen: t, parentSchema: r, it: n } = e;
    r.then === void 0 && r.else === void 0 && (0, Vu.checkStrictMode)(n, '"if" without "then" and "else" is ignored');
    const s = $c(n, "then"), a = $c(n, "else");
    if (!s && !a)
      return;
    const o = t.let("valid", !0), l = t.name("_valid");
    if (c(), e.reset(), s && a) {
      const u = t.let("ifClause");
      e.setParams({ ifClause: u }), t.if(l, d("then", u), d("else", u));
    } else s ? t.if(l, d("then")) : t.if((0, rs.not)(l), d("else"));
    e.pass(o, () => e.error(!0));
    function c() {
      const u = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, l);
      e.mergeEvaluated(u);
    }
    function d(u, h) {
      return () => {
        const b = e.subschema({ keyword: u }, l);
        t.assign(o, l), e.mergeValidEvaluated(b, o), h ? t.assign(h, (0, rs._)`${u}`) : e.setParams({ ifClause: u });
      };
    }
  }
};
function $c(e, t) {
  const r = e.schema[t];
  return r !== void 0 && !(0, Vu.alwaysValidSchema)(e, r);
}
ri.default = Kv;
var ni = {};
Object.defineProperty(ni, "__esModule", { value: !0 });
const Gv = C, Hv = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: r }) {
    t.if === void 0 && (0, Gv.checkStrictMode)(r, `"${e}" without "if" is ignored`);
  }
};
ni.default = Hv;
Object.defineProperty(Ho, "__esModule", { value: !0 });
const Wv = Dr, Xv = Wo, Jv = Mr, Bv = Xo, Yv = Jo, Qv = Mu, Zv = Bo, xv = ys, ew = Yo, tw = Qo, rw = Zo, nw = xo, sw = ei, aw = ti, ow = ri, iw = ni;
function cw(e = !1) {
  const t = [
    // any
    rw.default,
    nw.default,
    sw.default,
    aw.default,
    ow.default,
    iw.default,
    // object
    Zv.default,
    xv.default,
    Qv.default,
    ew.default,
    tw.default
  ];
  return e ? t.push(Xv.default, Bv.default) : t.push(Wv.default, Jv.default), t.push(Yv.default), t;
}
Ho.default = cw;
var si = {}, ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
const me = ee, lw = {
  message: ({ schemaCode: e }) => (0, me.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, me._)`{format: ${e}}`
}, uw = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: lw,
  code(e, t) {
    const { gen: r, data: n, $data: s, schema: a, schemaCode: o, it: l } = e, { opts: c, errSchemaPath: d, schemaEnv: u, self: h } = l;
    if (!c.validateFormats)
      return;
    s ? b() : g();
    function b() {
      const w = r.scopeValue("formats", {
        ref: h.formats,
        code: c.code.formats
      }), _ = r.const("fDef", (0, me._)`${w}[${o}]`), y = r.let("fType"), m = r.let("format");
      r.if((0, me._)`typeof ${_} == "object" && !(${_} instanceof RegExp)`, () => r.assign(y, (0, me._)`${_}.type || "string"`).assign(m, (0, me._)`${_}.validate`), () => r.assign(y, (0, me._)`"string"`).assign(m, _)), e.fail$data((0, me.or)(v(), N()));
      function v() {
        return c.strictSchema === !1 ? me.nil : (0, me._)`${o} && !${m}`;
      }
      function N() {
        const R = u.$async ? (0, me._)`(${_}.async ? await ${m}(${n}) : ${m}(${n}))` : (0, me._)`${m}(${n})`, O = (0, me._)`(typeof ${m} == "function" ? ${R} : ${m}.test(${n}))`;
        return (0, me._)`${m} && ${m} !== true && ${y} === ${t} && !${O}`;
      }
    }
    function g() {
      const w = h.formats[a];
      if (!w) {
        v();
        return;
      }
      if (w === !0)
        return;
      const [_, y, m] = N(w);
      _ === t && e.pass(R());
      function v() {
        if (c.strictSchema === !1) {
          h.logger.warn(O());
          return;
        }
        throw new Error(O());
        function O() {
          return `unknown format "${a}" ignored in schema at path "${d}"`;
        }
      }
      function N(O) {
        const K = O instanceof RegExp ? (0, me.regexpCode)(O) : c.code.formats ? (0, me._)`${c.code.formats}${(0, me.getProperty)(a)}` : void 0, J = r.scopeValue("formats", { key: a, ref: O, code: K });
        return typeof O == "object" && !(O instanceof RegExp) ? [O.type || "string", O.validate, (0, me._)`${J}.validate`] : ["string", O, J];
      }
      function R() {
        if (typeof w == "object" && !(w instanceof RegExp) && w.async) {
          if (!u.$async)
            throw new Error("async format in sync schema");
          return (0, me._)`await ${m}(${n})`;
        }
        return typeof y == "function" ? (0, me._)`${m}(${n})` : (0, me._)`${m}.test(${n})`;
      }
    }
  }
};
ai.default = uw;
Object.defineProperty(si, "__esModule", { value: !0 });
const dw = ai, fw = [dw.default];
si.default = fw;
var Or = {};
Object.defineProperty(Or, "__esModule", { value: !0 });
Or.contentVocabulary = Or.metadataVocabulary = void 0;
Or.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Or.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(To, "__esModule", { value: !0 });
const hw = jo, mw = Ao, pw = Ho, $w = si, yc = Or, yw = [
  hw.default,
  mw.default,
  (0, pw.default)(),
  $w.default,
  yc.metadataVocabulary,
  yc.contentVocabulary
];
To.default = yw;
var oi = {}, _s = {};
Object.defineProperty(_s, "__esModule", { value: !0 });
_s.DiscrError = void 0;
var _c;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(_c || (_s.DiscrError = _c = {}));
Object.defineProperty(oi, "__esModule", { value: !0 });
const _r = ee, fa = _s, gc = Me, _w = Cr, gw = C, vw = {
  message: ({ params: { discrError: e, tagName: t } }) => e === fa.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: r } }) => (0, _r._)`{error: ${e}, tag: ${r}, tagValue: ${t}}`
}, ww = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: vw,
  code(e) {
    const { gen: t, data: r, schema: n, parentSchema: s, it: a } = e, { oneOf: o } = s;
    if (!a.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const l = n.propertyName;
    if (typeof l != "string")
      throw new Error("discriminator: requires propertyName");
    if (n.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!o)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), d = t.const("tag", (0, _r._)`${r}${(0, _r.getProperty)(l)}`);
    t.if((0, _r._)`typeof ${d} == "string"`, () => u(), () => e.error(!1, { discrError: fa.DiscrError.Tag, tag: d, tagName: l })), e.ok(c);
    function u() {
      const g = b();
      t.if(!1);
      for (const w in g)
        t.elseIf((0, _r._)`${d} === ${w}`), t.assign(c, h(g[w]));
      t.else(), e.error(!1, { discrError: fa.DiscrError.Mapping, tag: d, tagName: l }), t.endIf();
    }
    function h(g) {
      const w = t.name("valid"), _ = e.subschema({ keyword: "oneOf", schemaProp: g }, w);
      return e.mergeEvaluated(_, _r.Name), w;
    }
    function b() {
      var g;
      const w = {}, _ = m(s);
      let y = !0;
      for (let R = 0; R < o.length; R++) {
        let O = o[R];
        if (O != null && O.$ref && !(0, gw.schemaHasRulesButRef)(O, a.self.RULES)) {
          const J = O.$ref;
          if (O = gc.resolveRef.call(a.self, a.schemaEnv.root, a.baseId, J), O instanceof gc.SchemaEnv && (O = O.schema), O === void 0)
            throw new _w.default(a.opts.uriResolver, a.baseId, J);
        }
        const K = (g = O == null ? void 0 : O.properties) === null || g === void 0 ? void 0 : g[l];
        if (typeof K != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${l}"`);
        y = y && (_ || m(O)), v(K, R);
      }
      if (!y)
        throw new Error(`discriminator: "${l}" must be required`);
      return w;
      function m({ required: R }) {
        return Array.isArray(R) && R.includes(l);
      }
      function v(R, O) {
        if (R.const)
          N(R.const, O);
        else if (R.enum)
          for (const K of R.enum)
            N(K, O);
        else
          throw new Error(`discriminator: "properties/${l}" must have "const" or "enum"`);
      }
      function N(R, O) {
        if (typeof R != "string" || R in w)
          throw new Error(`discriminator: "${l}" values must be unique strings`);
        w[R] = O;
      }
    }
  }
};
oi.default = ww;
const Ew = "http://json-schema.org/draft-07/schema#", bw = "http://json-schema.org/draft-07/schema#", Sw = "Core schema meta-schema", Pw = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, Nw = [
  "object",
  "boolean"
], Rw = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, Ow = {
  $schema: Ew,
  $id: bw,
  title: Sw,
  definitions: Pw,
  type: Nw,
  properties: Rw,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const r = Zl, n = To, s = oi, a = Ow, o = ["/properties"], l = "http://json-schema.org/draft-07/schema";
  class c extends r.default {
    _addVocabularies() {
      super._addVocabularies(), n.default.forEach((w) => this.addVocabulary(w)), this.opts.discriminator && this.addKeyword(s.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const w = this.opts.$data ? this.$dataMetaSchema(a, o) : a;
      this.addMetaSchema(w, l, !1), this.refs["http://json-schema.org/schema"] = l;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(l) ? l : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var d = xe;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return d.KeywordCxt;
  } });
  var u = ee;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var h = fn;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return h.default;
  } });
  var b = Cr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return b.default;
  } });
})(aa, aa.exports);
var Iw = aa.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Iw, r = ee, n = r.operators, s = {
    formatMaximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    formatMinimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    formatExclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, a = {
    message: ({ keyword: l, schemaCode: c }) => (0, r.str)`should be ${s[l].okStr} ${c}`,
    params: ({ keyword: l, schemaCode: c }) => (0, r._)`{comparison: ${s[l].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(s),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: a,
    code(l) {
      const { gen: c, data: d, schemaCode: u, keyword: h, it: b } = l, { opts: g, self: w } = b;
      if (!g.validateFormats)
        return;
      const _ = new t.KeywordCxt(b, w.RULES.all.format.definition, "format");
      _.$data ? y() : m();
      function y() {
        const N = c.scopeValue("formats", {
          ref: w.formats,
          code: g.code.formats
        }), R = c.const("fmt", (0, r._)`${N}[${_.schemaCode}]`);
        l.fail$data((0, r.or)((0, r._)`typeof ${R} != "object"`, (0, r._)`${R} instanceof RegExp`, (0, r._)`typeof ${R}.compare != "function"`, v(R)));
      }
      function m() {
        const N = _.schema, R = w.formats[N];
        if (!R || R === !0)
          return;
        if (typeof R != "object" || R instanceof RegExp || typeof R.compare != "function")
          throw new Error(`"${h}": format "${N}" does not define "compare" function`);
        const O = c.scopeValue("formats", {
          key: N,
          ref: R,
          code: g.code.formats ? (0, r._)`${g.code.formats}${(0, r.getProperty)(N)}` : void 0
        });
        l.fail$data(v(O));
      }
      function v(N) {
        return (0, r._)`${N}.compare(${d}, ${u}) ${s[h].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const o = (l) => (l.addKeyword(e.formatLimitDefinition), l);
  e.default = o;
})(Ql);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const r = Yl, n = Ql, s = ee, a = new s.Name("fullFormats"), o = new s.Name("fastFormats"), l = (d, u = { keywords: !0 }) => {
    if (Array.isArray(u))
      return c(d, u, r.fullFormats, a), d;
    const [h, b] = u.mode === "fast" ? [r.fastFormats, o] : [r.fullFormats, a], g = u.formats || r.formatNames;
    return c(d, g, h, b), u.keywords && (0, n.default)(d), d;
  };
  l.get = (d, u = "full") => {
    const b = (u === "fast" ? r.fastFormats : r.fullFormats)[d];
    if (!b)
      throw new Error(`Unknown format "${d}"`);
    return b;
  };
  function c(d, u, h, b) {
    var g, w;
    (g = (w = d.opts.code).formats) !== null && g !== void 0 || (w.formats = (0, s._)`require("ajv-formats/dist/formats").${b}`);
    for (const _ of u)
      d.addFormat(_, h[_]);
  }
  e.exports = t = l, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = l;
})(sa, sa.exports);
var Tw = sa.exports;
const jw = /* @__PURE__ */ Yc(Tw), kw = (e, t, r, n) => {
  if (r === "length" || r === "prototype" || r === "arguments" || r === "caller")
    return;
  const s = Object.getOwnPropertyDescriptor(e, r), a = Object.getOwnPropertyDescriptor(t, r);
  !Aw(s, a) && n || Object.defineProperty(e, r, a);
}, Aw = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Cw = (e, t) => {
  const r = Object.getPrototypeOf(t);
  r !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, r);
}, Dw = (e, t) => `/* Wrapped ${e}*/
${t}`, Mw = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Lw = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Vw = (e, t, r) => {
  const n = r === "" ? "" : `with ${r.trim()}() `, s = Dw.bind(null, n, t.toString());
  Object.defineProperty(s, "name", Lw);
  const { writable: a, enumerable: o, configurable: l } = Mw;
  Object.defineProperty(e, "toString", { value: s, writable: a, enumerable: o, configurable: l });
};
function Fw(e, t, { ignoreNonConfigurable: r = !1 } = {}) {
  const { name: n } = e;
  for (const s of Reflect.ownKeys(t))
    kw(e, t, s, r);
  return Cw(e, t), Vw(e, t, n), e;
}
const vc = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: r = 0,
    maxWait: n = Number.POSITIVE_INFINITY,
    before: s = !1,
    after: a = !0
  } = t;
  if (r < 0 || n < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!s && !a)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let o, l, c;
  const d = function(...u) {
    const h = this, b = () => {
      o = void 0, l && (clearTimeout(l), l = void 0), a && (c = e.apply(h, u));
    }, g = () => {
      l = void 0, o && (clearTimeout(o), o = void 0), a && (c = e.apply(h, u));
    }, w = s && !o;
    return clearTimeout(o), o = setTimeout(b, r), n > 0 && n !== Number.POSITIVE_INFINITY && !l && (l = setTimeout(g, n)), w && (c = e.apply(h, u)), c;
  };
  return Fw(d, e), d.cancel = () => {
    o && (clearTimeout(o), o = void 0), l && (clearTimeout(l), l = void 0);
  }, d;
};
var ha = { exports: {} };
const zw = "2.0.0", Fu = 256, Uw = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, qw = 16, Kw = Fu - 6, Gw = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var gs = {
  MAX_LENGTH: Fu,
  MAX_SAFE_COMPONENT_LENGTH: qw,
  MAX_SAFE_BUILD_LENGTH: Kw,
  MAX_SAFE_INTEGER: Uw,
  RELEASE_TYPES: Gw,
  SEMVER_SPEC_VERSION: zw,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Hw = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var vs = Hw;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: s
  } = gs, a = vs;
  t = e.exports = {};
  const o = t.re = [], l = t.safeRe = [], c = t.src = [], d = t.safeSrc = [], u = t.t = {};
  let h = 0;
  const b = "[a-zA-Z0-9-]", g = [
    ["\\s", 1],
    ["\\d", s],
    [b, n]
  ], w = (y) => {
    for (const [m, v] of g)
      y = y.split(`${m}*`).join(`${m}{0,${v}}`).split(`${m}+`).join(`${m}{1,${v}}`);
    return y;
  }, _ = (y, m, v) => {
    const N = w(m), R = h++;
    a(y, R, m), u[y] = R, c[R] = m, d[R] = N, o[R] = new RegExp(m, v ? "g" : void 0), l[R] = new RegExp(N, v ? "g" : void 0);
  };
  _("NUMERICIDENTIFIER", "0|[1-9]\\d*"), _("NUMERICIDENTIFIERLOOSE", "\\d+"), _("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${b}*`), _("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), _("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), _("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), _("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), _("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), _("BUILDIDENTIFIER", `${b}+`), _("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), _("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), _("FULL", `^${c[u.FULLPLAIN]}$`), _("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), _("LOOSE", `^${c[u.LOOSEPLAIN]}$`), _("GTLT", "((?:<|>)?=?)"), _("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), _("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), _("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), _("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), _("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), _("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), _("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), _("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), _("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), _("COERCERTL", c[u.COERCE], !0), _("COERCERTLFULL", c[u.COERCEFULL], !0), _("LONETILDE", "(?:~>?)"), _("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", _("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), _("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), _("LONECARET", "(?:\\^)"), _("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", _("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), _("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), _("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), _("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), _("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", _("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), _("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), _("STAR", "(<|>)?=?\\s*\\*"), _("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), _("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ha, ha.exports);
var mn = ha.exports;
const Ww = Object.freeze({ loose: !0 }), Xw = Object.freeze({}), Jw = (e) => e ? typeof e != "object" ? Ww : e : Xw;
var ii = Jw;
const wc = /^[0-9]+$/, zu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = wc.test(e), n = wc.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, Bw = (e, t) => zu(t, e);
var Uu = {
  compareIdentifiers: zu,
  rcompareIdentifiers: Bw
};
const Rn = vs, { MAX_LENGTH: Ec, MAX_SAFE_INTEGER: On } = gs, { safeRe: In, t: Tn } = mn, Yw = ii, { compareIdentifiers: zs } = Uu;
let Qw = class nt {
  constructor(t, r) {
    if (r = Yw(r), t instanceof nt) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ec)
      throw new TypeError(
        `version is longer than ${Ec} characters`
      );
    Rn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? In[Tn.LOOSE] : In[Tn.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > On || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > On || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > On || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((s) => {
      if (/^[0-9]+$/.test(s)) {
        const a = +s;
        if (a >= 0 && a < On)
          return a;
      }
      return s;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (Rn("SemVer.compare", this.version, this.options, t), !(t instanceof nt)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new nt(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof nt || (t = new nt(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof nt || (t = new nt(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], s = t.prerelease[r];
      if (Rn("prerelease compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return zs(n, s);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof nt || (t = new nt(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], s = t.build[r];
      if (Rn("build compare", r, n, s), n === void 0 && s === void 0)
        return 0;
      if (s === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === s)
        continue;
      return zs(n, s);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const s = `-${r}`.match(this.options.loose ? In[Tn.PRERELEASELOOSE] : In[Tn.PRERELEASE]);
        if (!s || s[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const s = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [s];
        else {
          let a = this.prerelease.length;
          for (; --a >= 0; )
            typeof this.prerelease[a] == "number" && (this.prerelease[a]++, a = -2);
          if (a === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(s);
          }
        }
        if (r) {
          let a = [r, s];
          n === !1 && (a = [r]), zs(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = a) : this.prerelease = a;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var ke = Qw;
const bc = ke, Zw = (e, t, r = !1) => {
  if (e instanceof bc)
    return e;
  try {
    return new bc(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var Lr = Zw;
const xw = Lr, eE = (e, t) => {
  const r = xw(e, t);
  return r ? r.version : null;
};
var tE = eE;
const rE = Lr, nE = (e, t) => {
  const r = rE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var sE = nE;
const Sc = ke, aE = (e, t, r, n, s) => {
  typeof r == "string" && (s = n, n = r, r = void 0);
  try {
    return new Sc(
      e instanceof Sc ? e.version : e,
      r
    ).inc(t, n, s).version;
  } catch {
    return null;
  }
};
var oE = aE;
const Pc = Lr, iE = (e, t) => {
  const r = Pc(e, null, !0), n = Pc(t, null, !0), s = r.compare(n);
  if (s === 0)
    return null;
  const a = s > 0, o = a ? r : n, l = a ? n : r, c = !!o.prerelease.length;
  if (!!l.prerelease.length && !c) {
    if (!l.patch && !l.minor)
      return "major";
    if (l.compareMain(o) === 0)
      return l.minor && !l.patch ? "minor" : "patch";
  }
  const u = c ? "pre" : "";
  return r.major !== n.major ? u + "major" : r.minor !== n.minor ? u + "minor" : r.patch !== n.patch ? u + "patch" : "prerelease";
};
var cE = iE;
const lE = ke, uE = (e, t) => new lE(e, t).major;
var dE = uE;
const fE = ke, hE = (e, t) => new fE(e, t).minor;
var mE = hE;
const pE = ke, $E = (e, t) => new pE(e, t).patch;
var yE = $E;
const _E = Lr, gE = (e, t) => {
  const r = _E(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var vE = gE;
const Nc = ke, wE = (e, t, r) => new Nc(e, r).compare(new Nc(t, r));
var et = wE;
const EE = et, bE = (e, t, r) => EE(t, e, r);
var SE = bE;
const PE = et, NE = (e, t) => PE(e, t, !0);
var RE = NE;
const Rc = ke, OE = (e, t, r) => {
  const n = new Rc(e, r), s = new Rc(t, r);
  return n.compare(s) || n.compareBuild(s);
};
var ci = OE;
const IE = ci, TE = (e, t) => e.sort((r, n) => IE(r, n, t));
var jE = TE;
const kE = ci, AE = (e, t) => e.sort((r, n) => kE(n, r, t));
var CE = AE;
const DE = et, ME = (e, t, r) => DE(e, t, r) > 0;
var ws = ME;
const LE = et, VE = (e, t, r) => LE(e, t, r) < 0;
var li = VE;
const FE = et, zE = (e, t, r) => FE(e, t, r) === 0;
var qu = zE;
const UE = et, qE = (e, t, r) => UE(e, t, r) !== 0;
var Ku = qE;
const KE = et, GE = (e, t, r) => KE(e, t, r) >= 0;
var ui = GE;
const HE = et, WE = (e, t, r) => HE(e, t, r) <= 0;
var di = WE;
const XE = qu, JE = Ku, BE = ws, YE = ui, QE = li, ZE = di, xE = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return XE(e, r, n);
    case "!=":
      return JE(e, r, n);
    case ">":
      return BE(e, r, n);
    case ">=":
      return YE(e, r, n);
    case "<":
      return QE(e, r, n);
    case "<=":
      return ZE(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Gu = xE;
const eb = ke, tb = Lr, { safeRe: jn, t: kn } = mn, rb = (e, t) => {
  if (e instanceof eb)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? jn[kn.COERCEFULL] : jn[kn.COERCE]);
  else {
    const c = t.includePrerelease ? jn[kn.COERCERTLFULL] : jn[kn.COERCERTL];
    let d;
    for (; (d = c.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || d.index + d[0].length !== r.index + r[0].length) && (r = d), c.lastIndex = d.index + d[1].length + d[2].length;
    c.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], s = r[3] || "0", a = r[4] || "0", o = t.includePrerelease && r[5] ? `-${r[5]}` : "", l = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return tb(`${n}.${s}.${a}${o}${l}`, t);
};
var nb = rb;
class sb {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const s = this.map.keys().next().value;
        this.delete(s);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var ab = sb, Us, Oc;
function tt() {
  if (Oc) return Us;
  Oc = 1;
  const e = /\s+/g;
  class t {
    constructor(k, L) {
      if (L = s(L), k instanceof t)
        return k.loose === !!L.loose && k.includePrerelease === !!L.includePrerelease ? k : new t(k.raw, L);
      if (k instanceof a)
        return this.raw = k.value, this.set = [[k]], this.formatted = void 0, this;
      if (this.options = L, this.loose = !!L.loose, this.includePrerelease = !!L.includePrerelease, this.raw = k.trim().replace(e, " "), this.set = this.raw.split("||").map((D) => this.parseRange(D.trim())).filter((D) => D.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const D = this.set[0];
        if (this.set = this.set.filter((G) => !_(G[0])), this.set.length === 0)
          this.set = [D];
        else if (this.set.length > 1) {
          for (const G of this.set)
            if (G.length === 1 && y(G[0])) {
              this.set = [G];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let k = 0; k < this.set.length; k++) {
          k > 0 && (this.formatted += "||");
          const L = this.set[k];
          for (let D = 0; D < L.length; D++)
            D > 0 && (this.formatted += " "), this.formatted += L[D].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(k) {
      const D = ((this.options.includePrerelease && g) | (this.options.loose && w)) + ":" + k, G = n.get(D);
      if (G)
        return G;
      const M = this.options.loose, P = M ? c[d.HYPHENRANGELOOSE] : c[d.HYPHENRANGE];
      k = k.replace(P, H(this.options.includePrerelease)), o("hyphen replace", k), k = k.replace(c[d.COMPARATORTRIM], u), o("comparator trim", k), k = k.replace(c[d.TILDETRIM], h), o("tilde trim", k), k = k.replace(c[d.CARETTRIM], b), o("caret trim", k);
      let p = k.split(" ").map((f) => v(f, this.options)).join(" ").split(/\s+/).map((f) => z(f, this.options));
      M && (p = p.filter((f) => (o("loose invalid filter", f, this.options), !!f.match(c[d.COMPARATORLOOSE])))), o("range list", p);
      const S = /* @__PURE__ */ new Map(), $ = p.map((f) => new a(f, this.options));
      for (const f of $) {
        if (_(f))
          return [f];
        S.set(f.value, f);
      }
      S.size > 1 && S.has("") && S.delete("");
      const i = [...S.values()];
      return n.set(D, i), i;
    }
    intersects(k, L) {
      if (!(k instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((D) => m(D, L) && k.set.some((G) => m(G, L) && D.every((M) => G.every((P) => M.intersects(P, L)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(k) {
      if (!k)
        return !1;
      if (typeof k == "string")
        try {
          k = new l(k, this.options);
        } catch {
          return !1;
        }
      for (let L = 0; L < this.set.length; L++)
        if (se(this.set[L], k, this.options))
          return !0;
      return !1;
    }
  }
  Us = t;
  const r = ab, n = new r(), s = ii, a = Es(), o = vs, l = ke, {
    safeRe: c,
    t: d,
    comparatorTrimReplace: u,
    tildeTrimReplace: h,
    caretTrimReplace: b
  } = mn, { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: w } = gs, _ = (T) => T.value === "<0.0.0-0", y = (T) => T.value === "", m = (T, k) => {
    let L = !0;
    const D = T.slice();
    let G = D.pop();
    for (; L && D.length; )
      L = D.every((M) => G.intersects(M, k)), G = D.pop();
    return L;
  }, v = (T, k) => (T = T.replace(c[d.BUILD], ""), o("comp", T, k), T = K(T, k), o("caret", T), T = R(T, k), o("tildes", T), T = ue(T, k), o("xrange", T), T = $e(T, k), o("stars", T), T), N = (T) => !T || T.toLowerCase() === "x" || T === "*", R = (T, k) => T.trim().split(/\s+/).map((L) => O(L, k)).join(" "), O = (T, k) => {
    const L = k.loose ? c[d.TILDELOOSE] : c[d.TILDE];
    return T.replace(L, (D, G, M, P, p) => {
      o("tilde", T, D, G, M, P, p);
      let S;
      return N(G) ? S = "" : N(M) ? S = `>=${G}.0.0 <${+G + 1}.0.0-0` : N(P) ? S = `>=${G}.${M}.0 <${G}.${+M + 1}.0-0` : p ? (o("replaceTilde pr", p), S = `>=${G}.${M}.${P}-${p} <${G}.${+M + 1}.0-0`) : S = `>=${G}.${M}.${P} <${G}.${+M + 1}.0-0`, o("tilde return", S), S;
    });
  }, K = (T, k) => T.trim().split(/\s+/).map((L) => J(L, k)).join(" "), J = (T, k) => {
    o("caret", T, k);
    const L = k.loose ? c[d.CARETLOOSE] : c[d.CARET], D = k.includePrerelease ? "-0" : "";
    return T.replace(L, (G, M, P, p, S) => {
      o("caret", T, G, M, P, p, S);
      let $;
      return N(M) ? $ = "" : N(P) ? $ = `>=${M}.0.0${D} <${+M + 1}.0.0-0` : N(p) ? M === "0" ? $ = `>=${M}.${P}.0${D} <${M}.${+P + 1}.0-0` : $ = `>=${M}.${P}.0${D} <${+M + 1}.0.0-0` : S ? (o("replaceCaret pr", S), M === "0" ? P === "0" ? $ = `>=${M}.${P}.${p}-${S} <${M}.${P}.${+p + 1}-0` : $ = `>=${M}.${P}.${p}-${S} <${M}.${+P + 1}.0-0` : $ = `>=${M}.${P}.${p}-${S} <${+M + 1}.0.0-0`) : (o("no pr"), M === "0" ? P === "0" ? $ = `>=${M}.${P}.${p}${D} <${M}.${P}.${+p + 1}-0` : $ = `>=${M}.${P}.${p}${D} <${M}.${+P + 1}.0-0` : $ = `>=${M}.${P}.${p} <${+M + 1}.0.0-0`), o("caret return", $), $;
    });
  }, ue = (T, k) => (o("replaceXRanges", T, k), T.split(/\s+/).map((L) => fe(L, k)).join(" ")), fe = (T, k) => {
    T = T.trim();
    const L = k.loose ? c[d.XRANGELOOSE] : c[d.XRANGE];
    return T.replace(L, (D, G, M, P, p, S) => {
      o("xRange", T, D, G, M, P, p, S);
      const $ = N(M), i = $ || N(P), f = i || N(p), E = f;
      return G === "=" && E && (G = ""), S = k.includePrerelease ? "-0" : "", $ ? G === ">" || G === "<" ? D = "<0.0.0-0" : D = "*" : G && E ? (i && (P = 0), p = 0, G === ">" ? (G = ">=", i ? (M = +M + 1, P = 0, p = 0) : (P = +P + 1, p = 0)) : G === "<=" && (G = "<", i ? M = +M + 1 : P = +P + 1), G === "<" && (S = "-0"), D = `${G + M}.${P}.${p}${S}`) : i ? D = `>=${M}.0.0${S} <${+M + 1}.0.0-0` : f && (D = `>=${M}.${P}.0${S} <${M}.${+P + 1}.0-0`), o("xRange return", D), D;
    });
  }, $e = (T, k) => (o("replaceStars", T, k), T.trim().replace(c[d.STAR], "")), z = (T, k) => (o("replaceGTE0", T, k), T.trim().replace(c[k.includePrerelease ? d.GTE0PRE : d.GTE0], "")), H = (T) => (k, L, D, G, M, P, p, S, $, i, f, E) => (N(D) ? L = "" : N(G) ? L = `>=${D}.0.0${T ? "-0" : ""}` : N(M) ? L = `>=${D}.${G}.0${T ? "-0" : ""}` : P ? L = `>=${L}` : L = `>=${L}${T ? "-0" : ""}`, N($) ? S = "" : N(i) ? S = `<${+$ + 1}.0.0-0` : N(f) ? S = `<${$}.${+i + 1}.0-0` : E ? S = `<=${$}.${i}.${f}-${E}` : T ? S = `<${$}.${i}.${+f + 1}-0` : S = `<=${S}`, `${L} ${S}`.trim()), se = (T, k, L) => {
    for (let D = 0; D < T.length; D++)
      if (!T[D].test(k))
        return !1;
    if (k.prerelease.length && !L.includePrerelease) {
      for (let D = 0; D < T.length; D++)
        if (o(T[D].semver), T[D].semver !== a.ANY && T[D].semver.prerelease.length > 0) {
          const G = T[D].semver;
          if (G.major === k.major && G.minor === k.minor && G.patch === k.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Us;
}
var qs, Ic;
function Es() {
  if (Ic) return qs;
  Ic = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(u, h) {
      if (h = r(h), u instanceof t) {
        if (u.loose === !!h.loose)
          return u;
        u = u.value;
      }
      u = u.trim().split(/\s+/).join(" "), o("comparator", u, h), this.options = h, this.loose = !!h.loose, this.parse(u), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, o("comp", this);
    }
    parse(u) {
      const h = this.options.loose ? n[s.COMPARATORLOOSE] : n[s.COMPARATOR], b = u.match(h);
      if (!b)
        throw new TypeError(`Invalid comparator: ${u}`);
      this.operator = b[1] !== void 0 ? b[1] : "", this.operator === "=" && (this.operator = ""), b[2] ? this.semver = new l(b[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(u) {
      if (o("Comparator.test", u, this.options.loose), this.semver === e || u === e)
        return !0;
      if (typeof u == "string")
        try {
          u = new l(u, this.options);
        } catch {
          return !1;
        }
      return a(u, this.operator, this.semver, this.options);
    }
    intersects(u, h) {
      if (!(u instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(u.value, h).test(this.value) : u.operator === "" ? u.value === "" ? !0 : new c(this.value, h).test(u.semver) : (h = r(h), h.includePrerelease && (this.value === "<0.0.0-0" || u.value === "<0.0.0-0") || !h.includePrerelease && (this.value.startsWith("<0.0.0") || u.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && u.operator.startsWith(">") || this.operator.startsWith("<") && u.operator.startsWith("<") || this.semver.version === u.semver.version && this.operator.includes("=") && u.operator.includes("=") || a(this.semver, "<", u.semver, h) && this.operator.startsWith(">") && u.operator.startsWith("<") || a(this.semver, ">", u.semver, h) && this.operator.startsWith("<") && u.operator.startsWith(">")));
    }
  }
  qs = t;
  const r = ii, { safeRe: n, t: s } = mn, a = Gu, o = vs, l = ke, c = tt();
  return qs;
}
const ob = tt(), ib = (e, t, r) => {
  try {
    t = new ob(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var bs = ib;
const cb = tt(), lb = (e, t) => new cb(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var ub = lb;
const db = ke, fb = tt(), hb = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new fb(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === -1) && (n = o, s = new db(n, r));
  }), n;
};
var mb = hb;
const pb = ke, $b = tt(), yb = (e, t, r) => {
  let n = null, s = null, a = null;
  try {
    a = new $b(t, r);
  } catch {
    return null;
  }
  return e.forEach((o) => {
    a.test(o) && (!n || s.compare(o) === 1) && (n = o, s = new pb(n, r));
  }), n;
};
var _b = yb;
const Ks = ke, gb = tt(), Tc = ws, vb = (e, t) => {
  e = new gb(e, t);
  let r = new Ks("0.0.0");
  if (e.test(r) || (r = new Ks("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const s = e.set[n];
    let a = null;
    s.forEach((o) => {
      const l = new Ks(o.semver.version);
      switch (o.operator) {
        case ">":
          l.prerelease.length === 0 ? l.patch++ : l.prerelease.push(0), l.raw = l.format();
        case "":
        case ">=":
          (!a || Tc(l, a)) && (a = l);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${o.operator}`);
      }
    }), a && (!r || Tc(r, a)) && (r = a);
  }
  return r && e.test(r) ? r : null;
};
var wb = vb;
const Eb = tt(), bb = (e, t) => {
  try {
    return new Eb(e, t).range || "*";
  } catch {
    return null;
  }
};
var Sb = bb;
const Pb = ke, Hu = Es(), { ANY: Nb } = Hu, Rb = tt(), Ob = bs, jc = ws, kc = li, Ib = di, Tb = ui, jb = (e, t, r, n) => {
  e = new Pb(e, n), t = new Rb(t, n);
  let s, a, o, l, c;
  switch (r) {
    case ">":
      s = jc, a = Ib, o = kc, l = ">", c = ">=";
      break;
    case "<":
      s = kc, a = Tb, o = jc, l = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (Ob(e, t, n))
    return !1;
  for (let d = 0; d < t.set.length; ++d) {
    const u = t.set[d];
    let h = null, b = null;
    if (u.forEach((g) => {
      g.semver === Nb && (g = new Hu(">=0.0.0")), h = h || g, b = b || g, s(g.semver, h.semver, n) ? h = g : o(g.semver, b.semver, n) && (b = g);
    }), h.operator === l || h.operator === c || (!b.operator || b.operator === l) && a(e, b.semver))
      return !1;
    if (b.operator === c && o(e, b.semver))
      return !1;
  }
  return !0;
};
var fi = jb;
const kb = fi, Ab = (e, t, r) => kb(e, t, ">", r);
var Cb = Ab;
const Db = fi, Mb = (e, t, r) => Db(e, t, "<", r);
var Lb = Mb;
const Ac = tt(), Vb = (e, t, r) => (e = new Ac(e, r), t = new Ac(t, r), e.intersects(t, r));
var Fb = Vb;
const zb = bs, Ub = et;
var qb = (e, t, r) => {
  const n = [];
  let s = null, a = null;
  const o = e.sort((u, h) => Ub(u, h, r));
  for (const u of o)
    zb(u, t, r) ? (a = u, s || (s = u)) : (a && n.push([s, a]), a = null, s = null);
  s && n.push([s, null]);
  const l = [];
  for (const [u, h] of n)
    u === h ? l.push(u) : !h && u === o[0] ? l.push("*") : h ? u === o[0] ? l.push(`<=${h}`) : l.push(`${u} - ${h}`) : l.push(`>=${u}`);
  const c = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < d.length ? c : t;
};
const Cc = tt(), hi = Es(), { ANY: Gs } = hi, Hr = bs, mi = et, Kb = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new Cc(e, r), t = new Cc(t, r);
  let n = !1;
  e: for (const s of e.set) {
    for (const a of t.set) {
      const o = Hb(s, a, r);
      if (n = n || o !== null, o)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Gb = [new hi(">=0.0.0-0")], Dc = [new hi(">=0.0.0")], Hb = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Gs) {
    if (t.length === 1 && t[0].semver === Gs)
      return !0;
    r.includePrerelease ? e = Gb : e = Dc;
  }
  if (t.length === 1 && t[0].semver === Gs) {
    if (r.includePrerelease)
      return !0;
    t = Dc;
  }
  const n = /* @__PURE__ */ new Set();
  let s, a;
  for (const g of e)
    g.operator === ">" || g.operator === ">=" ? s = Mc(s, g, r) : g.operator === "<" || g.operator === "<=" ? a = Lc(a, g, r) : n.add(g.semver);
  if (n.size > 1)
    return null;
  let o;
  if (s && a) {
    if (o = mi(s.semver, a.semver, r), o > 0)
      return null;
    if (o === 0 && (s.operator !== ">=" || a.operator !== "<="))
      return null;
  }
  for (const g of n) {
    if (s && !Hr(g, String(s), r) || a && !Hr(g, String(a), r))
      return null;
    for (const w of t)
      if (!Hr(g, String(w), r))
        return !1;
    return !0;
  }
  let l, c, d, u, h = a && !r.includePrerelease && a.semver.prerelease.length ? a.semver : !1, b = s && !r.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
  h && h.prerelease.length === 1 && a.operator === "<" && h.prerelease[0] === 0 && (h = !1);
  for (const g of t) {
    if (u = u || g.operator === ">" || g.operator === ">=", d = d || g.operator === "<" || g.operator === "<=", s) {
      if (b && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === b.major && g.semver.minor === b.minor && g.semver.patch === b.patch && (b = !1), g.operator === ">" || g.operator === ">=") {
        if (l = Mc(s, g, r), l === g && l !== s)
          return !1;
      } else if (s.operator === ">=" && !Hr(s.semver, String(g), r))
        return !1;
    }
    if (a) {
      if (h && g.semver.prerelease && g.semver.prerelease.length && g.semver.major === h.major && g.semver.minor === h.minor && g.semver.patch === h.patch && (h = !1), g.operator === "<" || g.operator === "<=") {
        if (c = Lc(a, g, r), c === g && c !== a)
          return !1;
      } else if (a.operator === "<=" && !Hr(a.semver, String(g), r))
        return !1;
    }
    if (!g.operator && (a || s) && o !== 0)
      return !1;
  }
  return !(s && d && !a && o !== 0 || a && u && !s && o !== 0 || b || h);
}, Mc = (e, t, r) => {
  if (!e)
    return t;
  const n = mi(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Lc = (e, t, r) => {
  if (!e)
    return t;
  const n = mi(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Wb = Kb;
const Hs = mn, Vc = gs, Xb = ke, Fc = Uu, Jb = Lr, Bb = tE, Yb = sE, Qb = oE, Zb = cE, xb = dE, e1 = mE, t1 = yE, r1 = vE, n1 = et, s1 = SE, a1 = RE, o1 = ci, i1 = jE, c1 = CE, l1 = ws, u1 = li, d1 = qu, f1 = Ku, h1 = ui, m1 = di, p1 = Gu, $1 = nb, y1 = Es(), _1 = tt(), g1 = bs, v1 = ub, w1 = mb, E1 = _b, b1 = wb, S1 = Sb, P1 = fi, N1 = Cb, R1 = Lb, O1 = Fb, I1 = qb, T1 = Wb;
var j1 = {
  parse: Jb,
  valid: Bb,
  clean: Yb,
  inc: Qb,
  diff: Zb,
  major: xb,
  minor: e1,
  patch: t1,
  prerelease: r1,
  compare: n1,
  rcompare: s1,
  compareLoose: a1,
  compareBuild: o1,
  sort: i1,
  rsort: c1,
  gt: l1,
  lt: u1,
  eq: d1,
  neq: f1,
  gte: h1,
  lte: m1,
  cmp: p1,
  coerce: $1,
  Comparator: y1,
  Range: _1,
  satisfies: g1,
  toComparators: v1,
  maxSatisfying: w1,
  minSatisfying: E1,
  minVersion: b1,
  validRange: S1,
  outside: P1,
  gtr: N1,
  ltr: R1,
  intersects: O1,
  simplifyRange: I1,
  subset: T1,
  SemVer: Xb,
  re: Hs.re,
  src: Hs.src,
  tokens: Hs.t,
  SEMVER_SPEC_VERSION: Vc.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Vc.RELEASE_TYPES,
  compareIdentifiers: Fc.compareIdentifiers,
  rcompareIdentifiers: Fc.rcompareIdentifiers
};
const $r = /* @__PURE__ */ Yc(j1), k1 = Object.prototype.toString, A1 = "[object Uint8Array]", C1 = "[object ArrayBuffer]";
function Wu(e, t, r) {
  return e ? e.constructor === t ? !0 : k1.call(e) === r : !1;
}
function Xu(e) {
  return Wu(e, Uint8Array, A1);
}
function D1(e) {
  return Wu(e, ArrayBuffer, C1);
}
function M1(e) {
  return Xu(e) || D1(e);
}
function L1(e) {
  if (!Xu(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function V1(e) {
  if (!M1(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Ws(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((s, a) => s + a.length, 0));
  const r = new Uint8Array(t);
  let n = 0;
  for (const s of e)
    L1(s), r.set(s, n), n += s.length;
  return r;
}
const An = {
  utf8: new globalThis.TextDecoder("utf8")
};
function Cn(e, t = "utf8") {
  return V1(e), An[t] ?? (An[t] = new globalThis.TextDecoder(t)), An[t].decode(e);
}
function F1(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const z1 = new globalThis.TextEncoder();
function Dn(e) {
  return F1(e), z1.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Xs = "aes-256-cbc", Nt = () => /* @__PURE__ */ Object.create(null), zc = (e) => e !== void 0, Js = (e, t) => {
  const r = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), n = typeof t;
  if (r.has(n))
    throw new TypeError(`Setting a value of type \`${n}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Ot = "__internal__", Bs = `${Ot}.migrations.version`;
var Tt, Be, Ae, Ue, ar, or, Sr, st, ge, Ju, Bu, Yu, Qu, Zu, xu, ed, td;
class U1 {
  constructor(t = {}) {
    rt(this, ge);
    zr(this, "path");
    zr(this, "events");
    rt(this, Tt);
    rt(this, Be);
    rt(this, Ae);
    rt(this, Ue, {});
    rt(this, ar, !1);
    rt(this, or);
    rt(this, Sr);
    rt(this, st);
    zr(this, "_deserialize", (t) => JSON.parse(t));
    zr(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const r = dt(this, ge, Ju).call(this, t);
    Ve(this, Ae, r), dt(this, ge, Bu).call(this, r), dt(this, ge, Qu).call(this, r), dt(this, ge, Zu).call(this, r), this.events = new EventTarget(), Ve(this, Be, r.encryptionKey), this.path = dt(this, ge, xu).call(this, r), dt(this, ge, ed).call(this, r), r.watch && this._watch();
  }
  get(t, r) {
    if (B(this, Ae).accessPropertiesByDotNotation)
      return this._get(t, r);
    const { store: n } = this;
    return t in n ? n[t] : r;
  }
  set(t, r) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && r === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Ot} key, as it's used to manage this module internal operations.`);
    const { store: n } = this, s = (a, o) => {
      if (Js(a, o), B(this, Ae).accessPropertiesByDotNotation)
        pn(n, a, o);
      else {
        if (a === "__proto__" || a === "constructor" || a === "prototype")
          return;
        n[a] = o;
      }
    };
    if (typeof t == "object") {
      const a = t;
      for (const [o, l] of Object.entries(a))
        s(o, l);
    } else
      s(t, r);
    this.store = n;
  }
  has(t) {
    return B(this, Ae).accessPropertiesByDotNotation ? Rs(this.store, t) : t in this.store;
  }
  appendToArray(t, r) {
    Js(t, r);
    const n = B(this, Ae).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(n))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...n, r]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const r of t)
      zc(B(this, Ue)[r]) && this.set(r, B(this, Ue)[r]);
  }
  delete(t) {
    const { store: r } = this;
    B(this, Ae).accessPropertiesByDotNotation ? ud(r, t) : delete r[t], this.store = r;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Nt();
    for (const r of Object.keys(B(this, Ue)))
      zc(B(this, Ue)[r]) && (Js(r, B(this, Ue)[r]), B(this, Ae).accessPropertiesByDotNotation ? pn(t, r, B(this, Ue)[r]) : t[r] = B(this, Ue)[r]);
    this.store = t;
  }
  onDidChange(t, r) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof r != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof r}`);
    return this._handleValueChange(() => this.get(t), r);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((r) => !this._isReservedKeyPath(r)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const r = Y.readFileSync(this.path, B(this, Be) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
      return B(this, ar) || this._validate(s), Object.assign(Nt(), s);
    } catch (r) {
      if ((r == null ? void 0 : r.code) === "ENOENT")
        return this._ensureDirectory(), Nt();
      if (B(this, Ae).clearInvalidConfig) {
        const n = r;
        if (n.name === "SyntaxError" || (t = n.message) != null && t.startsWith("Config schema violation:"))
          return Nt();
      }
      throw r;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Rs(t, Ot))
      try {
        const r = Y.readFileSync(this.path, B(this, Be) ? null : "utf8"), n = this._decryptData(r), s = this._deserialize(n);
        Rs(s, Ot) && pn(t, Ot, gi(s, Ot));
      } catch {
      }
    B(this, ar) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, r] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, r]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    B(this, or) && (B(this, or).close(), Ve(this, or, void 0)), B(this, Sr) && (Y.unwatchFile(this.path), Ve(this, Sr, !1)), Ve(this, st, void 0);
  }
  _decryptData(t) {
    if (!B(this, Be))
      return typeof t == "string" ? t : Cn(t);
    try {
      const r = t.slice(0, 16), n = Bt.pbkdf2Sync(B(this, Be), r, 1e4, 32, "sha512"), s = Bt.createDecipheriv(Xs, n, r), a = t.slice(17), o = typeof a == "string" ? Dn(a) : a;
      return Cn(Ws([s.update(o), s.final()]));
    } catch {
      try {
        const r = t.slice(0, 16), n = Bt.pbkdf2Sync(B(this, Be), r.toString(), 1e4, 32, "sha512"), s = Bt.createDecipheriv(Xs, n, r), a = t.slice(17), o = typeof a == "string" ? Dn(a) : a;
        return Cn(Ws([s.update(o), s.final()]));
      } catch {
      }
    }
    return typeof t == "string" ? t : Cn(t);
  }
  _handleStoreChange(t) {
    let r = this.store;
    const n = () => {
      const s = r, a = this.store;
      yi(a, s) || (r = a, t.call(this, a, s));
    };
    return this.events.addEventListener("change", n), () => {
      this.events.removeEventListener("change", n);
    };
  }
  _handleValueChange(t, r) {
    let n = t();
    const s = () => {
      const a = n, o = t();
      yi(o, a) || (n = o, r.call(this, o, a));
    };
    return this.events.addEventListener("change", s), () => {
      this.events.removeEventListener("change", s);
    };
  }
  _validate(t) {
    if (!B(this, Tt) || B(this, Tt).call(this, t) || !B(this, Tt).errors)
      return;
    const n = B(this, Tt).errors.map(({ instancePath: s, message: a = "" }) => `\`${s.slice(1)}\` ${a}`);
    throw new Error("Config schema violation: " + n.join("; "));
  }
  _ensureDirectory() {
    Y.mkdirSync(ae.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let r = this._serialize(t);
    if (B(this, Be)) {
      const n = Bt.randomBytes(16), s = Bt.pbkdf2Sync(B(this, Be), n, 1e4, 32, "sha512"), a = Bt.createCipheriv(Xs, s, n);
      r = Ws([n, Dn(":"), a.update(Dn(r)), a.final()]);
    }
    if (pe.env.SNAP)
      Y.writeFileSync(this.path, r, { mode: B(this, Ae).configFileMode });
    else
      try {
        Bc(this.path, r, { mode: B(this, Ae).configFileMode });
      } catch (n) {
        if ((n == null ? void 0 : n.code) === "EXDEV") {
          Y.writeFileSync(this.path, r, { mode: B(this, Ae).configFileMode });
          return;
        }
        throw n;
      }
  }
  _watch() {
    if (this._ensureDirectory(), Y.existsSync(this.path) || this._write(Nt()), pe.platform === "win32" || pe.platform === "darwin") {
      B(this, st) ?? Ve(this, st, vc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = ae.dirname(this.path), r = ae.basename(this.path);
      Ve(this, or, Y.watch(t, { persistent: !1, encoding: "utf8" }, (n, s) => {
        s && s !== r || typeof B(this, st) == "function" && B(this, st).call(this);
      }));
    } else
      B(this, st) ?? Ve(this, st, vc(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), Y.watchFile(this.path, { persistent: !1 }, (t, r) => {
        typeof B(this, st) == "function" && B(this, st).call(this);
      }), Ve(this, Sr, !0);
  }
  _migrate(t, r, n) {
    let s = this._get(Bs, "0.0.0");
    const a = Object.keys(t).filter((l) => this._shouldPerformMigration(l, s, r));
    let o = structuredClone(this.store);
    for (const l of a)
      try {
        n && n(this, {
          fromVersion: s,
          toVersion: l,
          finalVersion: r,
          versions: a
        });
        const c = t[l];
        c == null || c(this), this._set(Bs, l), s = l, o = structuredClone(this.store);
      } catch (c) {
        this.store = o;
        try {
          this._write(o);
        } catch {
        }
        const d = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${d}`);
      }
    (this._isVersionInRangeFormat(s) || !$r.eq(s, r)) && this._set(Bs, r);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [r, n] of Object.entries(t))
      if (this._isReservedKeyPath(r) || this._objectContainsReservedKey(n))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Ot || t.startsWith(`${Ot}.`);
  }
  _isVersionInRangeFormat(t) {
    return $r.clean(t) === null;
  }
  _shouldPerformMigration(t, r, n) {
    return this._isVersionInRangeFormat(t) ? r !== "0.0.0" && $r.satisfies(r, t) ? !1 : $r.satisfies(n, t) : !($r.lte(t, r) || $r.gt(t, n));
  }
  _get(t, r) {
    return gi(this.store, t, r);
  }
  _set(t, r) {
    const { store: n } = this;
    pn(n, t, r), this.store = n;
  }
}
Tt = new WeakMap(), Be = new WeakMap(), Ae = new WeakMap(), Ue = new WeakMap(), ar = new WeakMap(), or = new WeakMap(), Sr = new WeakMap(), st = new WeakMap(), ge = new WeakSet(), Ju = function(t) {
  const r = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (!r.cwd) {
    if (!r.projectName)
      throw new Error("Please specify the `projectName` option.");
    r.cwd = md(r.projectName, { suffix: r.projectSuffix }).config;
  }
  return typeof r.fileExtension == "string" && (r.fileExtension = r.fileExtension.replace(/^\.+/, "")), r;
}, Bu = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const r = jw.default, n = new _0.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  r(n);
  const s = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  Ve(this, Tt, n.compile(s)), dt(this, ge, Yu).call(this, t.schema);
}, Yu = function(t) {
  const r = Object.entries(t ?? {});
  for (const [n, s] of r) {
    if (!s || typeof s != "object" || !Object.hasOwn(s, "default"))
      continue;
    const { default: a } = s;
    a !== void 0 && (B(this, Ue)[n] = a);
  }
}, Qu = function(t) {
  t.defaults && Object.assign(B(this, Ue), t.defaults);
}, Zu = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, xu = function(t) {
  const r = typeof t.fileExtension == "string" ? t.fileExtension : void 0, n = r ? `.${r}` : "";
  return ae.resolve(t.cwd, `${t.configName ?? "config"}${n}`);
}, ed = function(t) {
  if (t.migrations) {
    dt(this, ge, td).call(this, t), this._validate(this.store);
    return;
  }
  const r = this.store, n = Object.assign(Nt(), t.defaults ?? {}, r);
  this._validate(n);
  try {
    _i.deepEqual(r, n);
  } catch {
    this.store = n;
  }
}, td = function(t) {
  const { migrations: r, projectVersion: n } = t;
  if (r) {
    if (!n)
      throw new Error("Please specify the `projectVersion` option.");
    Ve(this, ar, !0);
    try {
      const s = this.store, a = Object.assign(Nt(), t.defaults ?? {}, s);
      try {
        _i.deepEqual(s, a);
      } catch {
        this._write(a);
      }
      this._migrate(r, n, t.beforeEachMigration);
    } finally {
      Ve(this, ar, !1);
    }
  }
};
const { app: Hn, ipcMain: ma, shell: q1 } = Gc;
let Uc = !1;
const qc = () => {
  if (!ma || !Hn)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Hn.getPath("userData"),
    appVersion: Hn.getVersion()
  };
  return Uc || (ma.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Uc = !0), e;
};
class K1 extends U1 {
  constructor(t) {
    let r, n;
    if (pe.type === "renderer") {
      const s = Gc.ipcRenderer.sendSync("electron-store-get-data");
      if (!s)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: r, appVersion: n } = s);
    } else ma && Hn && ({ defaultCwd: r, appVersion: n } = qc());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = n), t.cwd ? t.cwd = ae.isAbsolute(t.cwd) ? t.cwd : ae.join(r, t.cwd) : t.cwd = r, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    qc();
  }
  async openInEditor() {
    const t = await q1.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const G1 = od(import.meta.url), Kc = id(G1), dr = new K1();
function H1() {
  new ad({
    width: 1e3,
    height: 700,
    webPreferences: {
      preload: $i(Kc, "preload.js")
      // Carga el bridge seguro
    }
  }).loadFile($i(Kc, "../dist-renderer/index.html"));
}
ns.on("save-note", (e, t) => {
  if (!t || !t.id || !t.title) return;
  const n = (dr.get("notes") || []).filter((s) => s && s.id);
  dr.set("notes", [...n, t]), console.log(" 👍 Nota guardada:", t);
});
ns.on("edit-note", (e, t) => {
  const s = (dr.get("notes") || []).filter((a) => a && a.id).map(
    (a) => a.id === t.id ? t : a
  );
  dr.set("notes", s), console.log("✏️ Nota actualizada:", t);
});
ns.on("delete-note", (e, t) => {
  const n = (dr.get("notes") || []).filter((s) => s && s.id !== t);
  dr.set("notes", n), console.log("🗑️ Nota eliminada:", t);
});
ns.handle("load-notes", () => {
  const e = dr.get("notes"), t = Array.isArray(e) ? e.filter((r) => r && r.id && r.content) : [];
  return console.log("📥 Notas cargadas:", t.length), t;
});
sd.whenReady().then(H1);
