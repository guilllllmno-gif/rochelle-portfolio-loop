(() => {
  'use strict';
  const R=window.R, main=document.getElementById('main'), header=document.getElementById('site-header');
  const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
  const wrapUnit=n=>n-Math.floor(n);
  // Outlined Oleo Script Swash Caps; the header retains the original brand mark.
  const brandShape="M26.411 27.840Q26.026 27.895 24.982 27.895Q23.938 27.895 23.443 27.510Q23.059 27.125 23.059 25.641Q23.059 24.158 23.333 23.361Q23.608 22.564 25.064 22.564Q26.521 22.564 27.840 23.278Q29.433 22.069 30.807 19.541Q32.181 17.014 32.181 14.321Q32.181 10.419 29.845 8.605Q27.510 6.792 22.619 6.792Q15.585 6.792 11.106 9.540Q6.627 12.287 6.627 15.365Q6.627 16.849 7.836 17.810Q9.045 18.772 10.254 19.102Q10.034 21.300 8.880 23.168Q6.737 22.839 4.868 20.943Q3.000 19.047 3.000 15.805Q3.000 10.419 9.210 6.957Q15.420 3.495 24.597 3.495Q31.961 3.495 36.248 6.242Q40.534 8.990 40.534 14.321Q40.534 18.058 37.732 21.053Q34.929 24.048 30.972 25.971Q31.906 26.905 32.648 28.609Q33.390 30.313 33.857 31.384Q34.324 32.456 34.599 33.115Q34.874 33.775 35.368 34.984Q37.512 40.809 39.243 43.584Q40.974 46.359 42.568 46.359Q42.897 46.359 43.062 46.305L43.612 48.283Q40.919 50.426 37.457 50.426Q33.995 50.426 32.566 48.640Q31.137 46.854 29.928 41.304Q29.763 40.754 28.994 37.292Q27.455 29.928 26.411 27.840ZM15.805 14.650Q15.805 13.386 14.486 11.903L14.541 11.518Q17.453 9.814 21.795 9.814Q23.498 9.814 24.323 10.089Q24.597 10.694 24.597 11.793Q24.597 14.211 21.767 25.641Q18.937 37.072 18.442 42.732Q15.200 43.667 11.243 43.667Q10.309 43.667 9.869 43.502Q10.144 39.985 12.974 29.131Q15.805 18.277 15.805 14.650ZM49.657 43.996Q45.865 43.996 43.722 41.331Q41.578 38.666 41.578 33.885Q41.578 27.785 44.848 23.388Q48.118 18.992 53.888 18.992L55.867 19.102Q56.801 18.607 57.955 18.607Q62.296 18.607 62.296 26.795Q64.550 26.686 66.858 26.191L67.737 25.971L68.067 28.114Q66.253 28.884 63.176 29.488L62.077 29.708Q61.032 35.478 57.845 39.737Q54.658 43.996 49.657 43.996ZM52.624 39.270Q54.932 39.270 56.773 36.303Q58.614 33.335 59.329 30.038Q53.449 30.038 53.449 25.641Q53.449 23.883 54.163 22.344L54.438 21.795Q54.218 21.685 53.888 21.685Q53.559 21.685 53.394 21.795Q52.020 22.674 50.811 25.916Q49.602 29.159 49.602 33.335Q49.602 39.270 52.624 39.270ZM77.629 21.740Q75.431 21.740 74.112 25.394Q72.793 29.049 72.793 33.225Q72.793 39.820 76.859 39.820Q78.178 39.820 79.662 39.188Q81.146 38.556 82.025 37.951L82.850 37.292L84.114 38.995Q83.674 39.600 82.355 40.589Q81.036 41.578 79.882 42.238Q78.728 42.897 76.914 43.447Q75.101 43.996 73.342 43.996Q69.056 43.996 66.913 41.194Q64.769 38.391 64.769 33.665Q64.769 27.125 68.369 23.059Q71.968 18.992 77.629 18.992Q81.311 18.992 83.482 20.668Q85.652 22.344 85.652 24.790Q85.652 27.235 84.114 28.994Q82.740 28.994 80.926 28.389Q79.113 27.785 78.178 26.905L79.003 22.069Q78.508 21.740 77.629 21.740ZM93.236 7.067Q93.236 5.253 92.906 4.484Q97.193 3.000 100.985 3.000Q101.479 3.495 101.479 5.528Q101.479 9.155 98.402 22.234Q102.853 18.992 106.205 18.992Q108.294 18.992 109.365 20.311Q110.437 21.630 110.437 23.800Q110.437 25.971 109.173 30.890Q107.909 35.808 107.909 37.622Q107.909 39.435 108.349 39.435Q108.788 39.435 110.657 38.446L111.316 38.116L112.305 40.040Q111.811 40.479 110.986 41.139Q110.162 41.798 107.964 42.897Q105.766 43.996 103.925 43.996Q102.084 43.996 100.985 42.815Q99.886 41.633 99.886 39.627Q99.886 37.622 101.122 32.318Q102.359 27.015 102.359 25.614Q102.359 24.213 101.205 24.213Q99.776 24.213 97.632 25.422Q94.610 38.721 94.610 42.677Q92.302 43.557 86.751 43.557Q86.696 42.623 86.696 41.908Q86.696 39.545 89.966 25.751Q93.236 11.958 93.236 7.067ZM113.844 33.830Q113.844 26.960 117.993 22.976Q122.142 18.992 127.418 18.992Q130.660 18.992 132.749 20.586Q134.837 22.179 134.837 24.845Q134.837 27.510 133.491 29.323Q132.144 31.137 130.221 32.126Q126.319 34.050 123.077 34.544L121.758 34.709Q122.142 39.875 125.989 39.875Q127.308 39.875 128.792 39.215Q130.276 38.556 131.100 37.896L131.924 37.237L133.243 38.995Q132.804 39.600 131.485 40.589Q130.166 41.578 129.012 42.238Q125.824 43.996 122.032 43.996Q118.241 43.996 116.042 41.304Q113.844 38.611 113.844 33.830ZM121.703 32.016Q124.505 31.522 126.154 29.653Q127.803 27.785 127.803 24.817Q127.803 21.850 126.044 21.850Q123.956 21.850 122.829 25.394Q121.703 28.939 121.703 32.016ZM140.223 43.996Q138.354 43.996 137.118 42.732Q135.881 41.468 135.881 39.188Q135.881 36.907 138.601 24.625Q141.322 12.342 141.322 6.902L140.992 4.484Q145.278 3.000 149.015 3.000Q149.565 3.769 149.565 5.693Q149.565 10.089 146.790 22.701Q144.014 35.314 144.014 37.374Q144.014 39.435 144.509 39.435L148.356 38.061L149.345 39.985Q147.477 41.468 144.811 42.732Q142.146 43.996 140.223 43.996ZM154.841 43.996Q152.972 43.996 151.736 42.732Q150.499 41.468 150.499 39.188Q150.499 36.907 153.219 24.625Q155.940 12.342 155.940 6.902L155.610 4.484Q159.896 3.000 163.633 3.000Q164.183 3.769 164.183 5.693Q164.183 10.089 161.408 22.701Q158.632 35.314 158.632 37.374Q158.632 39.435 159.127 39.435L162.974 38.061L163.963 39.985Q162.095 41.468 159.429 42.732Q156.764 43.996 154.841 43.996ZM165.007 33.830Q165.007 26.960 169.156 22.976Q173.305 18.992 178.581 18.992Q181.823 18.992 183.912 20.586Q186.000 22.179 186.000 24.845Q186.000 27.510 184.654 29.323Q183.307 31.137 181.384 32.126Q177.482 34.050 174.240 34.544L172.921 34.709Q173.305 39.875 177.152 39.875Q178.471 39.875 179.955 39.215Q181.439 38.556 182.263 37.896L183.087 37.237L184.406 38.995Q183.967 39.600 182.648 40.589Q181.329 41.578 180.175 42.238Q176.987 43.996 173.195 43.996Q169.404 43.996 167.205 41.304Q165.007 38.611 165.007 33.830ZM172.866 32.016Q175.668 31.522 177.317 29.653Q178.966 27.785 178.966 24.817Q178.966 21.850 177.207 21.850Q175.119 21.850 173.992 25.394Q172.866 28.939 172.866 32.016Z";
  const brandViewBox="0 0 189 53.426";
  const introKey='rochelle-brand-opening';
  let introPlayed=false;
  try{introPlayed=sessionStorage.getItem(introKey)==='1';}catch{}
  gsap.registerPlugin(MorphSVGPlugin);
  const book=`<div class="book"><img src="${R.asset('assets/portfolio/sketchbook.webp')}" width="700" height="543" alt=""><div class="book-note">a little<br>curiosity.<br>a lot of<br>possibility.</div><div class="book-doodle">make it<br>feel right.<svg viewBox="0 0 140 90"><path d="M16 20Q110 5 113 40T25 68Q11 27 53 35M95 59l23-14-4 24"/></svg></div></div>`;
  const phone=`<div class="phone-object"><div class="phone-screen"><small>rochelle / experiments</small><h3>A little<br>more human.</h3><div class="phone-orb"></div><div class="phone-pill">Thoughtful by design ↗</div><div class="phone-bar">Explore the possibilities</div></div></div>`;
  const heroObjects=[
    {id:'chrome-orbit',scale:.84,angle:24,spin:-.65,art:`<img src="${R.asset('assets/hero/chrome-orbit.webp')}" width="900" height="900" alt="">`},
    {id:'iridescent-triangle',scale:.82,angle:-16,spin:.48,art:`<img src="${R.asset('assets/hero/iridescent-triangle.webp')}" width="900" height="900" alt="">`},
    {id:'chrome-bloom',scale:.90,angle:12,spin:.50,art:`<img src="${R.asset('assets/hero/chrome-bloom.webp')}" width="900" height="900" alt="">`},
    {id:'book',scale:1.16,angle:-24,spin:.70,art:book},
    {id:'iridescent-arc',scale:.88,angle:-8,spin:.38,art:`<img src="${R.asset('assets/hero/iridescent-arc.webp')}" width="900" height="900" alt="">`},
    {id:'phone',scale:1.03,angle:16,spin:-.55,art:phone},
    {id:'vinyl',scale:1.08,angle:-12,spin:.90,art:`<img src="${R.asset('assets/portfolio/vinyl.webp')}" width="700" height="700" alt="">`},
    {id:'chrome-pebble',scale:.80,angle:-28,spin:-.42,art:`<img src="${R.asset('assets/hero/chrome-pebble.webp')}" width="900" height="900" alt="">`},
    {id:'iridescent-ribbon',scale:.95,angle:20,spin:.60,art:`<img src="${R.asset('assets/hero/iridescent-ribbon.webp')}" width="900" height="900" alt="">`},
    {id:'iridescent-cross',scale:.78,angle:18,spin:-.58,art:`<img src="${R.asset('assets/hero/iridescent-cross.webp')}" width="900" height="900" alt="">`}
  ];
  R.renderHome=()=>{
    const featured=R.featured.map(slug=>R.showcases.find(p=>p.slug===slug)||R.projects.find(p=>p.slug===slug)).filter(Boolean);
    const names=['Product UI','Interaction design','Design systems','Thoughtful prototyping','Visual storytelling'];
    const brands=['Figma','Future Pay','Bit2Go','G–DORISE','UI / UX','Design systems','Prototyping','Research','Web & mobile','Human first'];
    const brandGroup=brands.map((n,i)=>`<span class="client-name"><small>${String(i+1).padStart(2,'0')}</small>${n}</span>`).join('');
    const cards=featured.map((p,i)=>{
      const project=p.kind==='project',tag=project?'button':'a';
      const target=project?`type="button" data-showcase="${p.slug}" aria-haspopup="dialog" aria-label="查看 ${R.esc(p.brand)} 项目简介"`:`href="${R.link('/work/'+p.slug)}"`;
      const entrance=project?`<span class="project-entry-head"><span class="project-entry-kicker">FEATURED PROJECT <span>${String(i+1).padStart(2,'0')}</span></span><span class="project-entry-title">${R.esc(p.brand)}</span><span class="project-entry-subtitle" lang="zh-CN">${R.esc(p.subtitle)}</span></span><span class="project-entry-footer" lang="zh-CN"><span>查看项目</span><span class="project-entry-arrow" aria-hidden="true">↗</span></span>`:'';
      return `<${tag} class="accordion-card ${project?'accordion-project ':''}${i===0?'is-active':''}" ${target}><span class="accordion-name">${R.esc(p.brand)} <em>${R.esc(p.title)}</em></span><span class="accordion-media"${project?'':' data-pointer="View ↗"'}><img class="accordion-image" src="${R.asset('assets/editorial/gallery-'+String(p.index+1).padStart(2,'0')+'.svg')}" alt="" width="500" height="800" loading="eager" decoding="async">${entrance}</span></${tag}>`;
    }).join('');
    return `<div class="home-opening"><section class="hero" data-theme="dark"><h1 class="hero-headline" aria-label="Rochelle, UI/UX designer"><svg class="hero-logo" viewBox="${brandViewBox}" aria-hidden="true" focusable="false"><defs><filter id="brand-soften" x="-25%" y="-70%" width="150%" height="240%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="0"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 18 -8"/></filter></defs><path d="${brandShape}"/></svg></h1><div class="object-plane" aria-hidden="true">${heroObjects.map((object,i)=>`<div class="hero-object" data-object="${object.id}" style="--object-scale:${object.scale};z-index:${5+i}"><div class="hero-object-art">${object.art}</div></div>`).join('')}</div><div class="hero-side left">a curious<br><em>mind.</em></div><div class="hero-side right"><em>thoughtfully,</em><br>playfully.</div><div class="hero-bottom"><p>UI/UX DESIGNER<br>Making the complex feel clear.</p><a class="hero-scroll" href="#home-services">A little further down <span aria-hidden="true">↓</span></a><span class="hero-year">SELECTED WORK / 2026</span></div></section><section class="services-home" id="home-services" data-theme="dark"><p class="eyebrow">[ What I bring to the table ]</p>${names.map((n,i)=>`<div class="service-row"><small>(${String(i+1).padStart(2,'0')})</small><span>${i===0?'Product <em>UI / UX</em>':i===1?'<em>Interaction</em> design':i===2?'Design <em>systems</em>':i===3?'<em>Thoughtful</em> prototyping':'Visual <em>storytelling</em>'}</span></div>`).join('')}</section></div><section class="intro" data-theme="light"><div class="intro-left"><span class="eyebrow">[ A little about me ]</span><div class="dot-flower" aria-hidden="true">${'<i></i>'.repeat(25)}</div></div><div><p class="intro-text" data-word-reveal>I’m Rochelle, a UI/UX designer turning complex systems into <em>clear, human experiences.</em> From payments to everyday interactions, I bring structure, curiosity, and a little <em>unexpected delight.</em></p><a class="text-link" href="#/about">Meet the mind behind the pixels <span aria-hidden="true">↗</span></a></div></section><div class="selected-heading" data-theme="light"><div><p class="eyebrow">[ Ideas made tangible ]</p><h2>Selected <em>work.</em></h2></div><span class="scribble" aria-hidden="true">scroll to explore ↘</span></div><section class="accordion-section" id="selected-work" aria-label="${featured.length} selected projects and design studies" data-theme="light"><div class="accordion-sticky"><span class="accordion-counter">01 / ${String(featured.length).padStart(2,'0')}</span><div class="accordion-track">${cards}</div></div></section><section class="client-band" data-theme="light"><p class="eyebrow">[ My projects, tools & ways of thinking — not a client list ]</p><div class="marquee-viewport"><div class="marquee-track"><div class="marquee-group">${brandGroup}</div><div class="marquee-group" aria-hidden="true">${brandGroup}</div></div></div></section>${R.cta()}${R.footer()}`;
  };
  let routeCleanups=[],basePath='',currentPath='',article=null,renderVersion=0,currentKey='',lastLocation='';
  const positions=new Map();
  let serial=0;
  const routeParts=()=>{const raw=location.hash.slice(1)||'/';const split=raw.split('#');return {path:split[0].startsWith('/')?split[0]:'/',anchor:split[1]||(!raw.startsWith('/')?raw:'')};};
  history.scrollRestoration='manual';
  if(!history.state?.rochelleKey)history.replaceState({rochelleKey:'r0'},'',location.href);
  currentKey=history.state.rochelleKey;
  function markNavigation(path){
    const section=path.startsWith('/post/')?'blog':path.split('/')[1]||'';
    header.querySelectorAll('[data-nav]').forEach(a=>{if(a.dataset.nav===section)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  }
  function closeMenu(){
    if(!header.classList.contains('menu-open'))return;
    header.classList.remove('menu-open');const button=header.querySelector('.menu-toggle');button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Open navigation');R.unlock();main.inert=false;
  }
  header.querySelector('.menu-toggle').addEventListener('click',()=>{
    const open=header.classList.contains('menu-open');if(open){closeMenu();return;}
    header.classList.add('menu-open');header.querySelector('.menu-toggle').setAttribute('aria-expanded','true');header.querySelector('.menu-toggle').setAttribute('aria-label','Close navigation');R.lock();main.inert=true;
  });
  header.addEventListener('keydown',e=>{
    if(!header.classList.contains('menu-open'))return;
    if(e.key==='Escape'){closeMenu();header.querySelector('.menu-toggle').focus();}
    if(e.key==='Tab'){const items=[header.querySelector('.menu-toggle'),...header.querySelectorAll('nav a')],first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
  });
  R.go=(path,options={})=>{
    if(path===currentPath&&!options.anchor){window.scrollTo({top:0,behavior:R.reduced.matches?'instant':'smooth'});return;}
    positions.set(currentKey,window.scrollY);
    const key='r'+Date.now()+'-'+(++serial),state={rochelleKey:key,articleFromBlog:basePath==='/blog'&&path.startsWith('/post/')&&!currentPath.startsWith('/post/')};
    history[options.replace?'replaceState':'pushState'](state,'','#'+path);
    void renderRoute(options.replace?'replace':'push');
  };
  document.addEventListener('click',e=>{
    const showcase=e.target.closest('[data-showcase]');
    if(showcase&&!e.defaultPrevented){R.openShowcase(showcase.dataset.showcase,showcase);return;}
    const link=e.target.closest('a[href]');if(!link||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||link.download)return;
    const href=link.getAttribute('href');
    if(href.startsWith('#/')){e.preventDefault();closeMenu();R.go(href.slice(1));}
    else if(href.startsWith('#')&&href.length>1){const target=document.getElementById(href.slice(1));if(target){e.preventDefault();target.scrollIntoView({behavior:R.reduced.matches?'instant':'smooth'});if(href==='#main')target.focus({preventScroll:true});}}
  });
  async function renderRoute(mode='initial'){
    const version=++renderVersion;
    const {path,anchor}=routeParts();
    if(lastLocation===location.hash&&mode==='event')return;
    lastLocation=location.hash;
    if(mode==='event')positions.set(currentKey,window.scrollY);
    currentKey=history.state?.rochelleKey||'direct-'+(++serial);
    if(!history.state?.rochelleKey)history.replaceState({rochelleKey:currentKey},'',location.href);
    const isArticle=path.startsWith('/post/');
    const nextBase=isArticle?'/blog':path;
    closeMenu();
    if(article){const old=article;article=null;await old.close(false,nextBase!=='/blog');if(version!==renderVersion)return;}
    document.querySelectorAll('#dialog-root .overlay').forEach(el=>{if(!el.classList.contains('article-overlay'))el.querySelector('.dialog-close')?.click();});
    if(basePath!==nextBase||mode==='initial'){
      routeCleanups.forEach(fn=>{try{fn();}catch(error){console.error(error);}});routeCleanups=[];
      R.cleanups.splice(0).forEach(fn=>fn());
      let html,mount=null;
      if(nextBase==='/'){html=R.renderHome();}
      else if(nextBase==='/work'){html=R.renderWork();mount=R.mountWork;}
      else if(nextBase.startsWith('/work/')){html=R.renderCase(nextBase.slice(6));mount=R.mountCase;}
      else if(nextBase==='/about'){html=R.renderAbout();mount=R.mountAbout;}
      else if(nextBase==='/careers'){html=R.renderCareers();mount=R.mountCareers;}
      else if(nextBase==='/blog'){html=R.renderBlog();mount=R.mountBlog;}
      else if(nextBase==='/contact'){html=R.renderContact();}
      else if(nextBase==='/privacy-policy'||nextBase==='/cookies'){html=R.renderLegal(nextBase.slice(1));mount=R.mountLegal;}
      else html=`<section class="page-wrap"><p class="eyebrow">404 / This page wandered off</p><h1 class="display">Let’s find<br>our <em>way.</em></h1><a class="text-link" href="#/work">Back to selected work ↗</a></section>${R.footer()}`;
      main.innerHTML=html;
      basePath=nextBase;
      // All image URLs pass through one manifest, including authored SVGs.
      main.querySelectorAll('img[src]').forEach(img=>{const src=img.getAttribute('src');if(src?.startsWith('assets/'))img.src=R.asset(src);});
      const pageCleanup=mount?.(main);if(typeof pageCleanup==='function')routeCleanups.push(pageCleanup);
      routeCleanups.push(R.mountCommon(main));routeCleanups.push(mountMotion(main,!anchor&&(mode!=='event'||!(positions.get(currentKey)>0))));
      window.scrollTo(0,mode==='event'?(positions.get(currentKey)||0):0);
      if(mode!=='initial'&&!isArticle)main.focus({preventScroll:true});
    }else if(!isArticle&&mode==='event'){window.scrollTo(0,positions.get(currentKey)??window.scrollY);}
    currentPath=path;markNavigation(path);
    const heading=main.querySelector('h1');document.title=(isArticle?R.posts.find(p=>p.slug===path.slice(6))?.title:heading?.textContent.trim())+' — Rochelle';
    if(path==='/')document.title='Rochelle — Thoughtfully, playfully.';
    if(anchor){requestAnimationFrame(()=>{const target=document.getElementById(anchor);target?.scrollIntoView({behavior:R.reduced.matches?'instant':'smooth',block:'start'});});}
    if(isArticle){
      const post=R.posts.find(p=>p.slug===path.slice(6));
      if(!post){R.go('/blog',{replace:true});return;}
      const fromBlog=history.state?.articleFromBlog===true;
      article=R.openDialog(R.articleHTML(post.slug),{className:'article-overlay',label:post.title,onClose:()=>{
        article=null;
        if(fromBlog){history.back();}
        else{history.replaceState({rochelleKey:currentKey},'','#/blog');currentPath='/blog';lastLocation=location.hash;markNavigation('/blog');document.title='Journal — Rochelle';}
      }});
    }
    updateTheme();
  }
  window.addEventListener('popstate',()=>void renderRoute('event'));
  window.addEventListener('hashchange',()=>{if(lastLocation!==location.hash)void renderRoute('event');});
  document.addEventListener('visibilitychange',()=>document.body.classList.toggle('page-hidden',document.hidden));
  let themePending=false;
  function updateTheme(){
    themePending=false;
    const themes=[...main.querySelectorAll('[data-theme]')];
    let dark=false;
    for(const el of themes){const surface=el.hasAttribute('data-about-pin')?el.querySelector('.about-panel'):el;const r=surface.getBoundingClientRect();if(r.top<=55&&r.bottom>55){dark=el.dataset.theme==='dark';break;}}
    if(!themes.length&&basePath==='/contact')dark=!!main.querySelector('.contact-dark');
    header.classList.toggle('light',!dark);
  }
  window.addEventListener('scroll',()=>{if(!themePending){themePending=true;requestAnimationFrame(updateTheme);}},{passive:true});
  let logoStates;
  function getLogoStates(){
    if(logoStates)return logoStates;
    const raw=MorphSVGPlugin.getRawPath(brandShape);
    const bounds=segments=>{
      let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
      for(const segment of segments)for(let i=0;i<segment.length;i+=2){left=Math.min(left,segment[i]);right=Math.max(right,segment[i]);top=Math.min(top,segment[i+1]);bottom=Math.max(bottom,segment[i+1]);}
      return {left,top,width:right-left,height:bottom-top};
    };
    const base=bounds(raw),contours=raw.map(segment=>{
      const box=bounds([segment]);let area=0;
      for(let i=0;i<segment.length;i+=2){const next=(i+2)%segment.length;area+=segment[i]*segment[next+1]-segment[next]*segment[i+1];}
      return {cx:box.left+box.width/2,cy:box.top+box.height/2,area};
    });
    const outside=Math.sign(contours.reduce((largest,c)=>Math.abs(c.area)>Math.abs(largest.area)?c:largest).area);
    logoStates=[Math.PI/2,Math.PI,Math.PI*1.5].map(phase=>{
      const shaped=raw.map((segment,index)=>{
        const contour=contours[index],counter=Math.sign(contour.area)!==outside;
        const pulse=Math.sin(phase+contour.cx*.065)-Math.sin(contour.cx*.065);
        const squeeze=Math.cos(phase+contour.cx*.045)-Math.cos(contour.cx*.045);
        const sx=1+(counter?-.025:.022)*pulse,sy=1+.028*squeeze+(counter?-.020:.013)*pulse;
        const result=segment.slice();result.closed=segment.closed;
        for(let i=0;i<segment.length;i+=2){
          const x=segment[i],y=segment[i+1],envelope=Math.sin(Math.PI*clamp((x-base.left)/base.width));
          result[i]=contour.cx+(x-contour.cx)*sx+.42*(Math.sin(phase+y*.11+x*.026)-Math.sin(y*.11+x*.026))*envelope;
          result[i+1]=contour.cy+(y-contour.cy)*sy+.70*(Math.sin(phase+x*.062)-Math.sin(x*.062))*envelope;
        }
        return result;
      });
      // Anchor the overall envelope while strokes and counterforms breathe inside it.
      const box=bounds(shaped);
      for(const segment of shaped)for(let i=0;i<segment.length;i+=2){segment[i]=base.left+(segment[i]-box.left)*base.width/box.width;segment[i+1]=base.top+(segment[i+1]-box.top)*base.height/box.height;}
      return MorphSVGPlugin.rawPathToString(shaped);
    });
    logoStates.push(brandShape);
    return logoStates;
  }
  function mountLogoMotion(hero){
    const logo=hero.querySelector('.hero-logo'),path=logo.querySelector('path');
    let timeline=null,ready=false,visible=false,disposed=false;
    function sync(){
      if(!ready||disposed)return;
      if(R.reduced.matches){timeline?.pause(0);path.setAttribute('d',brandShape);return;}
      const paused=!visible||document.hidden||R.motionPaused;
      if(!timeline){
        if(paused)return;
        timeline=gsap.timeline({paused:true,repeat:-1,defaults:{duration:3.5,ease:'sine.inOut'}});
        for(const shape of getLogoStates())timeline.to(path,{morphSVG:{shape,shapeIndex:0,type:'linear',map:'position'},immediateRender:false});
      }
      timeline.paused(paused);
    }
    const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();});
    observer.observe(logo);
    document.addEventListener('visibilitychange',sync);document.addEventListener('rochelle-motion',sync);R.reduced.addEventListener('change',sync);
    return {
      start(){ready=true;sync();},
      dispose(){disposed=true;observer.disconnect();timeline?.kill();document.removeEventListener('visibilitychange',sync);document.removeEventListener('rochelle-motion',sync);R.reduced.removeEventListener('change',sync);path.setAttribute('d',brandShape);path.removeAttribute('data-original');}
    };
  }
  function mountBrandOpening(hero,allowIntro,onReady){
    const play=allowIntro&&!introPlayed&&!R.reduced.matches&&!R.motionPaused;
    introPlayed=true;
    try{sessionStorage.setItem(introKey,'1');}catch{}
    const logo=hero.querySelector('.hero-logo'),path=logo.querySelector('path'),soften=logo.querySelector('feGaussianBlur');
    const helpers=[...hero.querySelectorAll('.hero-side,.hero-bottom')],objects=[...hero.querySelectorAll('.hero-object-art')];
    let timeline,context,finished=false;
    const detach=()=>{
      window.removeEventListener('wheel',finish);window.removeEventListener('pointerdown',finish);
      window.removeEventListener('touchstart',finish);window.removeEventListener('keydown',finish);
      document.removeEventListener('visibilitychange',visibility);
      R.reduced.removeEventListener('change',preference);document.removeEventListener('rochelle-motion',preference);
    };
    function finish(){
      if(finished)return;
      finished=true;timeline?.kill();context?.revert();
      path.setAttribute('d',brandShape);path.removeAttribute('data-original');
      path.removeAttribute('filter');
      document.body.classList.remove('brand-opening');hero.dataset.intro='complete';
      detach();onReady();
    }
    function visibility(){if(document.hidden)timeline?.pause();else timeline?.resume();}
    function preference(){if(R.reduced.matches||R.motionPaused)finish();}
    if(!play){finish();return detach;}
    hero.dataset.intro='playing';document.body.classList.add('brand-opening');
    const box=logo.viewBox.baseVal,size=clamp(44*box.width/logo.getBoundingClientRect().width,6,22),x=box.x+(box.width-size)/2,y=box.y+(box.height-size)/2,r=size*.24;
    const seed=`M${x+r} ${y}H${x+size-r}Q${x+size} ${y} ${x+size} ${y+r}V${y+size-r}Q${x+size} ${y+size} ${x+size-r} ${y+size}H${x+r}Q${x} ${y+size} ${x} ${y+size-r}V${y+r}Q${x} ${y} ${x+r} ${y}Z`;
    context=gsap.context(()=>{
      gsap.set(path,{attr:{d:seed,filter:'url(#brand-soften)'}});
      gsap.set(soften,{attr:{stdDeviation:1}});
      gsap.set([header,...helpers,...objects],{autoAlpha:0});
      gsap.set(header,{y:-12});gsap.set(helpers,{y:16});
      timeline=gsap.timeline({onComplete:finish});
      timeline
        .to(logo,{scaleX:1.3,scaleY:.7,rotation:-7,duration:.16,ease:'power2.in'},0)
        .to(path,{morphSVG:{shape:brandShape,type:'rotational',map:'position'},duration:.62,ease:'power3.inOut'},.16)
        .to(soften,{attr:{stdDeviation:0},duration:.62,ease:'power2.in'},.16)
        .set(path,{attr:{filter:''}},.78)
        .to(logo,{scaleX:1.1,scaleY:1.16,rotation:1.2,skewX:-3,duration:.44,ease:'power3.out'},.16)
        .to(logo,{scaleX:.965,scaleY:.95,rotation:-.6,skewX:1.4,duration:.2,ease:'sine.inOut'},.6)
        .to(logo,{scaleX:1.018,scaleY:1.025,rotation:.25,skewX:-.5,duration:.18,ease:'sine.inOut'},.8)
        .to(logo,{scaleX:1,scaleY:1,rotation:0,skewX:0,duration:.24,ease:'power2.out'},.98)
        .to(header,{autoAlpha:1,y:0,duration:.26,ease:'power2.out'},1.24)
        .to(helpers,{autoAlpha:1,y:0,duration:.24,stagger:.04,ease:'power2.out'},1.53)
        .call(onReady,[],1.87)
        .to(objects,{autoAlpha:1,duration:.42,stagger:.035,ease:'power2.out'},1.87);
    },hero);
    window.addEventListener('wheel',finish,{passive:true});window.addEventListener('pointerdown',finish,{passive:true});
    window.addEventListener('touchstart',finish,{passive:true});window.addEventListener('keydown',finish);
    document.addEventListener('visibilitychange',visibility);
    R.reduced.addEventListener('change',preference);document.addEventListener('rochelle-motion',preference);
    if(document.hidden)timeline.pause();
    return finish;
  }
  function mountMotion(root,allowIntro){
    const hero=root.querySelector('.hero'),objectNodes=[...root.querySelectorAll('.hero-object')],rows=[...root.querySelectorAll('.service-row')];
    const accordion=root.querySelector('.accordion-section'),track=root.querySelector('.accordion-track'),cards=[...root.querySelectorAll('.accordion-card')],counter=root.querySelector('.accordion-counter');
    const about=root.querySelector('[data-about-pin]'),aboutPanel=root.querySelector('.about-panel'),aboutLayers=[...root.querySelectorAll('.about-layer')];
    const wordContainer=root.querySelector('[data-word-reveal]');
    if(wordContainer){
      const walker=document.createTreeWalker(wordContainer,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
      nodes.forEach(node=>{const fragment=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(word=>{if(!word.trim())fragment.append(document.createTextNode(word));else{const span=document.createElement('span');span.className='intro-word';span.textContent=word;fragment.append(span);}});node.replaceWith(fragment);});
    }
    const words=[...root.querySelectorAll('.intro-word')];
    let frame=0,last=0,elapsed=0,stopped=false,dirty=true,heroVisible=true,heroReady=!hero,active=-1;
    let objectGeometry=[];
    // Studio Loop's conveyor cadence: one slot per beat, then a short settled hold.
    const travelClock=time=>{
      const beat=time/1.4,whole=Math.floor(beat),t=clamp((beat-whole)*1.4/1.12);
      // Integrated t²(1-t)⁴: gentle launch, quicker push, long soft landing.
      return whole+t*t*t*(35+t*(-105+t*(126+t*(-70+15*t))));
    };
    let measures={width:innerWidth,height:innerHeight,accordionTop:0,accordionHeight:0,galleryHeight:0,galleryTravel:0,galleryVertical:false,introTop:0,introHeight:0,aboutTop:0,aboutHeight:0,rows:[]};
    const measure=()=>{
      const y=window.scrollY;
      if(hero){
        const width=hero.clientWidth,height=hero.clientHeight;
        const sizes=objectNodes.map(el=>({width:el.offsetWidth,height:el.offsetHeight}));
        // One shared track, sized for the largest rotating object and its shadow.
        const radius=sizes.reduce((largest,size)=>Math.max(largest,Math.hypot(size.width,size.height)/2),0);
        const margin=radius+18+4*16+16;
        const travel=width+2*margin,slope=Math.min(height/width,1.15),offsetY=(height-width*slope)/2,clock=travelClock(elapsed);
        objectGeometry=sizes.map((size,i)=>{
          const previous=objectGeometry[i];
          const phase=previous?wrapUnit(previous.phase-(clock-previous.time)*previous.rate):(i/heroObjects.length+.02)%1;
          return {width:size.width,height:size.height,startX:-margin,startY:offsetY-margin*slope,travel,rise:travel*slope,rate:1/heroObjects.length,phase,time:clock,swayPhase:i*.63,swayBase:Math.sin(i*.63)};
        });
      }
      measures={width:document.documentElement.clientWidth,height:innerHeight,accordionTop:accordion?accordion.getBoundingClientRect().top+y:0,accordionHeight:accordion?.offsetHeight||0,introTop:wordContainer?wordContainer.getBoundingClientRect().top+y:0,introHeight:wordContainer?.offsetHeight||0,aboutTop:about?about.getBoundingClientRect().top+y:0,aboutHeight:about?.offsetHeight||0,rows:rows.map(r=>r.getBoundingClientRect().top+y+r.offsetHeight/2)};
      if(accordion){
        const stage=track.parentElement,vertical=innerWidth<1024;
        const height=stage.offsetHeight,width=stage.clientWidth;
        const mediaHeight=vertical?Math.min((width-56)*1.6,Math.max(1,height-200)):Math.max(1,height-56);
        // Measure the end state, where the last image has no right margin.
        const extent=vertical?110+cards.length*70+(cards.length-1)*32+16+mediaHeight+16:
          (cards.length-1)*clamp(innerWidth*.104,80,200)+mediaHeight*.625+innerWidth*.03+64;
        measures.galleryHeight=height;measures.galleryVertical=vertical;
        measures.galleryTravel=Math.ceil(Math.max(0,extent-(vertical?height:width)));
      }
      dirty=true;schedule();
    };
    // The shared stage includes artwork extending below the hero.
    const observer=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;last=0;if(heroVisible)schedule();},{threshold:0});if(hero)observer.observe(hero.parentElement);
    const resize=new ResizeObserver(measure);resize.observe(root);if(hero)resize.observe(hero);objectNodes.forEach(el=>resize.observe(el));
    function schedule(){if(!frame&&!stopped&&!document.hidden)frame=requestAnimationFrame(tick);}
    function tick(now){
      frame=0;if(stopped||document.hidden)return;
      const dt=last?Math.min((now-last)/1000,.06):0;last=now;
      const reduced=R.reduced.matches,paused=R.motionPaused;
      const w=measures.width,h=measures.height,y=window.scrollY;
      if(hero&&heroVisible){
        if(heroReady&&!reduced&&!paused)elapsed+=dt;
        const clock=travelClock(elapsed);
        objectNodes.forEach((el,i)=>{
          const object=heroObjects[i],geometry=objectGeometry[i];
          const p=wrapUnit(geometry.phase-(clock-geometry.time)*geometry.rate);
          const depth=Math.floor(p*heroObjects.length)+3;
          if(geometry.depth!==depth){geometry.depth=depth;el.style.zIndex=String(depth);}
          const x=geometry.startX+p*geometry.travel-geometry.width/2;
          const yy=geometry.startY+p*geometry.rise-geometry.height/2;
          const angle=object.angle+5*(Math.sin(clock*object.spin*.7+geometry.swayPhase)-geometry.swayBase);
          el.style.transform=`translate3d(${x.toFixed(2)}px,${yy.toFixed(2)}px,0) rotate(${angle.toFixed(2)}deg)`;
        });
      }
      if(dirty){
        if(rows.length){let selected=0,best=Infinity;measures.rows.forEach((center,i)=>{const distance=Math.abs(center-y-h*.52);if(distance<best){selected=i;best=distance;}});rows.forEach((row,i)=>row.classList.toggle('active',i===selected));}
        if(words.length){const progress=reduced?1:clamp((y+h*.82-measures.introTop)/(h*.5+measures.introHeight));words.forEach((word,i)=>word.style.opacity=String(.25+.75*clamp(progress*words.length-i)));}
        if(about&&aboutPanel){const p=reduced||w<768?0:clamp((y-measures.aboutTop)/(measures.aboutHeight-h));aboutPanel.style.transform=`scale(${1-.26*clamp(p/.6)})`;aboutPanel.style.borderRadius=`${p*28}px`;aboutLayers.forEach((layer,i)=>{layer.style.transform=`translate(${(i%2?1:-1)*p*(55+i*16)}px,${(i%3-1)*p*85}px) scale(${1-p*.2}) rotate(${(i%2?1:-1)*p*8}deg)`;layer.style.opacity=String(1-clamp((p-.6)/.4)*.4);});}
      }
      if(dirty&&accordion){
        const span=Math.max(1,measures.accordionHeight-measures.galleryHeight);
        const progress=clamp((y-measures.accordionTop)/span);
        document.body.classList.toggle('gallery-view',!reduced&&y>=measures.accordionTop&&y<measures.accordionTop+span);
        if(reduced){
          track.style.transform='';active=-1;
          cards.forEach(card=>card.removeAttribute('aria-current'));
        }else{
          // The reference switches one open image at each half-step; only
          // the track translation is continuous. No timer or width tween.
          const index=Math.round(progress*(cards.length-1));
          if(index!==active){
            active=index;
            cards.forEach((card,i)=>{
              card.classList.toggle('is-active',i===index);
              if(i===index)card.setAttribute('aria-current','true');
              else card.removeAttribute('aria-current');
            });
            if(counter)counter.textContent=String(index+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
          }
          const offset=-progress*measures.galleryTravel;
          track.style.transform=measures.galleryVertical?`translate3d(0,${offset}px,0)`:`translate3d(${offset}px,0,0)`;
        }
      }
      if(dirty&&about)updateTheme();
      dirty=false;
      if(heroVisible&&hero&&heroReady&&!reduced&&!paused)schedule();
    }
    const scroll=()=>{dirty=true;schedule();},visibility=()=>{last=0;if(document.hidden){cancelAnimationFrame(frame);frame=0;}else{dirty=true;schedule();}},motion=()=>{last=0;dirty=true;measure();};
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure);document.addEventListener('visibilitychange',visibility);R.reduced.addEventListener('change',motion);document.addEventListener('rochelle-motion',motion);
    const galleryFocus=e=>{
      const card=e.target.closest('.accordion-card');
      if(!card||!card.matches(':focus-visible')||R.reduced.matches)return;
      const index=cards.indexOf(card);
      const span=Math.max(1,measures.accordionHeight-measures.galleryHeight);
      window.scrollTo({top:measures.accordionTop+span*index/Math.max(1,cards.length-1),behavior:'instant'});
      scroll();
    };
    accordion?.addEventListener('focusin',galleryFocus);
    const logoMotion=hero?mountLogoMotion(hero):null;
    const disposeOpening=hero?mountBrandOpening(hero,allowIntro,()=>{if(stopped)return;if(!heroReady){heroReady=true;last=0;schedule();}if(hero.dataset.intro==='complete')logoMotion.start();}):null;
    document.fonts.ready.then(()=>{if(!stopped)measure();});measure();
    return()=>{stopped=true;disposeOpening?.();logoMotion?.dispose();cancelAnimationFrame(frame);document.body.classList.remove('gallery-view');accordion?.removeEventListener('focusin',galleryFocus);observer.disconnect();resize.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility);R.reduced.removeEventListener('change',motion);document.removeEventListener('rochelle-motion',motion);};
  }
  // Pointer sticker owns its transform; page animations never write to this element.
  const sticker=document.querySelector('.pointer-sticker');let pointerFrame=0,px=0,py=0,targetX=0,targetY=0,pointerTime=0;
  const coarse=matchMedia('(pointer:coarse)');
  function moveSticker(time){const dt=pointerTime?Math.min((time-pointerTime)/1000,.05):1/60;pointerTime=time;const amount=1-Math.pow(.85,dt*60);px+=(targetX-px)*amount;py+=(targetY-py)*amount;sticker.style.transform=`translate3d(${px+15}px,${py+15}px,0) rotate(-12deg)`;if(Math.abs(targetX-px)+Math.abs(targetY-py)>.5)pointerFrame=requestAnimationFrame(moveSticker);else pointerFrame=0;}
  document.addEventListener('pointermove',e=>{if(coarse.matches||R.reduced.matches)return;targetX=e.clientX;targetY=e.clientY;const target=e.target.closest('[data-pointer],.project-card,.work-card');sticker.classList.toggle('visible',!!target&&!document.querySelector('.overlay'));if(target)sticker.textContent=target.dataset.pointer||'View ↗';if(!pointerFrame)pointerFrame=requestAnimationFrame(moveSticker);},{passive:true});
  document.addEventListener('pointerleave',()=>sticker.classList.remove('visible'));
  const motionButton=document.createElement('button');motionButton.className='motion-control';motionButton.setAttribute('aria-pressed','false');motionButton.textContent='Ⅱ Pause motion';motionButton.addEventListener('click',()=>{R.motionPaused=!R.motionPaused;document.body.classList.toggle('motion-paused',R.motionPaused);motionButton.setAttribute('aria-pressed',String(R.motionPaused));motionButton.textContent=R.motionPaused?'▷ Resume motion':'Ⅱ Pause motion';document.dispatchEvent(new Event('rochelle-motion'));});document.body.append(motionButton);
  document.documentElement.classList.add('motion-ready');
  void renderRoute();
})();
