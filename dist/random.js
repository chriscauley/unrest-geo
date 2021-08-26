"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _xorshift = _interopRequireDefault(require("xorshift"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rand = function rand(seed) {
  var r = _xorshift["default"].constructor([seed, seed, seed, seed]);

  r.randomint(); // first number isn't very random for low s

  return r.randomint()[1];
};

rand.choice = function (seed, array) {
  return array[rand(seed) % array.length];
};

rand["int"] = function (seed, min, max) {
  if (max === undefined) {
    max = min;
    min = 0;
  }

  var range = max - min;
  return min + rand(seed) % range;
};

var _default = rand;
exports["default"] = _default;