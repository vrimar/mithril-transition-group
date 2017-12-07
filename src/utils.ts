export function safeCall(func, attrs) {
  if (typeof (func) === 'function') {
    func(attrs);
  }
}
