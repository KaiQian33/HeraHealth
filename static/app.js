document.addEventListener('DOMContentLoaded',()=>{
  const html=document.documentElement;
  const backdrop=document.getElementById('displayBackdrop');
  const panel=document.getElementById('displayPanel');
  const theme=document.getElementById('themeSelect');
  const font=document.getElementById('fontSizeSelect');
  const density=document.getElementById('densitySelect');
  const defaults={theme:'light',font:'default',density:'comfortable'};

  function readPreference(key,fallback){
    try{return localStorage.getItem(key)||fallback}catch(e){return fallback}
  }
  function savePreference(key,value){
    try{localStorage.setItem(key,value)}catch(e){}
  }
  function applyTheme(value){
    html.dataset.theme=value;
    savePreference('hera-theme',value);
    if(theme) theme.value=value;
  }
  function applyFont(value){
    html.dataset.fontSize=value;
    savePreference('hera-font-size',value);
    if(font) font.value=value;
  }
  function applyDensity(value){
    html.dataset.density=value;
    savePreference('hera-density',value);
    if(density) density.value=value;
  }
  applyTheme(readPreference('hera-theme',defaults.theme));
  applyFont(readPreference('hera-font-size',defaults.font));
  applyDensity(readPreference('hera-density',defaults.density));

  function openPanel(){
    if(!panel||!backdrop)return;
    panel.hidden=false;backdrop.hidden=false;
    document.body.classList.add('display-panel-open');
    const close=panel.querySelector('[data-display-close]');
    if(close)close.focus();
  }
  function closePanel(){
    if(!panel||!backdrop)return;
    panel.hidden=true;backdrop.hidden=true;
    document.body.classList.remove('display-panel-open');
  }
  document.querySelectorAll('[data-display-open]').forEach(button=>{
    button.addEventListener('click',openPanel);
  });
  document.querySelectorAll('[data-display-close]').forEach(button=>{
    button.addEventListener('click',closePanel);
  });
  if(backdrop)backdrop.addEventListener('click',closePanel);
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')closePanel();
  });
  if(theme)theme.addEventListener('change',()=>applyTheme(theme.value));
  if(font)font.addEventListener('change',()=>applyFont(font.value));
  if(density)density.addEventListener('change',()=>applyDensity(density.value));
  const reset=document.getElementById('displayReset');
  if(reset)reset.addEventListener('click',()=>{
    applyTheme(defaults.theme);applyFont(defaults.font);applyDensity(defaults.density);
  });

  const range=document.getElementById('severityRange');
  const output=document.getElementById('severityOutput');
  if(range&&output)range.addEventListener('input',()=>output.value=range.value);
});

// Optional note organiser: uses configured Gemini API if available, otherwise a local text-cleanup fallback.
document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('organiseNotes');
  const box=document.getElementById('symptomNotes');
  const status=document.getElementById('organiseStatus');
  if(!btn||!box||!status)return;
  btn.addEventListener('click',async()=>{
    if(!box.value.trim()){status.textContent='Enter notes first.';return;}
    btn.disabled=true;status.textContent='Organising your wording…';
    try{
      const form=new FormData();form.append('notes',box.value);
      const res=await fetch('/api/organise-notes',{method:'POST',body:form});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||'Unable to organise notes.');
      box.value=data.text||box.value;status.textContent=(data.mode||'Local helper')+': '+(data.notice||'Please review the result.');
    }catch(e){status.textContent=e.message||'Helper unavailable; keep your original notes.';}
    finally{btn.disabled=false;}
  });
});

