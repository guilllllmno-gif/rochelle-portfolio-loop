/* Rochelle standalone runtime. No network requests, accounts or tracking. */
(() => {
  'use strict';
  const R = window.R = {};
  R.asset = path => window.ROCHELLE_ASSETS?.[path] || path;
  R.esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  R.link = path => '#' + path;
  R.previewSrc = R.asset('assets/motion-preview.mp4');
  R.cleanups = [];
  R.onCleanup = fn => R.cleanups.push(fn);
  R.reduced = matchMedia('(prefers-reduced-motion: reduce)');
  R.motionPaused = false;
  R.go = path => { location.hash = path; };
  const esc = R.esc;
  let locks = 0;
  R.lock = () => { if (++locks === 1) document.body.classList.add('locked'); };
  R.unlock = () => { locks = Math.max(0, locks - 1); if (!locks) document.body.classList.remove('locked'); };
  R.cta = () => `<section class="project-cta" data-theme="light"><span class="cta-spark" aria-hidden="true">✳</span><div class="cta-content reveal"><h2>Let’s make<br>something <em>worth</em><br><span class="hand">feeling.</span></h2><a class="text-link" href="#/contact">Your next good idea starts here <span aria-hidden="true">↗</span></a></div><div class="cta-notebook cta-collage" aria-hidden="true"><img src="${R.asset('assets/editorial/cta-collage.webp')}" width="900" height="900" loading="lazy" alt=""></div></section><section class="newsletter-strip"><p><span class="eyebrow">Notes from my little corner of the internet</span>Good design.<br><em>Better conversations.</em></p><button type="button" data-newsletter>Keep me in the loop <span aria-hidden="true">↗</span></button></section>`;
  R.footer = () => `<footer class="site-footer" data-theme="dark"><div class="footer-wave" aria-hidden="true"></div><div class="footer-viewport"><div class="footer-canvas"><div class="footer-top"><h2>A curious mind.<br>An <em>open</em> conversation.</h2><nav class="footer-links" aria-label="Footer"><div><a href="#/work">Selected work ↗</a><a href="#/about">A little about me ↗</a></div><div><a href="#/contact">Let’s talk ↗</a><a href="#/careers">Collaborate ↗</a></div><div><a href="#/blog">Design journal ↗</a><button type="button" data-newsletter>Join the loop ↗</button></div></nav></div><div class="footer-meta"><p><span>ROCHELLE / UI & UX</span><em>Thoughtfully. Playfully.</em></p><span class="footer-meta-line" aria-hidden="true"></span><span class="eyebrow">A little curiosity goes a long way.</span><span class="footer-meta-line" aria-hidden="true"></span><a href="#/">Back to top ↑</a><span>© 2026</span></div><div class="footer-fan" aria-hidden="true">${['perspective','angles','curiosity','thread','worlds'].map((s,i)=>`<div class="footer-card" style="--angle:${[-29.85,-16.42,0,16.26,32.52][i]}deg" data-angle="${[-29.85,-16.42,0,16.26,32.52][i]}"><div class="footer-card-motion"><img src="${R.asset('assets/editorial/footer/'+s+'.webp')}" alt="" loading="lazy" decoding="async" width="900" height="1230" draggable="false"></div></div>`).join('')}</div><div class="footer-bottom"><a href="#/privacy-policy">Privacy Policy</a><a href="#/cookies">Cookies</a></div></div></div></footer>`;
  R.openDialog = (html, options = {}) => {
    const trigger = options.trigger || document.activeElement;
    const overlay = document.createElement('div');
    overlay.className = 'overlay ' + (options.className || '');
    overlay.innerHTML = `<section class="dialog-panel" role="dialog" aria-modal="true" aria-label="${esc(options.label || 'Dialog')}" tabindex="-1"><button type="button" class="dialog-close" aria-label="Close dialog">×</button>${html}</section>`;
    const panel = overlay.firstElementChild;
    const main = document.querySelector('main'), header = document.querySelector('header');
    const previousInert = [main.inert, header.inert];
    main.inert = true; header.inert = true;
    R.lock();
    document.getElementById('dialog-root').append(overlay);
    let closing = false, done, openFrame;
    const finished = new Promise(resolve => { done = resolve; });
    function cleanup(notify) {
      cancelAnimationFrame(openFrame);
      document.removeEventListener('keydown', onKey, true);
      overlay.remove();
      main.inert = previousInert[0]; header.inert = previousInert[1];
      R.unlock();
      if (trigger?.isConnected && typeof trigger.focus === 'function') trigger.focus({preventScroll:true});
      if (notify) options.onClose?.();
      done();
    }
    function close(notify = true, immediate = false) {
      if (closing) return finished;
      closing = true;
      overlay.classList.remove('open');
      const delay = immediate ? 0 : R.reduced.matches ? 130 : options.className?.includes('article') ? 1000 : 300;
      setTimeout(() => cleanup(notify), delay);
      return finished;
    }
    function focusables() { return [...panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]')].filter(el => el.getClientRects().length); }
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
      if (e.key === 'Tab') {
        const items = focusables(), first = items[0], last = items.at(-1);
        if (!first) { e.preventDefault(); panel.focus(); }
        else if (e.shiftKey && (document.activeElement === first || document.activeElement === panel)) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener('keydown', onKey, true);
    overlay.addEventListener('click', e => { if (e.target === overlay || e.target.closest('.dialog-close')) close(); });
    openFrame = requestAnimationFrame(() => { overlay.classList.add('open'); panel.focus({preventScroll:true}); });
    return {close, element:panel, overlay};
  };
  R.newsletter = trigger => {
    if (document.querySelector('.overlay')) return;
    const dialog = R.openDialog(`<p class="eyebrow">Rochelle’s design notes</p><h2>Stay a little<br><em>curious.</em></h2><p>Ideas about interfaces, thoughtful interactions, and the things I notice along the way.</p><form class="newsletter-form"><label for="newsletter-email">Your email address</label><input id="newsletter-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required><button class="button" type="submit">Try the sign-up interaction <span>↗</span></button><p class="form-status" role="status" aria-live="polite"></p><p class="demo-note">Local interaction demo. No subscription service is connected. Your email is not saved or sent.</p></form>`, {trigger, label:'Newsletter sign-up demo'});
    const form = dialog.element.querySelector('form');
    let timer;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('button'); button.disabled = true; button.textContent = 'Checking locally…';
      timer = setTimeout(() => { if (!form.isConnected) return; button.disabled = false; button.textContent = 'Try again ↗'; form.querySelector('.form-status').textContent = 'Email format checked. Nothing was sent — this is a local demonstration, not a subscription.'; }, 550);
    });
    return () => clearTimeout(timer);
  };
  document.addEventListener('click', e => {
    const button = e.target.closest('[data-newsletter]');
    if (button) { e.preventDefault(); R.newsletter(button); }
  });
  function mountFooter(root) {
    const footer = root.querySelector('.site-footer');
    if (!footer) return () => {};
    const viewport = footer.querySelector('.footer-viewport');
    const canvas = footer.querySelector('.footer-canvas');
    const cards = [...footer.querySelectorAll('.footer-card')].map(el => ({
      el, motion:el.firstElementChild, angle:Number(el.dataset.angle), x:0, y:0
    }));
    let frame=0, lastTime=0, disposed=false, keyboard=false, previousPointer=null, pointer=null;
    let footerTop=0, footerHeight=0, canvasHeight=0, width=0, height=0;
    const clamp = (n, min=0, max=1) => Math.max(min, Math.min(max, n));
    function schedule() {
      if (!frame && !disposed && !document.hidden) frame=requestAnimationFrame(update);
    }
    function measure() {
      footerTop=footer.getBoundingClientRect().top+scrollY;
      footerHeight=footer.offsetHeight;
      canvasHeight=canvas.offsetHeight;
      width=footer.clientWidth;
      height=innerHeight;
      schedule();
    }
    function update(time) {
      frame=0;
      if (disposed || document.hidden) return;
      const dt=lastTime ? Math.min((time-lastTime)/1000,.05) : 1/60;
      lastTime=time;
      const top=footerTop-scrollY;
      const visible=top<height && top+footerHeight>0;
      if (!visible) {keyboard=false;footer.classList.remove('footer-keyboard');}
      const quiet=R.reduced.matches || R.motionPaused || keyboard || width<1024;
      document.body.classList.toggle('footer-view',visible && top<height*.25);
      const entry=clamp((height-top)/height);
      // Counter-scroll inside the clipped footer: preceding content reveals
      // the stationary canvas; only its excess height travels at the end.
      viewport.style.transform=quiet || !visible ? '' : `translate3d(0,${-Math.max(0,top)}px,0)`;
      const travel=clamp(-top,0,Math.max(0,canvasHeight-height));
      canvas.style.transform=quiet || !visible ? '' : `translate3d(0,${120*(1-entry)**2-travel}px,0)`;
      canvas.style.opacity=quiet || !visible ? '1' : String(clamp(entry*2));
      let moving=false;
      const impulse=!quiet && visible && pointer;
      // Read all card geometry before writing any individual transforms.
      const bounds=impulse ? cards.map(card=>card.el.getBoundingClientRect()) : null;
      cards.forEach((card,i)=>{
        if (quiet || !visible) { card.x=0; card.y=0; }
        else {
          const decay=Math.exp(-dt*5.5);
          card.x*=decay; card.y*=decay;
          if (impulse) {
            const rect=bounds[i];
            const distance=Math.hypot(pointer.x-rect.x-rect.width/2,pointer.y-rect.y-rect.height/2);
            const weight=Math.exp(-distance/Math.max(1,width*.18));
            card.x=clamp(card.x+pointer.dx*.14*weight,-22,22);
            card.y=clamp(card.y+pointer.dy*.12*weight,-18,18);
          }
          if (Math.abs(card.x)+Math.abs(card.y)<.02) { card.x=0; card.y=0; }
          else moving=true;
        }
        card.motion.style.transform=`translate3d(${card.x.toFixed(3)}px,${card.y.toFixed(3)}px,0) rotate(${(card.angle+card.x*.085).toFixed(3)}deg)`;
      });
      pointer=null;
      if (moving) schedule();
      else lastTime=0;
    }
    const move=e=>{
      if (e.pointerType!=='mouse' || R.reduced.matches || R.motionPaused || keyboard || width<1024) return;
      if (previousPointer) {
        pointer={x:e.clientX,y:e.clientY,dx:(pointer?.dx||0)+e.clientX-previousPointer.x,dy:(pointer?.dy||0)+e.clientY-previousPointer.y};
        schedule();
      }
      previousPointer={x:e.clientX,y:e.clientY};
    };
    const leave=()=>{previousPointer=null;};
    const focus=e=>{
      if (!e.target.matches(':focus-visible')) return;
      // Keep the accessible flow stable when switching from Tab to a mouse.
      keyboard=true;footer.classList.add('footer-keyboard');
      e.target.scrollIntoView({block:'nearest',behavior:'instant'});
      measure();
    };
    const visibility=()=>{
      lastTime=0; previousPointer=null; pointer=null;
      if (document.hidden) {cancelAnimationFrame(frame);frame=0;}
      else measure();
    };
    const resize=new ResizeObserver(measure);
    resize.observe(root);
    canvas.addEventListener('pointermove',move,{passive:true});
    canvas.addEventListener('pointerleave',leave);
    footer.addEventListener('focusin',focus);
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',measure);
    document.addEventListener('visibilitychange',visibility);
    document.addEventListener('rochelle-motion',measure);
    R.reduced.addEventListener('change',measure);
    measure();
    return ()=>{
      disposed=true;cancelAnimationFrame(frame);resize.disconnect();
      document.body.classList.remove('footer-view');
      canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerleave',leave);
      footer.removeEventListener('focusin',focus);
      window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);
      document.removeEventListener('visibilitychange',visibility);document.removeEventListener('rochelle-motion',measure);
      R.reduced.removeEventListener('change',measure);
    };
  }
  R.mountCommon = root => {
    const removers = [], observers = [];
    removers.push(mountFooter(root));
    root.querySelectorAll('h1.reveal').forEach(heading=>{
      const inner=document.createElement('span');inner.className='heading-inner';
      while(heading.firstChild)inner.append(heading.firstChild);
      heading.append(inner);
    });
    const observe = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.target.classList.toggle('in-view', entry.isIntersecting);
      if (entry.isIntersecting && entry.target.classList.contains('reveal')) observe.unobserve(entry.target);
    }), {threshold:0.08});
    root.querySelectorAll('.reveal,.client-band,.project-cta,.site-footer,.marquee-viewport,.work-marquee').forEach(el => observe.observe(el));
    observers.push(observe);
    const videos = [...root.querySelectorAll('video')];
    const mediaObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) entry.target.pause(); }), {threshold:.04});
    videos.forEach(video => {
      mediaObserver.observe(video);
      const exclusive = () => { if (!video.muted) videos.forEach(other => { if (other !== video) other.pause(); }); };
      video.addEventListener('play', exclusive); removers.push(()=>video.removeEventListener('play',exclusive));
    });
    observers.push(mediaObserver);
    root.querySelectorAll('[data-drag]').forEach(track => {
      let startX=0,startY=0,startScroll=0,dragging=false,moved=false,pointer=null,suppressUntil=0,scrollFrame=0;
      const original=[...track.children],clones=[];
      const looping=original.length>3;
      if(looping){
        const copy=el=>{
          const clone=el.cloneNode(true);clone.dataset.loopClone='true';clone.setAttribute('aria-hidden','true');
          clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
          clone.querySelectorAll('a,button,video,[tabindex]').forEach(node=>node.tabIndex=-1);
          clone.querySelectorAll('video').forEach(video=>{video.removeAttribute('src');video.preload='none';mediaObserver.observe(video);videos.push(video);});
          clones.push(clone);return clone;
        };
        track.prepend(...original.map(copy));track.append(...original.map(copy));
      }
      const offset=el=>el.getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
      const cycle=()=>looping?offset(original[0])-offset(track.firstElementChild):0;
      track.tabIndex=track.hasAttribute('tabindex')?track.tabIndex:0;
      if(!track.hasAttribute('aria-label'))track.setAttribute('aria-label','Draggable gallery. Use arrow keys or previous and next buttons.');
      track.style.touchAction='pan-y';
      const refresh=()=>{
        scrollFrame=0;
        if(looping&&!dragging){
          const length=cycle();
          if(length>0&&(track.scrollLeft<length*.45||track.scrollLeft>length*1.85)){
            const shift=track.scrollLeft<length*.45?length:-length;
            track.scrollLeft+=shift;
          }
        }
        const candidates=[...track.children].filter(el=>el.classList.contains('case-gallery-item'));
        if(candidates.length){
          const center=track.scrollLeft+track.clientWidth*.3;
          const nearest=candidates.reduce((a,b)=>Math.abs(offset(a)+a.offsetWidth/2-center)<Math.abs(offset(b)+b.offsetWidth/2-center)?a:b);
          candidates.forEach(el=>el.classList.toggle('is-active',el===nearest));
        }
      };
      const onScroll=()=>{if(!scrollFrame)scrollFrame=requestAnimationFrame(refresh);};
      if(looping)track.scrollLeft=cycle();
      const down=e=>{
        if(e.button!==0||e.target.closest('button,input,video'))return;
        startX=e.clientX;startY=e.clientY;startScroll=track.scrollLeft;dragging=true;moved=false;pointer=e.pointerId;
      };
      const move=e=>{
        if(!dragging)return;
        const dx=e.clientX-startX,dy=e.clientY-startY;
        if(!moved&&Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>8){dragging=false;return;}
        if(Math.abs(dx)>8){moved=true;if(!track.hasPointerCapture(pointer))track.setPointerCapture(pointer);track.style.scrollSnapType='none';track.classList.add('dragging');}
        if(moved){e.preventDefault();track.scrollLeft=startScroll-dx;}
      };
      const up=()=>{
        if(!dragging)return;dragging=false;
        if(moved)suppressUntil=performance.now()+250;
        if(pointer!==null&&track.hasPointerCapture(pointer))track.releasePointerCapture(pointer);
        track.classList.remove('dragging');track.style.scrollSnapType='';
        if(moved&&track.children.length){
          const nearest=[...track.children].reduce((a,b)=>Math.abs(offset(a)-track.scrollLeft)<Math.abs(offset(b)-track.scrollLeft)?a:b);
          track.scrollTo({left:offset(nearest),behavior:R.reduced.matches?'instant':'smooth'});
        }
      };
      const click=e=>{
        if(performance.now()<suppressUntil){e.preventDefault();e.stopPropagation();return;}
        const video=e.target.closest('[data-loop-clone] video');
        if(video&&!video.getAttribute('src')){video.src=video.dataset.src;video.play().catch(()=>{});}
      };
      const shift=direction=>track.scrollBy({left:direction*(original[0]?.getBoundingClientRect().width+24||track.clientWidth*.8),behavior:R.reduced.matches?'instant':'smooth'});
      const key=e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();shift(e.key==='ArrowRight'?1:-1);}};
      const preventNativeDrag=e=>e.preventDefault();
      [['pointerdown',down],['pointermove',move],['pointerup',up],['pointercancel',up],['keydown',key],['scroll',onScroll],['dragstart',preventNativeDrag]].forEach(([event,fn])=>{track.addEventListener(event,fn);removers.push(()=>track.removeEventListener(event,fn));});
      track.addEventListener('click',click,true);removers.push(()=>track.removeEventListener('click',click,true));
      track.parentElement?.querySelectorAll('[data-drag-prev],[data-drag-next]').forEach(button=>{const handler=()=>shift(button.hasAttribute('data-drag-prev')?-1:1);button.addEventListener('click',handler);removers.push(()=>button.removeEventListener('click',handler));});
      removers.push(()=>{cancelAnimationFrame(scrollFrame);clones.forEach(clone=>clone.remove());});
      refresh();
    });
    return () => { observers.forEach(o=>o.disconnect());removers.forEach(fn=>fn());videos.forEach(v=>v.pause()); };
  };
})();
