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
const img=n=>`${base}imagens/${images.includes(n.image)?n.image:'cidade'}.svg`;
const date=n=>/^\d{4}-\d{2}-\d{2}$/.test(n.date)?n.date.split('-').reverse().join('/'):'02/10/2026';
const options=(list,selected='')=>list.map(v=>`<option${v===selected?' selected':''}>${esc(v)}</option>`).join('');
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
if(session){$('.account').textContent=isAdmin()?'Meu painel ↗':'Minha conta ↗';$('.account').href=base+'admin.html';}
const current=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.nav a').forEach(a=>{if(a.getAttribute('href')===base+current){a.classList.add('active');a.setAttribute('aria-current','page');}});
function card(n){return `<article class="card"><a href="${url(n)}"><img src="${img(n)}" alt="" loading="lazy"><span class="category">${esc(n.category)}</span><h3>${esc(n.title)}</h3></a><p>${esc(n.summary)}</p><span class="meta">${esc(n.region)} · ${date(n)}</span></article>`;}
function listing(){
 let number=1;const perPage=6;
 $('#category').insertAdjacentHTML('beforeend',options(categories));
 const initial=new URLSearchParams(location.search).get('categoria');if(categories.includes(initial))$('#category').value=initial;
 function render(){
  const search=normalize($('#search').value.trim()),category=$('#category').value,region=$('#region')?.value||'';
  const filtered=news.filter(n=>(!category||n.category===category)&&(!region||n.region===region)&&normalize(n.title+' '+n.summary+' '+n.region).includes(search));
  const total=Math.max(1,Math.ceil(filtered.length/perPage));number=Math.min(number,total);
  $('#count').textContent=`${filtered.length} ${filtered.length===1?'matéria':'matérias'}`;
  const showHero=page==='home'&&!search&&!category&&number===1&&filtered.length;
  $('#hero').innerHTML=showHero?`<article class="hero"><a href="${url(filtered[0])}" tabindex="-1" aria-hidden="true"><img src="${img(filtered[0])}" alt=""></a><div class="hero-copy"><span class="category">EM DESTAQUE / ${esc(filtered[0].category)}</span><a href="${url(filtered[0])}"><h2>${esc(filtered[0].title)}</h2></a><p>${esc(filtered[0].summary)}</p><span class="meta">${esc(filtered[0].region)} · ${date(filtered[0])}</span><a class="read-link" href="${url(filtered[0])}">Leia a matéria →</a></div></article>`:'';
  $('#news-grid').innerHTML=filtered.slice((number-1)*perPage,number*perPage).map(card).join('')||'<p class="empty">Nenhuma notícia encontrada. Tente outra busca ou categoria.</p>';
  $('#pagination').innerHTML=filtered.length?`<button data-page="${number-1}" ${number===1?'disabled':''}>← Anterior</button>`+Array.from({length:total},(_,i)=>`<button data-page="${i+1}" ${i+1===number?'aria-current="page"':''} aria-label="Página ${i+1}">${i+1}</button>`).join('')+`<button data-page="${number+1}" ${number===total?'disabled':''}>Próxima →</button>`:'';
 }
 $('#filters').addEventListener('submit',e=>e.preventDefault());$('#filters').addEventListener('input',()=>{number=1;render();});
 $('#pagination').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;number=Number(b.dataset.page);render();$('.feed').scrollIntoView({behavior:'smooth'});});render();
}
function article(){const id=document.body.dataset.id||new URLSearchParams(location.search).get('id');const n=news.find(n=>n.id===id);if(!n){$('#article').innerHTML=`<section class="reader"><h1>Matéria não encontrada</h1><p>Ela pode ter sido excluída no painel.</p><a class="button" href="${base}index.html">Voltar ao início</a></section>`;return;}
 document.title=n.title+' | CE Agora';$('#article').innerHTML=`<article class="article"><a class="back" href="${base}index.html">← Todas as notícias</a><p class="eyebrow" style="margin-top:25px">${esc(n.category)} / ${esc(n.region)}</p><h1>${esc(n.title)}</h1><p class="lead">${esc(n.summary)}</p><div class="meta">Por Redação CE Agora · ${date(n)} · Matéria fictícia</div><img src="${img(n)}" alt="Ilustração temática da matéria"><div class="body">${n.body.split(/\n+/).filter(Boolean).map(p=>`<p>${esc(p)}</p>`).join('')}</div><p class="notice">Conteúdo fictício produzido exclusivamente para demonstração acadêmica.</p><a class="back" href="${base}regiao.html">Explore mais notícias da região →</a></article>`;
}
// SHA-256 evita guardar a senha do cadastro em texto puro. Isto NÃO torna a autenticação segura: não há backend.
async function digest(s){if(!window.crypto?.subtle)throw new Error('Abra em localhost (Live Server) ou HTTPS para usar cadastro e login.');return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s))),b=>b.toString(16).padStart(2,'0')).join('');}
function auth(){ $('#auth-form').addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target),email=f.get('email').trim().toLowerCase(),password=f.get('password');const message=$('#message');const button=e.target.querySelector('button');button.disabled=true;
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
 $('#admin-content').innerHTML=`<div class="actions"><button id="export" class="secondary">Exportar notícias (JSON)</button><button id="restore" class="secondary">Restaurar 8 matérias iniciais</button></div><div class="admin-layout"><form id="editor" class="admin-form"><h2 id="editor-title">Nova matéria</h2><input type="hidden" name="id"><label>Título<input name="title" maxlength="160" required></label><label>Resumo<input name="summary" maxlength="300" required></label><label>Categoria<select name="category">${options(categories)}</select></label><label>Cidade<select name="region">${options(['Fortaleza','Sobral','Juazeiro do Norte'])}</select></label><label>Ilustração<select name="image">${options(images)}</select></label><label>Texto completo<textarea name="body" required maxlength="30000"></textarea></label><div class="actions"><button type="submit">Salvar matéria</button><button type="button" id="cancel" class="secondary">Limpar / cancelar</button></div><p id="message" role="status"></p></form><section><h2>Matérias publicadas</h2><div id="admin-list"></div></section></div>`;
 const form=$('#editor');
 const clear=()=>{form.reset();form.elements.id.value='';$('#editor-title').textContent='Nova matéria';};
 const render=()=>{$('#admin-list').innerHTML=news.map(n=>`<article class="admin-row"><span class="category">${esc(n.category)} · ${esc(n.region)}</span><h3><a href="${url(n)}">${esc(n.title)}</a></h3><button data-edit="${esc(n.id)}" class="secondary">Editar</button><button data-delete="${esc(n.id)}" class="secondary">Excluir</button></article>`).join('')||'<p>Nenhuma matéria publicada.</p>';};
 $('#cancel').onclick=()=>{clear();$('#message').textContent='';};
 form.onsubmit=e=>{e.preventDefault();if(!isAdmin())return;const d=Object.fromEntries(new FormData(form));for(const field of ['title','summary','body']){d[field]=d[field].trim();if(!d[field]){$('#message').textContent='Preencha todos os campos com texto.';return;}}
 const old=news.find(n=>n.id===d.id);d.id=old?.id||'n'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);d.date=old?.date||new Date().toISOString().slice(0,10);const next=old?news.map(n=>n.id===d.id?d:n):[d,...news];if(save('ceagora.news.v1',next)){news=next;clear();render();$('#message').textContent='Matéria salva neste navegador.';}};
 $('#admin-list').onclick=e=>{const b=e.target.closest('button');if(!b||!isAdmin())return;
 if(b.dataset.edit){const n=news.find(n=>n.id===b.dataset.edit);for(const [key,value]of Object.entries(n)){if(form.elements.namedItem(key))form.elements.namedItem(key).value=value;}$('#editor-title').textContent='Editar matéria';$('#message').textContent='';form.scrollIntoView({behavior:'smooth'});form.elements.title.focus();}
 if(b.dataset.delete&&confirm('Excluir esta matéria deste navegador?')){const next=news.filter(n=>n.id!==b.dataset.delete);if(save('ceagora.news.v1',next)){news=next;if(form.elements.id.value===b.dataset.delete)clear();render();}}};
 $('#restore').onclick=()=>{if(confirm('Substituir todas as notícias locais pelas 8 matérias originais?')){if(save('ceagora.news.v1',window.NOTICIAS_INICIAIS)){news=structuredClone(window.NOTICIAS_INICIAIS);clear();render();}}};
 $('#export').onclick=()=>{const link=document.createElement('a');const objectURL=URL.createObjectURL(new Blob([JSON.stringify(news,null,2)],{type:'application/json'}));link.href=objectURL;link.download='noticias-ceagora.json';link.click();setTimeout(()=>URL.revokeObjectURL(objectURL),1000);};render();
}
if(page==='home'||page==='region')listing();if(page==='article')article();if(page==='login'||page==='cadastro')auth();if(page==='admin')admin();
})();
