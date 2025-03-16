"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  getHandler: () => getHandler,
  getVersion: () => getVersion,
  proxy: () => proxy,
  proxyWithComputed: () => proxyWithComputed,
  ref: () => ref,
  snapshot: () => snapshot,
  subscribe: () => subscribe
});
module.exports = __toCommonJS(src_exports);
var import_proxy_compare = require("proxy-compare");
var __DEV__ = process.env.NODE_ENV !== "production";
var VERSION = Symbol();
var LISTENERS = Symbol();
var SNAPSHOT = Symbol();
var HANDLER = Symbol();
var PROMISE_RESULT = Symbol();
var PROMISE_ERROR = Symbol();
var refSet = /* @__PURE__ */ new WeakSet();
function ref(o) {
  refSet.add(o);
  return o;
}
var isObject = (x) => typeof x === "object" && x !== null;
var canProxy = (x) => isObject(x) && !refSet.has(x) && (Array.isArray(x) || !(Symbol.iterator in x)) && !(x instanceof WeakMap) && !(x instanceof WeakSet) && !(x instanceof Error) && !(x instanceof Number) && !(x instanceof Date) && !(x instanceof String) && !(x instanceof RegExp) && !(x instanceof ArrayBuffer);
var proxyCache = /* @__PURE__ */ new WeakMap();
var globalVersion = 1;
var snapshotCache = /* @__PURE__ */ new WeakMap();
function proxy(initialObject = {}) {
  if (!isObject(initialObject)) {
    throw new Error("object required");
  }
  const found = proxyCache.get(initialObject);
  if (found) {
    return found;
  }
  let version = globalVersion;
  const listeners = /* @__PURE__ */ new Set();
  const notifyUpdate = (op, nextVersion = ++globalVersion) => {
    if (version !== nextVersion) {
      version = nextVersion;
      listeners.forEach((listener) => listener(op, nextVersion));
    }
  };
  const propListeners = /* @__PURE__ */ new Map();
  const getPropListener = (prop) => {
    let propListener = propListeners.get(prop);
    if (!propListener) {
      propListener = (op, nextVersion) => {
        const newOp = [...op];
        newOp[1] = [prop, ...newOp[1]];
        notifyUpdate(newOp, nextVersion);
      };
      propListeners.set(prop, propListener);
    }
    return propListener;
  };
  const popPropListener = (prop) => {
    const propListener = propListeners.get(prop);
    propListeners.delete(prop);
    return propListener;
  };
  const createSnapshot = (target, receiver) => {
    const cache = snapshotCache.get(receiver);
    if ((cache == null ? void 0 : cache[0]) === version) {
      return cache[1];
    }
    const snapshot2 = Array.isArray(target) ? [] : Object.create(Object.getPrototypeOf(target));
    (0, import_proxy_compare.markToTrack)(snapshot2, true);
    snapshotCache.set(receiver, [version, snapshot2]);
    Reflect.ownKeys(target).forEach((key) => {
      const value = Reflect.get(target, key, receiver);
      if (refSet.has(value)) {
        (0, import_proxy_compare.markToTrack)(value, false);
        snapshot2[key] = value;
      } else if (value instanceof Promise) {
        if (PROMISE_RESULT in value) {
          snapshot2[key] = value[PROMISE_RESULT];
        } else {
          const errorOrPromise = value[PROMISE_ERROR] || value;
          Object.defineProperty(snapshot2, key, {
            get() {
              if (PROMISE_RESULT in value) {
                return value[PROMISE_RESULT];
              }
              throw errorOrPromise;
            }
          });
        }
      } else if (value == null ? void 0 : value[LISTENERS]) {
        snapshot2[key] = value[SNAPSHOT];
      } else {
        snapshot2[key] = value;
      }
    });
    Object.freeze(snapshot2);
    return snapshot2;
  };
  const baseObject = Array.isArray(initialObject) ? [] : Object.create(Object.getPrototypeOf(initialObject));
  const handler = {
    get(target, prop, receiver) {
      if (prop === VERSION) {
        return version;
      }
      if (prop === LISTENERS) {
        return listeners;
      }
      if (prop === SNAPSHOT) {
        return createSnapshot(target, receiver);
      }
      if (prop === HANDLER) {
        return handler;
      }
      return Reflect.get(target, prop, receiver);
    },
    deleteProperty(target, prop) {
      const prevValue = Reflect.get(target, prop);
      const childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];
      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }
      const deleted = Reflect.deleteProperty(target, prop);
      if (deleted) {
        notifyUpdate(["delete", [prop], prevValue]);
      }
      return deleted;
    },
    is: Object.is,
    canProxy,
    set(target, prop, value, receiver) {
      var _a;
      const hasPrevValue = Reflect.has(target, prop);
      const prevValue = Reflect.get(target, prop, receiver);
      if (hasPrevValue && this.is(prevValue, value)) {
        return true;
      }
      const childListeners = prevValue == null ? void 0 : prevValue[LISTENERS];
      if (childListeners) {
        childListeners.delete(popPropListener(prop));
      }
      if (isObject(value)) {
        value = (0, import_proxy_compare.getUntracked)(value) || value;
      }
      let nextValue;
      if ((_a = Object.getOwnPropertyDescriptor(target, prop)) == null ? void 0 : _a.set) {
        nextValue = value;
      } else if (value instanceof Promise) {
        nextValue = value.then((v) => {
          nextValue[PROMISE_RESULT] = v;
          notifyUpdate(["resolve", [prop], v]);
          return v;
        }).catch((e) => {
          nextValue[PROMISE_ERROR] = e;
          notifyUpdate(["reject", [prop], e]);
        });
      } else if (value == null ? void 0 : value[LISTENERS]) {
        nextValue = value;
        nextValue[LISTENERS].add(getPropListener(prop));
      } else if (this.canProxy(value)) {
        nextValue = proxy(value);
        nextValue[LISTENERS].add(getPropListener(prop));
      } else {
        nextValue = value;
      }
      Reflect.set(target, prop, nextValue, receiver);
      notifyUpdate(["set", [prop], value, prevValue]);
      return true;
    }
  };
  const proxyObject = new Proxy(baseObject, handler);
  proxyCache.set(initialObject, proxyObject);
  Reflect.ownKeys(initialObject).forEach((key) => {
    const desc = Object.getOwnPropertyDescriptor(initialObject, key);
    if (desc.get || desc.set) {
      Object.defineProperty(baseObject, key, desc);
    } else {
      proxyObject[key] = initialObject[key];
    }
  });
  return proxyObject;
}
function getVersion(proxyObject) {
  return isObject(proxyObject) ? proxyObject[VERSION] : void 0;
}
function subscribe(proxyObject, callback, notifyInSync) {
  if (__DEV__ && !(proxyObject == null ? void 0 : proxyObject[LISTENERS])) {
    console.warn("Please use proxy object");
  }
  let promise;
  const ops = [];
  const listener = (op) => {
    ops.push(op);
    if (notifyInSync) {
      callback(ops.splice(0));
      return;
    }
    if (!promise) {
      promise = Promise.resolve().then(() => {
        promise = void 0;
        callback(ops.splice(0));
      });
    }
  };
  proxyObject[LISTENERS].add(listener);
  return () => {
    ;
    proxyObject[LISTENERS].delete(listener);
  };
}
function snapshot(proxyObject) {
  if (__DEV__ && !(proxyObject == null ? void 0 : proxyObject[SNAPSHOT])) {
    console.warn("Please use proxy object");
  }
  return proxyObject[SNAPSHOT];
}
function getHandler(proxyObject) {
  if (__DEV__ && !(proxyObject == null ? void 0 : proxyObject[HANDLER])) {
    console.warn("Please use proxy object");
  }
  return proxyObject[HANDLER];
}
function proxyWithComputed(initialObject, computedFns) {
  ;
  Object.keys(computedFns).forEach((key) => {
    if (Object.getOwnPropertyDescriptor(initialObject, key)) {
      throw new Error("object property already defined");
    }
    const computedFn = computedFns[key];
    const { get, set } = typeof computedFn === "function" ? { get: computedFn } : computedFn;
    const desc = {};
    desc.get = () => get(snapshot(proxyObject));
    if (set) {
      desc.set = (newValue) => set(proxyObject, newValue);
    }
    Object.defineProperty(initialObject, key, desc);
  });
  const proxyObject = proxy(initialObject);
  return proxyObject;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getHandler,
  getVersion,
  proxy,
  proxyWithComputed,
  ref,
  snapshot,
  subscribe
});
