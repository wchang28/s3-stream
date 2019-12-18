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
/*
export class Put extends Writable {
    private _pt: PassThrough;
    constructor(s3: S3, params: S3.PutObjectRequest) {
        super();
        this._pt = new PassThrough();
        this._pt.on("error", (err: any) => {
            this.emit("error", err);
        });
        params.Body = this._pt;
        s3.upload(params, (err: any, data: S3.ManagedUpload.SendData) => {
            this.emit("upload-complete", err, data);
            if (err) {
                this.emit("error", err);
            }
        });
        this.on("finish", () => {
            // end() was called on this object
            this._pt.end(); // end the write side of PassThrough, which will trigger the 'end' event on the read side of PassThrough
        });
    }
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void) {
        this._pt.write(chunk, encoding, callback);
    }
}
*/ 
//# sourceMappingURL=index.js.map