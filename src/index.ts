import {PassThrough} from "stream";
import {ReadableTemplate, IOTemplate} from "io-stream-templates";
import {S3} from "aws-sdk";

export class Get extends ReadableTemplate {
    constructor(s3: S3, params: S3.GetObjectRequest) {
        super(() => {
            const req = s3.getObject(params);
            return req.createReadStream();
        });
    }
}

export class Put extends IOTemplate {
    constructor(s3: S3, params: S3.PutObjectRequest) {
        super(() => {
            const ptBody = new PassThrough();
            const ptResponse = new PassThrough();
            params.Body = ptBody;
            s3.upload(params, (err, data) => {
                if (err) {
                    ptResponse.emit("error", err);
                } else {
                    ptResponse.end(JSON.stringify(data));
                }
            });
            return {writable: ptBody, readable: ptResponse};
        });
    }
}
