import fs from 'fs';
import * as zlib from 'zlib';
const lzma = require( 'lzma' );


/**
 * buffer swfをFWSに展開
 * @param targetSwfBuff 
 * @param callback 
 */
export function InflaterBuff( targetSwfBuff: Buffer, callback: ( buffer: Buffer ) => Buffer ) { 

	let swfInfBuff 	= InflaterBuffAsync( targetSwfBuff );
	swfInfBuff.then( callback );
	
}

/**
 * swf file からFWSに展開
 * @param targetSwf 
 * @param callback 
 */
export function Inflater( targetSwf: string, callback: ( buffer: Buffer ) => Buffer ) { 

	let swfBuff 	= fs.readFileSync( targetSwf );
	InflaterBuff( swfBuff, callback );

}


/**
 * async版 buffer swfをFWSに展開
 * @param {*} targetSwfBin 
 */
export function InflaterBuffAsync( targetSwfBin: Buffer ) {
	return new Promise( async ( resolve: ( v: Buffer )=>void, reject:( v: string )=>void ) => {
		
		let swfVarsion 		= targetSwfBin[3];
		let swfFileSize 	= targetSwfBin.readUInt32LE( 4 );
		let swfHeaderBytes 	= targetSwfBin.slice( 0, 8 );
		let swfBodyBytes 	= targetSwfBin.slice( 8 );
		let outputSwfBytes 	= Buffer.alloc( swfFileSize, 0xFF );

		// FWS
		if( targetSwfBin[0] == 0x46 && targetSwfBin[1] == 0x57 && targetSwfBin[2] == 0x53 ){
			
			// そのまま使う
			outputSwfBytes = targetSwfBin;

		// CWF
		} else if( targetSwfBin[0] == 0x43 && targetSwfBin[1] == 0x57 && targetSwfBin[2] == 0x53 ) {

			// 解凍済みswf本体部分
			let inflateSwfBodyBytes = zlib.inflateSync( swfBodyBytes );

			// header部分書き込み
			outputSwfBytes.set( swfHeaderBytes, 0 );
			// 本体部分書き込み
			outputSwfBytes.set( inflateSwfBodyBytes, swfHeaderBytes.length );

			// CWF ⇒ FWS
			outputSwfBytes[0] = 0x46;

		// ZWS
		} else if( targetSwfBin[0] == 0x5a && targetSwfBin[1] == 0x57 && targetSwfBin[2] == 0x53 ) {
		
			// 
			let lzmaBuffer 		= Buffer.alloc( swfFileSize - 8, 0xFF );
			let lzmaProperty 	= targetSwfBin.slice( 12, 17 )

			// LZMA Property
			lzmaBuffer.set( lzmaProperty, 0 );

			// ファイルの長さ (swfヘッダ8バイトを除く)
			lzmaBuffer.writeBigUInt64BE( BigInt( swfFileSize - 8 ), 5 );	// 5-12
			lzmaBuffer.set( targetSwfBin.slice( 17 ), 13 );

			let inflateSwfBodyBuffer = await lzmaDecompress( lzmaBuffer ) as Buffer;
						
			// header部分書き込み
			outputSwfBytes.set( swfHeaderBytes, 0 );
			outputSwfBytes.set( inflateSwfBodyBuffer, swfHeaderBytes.length );

			// ZWF ⇒ FWS
			outputSwfBytes[0] = 0x46;

		} else {
			reject("unknown swf type.");
			return;
		}
		
		// 書き込み
		// await fs.writeFile( swfOutputPath, outputSwfBytes );
		resolve( outputSwfBytes );
	});
}



/**
 * Async版 swf file からFWSに展開
 * @param targetSwf 
 */
export function InflaterAsync( targetSwf: string ) { 
	return new Promise( async ( resolve: ( v: Buffer )=>void, reject:( v: string )=>void ) => {
		let swfBuff 	= await fs.promises.readFile( targetSwf );
		let swfInfBuff 	= await InflaterBuffAsync( swfBuff );

		resolve( swfInfBuff );
	})
}

/**
 * lzma解凍
 * @param {*} lzmaBytes 
 */
function lzmaDecompress( lzmaBytes: Buffer ) {
	return new Promise( async ( resolve, reject ) => {
		lzma.decompress( 
			lzmaBytes,
			async (result: Buffer, error: Error) => {
				if( !error ){
					resolve( result )
				} 	
				else{
					reject( error );
				}
			},
			(percent: any) => {
			}
		);
	});
}