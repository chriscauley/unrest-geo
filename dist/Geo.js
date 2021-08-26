"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mod = _interopRequireDefault(require("./mod"));

var _Look = _interopRequireDefault(require("./Look"));

var _range = _interopRequireDefault(require("./range"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var geo_cache = {};
var DINDEX_NAMES = ['u', 'l', 'r', 'd'];
var DINDEX_CHARS = ['⇧', '⇦', '⇨', '⇩'];

var Geo = /*#__PURE__*/function () {
  function Geo(W, H) {
    var _this = this;

    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$x = _ref.x0,
        x0 = _ref$x === void 0 ? 0 : _ref$x,
        _ref$y = _ref.y0,
        y0 = _ref$y === void 0 ? 0 : _ref$y;

    _classCallCheck(this, Geo);

    _defineProperty(this, "index2xy", function (i) {
      return [(0, _mod["default"])(i, _this.W), Math.floor(i / _this.W)];
    });

    _defineProperty(this, "xy2index", function (xy) {
      return (0, _mod["default"])(xy[0] + xy[1] * _this.W, _this.AREA);
    });

    _defineProperty(this, "dxy2dindex", function (dxy) {
      return dxy[0] + dxy[1] * _this.W;
    });

    var x_max = W + x0 - 1;
    var y_max = H + y0 - 1;
    var AREA = W * H; // constants

    Object.assign(this, {
      x0: x0,
      y0: y0,
      W: W,
      H: H,
      x_max: x_max,
      y_max: y_max,
      AREA: AREA
    });
    this.doCache();
    this.look = (0, _Look["default"])(this);
  }

  _createClass(Geo, [{
    key: "doCache",
    value: function doCache() {
      var _rot_dindexes,
          _this2 = this;

      var W = this.W,
          H = this.H,
          x0 = this.x0,
          x_max = this.x_max,
          y0 = this.y0,
          y_max = this.y_max;
      var xs = (0, _range["default"])(W);
      var ys = (0, _range["default"])(H); // cache tables

      Object.assign(this, {
        indexes: [],
        _dindex2char: {},
        _name2dindex: {},
        _dindex2name: {},
        dindexes: [-W, -1, 1, W],
        // u, l, r, d
        rot_dindexes: (_rot_dindexes = {}, _defineProperty(_rot_dindexes, -W, [-W, -1, 1, W]), _defineProperty(_rot_dindexes, W, [W, 1, -1, -W]), _defineProperty(_rot_dindexes, 1, [1, -W, W, -1]), _defineProperty(_rot_dindexes, -1, [-1, W, -W, 1]), _rot_dindexes),
        _indexes_by_y: ys.map(function (y) {
          return xs.map(function (x) {
            return _this2.xy2index([x, y]);
          });
        }),
        _indexes_by_x: xs.map(function (x) {
          return ys.map(function (y) {
            return _this2.xy2index([x, y]);
          });
        })
      });
      this.dindexes.forEach(function (dindex, i) {
        var name = DINDEX_NAMES[i];
        _this2._dindex2name[dindex] = name;
        _this2._name2dindex[name] = dindex;
        _this2._dindex2char[dindex] = DINDEX_CHARS[i];
      });
      this.CENTER = this.xy2index([Math.floor((this.x0 + this.W) / 2), Math.floor((this.y0 + this.H) / 2)]);
      (0, _range["default"])(y0, y_max + 1).forEach(function (y) {
        return (0, _range["default"])(x0, x_max + 1).forEach(function (x) {
          return _this2.indexes.push(_this2.xy2index([x, y]));
        });
      });
    }
  }, {
    key: "getRowIndexes",
    value: function getRowIndexes(y) {
      return this._indexes_by_y[y];
    }
  }, {
    key: "getColumnIndexes",
    value: function getColumnIndexes(x) {
      return this._indexes_by_x[x];
    }
  }, {
    key: "print",
    value: function print(board) {
      var _this3 = this;

      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var _options$from_xy = options.from_xy,
          from_xy = _options$from_xy === void 0 ? [this.x0, this.y0] : _options$from_xy,
          _options$to_xy = options.to_xy,
          to_xy = _options$to_xy === void 0 ? [this.x0 + this.W - 1, this.y0 + this.H - 1] : _options$to_xy,
          _options$delimiter = options.delimiter,
          delimiter = _options$delimiter === void 0 ? '' : _options$delimiter,
          _options$empty = options.empty,
          empty = _options$empty === void 0 ? ' ' : _options$empty,
          extras = options.extras,
          title = options.title;
      var xs = (0, _range["default"])(from_xy[0], to_xy[0] + 1);
      var ys = (0, _range["default"])(from_xy[1], to_xy[1] + 1);
      var lines = ys.map(function (y) {
        return xs.map(function (x) {
          return board[_this3.xy2index([x, y])];
        }).map(function (s) {
          return s === undefined ? empty : s;
        }).join(delimiter);
      });

      if (extras) {
        extras.forEach(function (e, i) {
          return lines[i] += '\t' + e;
        });
      }

      title && lines.unshift(title);
      return lines.join('\n');
    }
  }, {
    key: "inBounds",
    value: function inBounds(xy) {
      return xy[0] >= this.x0 && xy[0] < this.x0 + this.W && xy[1] >= this.y0 && xy[1] < this.y0 + this.H;
    }
  }, {
    key: "slice",
    value: function slice(xy, W, H) {
      var _this4 = this;

      var out = [];
      var ys = (0, _range["default"])(xy[1], xy[1] + H);
      var xs = (0, _range["default"])(xy[0], xy[0] + W);
      ys.forEach(function (y) {
        return xs.forEach(function (x) {
          return out.push(_this4.xy2index([x, y]));
        });
      });
      return out;
    }
  }, {
    key: "floorDindex",
    value: function floorDindex(dindex) {
      // if dindex is a multiple of W it is in thy y direction
      // otherwise it is in the x direction
      return (dindex % this.W === 0 ? this.W : 1) * Math.sign(dindex);
    }
  }]);

  return Geo;
}();

var _default = function _default(x0, x_max, y0, y_max) {
  // since geo's are meant to be deterministic with the above parameters they can be cached
  var key = "".concat(x0, ",").concat(x_max, ",").concat(y0, ",").concat(y_max);
  geo_cache[key] = geo_cache[key] || new Geo(x0, x_max, y0, y_max);
  return geo_cache[key];
};

exports["default"] = _default;