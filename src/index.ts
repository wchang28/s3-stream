import {Readable, PassThrough, Writable} from "stream";
import {S3} from "aws-sdk";

export class PutStream extends Writable {
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

export class GetStream extends Readable {
    private _readable: Readable;
    constructor(s3: S3, params: S3.GetObjectRequest) {
        super();
        const req = s3.getObject(params);
        this._readable = req.createReadStream();
        this._readable.on("data", (chunk) => {
            if (!this.push(chunk)) {
                this._readable.pause();
            }
        }).on("end", () => {
            this.push(null);
        }).on("error", (err) => {
            this.emit("error", err);
        });
    }
    _read(size: number) {
        this._readable.resume();
    }
}
