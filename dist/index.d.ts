import { ReadableTemplate, IOTemplate } from "io-stream-templates";
import { S3 } from "aws-sdk";
export declare class Get extends ReadableTemplate {
    constructor(s3: S3, params: S3.GetObjectRequest);
}
export declare class Put extends IOTemplate {
    constructor(s3: S3, params: S3.PutObjectRequest);
}
