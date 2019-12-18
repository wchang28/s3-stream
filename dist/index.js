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
var io_stream_templates_1 = require("io-stream-templates");
var Get = /** @class */ (function (_super) {
    __extends(Get, _super);
    function Get(s3, params) {
        return _super.call(this, function () {
            var req = s3.getObject(params);
            return req.createReadStream();
        }) || this;
    }
    return Get;
}(io_stream_templates_1.ReadableTemplate));
exports.Get = Get;
var Put = /** @class */ (function (_super) {
    __extends(Put, _super);
    function Put(s3, params) {
        var _this = _super.call(this, function () {
            var pt = new stream_1.PassThrough();
            params.Body = pt;
            s3.upload(params, function (err, data) {
                _this.emit("upload-complete", err, data);
                if (err) {
                    _this.emit("error", err);
                }
            });
            return pt;
        }) || this;
        return _this;
    }
    return Put;
}(io_stream_templates_1.WritableTemplate));
exports.Put = Put;
//# sourceMappingURL=index.js.map