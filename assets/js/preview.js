/* Lightweight hover preview for GitHub repos.
 * Shows latest README (raw HTML via GitHub pages if configured) else fallback message.
 * NOTE: Directly embedding github.com pages in an iframe is blocked by X-Frame-Options.
 * To make this fully work, provide a GitHub Pages (or demo) URL via front matter: demo_url.
 */
(function(){
  const cards = document.querySelectorAll('.gallery-card[data-github]');
  const preview = document.getElementById('repo-preview');
  const frame = document.getElementById('repo-preview-frame');
  const mdBox = document.getElementById('repo-preview-md');
  const loader = document.getElementById('repo-preview-loader');
  const expandBtn = document.getElementById('repo-preview-expand');
  let hideTimer = null;
  let currentRepo = null;
  let activeCard = null;
  const cardArray = [...cards];
  let viewMode = 'readme'; // 'readme' | 'page'

  function position(){ /* centered via flex; no-op retained for API symmetry */ }

  function minimalMarkdown(md){
    // Super tiny markdown to HTML (headings, code blocks, inline code, links, lists, emphasis)
    return md
      .replace(/^###### (.*)$/gm,'<h6>$1</h6>')
      .replace(/^##### (.*)$/gm,'<h5>$1</h5>')
      .replace(/^#### (.*)$/gm,'<h4>$1</h4>')
      .replace(/^### (.*)$/gm,'<h3>$1</h3>')
      .replace(/^## (.*)$/gm,'<h2>$1</h2>')
      .replace(/^# (.*)$/gm,'<h1>$1</h1>')
      .replace(/```([\s\S]*?)```/gm,'<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g,'<code>$1</code>')
      .replace(/^> (.*)$/gm,'<blockquote>$1</blockquote>')
      .replace(/^\s*[-*] (.*)$/gm,'<li>$1</li>')
      .replace(/<li>([\s\S]*?)<\/li>/gm,'<ul><li>$1</li></ul>')
      .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/\[(.*?)\]\((.*?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  const pageCache = new Map(); // internal page path -> Promise<string|null>
  async function fetchProjectPage(path){
    if(pageCache.has(path)) return pageCache.get(path);
    const p = (async()=>{
      try {
        const res = await fetch(path, { cache:'force-cache' });
        if(res.ok){ return await res.text(); }
      } catch(e){ return null; }
      return null;
    })();
    pageCache.set(path, p);
    return p;
  }

  let showTimer=null;
  async function show(card){
    clearTimeout(hideTimer);
  activeCard = card;
  const gh = card.getAttribute('data-github');
    const demo = card.getAttribute('data-demo');
  const internalPage = card.getAttribute('data-page');
  if(internalPage){
    preview.dataset.page = internalPage;
  } else {
    delete preview.dataset.page;
  }
  viewMode = 'readme';
  position();
  const alreadyVisible = preview.classList.contains('visible');
  preview.classList.remove('hidden');
  preview.classList.add('visible');
  if(alreadyVisible){
    preview.classList.add('switching');
  }
  preview.classList.add('loading');
  preview.classList.remove('show-md');
  loader.textContent = 'Loading…';
  mdBox.innerHTML = '';
    currentRepo = gh;

    // Prefer loading internal project page (HTML fragment)
    const pagePath = card.getAttribute('data-page');
    if(pagePath){
      const html = await fetchProjectPage(pagePath);
      if(html && activeCard===card){
        // Extract the article.project portion to show inside popup
        let extracted = html;
        try {
          const tmp = document.createElement('div');
          tmp.innerHTML = html;
          const article = tmp.querySelector('article.project');
          if(article) extracted = article.outerHTML;
        } catch(e){}
        mdBox.innerHTML = `<div class=\"markdown-body project-fragment\">${extracted}</div>`;
        preview.classList.remove('loading');
        preview.classList.add('show-md');
        if(preview.classList.contains('switching')){
          setTimeout(()=> preview.classList.remove('switching'), 30);
        }
        preloadNeighbors(card);
        return;
      }
    }
    // Fallback: if demo provided
    if(demo){
      frame.src = demo;
  frame.onload = ()=>{ if(activeCard===card){ preview.classList.remove('loading'); if(preview.classList.contains('switching')) setTimeout(()=> preview.classList.remove('switching'), 30); } };
      preloadNeighbors(card);
      return;
    }
    loader.textContent = 'No preview available';
  setTimeout(()=>{ if(activeCard===card){ preview.classList.remove('loading'); preview.classList.remove('switching'); } },600);
    preloadNeighbors(card);
  }
  function scheduleHide(){
    clearTimeout(showTimer);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(()=>{
  if(!isPointerOverInteractive && !preview.classList.contains('expanded')){
        if(preview.classList.contains('visible')){
          preview.classList.add('closing');
          preview.classList.remove('visible');
      setTimeout(()=>{ preview.classList.add('hidden'); preview.classList.remove('closing'); }, 240);
        }
      }
    }, 180);
  }

  let isPointerOverInteractive = false;
  function pointerCheck(target){
    const overPreview = preview.contains(target);
    const overCard = [...cards].some(c=>c.contains(target));
    isPointerOverInteractive = overPreview || overCard;
    if(isPointerOverInteractive){
      clearTimeout(hideTimer);
    } else if(preview.classList.contains('visible')) {
      scheduleHide();
    }
  }

  // Summaries now sourced from project front matter/content; no dynamic population required.

  function preloadNeighbors(card){
    const idx = cardArray.indexOf(card);
    if(idx===-1) return;
    const next = cardArray[(idx+1)%cardArray.length];
    const prev = cardArray[(idx-1+cardArray.length)%cardArray.length];
    [next, prev].forEach(c=>{
  const path = c.getAttribute('data-page');
  if(path) fetchProjectPage(path);
    });
  }

  cards.forEach(card=>{
    card.addEventListener('mouseenter', ()=>{
      clearTimeout(hideTimer);
      showTimer = setTimeout(()=> show(card), 50);
    });
  });
  // Global pointer tracking for smoother hide logic
  document.addEventListener('mousemove', (e)=> pointerCheck(e.target));
  document.addEventListener('touchstart', (e)=> pointerCheck(e.target));
  // Background click still closes
  preview.addEventListener('click', (e)=>{ if(e.target===preview){ preview.classList.add('closing'); preview.classList.remove('visible'); setTimeout(()=>{ preview.classList.add('hidden'); preview.classList.remove('closing'); },240); } });
  if(expandBtn){
    expandBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
  const internalPage = preview.dataset.page;
  if(!internalPage) return;
  window.location.href = internalPage;
    });
  }
  window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') preview.classList.add('hidden'); });
  window.addEventListener('keydown', (e)=>{
    if(!preview.classList.contains('visible')) return;
    if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(e.key)){
      e.preventDefault();
      let idx = activeCard ? cardArray.indexOf(activeCard) : 0;
      if(idx < 0) idx = 0;
      const horiz = (e.key==='ArrowRight' || e.key==='ArrowDown') ? 1 : -1;
      let next = idx + horiz;
      if(next < 0) next = cardArray.length -1;
      if(next >= cardArray.length) next = 0;
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
      show(cardArray[next]);
    }
  });
})();
