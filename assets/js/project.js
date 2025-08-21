/* Fetch and inject GitHub README into project page */
// Drawer logic (always run, with debug)
(function(){
  const drawer = document.getElementById('project-drawer');
  const toggleBtn = document.getElementById('project-drawer-toggle');
  const closeBtn = document.getElementById('project-drawer-close');
  console.log('[Drawer Debug] drawer:', drawer, 'toggleBtn:', toggleBtn, 'closeBtn:', closeBtn);
  function openDrawer(){
    if(!drawer) return;
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    if(toggleBtn) {
      toggleBtn.setAttribute('aria-expanded','true');
      toggleBtn.classList.add('drawer-open');
      console.log('[DevTools] toggleBtn.classList:', toggleBtn.classList.toString());
      console.log('[DevTools] toggleBtn computed display:', window.getComputedStyle(toggleBtn).display);
    }
    console.log('[Drawer Debug] Drawer opened');
  }
  function closeDrawer(){
    if(!drawer) return;
    // Move focus to toggleBtn before hiding drawer for accessibility
    if(toggleBtn) {
      toggleBtn.focus();
    }
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    if(toggleBtn) {
      toggleBtn.setAttribute('aria-expanded','false');
      toggleBtn.classList.remove('drawer-open');
      console.log('[DevTools] toggleBtn.classList:', toggleBtn.classList.toString());
      console.log('[DevTools] toggleBtn computed display:', window.getComputedStyle(toggleBtn).display);
    }
    console.log('[Drawer Debug] Drawer closed');
  }
  if(toggleBtn){
    toggleBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      console.log('[Drawer Debug] Toggle button clicked. Drawer open?', drawer.classList.contains('open'));
      if(drawer.classList.contains('open')) closeDrawer(); else openDrawer();
    });
  }
  if(closeBtn){
    closeBtn.addEventListener('click', (e)=>{
      e.stopPropagation();
      console.log('[Drawer Debug] Close button clicked'); closeDrawer();
    });
  }
  if(drawer){
    drawer.addEventListener('click', (e)=>{
      e.stopPropagation();
    });
  }
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && drawer.classList.contains('open')) { console.log('[Drawer Debug] Escape pressed'); closeDrawer(); } });
  // click outside to close
  document.addEventListener('click', (e)=>{
    if(!drawer || !drawer.classList.contains('open')) return;
    // Only close if click is truly outside both drawer and toggle button
    if(drawer.contains(e.target) || (toggleBtn && toggleBtn.contains(e.target))) return;
    console.log('[Drawer Debug] Click outside drawer'); closeDrawer();
  });
})();

window.initProjectTabs = function(scope=document){
  const container = scope.querySelector('#project-readme'); // only exists if github repo

  // Tabs logic
  const tabButtons = scope.querySelectorAll('.project-tab');
  const panels = scope.querySelectorAll('.tab-panel');
  let readmeLoaded = false;
  function activateTab(btn){
    if(btn.classList.contains('active')) return;
    tabButtons.forEach(b=>{ b.classList.remove('active'); b.setAttribute('aria-selected','false'); b.tabIndex = -1; });
    panels.forEach(p=>{ p.classList.remove('active'); p.hidden = true; });
    btn.classList.add('active');
    btn.setAttribute('aria-selected','true');
    btn.tabIndex = 0;
    const target = btn.getAttribute('data-tab-target');
    const panel = document.getElementById(`tab-${target}`);
    if(panel){ panel.classList.add('active'); panel.hidden = false; }
  if(target==='readme' && !readmeLoaded && container){ loadReadme(); readmeLoaded = true; }
  }
  if(tabButtons.length){
    tabButtons.forEach(btn=>{
      btn.addEventListener('click', ()=>activateTab(btn));
      btn.addEventListener('keydown', (e)=>{
        if(e.key==='ArrowRight' || e.key==='ArrowLeft'){
          e.preventDefault();
          const arr = Array.from(tabButtons);
          const idx = arr.indexOf(btn);
          const dir = (e.key==='ArrowRight') ? 1 : -1;
          let next = (idx + dir + arr.length) % arr.length;
          activateTab(arr[next]);
          arr[next].focus();
        }
      });
    });
  }

  // Document navigation (multiple PDFs)
  const docNavButtons = scope.querySelectorAll('.doc-nav-btn');
  if(docNavButtons.length){
    const docs = scope.querySelectorAll('.project-doc');
    function showDoc(idx){
      docs.forEach((d,i)=>{ d.style.display = (i===idx)?'block':'none'; });
      docNavButtons.forEach((b,i)=>{ b.classList.toggle('active', i===idx); });
    }
    docNavButtons.forEach((b,i)=>{ b.addEventListener('click', ()=>showDoc(i)); });
    showDoc(0);
  }

  function loadReadme(){ if(!container) return; }
  if(!container) return; // no README container -> stop (project without github repo)
  const repo = container.getAttribute('data-github');
  if(!repo) return;
  async function fetchReadme(){
    try {
      const parts = repo.split('/').filter(Boolean);
      const user = parts[2];
      const rname = parts[3];
      if(!user||!rname){ throw new Error('Bad repo url'); }
      const branches = ['main','master'];
      for(const br of branches){
        const raw = `https://raw.githubusercontent.com/${user}/${rname}/${br}/README.md`;
        const res = await fetch(raw, { cache:'reload' });
        if(res.ok){ return await res.text(); }
      }
    } catch(e){ return null; }
    return null;
  }
  function minimal(md){
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
  (async()=>{
    const md = await fetchReadme();
    if(!md){ container.innerHTML = '<p class="dim">README not available.</p>'; return; }
    let html;
    if(window.marked){
      try {
        if(!window.__markedConfigured){
          window.marked.setOptions({ gfm:true, headerIds:false, mangle:false });
          window.__markedConfigured = true;
        }
        html = window.marked.parse(md.substring(0,120000));
      } catch(e){ html = minimal(md.substring(0,8000)); }
    } else {
      html = minimal(md.substring(0,8000));
    }
    container.innerHTML = '<h2>Repository README</h2><div class="markdown-body">'+html+'</div>';
    if(window.hljs){
      container.querySelectorAll('pre code').forEach(b=>{ try { window.hljs.highlightElement(b); } catch(e){} });
    }
  })();
};
// Initialize on page load for static project pages
window.addEventListener('DOMContentLoaded', function(){ window.initProjectTabs(document); });
