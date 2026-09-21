"""GB200 NVL72 illustration model. Millimetres; x=width, y=front/back, z=up.
Published envelopes + reference architecture; simplified industrial detail.
See TECHNICAL_BASIS.md for the exact distinction between sourced and interpreted geometry.
"""
import math,json,struct,pathlib,collections
ROOT=pathlib.Path(__file__).resolve().parents[1]
T={}; current=None

def template(name,category):
 global current
 current={'category':category,'v':[],'f':[],'lines':[]}; T[name]=current

def line(points,close=False):
 if close: points=points+[points[0]]
 for a,b in zip(points,points[1:]): current['lines'].extend([list(a),list(b)])

def box(c,s,edges=True):
 x,y,z=c; a,b,d=[v/2 for v in s]
 pts=[(x-a,y-b,z-d),(x+a,y-b,z-d),(x+a,y+b,z-d),(x-a,y+b,z-d),(x-a,y-b,z+d),(x+a,y-b,z+d),(x+a,y+b,z+d),(x-a,y+b,z+d)]
 n=len(current['v']);current['v']+=pts
 faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 current['f'] += [[n+i for i in f] for f in faces]
 if edges:
  for a,b in [(0,1),(1,2),(2,3),(3,0),(4,5),(5,6),(6,7),(7,4),(0,4),(1,5),(2,6),(3,7)]:line([pts[a],pts[b]])

def ring(c,r,axis='y',n=20):
 x,y,z=c
 p=[]
 for i in range(n):
  a=i*2*math.pi/n;u=r*math.cos(a);v=r*math.sin(a)
  p.append((x+u,y,z+v) if axis=='y' else (x+u,y+v,z))
 line(p,True)

def cylinder(c,r,h,axis='z',n=16):
 x,y,z=c;p=[]
 for d in [-h/2,h/2]:
  for i in range(n):
   a=2*math.pi*i/n;u=r*math.cos(a);v=r*math.sin(a)
   p.append((x+u,y+v,z+d) if axis=='z' else (x+u,y+d,z+v))
 off=len(current['v']);current['v']+=p
 current['f'].append([off+i for i in reversed(range(n))]);current['f'].append([off+n+i for i in range(n)])
 for i in range(n):current['f'].append([off+i,off+(i+1)%n,off+n+(i+1)%n,off+n+i])
 line(p[:n],True);line(p[n:],True)
 for i in range(0,n,n//4):line([p[i],p[n+i]])

def rect(x,y,z,w,h): line([(x-w/2,y,z-h/2),(x+w/2,y,z-h/2),(x+w/2,y,z+h/2),(x-w/2,y,z+h/2)],True)
def vent(x,y,z,w,h,pitch=5):
 for i in range(int(w/pitch)):
  xx=x-w/2+i*pitch;line([(xx,y,z-h/2),(xx,y,z+h/2)])
def screw(x,y,z):ring((x,y,z),1.6,n=8);line([(x-1,y-.05,z),(x+1,y-.05,z)])

# Frame: 1068 mm base enclosure + 132 mm rear extension = 1200 mm.
template('frame','frame')
for x in [-286,286]:
 for y in [-586,454,586]:box((x,y,1118),(28,28,2236))
for z in [25,2211]:
 for y in [-582,450,582]:box((0,y,z),(544,36,50))
 for x in [-282,282]:box((x,-66,z),(36,1032,50))
 for x in [-282,282]:box((x,516,z),(36,132,50))
# Rails at EIA mounting hole centres, rails attach to chassis slides.
for x in [-232.5,232.5]:
 box((x,-411,1118),(15,14,2133.6))
 box((x,350,1118),(15,14,2133.6))
 for u in range(48):
  for dz in [6.35,22.225,38.1]:rect(x,-418.2,51.2+u*44.45+dz,6,6)
for z in [65,1100,2170]:
 for x in [-268,268]:box((x,-65,z),(18,980,22))
# Top plate, cable openings are actual gaps between strips.
for x in [-235,0,235]:box((x,-30,2225),(28,970,4))
for y in [-460,-230,240,390]:box((0,y,2225),(544,30,4))
for x in [-271,271]:
 for y in [-556,435]:cylinder((x,y,15),18,30)

# Removable outer side skins; hidden by default to expose the construction.
template('side_panel','panels')
for x in [-299,299]:
 for z in [575,1655]:box((x,-59,z),(2,1020,1030))

# Basic blanking and mounting details.
template('blank','frame');box((0,-416,0),(482.6,3,43));rect(0,-417.6,0,454,31)
for x in [-232.5,232.5]:screw(x,-417.8,0)

def chassis():
 # Published 438 mm width, 766 mm main chassis depth; face at y=-410.8.
 box((0,-27.8,-20.5),(438,766,1.5))
 for x in [-218.25,218.25]:box((x,-27.8,0),(1.5,766,41.5))
 # Front fascia, mounting ears, service handles.
 box((0,-410.8,0),(438,2.4,42))
 for x in [-231,231]:
  box((x,-411,0),(24,4,42));box((x,-430,0),(9,18,31))
  box((x,-441,0),(15,4,31))
  for z in [-15,15]:screw(x,-443.2,z)
 # Longitudinal folded upper rim and slides.
 for x in [-215,215]:
  box((x,-27.8,21),(7,766,2));box((x*1.036,-27.8,-14),(5,758,7))
  for y in [-330,-90,200,300]:ring((x,y,22.2),2.2,'z',10)
 # Rear connectors: four NVLink mating zones + power connector.
 box((0,355.4,0),(438,2,42))
 for x in [-166,-84,84,166]:box((x,360,0),(72,8,29))
 box((0,369,0),(35,25,30))
 for x in [-202,202]:cylinder((x,372,0),5.7,31,'y',12)

# Compute front modeled from NVIDIA front-view documentation; internals simplified.
template('compute_shell','compute');chassis()
for x in [-145,145]:
 rect(x,-412.1,0,130,37)
 vent(x,-412.15,1,119,4,3)
 for xx in [x-24,x+24]:rect(xx,-412.3,-11,29,9) # two ConnectX-7 OSFP ports per side
 for xx in [x-6,x+27]:rect(xx,-412.3,11,28,8) # BF3 pair
 rect(x-43,-412.3,11,15,11)
 for xx in [x-49,x+53]:vent(xx,-412.15,0,12,30,3)
for i in range(8): # four populated E1.S and four front filler positions
 x=-65+i*15;rect(x,-412.3,0,12,33)
 for z in [-9,0,9]:rect(x+3.5,-412.5,z,2.5,4)
rect(66,-412.3,5,12,10);rect(66,-412.3,-10,12,6)
for z in [-12,-3,8]:ring((80,-412.4,z),1.1,n=8)

template('compute_internal','compute')
for x in [-107,107]:
 box((x,148,-16),(199,355,2))
 # Two GPU cold plates per half-board, one CPU cold plate per half-board.
 for xx in [x-49,x+49]:
  box((xx,265,-2),(75,82,17))
  rect(xx,223.8,-2,60,12)
 box((x,150,-2),(134,106,17))
 for xx in [x-44,x+44]:box((xx,52,-5),(37,65,13))
 for xx in [x-60,x,x+60]:
  box((xx,-93,0),(48,41,35));ring((xx,-113.7,0),16,n=16);ring((xx,-113.8,0),7,n=12)
 for xx in [x-45,x+45]:box((xx,-255,-3),(46,160,22))
 for yy in [20,75,130]:line([(x-64,yy,13),(x-64,yy+15,13),(x+64,yy+15,13)])
for x in [-200,200]:
 cylinder((x,172,6),5,350,'y',12)
line([(-200,340,13),(-200,275,13),(-155,275,13),(-155,140,13),(-80,140,13),(-80,55,13)])
line([(200,340,13),(200,275,13),(155,275,13),(155,140,13),(80,140,13),(80,55,13)])
for x in [-10,10]:box((x,-60,-2),(5,700,6))

template('compute_lid','lids');box((0,-27.8,22.1),(432,762,1.2))
for x in [-204,204]:
 for y in [-300,-100,100,300]:ring((x,y,22.8),1.5,'z',8)
line([(-210,-143,22.8),(210,-143,22.8)])

template('switch_shell','nvlink');chassis()
# Switch ports at left are management/console, NOT fictitious front GPU uplinks.
for x in [-169,-149,-129,-109,-89]:rect(x,-412.3,-4,13,7)
vent(31,-412.2,0,284,28,3.5)
for z in [-8,0,8]:ring((189,-412.3,z),1.2,n=8)

template('switch_internal','nvlink')
box((0,151,-16),(414,369,2))
for x in [-107,107]:box((x,195,-2),(135,133,20))
for x in [-145,-73,0,73,145]:box((x,-210,0),(42,42,36));ring((x,-231.2,0),16,n=16)

template('switch_lid','lids');box((0,-27.8,22.1),(432,762,1.2))
for x in [-190,190]:rect(x,-412.1,12,15,3)

template('power','power')
box((0,-142,0),(480,538,42))
for i in range(6):
 x=-198+i*79.2;rect(x,-411.2,0,74,38)
 ring((x+10,-411.3,0),14,n=24);ring((x+10,-411.4,0),10,n=20);ring((x+10,-411.5,0),5,n=16)
 for a in range(8):
  aa=2*math.pi*a/8;line([(x+10+5*math.cos(aa),-411.6,5*math.sin(aa)),(x+10+14*math.cos(aa+.3),-411.6,14*math.sin(aa+.3))])
 rect(x-24,-411.3,0,12,24);rect(x-25,-411.4,0,5,13)

template('management','management');box((0,-210,0),(482,402,43))
for i in range(24):
 for z in [-8,8]:rect(-214+i*16,-411.2,z,12,10)
for x in [188,208,228]:rect(x,-411.2,0,13,12)

template('manifold','cooling')
# Full-height rack manifold; main tube + capped/connected RU ports.
cylinder((0,0,1092.5),21,2185)
for u in range(48):
 z=51.2+u*44.45+22.225;cylinder((0,-29,z),8,32,'y',12)
for z in [120,2070]:
 box((0,0,z),(52,52,10));cylinder((0,35,z),23,50,'y',16)

template('cartridge','nvlink')
box((0,0,0),(83,117,1200.15))
for i in range(27):
 z=-600.075+22.225+i*44.45
 box((0,-61,z),(75,5,34));vent(0,-64,z,67,25,3)
 for x in [-28,28]:line([(x,60,z-14),(x,60,z+14)])
for z in [-590,-195,205,590]:box((0,63,z),(83,8,14))

template('busbar','power');box((0,0,1118),(35,52,2100))
for x in [-9,9]:box((x,27,1118),(8,2,2080))

template('rear_brace','frame')
for x in [-254,254]:box((x,0,1118),(18,18,2110))
for z in [120,450,1050,1700,2110]:box((0,4,z),(520,18,20))

# Rack layout inferred in U positions from NVIDIA elevation; exact group order/counts verified.
# Small separation at group boundaries accommodates illustration of enclosure bezel/bracing.
parts=[]
def part(name,t,x=0,y=0,z=0,**extra):parts.append(dict(name=name,template=t,position=[x,y,z],**extra))
part('frame','frame');part('outer_side_panels','side_panel',optional=True)
for i in range(5):part('lower_blank_%02d'%i,'blank',z=83+44.45*i)
base=315.0
for i in range(4):part('power_lower_%02d'%(i+1),'power',z=base+i*44.45)
start=base+4*44.45+25
for i in range(27):
 z=start+i*44.45
 if i<8 or i>=17:
  num=i+1 if i<8 else i-8
  group='compute_%02d'%num
  for t in ['compute_shell','compute_internal','compute_lid']:part(group+'_'+t,t,z=z,unit=group)
 else:
  num=i-7;group='nvlink_switch_%02d'%num
  for t in ['switch_shell','switch_internal','switch_lid']:part(group+'_'+t,t,z=z,unit=group)
for i in range(4):part('power_upper_%02d'%(i+1),'power',z=start+27*44.45+25+i*44.45)
for i in range(2):part('management_%02d'%(i+1),'management',z=1985+i*44.45)
for i in range(2):part('upper_blank_%02d'%i,'blank',z=2100+i*44.45)
for x in [-202,202]:part('coolant_'+('supply' if x<0 else 'return'),'manifold',x=x,y=412,z=0)
for i,x in enumerate([-146,-60,60,146]):part('nvlink_cartridge_%02d'%(i+1),'cartridge',x=x,y=420,z=start+13*44.45)
part('dc_busbar','busbar',y=409)
part('rear_braces','rear_brace',y=570)

for t in T.values():
 t['v']=[[round(x,4) for x in v] for v in t['v']]
 t['lines']=[[round(x,4) for x in v] for v in t['lines']]
data={'version':'0.1','units':'mm','rack_pitch':600,'rack_count':4,'dimensions_mm':[600,1200,2236], 'templates':T,'parts':parts,'provenance':'TECHNICAL_BASIS.md'}
(ROOT/'assets/model.json').write_text(json.dumps(data,separators=(',',':')))
(ROOT/'assets/model-data.js').write_text('export default '+json.dumps(data,separators=(',',':'))+';')
print('Templates',len(T),'parts/rack',len(parts),'vertices',sum(len(t['v']) for t in T.values()),'segments',sum(len(t['lines'])//2 for t in T.values()))
