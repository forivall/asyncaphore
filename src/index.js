/*
 * Simple async block / semaphore mechanism, calls callback when # of release
 * calls === # of retain calls
 */

export default function (cb) {
  let _pending = 0;
  let _finished = 0;
  let _err;
  return {
    _getPending() { return _pending; },
    // get _err() { return _err; },
    retain() {
      if (_err) return;
      _pending++;
    },
    release() {
      if (_err) return;
      _pending--;
      if (_pending === 0) {
        // TODO: wait for nextTick & re-check
        _finished++;
        cb(null, _finished);
      } else if (_pending < 0) {
        throw new Error('retain/release mismatch');
      }
    },
    error(err) {
      _err = err;
      cb(err);
    },
  };
}
