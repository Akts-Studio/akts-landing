// akts-3d — bağımlılıksız prosedürel WebGL hero modülü (cam küp + ay kayası).
// mountCube(canvas, opts) / mountMoon(canvas, opts) → { destroy() }
// WebGL2 → WebGL1 → canvas[data-akts3d-fallback] (sayfa CSS ile statik poster gösterir).

const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';

const COMMON = `precision highp float;
uniform vec2 uRes;uniform float uT;uniform mat3 uR;
vec3 camRay(out vec3 ro){vec2 uv=(gl_FragCoord.xy-.5*uRes)/min(uRes.x,uRes.y);ro=vec3(0.,0.,3.4);return normalize(vec3(uv,-1.75));}
`;

const CUBE_FS = COMMON + `
uniform float uGlyph,uSpin;uniform vec3 uMetal;
const float B=.6,RR=.13;
float sdBox(vec3 p){vec3 q=abs(p)-B+RR;return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-RR;}
float seg(vec2 p,vec2 a,vec2 b){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}
float glyph(vec2 p){float d;
 if(uGlyph<.5){d=min(seg(p,vec2(-.12,-.15),vec2(-.12,.15)),seg(p,vec2(.12,-.15),vec2(.12,.15)));d=min(d,seg(p,vec2(-.12,.15),vec2(.12,-.15)));}
 else{d=min(seg(p,vec2(-.14,-.16),vec2(0.,.16)),seg(p,vec2(.14,-.16),vec2(0.,.16)));d=min(d,seg(p,vec2(-.07,-.04),vec2(.07,-.04)));}
 return d-.032;}
mat3 coinM(){float c=cos(uSpin),s=sin(uSpin),a=.28;mat3 ry=mat3(c,0.,-s,0.,1.,0.,s,0.,c);mat3 rx=mat3(1.,0.,0.,0.,cos(a),sin(a),0.,-sin(a),cos(a));return rx*ry;}
float coin(vec3 q){float r=length(q.xy);vec2 g2=vec2(q.x*sign(q.z+1e-4),q.y);
 float g=1.-smoothstep(-.004,.006,glyph(g2));float ring=1.-smoothstep(.0,.006,abs(r-.285)-.009);
 float h=.042+.024*max(g,ring)+.016*smoothstep(.315,.325,r);
 vec2 d=vec2(r-.36,abs(q.z)-h);return min(max(d.x,d.y),0.)+length(max(d,0.))-.01;}
vec3 env(vec3 d){
 vec3 c=mix(vec3(.010,.011,.018),vec3(.035,.04,.055),d.y*.5+.5);
 c+=vec3(1.,.36,.29)*1.9*exp(-pow((d.x-.45*d.y+.42)*7.,2.))*smoothstep(-1.,.0,d.y+.3);
 c+=vec3(.86,.91,1.)*1.6*exp(-pow((d.y-.5+.25*d.x)*9.,2.))*smoothstep(-.4,.4,d.x+.2);
 c+=vec3(.7,.8,1.)*.8*exp(-pow((d.x-.72)*12.,2.))*smoothstep(.2,-.4,d.y);
 c+=vec3(1.,.42,.32)*.18*pow(max(-d.y,0.),6.);
 c+=vec3(.9,.95,1.)*.6*pow(max(d.y,0.),10.);
 return c;}
float mapIn(vec3 p,mat3 cm){return min(coin(cm*p),-sdBox(p));}
vec3 shadeCoin(vec3 p,vec3 rd,mat3 cm){
 vec2 e=vec2(.0015,-.0015);vec3 q=cm*p;
 vec3 n=normalize(e.xyy*coin(q+e.xyy)+e.yyx*coin(q+e.yyx)+e.yxy*coin(q+e.yxy)+e.xxx*coin(q+e.xxx));
 n=n*cm;vec3 r=reflect(rd,n);float fr=pow(1.-max(dot(-rd,n),0.),3.);
 vec3 L=normalize(vec3(-.5,.7,.6));float sp=pow(max(dot(r,L),0.),40.);
 float rr=length(q.xy);float ao=.55+.45*smoothstep(.0,.03,abs(glyph(vec2(q.x*sign(q.z),q.y))))*(1.-smoothstep(.29,.31,rr)*smoothstep(.33,.31,rr)*.0);
 float gm=max(1.-smoothstep(-.004,.006,glyph(vec2(q.x*sign(q.z),q.y))),smoothstep(.31,.33,rr));float fld=mix(.55,1.,gm);
 vec3 c=uMetal*(.12+env(r)*1.25)*ao*fld+mix(uMetal,vec3(1.),fr)*sp*1.6+uMetal*max(dot(n,L),0.)*.25;
 return c;}
void main(){vec3 ro;vec3 rd=camRay(ro);
 mat3 iR=uR;ro=ro*iR;rd=rd*iR;vec3 rdW=rd;
 float t=1.8,d;bool hit=false;
 for(int i=0;i<64;i++){d=sdBox(ro+rd*t);if(d<.001){hit=true;break;}t+=d;if(t>5.)break;}
 if(!hit){gl_FragColor=vec4(0.);return;}
 vec3 p=ro+rd*t;vec2 e=vec2(.001,-.001);
 vec3 n=normalize(e.xyy*sdBox(p+e.xyy)+e.yyx*sdBox(p+e.yyx)+e.yxy*sdBox(p+e.yxy)+e.xxx*sdBox(p+e.xxx));
 float cs=max(dot(-rd,n),0.);float fr=.06+.94*pow(1.-cs,5.);
 vec3 refl=env(uR*reflect(rd,n));
 mat3 cm=coinM();vec3 rin=refract(rd,n,.67);
 vec3 inside;float s=.01;bool hc=false;vec3 q=p;
 for(int i=0;i<56;i++){q=p+rin*s;d=mapIn(q,cm);if(d<.0012){hc=coin(cm*q)<.004;break;}s+=max(d*.9,.004);if(s>2.6)break;}
 if(hc){inside=shadeCoin(q,rin,cm);
  vec3 rg=refract(rd,n,.64),rb=refract(rd,n,.70);inside*=1.;inside.r*=1.+.15*(1.-cs);inside.b*=1.+.15*(1.-cs);}
 else{vec3 nb=normalize(e.xyy*sdBox(q+e.xyy)+e.yyx*sdBox(q+e.yyx)+e.yxy*sdBox(q+e.yxy)+e.xxx*sdBox(q+e.xxx));
  vec3 o=refract(rin,-nb,1.5);if(dot(o,o)<.01)o=reflect(rin,-nb);
  float ab=.06*(1.-cs);vec3 or_=normalize(o+ab*(rin-o)),ob=normalize(o-ab*(rin-o));
  inside=vec3(env(uR*or_).r,env(uR*o).g,env(uR*ob).b);}
 inside*=vec3(.86,.9,.97);
 vec3 nl=abs(n);float a=max(nl.x,max(nl.y,nl.z));
 float line=exp(-pow((a-.985)/.012,2.))*.9+smoothstep(.97,.8,a)*.18;
 vec3 L=normalize(vec3(-.5,.7,.6));float sp=pow(max(dot(uR*reflect(rd,n),L),0.),120.)*2.;
 vec3 c=mix(inside,refl,fr)+line*mix(vec3(.9,.95,1.),vec3(1.,.5,.4),.5+.5*n.x)+sp;
 c=c/(1.+c*.35);c=pow(c,vec3(.92));
 gl_FragColor=vec4(c,1.);}`;

const MOON_FS = COMMON + `
uniform float uSeed;uniform vec3 uL;
float hash(vec3 p){p=fract(p*.3183099+.1+uSeed*.0371);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
  mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+7.1;a*=.5;}return s;}
float craters(vec3 p){vec3 i=floor(p),f=fract(p);float h=0.;
 for(int z=-1;z<=1;z++)for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec3 g=vec3(x,y,z),c=i+g;
  if(hash(c+3.7)<.45)continue;
  vec3 r=g+vec3(hash(c),hash(c+11.3),hash(c+27.1))*.8+.1-f;float rad=.18+.3*hash(c+5.9);float u=length(r)/rad;
  h+=(-max(1.-u*u,0.)+.32*exp(-pow((u-1.)*3.2,2.)))*rad;}
 return h;}
float shape(vec3 p){return length(p*vec3(1.,.82,.92))-.78-(noise(p*1.3)-.5)*.32;}
float disp(vec3 p){return fbm(p*3.)*.06+craters(p*2.2)*.11+craters(p*5.1)*.04;}
float map(vec3 p){p=uR*p;return (shape(p)-disp(p))*.7;}
void main(){vec3 ro;vec3 rd=camRay(ro);
 float b=dot(ro,rd),c=dot(ro,ro)-1.25,h=b*b-c;if(h<0.){gl_FragColor=vec4(0.);return;}
 float t=-b-sqrt(h),tf=-b+sqrt(h),d;bool hit=false;
 for(int i=0;i<90;i++){d=map(ro+rd*t);if(d<.0008*t){hit=true;break;}t+=d;if(t>tf)break;}
 if(!hit){gl_FragColor=vec4(0.);return;}
 vec3 p=ro+rd*t;vec2 e=vec2(.0015,-.0015);
 vec3 n=normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));
 vec3 L=normalize(uL);float sh=1.,s=.02;
 for(int i=0;i<24;i++){float k=map(p+L*s);sh=min(sh,10.*k/s);s+=clamp(k,.01,.12);if(sh<.01||s>1.6)break;}
 sh=clamp(sh,0.,1.);
 vec3 q=uR*p;float m=fbm(q*1.6+uSeed);
 vec3 alb=mix(vec3(.30,.29,.28),vec3(.56,.55,.53),smoothstep(.35,.65,m))*(.85+.3*noise(q*24.));
 float dif=max(dot(n,L),0.);float ao=clamp(.5+.5*(map(p+n*.06)/.042),0.,1.);
 vec3 col=alb*(dif*sh*vec3(1.,.97,.92)*1.9+ao*vec3(.035,.04,.05)+pow(1.-max(dot(-rd,n),0.),3.)*vec3(.06,.07,.09));
 col=pow(col/(1.+col*.2),vec3(.95));
 gl_FragColor=vec4(col,1.);}`;

function getGL(canvas, opts) {
  const a = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false,
    preserveDrawingBuffer: !!opts.preserveDrawingBuffer, powerPreference: 'low-power' };
  try {
    return canvas.getContext('webgl2', a) || canvas.getContext('webgl', a) || canvas.getContext('experimental-webgl', a);
  } catch (e) { return null; }
}

function program(gl, fs) {
  const mk = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const p = gl.createProgram();
  gl.attachShader(p, mk(gl.VERTEX_SHADER, VS)); gl.attachShader(p, mk(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  return p;
}

const rot = (yaw, pitch, roll = 0) => {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), cr = Math.cos(roll), sr = Math.sin(roll);
  // R = Rz(roll) * Rx(pitch) * Ry(yaw), sütun-ana düzende
  const ry = [cy, 0, -sy, 0, 1, 0, sy, 0, cy], rx = [1, 0, 0, 0, cp, sp, 0, -sp, cp], rz = [cr, sr, 0, -sr, cr, 0, 0, 0, 1];
  const mul = (a, b) => { const o = []; for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++)
    o[c * 3 + r] = a[r] * b[c * 3] + a[3 + r] * b[c * 3 + 1] + a[6 + r] * b[c * 3 + 2]; return o; };
  return mul(rz, mul(rx, ry));
};

// Ortak çalıştırıcı: boyut, DPR, uyarlanır çözünürlük, görünürlük, reduced-motion, temizlik.
function run(canvas, fs, opts, hooks) {
  const noop = { destroy() {} };
  const gl = getGL(canvas, opts);
  let prog;
  if (gl) { try { prog = program(gl, fs); } catch (e) { prog = null; } }
  if (!gl || !prog) { canvas.setAttribute('data-akts3d-fallback', ''); return noop; }

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  gl.useProgram(prog);
  const U = {}; const u = (n) => (n in U ? U[n] : (U[n] = gl.getUniformLocation(prog, n)));

  const mq = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  let reduced = opts.reducedMotion ?? !!(mq && mq.matches);
  let scale = opts.scale || 1, visible = true, raf = 0, last = 0, frames = 0, acc = 0, dead = false, dirty = true;
  const offs = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); offs.push(() => t.removeEventListener(ev, fn, o)); };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * scale;
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; dirty = true; }
  };
  const draw = (t, dt) => {
    resize();
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u('uRes'), canvas.width, canvas.height);
    gl.uniform1f(u('uT'), t);
    hooks.frame(gl, u, t, dt, reduced);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    dirty = false;
  };
  const tick = (now) => {
    raf = 0;
    if (dead || !visible || document.hidden) return;
    const dt = last ? Math.min((now - last) / 1000, .1) : 1 / 60; last = now;
    draw(now / 1000, dt);
    if (scale > .5 && frames < 60) { acc += dt; ++frames; if ((frames === 10 && acc / 10 > .045) || (frames === 60 && acc / 60 > .022)) { scale = Math.max(.5, scale * .7); frames = 0; acc = 0; } }
    if (!reduced || hooks.active()) raf = requestAnimationFrame(tick);
    else last = 0;
  };
  const kick = () => { if (!raf && !dead) raf = requestAnimationFrame(tick); };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; if (visible) kick(); });
    io.observe(canvas); offs.push(() => io.disconnect());
  }
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { dirty = true; kick(); }); ro.observe(canvas); offs.push(() => ro.disconnect()); }
  on(document, 'visibilitychange', () => { last = 0; kick(); });
  if (mq && opts.reducedMotion == null) on(mq, 'change', (e) => { reduced = e.matches; kick(); });
  on(canvas, 'webglcontextlost', (e) => { e.preventDefault(); dead = true; canvas.setAttribute('data-akts3d-fallback', ''); });
  hooks.bind && hooks.bind(on, kick);
  kick();

  return {
    destroy() {
      dead = true; if (raf) cancelAnimationFrame(raf);
      offs.forEach((f) => f()); offs.length = 0;
      gl.deleteBuffer(buf); gl.deleteProgram(prog);
      const ext = gl.getExtension('WEBGL_lose_context'); ext && ext.loseContext();
    },
  };
}

const METALS = { gold: [1.0, 0.74, 0.36], ember: [1.0, 0.42, 0.30] };

export function mountCube(canvas, opts = {}) {
  const idle = opts.idleSpeed ?? 0.35;
  const s = { yaw: opts.yaw ?? 0.6, pitch: 0.42, vy: idle, vp: 0, drag: false, px: 0, py: 0, pt: 0, spin: 0 };
  const metal = Array.isArray(opts.metal) ? opts.metal : METALS[opts.metal] || METALS.gold;
  canvas.style.touchAction = 'pan-y';
  canvas.style.cursor = 'grab';
  return run(canvas, CUBE_FS, opts, {
    active: () => s.drag || Math.abs(s.vy) > .01 || Math.abs(s.vp) > .01,
    frame(gl, u, t, dt, reduced) {
      const target = reduced ? 0 : idle, k = 1 - Math.exp(-dt * 2.2);
      if (!s.drag) {
        s.vy += (target - s.vy) * k;
        s.vp += ((0.42 - s.pitch) * 3 - s.vp) * k; // yaylı dönüş: hafif eğik duruşa
        s.yaw += s.vy * dt; s.pitch += s.vp * dt;
      }
      if (!reduced) s.spin += dt * 0.5;
      gl.uniformMatrix3fv(u('uR'), false, rot(s.yaw, s.pitch, 0.08));
      gl.uniform1f(u('uSpin'), s.spin + 0.5);
      gl.uniform1f(u('uGlyph'), opts.glyph === 'A' ? 1 : 0);
      gl.uniform3fv(u('uMetal'), metal);
    },
    bind(on, kick) {
      on(canvas, 'pointerdown', (e) => {
        s.drag = true; s.px = e.clientX; s.py = e.clientY; s.pt = performance.now();
        canvas.style.cursor = 'grabbing';
        try { canvas.setPointerCapture(e.pointerId); } catch (_) {}
        kick();
      });
      on(canvas, 'pointermove', (e) => {
        if (!s.drag) return;
        const now = performance.now(), dt = Math.max((now - s.pt) / 1000, 1 / 240);
        const dx = (e.clientX - s.px) * 0.009, dy = e.pointerType === 'touch' ? 0 : (e.clientY - s.py) * 0.009;
        s.yaw += dx; s.pitch = Math.max(-1.3, Math.min(1.3, s.pitch + dy));
        s.vy = s.vy * 0.4 + (dx / dt) * 0.6; s.vp = s.vp * 0.4 + (dy / dt) * 0.6;
        s.px = e.clientX; s.py = e.clientY; s.pt = now;
        kick();
      });
      const up = () => { if (!s.drag) return; s.drag = false; canvas.style.cursor = 'grab';
        s.vy = Math.max(-12, Math.min(12, s.vy)); s.vp = Math.max(-8, Math.min(8, s.vp)); kick(); };
      on(canvas, 'pointerup', up); on(canvas, 'pointercancel', up); on(canvas, 'lostpointercapture', up);
    },
  });
}

export function mountMoon(canvas, opts = {}) {
  const seed = opts.seed ?? 1, speed = opts.rotationSpeed ?? 0.06;
  const L = opts.light || [-0.75, 0.6, 0.35];
  let a = seed * 1.7;
  return run(canvas, MOON_FS, opts, {
    active: () => false,
    frame(gl, u, t, dt, reduced) {
      if (!reduced) a += dt * speed;
      gl.uniformMatrix3fv(u('uR'), false, rot(a, 0.35 + seed * 0.4, seed * 0.9));
      gl.uniform1f(u('uSeed'), seed);
      gl.uniform3fv(u('uL'), L);
    },
  });
}
