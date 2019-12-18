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
