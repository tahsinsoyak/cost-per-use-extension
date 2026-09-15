import assert from 'node:assert/strict';
import {readFile, readdir, mkdir, writeFile} from 'node:fs/promises';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import path from 'node:path';

const archive=await readFile('cost-per-use-extension.zip');
let end=-1;
for(let offset=archive.length-22;offset>=Math.max(0,archive.length-65557);offset--) {
  if(archive.readUInt32LE(offset)===0x06054b50){end=offset;break;}
}
assert.ok(end>=0,'ZIP directory is missing.');
const count=archive.readUInt16LE(end+10);
let offset=archive.readUInt32LE(end+16);
const entries=new Map();
for(let index=0;index<count;index++) {
  assert.equal(archive.readUInt32LE(offset),0x02014b50,'Invalid ZIP directory entry.');
  const method=archive.readUInt16LE(offset+10);
  const compressedSize=archive.readUInt32LE(offset+20);
  const size=archive.readUInt32LE(offset+24);
  const nameLength=archive.readUInt16LE(offset+28);
  const extraLength=archive.readUInt16LE(offset+30);
  const commentLength=archive.readUInt16LE(offset+32);
  const localOffset=archive.readUInt32LE(offset+42);
  const name=archive.toString('utf8',offset+46,offset+46+nameLength).replaceAll('\\','/');
  assert.ok(!name.startsWith('/')&&!name.split('/').includes('..'),'Unsafe ZIP path.');
  if(!name.endsWith('/')) {
    assert.ok(!entries.has(name),`Duplicate ZIP file: ${name}`);
    assert.equal(archive.readUInt32LE(localOffset),0x04034b50);
    const start=localOffset+30+archive.readUInt16LE(localOffset+26)+archive.readUInt16LE(localOffset+28);
    const compressed=archive.subarray(start,start+compressedSize);
    assert.ok(method===0||method===8,'Unsupported ZIP compression.');
    const contents=method===0?compressed:inflateRawSync(compressed);
    assert.equal(contents.length,size);
    entries.set(name,contents);
  }
  offset+=46+nameLength+extraLength+commentLength;
}
async function files(directory,prefix='') {
  const result=[];
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const relative=prefix+entry.name;
    if(entry.isDirectory())result.push(...await files(path.join(directory,entry.name),relative+'/'));
    else result.push(relative);
  }
  return result;
}
const expected=await files('dist');
assert.deepEqual([...entries.keys()].sort(),expected.sort(),'ZIP contents differ from the verified build.');
for(const file of expected)assert.ok(entries.get(file).equals(await readFile(path.join('dist',file))),`ZIP content mismatch: ${file}`);
const manifest=JSON.parse(entries.get('manifest.json').toString('utf8'));
const source=JSON.parse(await readFile('public/manifest.json','utf8'));
assert.deepEqual(manifest,source);
const report={version:manifest.version,files:entries.size,bytes:archive.length,sha256:createHash('sha256').update(archive).digest('hex'),verifiedAt:new Date().toISOString()};
await mkdir('release-checks',{recursive:true});
await writeFile('release-checks/package.json',JSON.stringify(report,null,2)+'\n');
console.log('Upload archive verified:',JSON.stringify(report));
