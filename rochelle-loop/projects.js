(function () {
  'use strict';
  const R = window.R;
  const esc = R.esc;
  const asset = name => R.asset('assets/editorial/' + name + '.webp');
  const mock = name => R.asset('assets/mockups/' + name + '.svg');
  R.categories = ['All Work', 'Product UI', 'Research', 'Web Design', 'Interaction', 'Brand', 'Design Systems'];
  const entries = [
    ['after-hours', 'Operations at a Glance', 'Future Pay', '2026', [1, 2], 'cover-01', 'Acquiring operations workspace', 'A concept for scanning payment activity without losing the context needed to act.', 'operations', ['Start with the exception, not the total.', 'A busy payments workspace can make every number look equally important. This study separates the daily overview from the smaller set of transactions that need a decision. It is a design hypothesis, not a report of measured operational improvements.', 'Keep time range, currency and payment method in one persistent filter bar. A selected transaction opens beside the table, retaining its place in the list and the active filter context.', 'Amounts keep their currency code; statuses pair a plain-language label with a shape. A pending payment is not a failed payment, and the visual language should never imply that it is.', 'Before shipping, I would test whether an operator can explain why an item needs attention, locate its source, and safely return to the same filtered view.']],
    ['form-field', 'States That Guide', 'Future Pay', '2026', [3], 'cover-02', 'Transaction status system', 'A status vocabulary that tells people what happened, what matters, and what comes next.', 'states', ['A label should carry a next step.', 'Transactions, refunds and disputes can share visual foundations without sharing every state. This concept begins with a small vocabulary, then gives each workflow its own explicit transitions.', 'Separate payment status from review status. “Processing” describes movement; “Needs information” describes a task. Placing both in the same undifferentiated badge would hide a useful distinction.', 'Colour supports the message; it does not carry it. Each state includes a written label, a consistent icon and, when action is possible, a short explanation beside the action.', 'The open question is comprehension: can someone distinguish a terminal state from a temporary one without opening help? That needs evaluation with real operators.']],
    ['soft-matter', 'Issuing, Explained', 'Future Pay', '2026', [4, 5], 'cover-03', 'Responsive product story', 'An editorial concept for explaining issuing, from the card in your hand to the controls behind it.', 'issuing', ['Make the invisible service understandable.', 'Issuing pages can list capabilities without explaining how they fit together. This concept turns the product story into a sequence: create a card, choose controls, understand spending, and connect the service.', 'A restrained card silhouette is the visual anchor. Its surrounding copy changes from everyday use to platform capabilities, so the page can serve a merchant reader before introducing technical detail.', 'The motion study explores hierarchy and timing only. It is not a recording of a live issuing product, and the visual artwork is used as a material reference rather than a product screenshot.', 'The next evaluation would compare whether readers can describe the difference between a physical card, a virtual card, and the controls that apply to both.']],
    ['blue-shift', 'Exception Handling', 'Future Pay', '2026', [3], 'cover-04', 'Exception resolution flows', 'A concept for keeping evidence, deadlines and recovery paths close to a difficult decision.', 'exceptions', ['Give uncertainty a clear place to go.', 'A dispute, a refund and a failed payment all interrupt the happy path, but they ask different questions. This study deliberately avoids collapsing them into one generic error screen.', 'The proposed workspace keeps the original transaction visible beside a chronological account of what happened. Required evidence is grouped by purpose, with a deadline expressed in both a date and a remaining-time label.', 'An irreversible action deserves a review step that repeats the consequence in plain language. A missing document should offer a route to save progress, rather than forcing an empty submission.', 'A useful next test would follow an incomplete case across two sessions: can a reviewer identify what changed, what remains missing and who owns the next step?']],
    ['orange-object', 'A Recognizable Gateway', 'Bit2Go', '2025', [3], 'cover-05', 'Brand-led product website', 'A website direction that makes a technical payment proposition readable before it asks for trust.', 'gateway', ['A bold identity needs a clear explanation.', 'Crypto payment websites often lead with visual intensity. This concept keeps the expressive surface but gives the first screen a simple job: explain who the service is for and what the next step involves.', 'A short merchant-oriented narrative introduces accepting a payment, reviewing its progress and understanding settlement. Product language comes before a dense catalogue of technical features.', 'The contrast between oversized typography and quieter UI frames creates two reading speeds. Headlines invite exploration; supporting copy explains limits and avoids promises the interface cannot substantiate.', 'This is a visual and information-design study, not an endorsement of a financial service. Claims about fees, availability or settlement speed would need verified product information.']],
    ['terrain', 'Across Every Screen', 'Bit2Go', '2025', [3], 'cover-06', 'Responsive desktop & mobile UI', 'One hierarchy, expressed differently on a wide canvas and in the palm of a hand.', 'responsive', ['Adapt the priority, not just the width.', 'A desktop composition cannot simply be compressed into a narrow column. This concept keeps the same core explanation while changing image scale, spacing and the order of supporting detail.', 'On larger screens, a visual demonstration can sit beside the main proposition. On a phone, the proposition comes first, with a single clear action and the supporting visual immediately after it.', 'The static panels deliberately make breakpoints visible. Content stays in a meaningful reading order, touch targets remain generous, and essential information does not depend on hover.', 'A next implementation pass would stress-test long translations, enlarged text, landscape orientation and an interrupted connection—not just a set of ideal device widths.']],
    ['kinetic-type', 'Payments, Step by Step', 'Bit2Go', '2025', [1, 6], 'cover-07', 'Merchant payment journey', 'A journey concept linking onboarding, payment requests and settlement through a shared language.', 'journey', ['Clarity is a sequence, not a screen.', 'The proposed journey starts before the first payment: account setup, merchant information and verification establish the context for everything that follows. This is an authored journey hypothesis, not a claim of completed field research.', 'The first gallery explores setup and payment creation. The second follows confirmation, settlement and support. Keeping the two tracks independent makes it easier to inspect the beginning without losing the end.', 'Each step should show what is saved, what is still needed and what happens after continuing. Verification requests need a reason and a recovery path, especially when a document cannot be supplied immediately.', 'The design-system direction uses shared spacing, action hierarchy and status semantics across the journey. Those foundations matter more than making every page look identical.']],
    ['echo', 'From Site to Dashboard', 'Bit2Go', '2025', [3], 'cover-08', 'Merchant operations dashboard', 'A concept for carrying a recognizable public identity into a quieter daily working environment.', 'operations', ['The brand can step back without disappearing.', 'A marketing site asks for attention; an operations screen asks for concentration. This study explores how the same identity can serve those very different tasks without importing oversized promotion into everyday work.', 'Expressive colour becomes a controlled accent. Balances, recent activity and tasks use a stable grid, with clear labels and currency codes instead of decoration that competes with the data.', 'A balance is only meaningful with its scope. The concept distinguishes available funds from activity awaiting confirmation, and keeps the selected account and time range visible.', 'A considered next step would evaluate the first-time handoff from the public site into the workspace: does the merchant understand where they are, and can they find the first meaningful action?']],
    ['open-form', 'A Character with Rules', 'G-DORISE', '2026', [4, 5], 'cover-09', 'Original character system', 'A visual-system concept exploring what should stay consistent when a character changes expression.', null, ['Consistency leaves room for personality.', 'The source topic is a character system. Supplied character artwork and newly composed material studies explore the principle behind it: define a few recognizable anchors, then make room for variation. These directions are exploratory, not a finished production guide.', 'Silhouette, facial anchors and proportion would form the fixed layer of a character guide. Pose, expression and accessory belong to the flexible layer. Naming that boundary is more useful than collecting unrelated variations.', 'The moving background studies investigate rhythm and emphasis; the still compositions examine contrast and negative space. They are supporting concept art, not evidence of a delivered character campaign.', 'A real character library would need front, side and back construction views, expression ranges and guidance for use at small sizes before it could support production.']],
    ['common-ground', 'An Expressive Toolkit', 'G-DORISE', '2026', [1, 3], 'cover-10', 'Emotion & pose library', 'A concept for organizing expressive assets around the message they need to communicate.', null, ['Start with what the expression needs to say.', 'An expression library becomes useful when a team can find the right tone, not merely the right filename. This study proposes grouping gestures by communicative intent: welcome, guide, celebrate and reassure.', 'The abstract motion samples explore changes in energy and timing. A welcome can be open and unhurried; a confirmation can be brief and definite. Neither should obscure important interface information.', 'For a production toolkit, each asset would need an intent label, a small-size check, alternative text guidance and a reduced-motion equivalent. The art here is exploratory, not a shipped UI asset set.', 'The next step would be to compare whether people interpret each intended tone consistently across cultures, rather than treating the designer’s interpretation as a result.']],
    ['still-life', 'A Style That Stays Hers', 'G-DORISE', '2026', [1], 'cover-11', 'Fashion & styling collection', 'A colour and styling concept about variation without losing the visual thread.', null, ['Change the styling. Keep the recognition.', 'This concept separates stable identity cues from a changing layer of outfits, accessories and colour. The supplied character illustrations explore styling and everyday scenes; they are visual references, not evidence of manufactured garments.', 'The first pass holds shape steady while changing the surrounding palette. The second changes scale and texture while preserving a focal point. Comparing one variable at a time makes the exploration legible.', 'A useful guide would describe combinations and constraints, not just a list of approved colours. Small reproductions, low-contrast backgrounds and monochrome use need their own consideration.', 'Before treating a styling system as finished, I would check recognition without a name label and inspect whether an accessory unintentionally changes the silhouette’s defining features.']],
    ['future-nature', 'Beyond the Character Sheet', 'G-DORISE', '2026', [1], 'cover-12', 'Story scenes & brand extensions', 'A concept for taking a recognizable visual language into scenes, objects and everyday touchpoints.', null, ['Build a world with a consistent point of view.', 'A character’s world can extend into packaging, stickers and spatial moments, but each medium introduces different constraints. This study combines supplied illustrations with new material compositions to explore continuity across those contexts.', 'The two groups of motion studies separate intimate, object-scale composition from wider scene-building. They share a palette and pacing, while leaving room for a different hierarchy in each format.', 'A sticker must read in a glance. Packaging needs room for practical information. A scene can reward a longer look. A coherent system adapts to these jobs instead of stamping the same composition everywhere.', 'These are speculative directions. Production would require artwork tailored to each medium, manufacturing constraints where relevant, and checks that the essential identity survives each translation.']]
  ];
  const sequences = [
    [['videos', 3], ['challengeVideo'], ['pair', 2], ['videos', 6], ['details']],
    [['wide'], ['challenge'], ['splitVideo'], ['wide'], ['wide'], ['reflection']],
    [['wide'], ['videoGallery', 5], ['images', 6]],
    [['wide'], ['challenge'], ['wide'], ['splitVideo'], ['videos', 6], ['details']],
    [['wide'], ['challenge'], ['splitVideo'], ['wide'], ['splitVideo', 1, true], ['details']],
    [['images', 3], ['challenge'], ['imageWide'], ['paragraph'], ['gallery', 5], ['details']],
    [['videos', 3], ['challengeImage'], ['gallery', 5], ['paragraph'], ['gallery', 5]],
    [['wide'], ['challenge'], ['splitVideo'], ['paragraph'], ['wide'], ['splitVideo', 1, true], ['details']],
    [['decoration'], ['challengeVideo'], ['wide'], ['paragraph'], ['videoGallery', 5], ['images', 5], ['details']],
    [['wide'], ['challenge'], ['videos', 6], ['statement'], ['details']],
    [['compact'], ['challengeVideo'], ['paragraph'], ['videos', 3], ['details']],
    [['videos', 3], ['challenge'], ['videos', 3], ['paragraph'], ['details']]
  ];
  const artNames = ['gradient-01', 'gradient-02', 'gradient-03', 'gradient-04', 'gradient-05', 'gradient-06', 'gradient-07', 'gradient-08', 'gradient-09', 'gradient-10', 'gradient-11'];
  const characterArt = ['cover-09', 'cover-10', 'cover-11', 'life-01', 'life-04', 'life-07', 'life-08', 'life-09', 'cover-12'];
  function studyArt(project, index) {
    const names = project.index >= 8 ? characterArt : artNames;
    return asset(names[(project.index + index) % names.length]);
  }
  R.projects = entries.map((e, i) => ({ slug: e[0], title: e[1], brand: e[2], year: e[3], categories: e[4].map(n => R.categories[n]), cover: asset(e[5]), description: e[7], deliverable: e[6], mockup: e[8] ? mock(e[8]) : null, copy: e[9], sections: sequences[i].map((s, j) => ({ type: s[0], count: s[1] || 1, reverse: !!s[2], index: j })), index: i }));
  R.featured = ['after-hours', 'form-field', 'soft-matter', 'blue-shift', 'orange-object', 'terrain', 'kinetic-type', 'echo', 'open-form'];
  const previewURL = () => R.previewSrc;
  R.projectCard = function (project) {
    return `<article class="project-card" data-project="${project.slug}"><a class="project-card-link" href="${R.link('/work/' + project.slug)}" aria-label="Explore ${esc(project.title)} concept study"><div class="project-card-media"><img class="project-cover" src="${project.cover}" alt="${esc(project.title)} — visual concept artwork, not a product screenshot" loading="lazy" decoding="async"><div class="project-preview"><video data-project-preview data-src="${previewURL()}" poster="${project.cover}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video><span class="preview-caption">Concept motion</span></div><span class="project-view" aria-hidden="true">View ↗</span></div><div class="project-card-title"><h3>${esc(project.title)}</h3><span aria-hidden="true">↗</span></div><div class="project-card-meta"><span>${esc(project.brand)} · Concept study</span><span>${project.year}</span></div><p class="project-card-category">${esc(project.categories.join(' / '))}</p></a></article>`;
  };
  const workState = { category: 'All Work', columns: 2 };
  R.renderWork = function () {
    const decorative = R.projects.slice(0, 7).map((p, i) => `<figure class="work-marquee-item marquee-size-${i % 3}"><img src="${p.cover}" alt="" loading="lazy"><figcaption>[0${i + 1}]</figcaption></figure>`).join('');
    return `<div class="work-page"><section class="work-opening"><div class="work-marquee" aria-hidden="true"><div class="work-marquee-track"><div class="work-marquee-group">${decorative}</div><div class="work-marquee-group">${decorative}</div></div></div><div class="page-wrap"><p class="eyebrow reveal">Rochelle / An evolving collection</p><h1 class="work-title reveal">Selected <em>Work</em><span class="work-title-dot" aria-hidden="true"></span></h1><div class="work-intro"><span class="work-scribble" aria-hidden="true">↗</span><p>Thoughtful interfaces.<br>A playful point of view.</p><p>12 self-directed concept studies across product, interaction and visual systems. Explorations, not client outcome claims.</p></div></div></section><section class="page-wrap work-collection" aria-label="Concept study collection"><div class="work-toolbar"><div class="work-filters" role="group" aria-label="Filter concept studies">${R.categories.map(c => `<button type="button" data-work-filter="${c}" aria-pressed="${c === workState.category}">${c}</button>`).join('')}</div><div class="work-columns" role="group" aria-label="Grid columns">${[2, 3].map(n => `<button type="button" data-work-columns="${n}" aria-label="${n} columns" aria-pressed="${n === workState.columns}"><span aria-hidden="true">${n === 2 ? '▥' : '▦'}</span><span>${n}</span></button>`).join('')}</div></div><div class="work-results"><p data-work-count role="status" aria-live="polite" aria-atomic="true">${workState.category === 'All Work' ? 12 : R.projects.filter(p => p.categories.includes(workState.category)).length} concept studies</p><span>Explore the thinking behind the surface ↓</span></div><div class="work-grid-wrap"><div class="work-grid" data-columns="${workState.columns}">${R.projects.map(R.projectCard).join('')}</div></div></section>${R.cta()}${R.footer()}</div>`;
  };
  function mountMedia(root) {
    const controller = new AbortController();
    const signal = controller.signal;
    let active = null;
    let destroyed = false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const videos = Array.from(root.querySelectorAll('video[data-project-preview], video[data-case-video]'));
    const stop = video => { video.pause(); const card = video.closest('.project-card'); if (card) card.classList.remove('preview-ready'); };
    const stopActive = () => { if (active) stop(active); active = null; };
    const showFrame = video => {
      if (!destroyed && active === video && !video.paused && video.readyState >= 2) video.closest('.project-card').classList.add('preview-ready');
    };
    const enter = event => {
      if (event.pointerType === 'touch' || reduced.matches) return;
      const link = event.target.closest('.project-card-link');
      if (!link || (event.relatedTarget && link.contains(event.relatedTarget))) return;
      const video = link.querySelector('video');
      if (!video || active === video) return;
      stopActive(); active = video;
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.muted = true;
      video.play().then(() => {
        if (destroyed || active !== video) { video.pause(); return; }
        if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(() => showFrame(video));
        else showFrame(video);
      }).catch(() => { if (active === video) stopActive(); });
    };
    const leave = event => {
      const link = event.target.closest('.project-card-link');
      if (link && (!event.relatedTarget || !link.contains(event.relatedTarget)) && active && link.contains(active)) stopActive();
    };
    root.addEventListener('pointerover', enter, { signal });
    root.addEventListener('pointerout', leave, { signal });
    root.addEventListener('play', event => {
      if (!(event.target instanceof HTMLVideoElement)) return;
      videos.forEach(v => { if (v !== event.target && !v.paused) stop(v); });
    }, { capture: true, signal });
    document.addEventListener('visibilitychange', () => { if (document.hidden) videos.forEach(stop); }, { signal });
    const near = new IntersectionObserver(items => items.forEach(item => {
      const video = item.target;
      if (item.isIntersecting && video.hasAttribute('data-case-video') && !video.getAttribute('src')) { video.src = video.dataset.src; video.preload = 'metadata'; }
    }), { rootMargin: '200px' });
    const visible = new IntersectionObserver(items => items.forEach(item => { if (!item.isIntersecting) { stop(item.target); if (active === item.target) active = null; } }), { threshold: 0.05 });
    videos.forEach(v => { visible.observe(v); if (v.hasAttribute('data-case-video')) near.observe(v); });
    reduced.addEventListener('change', stopActive, { signal });
    return () => { destroyed = true; controller.abort(); near.disconnect(); visible.disconnect(); videos.forEach(v => { stop(v); v.removeAttribute('src'); v.load(); }); };
  }
  R.mountWork = function (root) {
    const grid = root.querySelector('.work-grid');
    const wrap = root.querySelector('.work-grid-wrap');
    const cards = Array.from(grid.children);
    const controller = new AbortController();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let animations = [];
    let ghosts = [];
    function cancel() { animations.forEach(a => a.cancel()); animations = []; ghosts.forEach(g => g.remove()); ghosts = []; }
    function update(animate) {
      const before = new Map(cards.filter(c => !c.hidden).map(c => [c, c.getBoundingClientRect()]));
      const oldHeight = wrap.getBoundingClientRect().height;
      const gridRect = grid.getBoundingClientRect();
      cancel();
      const exiting = cards.filter(c => !c.hidden && workState.category !== 'All Work' && !R.projects.find(p => p.slug === c.dataset.project).categories.includes(workState.category));
      if (animate && !reduced.matches) exiting.forEach(card => {
        const box = before.get(card);
        const ghost = card.cloneNode(true);
        ghost.setAttribute('aria-hidden', 'true'); ghost.inert = true;
        ghost.querySelectorAll('video').forEach(v => v.remove());
        ghost.classList.add('work-exit-ghost');
        Object.assign(ghost.style, { left: (box.left - gridRect.left) + 'px', top: (box.top - gridRect.top) + 'px', width: box.width + 'px', height: box.height + 'px' });
        grid.appendChild(ghost); ghosts.push(ghost);
        const a = ghost.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.96)' }], { duration: 180, easing: 'ease-out', fill: 'forwards' });
        a.onfinish = () => ghost.remove(); animations.push(a);
      });
      cards.forEach(card => {
        const project = R.projects.find(p => p.slug === card.dataset.project);
        card.hidden = workState.category !== 'All Work' && !project.categories.includes(workState.category);
        if (card.hidden) { card.classList.remove('preview-ready'); card.querySelectorAll('video').forEach(v => v.pause()); }
      });
      grid.dataset.columns = String(workState.columns);
      root.querySelectorAll('[data-work-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.workFilter === workState.category)));
      root.querySelectorAll('[data-work-columns]').forEach(b => b.setAttribute('aria-pressed', String(Number(b.dataset.workColumns) === workState.columns)));
      const shown = cards.filter(c => !c.hidden);
      root.querySelector('[data-work-count]').textContent = `${shown.length} concept ${shown.length === 1 ? 'study' : 'studies'} · ${workState.category}`;
      if (!animate || reduced.matches) return;
      const after = shown.map(card => [card, card.getBoundingClientRect()]);
      const duration = 620;
      after.forEach(([card, box]) => {
        const prior = before.get(card);
        const start = prior ? { transform: `translate(${prior.left - box.left}px, ${prior.top - box.top}px) scale(${prior.width / box.width}, ${prior.height / box.height})`, opacity: 1 } : { transform: 'translateY(28px) scale(.97)', opacity: 0 };
        animations.push(card.animate([start, { transform: 'none', opacity: 1 }], { duration, easing: 'cubic-bezier(.22,1,.36,1)' }));
      });
      animations.push(wrap.animate([{ height: oldHeight + 'px' }, { height: grid.getBoundingClientRect().height + 'px' }], { duration, easing: 'cubic-bezier(.22,1,.36,1)' }));
    }
    root.addEventListener('click', event => {
      const filter = event.target.closest('[data-work-filter]');
      const columns = event.target.closest('[data-work-columns]');
      if (filter && filter.dataset.workFilter !== workState.category) { workState.category = filter.dataset.workFilter; update(true); }
      if (columns && Number(columns.dataset.workColumns) !== workState.columns) { workState.columns = Number(columns.dataset.workColumns); update(true); }
    }, { signal: controller.signal });
    update(false);
    const mediaCleanup = mountMedia(root);
    return () => { controller.abort(); cancel(); mediaCleanup(); };
  };
  const paragraph = (project, index) => `<p>${esc(project.copy[Math.min(index, 4)])}</p>`;
  function imageFigure(project, i, wide) {
    const src = project.mockup && i % 2 === 0 ? project.mockup : studyArt(project, i);
    const isMockup = src === project.mockup;
    return `<figure class="case-image ${wide ? 'case-image-wide' : ''}"><img src="${src}" alt="${esc(isMockup ? project.deliverable + ' — original interface concept with illustrative data' : 'Supplied artwork exploring colour, character and composition') }" loading="lazy" decoding="async"><figcaption>${String(i + 1).padStart(2, '0')} / ${isMockup ? 'Interface proposal · illustrative data' : 'Visual exploration · not a product screenshot'}</figcaption></figure>`;
  }
  function videoFigure(project, i, portrait) {
    const poster = project.mockup && !portrait ? project.mockup : studyArt(project, i);
    return `<figure class="case-video ${portrait ? 'case-video-portrait' : 'case-video-wide'}"><div class="case-video-surface" style="--video-poster:url('${poster}')"><video data-case-video data-src="${previewURL()}" poster="${poster}" controls playsinline preload="none" aria-label="Shared concept-motion experiment, sample ${i + 1}; no client footage"></video></div><figcaption>${String(i + 1).padStart(2, '0')} / Shared concept-motion experiment · no client footage or audio</figcaption></figure>`;
  }
  function gallery(project, section, moving) {
    const id = `gallery-${project.slug}-${section.index}`;
    return `<section class="case-module case-gallery reveal" data-module="${section.type}"><div class="section-head"><div><p class="eyebrow">${moving ? 'Backgrounds / motion studies' : section.index > 3 ? 'The next chapter / visual studies' : 'Directions / visual studies'}</p><h2>${moving ? 'Ideas in motion.' : 'A change of perspective.'}</h2></div><div class="case-gallery-controls"><span>[ Drag ]</span><button type="button" data-drag-prev aria-controls="${id}" aria-label="Previous study">←</button><button type="button" data-drag-next aria-controls="${id}" aria-label="Next study">→</button></div></div><div class="case-gallery-track" id="${id}" data-drag tabindex="0" role="region" aria-label="${moving ? 'Motion' : 'Image'} studies; use arrow keys to explore">${Array.from({ length: section.count }, (_, i) => `<div class="case-gallery-item">${moving ? videoFigure(project, i, true) : imageFigure(project, i + section.index, false)}</div>`).join('')}</div></section>`;
  }
  function renderSection(project, section) {
    const type = section.type;
    const intro = `<div class="case-prose"><p class="eyebrow">The design question</p><h2>${esc(project.copy[0])}</h2>${paragraph(project, 1)}</div>`;
    const description = `<div class="case-prose"><p class="eyebrow">A considered direction</p><h2>${section.reverse ? 'Keep the next step in view.' : 'Less friction. More context.'}</h2>${paragraph(project, section.reverse ? 3 : 2)}</div>`;
    const open = `<section class="case-module reveal" data-module="${type}">`;
    switch (type) {
      case 'videos': return `${open}<div class="case-portrait-grid">${Array.from({ length: section.count }, (_, i) => videoFigure(project, i + section.index, true)).join('')}</div></section>`;
      case 'wide': return `${open}${videoFigure(project, section.index, false)}</section>`;
      case 'challenge': return `${open}<div class="case-text-row"><span class="eyebrow">Challenge / hypothesis</span>${intro}</div></section>`;
      case 'challengeVideo': return `${open}<div class="case-media-split">${intro}${videoFigure(project, section.index, true)}</div></section>`;
      case 'challengeImage': return `${open}<div class="case-media-split">${intro}${imageFigure(project, 0, false)}</div></section>`;
      case 'splitVideo': return `${open}<div class="case-media-split ${section.reverse ? 'is-reversed' : ''}">${videoFigure(project, section.index, false)}${description}</div></section>`;
      case 'pair': return `${open}<div class="case-dual-video">${videoFigure(project, 3, true)}${videoFigure(project, 4, true)}</div><div class="case-pair-copy">${paragraph(project, 2)}</div></section>`;
      case 'images': return `${open}<div class="case-image-grid ${section.count === 5 ? 'case-image-grid-five' : ''}">${Array.from({ length: section.count }, (_, i) => imageFigure(project, i, false)).join('')}</div></section>`;
      case 'imageWide': return `${open}${imageFigure(project, 0, true)}</section>`;
      case 'paragraph': return `${open}<div class="case-standalone-copy"><span class="eyebrow">A note on the approach</span>${paragraph(project, 3)}</div></section>`;
      case 'gallery': return gallery(project, section, false);
      case 'videoGallery': return gallery(project, section, true);
      case 'decoration': return `${open}<div class="case-decoration"><img src="${project.cover}" alt="Abstract typographic direction for the concept" loading="lazy"><span aria-hidden="true">A little<br><em>character.</em></span></div></section>`;
      case 'compact': return `${open}<div class="case-compact">${videoFigure(project, 0, true)}<div class="case-prose"><p class="eyebrow">An opening thought</p><h2>${esc(project.copy[0])}</h2>${paragraph(project, 2)}</div></div></section>`;
      case 'statement': return `${open}<p class="case-statement">More than<br>a pose.<br><em>A point of view.</em></p><div class="case-pair-copy">${paragraph(project, 3)}</div></section>`;
      case 'reflection': return `${open}<div class="case-reflection"><span class="case-reflection-star" aria-hidden="true">✳</span><p class="eyebrow">Designer’s reflection / not a testimonial</p><blockquote>“A useful state answers three things: what happened, what it means, and what I can do next.”</blockquote><p>Rochelle · Concept design note</p>${paragraph(project, 4)}</div></section>`;
      case 'details': return `${open}<div class="case-details"><h2>In the <em>details.</em></h2><dl><div><dt>Study focus</dt><dd>${esc(project.deliverable)}</dd></div><div><dt>Design direction</dt><dd>${esc(project.copy[0])}</dd></div><div><dt>Material</dt><dd>Original interface proposals where shown, abstract visual studies and a shared local motion experiment.</dd></div><div><dt>Boundaries</dt><dd>Self-directed concept; no client endorsement, live product recording or measured outcome is claimed.</dd></div><div><dt>Next question</dt><dd>${esc(project.copy[4])}</dd></div></dl></div></section>`;
      default: return '';
    }
  }
  R.renderCase = function (slug) {
    const project = R.projects.find(p => p.slug === slug);
    if (!project) return `<div class="page-wrap case-not-found"><h1>Study not found.</h1><a class="button" href="${R.link('/work')}">Back to all work</a></div>${R.footer()}`;
    const words = project.title.split(' ');
    const last = words.pop();
    return `<article class="case-page case-${project.slug}"><header class="case-header page-wrap"><a class="text-link case-back" href="${R.link('/work')}">← All work</a><p class="eyebrow reveal">Rochelle / Concept study ${String(project.index + 1).padStart(2, '0')}</p><h1 class="case-title reveal">${esc(words.join(' '))} <em>${esc(last)}</em><span aria-hidden="true">®</span></h1><div class="case-overview reveal"><span class="eyebrow">About the concept</span><div><dl class="case-meta"><div><dt>Project topic</dt><dd>${esc(project.brand)}</dd></div><div><dt>Year</dt><dd>${project.year}</dd></div><div><dt>Type</dt><dd>${esc(project.categories.join(' / '))}</dd></div></dl><p class="case-description">${esc(project.description)}</p><p class="case-disclaimer">Self-directed concept study. Abstract artwork and shared motion experiments are presentation material, not live product screenshots or client footage.</p></div></div></header><div class="case-body page-wrap">${project.sections.map(s => renderSection(project, s)).join('')}</div><section class="case-related page-wrap" aria-labelledby="related-heading"><div class="section-head"><div><p class="eyebrow">Keep exploring</p><h2 id="related-heading">Related <em>studies.</em></h2></div><div class="case-gallery-controls"><span>[ Drag ]</span><button type="button" data-drag-prev aria-controls="related-cases" aria-label="Previous related study">←</button><button type="button" data-drag-next aria-controls="related-cases" aria-label="Next related study">→</button></div></div><div class="case-related-track" id="related-cases" data-drag tabindex="0" role="region" aria-label="Eleven more concept studies">${R.projects.filter(p => p.slug !== slug).map(R.projectCard).join('')}</div></section>${R.footer()}</article>`;
  };
  R.mountCase = function (root) { return mountMedia(root); };
}());
