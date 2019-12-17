/// <reference types="node" />
import { Readable, Writable } from "stream";
import { S3 } from "aws-sdk";
export declare class PutStream extends Writable {
    private _pt;
    constructor(s3: S3, params: S3.PutObjectRequest);
    _write(chunk: any, encoding: string, callback: (error?: Error | null) => void): void;
}
export declare class GetStream extends Readable {
    private _readable;
    constructor(s3: S3, params: S3.GetObjectRequest);
    _read(size: number): void;
}
