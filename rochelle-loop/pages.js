(function () {
  'use strict';
  const R = window.R;
  const e = R.esc;
  const image = (name) => R.asset('assets/editorial/' + name + '.webp');
  const end = () => R.cta() + R.footer();
  const services = [
    { title: 'Product thinking', text: 'Start with the decision someone needs to make. Map the journey, surface dependencies, and give complexity a clear order.', images: ['cover-01', 'cover-07', 'cover-04'] },
    { title: 'Interface design', text: 'Hierarchy, spacing, and a clear next step. Interfaces that balance expressive details with everyday usefulness.', images: ['cover-02', 'cover-06', 'cover-08'] },
    { title: 'Design systems', text: 'A shared language of components, states, and patterns. Consistency should support judgment, not replace it.', images: ['cover-02', 'cover-08', 'cover-09'] },
    { title: 'Interaction & motion', text: 'Motion explains what changed and where to look next. A quieter path remains available when movement is not helpful.', images: ['cover-04', 'cover-07', 'cover-10'] },
    { title: 'Visual exploration', text: 'An open space for form, material, colour, and typography. These images are concept studies, not live product screens.', images: ['cover-09', 'cover-11', 'cover-12'] },
    { title: 'Merchant journeys', text: 'Cross-border payments, merchant onboarding, KYC, and risk. Make requirements understandable without hiding their importance.', images: ['cover-07', 'cover-01', 'cover-05'] }
  ];
  const aboutState = { active: 0, indexes: services.map(() => 0) };
  R.renderAbout = function () {
    const service = services[aboutState.active];
    return `<section class="about-pin" data-about-pin data-theme="dark"><div class="about-panel"><p class="eyebrow about-overline">A little context, a lot of curiosity</p><h1 class="about-collage-title">The person<br><em>behind</em> the pixels.</h1><img class="about-layer about-piece piece-one" data-depth="-1" src="${image('portrait-studio')}" alt="Supplied character portrait in a lavender creative studio"><img class="about-layer about-piece piece-two" data-depth="1.2" src="${image('life-09')}" alt="Illustrated creative moment at a desk"><img class="about-layer about-piece piece-three" data-depth="-.6" src="${image('portrait-evening')}" alt="Supplied character portrait in warm evening light"><span class="about-layer about-star" data-depth=".8" aria-hidden="true">✳</span><span class="about-layer about-note" data-depth="-.8" aria-hidden="true">always<br><em>curious.</em></span><p class="about-caption">An illustrated personal world / supplied character artwork.</p></div></section>
      <section class="page-wrap about-intro"><p class="eyebrow reveal">01 / A way of seeing</p><div class="about-editorial"><h2 class="reveal">Clarity is<br>a <em>creative</em><br>decision.</h2><div class="about-copy reveal"><p>I’m Rochelle, a UI Designer working with cross-border payments, merchant onboarding, KYC, and risk.</p><p>I’m interested in the point where a complicated system becomes an understandable experience. What does someone need to know? What can wait? What makes the next step feel clear?</p><p>This portfolio puts that product perspective beside a more playful visual practice. The concept studies explore material, typography, colour, and rhythm; they are not screenshots of shipped products or evidence of client outcomes.</p><a class="text-link" href="${R.link('/work')}">Explore the studies <span aria-hidden="true">↗</span></a></div></div></section>
      <section class="page-wrap about-person"><figure class="about-person-art reveal"><img src="${image('portrait-cafe')}" alt="Illustrated character sketching ideas beside a laptop in a café" loading="lazy"><figcaption>A quiet creative moment / character illustration</figcaption><span class="person-signature" aria-hidden="true">Rochelle.</span></figure><div class="about-person-copy reveal"><p class="eyebrow">02 / Behind the work</p><h2>Thoughtful by nature.<br><em>Playful</em> by design.</h2><p>There is room for both precision and personality. A financial interface can feel considered. A visual experiment can have a rigorous set of rules.</p><p>I keep those two modes in conversation: structure helps an idea work; expression helps it feel like something.</p><a href="${R.link('/contact')}" class="text-link">Start a conversation ↗</a></div></section>
      <section class="about-services" data-theme="dark"><div class="page-wrap"><p class="eyebrow">03 / Ways of working</p><h2>Curiosity,<br><em>put into practice.</em></h2><div class="service-explorer"><div class="service-tabs" aria-label="Areas of practice">${services.map((item, i) => `<button type="button" data-service="${i}" aria-pressed="${i === aboutState.active}"><span>0${i + 1}</span>${e(item.title)}</button>`).join('')}</div><div class="service-media"><button type="button" class="service-next" aria-label="Next concept image for ${e(service.title)}"><img src="${image(service.images[aboutState.indexes[aboutState.active]])}" alt="${e(service.title)} — ${e(service.images[aboutState.indexes[aboutState.active]].replaceAll('-', ' '))} concept study"><span class="service-sticker" aria-hidden="true">Next ↗</span></button><p class="service-counter" aria-live="polite">${aboutState.indexes[aboutState.active] + 1} / ${service.images.length} — Concept studies</p></div><div class="service-description"><p data-service-description>${e(service.text)}</p><p class="service-disclaimer">Click a category. Then click the image to explore. Each category remembers where you left off.</p></div></div></div></section>${end()}`;
  };
  R.mountAbout = function (root) {
    const controller = new AbortController();
    const signal = controller.signal;
    const next = root.querySelector('.service-next');
    let revision = 0;
    const show = async () => {
      const ticket = ++revision;
      const service = services[aboutState.active];
      const index = aboutState.indexes[aboutState.active];
      root.querySelectorAll('[data-service]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.service) === aboutState.active)));
      root.querySelector('[data-service-description]').textContent = service.text;
      next.setAttribute('aria-label', 'Next concept image for ' + service.title);
      const fresh = new Image();
      fresh.src = image(service.images[index]);
      fresh.alt = service.title + ' — ' + service.images[index].replaceAll('-', ' ') + ' concept study';
      try { await fresh.decode(); } catch (_) { return; }
      if (signal.aborted || ticket !== revision) return;
      const old = next.querySelector('img');
      next.insertBefore(fresh, old);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const animation = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 320, easing: 'ease-out', fill: 'forwards' });
        animation.finished.then(() => old.remove()).catch(() => old.remove());
      } else old.remove();
      root.querySelector('.service-counter').textContent = `${index + 1} / ${service.images.length} — Concept studies`;
    };
    root.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => { aboutState.active = Number(button.dataset.service); show(); }, { signal }));
    next.addEventListener('click', () => { const active = aboutState.active; aboutState.indexes[active] = (aboutState.indexes[active] + 1) % services[active].images.length; show(); }, { signal });
    return () => { controller.abort(); revision++; next.getAnimations({ subtree: true }).forEach(animation => animation.cancel()); };
  };

  const options = {
    position: ['General Inquiry', '3D Animator', '3D Generalist', 'Art Director', 'Brand Designer', 'Character Animator', 'Compositor', 'Concept Artist', 'Creative Director', 'Editor', 'Illustrator', 'Look Developer', 'Motion Designer', 'Photographer', 'Producer', 'Rigging Artist', 'Sound Designer', 'Technical Artist', 'UI / UX Designer', 'VFX Artist', '2D Animator', 'Videographer', 'Cinematographer / DOP', 'Colorist', 'Storyboard Artist', 'Copywriter', 'Content Strategist', 'Social Media Manager', 'Community Manager', 'Project Manager', 'Line Producer', 'Post-Production Supervisor', 'Account Manager', 'Business Development', 'Web Developer', 'Junior Designer'],
    skills: ['2D Animation', '3D Animation', '3D Design', 'Art Direction', 'Character Animation', 'Compositing', 'Concept Art', 'Creative Direction', 'AR / VR', 'Experimental / Generative', 'Illustration', 'Interaction Design', 'Motion Graphics', 'Photography', 'Print & Editorial', 'Projection Mapping', 'Real-time / Interactive', 'Sound Design', 'Stop Motion', 'Type & Lettering', 'UI / UX Design', 'Video Editing', 'Visual Development', 'Visual Effects (VFX)', 'World Building'],
    software: ['Ableton Live', 'After Effects', 'Avid Media Composer', 'Blender', 'Cinema 4D', 'Cavalry', 'Clip Studio Paint', 'DaVinci Resolve', 'Figma', 'Final Cut Pro', 'Flame', 'Fusion', 'Houdini', 'Illustrator', 'InDesign', 'Jitter', 'Katana', 'Lightroom', 'Maya', 'Midjourney', 'Mocha Pro', 'Nuke', 'Photoshop', 'Premiere Pro', 'Pro Tools', 'Procreate', 'Redshift', 'Rive', 'Runway ML', 'Stable Diffusion', 'Substance Painter', 'TouchDesigner', 'Unreal Engine', 'V-Ray', 'ZBrush']
  };
  function field(name, label, type, required, wide, autocomplete) {
    return `<div class="floating-field${wide ? ' field-wide' : ''}"><${type === 'textarea' ? 'textarea' : 'input'} id="collab-${name}" name="${name}" ${type === 'textarea' ? 'rows="3"' : `type="${type || 'text'}"`} placeholder=" " ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} aria-describedby="error-${name}">${type === 'textarea' ? '</textarea>' : ''}<label for="collab-${name}">${label}${required ? ' *' : ''}</label><span class="field-error" id="error-${name}" aria-live="polite"></span></div>`;
  }
  function picker(name, label, multiple) {
    return `<div class="custom-select field-wide" data-picker="${name}" data-multiple="${multiple}"><span class="select-label" id="label-${name}">${label}</span><button type="button" class="select-trigger" role="combobox" aria-haspopup="listbox" aria-expanded="false" aria-controls="list-${name}" aria-labelledby="label-${name} value-${name}"><span id="value-${name}" class="select-value">${multiple ? 'Select any that apply' : 'Choose an area'}</span><span class="select-arrow" aria-hidden="true">↓</span></button><div class="select-options" id="list-${name}" role="listbox" aria-labelledby="label-${name}" ${multiple ? 'aria-multiselectable="true"' : ''} hidden>${options[name].map((option, i) => `<div role="option" id="option-${name}-${i}" data-option="${i}" aria-selected="false"><span>${e(option)}</span><span class="option-check" aria-hidden="true">✓</span></div>`).join('')}</div><input type="hidden" name="${name}" value=""></div>`;
  }
  R.renderCareers = function () {
    return `<section class="page-wrap secondary-hero"><p class="eyebrow reveal">Good things happen between people</p><h1 class="display reveal">Let’s <em>collaborate.</em></h1><span class="collab-flower" aria-hidden="true">✳</span><p class="secondary-deck reveal">Different perspectives.<br>Something better, together.</p></section><section class="page-wrap collaborate-section"><div class="collaborate-aside"><h2>Say <em>hello.</em></h2><p>For designers, makers, and creative partners who want to explore an idea together.</p><p>This is a collaboration brief, not a job listing. No employment opportunities or response times are promised.</p><div class="demo-note"><strong>LOCAL DEMO / nothing is sent</strong><p>No inbox or submission service is configured. Review your details here, then download a text copy to keep. Please use sample details rather than sensitive personal information.</p></div></div><form class="collaboration-form"><div class="form-fields">${field('firstName', 'First name', 'text', true, false, 'given-name')}${field('lastName', 'Last name', 'text', true, false, 'family-name')}${picker('position', 'Position / area of collaboration', false)}${field('location', 'Location', 'text', false, false, 'address-level2')}${field('resume', 'Resume / CV (link)', 'url', false, false)}${field('available', 'Date available', 'text', false, false)}${field('email', 'Email address', 'email', true, false, 'email')}${field('portfolio', 'Portfolio or website', 'url', false, true, 'url')}${field('social', 'Other social links', 'text', false, true)}${field('specialist', 'Specialist areas', 'text', false, true)}${field('team', 'Typical team size', 'text', false, true)}${field('role', 'Typical production role', 'text', false, true)}${field('message', 'Anything else', 'textarea', false, true)}${picker('skills', 'Skill set', true)}${picker('software', 'Software proficiency', true)}</div><p class="form-help">* Required. Web links must include https:// or http://. Nothing is saved when you leave this page.</p><label class="simulation-option"><input type="checkbox" name="simulateError"> Simulate a network error (local demo)</label><div class="form-submit-row"><button type="submit" class="button local-submit">Review local brief <span aria-hidden="true">↗</span></button><span class="eyebrow">Not sent. Not stored.</span></div><p class="form-status" role="status" aria-live="polite"></p><a class="text-link brief-result" download="rochelle-collaboration-brief.txt" hidden>Download your local brief ↗</a></form></section>${end()}`;
  };
  R.mountCareers = function (root) {
    const controller = new AbortController();
    const signal = controller.signal;
    const form = root.querySelector('.collaboration-form');
    const states = [];
    let timer = 0;
    let busy = false;
    function close(state) { state.panel.hidden = true; state.button.setAttribute('aria-expanded', 'false'); state.button.removeAttribute('aria-activedescendant'); }
    function highlight(state, index) {
      state.index = (index + state.items.length) % state.items.length;
      state.items.forEach((item, i) => item.classList.toggle('is-focused', i === state.index));
      state.button.setAttribute('aria-activedescendant', state.items[state.index].id);
      state.items[state.index].scrollIntoView({ block: 'nearest' });
    }
    function open(state) {
      states.forEach(other => { if (other !== state) close(other); });
      state.panel.hidden = false;
      state.button.setAttribute('aria-expanded', 'true');
      highlight(state, state.index);
    }
    function select(state, index) {
      if (state.multiple) { if (state.selected.has(index)) state.selected.delete(index); else state.selected.add(index); }
      else { state.selected.clear(); state.selected.add(index); }
      state.items.forEach((item, i) => item.setAttribute('aria-selected', String(state.selected.has(i))));
      const value = [...state.selected].sort((a, b) => a - b).map(i => options[state.name][i]).join(', ');
      state.element.querySelector('.select-value').textContent = value || (state.multiple ? 'Select any that apply' : 'Choose an area');
      state.element.querySelector('input').value = value;
      state.index = index;
      if (!state.multiple) close(state); else highlight(state, index);
      state.button.focus({ preventScroll: true });
      clearResult();
    }
    root.querySelectorAll('[data-picker]').forEach(element => {
      const state = { element, name: element.dataset.picker, multiple: element.dataset.multiple === 'true', button: element.querySelector('.select-trigger'), panel: element.querySelector('.select-options'), items: [...element.querySelectorAll('[role="option"]')], selected: new Set(), index: 0, search: '', searchTime: 0 };
      states.push(state);
      state.button.addEventListener('click', () => state.panel.hidden ? open(state) : close(state), { signal });
      state.panel.addEventListener('click', event => { const option = event.target.closest('[data-option]'); if (option) select(state, Number(option.dataset.option)); }, { signal });
      state.button.addEventListener('keydown', event => {
        const key = event.key;
        if (key === 'Escape') { if (!state.panel.hidden) { event.preventDefault(); event.stopPropagation(); close(state); } return; }
        if (key === 'Tab') { close(state); return; }
        if (['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(key)) {
          event.preventDefault();
          if (state.panel.hidden) { open(state); if (key === 'End') highlight(state, state.items.length - 1); return; }
          if (key === 'Enter' || key === ' ') select(state, state.index);
          else highlight(state, key === 'Home' ? 0 : key === 'End' ? state.items.length - 1 : state.index + (key === 'ArrowDown' ? 1 : -1));
        } else if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          const now = Date.now(); state.search = now - state.searchTime > 700 ? key : state.search + key; state.searchTime = now;
          const index = options[state.name].findIndex(option => option.toLowerCase().startsWith(state.search.toLowerCase()));
          if (state.panel.hidden) open(state);
          if (index !== -1) highlight(state, index);
        }
      }, { signal });
    });
    document.addEventListener('pointerdown', event => states.forEach(state => { if (!state.element.contains(event.target)) close(state); }), { signal });
    document.addEventListener('focusin', event => states.forEach(state => { if (!state.element.contains(event.target)) close(state); }), { signal });
    const status = root.querySelector('.form-status');
    const result = root.querySelector('.brief-result');
    const submit = root.querySelector('.local-submit');
    function clearResult() {
      clearTimeout(timer);
      if (busy) {
        busy = false;
        submit.disabled = false;
        submit.innerHTML = 'Review local brief <span aria-hidden="true">↗</span>';
        form.removeAttribute('aria-busy');
      }
      result.hidden = true;
      result.removeAttribute('href');
      status.textContent = '';
      status.removeAttribute('data-state');
    }
    function showError(input) {
      const error = root.querySelector('#error-' + input.name);
      if (!error) return;
      error.textContent = input.validationMessage;
      input.setAttribute('aria-invalid', String(!input.validity.valid));
    }
    form.addEventListener('invalid', event => showError(event.target), { capture: true, signal });
    form.addEventListener('focusout', event => { if (event.target.matches('.floating-field input, .floating-field textarea')) showError(event.target); }, { signal });
    form.addEventListener('input', event => { if (event.target.getAttribute('aria-invalid') === 'true') showError(event.target); clearResult(); }, { signal });
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (busy || !form.reportValidity()) return;
      busy = true; submit.disabled = true; submit.textContent = 'Reviewing locally…'; result.hidden = true;
      status.textContent = 'Local demo: reviewing the brief. No network request is being made.';
      form.setAttribute('aria-busy', 'true');
      const data = new FormData(form);
      timer = window.setTimeout(() => {
        busy = false; submit.disabled = false; submit.innerHTML = 'Review local brief <span aria-hidden="true">↗</span>'; form.removeAttribute('aria-busy');
        if (data.has('simulateError')) { status.dataset.state = 'error'; status.textContent = 'Simulated network error — no submission was attempted. Your input is still here. Uncheck the simulation option and review again to download a local copy.'; return; }
        status.dataset.state = 'complete'; status.textContent = 'Local review complete. Nothing was sent or saved to a server. Download this copy for yourself; a verified contact address is still needed before sharing it.';
        const labels = { firstName: 'First name', lastName: 'Last name', position: 'Area of collaboration', location: 'Location', resume: 'Resume / CV', available: 'Date available', email: 'Email', portfolio: 'Portfolio', social: 'Social links', specialist: 'Specialist areas', team: 'Typical team size', role: 'Typical production role', message: 'Anything else', skills: 'Skill set', software: 'Software proficiency' };
        const text = 'ROCHELLE / LOCAL COLLABORATION BRIEF\nNot submitted. No contact address is configured.\n\n' + Object.entries(labels).map(([key, label]) => label + ': ' + (data.get(key) || 'Not provided')).join('\n\n');
        result.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text); result.hidden = false;
      }, 700);
    }, { signal });
    return () => { controller.abort(); clearTimeout(timer); };
  };

  R.posts = [
    { slug: 'making-complexity-readable', title: 'Making complexity readable.', category: 'Studio Notes', author: 'Rochelle — portfolio editorial', date: 'Undated design note', cover: image('life-09'), excerpt: 'A working framework for turning a complicated flow into a clear next step.', body: [
      ['Start with a decision, not a screen', 'A product screen is often the visible edge of a much larger system. Cross-border payments bring together people, currencies, timing, and rules. Drawing the interface before understanding those relationships can produce a polished surface with an unclear purpose.', 'A useful starting question is simple: what decision does this person need to make here? Write that question in plain language. Then separate the information that supports it from information that merely happens to be available. This is a design exercise, not a claim that any particular product has already been improved.'],
      ['Build a vocabulary of states', 'Pending, under review, and failed do not mean the same thing. A state label becomes useful when it explains what is happening, what is expected next, and whether the person needs to do anything. Colour can reinforce that message, but should never be its only carrier.', 'For a concept flow, I would map the ordinary path alongside the exceptions. What happens if a document is incomplete? What if a payment is still processing? The aim is not to put every possibility on one screen. It is to make each possibility understandable at the moment it matters.'],
      ['Make the next step specific', '“Continue” can be appropriate, but it is not a substitute for a clear action. Where the consequence matters, name it: review details, upload a document, or return to a draft. Keep important context next to the action rather than sending someone back through a sequence to reconstruct it.', 'The same principle applies to errors. A useful error describes the problem and offers a plausible recovery path. If there is no immediate action available, say so. An honest waiting state is better than a button that creates false confidence.'],
      ['Keep the evidence separate', 'The FLOW artwork accompanying this note is a visual concept study. Its rhythm is a metaphor for information moving through a system, not a screenshot or a measured outcome.', 'A concept can explain an approach, but it cannot prove usability on its own. Before treating it as a product recommendation, observe real tasks, review accessibility, and check the constraints with the people responsible for the underlying system. Clarity is a practice of asking better questions, not a decorative finish.']
    ] },
    { slug: 'less-noise-more-meaning', title: 'Less noise. More meaning.', category: 'Opinions', author: 'Rochelle — portfolio editorial', date: 'Undated design note', cover: image('life-08'), excerpt: 'Why restraint is not the same as removing personality from an interface.', body: [
      ['Quiet does not have to mean empty', 'Minimalism is easy to describe as subtraction. Remove a border, shorten a label, hide an explanation. But a quieter interface is not automatically a clearer one. Sometimes a little more language saves someone a great deal of uncertainty.', 'The useful distinction is between noise and support. Noise competes with the task; support makes the task legible. A small piece of guidance near an unfamiliar requirement can be more valuable than another large area of whitespace.'],
      ['Give emphasis a job', 'When everything is large, bright, or moving, there is no hierarchy left to read. Emphasis works through contrast. A strong primary action needs calmer neighbours. A warning needs a meaning that cannot be mistaken for ordinary decoration.', 'This does not forbid expressive typography or vivid colour. It asks those choices to earn their place. In a portfolio, a dramatic headline can set a mood. In a verification flow, the same intensity might make a routine step feel alarming. Context changes the right answer.'],
      ['Motion should complete a sentence', 'A transition can explain that one thing became another, or that a panel belongs to the item just selected. Those are useful sentences. Endless motion that says only “look at me” quickly becomes an interruption.', 'A reduced-motion version should preserve the relationship, not simply leave the interface in an unfinished state. Labels, order, and visible selection should make sense without an animation. Movement can add character, but should not be the sole source of meaning.'],
      ['Leave room for attention', 'Restraint is a form of generosity. It lets a person spend attention on their own goal instead of decoding the interface. That is especially important when the subject is money, identity, or risk.', 'The LIQUID study shown here explores a single form against an open field. It is an editorial illustration, not evidence for a product decision. The principle it prompts is smaller and more practical: give each important idea enough space to be understood, and let the rest wait its turn.']
    ] },
    { slug: 'a-system-not-a-template', title: 'A system, not a template.', category: 'Opinions', author: 'Rochelle — portfolio editorial', date: 'Undated design note', cover: image('cover-10'), excerpt: 'Consistency should make room for judgment, not flatten every experience.', body: [
      ['Recognisable is not identical', 'A design system is useful when it helps people recognise how an experience works. It becomes limiting when every problem is forced into the same composition. A payment overview and a document review may share typography and controls while requiring very different information structures.', 'The question is not whether two screens look alike. It is whether the same concept behaves consistently and whether meaningful differences are visible. Consistency should reduce the cost of learning, not remove the need to think.'],
      ['Write the reasoning beside the rule', 'A component library can tell a designer what exists. It may not tell them when to use it. An instruction such as “use this status for a process that has started but is not complete” is more useful than a swatch called yellow.', 'Guidance is strongest when it includes a boundary. Explain what a pattern does well, where it stops being appropriate, and what another pattern would communicate instead. This makes exceptions discussable rather than accidental.'],
      ['Treat exceptions as information', 'An unusual case is not automatically a failure of the system. It might reveal a missing pattern, a different task, or an assumption that was too narrow. Gather the reason before deciding to add another component.', 'If a new variant is needed, make its difference explicit. If it is not, explain how an existing pattern can support the task. Both decisions benefit from a small, clear record of the trade-off. More components are not always more capability.'],
      ['Protect room for expression', 'A coherent product can still have a point of view. Rhythm, image direction, and language can create identity without changing how a familiar control behaves. The PULSE visual study is one exploration of variation inside repeated rules.', 'This note proposes a way to think about systems; it does not describe a documented client implementation. A good system is a living agreement between the people who build it and the people who use it. Its rules should be understandable enough to follow, and thoughtful enough to question.']
    ] },
    { slug: 'room-for-play', title: 'Make room for play.', category: 'Studio Notes', author: 'Rochelle — portfolio editorial', date: 'Undated design note', cover: image('life-03'), excerpt: 'Visual experiments as a place to ask questions without pretending to have all the answers.', body: [
      ['An experiment needs a question', 'Play can look spontaneous from the outside. A useful visual experiment often starts with a deliberate constraint: one material, two colours, a limited set of forms. Within that boundary, small changes become easier to see.', 'The question may be as simple as how a soft curve behaves beside a hard edge, or how an oversized word changes the balance of an image. There is no need to dress that question up as a business outcome. Exploration is valuable on its own terms.'],
      ['Change one relationship at a time', 'If the colour, crop, texture, and typography all change at once, it becomes hard to know what created the difference. Keeping some elements steady makes each variation a more legible conversation with the previous one.', 'That does not mean the process must be rigid. It means noticing what happened. A surprising crop might become the next constraint. An awkward overlap might reveal a better sense of scale. The result can be playful while the observation remains precise.'],
      ['Translate principles, not surfaces', 'A sculptural study cannot be pasted onto a product and called a design strategy. The more useful transfer is often abstract: a clearer hierarchy, a more confident use of space, or a rhythm that guides attention.', 'In a payments interface, those lessons need to be reconsidered around the task and its risks. What felt exciting in a poster might be distracting in a form. A visual direction is a starting hypothesis, not permission to ignore usability.'],
      ['Label the work honestly', 'The illustration in this note is supplied character artwork. It is not client photography, a product screenshot, or a record of a shipped feature. Keeping that distinction visible lets the image be enjoyed without asking it to prove something it cannot.', 'For me, the interesting space lies between curiosity and care: enough freedom to discover a new direction, and enough discipline to know what still needs testing. Leave room for that space. Not every experiment needs to be a final answer.']
    ] }
  ];
  let blogCategory = 'All Posts';
  const postCard = (post, pinned) => `<a class="${pinned ? 'pinned-note' : 'article-row'}" href="${R.link('/post/' + post.slug)}"><div class="note-cover"><img src="${post.cover}" alt="${e(post.title)} — concept artwork cover" loading="lazy"><span class="note-open" aria-hidden="true">↗</span></div><div class="note-copy"><p class="eyebrow">${e(post.category)}${pinned ? '' : ' / Design note'}</p><h3>${e(post.title)}</h3>${pinned ? '' : `<p class="note-excerpt">${e(post.excerpt)}</p><p class="note-meta">${e(post.author)} · ${e(post.date)}</p>`}</div></a>`;
  const filteredPosts = () => R.posts.filter(post => blogCategory === 'All Posts' || post.category === blogCategory);
  const postList = () => filteredPosts().map(post => postCard(post, false)).join('') || '<div class="notes-empty"><span aria-hidden="true">↳</span><h3>A little quiet here.</h3><p>No Motion notes yet. The pinned reading above is still here, or explore another category.</p></div>';
  R.renderBlog = function () {
    return `<section class="page-wrap secondary-hero notes-hero"><p class="eyebrow reveal">Ideas in progress / Rochelle’s portfolio editorial</p><h1 class="display reveal">Marginal <em>notes.</em></h1><p class="secondary-deck reveal">On making useful things.<br>And making space to play.</p></section><section class="page-wrap pinned-section"><div class="section-head"><h2>Pinned reading</h2><span class="eyebrow">Three things to think about</span></div><div class="pinned-notes">${[R.posts[3], R.posts[1], R.posts[2]].map(post => postCard(post, true)).join('')}</div></section><section class="page-wrap articles-section"><div class="articles-heading"><h2>All <em>articles.</em></h2><div class="post-filters" aria-label="Filter design notes">${['All Posts', 'Motion', 'Studio Notes', 'Opinions'].map(category => `<button type="button" data-post-category="${category}" aria-pressed="${category === blogCategory}">${category}</button>`).join('')}</div></div><p class="post-count" aria-live="polite">${filteredPosts().length} design notes</p><div class="article-list">${postList()}</div><p class="editorial-disclosure">Original portfolio editorial written for this site. These are concept-based design notes, not press coverage, client testimonials, or claims of published research.</p></section>${end()}`;
  };
  R.mountBlog = function (root) {
    const controller = new AbortController();
    const list = root.querySelector('.article-list');
    let timer = 0;
    root.querySelectorAll('[data-post-category]').forEach(button => button.addEventListener('click', () => {
      blogCategory = button.dataset.postCategory;
      root.querySelectorAll('[data-post-category]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      clearTimeout(timer); list.getAnimations().forEach(animation => animation.cancel());
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reduced) list.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: 'forwards' });
      timer = setTimeout(() => {
        list.getAnimations().forEach(animation => animation.cancel()); list.innerHTML = postList();
        root.querySelector('.post-count').textContent = `${filteredPosts().length} design notes`;
        if (!reduced) list.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 250, easing: 'ease-out' });
      }, reduced ? 0 : 180);
    }, { signal: controller.signal }));
    return () => { controller.abort(); clearTimeout(timer); list.getAnimations().forEach(animation => animation.cancel()); };
  };
  R.articleHTML = function (slug) {
    const post = R.posts.find(item => item.slug === slug);
    if (!post) return '<article class="note-article"><h1>Note not found.</h1><p>Choose one of the four design notes in the journal.</p></article>';
    return `<article class="note-article"><p class="eyebrow">${e(post.category)} / Portfolio editorial</p><h1 id="article-title">${e(post.title)}</h1><p class="article-byline">${e(post.author)}<br>${e(post.date)} · ${Math.ceil(post.body.reduce((count, section) => count + section.join(' ').split(/\s+/).length, 0) / 180)} min read</p><img class="article-cover" src="${post.cover}" alt="${e(post.title)} — concept study, not a product screenshot"><p class="article-intro">${e(post.excerpt)}</p>${post.body.map(section => `<section><h2>${e(section[0])}</h2>${section.slice(1).map(paragraph => `<p>${e(paragraph)}</p>`).join('')}</section>`).join('')}<div class="article-endnote"><p class="eyebrow">A note on this note</p><p>Concept-based editorial prepared for Rochelle’s portfolio. No client results, publication history, or research findings are claimed.</p></div><a href="${R.link('/blog')}" class="text-link">Back to all notes ↗</a></article>`;
  };

  const brief = 'ROCHELLE / A CONVERSATION STARTER\n\nUI Designer — cross-border payments, merchant onboarding, KYC and risk.\n\nNo verified email, profile URL, resume URL or messaging number is configured in this portfolio. This file is a local planning aid, not a submission or a contact endpoint.\n\nYOUR COLLABORATION BRIEF\n1. What are you making?\n2. Who is it for?\n3. What decision or task needs to become clearer?\n4. What is in scope, and what is not?\n5. What constraints should we know (timing, budget, platform, accessibility)?\n6. What materials are available? Share no confidential data here.\n7. What would a useful next conversation cover?\n8. Your preferred reply address, to add only when you have a verified recipient.\n\nKeep this file locally. Share it yourself only after obtaining Rochelle’s approved contact details. No message has been sent.\n';
  R.renderContact = function () {
    const download = 'data:text/plain;charset=utf-8,' + encodeURIComponent(brief);
    return `<section class="contact-page page-wrap"><span class="contact-loop contact-loop-one" aria-hidden="true"></span><span class="contact-loop contact-loop-two" aria-hidden="true"></span><p class="eyebrow reveal">An idea starts with a hello.</p><h1 class="contact-title reveal"><span>Start</span><span class="contact-a">a</span><em>conversation.</em></h1><div class="contact-options"><section class="contact-option reveal"><p class="eyebrow">01 / Project conversations</p><h2>Put it into <em>words.</em></h2><p>A verified email address has not been added yet. No mail link is published until Rochelle approves one.</p><a class="contact-action" href="${download}" download="rochelle-collaboration-brief.txt">Download a collaboration brief <span aria-hidden="true">↗</span></a></section><section class="contact-option reveal"><p class="eyebrow">02 / Creative connections</p><h2>Find a little <em>common ground.</em></h2><p>A verified profile or messaging number has not been added yet. You can still prepare a local introduction.</p><a class="contact-action" href="${R.link('/careers')}">Build your local introduction <span aria-hidden="true">↗</span></a></section></div><p class="contact-footnote">Offline portfolio. Downloads stay on your device. Nothing is sent.<br><a href="${R.link('/privacy-policy')}">Privacy</a> / <a href="${R.link('/cookies')}">Cookies</a></p></section>`;
  };

  const privacy = [
    ['About this notice', 'This notice describes the standalone, offline Rochelle portfolio and the behaviour included in this version. It is a plain-language description of this site, not a statement about every service Rochelle might use elsewhere.', 'The portfolio presents design work, concept studies, and editorial notes. It has no account system, server-side submission service, or analytics integration. If the site is changed or hosted with additional services, this notice must be reviewed against that new configuration.'],
    ['Information you choose to enter', 'The collaboration form accepts the details you type, including a name, email address, optional links, and areas of practice. The newsletter demonstration may also accept an email address. These controls run locally; they do not transmit the values to a recipient.', 'Use sample information when exploring the demo. Do not enter identity documents, payment card information, passwords, financial records, or confidential project material. None of that information is needed to browse this portfolio.'],
    ['How local form data is used', 'Input is used only to demonstrate field validation, selection controls, and local review states. If you choose to download a collaboration brief, the browser creates a text file containing the details included in that review.', 'A successful local review means only that the demonstration completed. It does not mean an application, inquiry, or subscription has been delivered or accepted. No actual recipient is configured.'],
    ['No backend or inbox', 'This version does not send form contents to a backend, email service, customer relationship system, or mailing list. A simulated error is a local demonstration of an error state; it is not evidence of a real network request.', 'Approved contact details and a real processing service would be needed before enabling genuine delivery. The site must explain any new data handling before such a service is connected.'],
    ['Cookies and browser storage', 'This portfolio does not set application cookies or use localStorage or IndexedDB to retain form submissions. Some interface choices are remembered only in the current page’s JavaScript memory to make navigation more coherent.', 'The browser may retain history, cached asset files, or autofill values according to its own settings. Those browser features are distinct from a portfolio-owned submission database. See the Cookies page for more detail.'],
    ['Analytics and tracking', 'No analytics, advertising pixels, session replay, or behavioural tracking service is included in this offline version. The portfolio does not assign a visitor identifier or send a record of page views to an analytics provider.', 'Design animations react to local scroll, pointer, or keyboard input to update the interface. Those interactions are not collected into a remote tracking record by this application.'],
    ['Local assets and media', 'Images, fonts, and the concept motion preview are packaged with the portfolio. They are intended to work without contacting a third-party media host. Playing a local preview is not a transmission of your form data.', 'The study imagery is presented as concept work where appropriate. The use of a visual study does not imply a client relationship, an endorsement, or access to an actual product account.'],
    ['Links and navigation', 'Internal links use hash-based routes so pages remain accessible from a local HTML file. Those routes can appear in your browser history. Article navigation and legal section anchors do not submit information.', 'If approved external links are added in a future version, opening one would leave this portfolio and bring that destination’s own privacy practices into scope. No unverified email address, phone number, or profile is presented as Rochelle’s contact.'],
    ['Downloads you request', 'A downloaded brief is saved by your browser wherever you choose. The generic brief contains planning questions; a personalised brief can contain the information you entered. Keep or delete that file using your device’s normal file controls.', 'The application cannot retrieve a downloaded file or erase copies you later share. Check the contents before sending it to another person and use a verified recipient. Downloading alone does not contact Rochelle.'],
    ['Retention and clearing', 'Form values are held in the active page and are not deliberately persisted by this portfolio after you leave it. You can clear a field or close the page. Browser autofill or page restoration may behave differently depending on your settings.', 'Downloaded files, cached assets, and browser history have separate lifetimes controlled by your browser or device. If you want to remove those, use the relevant browser settings and file manager rather than relying on this page.'],
    ['Your choices and control', 'You can browse without filling in any form. You can use reduced-motion preferences, pause interactive media, and decline to download a brief. None of those choices limits access to the written portfolio content.', 'Because there is no application submission database here, there is no server record for this offline application to look up, export, or delete. If a later hosted service starts processing personal data, its operator must provide appropriate contact and request procedures.'],
    ['Security and hosting boundaries', 'Local-only behaviour reduces the need to transmit data, but it does not make a device or downloaded file private by itself. Anyone with access to your browser, shared computer, or saved files may be able to see information you enter or keep.', 'If you view this portfolio from a web host rather than a local file, the host may process ordinary request information such as IP addresses and server logs under its own configuration. This offline application does not control or describe an unknown hosting provider’s practices.'],
    ['Changes and contact configuration', 'This notice should change whenever the site’s actual data handling changes. In particular, analytics, persistent storage, externally hosted resources, and live forms would require a fresh review rather than relying on this offline description.', 'Rochelle’s approved email and profile details have not been supplied in the contact configuration. A real contact channel is a prerequisite for handling inquiries; the local brief is offered as a planning aid, not as a substitute claim that a message has been received.']
  ];
  const cookies = [
    ['What cookies are', 'Cookies are small values a website can ask a browser to store and send with later requests. They can support sessions, preferences, measurement, or advertising depending on how a site is built.', 'Not every piece of browser data is a cookie. History entries, cached images, downloaded files, and values kept temporarily in a page’s JavaScript memory are different mechanisms with different lifetimes.'],
    ['This portfolio does not set cookies', 'The standalone offline portfolio does not write application cookies and has no login, shopping cart, or authenticated session to maintain. It does not include a cookie-based analytics or advertising integration.', 'For that reason this version does not ask you to accept a collection of tracking cookies. A consent banner that pretended to manage services which do not exist would misrepresent what this application does.'],
    ['Temporary interface state', 'Filters, service-image positions, open panels, and other interface choices may remain in memory while this page is open. This supports predictable navigation without creating a persistent visitor profile.', 'These states are not written to a cookie or a remote preferences database by this portfolio. A page reload usually starts a new application session; browser restoration features may behave according to the browser’s own settings.'],
    ['Local files and browser cache', 'The browser reads the packaged images, fonts, scripts, and motion preview so the portfolio can run offline. When served from a web host, the browser may cache resources for loading efficiency.', 'A cache is not an advertising identifier installed by this portfolio. You can manage cached data through browser settings. Deleting a downloaded collaboration brief is a separate action in your device’s file manager.'],
    ['Forms and autofill', 'Form fields operate locally. The portfolio does not persist their contents in localStorage, IndexedDB, or cookies. The local download feature creates a file only when you choose to download it.', 'Your browser may offer to remember names, email addresses, or other autofill details. That is controlled by your browser preferences, not a portfolio-run data service. Use sample details on shared devices and check your autofill settings if necessary.'],
    ['Third parties and hosted copies', 'No embedded third-party analytics, advertising, or externally hosted media player is included in this offline package. Internal hash routes and article drawers do not call an outside tracking service.', 'A future web host or modified copy may add different behaviour. Review that deployment’s actual configuration and notices; this page does not promise that every independently hosted or edited copy has the same properties.'],
    ['Your settings and future changes', 'You can manage cookies, cached content, site data, and autofill through your browser’s privacy settings. Disabling cookies should not prevent the offline portfolio’s core interactions from working, because this application does not rely on them.', 'If cookies or persistent tracking are introduced later, their purpose, lifetime, provider, and available controls must be explained before deployment. Until then, this page describes the simpler current behaviour: no application cookies, no analytics, and no backend.']
  ];
  R.renderLegal = function (kind) {
    const isCookies = kind === 'cookies' || kind === '/cookies';
    const sections = isCookies ? cookies : privacy;
    const prefix = isCookies ? 'c' : 'p';
    const path = isCookies ? '/cookies' : '/privacy-policy';
    return `<section class="page-wrap legal-hero"><p class="eyebrow">The small print, in plain language</p><h1 class="display">${isCookies ? '<em>Cookies.</em>' : 'Your <em>privacy.</em>'}</h1><p>Standalone offline portfolio / Current implementation notice</p></section><div class="page-wrap legal-layout"><nav class="legal-directory" aria-label="${isCookies ? 'Cookies' : 'Privacy'} contents"><p class="eyebrow">On this page</p>${sections.map((section, i) => `<a href="${R.link(path)}#${prefix}${i + 1}" data-legal-link="${prefix}${i + 1}"><span>${String(i + 1).padStart(2, '0')}</span>${e(section[0])}</a>`).join('')}</nav><div class="legal-copy">${sections.map((section, i) => `<section id="${prefix}${i + 1}" data-legal-section tabindex="-1"><p class="eyebrow">${String(i + 1).padStart(2, '0')} / ${String(sections.length).padStart(2, '0')}</p><h2>${e(section[0])}</h2>${section.slice(1).map(paragraph => `<p>${e(paragraph)}</p>`).join('')}</section>`).join('')}<p class="legal-related">Read also: <a class="text-link" href="${R.link(isCookies ? '/privacy-policy' : '/cookies')}">${isCookies ? 'Privacy notice' : 'Cookie notice'} ↗</a></p></div></div>${R.footer()}`;
  };
  R.mountLegal = function (root) {
    const links = [...root.querySelectorAll('[data-legal-link]')];
    const sections = [...root.querySelectorAll('[data-legal-section]')];
    const controller = new AbortController();
    let frame = 0;
    const update = () => {
      frame = 0;
      let active = sections[0];
      for (const section of sections) { if (section.getBoundingClientRect().top <= 180) active = section; else break; }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) active = sections[sections.length - 1];
      links.forEach(link => { if (link.dataset.legalLink === active.id) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', request, { passive: true, signal: controller.signal });
    window.addEventListener('resize', request, { passive: true, signal: controller.signal });
    update();
    return () => { controller.abort(); cancelAnimationFrame(frame); };
  };
})();
