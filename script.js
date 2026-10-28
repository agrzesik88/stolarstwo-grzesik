(()=>{
const menu=document.querySelector('.mega-menu');
const backdrop=document.querySelector('.menu-backdrop');
const toggles=document.querySelectorAll('[data-menu-toggle]');
const mobile=document.querySelector('.mobile-menu-button');
function setMenu(open){if(!menu)return;menu.classList.toggle('open',open);backdrop?.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);toggles.forEach(b=>b.setAttribute('aria-expanded',String(open)));if(mobile){mobile.textContent=open?'\u2715':'\u2630';mobile.setAttribute('aria-label',open?'Zamknij menu':'Otwórz menu')}}
toggles.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();setMenu(!menu.classList.contains('open'))}));
backdrop?.addEventListener('click',()=>setMenu(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
// mobile button reuses mega menu
mobile?.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));

// lightbox
const lb=document.querySelector('.lightbox');
const lbImg=lb?.querySelector('.lightbox__image');
const lbTitle=lb?.querySelector('h2');
const lbCounter=lb?.querySelector('.lightbox__counter');
const lbClose=lb?.querySelector('.lightbox__close');
const lbPrev=lb?.querySelector('.lightbox__prev');
const lbNext=lb?.querySelector('.lightbox__next');
let gallery=[],index=0,lastFocus=null;
function openLb(button){gallery=[...document.querySelectorAll('[data-lightbox]')];index=gallery.indexOf(button);lastFocus=button;renderLb();lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lbClose?.focus()}
function renderLb(){const b=gallery[index];if(!b)return;const img=b.querySelector('img');lbImg.src=img.src;lbImg.alt=img.alt;lbTitle.textContent=b.dataset.title||img.alt;lbCounter.textContent=`${index+1}/${gallery.length}`}
function closeLb(){lb?.classList.remove('open');lb?.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus()}
function step(n){index=(index+n+gallery.length)%gallery.length;renderLb()}
document.querySelectorAll('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>openLb(b)));
lbClose?.addEventListener('click',closeLb);
lbPrev?.addEventListener('click',()=>step(-1));
lbNext?.addEventListener('click',()=>step(1));
document.addEventListener('keydown',e=>{if(!lb?.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')step(-1);if(e.key==='ArrowRight')step(1)});
// przytrzymanie fokusu w otwartym lightboxie
lb?.addEventListener('keydown',e=>{
  if(e.key!=='Tab')return;
  const f=[lbClose,lbPrev,lbNext].filter(Boolean);
  if(!f.length)return;
  const first=f[0],last=f[f.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
});

// forms
for(const form of document.querySelectorAll('.contact-form')){
const inputFile=form.querySelector('input[type=file]'),filesBox=form.querySelector('.files');let files=[];
const drawFiles=()=>{if(!filesBox)return;filesBox.textContent='';files.forEach((f,i)=>{
  const row=document.createElement('div');row.className='file-item';
  const name=document.createElement('span');name.textContent=f.name;
  const btn=document.createElement('button');btn.type='button';btn.className='file-remove';
  btn.setAttribute('aria-label','Usuń załącznik: '+f.name);btn.textContent='⌫';
  btn.addEventListener('click',()=>{files.splice(i,1);drawFiles()});
  row.append(name,btn);filesBox.append(row)})};
inputFile?.addEventListener('change',()=>{files=[...inputFile.files];drawFiles()});

const success=form.querySelector('.form-success');
const error=form.querySelector('.form-error');
const btn=form.querySelector('.send-btn');

form.addEventListener('submit',async e=>{
  e.preventDefault();
  let ok=true;
  for(const el of form.querySelectorAll('[required]')){
    const wrap=el.closest('.field,.privacy');
    const valid=el.type==='checkbox'?el.checked:el.value.trim()!=='' && (el.type!=='email'||/^\S+@\S+\.\S+$/.test(el.value));
    wrap?.classList.toggle('invalid',!valid);
    if(!valid)ok=false;
  }
  success?.classList.remove('show');
  error?.classList.remove('show');
  if(!ok)return;

  // dane formularza + zalaczniki wybrane przez uzytkownika
  const fd=new FormData();
  for(const el of form.elements){
    if(!el.name||el.type==='file'||el.type==='submit'||el.type==='button')continue;
    if(el.type==='checkbox'){if(el.checked)fd.append(el.name,el.value||'tak');continue}
    fd.append(el.name,el.value);
  }
  files.forEach(f=>fd.append('attachment',f,f.name));
  const subj=form.querySelector('[name=subject]');
  if(subj&&subj.value.trim())fd.set('_subject',subj.value.trim()+' — zapytanie ze strony');

  const url=form.action.replace('formsubmit.co/','formsubmit.co/ajax/');
  const label=btn?.textContent;
  if(btn){btn.disabled=true;btn.textContent='Wysyłanie…'}
  try{
    const res=await fetch(url,{method:'POST',body:fd,headers:{'Accept':'application/json'}});
    const data=await res.json().catch(()=>null);
    if(!res.ok||!data||String(data.success)!=='true')throw new Error('nieprawidłowa odpowiedź');
    form.reset();files=[];drawFiles();
    success?.classList.add('show');
  }catch(err){
    error?.classList.add('show');
  }finally{
    if(btn){btn.disabled=false;btn.textContent=label}
  }
});
form.querySelectorAll('[required]').forEach(el=>el.addEventListener('input',()=>el.closest('.field,.privacy')?.classList.remove('invalid')));
}

// aktualny rok w stopce
document.querySelectorAll('[data-year]').forEach(el=>{el.textContent=String(new Date().getFullYear())});

// cookies
const cookie=document.querySelector('.cookie');
if(cookie&&!localStorage.getItem('sg-cookie-choice'))cookie.classList.add('show');
document.querySelectorAll('[data-cookie]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('sg-cookie-choice',b.dataset.cookie);cookie?.classList.remove('show')}));

// ---- animacje przy przewijaniu ----
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealables=[...document.querySelectorAll('main > div, main > section, .gallery-item, .about-row, .home-card, .trust-logo, .contact-info, .job, .privacy-copy')];
if(!reduceMotion&&'IntersectionObserver' in window){
  const stagger=new Set(['gallery-item','home-card','trust-logo']);
  const io=new IntersectionObserver(entries=>{entries.forEach(e=>{
    if(!e.isIntersecting)return;
    const el=e.target;
    if(el.dataset.delay)el.style.transitionDelay=el.dataset.delay;
    el.classList.add('in');io.unobserve(el);
    setTimeout(()=>{el.style.transitionDelay=''},1600);
  })},{rootMargin:'0px 0px -6% 0px',threshold:.08});
  revealables.forEach(el=>{
    if(el.getBoundingClientRect().top<innerHeight*0.9)return; // widoczne od razu - nie chowamy
    if([...el.classList].some(c=>stagger.has(c))){
      const i=[...el.parentElement.children].indexOf(el);
      el.dataset.delay=Math.min(Math.max(i,0),8)*60+'ms';
    }
    el.classList.add('will-reveal');
    io.observe(el);
  });
}

// ---- przycisk "do gory" ----
const toTop=document.createElement('button');
toTop.type='button';toTop.className='to-top';toTop.textContent='\u2191';
toTop.setAttribute('aria-label','Przewiń na górę strony');
document.body.append(toTop);
toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'}));

// ---- delikatna paralaksa (tylko desktop) ----
const parallax=[...document.querySelectorAll('.hero-clip,.home-story__image')];
let ticking=false;
function onScroll(){
  if(ticking)return;ticking=true;
  requestAnimationFrame(()=>{
    ticking=false;
    toTop.classList.toggle('show',scrollY>700&&!(cookie&&cookie.classList.contains('show')));
    if(reduceMotion||innerWidth<=900){parallax.forEach(el=>{el.style.transform=''});return}
    const mid=innerHeight/2;
    parallax.forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      const y=Math.max(-45,Math.min(45,(r.top+r.height/2-mid)*.05));
      el.style.transform='translate3d(0,'+y.toFixed(1)+'px,0)';
    });
  });
}
addEventListener('scroll',onScroll,{passive:true});
addEventListener('resize',onScroll,{passive:true});
onScroll();
})();
