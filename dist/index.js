"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var PutStream = /** @class */ (function (_super) {
    __extends(PutStream, _super);
    function PutStream(s3, params) {
        var _this = _super.call(this) || this;
        _this._pt = new stream_1.PassThrough();
        _this._pt.on("error", function (err) {
            _this.emit("error", err);
        });
        params.Body = _this._pt;
        s3.upload(params, function (err, data) {
            _this.emit("upload-complete", err, data);
            if (err) {
                _this.emit("error", err);
            }
        });
        _this.on("finish", function () {
            // end() was called on this object
            _this._pt.end(); // end the write side of PassThrough, which will trigger the 'end' event on the read side of PassThrough
        });
        return _this;
    }
    PutStream.prototype._write = function (chunk, encoding, callback) {
        this._pt.write(chunk, encoding, callback);
    };
    return PutStream;
}(stream_1.Writable));
exports.PutStream = PutStream;
var GetStream = /** @class */ (function (_super) {
    __extends(GetStream, _super);
    function GetStream(s3, params) {
        var _this = _super.call(this) || this;
        var req = s3.getObject(params);
        _this._readable = req.createReadStream();
        _this._readable.on("data", function (chunk) {
            if (!_this.push(chunk)) {
                _this._readable.pause();
            }
        }).on("end", function () {
            _this.push(null);
        }).on("error", function (err) {
            _this.emit("error", err);
        });
        return _this;
    }
    GetStream.prototype._read = function (size) {
        this._readable.resume();
    };
    return GetStream;
}(stream_1.Readable));
exports.GetStream = GetStream;
//# sourceMappingURL=index.js.map