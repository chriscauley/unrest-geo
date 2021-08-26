"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _assert = _interopRequireDefault(require("./assert"));

var _range = _interopRequireDefault(require("./range"));

var _Shapes = _interopRequireDefault(require("./Shapes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _default = function _default(geo) {
  var shapes = (0, _Shapes["default"])(geo);

  var make = function make(shape, dist) {
    var R = 1;

    if (look[shape][R][dist]) {
      return;
    }

    if (dist > 0 && !look[shape][R][dist - 1]) {
      make(shape, dist - 1);
    }

    if (shape.startsWith('__')) {
      // dunder means "outer shell of look"
      geo.dindexes.forEach(function (dindex) {
        look[shape][dindex][dist] = shapes[shape.slice(2)](dist, dindex);
      });
    } else {
      if (!look['__' + shape][R][dist]) {
        // need outer shells to make filled looks
        make('__' + shape, dist);
      }

      geo.dindexes.forEach(function (dindex) {
        look[shape][dindex][dist] = [];
        (0, _range["default"])(dist + 1).forEach(function (_dist) {
          look[shape][dindex][dist] = look[shape][dindex][dist].concat(look['__' + shape][dindex][_dist]);
        });
      });
    }
  };

  var look = function look(shape, index, dist, dindex) {
    // TODO are these string interpolations a performance issue?
    (0, _assert["default"])(look[shape][dindex], "Invalid dindex: ".concat(dindex));
    (0, _assert["default"])(Number.isInteger(dist), "Distance must be an integer not '".concat(_typeof(dist)));
    make(shape, dist); // idempotent

    return look[shape][dindex][dist].map(function (dindex) {
      return index + dindex;
    });
  };

  _Shapes["default"].list.forEach(function (shape) {
    look[shape] = {};
    geo.dindexes.forEach(function (dindex) {
      look[shape][dindex] = [[]]; // all geometries only see nothing at range 0
    });
    make(shape, 1);
  });

  return look;
};

exports["default"] = _default;