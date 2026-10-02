/* CE Agora — JavaScript sem bibliotecas. Cada função cuida de uma parte do site. */
(() => {
'use strict';
const base=document.body.dataset.base || '', page=document.body.dataset.page;
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categories=['Cidade','Tecnologia','Cultura','Esportes','Educação','Meio ambiente','Economia'];
const images=['livros','tech','cultura','esporte','horta','feira','cidade'];
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{alert('O navegador não permitiu salvar. Verifique o armazenamento e tente novamente.');return false;}};
let news=read('ceagora.news.v1',window.NOTICIAS_INICIAIS);
if(!Array.isArray(news)) news=window.NOTICIAS_INICIAIS;
let users=read('ceagora.users.v1',[]);if(!Array.isArray(users))users=[];
let session=null;try{session=JSON.parse(sessionStorage.getItem('ceagora.session'));}catch{}
const isAdmin=()=>session?.role==='admin';
const url=n=>/^([1-8])$/.test(n.id)?`${base}materias/materia${n.id}.html`:`${base}materia.html?id=${encodeURIComponent(n.id)}`;
const img=n=>`${base}imagens/${images.includes(n.image)?n.image:'cidade'}.jpg`;
const date=n=>/^\d{4}-\d{2}-\d{2}$/.test(n.date)?n.date.split('-').reverse().join('/'):'02/10/2026';
const options=(list,selected='')=>list.map(v=>`<option${v===selected?' selected':''}>${esc(v)}</option>`).join('');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
if(session){$('.account').textContent=isAdmin()?'Meu painel ↗':'Minha conta ↗';$('.account').href=base+'admin.html';}
const current=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')===base+current){a.classList.add('active');a.setAttribute('aria-current','page');}});
function card(n){return `<article class="card"><a class="card-photo" href="${url(n)}" tabindex="-1" aria-hidden="true"><img src="${img(n)}" alt="" loading="lazy" width="470" height="336"></a><div class="card-copy"><span class="category">${esc(n.category)} / ${esc(n.region)}</span><a href="${url(n)}"><h3>${esc(n.title)}</h3></a><p>${esc(n.summary)}</p><span class="meta">${date(n)} · ${readingTime(n)} min de leitura</span></div></article>`;}
function readingTime(n){return Math.max(1,Math.ceil(String(n.body).split(/\s+/).length/200));}
function renderHero(items){
 if(!items.length)return '';
 const lead=items[0];
 return `<section class="hero" aria-label="Destaques da edição"><article class="hero-main"><div class="hero-copy"><span class="category">${esc(lead.category)} · Em destaque</span><a href="${url(lead)}"><h2>${esc(lead.title)}</h2></a><p>${esc(lead.summary)}</p><span class="meta">${esc(lead.region)} · ${readingTime(lead)} min de leitura</span></div><a href="${url(lead)}" tabindex="-1" aria-hidden="true"><img src="${img(lead)}" alt="" fetchpriority="high" width="700" height="400"></a></article><div class="hero-side">${items.slice(1,3).map(n=>`<a class="hero-tile" href="${url(n)}"><img src="${img(n)}" alt="" width="700" height="400"><div class="tile-copy"><span class="category">${esc(n.category)}</span><h2>${esc(n.title)}</h2><span class="meta">${esc(n.region)} · Leia a matéria →</span></div></a>`).join('')}</div></section>`;
}
function sidebar(){return `<section class="sidebar-box region-box"><p class="eyebrow">PERTO DE VOCÊ</p><h2>Seu lugar no Ceará</h2><p>Escolha uma cidade e acompanhe as histórias da região.</p><div class="region-links">${['Fortaleza','Sobral','Juazeiro do Norte'].map(city=>`<a href="${base}regiao.html?cidade=${encodeURIComponent(city)}">${city}<span aria-hidden="true">→</span></a>`).join('')}</div></section><section class="sidebar-box"><h2>Seleção da redação</h2><ol class="picks">${news.slice(3,6).map(n=>`<li><a href="${url(n)}">${esc(n.title)}</a></li>`).join('')||'<li>Novas histórias em breve.</li>'}</ol></section><section class="sidebar-box"><h2>Explore por assunto</h2><div class="category-links">${categories.map(c=>`<a href="${base}index.html?categoria=${encodeURIComponent(c)}">${esc(c)}</a>`).join('')}</div></section>`;}
function listing(){
 let number=1;const perPage=6;
 $('#category').insertAdjacentHTML('beforeend',options(categories));
 const params=new URLSearchParams(location.search);const initial=params.get('categoria');if(categories.includes(initial))$('#category').value=initial;
 const city=params.get('cidade');if($('#region')&&['Fortaleza','Sobral','Juazeiro do Norte'].includes(city))$('#region').value=city;
 $('#editorial-sidebar').innerHTML=sidebar();
 function render(){
  const search=normalize($('#search').value.trim()),category=$('#category').value,region=$('#region')?.value||'';
  const filtered=news.filter(n=>(!category||n.category===category)&&(!region||n.region===region)&&normalize(n.title+' '+n.summary+' '+n.region).includes(search));
  const total=Math.max(1,Math.ceil(filtered.length/perPage));number=Math.min(number,total);
  $('#count').textContent=`${filtered.length} ${filtered.length===1?'matéria':'matérias'}`;
  const showHero=page==='home'&&!search&&!category&&number===1&&filtered.length;
  $('#hero').innerHTML=showHero?renderHero(filtered):'';
  $('#news-grid').innerHTML=filtered.slice((number-1)*perPage,number*perPage).map(card).join('')||'<p class="empty">Nenhuma notícia encontrada. Tente outra busca ou categoria.</p>';
  $('#pagination').innerHTML=filtered.length?`<button data-page="${number-1}" ${number===1?'disabled':''}>← Anterior</button>`+Array.from({length:total},(_,i)=>`<button data-page="${i+1}" ${i+1===number?'aria-current="page"':''} aria-label="Página ${i+1}">${i+1}</button>`).join('')+`<button data-page="${number+1}" ${number===total?'disabled':''}>Próxima →</button>`:'';
 }
 $('#filters').addEventListener('submit',e=>e.preventDefault());$('#filters').addEventListener('input',()=>{number=1;render();});
 $('#pagination').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;number=Number(b.dataset.page);render();$('.feed').scrollIntoView({behavior:'smooth'});});render();
}
function article(){
 const id=document.body.dataset.id||new URLSearchParams(location.search).get('id');
 const n=news.find(n=>n.id===id);
 if(!n){$('#article').innerHTML=`<section class="reader"><h1>Matéria não encontrada</h1><p>Ela pode ter sido excluída no painel.</p><a class="button" href="${base}index.html">Voltar ao início</a></section>`;return;}
 const related=news.filter(item=>item.id!==id).sort((a,b)=>Number(b.category===n.category)-Number(a.category===n.category)).slice(0,2);
 document.title=n.title+' | CE Agora';
 $('#article').innerHTML=`<article class="article"><a class="back" href="${base}index.html">← Todas as notícias</a><p class="eyebrow" style="margin-top:27px">${esc(n.category)} / ${esc(n.region)}</p><h1>${esc(n.title)}</h1><p class="lead">${esc(n.summary)}</p><div class="byline"><div><p class="author">Por Redação CE Agora</p><span class="meta">${date(n)} · ${readingTime(n)} min de leitura · Matéria fictícia</span></div><button class="share-button secondary" id="share-article">Copiar link ↗</button></div><figure><img src="${img(n)}" alt="Fotografia ilustrativa sobre ${esc(n.category.toLowerCase())}" width="1200" height="750"><figcaption>Imagem ilustrativa de banco de imagens; não retrata o evento fictício. <a href="${base}creditos.html">Fonte e créditos: Pexels.</a></figcaption></figure><div class="body">${n.body.split(/\n+/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}</div><p class="notice">Conteúdo fictício produzido exclusivamente para demonstração acadêmica.</p>${related.length?`<section class="related"><h2>Continue lendo</h2><div class="related-grid">${related.map(item=>`<a href="${url(item)}"><img src="${img(item)}" alt="" loading="lazy" width="500" height="320"><h3>${esc(item.title)}</h3></a>`).join('')}</div></section>`:''}</article>`;
 $('#share-article').onclick=async()=>{
  if(n.id.startsWith('n')){toast('Matéria local: ela só existe neste navegador.');return;}
  try{await navigator.clipboard.writeText(location.href);toast('Link copiado!');}catch{toast('Copie o endereço pela barra do navegador.');}
 };
 const progress=document.createElement('div');progress.className='reading-progress';progress.setAttribute('aria-hidden','true');document.body.append(progress);
 const update=()=>{const body=$('.article .body');const end=body.offsetTop+body.offsetHeight-innerHeight;const value=Math.max(0,Math.min(100,scrollY/Math.max(1,end)*100));progress.style.width=value+'%';};
 window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();
}
let toastTimer;
function toast(message){const box=$('.toast');box.textContent=message;box.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('visible'),3500);}
function common(){
 const toggle=$('.menu-toggle'),header=$('.site-header');
 toggle.setAttribute('aria-expanded','true');
 toggle.onclick=()=>{const closed=header.classList.toggle('nav-closed');toggle.setAttribute('aria-expanded',String(!closed));};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!header.classList.contains('nav-closed')){header.classList.add('nav-closed');toggle.setAttribute('aria-expanded','false');}});
 const top=$('.back-top');window.addEventListener('scroll',()=>{top.hidden=scrollY<650;},{passive:true});top.onclick=()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 const input=$('input[name=password]');if(input){const wrapper=document.createElement('div');wrapper.className='password-row';input.parentNode.insertBefore(wrapper,input);wrapper.append(input);const button=document.createElement('button');button.type='button';button.className='password-toggle';button.textContent='Mostrar';button.setAttribute('aria-label','Mostrar senha');button.onclick=()=>{const hidden=input.type==='password';input.type=hidden?'text':'password';button.textContent=hidden?'Ocultar':'Mostrar';button.setAttribute('aria-label',hidden?'Ocultar senha':'Mostrar senha');};wrapper.append(button);}
 // O filtro por categoria também destaca o item correspondente no menu.
 const category=new URLSearchParams(location.search).get('categoria');if(category){document.querySelectorAll('.nav a').forEach(a=>{a.classList.remove('active');a.removeAttribute('aria-current');if(new URL(a.href).searchParams.get('categoria')===category){a.classList.add('active');a.setAttribute('aria-current','page');}});}
}
// SHA-256 evita guardar a senha do cadastro em texto puro. Isto NÃO torna a autenticação segura: não há backend.
async function digest(s){if(!window.crypto?.subtle)throw new Error('Abra em localhost (Live Server) ou HTTPS para usar cadastro e login.');return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');}
function auth(){ $('#auth-form').addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target),email=f.get('email').trim().toLowerCase(),password=f.get('password');const message=$('#message');const button=e.target.querySelector('button[type=submit]');button.disabled=true;
 try{if(page==='cadastro'){
  if(email==='admin@ceagora.com'||users.some(u=>u.email===email)){message.textContent='Esse e-mail já está cadastrado.';return;}
  const name=f.get('name').trim();if(!name){message.textContent='Informe seu nome.';return;}
  const salt=Array.from(crypto.getRandomValues(new Uint8Array(16)),b=>b.toString(16).padStart(2,'0')).join('');
  const user={name,email,salt,hash:await digest(salt+password)};
  if(save('ceagora.users.v1',[...users,user])){users.push(user);e.target.reset();message.textContent='Cadastro realizado! Clique em “Já tem conta? Entre” abaixo.';}
 }else{
  let active;if(email==='admin@ceagora.com'&&password==='Admin123')active={name:'Administrador',role:'admin'};
  else{const user=users.find(u=>u.email===email);if(user&&await digest(user.salt+password)===user.hash)active={name:user.name,role:'reader'};}
  if(!active){message.textContent='E-mail ou senha incorretos.';return;}
  sessionStorage.setItem('ceagora.session',JSON.stringify(active));location.href=base+'admin.html';
 }}catch(err){message.textContent=err.message;}finally{button.disabled=false;}
 });}
function admin(){
 $('#logout').onclick=()=>{sessionStorage.removeItem('ceagora.session');location.href=base+'login.html';};
 if(!session){$('#logout').hidden=true;$('#admin-content').innerHTML='<section class="reader"><h2>Entre para continuar</h2><p>Use a conta de administrador demonstrativa para gerenciar notícias.</p><a class="button" href="login.html">Ir para o login</a></section>';return;}
 if(!isAdmin()){$('#admin-content').innerHTML=`<section class="reader"><h2>Olá, ${esc(session.name)}!</h2><p>Seu cadastro de leitor foi concluído. O painel de edição é exclusivo da conta administrativa demonstrativa.</p><a class="button" href="index.html">Ler notícias</a></section>`;return;}
 $('#admin-content').innerHTML=`<div class="admin-stats" id="admin-stats"></div><div class="actions"><button id="export" class="secondary">Exportar notícias (JSON)</button><button id="restore" class="secondary">Restaurar 8 matérias iniciais</button></div><div class="admin-layout"><form id="editor" class="admin-form"><h2 id="editor-title">Nova matéria</h2><input type="hidden" name="id"><label>Título<input name="title" maxlength="160" required></label><label>Resumo<input name="summary" maxlength="300" required></label><label>Categoria<select name="category">${options(categories)}</select></label><label>Cidade<select name="region">${options(['Fortaleza','Sobral','Juazeiro do Norte'])}</select></label><label>Foto ilustrativa<select name="image">${options(images)}</select></label><div class="editor-preview"><img id="editor-image" src="${base}imagens/livros.jpg" alt="Prévia da foto selecionada"><small>Fotografia ilustrativa · Pexels</small></div><label>Texto completo<textarea name="body" required maxlength="30000"></textarea></label><div class="actions"><button type="submit">Salvar matéria</button><button type="button" id="cancel" class="secondary">Limpar / cancelar</button></div><p id="message" role="status"></p></form><section><h2>Matérias publicadas</h2><div id="admin-list"></div></section></div>`;
 const form=$('#editor');
 const preview=()=>{$('#editor-image').src=img({image:form.elements.image.value});};
 form.elements.image.addEventListener('change',preview);
 const clear=()=>{form.reset();form.elements.id.value='';$('#editor-title').textContent='Nova matéria';preview();};
 const render=()=>{$('#admin-stats').innerHTML=`<div class="stat"><strong>${news.length}</strong><span>Matérias publicadas</span></div><div class="stat"><strong>${new Set(news.map(n=>n.category)).size}</strong><span>Categorias em uso</span></div><div class="stat"><strong>${new Set(news.map(n=>n.region)).size}</strong><span>Cidades cobertas</span></div>`;$('#admin-list').innerHTML=news.map(n=>`<article class="admin-row"><span class="category">${esc(n.category)} · ${esc(n.region)}</span><h3><a href="${url(n)}">${esc(n.title)}</a></h3><button data-edit="${esc(n.id)}" class="secondary">Editar</button><button data-delete="${esc(n.id)}" class="secondary">Excluir</button></article>`).join('')||'<p>Nenhuma matéria publicada.</p>';};
 $('#cancel').onclick=()=>{clear();$('#message').textContent='';};
 form.onsubmit=e=>{e.preventDefault();if(!isAdmin())return;const d=Object.fromEntries(new FormData(form));for(const field of ['title','summary','body']){d[field]=d[field].trim();if(!d[field]){$('#message').textContent='Preencha todos os campos com texto.';return;}}
 const old=news.find(n=>n.id===d.id);d.id=old?.id||'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);d.date=old?.date||new Date().toISOString().slice(0,10);const next=old?news.map(n=>n.id===d.id?d:n):[d,...news];if(save('ceagora.news.v1',next)){news=next;clear();render();$('#message').textContent='Matéria salva neste navegador.';}};
 $('#admin-list').onclick=e=>{const b=e.target.closest('button');if(!b||!isAdmin())return;
 if(b.dataset.edit){const n=news.find(n=>n.id===b.dataset.edit);for(const [key,value]of Object.entries(n)){if(form.elements.namedItem(key))form.elements.namedItem(key).value=value;}preview();$('#editor-title').textContent='Editar matéria';$('#message').textContent='';form.scrollIntoView({behavior:'smooth'});form.elements.title.focus();}
 if(b.dataset.delete&&confirm('Excluir esta matéria deste navegador?')){const next=news.filter(n=>n.id!==b.dataset.delete);if(save('ceagora.news.v1',next)){news=next;if(form.elements.id.value===b.dataset.delete)clear();render();}}};
 $('#restore').onclick=()=>{if(confirm('Substituir todas as notícias locais pelas 8 matérias originais?')){if(save('ceagora.news.v1',window.NOTICIAS_INICIAIS)){news=structuredClone(window.NOTICIAS_INICIAIS);clear();render();}}};
 $('#export').onclick=()=>{const link=document.createElement('a');const objectURL=URL.createObjectURL(new Blob([JSON.stringify(news,null,2)],{type:'application/json'}));link.href=objectURL;link.download='noticias-ceagora.json';link.click();setTimeout(()=>URL.revokeObjectURL(objectURL),1000);};render();
}
common();
if(page==='home'||page==='region')listing();if(page==='article')article();if(page==='login'||page==='cadastro')auth();if(page==='admin')admin();
})();
