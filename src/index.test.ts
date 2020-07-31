import fs from 'fs';
import * as index from './index';


test('buff fws', async () => {
	//expect(sum()).toBe(0);
	let swf = fs.readFileSync( "./test/test.swf" )
	let buff = await index.InflaterBuff( swf );

	expect( buff.readInt8( 0 ) == 0x46 && buff.readInt8( 1 ) == 0x57 && buff.readInt8( 2 ) == 0x53 ).toBe( true );
});
test('buff cws', async () => {
	//expect(sum()).toBe(0);
	let swf = fs.readFileSync( "./test/test_deflate.swf" )
	let buff = await index.InflaterBuff( swf );

	expect( buff.readInt8( 0 ) == 0x46 && buff.readInt8( 1 ) == 0x57 && buff.readInt8( 2 ) == 0x53 ).toBe( true );
});
test('buff zws', async () => {
	//expect(sum()).toBe(0);
	let swf = fs.readFileSync( "./test/test_lzma.swf" )
	let buff = await index.InflaterBuff( swf );

	expect( buff.readInt8( 0 ) == 0x46 && buff.readInt8( 1 ) == 0x57 && buff.readInt8( 2 ) == 0x53 ).toBe( true );
});
