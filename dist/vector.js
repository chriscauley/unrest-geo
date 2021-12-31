"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ZERO = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// a collection of vector operations.
// # TODO AD after deploy comment out unused parts
var ZERO = [0, 0];
exports.ZERO = ZERO;

var add = function add(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      dx = _ref3[0],
      dy = _ref3[1];

  var _ref4 = _slicedToArray(_ref2, 2),
      dx2 = _ref4[0],
      dy2 = _ref4[1];

  return [dx + dx2, dy + dy2];
};

var subtract = function subtract(_ref5, _ref6) {
  var _ref7 = _slicedToArray(_ref5, 2),
      dx = _ref7[0],
      dy = _ref7[1];

  var _ref8 = _slicedToArray(_ref6, 2),
      dx2 = _ref8[0],
      dy2 = _ref8[1];

  return [dx - dx2, dy - dy2];
};

var magnitude = function magnitude(_ref9) {
  var _ref10 = _slicedToArray(_ref9, 2),
      dx = _ref10[0],
      dy = _ref10[1];

  return Math.abs(dx) + Math.abs(dy);
};

var sign = function sign(_ref11) {
  var _ref12 = _slicedToArray(_ref11, 2),
      dx = _ref12[0],
      dy = _ref12[1];

  return [Math.sign(dx), Math.sign(dy)];
}; // export const iterDifference = (dxy, dxy2) => {
//   const [dx, dy] = subtract(dxy, dxy2)
//   const [sx, sy] = sign([dx, dy])
//   const out = []
//   _.range(dx).forEach(() => out.push([sx, 0]))
//   _.range(dy).forEach(() => out.push([0, sy]))
//   return out
// }
// const splitDxy = ([dx, dy], range = 1) =>
//   _.flatten(
//     _.range(1, range + 1).map(i => [[dy * i, dx * i], [-dy * i, -dx * i]]),
//   )


var _default = {
  // isZero: ([dx, dy]) => !dx && !dy,
  times: function times(xy, num) {
    return [xy[0] * num, xy[1] * num];
  },
  // sum: dxys => dxys.reduce(add, [...ZERO]),
  // getDistance: (dxy1, dxy2) => magnitude(subtract(dxy1, dxy2)),
  // turn: ([dx, dy], dir) => [-dy * dir, dx * dir],
  // floor: dxy => [Math.floor(dxy[0]), Math.floor(dxy[1])],
  magnitude: magnitude,
  sign: sign,
  subtract: subtract,
  add: add // iterDifference,
  // splitDxy,

};
exports["default"] = _default;