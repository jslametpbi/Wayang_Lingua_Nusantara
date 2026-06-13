/* ============================================================
   Wayang Lingua Nusantara — charts.js
   Dependency-free SVG charts: donut, radar, grouped bars,
   line/area, ring gauge, mini bars. All theme-aware.
   ============================================================ */

const Charts = window.Charts = (() => {
  const C = {
    gold:'#d7a928', goldBright:'#f3cf63', goldDeep:'#9a7415',
    teal:'#2f8b7d', plum:'#6b5b95', rust:'#c0653a', steel:'#4a6a9a',
    cream:'#f2e7c9', dim:'#cbbd97', grid:'rgba(215,169,40,.14)',
  };
  const PALETTE = [C.gold, C.teal, C.plum, C.rust, C.steel, '#7fd6c7'];
  const ns = 'http://www.w3.org/2000/svg';
  const esc = s => String(s).replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));

  /* ---- donut: data = [{label, value, color?}] ---- */
  function donut(data, { size=180, thick=26, centerTop='', centerSub='' } = {}) {
    const total = data.reduce((a,d)=>a+d.value,0) || 1;
    const r = (size - thick) / 2, cx = size/2, cy = size/2;
    const circ = 2 * Math.PI * r;
    let off = 0, segs = '';
    data.forEach((d,i) => {
      const frac = d.value/total, len = frac*circ;
      segs += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none"
        stroke="${d.color||PALETTE[i%PALETTE.length]}" stroke-width="${thick}"
        stroke-dasharray="${len-2} ${circ-len+2}" stroke-dashoffset="${-off}"
        transform="rotate(-90 ${cx} ${cy})" stroke-linecap="butt"/>`;
      off += len;
    });
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="donut chart">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="${thick}"/>
      ${segs}
      <text x="${cx}" y="${cy-3}" text-anchor="middle" fill="${C.goldBright}" font-family="Cinzel,serif" font-size="${size*.16}" font-weight="700">${esc(centerTop)}</text>
      <text x="${cx}" y="${cy+16}" text-anchor="middle" fill="${C.dim}" font-size="${size*.066}">${esc(centerSub)}</text>
    </svg>`;
  }

  /* ---- radar: axes=[{label,value(0-100)}] ---- */
  function radar(axes, { size=240, max=100, color=C.gold } = {}) {
    const cx=size/2, cy=size/2+6, R=size/2-38, n=axes.length;
    const pt = (i, frac) => {
      const a = -Math.PI/2 + i * 2*Math.PI/n;
      return [cx + Math.cos(a)*R*frac, cy + Math.sin(a)*R*frac];
    };
    let rings='';
    for (let g=1; g<=4; g++){
      const pts = axes.map((_,i)=>pt(i,g/4).join(',')).join(' ');
      rings += `<polygon points="${pts}" fill="none" stroke="${C.grid}" stroke-width="1"/>`;
    }
    const spokes = axes.map((_,i)=>{const [x,y]=pt(i,1);return `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="${C.grid}"/>`}).join('');
    const shape = axes.map((a,i)=>pt(i,Math.max(.04,a.value/max)).join(',')).join(' ');
    const dots = axes.map((a,i)=>{const [x,y]=pt(i,Math.max(.04,a.value/max));return `<circle cx="${x}" cy="${y}" r="3" fill="${C.goldBright}"/>`}).join('');
    const labels = axes.map((a,i)=>{
      const [x,y]=pt(i,1.22);
      const anchor = Math.abs(x-cx)<10 ? 'middle' : x>cx ? 'start' : 'end';
      return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${C.cream}" font-size="11">${esc(a.label)}</text>
              <text x="${x}" y="${y+13}" text-anchor="${anchor}" fill="${C.goldBright}" font-size="11" font-weight="700">${a.value}%</text>`;
    }).join('');
    return `<svg viewBox="0 0 ${size} ${size+8}" width="100%" style="max-width:${size+60}px" role="img" aria-label="skill radar chart">
      ${rings}${spokes}
      <polygon points="${shape}" fill="${color}" fill-opacity=".28" stroke="${color}" stroke-width="2"/>
      ${dots}${labels}
    </svg>`;
  }

  /* ---- grouped bars: cats=[..], series=[{name,color,values:[..]}] ---- */
  function bars(cats, series, { w=460, h=210, max=100, showVals=true } = {}) {
    const padL=30, padB=30, padT=14;
    const plotW = w-padL-12, plotH = h-padB-padT;
    const groupW = plotW/cats.length;
    const bw = Math.min(26, (groupW-14)/series.length);
    let grid='';
    for(let g=0; g<=4; g++){
      const y = padT + plotH*(1-g/4);
      grid += `<line x1="${padL}" y1="${y}" x2="${w-8}" y2="${y}" stroke="${C.grid}"/>
               <text x="${padL-6}" y="${y+4}" text-anchor="end" fill="${C.dim}" font-size="9.5">${Math.round(max*g/4)}</text>`;
    }
    let rects='', labels='';
    cats.forEach((c,ci)=>{
      const gx = padL + ci*groupW + (groupW - bw*series.length - 4*(series.length-1))/2;
      series.forEach((s,si)=>{
        const v = s.values[ci]||0, bh = plotH*v/max;
        const x = gx + si*(bw+4), y = padT+plotH-bh;
        rects += `<rect x="${x}" y="${y}" width="${bw}" height="${bh}" rx="3" fill="${s.color}"/>`;
        if(showVals) rects += `<text x="${x+bw/2}" y="${y-4}" text-anchor="middle" fill="${C.dim}" font-size="9.5">${v}</text>`;
      });
      labels += `<text x="${padL+ci*groupW+groupW/2}" y="${h-8}" text-anchor="middle" fill="${C.dim}" font-size="10.5">${esc(c)}</text>`;
    });
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="bar chart">${grid}${rects}${labels}</svg>`;
  }

  /* ---- line/area: pts=[{label,value}] ---- */
  function line(pts, { w=460, h=180, max=null, color=C.gold, area=true, unit='' } = {}) {
    const padL=36, padB=26, padT=12;
    const plotW=w-padL-14, plotH=h-padB-padT;
    const mx = max || Math.max(...pts.map(p=>p.value))*1.15 || 1;
    const xy = pts.map((p,i)=>[padL + (pts.length===1?plotW/2:plotW*i/(pts.length-1)), padT+plotH*(1-p.value/mx)]);
    const path = xy.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
    let grid='';
    for(let g=0;g<=3;g++){
      const y=padT+plotH*(1-g/3);
      grid+=`<line x1="${padL}" y1="${y}" x2="${w-10}" y2="${y}" stroke="${C.grid}"/>
             <text x="${padL-6}" y="${y+4}" text-anchor="end" fill="${C.dim}" font-size="9.5">${Math.round(mx*g/3)}</text>`;
    }
    const areaPath = area ? `<path d="${path} L ${xy.at(-1)[0]} ${padT+plotH} L ${xy[0][0]} ${padT+plotH} Z" fill="${color}" fill-opacity=".14"/>` : '';
    const dots = xy.map(p=>`<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="${C.goldBright}" stroke="#0a1428" stroke-width="1.5"/>`).join('');
    const labels = pts.map((p,i)=>`<text x="${xy[i][0]}" y="${h-7}" text-anchor="middle" fill="${C.dim}" font-size="10">${esc(p.label)}</text>`).join('');
    return `<svg viewBox="0 0 ${w} ${h}" width="100%" role="img" aria-label="line chart">
      ${grid}${areaPath}<path d="${path}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round"/>${dots}${labels}
    </svg>`;
  }

  /* ---- ring gauge: 0-100 score ---- */
  function ring(value, { size=92, thick=8, color=C.gold, label='' } = {}) {
    const r=(size-thick)/2, cx=size/2, cy=size/2, circ=2*Math.PI*r;
    const len = circ * Math.min(100,Math.max(0,value))/100;
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="${esc(label)} ${value}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="${thick}"/>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${thick}"
        stroke-dasharray="${len} ${circ-len}" stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
      <text x="${cx}" y="${cy+7}" text-anchor="middle" fill="${C.goldBright}" font-family="Cinzel,serif" font-size="${size*.26}" font-weight="700">${Math.round(value)}</text>
    </svg>`;
  }

  /* ---- horizontal skill bars (label | bar | %) ---- */
  function skillBars(skills) {
    return Object.entries(skills).map(([k,v]) => `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:11px">
        <span style="width:84px;font-size:12.5px;color:var(--cream-dim);flex:none">${esc(k)}</span>
        <div class="bar" style="flex:1"><i style="width:${v}%"></i></div>
        <b style="width:42px;text-align:right;font-size:13px;color:var(--gold-bright)">${v}%</b>
      </div>`).join('');
  }

  return { donut, radar, bars, line, ring, skillBars, PALETTE, C };
})();
