/* ===== SPARK SHUMS — SHARED JS ===== */

// ===== CURSOR (desktop only) =====
(function(){
  const cur = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  if(!cur || !ring) return;
  let mx=0,my=0;
  document.addEventListener('mousemove', e=>{ mx=e.clientX; my=e.clientY; });
  function tick(){
    cur.style.left=mx+'px'; cur.style.top=my+'px';
    ring.style.left=mx+'px'; ring.style.top=my+'px';
    requestAnimationFrame(tick);
  }
  tick();
})();

// ===== HAMBURGER =====
(function(){
  const btn = document.querySelector('.hamburger');
  const drawer = document.querySelector('.nav-mobile');
  if(!btn || !drawer) return;

  function closeMenu(){
    btn.classList.remove('open');
    drawer.classList.remove('open');
  }

  btn.addEventListener('click', e=>{
    e.stopPropagation();
    btn.classList.toggle('open');
    drawer.classList.toggle('open');
  });

  // Close on nav link click
  drawer.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', closeMenu);
  });

  // Close when clicking anywhere outside the menu
  document.addEventListener('click', e=>{
    if(drawer.classList.contains('open')){
      if(!drawer.contains(e.target) && !btn.contains(e.target)){
        closeMenu();
      }
    }
  });

  // Close on scroll
  window.addEventListener('scroll', ()=>{
    if(drawer.classList.contains('open')) closeMenu();
  }, {passive:true});
})();

// ===== SET ACTIVE NAV LINK =====
(function(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a, .nav-mobile a, .nav-desktop a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href === page || (page==='' && href==='index.html')) a.classList.add('active');
  });
})();

// ===== LOADER ARC REACTOR =====
(function(){
  const loader = document.getElementById('loader');
  const canvas = document.getElementById('loaderCanvas');
  if(!loader || !canvas) return;

  const ctx = canvas.getContext('2d');
  const W=canvas.width, H=canvas.height;
  const cx=W/2, cy=H/2;
  let t=0;

  function drawLoader(progress){
    ctx.clearRect(0,0,W,H);

    // Atmosphere
    const atm=ctx.createRadialGradient(cx,cy,50,cx,cy,cx);
    atm.addColorStop(0,'rgba(0,140,190,0.12)');
    atm.addColorStop(1,'transparent');
    ctx.fillStyle=atm; ctx.fillRect(0,0,W,H);

    // Static dim rings
    [[cx*0.88,0.15],[cx*0.76,0.1],[cx*0.64,0.08]].forEach(([r,a])=>{
      ctx.beginPath(); ctx.arc(cx,cy,r,0,Math.PI*2);
      ctx.strokeStyle=`rgba(0,212,255,${a+0.06*Math.sin(t+r)})`; ctx.lineWidth=1.2; ctx.stroke();
    });

    // Progress arc
    ctx.shadowBlur=18; ctx.shadowColor='#00d4ff';
    ctx.beginPath();
    ctx.arc(cx,cy,cx*0.88,-Math.PI/2,-Math.PI/2+Math.PI*2*progress);
    ctx.strokeStyle='#00d4ff'; ctx.lineWidth=2.5; ctx.stroke();
    ctx.shadowBlur=0;

    // 6 spinning arms
    for(let i=0;i<6;i++){
      const ang=(i/6)*Math.PI*2+t*0.45;
      ctx.beginPath();
      ctx.moveTo(cx+Math.cos(ang)*cx*0.28, cy+Math.sin(ang)*cx*0.28);
      ctx.lineTo(cx+Math.cos(ang)*cx*0.58, cy+Math.sin(ang)*cx*0.58);
      ctx.strokeStyle=`rgba(0,212,255,${0.35+0.2*Math.sin(t*2+i)})`;
      ctx.lineWidth=1.5; ctx.stroke();
      // node
      ctx.beginPath();
      ctx.arc(cx+Math.cos(ang)*cx*0.58,cy+Math.sin(ang)*cx*0.58,3,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,212,255,${0.5+0.3*Math.sin(t+i)})`; ctx.fill();
    }

    // Counter-ring dots
    for(let i=0;i<8;i++){
      const ang=(i/8)*Math.PI*2-t*0.7;
      ctx.beginPath();
      ctx.arc(cx+Math.cos(ang)*cx*0.2,cy+Math.sin(ang)*cx*0.2,2,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,180,220,${0.5+0.3*Math.sin(t*3+i)})`; ctx.fill();
    }

    // Core
    const cr=cx*0.16;
    const cg=ctx.createRadialGradient(cx,cy,0,cx,cy,cr*2.2);
    cg.addColorStop(0,'rgba(255,255,255,0.97)');
    cg.addColorStop(0.2,'rgba(150,230,255,0.9)');
    cg.addColorStop(0.5,'rgba(0,170,210,0.5)');
    cg.addColorStop(1,'transparent');
    ctx.shadowBlur=30; ctx.shadowColor='#00d4ff';
    ctx.beginPath(); ctx.arc(cx,cy,cr,0,Math.PI*2);
    ctx.fillStyle=cg; ctx.fill(); ctx.shadowBlur=0;

    // Core pulse
    const pulse=(Math.sin(t*2)+1)/2;
    ctx.beginPath(); ctx.arc(cx,cy,cr+pulse*cr*0.6,0,Math.PI*2);
    ctx.strokeStyle=`rgba(0,212,255,${0.25*(1-pulse)})`; ctx.lineWidth=1; ctx.stroke();

    t+=0.05;
  }

  let start=null;
  const dur=2800;

  function loop(ts){
    if(!start) start=ts;
    const p=Math.min((ts-start)/dur,1);
    drawLoader(p);
    const pctEl=document.getElementById('loaderPct');
    if(pctEl) pctEl.textContent=Math.floor(p*100)+'%';
    if(p<1){ requestAnimationFrame(loop); }
    else {
      setTimeout(()=>{
        loader.classList.add('hidden');
        // reveal fade-up elements
        document.querySelectorAll('.fade-up').forEach((el,i)=>{
          setTimeout(()=>el.classList.add('visible'), i*100+100);
        });
      }, 300);
    }
  }
  requestAnimationFrame(loop);
})();

// ===== SCROLL REVEAL =====
(function(){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('visible'); });
  },{threshold:0.15});
  document.querySelectorAll('.fade-up').forEach(el=>obs.observe(el));
})();

// ===== SMART SCROLL ARROW =====
(function(){
  const arrow = document.getElementById('smartArrow');
  if(!arrow) return;

  const svg = arrow.querySelector('svg polyline');
  const label = arrow.querySelector('.arrow-label');

  const DOWN = '6 9 12 15 18 9';
  const UP   = '6 15 12 9 18 15';

  function isNearBottom(){
    // True when user is within 200px of the bottom of the page
    return (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 200);
  }

  function update(){
    if(isNearBottom()){
      // At bottom — show UP arrow
      svg.setAttribute('points', UP);
      label.textContent = 'Top';
      arrow.classList.remove('pulse-down');
      arrow.setAttribute('aria-label','Scroll to top');
    } else {
      // Still scrolling down — show DOWN arrow
      svg.setAttribute('points', DOWN);
      label.textContent = 'Scroll';
      arrow.classList.add('pulse-down');
      arrow.setAttribute('aria-label','Scroll down');
    }
  }

  arrow.addEventListener('click', ()=>{
    if(isNearBottom()){
      window.scrollTo({ top:0, behavior:'smooth' });
    } else {
      // Scroll down by one viewport height smoothly
      window.scrollBy({ top: window.innerHeight * 0.88, behavior:'smooth' });
    }
  });

  window.addEventListener('scroll', update, { passive:true });
  update();
})();

// ===== SCROLL TO TOP (other pages without smart arrow) =====
(function(){
  const btn = document.getElementById('scrollTop');
  if(!btn) return;
  window.addEventListener('scroll', ()=>{
    if(window.scrollY > 300) btn.classList.add('visible');
    else btn.classList.remove('visible');
  }, { passive:true });
  btn.addEventListener('click', ()=>{
    window.scrollTo({ top:0, behavior:'smooth' });
  });
})();
