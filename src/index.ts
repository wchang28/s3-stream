import {PassThrough} from "stream";
import {ReadableTemplate, WritableTemplate} from "io-stream-templates";
import {S3} from "aws-sdk";

export class Get extends ReadableTemplate {
    constructor(s3: S3, params: S3.GetObjectRequest) {
        super(() => {
            const req = s3.getObject(params);
            return req.createReadStream();
        });
    }
}

export class Put extends WritableTemplate {
    constructor(s3: S3, params: S3.PutObjectRequest) {
        super(() => {
            const pt = new PassThrough();
            params.Body = pt;
            s3.upload(params, (err: any, data: S3.ManagedUpload.SendData) => {
                this.emit("upload-complete", err, data);
                if (err) {
                    this.emit("error", err);
                }
            });
            return pt;
        });
    }
}

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