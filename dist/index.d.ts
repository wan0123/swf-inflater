/// <reference types="node" />
/**
 *
 * @param targetSwf
 */
export declare function Inflater(targetSwf: string): Promise<Buffer>;
/**
 * swfの形式をFWSにする
 * @param {*} targetSwfBin
 */
export declare function InflaterBuff(targetSwfBin: Buffer): Promise<Buffer>;
