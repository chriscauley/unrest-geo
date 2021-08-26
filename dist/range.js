"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = baseRange;
// adapted from lodash
var step = 1;

function baseRange(start, end) {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  var index = -1;
  var length = Math.max(Math.ceil((end - start) / step), 0);
  var result = new Array(length);

  while (length--) {
    result[++index] = start;
    start += step;
  }

  return result;
}