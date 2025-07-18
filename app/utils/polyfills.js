// Polyfill for structuredClone
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = function(obj) {
    return JSON.parse(JSON.stringify(obj));
  };
}

export default {};
