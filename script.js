const SUPABASE_URL='https://hcelkzenncuqaqqsbqbs.supabase.co';
const SUPABASE_KEY='sb_publishable_p53AbjGl-Kb26rubzpCU8g_xqMUWMcz';
const {createClient}=supabase;
const dbSupabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
const dadosPadrao={globalDate:new Date().toISOString().slice(0,7),tema:"dark",metaEconomia:0,metaInvestimento:0,historicoSaldo:[],retirado:0,taxaCdi:0,pctCdi:100,ultimaAtualizacaoCd:new Date().toISOString().slice(0,10),historicoInvestimentos:[],projecaoMeses:{},rendas:[],topicos:[],conquistasManuais:[]};
let appData=JSON.parse(JSON.stringify(dadosPadrao)),usuarioAtual=null,modoCadastro=false,autenticadoEmAndamento=false,carregandoInicial=false,timerSalvarNuvem=null,timerRenderizacao=null;
let itemEditandoPrazo=null,chartPizza=null,chartBar=null,chartLinha=null,chartInvestimentosLinha=null,chartProjecaoAportes=null,lucrosPassivosSimulador=[0,0,0,0,0,0,0,0,0,0,0,0];

function lerNumero(val){if(typeof val==='number')return val;if(!val)return 0;let s=String(val).trim();if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.');else if(s.includes(','))s=s.replace(',','.');const n=parseFloat(s);return isNaN(n)?0:n;}
function criarRipple(e){if(!e||!e.currentTarget)return;const btn=e.currentTarget,circle=document.createElement('span'),diameter=Math.max(btn.clientWidth,btn.clientHeight),radius=diameter/2;circle.style.width=circle.style.height=`${diameter}px`;circle.style.left=`${e.clientX-btn.getBoundingClientRect().left-radius}px`;circle.style.top=`${e.clientY-btn.getBoundingClientRect().top-radius}px`;circle.classList.add('ripple');const rippleEl=btn.getElementsByClassName('ripple')[0];if(rippleEl)rippleEl.remove();btn.appendChild(circle);}

const pluginValoresPontos={id:'valoresPontos',afterDatasetsDraw(chart){const{ctx}=chart;chart.data.datasets.forEach((dataset,i)=>{const meta=chart.getDatasetMeta(i);if(!meta.hidden){meta.data.forEach((element,index)=>{const val=dataset.data[index];if(val!==undefined&&val!==null&&val>0){ctx.save();ctx.fillStyle=dataset.borderColor;ctx.font='bold 10px "Plus Jakarta Sans", sans-serif';ctx.textAlign='center';let yOffset=-10;if(i===1)yOffset=-18;if(i===2)yOffset=16;ctx.fillText('R$ '+Number(val).toLocaleString('pt-BR',{minimumFractionDigits:0,maximumFractionDigits:2}),element.x,element.y+yOffset);ctx.restore();}});}});}};
const pluginLucroVerdeSimulador={id:'lucroVerdeSimulador',afterDatasetsDraw(chart){const{ctx}=chart,meta=chart.getDatasetMeta(0);if(!meta||meta.hidden)return;meta.data.forEach((bar,index)=>{const lucroMes=lucrosPassivosSimulador[index]||0,aporteMes=chart.data.datasets[0].data[index]||0;if(lucroMes>0||aporteMes>0){ctx.save();ctx.fillStyle='#10b981';ctx.font='extrabold 10px "JetBrains Mono", monospace';ctx.textAlign='center';ctx.fillText('+R$ '+lucroMes.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}),bar.x,bar.y-8);ctx.restore();}});}};

document.addEventListener('DOMContentLoaded',async()=>{initCharts();const{data:{session}}=await dbSupabase.auth.getSession();if(session&&session.user){usuarioAtual=session.user;await entrarNoApp();}else{document.getElementById('telaAuth').classList.remove('hidden');document.getElementById('appPrincipal').classList.add('hidden');}});
window.addEventListener('beforeunload',()=>{if(usuarioAtual&&!carregandoInicial)localStorage.setItem('cashflow_'+usuarioAtual.id,JSON.stringify(appData));});

function alternarModoAuth(){modoCadastro=!modoCadastro;const sub=document.getElementById('authSubtitulo'),btn=document.getElementById('btnAuthAcao'),alt=document.getElementById('btnAuthAlternar');if(modoCadastro){sub.textContent="Crie a sua conta informando um nome e palavra-passe";btn.textContent="Cadastrar Conta";alt.innerHTML="Já tem uma conta? <b>Fazer Login</b>";}else{sub.textContent="Digite o seu nome de login e palavra-passe";btn.textContent="Entrar na Conta";alt.innerHTML="Não tem conta? <b>Criar Conta com Nome</b>";}}

async function executarAutenticacao(){if(autenticadoEmAndamento)return;const nomeUsuario=document.getElementById('authUsuario').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,''),password=document.getElementById('authPassword').value.trim();if(!nomeUsuario||!password){toast('Preencha os campos');return;}autenticadoEmAndamento=true;const btn=document.getElementById('btnAuthAcao'),textoOriginal=btn.textContent;btn.textContent=modoCadastro?"Cadastrando...":"Entrando...";btn.disabled=true;const emailFicticio=`${nomeUsuario}@cashflow.local`;try{if(modoCadastro){const{data,error}=await dbSupabase.auth.signUp({email:emailFicticio,password});if(error)toast('Erro: '+error.message);else{toast('Conta criada!');if(data.user){usuarioAtual=data.user;await entrarNoApp();}}}else{const{data,error}=await dbSupabase.auth.signInWithPassword({email:emailFicticio,password});if(error)toast('Erro no login');else{usuarioAtual=data.user;await entrarNoApp();}}}finally{autenticadoEmAndamento=false;btn.textContent=textoOriginal;btn.disabled=false;}}

async function fazerLogout(){if(timerSalvarNuvem){clearTimeout(timerSalvarNuvem);timerSalvarNuvem=null;}if(usuarioAtual&&!carregandoInicial)await salvarNaNuvemAgora(usuarioAtual.id,JSON.parse(JSON.stringify(appData)));usuarioAtual=null;appData=JSON.parse(JSON.stringify(dadosPadrao));document.getElementById('authPassword').value='';document.getElementById('btnAdminPainel').classList.add('hidden');document.getElementById('appPrincipal').classList.add('hidden');document.getElementById('telaAuth').classList.remove('hidden');toast('Sessão terminada!');dbSupabase.auth.signOut().catch(()=>{});}

function preencherCamposInterface(){document.getElementById('globalDate').value=appData.globalDate||new Date().toISOString().slice(0,7);document.getElementById('metaEconomia').value=appData.metaEconomia>0?appData.metaEconomia:'';document.getElementById('metaInvestimento').value=appData.metaInvestimento>0?appData.metaInvestimento:'';document.getElementById('inputValorRetirado').value=appData.retirado>0?appData.retirado:'';document.getElementById('inputTaxaCdi').value=appData.taxaCdi>0?appData.taxaCdi:'';document.getElementById('inputPctCdi').value=appData.pctCdi>0?appData.pctCdi:'';document.getElementById('seletorTema').value=appData.tema||'dark';aplicarTemaBancario(appData.tema||'dark');}

async function entrarNoApp(){carregandoInicial=true;document.getElementById('telaAuth').classList.add('hidden');document.getElementById('appPrincipal').classList.remove('hidden');document.getElementById('buscaGlobal').value='';document.getElementById('filtroPago').value='todos';const cacheLocal=localStorage.getItem('cashflow_'+usuarioAtual.id);if(cacheLocal){try{appData=JSON.parse(cacheLocal);preencherCamposInterface();renderizarTudo(true);}catch(e){}}await Promise.all([verificarAdmin(),carregarDoSupabase()]);carregandoInicial=false;preencherCamposInterface();renderizarTudo(true);}

async function verificarAdmin(){if(!usuarioAtual)return;try{const{data}=await dbSupabase.from('perfis').select('is_admin').eq('id',usuarioAtual.id).maybeSingle();document.getElementById('btnAdminPainel').classList.toggle('hidden',!(data&&data.is_admin===true));}catch(e){document.getElementById('btnAdminPainel').classList.add('hidden');}}
function abrirModalAdmin(){document.getElementById('modalAdmin').classList.remove('hidden');}
function fecharModalAdmin(){document.getElementById('modalAdmin').classList.add('hidden');}

async function carregarDoSupabase(){if(!usuarioAtual)return;const uid=usuarioAtual.id;try{const{data}=await dbSupabase.from('transacoes').select('payload').eq('user_id',uid).limit(1).maybeSingle();const cacheLocal=localStorage.getItem('cashflow_'+uid),cacheObj=cacheLocal?JSON.parse(cacheLocal):null;if(data&&data.payload){appData=Object.assign(JSON.parse(JSON.stringify(dadosPadrao)),data.payload);localStorage.setItem('cashflow_'+uid,JSON.stringify(appData));}else if(cacheObj){appData=Object.assign(JSON.parse(JSON.stringify(dadosPadrao)),cacheObj);await salvarNaNuvemAgora(uid,appData);}}catch(err){}}

async function salvarNaNuvemAgora(uid,dados){if(!uid)return;try{await dbSupabase.from('transacoes').upsert({user_id:uid,payload:dados,Titulo:'Painel Principal'},{onConflict:'user_id'});}catch(err){}}
function salvar(){if(!usuarioAtual||carregandoInicial)return;const uid=usuarioAtual.id,copia=JSON.parse(JSON.stringify(appData));localStorage.setItem('cashflow_'+uid,JSON.stringify(copia));if(timerSalvarNuvem)clearTimeout(timerSalvarNuvem);timerSalvarNuvem=setTimeout(()=>salvarNaNuvemAgora(uid,copia),400);}
function resetarPadrao(){if(confirm('Restaurar padrão?')){appData=JSON.parse(JSON.stringify(dadosPadrao));document.getElementById('buscaGlobal').value='';document.getElementById('filtroPago').value='todos';preencherCamposInterface();salvar();renderizarTudo(true);toast('Limpo!');}}

function mudarAba(abaId){document.querySelectorAll('.tab-pane').forEach(el=>el.classList.add('hidden'));document.querySelectorAll('.tab-btn').forEach(btn=>{btn.classList.remove('bg-emerald-500','text-black','shadow-lg','shadow-emerald-500/25');btn.classList.add('bg-white/5','text-slate-300','border','border-white/5');});document.getElementById('aba-'+abaId).classList.remove('hidden');const activeBtn=document.getElementById('btnTab-'+abaId);if(activeBtn){activeBtn.classList.remove('bg-white/5','text-slate-300','border','border-white/5');activeBtn.classList.add('bg-emerald-500','text-black','shadow-lg','shadow-emerald-500/25');}if(abaId==='investimentos'){setTimeout(()=>{calcularTotaisInvestimento();renderizarMetaInvestimento();atualizarGraficoInvestimentosLinha();renderizarAportesMensais();renderizarProjecaoMeses();calcularProjecaoMeses();},50);}else if(abaId==='analise'){gerarAnaliseInteligente();}else{renderizarTudo(true);}}

function mudarTemaBancario(tema){appData.tema=tema;salvar();aplicarTemaBancario(tema);}
function aplicarTemaBancario(tema){document.body.classList.remove('light','theme-nubank','theme-apple','theme-pink');if(tema==='light')document.body.classList.add('light');else if(tema==='nubank')document.body.classList.add('theme-nubank');else if(tema==='apple')document.body.classList.add('theme-apple');else if(tema==='pink')document.body.classList.add('theme-pink');}

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.remove('opacity-0');t.classList.add('opacity-100');setTimeout(()=>t.classList.add('opacity-0'),2000);}
function moeda(v){return(Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function verificarSeFinalizado(tipo,dataFim){if(tipo!=='data'||!dataFim)return false;return appData.globalDate>dataFim;}
function formatarPrazoLabel(tipo,dataFim){if(tipo==='fixo'||!dataFim)return `<span class="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 cursor-pointer">∞ Fixo</span>`;const fin=verificarSeFinalizado(tipo,dataFim);if(fin)return `<span class="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">✓ ${dataFim.split('-').reverse().join('/')}</span>`;let[a1,m1]=appData.globalDate.split('-').map(Number),[a2,m2]=dataFim.split('-').map(Number),diff=(a2-a1)*12+(m2-m1);return `<span class="text-[10px] px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 cursor-pointer">${diff}m</span>`;}
function mudarMesGlobal(d){let[a,m]=appData.globalDate.split('-').map(Number);m+=d;if(m>12){m=1;a++;}if(m<1){m=12;a--;}appData.globalDate=`${a}-${String(m).padStart(2,'0')}`;document.getElementById('globalDate').value=appData.globalDate;salvar();renderizarTudo();}
function atualizarDataGlobal(){appData.globalDate=document.getElementById('globalDate').value;salvar();renderizarTudo();}
function salvarMeta(){appData.metaEconomia=lerNumero(document.getElementById('metaEconomia').value);salvar();renderizarResumo();gerarAnaliseInteligente();}
function salvarMetaInvestimento(){appData.metaInvestimento=lerNumero(document.getElementById('metaInvestimento').value);salvar();renderizarMetaInvestimento();gerarAnaliseInteligente();}

function calcularTotaisInvestimento(){
let somaInvestido=0;const h=appData.historicoInvestimentos||[];h.forEach(item=>{somaInvestido+=Number(item.investido)||0;});
const taxaAnual=(appData.taxaCdi||0)/100,pctCdi=(appData.pctCdi||100)/100,taxaEfetivaAnual=taxaAnual*pctCdi,taxaMensal=taxaEfetivaAnual>0?Math.pow(1+taxaEfetivaAnual,1/12)-1:0;
let acumulado=0,lucroCalculado=0,ordenados=['01','02','03','04','05','06','07','08','09','10','11','12'],ano=(appData.globalDate||new Date().toISOString()).slice(0,4);
ordenados.forEach(m=>{const reg=h.find(x=>x.mes===`${ano}-${m}`),aporte=reg?(Number(reg.investido)||0):0;acumulado+=aporte;if(acumulado>0&&taxaMensal>0){lucroCalculado+=acumulado*taxaMensal;}});
document.getElementById('inputValorInvestido').value=somaInvestido>0?somaInvestido.toFixed(2):'0,00';
document.getElementById('inputValorLucrado').value=lucroCalculado>0?lucroCalculado.toFixed(2):'0,00';
const ret=appData.retirado||0,patrimonioLiquido=Math.max(0,(somaInvestido+lucroCalculado)-ret);
document.getElementById('lblPatrimonioTotal').textContent=moeda(patrimonioLiquido);
return{somaInvestido,lucroCalculado,patrimonioLiquido};
}

function renderizarMetaInvestimento(){
const{somaInvestido,lucroCalculado}=calcularTotaisInvestimento(),ret=appData.retirado||0,patrimonio=Math.max(0,(somaInvestido+lucroCalculado)-ret),meta=appData.metaInvestimento||0,barra=document.getElementById('barraMetaInvestida'),lblStatus=document.getElementById('lblMetaInvestidaStatus'),lblPct=document.getElementById('lblPctMetaInvestida');
if(!barra||!lblStatus||!lblPct)return;
if(meta>0){const pct=Math.min(100,Math.round((patrimonio/meta)*100));barra.style.width=pct+'%';lblPct.textContent=pct+'%';if(patrimonio>=meta){lblStatus.innerHTML=`<span class="text-emerald-400 font-bold">✅ Meta batida! Superou em ${moeda(patrimonio-meta)}.</span>`;}else{lblStatus.innerHTML=`Faltam <b class="text-amber-300 valor-mono">${moeda(meta-patrimonio)}</b>.`;}}else{barra.style.width='0%';lblPct.textContent='0%';lblStatus.textContent='Defina uma meta.';}
}

function agendarRenderizacao(){if(timerRenderizacao)clearTimeout(timerRenderizacao);timerRenderizacao=setTimeout(()=>renderizarTudo(),250);}
function renderizarTudo(apenasVisual=false){renderizarResumo();renderizarMetaInvestimento();renderizarRenda();renderizarTopicos();renderizarVencimentos();salvarHistorico(apenasVisual);atualizarGrafico();atualizarGastoDiarioRecomendado();atualizarGraficoInvestimentosLinha();renderizarAportesMensais();renderizarProjecaoMeses();calcularProjecaoMeses();gerarAnaliseInteligente();}

function renderizarResumo(){
let totalR=0,totalD=0,encerr=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(verificarSeFinalizado(i.tipoPrazo,i.dataFim))encerr++;else totalD+=Number(i.valor)||0;}));
const saldo=totalR-totalD,pct=totalR>0?Math.round((totalD/totalR)*100):0;
document.getElementById('resumoCards').innerHTML=`
<div class="card-dark bg-gradient-to-br from-[#12233a] to-[#0e1a2e] border ${pct>=80?'pisca border-rose-500/50':'border-white/[0.08]'} rounded-[20px] p-5 card-anim shadow-xl"><p class="text-[10px] uppercase tracking-widest text-slate-400">Renda vs Despesas</p><h3 class="text-xl font-black valor-mono mt-1">${moeda(totalR)} <span class="text-sm text-rose-300">/ ${moeda(totalD)}</span></h3><div class="mt-3 h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10"><div class="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 rounded-full transition-all duration-500" style="width:${Math.min(pct,100)}%"></div></div><p class="text-[11px] mt-2 ${pct>=80?'text-rose-300 font-bold':'text-slate-400'}">${pct}% comprometido</p></div>
<div class="card-dark bg-gradient-to-br from-[#1a2040] to-[#13172e] border border-white/[0.08] rounded-[20px] p-5 card-anim shadow-xl"><p class="text-[10px] uppercase tracking-widest text-indigo-300/70">Saldo do Mês</p><h3 class="text-2xl font-black valor-mono mt-1 ${saldo>=0?'text-emerald-300':'text-rose-300'}">${moeda(saldo)}</h3><p class="text-[11px] mt-2 font-bold" id="lblMetaStatus2"></p></div>`;
const meta=appData.metaEconomia||0,lbl=document.getElementById('lblMetaStatus'),lbl2=document.getElementById('lblMetaStatus2');
if(meta>0){if(saldo>=meta){lbl.textContent=`✅ Meta batida!`;lbl.className="text-[11px] mt-2 text-emerald-400 font-bold";if(lbl2)lbl2.textContent=`Sobrou ${moeda(saldo-meta)}`;}else{lbl.textContent=`⚠️ Faltam ${moeda(meta-saldo)}`;lbl.className="text-[11px] mt-2 text-amber-400 font-bold";if(lbl2)lbl2.textContent=`Faltam ${moeda(meta-saldo)}`;}}else{lbl.textContent="Defina sua meta";if(lbl2)lbl2.textContent="";}
document.getElementById('lblContasEncerradas').textContent=encerr+' encerradas';
}

function atualizarGastoDiarioRecomendado(){
const[ano,mes]=(appData.globalDate||new Date().toISOString().slice(0,7)).split('-').map(Number),hoje=new Date(),anoAtual=hoje.getFullYear(),mesAtual=hoje.getMonth()+1,diaAtual=hoje.getDate(),ultimoDiaMes=new Date(ano,mes,0).getDate();
let diasRestantes=ultimoDiaMes;if(ano===anoAtual&&mes===mesAtual)diasRestantes=Math.max(1,ultimoDiaMes-diaAtual+1);
let totalR=0,totalD=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))totalD+=Number(i.valor)||0;}));
const saldoLiquido=totalR-totalD,gastoDiario=saldoLiquido>0?saldoLiquido/diasRestantes:0;
const elSaldo=document.getElementById('lblSaldoLiquidoGeral'),elDias=document.getElementById('lblDiasRestantes'),elDiario=document.getElementById('lblGastoDiarioRecomendado');
if(elSaldo){elSaldo.textContent=moeda(saldoLiquido);elSaldo.className=`font-black valor-mono text-sm ${saldoLiquido>=0?'text-emerald-400':'text-rose-400'}`;}
if(elDias)elDias.textContent=`${diasRestantes} dias`;
if(elDiario){elDiario.textContent=`${moeda(gastoDiario)} / dia`;elDiario.className=`text-xl sm:text-2xl font-black valor-mono mt-0.5 ${gastoDiario>0?'text-emerald-400':'text-rose-400'}`;}
}

function renderizarVencimentos(){
const div=document.getElementById('listaVencimentos');div.innerHTML='';let proximos=[];
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(i.tipoPrazo==='data'&&i.dataFim&&!verificarSeFinalizado(i.tipoPrazo,i.dataFim)){let[a1,m1]=appData.globalDate.split('-').map(Number),[a2,m2]=i.dataFim.split('-').map(Number),diff=(a2-a1)*12+(m2-m1);if(diff<=2)proximos.push({nome:i.nome,topico:t.titulo,fim:i.dataFim,diff});}}));
if(!proximos.length){div.innerHTML='<p class="text-slate-500 text-center py-2 text-[11px]">Nenhum vencimento</p>';return;}
proximos.sort((a,b)=>a.diff-b.diff).slice(0,5).forEach(p=>{div.innerHTML+=`<div class="flex justify-between items-center bg-[#0a0f1e] border border-white/5 rounded-full px-3 py-2"><span>${p.nome} <span class="text-slate-500">(${p.topico})</span></span><span class="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] border border-amber-500/30">${p.fim.split('-').reverse().join('/')}</span></div>`;});
}

function renderizarRenda(){
const busca=(document.getElementById('buscaGlobal')?.value||'').trim().toLowerCase(),c=document.getElementById('listaRenda');c.innerHTML='';
const lista=(appData.rendas||[]).filter(r=>!busca||(r.nome||'').toLowerCase().includes(busca));
if(lista.length===0){c.innerHTML=`<p class="text-xs text-slate-400 text-center py-4 bg-black/20 rounded-xl border border-white/5">Nenhuma renda.</p>`;return;}
lista.forEach(r=>{
const fin=verificarSeFinalizado(r.tipoPrazo,r.dataFim),div=document.createElement('div');div.className=`card-dark group bg-[#0a0f1e] border ${fin?'border-amber-500/25 opacity-60':'border-white/[0.08]'} rounded-[14px] p-3 card-anim`;
div.innerHTML=`<div class="flex justify-between items-center"><div class="flex items-center gap-2 flex-1"><input type="checkbox" ${r.recebido?'checked':''} onchange="toggleRecebidoRenda(${r.id})" class="w-4 h-4 rounded cursor-pointer accent-emerald-500"><input value="${(r.nome||'').replace(/"/g,'&quot;')}" oninput="editarNomeRenda(${r.id},this.value)" class="input-dark bg-transparent text-[13px] font-semibold w-full outline-none border border-transparent hover:border-white/10 rounded-full px-2 py-1"></div><button type="button" onclick="removerRenda(${r.id});criarRipple(event)" class="w-6 h-6 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center"><i class="fa-solid fa-trash text-[10px]"></i></button></div><div class="flex gap-2 mt-2"><div class="relative flex-1"><span class="absolute left-2.5 top-2 text-[10px] text-emerald-400 font-bold">R$</span><input type="text" inputmode="decimal" value="${r.valor||''}" oninput="editarValorRenda(${r.id},this.value)" class="input-dark valor-mono w-full bg-white/[0.03] border border-white/10 rounded-full pl-7 pr-2 py-2 text-xs font-bold text-emerald-300"></div><button type="button" onclick="abrirModalPrazo('renda',null,${r.id});criarRipple(event)">${formatarPrazoLabel(r.tipoPrazo,r.dataFim)}</button></div>`;
c.appendChild(div);
});
}

function adicionarRenda(){if(!Array.isArray(appData.rendas))appData.rendas=[];appData.rendas.push({id:Date.now(),nome:"Nova Renda",valor:0,tipoPrazo:"fixo",dataFim:"",recebido:false});salvar();renderizarTudo();}
function removerRenda(id){if(confirm('Excluir?')){appData.rendas=appData.rendas.filter(r=>r.id!==id);salvar();renderizarTudo();}}
function editarNomeRenda(id,v){const r=appData.rendas.find(x=>x.id===id);if(r){r.nome=v;salvar();}}
function editarValorRenda(id,v){const r=appData.rendas.find(x=>x.id===id);if(r){r.valor=Math.max(0,lerNumero(v));salvarHistorico(false);renderizarResumo();atualizarGrafico();atualizarGastoDiarioRecomendado();gerarAnaliseInteligente();}}
function toggleRecebidoRenda(id){const r=appData.rendas.find(x=>x.id===id);if(r){r.recebido=!r.recebido;salvar();}}

function renderizarTopicos(){
const busca=(document.getElementById('buscaGlobal')?.value||'').trim().toLowerCase(),filtro=document.getElementById('filtroPago')?.value||'todos',c=document.getElementById('containerTopicos');c.innerHTML='';
if(!appData.topicos||appData.topicos.length===0){c.innerHTML=`<div class="col-span-full text-center py-8 text-slate-400 text-xs bg-black/20 rounded-2xl border border-white/5">Nenhum tópico.</div>`;return;}
appData.topicos.forEach(top=>{
if(!Array.isArray(top.itens))top.itens=[];let soma=0;top.itens.forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))soma+=Number(i.valor)||0;});
const itensFiltrados=top.itens.filter(i=>{const matchBusca=!busca||(i.nome||'').toLowerCase().includes(busca)||(top.titulo||'').toLowerCase().includes(busca),matchPago=filtro==='todos'||(filtro==='pago'&&i.pago)||(filtro==='naopago'&&!i.pago);return matchBusca&&matchPago;});
if(busca&&itensFiltrados.length===0&&!(top.titulo||'').toLowerCase().includes(busca))return;
let tr=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))tr+=Number(r.valor)||0;});
const pctRenda=tr>0?Math.round((soma/tr)*100):0,corPulse=pctRenda>40?'bg-rose-500':pctRenda>20?'bg-amber-500':'bg-emerald-500';
const div=document.createElement('div');div.className="card-dark rounded-[22px] p-5 flex flex-col card-anim shadow-xl relative overflow-hidden";
div.innerHTML=`<div class="absolute top-4 right-4 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ${corPulse} status-pulse"></span><span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold">${pctRenda}% renda</span></div><div class="flex justify-between items-start mb-3 pr-16"><div class="flex-1"><input value="${(top.titulo||'').replace(/"/g,'&quot;')}" oninput="atualizarTituloTopico('${top.id}',this.value)" class="font-bold text-[14px] bg-transparent border border-transparent hover:border-white/10 rounded-full px-2 py-1 outline-none w-full" placeholder="Título"><input value="${(top.descricao||'').replace(/"/g,'&quot;')}" oninput="atualizarDescTopico('${top.id}',this.value)" class="text-[11px] text-slate-400 bg-transparent border border-transparent hover:border-white/10 rounded-full px-2 py-1 outline-none w-full mt-1" placeholder="Descrição..."></div></div><div class="flex justify-between items-center bg-black/25 rounded-full px-4 py-2 mb-3 border border-white/5"><span class="text-[11px] text-slate-400">Total</span><span class="text-sm font-black valor-mono">${moeda(soma)}</span></div><div class="flex gap-1 mb-2 justify-end"><button type="button" onclick="toggleColapso('${top.id}');criarRipple(event)" class="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10">Colapsar</button><button type="button" onclick="removerTopico('${top.id}');criarRipple(event)" class="text-[10px] px-2 py-1 rounded bg-rose-500/20 text-rose-300">Excluir</button></div><div class="${top.colapsado?'hidden':''} space-y-2 mb-3">${itensFiltrados.map(item=>{const fin=verificarSeFinalizado(item.tipoPrazo,item.dataFim);return `<div class="card-dark bg-[#0a0f1e] border ${fin?'border-amber-500/25 opacity-60':item.pago?'border-emerald-500/25':'border-white/[0.05]'} rounded-[14px] p-3"><div class="flex justify-between items-center gap-2"><div class="flex items-center gap-2 flex-1"><input type="checkbox" ${item.pago?'checked':''} onchange="togglePagoItem('${top.id}','${item.id}')" class="w-4 h-4 rounded cursor-pointer accent-emerald-500"><input value="${(item.nome||'').replace(/"/g,'&quot;')}" oninput="editarNomeItem('${top.id}','${item.id}',this.value)" class="bg-transparent text-[12px] font-medium w-full outline-none border border-transparent hover:border-white/10 rounded-full px-2 py-1 ${item.pago?'line-through text-slate-500':''}"></div><button type="button" onclick="removerItem('${top.id}','${item.id}');criarRipple(event)" class="text-slate-500 hover:text-rose-400 w-6 h-6 rounded-full flex items-center justify-center"><i class="fa-solid fa-xmark text-[11px]"></i></button></div><div class="flex gap-2 mt-2"><div class="relative flex-1"><span class="absolute left-2.5 top-2 text-[10px] text-slate-500 font-bold">R$</span><input type="text" inputmode="decimal" value="${item.valor||''}" oninput="editarValorItem('${top.id}','${item.id}',this.value)" class="input-dark valor-mono w-full bg-white/[0.03] border border-white/10 rounded-full pl-7 pr-2 py-2 text-xs font-bold"></div><button type="button" onclick="abrirModalPrazo('despesa','${top.id}','${item.id}');criarRipple(event)">${formatarPrazoLabel(item.tipoPrazo,item.dataFim)}</button></div></div>`;}).join('')||'<p class="text-xs text-slate-500 text-center py-2">Nenhum gasto</p>'}</div><button type="button" onclick="adicionarItem('${top.id}');criarRipple(event)" class="${top.colapsado?'hidden':''} mt-2 w-full py-2.5 btn-press rounded-full bg-white/5 border border-white/10 text-xs hover:bg-emerald-500 hover:text-black font-bold">+ Adicionar Gasto</button>`;
c.appendChild(div);
});
}

function toggleColapso(id){const t=appData.topicos.find(x=>String(x.id)===String(id));if(t){t.colapsado=!t.colapsado;salvar();renderizarTopicos();}}
function abrirModalTopico(){document.getElementById('modalTopico').classList.remove('hidden');setTimeout(()=>document.getElementById('inputNovoTopico').focus(),100);}
function fecharModalTopico(){document.getElementById('modalTopico').classList.add('hidden');}
function confirmarNovoTopico(){const nome=document.getElementById('inputNovoTopico').value.trim();if(!nome)return;if(!Array.isArray(appData.topicos))appData.topicos=[];appData.topicos.push({id:'top_'+Date.now(),titulo:nome,descricao:"",cor:"emerald",colapsado:false,itens:[]});document.getElementById('inputNovoTopico').value='';fecharModalTopico();salvar();renderizarTudo();}
function removerTopico(id){if(confirm("Excluir?")){appData.topicos=appData.topicos.filter(t=>String(t.id)!==String(id));salvar();renderizarTudo();}}
function atualizarTituloTopico(id,v){const t=appData.topicos.find(x=>String(x.id)===String(id));if(t){t.titulo=v;salvar();}}
function atualizarDescTopico(id,v){const t=appData.topicos.find(x=>String(x.id)===String(id));if(t){t.descricao=v;salvar();}}
function adicionarItem(tid){const t=appData.topicos.find(x=>String(x.id)===String(tid));if(t){if(!Array.isArray(t.itens))t.itens=[];t.itens.push({id:'item_'+Date.now(),nome:"Novo Gasto",valor:0,tipoPrazo:"fixo",dataFim:"",pago:false});salvar();renderizarTudo();}}
function removerItem(tid,iid){const t=appData.topicos.find(x=>String(x.id)===String(tid));if(t){t.itens=t.itens.filter(i=>String(i.id)!==String(iid));salvar();renderizarTudo();}}
function editarNomeItem(tid,iid,v){const t=appData.topicos.find(x=>String(x.id)===String(tid)),i=t?.itens.find(x=>String(x.id)===String(iid));if(i){i.nome=v;salvar();}}
function editarValorItem(tid,iid,v){const t=appData.topicos.find(x=>String(x.id)===String(tid)),i=t?.itens.find(x=>String(x.id)===String(iid));if(i){i.valor=Math.max(0,lerNumero(v));salvarHistorico(false);renderizarResumo();atualizarGrafico();atualizarGastoDiarioRecomendado();gerarAnaliseInteligente();}}
function togglePagoItem(tid,iid){const t=appData.topicos.find(x=>String(x.id)===String(tid)),i=t?.itens.find(x=>String(x.id)===String(iid));if(i){i.pago=!i.pago;salvar();renderizarTopicos();}}

function abrirModalQuickExpense(){const select=document.getElementById('qeTopico');select.innerHTML='';if(!appData.topicos||appData.topicos.length===0){toast('Crie um tópico');return;}appData.topicos.forEach(t=>select.innerHTML+=`<option value="${t.id}">${t.titulo}</option>`);document.getElementById('qeNome').value='';document.getElementById('qeValor').value='';document.getElementById('modalQuickExpense').classList.remove('hidden');}
function fecharModalQuickExpense(){document.getElementById('modalQuickExpense').classList.add('hidden');}
function salvarQuickExpense(){const nome=document.getElementById('qeNome').value.trim()||'Gasto',valor=Math.max(0,lerNumero(document.getElementById('qeValor').value)),tid=document.getElementById('qeTopico').value;if(valor<=0){toast('Valor inválido');return;}const t=appData.topicos.find(x=>String(x.id)===String(tid));if(t){if(!Array.isArray(t.itens))t.itens=[];t.itens.push({id:'qe_'+Date.now(),nome,valor,tipoPrazo:'fixo',dataFim:'',pago:false});salvar();fecharModalQuickExpense();renderizarTudo();toast('Adicionado!');}}

function abrirModalPrazo(tipo,topicoId,itemId){itemEditandoPrazo={tipo,topicoId,itemId};let obj=null;if(tipo==='renda')obj=appData.rendas.find(r=>String(r.id)===String(itemId));else{const t=appData.topicos.find(x=>String(x.id)===String(topicoId));obj=t?.itens.find(x=>String(x.id)===String(itemId));}if(obj){document.getElementById('modalTipoPrazo').value=obj.tipoPrazo;document.getElementById('modalDataFim').value=obj.dataFim||appData.globalDate;alternarTipoPrazoModal();document.getElementById('modalPrazo').classList.remove('hidden');}}
function fecharModalPrazo(){document.getElementById('modalPrazo').classList.add('hidden');}
function alternarTipoPrazoModal(){document.getElementById('divDataFimModal').classList.toggle('hidden',document.getElementById('modalTipoPrazo').value!=='data');}
function salvarPrazoModal(){if(!itemEditandoPrazo)return;const tipo=document.getElementById('modalTipoPrazo').value,data=document.getElementById('modalDataFim').value;if(itemEditandoPrazo.tipo==='renda'){const r=appData.rendas.find(x=>String(x.id)===String(itemEditandoPrazo.itemId));if(r){r.tipoPrazo=tipo;r.dataFim=tipo==='data'?data:'';}}else{const t=appData.topicos.find(x=>String(x.id)===String(itemEditandoPrazo.topicoId)),i=t?.itens.find(x=>String(x.id)===String(itemEditandoPrazo.itemId));if(i){i.tipoPrazo=tipo;i.dataFim=tipo==='data'?data:'';}}salvar();fecharModalPrazo();renderizarTudo();}

function abrirModalConquista(){document.getElementById('inputTextoConquista').value='';document.getElementById('modalConquista').classList.remove('hidden');}
function fecharModalConquista(){document.getElementById('modalConquista').classList.add('hidden');}
function salvarConquistaModal(){const txt=document.getElementById('inputTextoConquista').value.trim();if(!txt){toast('Escreva');return;}if(!Array.isArray(appData.conquistasManuais))appData.conquistasManuais=[];appData.conquistasManuais.push(txt);salvar();fecharModalConquista();gerarAnaliseInteligente();toast('Salvo!');}

function obterConquistasAutomaticasReativas(patrimonioLiquido,rendaPassivaMensal){
const lista=[];
[{lim:10000,msg:"🚀 R$ 10.000 investidos!"},{lim:50000,msg:"🏆 R$ 50.000 investidos!"},{lim:100000,msg:"👑 R$ 100.000 em patrimônio!"}].forEach(m=>{if(patrimonioLiquido>=m.lim)lista.push(m.msg);});
[{lim:100,msg:"💡 Renda passiva de R$ 100/mês!"},{lim:500,msg:"🌟 Renda passiva de R$ 500/mês!"},{lim:1000,msg:"🔥 Renda passiva de R$ 1.000/mês!"}].forEach(f=>{if(rendaPassivaMensal>=f.lim)lista.push(f.msg);});
return lista;
}

function renderizarConquistasAnalise(patrimonioLiquido,rendaPassivaMensal){
const container=document.getElementById('listaConquistasAnalise');if(!container)return;
const manual=appData.conquistasManuais||[],automaticas=obterConquistasAutomaticasReativas(patrimonioLiquido,rendaPassivaMensal),todas=[...manual,...automaticas];
if(todas.length===0){container.innerHTML=`<p class="text-xs text-slate-500 text-center py-4">Nenhuma conquista ainda.</p>`;return;}
container.innerHTML=todas.map(c=>`<div class="bg-black/20 p-2.5 rounded-xl border border-white/5 flex items-start gap-2"><i class="fa-solid fa-trophy text-amber-400 mt-0.5 shrink-0"></i><span class="text-xs text-slate-200">${c}</span></div>`).join('');
}

const mesesNomes={'01':'Janeiro','02':'Fevereiro','03':'Março','04':'Abril','05':'Maio','06':'Junho','07':'Julho','08':'Agosto','09':'Setembro','10':'Outubro','11':'Novembro','12':'Dezembro'};
function renderizarAportesMensais(){
const container=document.getElementById('containerAportesMensais');if(!container)return;if(!Array.isArray(appData.historicoInvestimentos))appData.historicoInvestimentos=[];
container.innerHTML='';const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);
['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m=>{const chaveMes=`${anoAtual}-${m}`,reg=appData.historicoInvestimentos.find(h=>h.mes===chaveMes),valInvestido=reg?(reg.investido||0):0;container.innerHTML+=`<div class="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-between"><span class="text-[10px] uppercase font-bold text-indigo-300 mb-1"><i class="fa-solid fa-calendar mr-1"></i> ${mesesNomes[m]}/${anoAtual}</span><div class="relative mt-1"><span class="absolute left-2.5 top-2 text-[10px] text-emerald-400 font-bold">R$</span><input type="text" inputmode="decimal" value="${valInvestido}" oninput="editarAporteMensal('${chaveMes}',this.value)" class="input-dark campo-interativo valor-mono w-full bg-[#0a0f1e] border border-white/10 rounded-full pl-7 pr-3 py-1.5 text-xs font-bold text-emerald-300"></div></div>`;});
}
function editarAporteMensal(chaveMes,valor){if(!Array.isArray(appData.historicoInvestimentos))appData.historicoInvestimentos=[];let reg=appData.historicoInvestimentos.find(h=>h.mes===chaveMes),numVal=lerNumero(valor);if(reg)reg.investido=numVal;else appData.historicoInvestimentos.push({mes:chaveMes,investido:numVal});salvar();calcularTotaisInvestimento();renderizarMetaInvestimento();atualizarGraficoInvestimentosLinha();gerarAnaliseInteligente();}

function renderizarProjecaoMeses(){
const container=document.getElementById('containerProjecaoMeses');if(!container)return;if(!appData.projecaoMeses)appData.projecaoMeses={};
container.innerHTML='';const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);
['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m=>{const chaveMes=`${anoAtual}-${m}`,valProj=appData.projecaoMeses[chaveMes]!==undefined?appData.projecaoMeses[chaveMes]:0;container.innerHTML+=`<div class="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-between"><span class="text-[10px] uppercase font-bold text-emerald-300 mb-1"><i class="fa-solid fa-coins mr-1"></i> ${mesesNomes[m]}/${anoAtual}</span><div class="relative mt-1"><span class="absolute left-2.5 top-2 text-[10px] text-emerald-400 font-bold">R$</span><input type="text" inputmode="decimal" value="${valProj}" oninput="editarProjecaoMes('${chaveMes}',this.value)" class="input-dark campo-interativo valor-mono w-full bg-[#0a0f1e] border border-white/10 rounded-full pl-7 pr-3 py-1.5 text-xs font-bold text-emerald-300"></div></div>`;});
}
function editarProjecaoMes(chaveMes,valor){if(!appData.projecaoMeses)appData.projecaoMeses={};appData.projecaoMeses[chaveMes]=lerNumero(valor);salvar();calcularProjecaoMeses();}
function preencherProjecaoComSaldo(){let totalR=0,totalD=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))totalD+=Number(i.valor)||0;}));const saldo=Math.max(0,totalR-totalD);if(!appData.projecaoMeses)appData.projecaoMeses={};const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m=>{appData.projecaoMeses[`${anoAtual}-${m}`]=saldo;});salvar();renderizarProjecaoMeses();calcularProjecaoMeses();toast('Aplicado!');}

function calcularProjecaoMeses(){
if(!appData.projecaoMeses)appData.projecaoMeses={};const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);
let totalAportado=0,mesesOrdem=['01','02','03','04','05','06','07','08','09','10','11','12'],dadosAportesGrafico=[];
const taxaAnual=(appData.taxaCdi||0)/100,pctCdi=(appData.pctCdi||100)/100,taxaEfetivaAnual=taxaAnual*pctCdi,taxaMensal=taxaEfetivaAnual>0?Math.pow(1+taxaEfetivaAnual,1/12)-1:0;
let montanteComJuros=0;lucrosPassivosSimulador=[];
mesesOrdem.forEach(m=>{const aporteMes=Number(appData.projecaoMeses[`${anoAtual}-${m}`]||0);totalAportado+=aporteMes;dadosAportesGrafico.push(aporteMes);const baseMes=montanteComJuros+aporteMes,lucroDesteMes=baseMes*taxaMensal;lucrosPassivosSimulador.push(lucroDesteMes);montanteComJuros=baseMes+lucroDesteMes;});
const apenasJuros=Math.max(0,montanteComJuros-totalAportado);
document.getElementById('lblProjTaxa').textContent=`${(taxaEfetivaAnual*100).toFixed(2)}%`;
document.getElementById('resProjSemJuros').textContent=moeda(totalAportado);
document.getElementById('resProjComJuros').textContent=moeda(montanteComJuros);
document.getElementById('resProjApenasJuros').textContent='+ '+moeda(apenasJuros);
atualizarGraficoProjecaoAportes(dadosAportesGrafico);
}

function atualizarGraficoProjecaoAportes(dados){
const canvas=document.getElementById('chartProjecaoAportes');if(!canvas)return;
if(!chartProjecaoAportes){chartProjecaoAportes=new Chart(canvas,{type:'bar',plugins:[pluginLucroVerdeSimulador],data:{labels:['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],datasets:[{label:'Aporte Planejado',data:dados,backgroundColor:'#6366f1',borderRadius:6}]},options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:24}},plugins:{legend:{display:false},tooltip:{callbacks:{afterLabel:function(context){return'Lucro Passivo: + '+moeda(lucrosPassivosSimulador[context.dataIndex]||0);}}}},scales:{y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.05)'}},x:{grid:{display:false}}}}});}else{chartProjecaoAportes.data.datasets[0].data=dados;chartProjecaoAportes.update();}
}

function salvarInvestimentos(){appData.taxaCdi=lerNumero(document.getElementById('inputTaxaCdi').value);appData.pctCdi=lerNumero(document.getElementById('inputPctCdi').value)||100;calcularTotaisInvestimento();renderizarMetaInvestimento();salvar();atualizarGraficoInvestimentosLinha();calcularProjecaoMeses();gerarAnaliseInteligente();}
function salvarInvestimentosRetirado(val){appData.retirado=lerNumero(val);calcularTotaisInvestimento();renderizarMetaInvestimento();salvar();atualizarGraficoInvestimentosLinha();gerarAnaliseInteligente();}

function atualizarGraficoInvestimentosLinha(){
const h=appData.historicoInvestimentos||[],canvas=document.getElementById('chartInvestimentosLinha');if(!canvas)return;
const labelsMeses=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],ano=(appData.globalDate||new Date().toISOString()).slice(0,4);
const dadosAportes=['01','02','03','04','05','06','07','08','09','10','11','12'].map(m=>{const reg=h.find(x=>x.mes===`${ano}-${m}`);return reg?(Number(reg.investido)||0):0;});
const taxaAnual=(appData.taxaCdi||0)/100,pctCdi=(appData.pctCdi||100)/100,taxaMensal=(taxaAnual*pctCdi)>0?Math.pow(1+(taxaAnual*pctCdi),1/12)-1:0;
let acumulado=0;const dadosLucro=dadosAportes.map(aporte=>{acumulado+=aporte;return acumulado>0&&taxaMensal>0?acumulado*taxaMensal:0;});
const dadosRetirado=dadosAportes.map(()=>appData.retirado||0);
if(!chartInvestimentosLinha){chartInvestimentosLinha=new Chart(canvas,{type:'line',plugins:[pluginValoresPontos],data:{labels:labelsMeses,datasets:[{label:'Aporte',data:dadosAportes,borderColor:'#10b981',borderWidth:3,tension:0.2,fill:false},{label:'Lucro (CDI)',data:dadosLucro,borderColor:'#3b82f6',borderWidth:3,tension:0.2,fill:false},{label:'Retirado',data:dadosRetirado,borderColor:'#f43f5e',borderWidth:2,borderDash:[5,5],tension:0.2,fill:false}]},options:{responsive:true,maintainAspectRatio:false,layout:{padding:{top:25}},plugins:{legend:{position:'top'}},scales:{y:{beginAtZero:true,grid:{color:'rgba(255,255,255,0.06)'}},x:{grid:{display:false}}}}});}else{chartInvestimentosLinha.data.datasets[0].data=dadosAportes;chartInvestimentosLinha.data.datasets[1].data=dadosLucro;chartInvestimentosLinha.data.datasets[2].data=dadosRetirado;chartInvestimentosLinha.update();}
}

function geraranaliseInteligente(){
const elConteudo=document.getElementById('conteudoAnalise');if(!elConteudo)return;
let totalR=0,totalD=0,resumoTopicos=[];
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>{let somaTop=0;(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))somaTop+=Number(i.valor)||0;});if(somaTop>0)resumoTopicos.push({titulo:t.titulo,valor:somaTop,pct:totalR>0?Math.round((somaTop/totalR)*100):0});totalD+=somaTop;});
const saldo=totalR-totalD,pctComprometido=totalR>0?Math.round((totalD/totalR)*100):0,taxaPoupanca=totalR>0?Math.max(0,Math.round((saldo/totalR)*100)):0;
const{somaInvestido,lucroCalculado}=calcularTotaisInvestimento(),patrimonioLiquido=Math.max(0,(somaInvestido+lucroCalculado)-(appData.retirado||0));
const taxaEfetiva=((appData.taxaCdi||0)*((appData.pctCdi||100)/100))/100,rendaPassivaMensalEstimada=patrimonioLiquido*(taxaEfetiva>0?Math.pow(1+taxaEfetiva,1/12)-1:0),coberturaReservaMeses=totalD>0?(patrimonioLiquido/totalD).toFixed(1):'0.0';
renderizarConquistasAnalise(patrimonioLiquido,rendaPassivaMensalEstimada);
let score=50;if(totalR===0&&totalD===0&&patrimonioLiquido===0)score=0;else{if(pctComprometido<=50)score+=25;else if(pctComprometido<=70)score+=10;else if(pctComprometido>85)score-=20;if(saldo<0)score-=25;if(patrimonioLiquido>0)score+=15;if(totalD>0&&(patrimonioLiquido/totalD)>=6)score+=10;score=Math.max(0,Math.min(100,score));}
const lblScore=document.getElementById('lblScoreNota');if(lblScore){lblScore.textContent=`${score} / 100`;lblScore.className=`font-black valor-mono text-base ${score>=75?'text-emerald-400':score>=50?'text-amber-300':'text-rose-400'}`;}
let statusBanner='';if(totalR===0&&totalD===0){statusBanner=`<div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300"><b>📊 Sem dados</b></div>`;}else if(pctComprometido<=55){statusBanner=`<div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200"><b>🟢 Excelente (${pctComprometido}% comprometido)</b></div>`;}else if(pctComprometido<=79){statusBanner=`<div class="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200"><b>🔵 Equilibrado (${pctComprometido}% comprometido)</b></div>`;}else{statusBanner=`<div class="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200"><b>🔴 Risco (${pctComprometido}% comprometido)</b></div>`;}
elConteudo.innerHTML=`<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center"><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Renda</span><h4 class="text-sm font-black valor-mono text-emerald-400">${moeda(totalR)}</h4></div><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Despesas</span><h4 class="text-sm font-black valor-mono text-rose-400">${moeda(totalD)}</h4></div><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Margem</span><h4 class="text-sm font-black valor-mono ${saldo>=0?'text-indigo-300':'text-rose-400'}">${moeda(saldo)}</h4></div><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Patrimônio</span><h4 class="text-sm font-black valor-mono text-cyan-300">${moeda(patrimonioLiquido)}</h4></div></div>${statusBanner}`;

let diagInv=[];const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4),aportesAno=(appData.historicoInvestimentos||[]).filter(h=>h.mes.startsWith(anoAtual)).reduce((acc,h)=>acc+(Number(h.investido)||0),0);
if(patrimonioLiquido<=0){diagInv.push(`<b>Carteira Zerada:</b> Registre saldo investido.`);}else{diagInv.push(`<b>Renda Passiva:</b> ~+${moeda(rendaPassivaMensalEstimada)}/mês.`);}
diagInv.push(`<b>Eficiência:</b> ${(taxaEfetiva*100).toFixed(2)}% a.a. Aportes em ${anoAtual}: <b>${moeda(aportesAno)}</b>.`);
document.getElementById('analiseInvestimentosDetalhada').innerHTML=diagInv.map(d=>`<div class="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5"><i class="fa-solid fa-chart-line text-cyan-400"></i><span>${d}</span></div>`).join('');

let dicas=[];if(saldo>0)dicas.push(`<b>Aporte:</b> Direcione parte dos ${moeda(saldo)} livres para investimentos.`);
document.getElementById('dicasEconomia').innerHTML=dicas.map(d=>`<div class="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5"><i class="fa-solid fa-check text-emerald-400"></i><span>${d}</span></div>`).join('');

const elRanking=document.getElementById('rankingTopicosAnalise');if(resumoTopicos.length===0){elRanking.innerHTML=`<p class="text-slate-500 py-2">Sem gastos.</p>`;}else{resumoTopicos.sort((a,b)=>b.valor-a.valor);elRanking.innerHTML=resumoTopicos.map(t=>`<div class="bg-black/20 p-2.5 rounded-xl border border-white/5"><div class="flex justify-between items-center mb-1"><span class="font-bold text-slate-200">${t.titulo}</span><span class="valor-mono font-bold text-amber-300">${moeda(t.valor)} (${t.pct}%)</span></div><div class="h-1.5 bg-white/5 rounded-full overflow-hidden"><div class="h-full ${t.pct>35?'bg-rose-500':t.pct>20?'bg-amber-400':'bg-emerald-400'}" style="width:${Math.min(100,t.pct)}%"></div></div></div>`).join('');}
}
window.gerarAnaliseInteligente = geraranaliseInteligente;

function initCharts(){
if(chartPizza)return;Chart.defaults.color='#94a3b8';Chart.defaults.borderColor='rgba(255,255,255,0.06)';
chartPizza=new Chart(document.getElementById('chartPizza'),{type:'doughnut',data:{labels:[],datasets:[{data:[],backgroundColor:['#10b981','#6366f1','#f59e0b','#f43f5e','#06b6d4','#8b5cf6'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false}}}});
chartBar=new Chart(document.getElementById('chartBar'),{type:'bar',data:{labels:['Renda','Despesas','Lucro','Saldo'],datasets:[{data:[0,0,0,0],backgroundColor:['#10b981','#f43f5e','#06b6d4','#6366f1'],borderRadius:12}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
chartLinha=new Chart(document.getElementById('chartLinha').getContext('2d'),{type:'line',data:{labels:[],datasets:[{label:'Saldo',data:[],borderColor:'#10b981',fill:true,tension:0.3,borderWidth:3}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{grid:{color:'rgba(255,255,255,0.05)'}},x:{grid:{display:false}}}}});
}

function atualizarGrafico(){
if(!chartPizza)return;let porTopico={},totalR=0,totalD=0;
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>{let s=0;(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))s+=Number(i.valor)||0;});if(s>0)porTopico[t.titulo]=s;totalD+=s;});
chartPizza.data.labels=Object.keys(porTopico);chartPizza.data.datasets[0].data=Object.values(porTopico);chartPizza.update();
const{lucroCalculado}=calcularTotaisInvestimento();chartBar.data.datasets[0].data=[totalR,totalD,lucroCalculado,totalR-totalD];chartBar.update();
const leg=document.getElementById('legendaPizza');leg.innerHTML='';const entries=Object.entries(porTopico);
if(entries.length===0){leg.innerHTML=`<p class="text-xs text-slate-500 text-center py-2">Sem despesas</p>`;}else{
entries.forEach(([nome,valor],idx)=>{const cores=['bg-emerald-500','bg-indigo-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-violet-500'],pct=Math.round((valor/(totalR||1))*100);leg.innerHTML+=`<div class="flex justify-between items-center bg-[#0a0f1e] border border-white/5 rounded-full px-3 py-1.5"><div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full ${cores[idx%cores.length]}"></span>${nome} <span class="text-slate-500">${pct}%</span></div><span class="font-bold valor-mono">${moeda(valor)}</span></div>`;});
}
chartLinha.data.labels=(appData.historicoSaldo||[]).map(h=>h.mes);chartLinha.data.datasets[0].data=(appData.historicoSaldo||[]).map(h=>h.saldo);chartLinha.update();
}

function salvarHistorico(apenasVisual=false){
const mes=appData.globalDate;let tr=0,td=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))tr+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))td+=Number(i.valor)||0;}));
const saldo=tr-td;if(!appData.historicoSaldo)appData.historicoSaldo=[];const existente=appData.historicoSaldo.find(h=>h.mes===mes);
if(existente)existente.saldo=saldo;else appData.historicoSaldo.push({mes,saldo});if(appData.historicoSaldo.length>12)appData.historicoSaldo=appData.historicoSaldo.slice(-12);
if(!apenasVisual)salvar();
}

function exportarBackup(){const blob=new Blob([JSON.stringify(appData,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`cashflow_backup_${appData.globalDate}.json`;a.click();URL.revokeObjectURL(url);toast('Backup baixado!');}
function importarBackup(e){const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{appData=JSON.parse(ev.target.result);salvar();location.reload();}catch{toast('Inválido');}};r.readAsText(file);}
function importarExtrato(){
const txt=document.getElementById('extratoInput').value.trim();if(!txt)return;let linhas=txt.split('\n'),criados=0;
if(!Array.isArray(appData.topicos))appData.topicos=[];let topDestino=appData.topicos[0]||{id:'top_'+Date.now(),titulo:"Geral",descricao:"",cor:"emerald",colapsado:false,itens:[]};
if(!appData.topicos.includes(topDestino))appData.topicos.push(topDestino);
linhas.forEach(l=>{const match=l.match(/([0-9]+[.,][0-9]{2})/);if(match){const valor=lerNumero(match[1]),nome=l.replace(match[1],'').trim()||'Gasto';if(valor>0){topDestino.itens.push({id:'imp_'+Date.now()+criados,nome:nome.slice(0,30),valor,tipoPrazo:'fixo',dataFim:'',pago:false});criados++;}}});
document.getElementById('extratoInput').value='';salvar();renderizarTudo();toast(`${criados} adicionados!`);
}
function pedirNotificacao(){if('Notification' in window)Notification.requestPermission().then(p=>toast(p==='granted'?'Ativado!':'Negado'));}
