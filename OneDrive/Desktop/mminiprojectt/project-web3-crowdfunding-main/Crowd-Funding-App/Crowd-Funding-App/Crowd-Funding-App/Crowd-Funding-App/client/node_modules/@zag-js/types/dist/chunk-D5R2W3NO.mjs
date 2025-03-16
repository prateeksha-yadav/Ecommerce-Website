// src/prop-types.ts
function createNormalizer(fn) {
  return new Proxy({}, {
    get() {
      return fn;
    }
  });
}

export {
  createNormalizer
};
