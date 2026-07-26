(()=>{
const site=document.querySelector('.site');
const menu=document.querySelector('.mega-menu');
const backdrop=document.querySelector('.menu-backdrop');
const toggles=document.querySelectorAll('[data-menu-toggle]');
function setMenu(open){if(!menu)return;menu.classList.toggle('open',open);backdrop?.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);toggles.forEach(b=>b.setAttribute('aria-expanded',String(open)))}
toggles.forEach(b=>b.addEventListener('click',e=>{e.preventDefault();setMenu(!menu.classList.contains('open'))}));backdrop?.addEventListener('click',()=>setMenu(false));document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
// mobile button reuses mega menu
const mobile=document.querySelector('.mobile-menu-button');mobile?.addEventListener('click',()=>setMenu(!menu.classList.contains('open')));
// lightbox
const lb=document.querySelector('.lightbox');const lbImg=lb?.querySelector('.lightbox__image');const lbTitle=lb?.querySelector('h2');const lbCounter=lb?.querySelector('.lightbox__counter');
let gallery=[],index=0;
function openLb(button){gallery=[...document.querySelectorAll('[data-lightbox]')];index=gallery.indexOf(button);renderLb();lb.classList.add('open');lb.setAttribute('aria-hidden','false');document.body.style.overflow='hidden'}
function renderLb(){const b=gallery[index];if(!b)return;const img=b.querySelector('img');lbImg.src=img.src;lbImg.alt=img.alt;lbTitle.textContent=b.dataset.title||img.alt;lbCounter.textContent=`${index+1}/${gallery.length}`}
function closeLb(){lb?.classList.remove('open');lb?.setAttribute('aria-hidden','true');document.body.style.overflow=''}
document.querySelectorAll('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>openLb(b)));lb?.querySelector('.lightbox__close')?.addEventListener('click',closeLb);lb?.querySelector('.lightbox__prev')?.addEventListener('click',()=>{index=(index-1+gallery.length)%gallery.length;renderLb()});lb?.querySelector('.lightbox__next')?.addEventListener('click',()=>{index=(index+1)%gallery.length;renderLb()});
document.addEventListener('keydown',e=>{if(!lb?.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft'){index=(index-1+gallery.length)%gallery.length;renderLb()}if(e.key==='ArrowRight'){index=(index+1)%gallery.length;renderLb()}});
// forms
for(const form of document.querySelectorAll('.contact-form')){
 const inputFile=form.querySelector('input[type=file]'),filesBox=form.querySelector('.files');let files=[];
 filesBox?.querySelectorAll('.file-remove').forEach(btn=>btn.addEventListener('click',()=>btn.closest('.file-item')?.remove()));
 const drawFiles=()=>{if(!filesBox)return;filesBox.innerHTML='';files.forEach((f,i)=>{const row=document.createElement('div');row.className='file-item';row.innerHTML=`<span>${f.name}</span><button class="file-remove" type="button" aria-label="Usuń ${f.name}">⌫</button>`;row.querySelector('button').onclick=()=>{files.splice(i,1);drawFiles()};filesBox.append(row)})};
 inputFile?.addEventListener('change',()=>{files=[...inputFile.files];drawFiles()});
 form.addEventListener('submit',e=>{e.preventDefault();let ok=true;for(const el of form.querySelectorAll('[required]')){const wrap=el.closest('.field,.privacy');const valid=el.type==='checkbox'?el.checked:el.value.trim()!=='' && (el.type!=='email'||/^\S+@\S+\.\S+$/.test(el.value));wrap?.classList.toggle('invalid',!valid);if(!valid)ok=false}if(ok){form.querySelector('.form-success')?.classList.add('show');form.reset();files=[];drawFiles()}else form.querySelector('.form-success')?.classList.remove('show')});
 form.querySelectorAll('[required]').forEach(el=>el.addEventListener('input',()=>el.closest('.field,.privacy')?.classList.remove('invalid')))
}
// cookies
const cookie=document.querySelector('.cookie');if(cookie&&!localStorage.getItem('sg-cookie-choice'))cookie.classList.add('show');
document.querySelectorAll('[data-cookie]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('sg-cookie-choice',b.dataset.cookie);cookie?.classList.remove('show')}));
})();