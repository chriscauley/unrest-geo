"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _range = _interopRequireDefault(require("./range"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Shapes = function Shapes(geo) {
  return {
    circle: function circle(dist, dindex) {
      var out = [];
      var o_dindex = geo.rot_dindexes[dindex][1];
      out.push(dindex * dist);
      (0, _range["default"])(1, dist + 1).forEach(function (i) {
        out.push(dindex * (dist - i) - o_dindex * i);
        out.push(dindex * (dist - i) + o_dindex * i);
      });
      (0, _range["default"])(1, dist).forEach(function (i) {
        out.push(-dindex * (dist - i) - o_dindex * i);
        out.push(-dindex * (dist - i) + o_dindex * i);
      });
      out.push(dindex * -dist);
      return out;
    },
    box: function box(dist, dindex) {
      var out = [];
      var o_dindex = geo.rot_dindexes[dindex][1]; // top row

      (0, _range["default"])(-dist, dist + 1).forEach(function (i) {
        return out.push(dist * dindex - i * o_dindex);
      }); // left and right sides in middle

      (0, _range["default"])(1, 2 * dist).forEach(function (i) {
        out.push((dist - i) * dindex + o_dindex * dist);
        out.push((dist - i) * dindex - o_dindex * dist);
      }); // bottom row

      (0, _range["default"])(-dist, dist + 1).forEach(function (i) {
        return out.push(-dist * dindex - i * o_dindex);
      });
      return out;
    },
    three: function three(dist, dindex) {
      var target = dist * dindex;
      var o_dindex = geo.rot_dindexes[dindex][1];
      return [target, target + o_dindex, target - o_dindex];
    },
    cone: function cone(dist, dindex) {
      var target = dist * dindex;
      var out = [target];
      var o_dindex = geo.rot_dindexes[dindex][1];
      (0, _range["default"])(1, dist).forEach(function (o_dist) {
        out.push(target + o_dist * o_dindex);
        out.push(target - o_dist * o_dindex);
      });
      return out;
    },
    f: function f(dist, dindex) {
      return [dist * dindex];
    },
    lr: function lr(dist, dindex) {
      var o_dindex = geo.rot_dindexes[dindex][1];
      return [o_dindex * dist, -o_dindex * dist];
    },
    cross: function cross(dist, dindex) {
      return geo.rot_dindexes[dindex].map(function (dindex2) {
        return dist * dindex2;
      });
    }
  };
};

Shapes.list = [];
Object.keys(Shapes()).forEach(function (shape) {
  Shapes.list.push('__' + shape);
  Shapes.list.push(shape);
});
var _default = Shapes;
exports["default"] = _default;