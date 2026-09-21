// Metres. Gaps are clear distances between rack envelopes, not centre pitches.
export function layoutRacks(count, columns, rackGap, rowGap) {
 const cols=Math.min(columns,count), rows=Math.ceil(count/cols);
 const positions=Array.from({length:count},(_,id)=>[(id%cols-(cols-1)/2)*(.6+rackGap),(Math.floor(id/cols)-(rows-1)/2)*(1.2+rowGap),0]);
 return {positions,cols,rows,width:cols*.6+(cols-1)*rackGap,depth:rows*1.2+(rows-1)*rowGap};
}
// Shared route bundles, not electrical bus junctions. Leaf/spine switching is abstracted.
export function routeField(layout) {
 const {positions,cols,rows,width}=layout, segments=[],edges=[],rackNodes=[],nodes=new Map();
 const z=2.94,yOffset=0,spineX=width/2+1.0;
 function node(id,point){nodes.set(id,point);return id;}
 function edge(a,b){edges.push([a,b]);segments.push(...nodes.get(a),...nodes.get(b));}
 for(let row=0;row<rows;row++){
  const start=row*cols,end=Math.min(start+cols,positions.length),y=positions[start][1]+yOffset;
  const spine=node('spine-'+row,[spineX,y,z]);if(row)edge('spine-'+(row-1),spine);
  let previous=spine;
  for(let i=end-1;i>=start;i--){const x=positions[i][0],top=node('top-'+i,[x,y,z]),rack=node('rack-'+i,[x,y,2.28]);edge(previous,top);edge(top,rack);rackNodes.push(rack);previous=top;}
 }
 const adjacent=new Map([...nodes.keys()].map(k=>[k,[]]));for(const[a,b]of edges){adjacent.get(a).push(b);adjacent.get(b).push(a);}const seen=new Set(),queue=[rackNodes[0]];while(queue.length){const n=queue.pop();if(seen.has(n))continue;seen.add(n);queue.push(...adjacent.get(n));}
 return {segments,connectedRacks:rackNodes.filter(n=>seen.has(n)).length,racks:positions.length,edges:edges.length,rows};
}
