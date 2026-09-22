/**
 * A small raw-WebGL layer that redraws a set of DOM images as flexible planes.
 * Each plane follows its element's bounding box every frame, bows in the
 * direction it is travelling, and splits its colour channels at speed. The DOM
 * image stays in place underneath for layout, links and fallback.
 */

const VERT = `
attribute vec2 aPos;
uniform vec2 uRes;
uniform vec2 uOffset;
uniform vec2 uSize;
uniform vec2 uVel;
varying vec2 vUv;
void main() {
  vUv = aPos;
  vec2 p = uOffset + aPos * uSize;
  p.x += sin(aPos.y * 3.14159265) * uVel.x;
  p.y += sin(aPos.x * 3.14159265) * uVel.y;
  vec2 clip = (p / uRes) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
}`;

const FRAG = `
precision highp float;
uniform sampler2D uTex;
uniform vec2 uSize;
uniform vec2 uVel;
uniform float uImgAspect;
uniform float uParallax;
uniform float uHover;
uniform float uTime;
uniform float uRadius;
uniform float uAlpha;
varying vec2 vUv;

float roundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  float planeAspect = uSize.x / uSize.y;
  vec2 uv = vUv - 0.5;
  if (uImgAspect > planeAspect) uv.x *= planeAspect / uImgAspect;
  else uv.y *= uImgAspect / planeAspect;

  float zoom = 1.14 - 0.05 * uHover;
  uv /= zoom;
  uv.x += uParallax * 0.055;
  uv.y += sin(vUv.x * 9.0 + uTime * 1.6) * 0.0035 * uHover;
  uv += 0.5;

  vec2 shift = uVel / uSize * 0.22;
  float r = texture2D(uTex, uv + shift).r;
  float g = texture2D(uTex, uv).g;
  float b = texture2D(uTex, uv - shift).b;

  float d = roundedBox((vUv - 0.5) * uSize, uSize * 0.5, uRadius);
  float mask = 1.0 - smoothstep(-1.0, 0.5, d);
  float a = mask * uAlpha;
  gl_FragColor = vec4(vec3(r, g, b) * a, a);
}`;

type Plane = {
  el: HTMLElement;
  img: HTMLImageElement;
  tex: WebGLTexture | null;
  aspect: number;
  ready: boolean;
  prevX: number;
  prevY: number;
  velX: number;
  velY: number;
  hover: number;
  hoverTarget: number;
  alpha: number;
  radius: number;
  seen: boolean;
  onEnter: () => void;
  onLeave: () => void;
};

const SEG = 24;

export function createGlPlanes(canvas: HTMLCanvasElement, elements: HTMLElement[]) {
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const verts: number[] = [];
  for (let y = 0; y <= SEG; y++) for (let x = 0; x <= SEG; x++) verts.push(x / SEG, y / SEG);
  const idx: number[] = [];
  for (let y = 0; y < SEG; y++) {
    for (let x = 0; x < SEG; x++) {
      const i = y * (SEG + 1) + x;
      idx.push(i, i + 1, i + SEG + 1, i + 1, i + SEG + 2, i + SEG + 1);
    }
  }
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    res: U("uRes"), offset: U("uOffset"), size: U("uSize"), vel: U("uVel"),
    imgAspect: U("uImgAspect"), parallax: U("uParallax"), hover: U("uHover"),
    time: U("uTime"), radius: U("uRadius"), alpha: U("uAlpha"),
  };

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

  const planes: Plane[] = [];
  for (const el of elements) {
    const img = el.querySelector("img");
    if (!img) continue;
    const plane: Plane = {
      el, img, tex: null, aspect: 1.5, ready: false,
      prevX: 0, prevY: 0, velX: 0, velY: 0,
      hover: 0, hoverTarget: 0, alpha: 0, radius: 0, seen: false,
      onEnter: () => { plane.hoverTarget = 1; },
      onLeave: () => { plane.hoverTarget = 0; },
    };
    el.addEventListener("mouseenter", plane.onEnter);
    el.addEventListener("mouseleave", plane.onLeave);

    const upload = () => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      plane.tex = tex;
      plane.aspect = img.naturalWidth / img.naturalHeight;
      plane.ready = true;
      el.classList.add("is-gl");
    };
    if (img.complete && img.naturalWidth > 0) upload();
    else img.addEventListener("load", upload, { once: true });
    planes.push(plane);
  }

  let dpr = 1;
  let vw = 0;
  let vh = 0;
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
    for (const p of planes) p.radius = parseFloat(getComputedStyle(p.el).borderTopLeftRadius) || 0;
  };
  resize();
  window.addEventListener("resize", resize);

  let raf = 0;
  let running = false;
  const start = performance.now();

  const frame = () => {
    raf = requestAnimationFrame(frame);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.res, vw, vh);
    gl.uniform1f(u.time, (performance.now() - start) / 1000);

    for (const p of planes) {
      if (!p.ready) continue;
      const r = p.el.getBoundingClientRect();
      if (!p.seen) { p.prevX = r.left; p.prevY = r.top; p.seen = true; }
      const dx = r.left - p.prevX;
      const dy = r.top - p.prevY;
      p.prevX = r.left;
      p.prevY = r.top;
      p.velX += (Math.max(-70, Math.min(70, dx * 1.25)) - p.velX) * 0.12;
      p.velY += (Math.max(-70, Math.min(70, dy * 1.25)) - p.velY) * 0.12;
      p.hover += (p.hoverTarget - p.hover) * 0.08;
      p.alpha += (1 - p.alpha) * 0.08;

      if (r.right < -120 || r.left > vw + 120 || r.bottom < -120 || r.top > vh + 120) continue;

      const centre = (r.left + r.width / 2) / vw - 0.5;
      gl.bindTexture(gl.TEXTURE_2D, p.tex);
      gl.uniform2f(u.offset, r.left, r.top);
      gl.uniform2f(u.size, r.width, r.height);
      gl.uniform2f(u.vel, p.velX, p.velY);
      gl.uniform1f(u.imgAspect, p.aspect);
      gl.uniform1f(u.parallax, centre);
      gl.uniform1f(u.hover, p.hover);
      gl.uniform1f(u.radius, p.radius);
      gl.uniform1f(u.alpha, p.alpha);
      gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
    }
  };

  return {
    setRunning(on: boolean) {
      if (on === running) return;
      running = on;
      if (on) {
        for (const p of planes) p.seen = false;
        raf = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(raf);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      for (const p of planes) {
        p.el.removeEventListener("mouseenter", p.onEnter);
        p.el.removeEventListener("mouseleave", p.onLeave);
        p.el.classList.remove("is-gl");
        if (p.tex) gl.deleteTexture(p.tex);
      }
    },
  };
}
