import * as THREE from 'three';
// Iceberg Light: https://terminalcolors.com/themes/iceberg/light/
export const iceberg={background:0xe8e9ec,foreground:0x33374c,selection:0xcacdd7,muted:0x8389a3,red:0xcc517a,green:0x668e3d,yellow:0xc57339,blue:0x2d539e,cyan:0x3f83a6,white:0xdcdfe7};
export function applyIcebergTheme(root){
 const p=iceberg,seenMaterials=new Set(),seenGeometry=new Set();
 const colors=new Map([
  ...[0xcaa72f,0xe2c44a,0xd7b744,0xf0d773,0xf4dc75,0xc37d3f].map(c=>[c,p.yellow]),
  ...[0x416f80,0x547d88,0x638c98,0x168eaa,0x237f85,0x268181].map(c=>[c,p.blue]),
  [0x4d9479,p.green],[0x5b999b,p.cyan],[0xad7764,p.red],
  [0xd7ddd9,p.white],[0xe6eae5,p.background],[0xbccdc7,p.selection],[0xf5f4df,p.background],
  ...[0x88958e,0x7f898b,0x737c7e,0x8f9b9a,0xbac4bf,0x566962].map(c=>[c,p.muted]),
  ...[0x424e4c,0x333d41,0x363c3e,0x292d2e].map(c=>[c,p.foreground])
 ]);
 root.traverse(o=>{
  for(const m of (Array.isArray(o.material)?o.material:o.material?[o.material]:[])){
   if(seenMaterials.has(m))continue;seenMaterials.add(m);
   const color=m.color??m.uniforms?.color?.value;
   if(color&&colors.has(color.getHex()))color.setHex(colors.get(color.getHex()));
  }
  // Keep hardware relief, but exchange warm metal and near-black for cool Iceberg neutrals.
  const g=o.geometry,a=g?.attributes.color;
  if(!a||seenGeometry.has(g))return;seenGeometry.add(g);
  const cache=new Map(),c=new THREE.Color();
  for(let i=0;i<a.count;i++){
   c.fromBufferAttribute(a,i);const key=c.getHex();
   if(!cache.has(key)){
    const light=.2126*c.r+.7152*c.g+.0722*c.b;
    cache.set(key,new THREE.Color(light<.045?0x262a3f:light<.12?p.foreground:light<.3?p.muted:p.selection));
   }
   const next=cache.get(key);a.setXYZ(i,next.r,next.g,next.b);
  }
  a.needsUpdate=true;
 });
}
