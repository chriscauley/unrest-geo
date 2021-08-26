"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(bool, e) {
  if (!bool) {
    if (typeof e === 'function') {
      e = e();
    }

    if (typeof e === 'string') {
      e = Error(e);
    }

    throw e;
  }
};

exports["default"] = _default;