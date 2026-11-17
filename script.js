const SUPABASE_URL='https://hcelkzenncuqaqqsbqbs.supabase.co';
const SUPABASE_KEY='sb_publishable_p53AbjGl-Kb26rubzpCU8g_xqMUWMcz';
const {createClient}=supabase;
const dbSupabase=createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
const INTERVALO_24H_MS=24*60*60*1000;

const CATALOGO_ATIVOS_FAMOSOS={
acoes_br:[
{ticker:'PETR4',nome:'Petrobras PN',preco:36.50,div:0.45},{ticker:'VALE3',nome:'Vale ON',preco:58.20,div:0.42},{ticker:'ITUB4',nome:'Itaú Unibanco PN',preco:34.80,div:0.25},{ticker:'BBAS3',nome:'Banco do Brasil ON',preco:27.90,div:0.26},{ticker:'WEGE3',nome:'WEG ON',preco:52.40,div:0.12},{ticker:'BBDC4',nome:'Bradesco PN',preco:14.60,div:0.14},{ticker:'TAEE11',nome:'Taesa Unit',preco:34.90,div:0.33},{ticker:'EGIE3',nome:'Engie Brasil ON',preco:42.10,div:0.35},{ticker:'VIVT3',nome:'Telefônica Vivo ON',preco:51.30,div:0.38},{ticker:'SANB11',nome:'Santander Unit',preco:28.70,div:0.22},{ticker:'CPLE6',nome:'Copel PNB',preco:9.85,div:0.08},{ticker:'CMIG4',nome:'Cemig PN',preco:11.20,div:0.10},{ticker:'ISAE4',nome:'ISA Energia PN',preco:25.40,div:0.24},{ticker:'BBSE3',nome:'BB Seguridade ON',preco:35.60,div:0.32},{ticker:'CXSE3',nome:'Caixa Seguridade ON',preco:14.90,div:0.13},{ticker:'KLBN11',nome:'Klabin Unit',preco:21.50,div:0.16},{ticker:'SUZB3',nome:'Suzano ON',preco:56.80,div:0.25},{ticker:'PRIO3',nome:'PRIO ON',preco:41.90,div:0.10},{ticker:'GGBR4',nome:'Gerdau PN',preco:18.40,div:0.15},{ticker:'B3SA3',nome:'B3 ON',preco:10.90,div:0.09}
],
fiis:[
{ticker:'MXRF11',nome:'Maxi Renda FII',preco:9.95,div:0.10},{ticker:'HGLG11',nome:'CSHG Logística',preco:156.50,div:1.10},{ticker:'KNRI11',nome:'Kinea Renda Imob.',preco:142.00,div:1.00},{ticker:'XPML11',nome:'XP Malls',preco:104.20,div:0.92},{ticker:'BTLG11',nome:'BTG Logística',preco:98.50,div:0.78},{ticker:'VISC11',nome:'Vinci Shopping Centers',preco:106.80,div:0.85},{ticker:'KNCR11',nome:'Kinea Rendimentos',preco:103.90,div:1.05},{ticker:'KNIP11',nome:'Kinea Índices de Preços',preco:91.40,div:0.90},{ticker:'XPLG11',nome:'XP Log',preco:96.30,div:0.78},{ticker:'HGRU11',nome:'CSHG Renda Urbana',preco:121.50,div:0.85},{ticker:'IRDM11',nome:'Iridium Recebíveis',preco:68.90,div:0.75},{ticker:'CPTS11',nome:'Capitânia Securities',preco:7.35,div:0.08},{ticker:'VGHF11',nome:'Valora Hedge Fund',preco:7.80,div:0.09},{ticker:'BCFF11',nome:'BTG Fundo de Fundos',preco:7.90,div:0.07},{ticker:'TGAR11',nome:'TG Ativo Real',preco:98.20,div:1.15},{ticker:'RECR11',nome:'REC Recebíveis Imob.',preco:79.40,div:0.88},{ticker:'BRCO11',nome:'Bresco Logística',preco:112.00,div:0.87},{ticker:'HGBS11',nome:'Hedge Brasil Shopping',preco:19.60,div:0.17},{ticker:'ALZR11',nome:'Alianza Trust Renda',preco:10.45,div:0.08},{ticker:'PVBI11',nome:'VBI Prime Properties',preco:84.50,div:0.65}
],
acoes_ext:[
{ticker:'AAPL',nome:'Apple Inc.',preco:1280.00,div:1.25},{ticker:'NVDA',nome:'NVIDIA Corp.',preco:790.00,div:0.15},{ticker:'MSFT',nome:'Microsoft Corp.',preco:2420.00,div:3.60},{ticker:'AMZN',nome:'Amazon.com Inc.',preco:1180.00,div:0.50},{ticker:'GOOGL',nome:'Alphabet (Google)',preco:1020.00,div:0.95},{ticker:'META',nome:'Meta Platforms',preco:3350.00,div:2.40},{ticker:'TSLA',nome:'Tesla Inc.',preco:1450.00,div:0.50},{ticker:'BRK.B',nome:'Berkshire Hathaway',preco:2610.00,div:1.50},{ticker:'KO',nome:'Coca-Cola Company',preco:365.00,div:0.95},{ticker:'JNJ',nome:'Johnson & Johnson',preco:890.00,div:2.10},{ticker:'PG',nome:'Procter & Gamble',preco:960.00,div:1.95},{ticker:'JPM',nome:'JPMorgan Chase',preco:1340.00,div:2.30},{ticker:'V',nome:'Visa Inc.',preco:1710.00,div:1.10},{ticker:'MA',nome:'Mastercard Inc.',preco:2890.00,div:1.30},{ticker:'O',nome:'Realty Income REIT',preco:320.00,div:1.48},{ticker:'PEP',nome:'PepsiCo Inc.',preco:920.00,div:2.20},{ticker:'WMT',nome:'Walmart Inc.',preco:490.00,div:0.42},{ticker:'DIS',nome:'Walt Disney Co.',preco:580.00,div:0.45},{ticker:'MCD',nome:'McDonald’s Corp.',preco:1680.00,div:2.85},{ticker:'NFLX',nome:'Netflix Inc.',preco:4350.00,div:1.00}
]
};

function dataHoraAtualFormatada(){
const d=new Date();
return `${d.toLocaleDateString('pt-BR')} às ${d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}`;
}

const dadosPadrao={globalDate:new Date().toISOString().slice(0,7),tema:"dark",metaEconomia:0,metaInvestimento:0,historicoSaldo:[],retirado:0,taxaCdi:13.65,pctCdi:100,aliquotaIrCaixinha:0,ultimaAtualizacaoCd:new Date().toISOString().slice(0,10),ultimoSyncCotacoesTs:0,catalogoCotacoesCache:null,historicoInvestimentos:[],projecaoMeses:{},rendas:[],topicos:[],conquistasManuais:[],carteiraAtivos:[],caixinhaAtiva:"nubank",caixinhasBancos:{bb:{aportado:0,divBruto:0,divDiario:0,pctCdi:100,taxaCdi:13.65},mp:{aportado:0,divBruto:0,divDiario:0,pctCdi:100,taxaCdi:13.65},inter:{aportado:0,divBruto:0,divDiario:0,pctCdi:100,taxaCdi:13.65},nubank:{aportado:0,divBruto:0,divDiario:0,pctCdi:100,taxaCdi:13.65}},fundoConfig:{modalidade:"fiis",ticker:"MXRF11",precoCota:9.95,ultimoDiv:0.10,dataAtualizacao:dataHoraAtualFormatada(),aporteMensal:500,cotasAtuais:0},fundosPorModalidade:{acoes_br:{ticker:"PETR4",precoCota:36.50,ultimoDiv:0.45,dataAtualizacao:dataHoraAtualFormatada(),aporteMensal:500,cotasAtuais:0},fiis:{ticker:"MXRF11",precoCota:9.95,ultimoDiv:0.10,dataAtualizacao:dataHoraAtualFormatada(),aporteMensal:500,cotasAtuais:0},acoes_ext:{ticker:"AAPL",precoCota:1280.00,ultimoDiv:1.25,dataAtualizacao:dataHoraAtualFormatada(),aporteMensal:500,cotasAtuais:0}}};
let appData=JSON.parse(JSON.stringify(dadosPadrao)),usuarioAtual=null,modoCadastro=false,autenticadoEmAndamento=false,carregandoInicial=false,timerSalvarNuvem=null,timerRenderizacao=null,timerAutoSync24h=null,timerDebounceFundo=null;
let itemEditandoPrazo=null,chartPizza=null,chartBar=null,chartLinha=null,chartCaixinhaComparativo=null,chartProjecaoAportes=null,lucrosPassivosSimulador=[0,0,0,0,0,0,0,0,0,0,0,0];

function lerNumero(val){if(typeof val==='number')return val;if(!val)return 0;let s=String(val).trim();if(s.includes(',')&&s.includes('.'))s=s.replace(/\./g,'').replace(',','.');else if(s.includes(','))s=s.replace(',','.');const n=parseFloat(s);return isNaN(n)?0:n;}
function criarRipple(e){if(!e||!e.currentTarget)return;const btn=e.currentTarget,circle=document.createElement('span'),diameter=Math.max(btn.clientWidth,btn.clientHeight),radius=diameter/2;circle.style.width=circle.style.height=`${diameter}px`;circle.style.left=`${e.clientX-btn.getBoundingClientRect().left-radius}px`;circle.style.top=`${e.clientY-btn.getBoundingClientRect().top-radius}px`;circle.classList.add('ripple');const rippleEl=btn.getElementsByClassName('ripple')[0];if(rippleEl)rippleEl.remove();btn.appendChild(circle);}

function atualizarBadgeNuvem(estado){
const el=document.getElementById('badgeSyncNuvem');if(!el)return;
if(estado==='salvando'){el.className='text-[9px] text-amber-300 font-semibold flex items-center gap-1';el.innerHTML='<i class="fa-solid fa-rotate fa-spin"></i> Salvando...';}
else if(estado==='erro'){el.className='text-[9px] text-rose-400 font-semibold flex items-center gap-1';el.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i> Salvo apenas local';}
else{el.className='text-[9px] text-emerald-400 font-semibold flex items-center gap-1';el.innerHTML='<i class="fa-solid fa-cloud-check"></i> Salvo na nuvem';}
}

function toggleMenuConfig(ev){if(ev)ev.stopPropagation();const m=document.getElementById('menuConfigHeader');if(m)m.classList.toggle('hidden');}
function fecharMenuConfig(){const m=document.getElementById('menuConfigHeader');if(m)m.classList.add('hidden');}

const pluginLucroVerdeSimulador={id:'lucroVerdeSimulador',afterDatasetsDraw(chart){const{ctx}=chart,meta=chart.getDatasetMeta(0);if(!meta||meta.hidden)return;meta.data.forEach((bar,index)=>{const lucroMes=lucrosPassivosSimulador[index]||0,aporteMes=chart.data.datasets[0].data[index]||0;if(lucroMes>0||aporteMes>0){ctx.save();ctx.fillStyle='#10b981';ctx.font='extrabold 10px "JetBrains Mono", monospace';ctx.textAlign='center';ctx.fillText('+R$ '+lucroMes.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}),bar.x,bar.y-8);ctx.restore();}});}};

document.addEventListener('DOMContentLoaded',async()=>{
initCharts();
document.addEventListener('click',e=>{
const dd=document.getElementById('dropdownAtivosFamosos'),inp=document.getElementById('buscaAtivoFamoso');
if(dd&&!dd.contains(e.target)&&e.target!==inp)dd.classList.add('hidden');
const menuCfg=document.getElementById('menuConfigHeader');
if(menuCfg&&!menuCfg.contains(e.target))menuCfg.classList.add('hidden');
});
window.addEventListener('focus',async()=>{if(usuarioAtual&&!carregandoInicial&&!timerSalvarNuvem){await carregarDoSupabase();preencherCamposInterface();renderizarTudo(true);}});
const{data:{session}}=await dbSupabase.auth.getSession();
if(session&&session.user){usuarioAtual=session.user;await entrarNoApp();}else{document.getElementById('telaAuth').classList.remove('hidden');document.getElementById('appPrincipal').classList.add('hidden');}
});
window.addEventListener('beforeunload',()=>{if(usuarioAtual&&!carregandoInicial)localStorage.setItem('cashflow_'+usuarioAtual.id,JSON.stringify(appData));});

function alternarModoAuth(){modoCadastro=!modoCadastro;const sub=document.getElementById('authSubtitulo'),btn=document.getElementById('btnAuthAcao'),alt=document.getElementById('btnAuthAlternar');if(modoCadastro){sub.textContent="Crie a sua conta informando um nome e palavra-passe";btn.textContent="Cadastrar Conta";alt.innerHTML="Já tem uma conta? <b>Fazer Login</b>";}else{sub.textContent="Digite o seu nome de login e palavra-passe";btn.textContent="Entrar na Conta";alt.innerHTML="Não tem conta? <b>Criar Conta com Nome</b>";}}

async function executarAutenticacao(){if(autenticadoEmAndamento)return;const nomeUsuario=document.getElementById('authUsuario').value.trim().toLowerCase().replace(/[^a-z0-9_]/g,''),password=document.getElementById('authPassword').value.trim();if(!nomeUsuario||!password){toast('Preencha os campos');return;}autenticadoEmAndamento=true;const btn=document.getElementById('btnAuthAcao'),textoOriginal=btn.textContent;btn.textContent=modoCadastro?"Cadastrando...":"Entrando...";btn.disabled=true;const emailFicticio=`${nomeUsuario}@cashflow.local`;try{if(modoCadastro){const{data,error}=await dbSupabase.auth.signUp({email:emailFicticio,password});if(error)toast('Erro: '+error.message);else{toast('Conta criada!');if(data.user){usuarioAtual=data.user;await entrarNoApp();}}}else{const{data,error}=await dbSupabase.auth.signInWithPassword({email:emailFicticio,password});if(error)toast('Erro no login');else{usuarioAtual=data.user;await entrarNoApp();}}}finally{autenticadoEmAndamento=false;btn.textContent=textoOriginal;btn.disabled=false;}}

async function fazerLogout(){if(timerSalvarNuvem){clearTimeout(timerSalvarNuvem);timerSalvarNuvem=null;}if(timerAutoSync24h){clearInterval(timerAutoSync24h);timerAutoSync24h=null;}if(usuarioAtual&&!carregandoInicial)await salvarNaNuvemAgora(usuarioAtual.id,JSON.parse(JSON.stringify(appData)));usuarioAtual=null;appData=JSON.parse(JSON.stringify(dadosPadrao));document.getElementById('authPassword').value='';document.getElementById('btnAdminPainel').classList.add('hidden');document.getElementById('appPrincipal').classList.add('hidden');document.getElementById('telaAuth').classList.remove('hidden');toast('Sessão terminada!');dbSupabase.auth.signOut().catch(()=>{});}

function isRecebidoNoMes(r,mesRef=appData.globalDate){
if(r.recebidosPorMes&&typeof r.recebidosPorMes==='object'&&mesRef in r.recebidosPorMes)return!!r.recebidosPorMes[mesRef];
return!!r.recebido;
}
function setRecebidoNoMes(r,val,mesRef=appData.globalDate){
if(!r.recebidosPorMes||typeof r.recebidosPorMes!=='object')r.recebidosPorMes={};
r.recebidosPorMes[mesRef]=!!val;r.recebido=!!val;
}
function isPagoNoMes(item,mesRef=appData.globalDate){
if(item.pagosPorMes&&typeof item.pagosPorMes==='object'&&mesRef in item.pagosPorMes)return!!item.pagosPorMes[mesRef];
return!!item.pago;
}
function setPagoNoMes(item,val,mesRef=appData.globalDate){
if(!item.pagosPorMes||typeof item.pagosPorMes!=='object')item.pagosPorMes={};
item.pagosPorMes[mesRef]=!!val;item.pago=!!val;
}

function garantirEstruturaInvestimentos(){
if(!appData.caixinhasBancos)appData.caixinhasBancos=JSON.parse(JSON.stringify(dadosPadrao.caixinhasBancos));
['bb','mp','inter','nubank'].forEach(b=>{if(!appData.caixinhasBancos[b])appData.caixinhasBancos[b]={aportado:0,divBruto:0,divDiario:0,pctCdi:100,taxaCdi:appData.taxaCdi||13.65};});
if(!appData.caixinhaAtiva)appData.caixinhaAtiva='nubank';
if(appData.aliquotaIrCaixinha===undefined)appData.aliquotaIrCaixinha=0;
if(!appData.fundoConfig)appData.fundoConfig=JSON.parse(JSON.stringify(dadosPadrao.fundoConfig));
if(appData.fundoConfig.modalidade==='acoes')appData.fundoConfig.modalidade='acoes_br';
if(appData.fundoConfig.modalidade==='imobiliarios')appData.fundoConfig.modalidade='acoes_ext';
if(!appData.fundosPorModalidade)appData.fundosPorModalidade=JSON.parse(JSON.stringify(dadosPadrao.fundosPorModalidade));
if(appData.fundosPorModalidade.acoes&&!appData.fundosPorModalidade.acoes_br)appData.fundosPorModalidade.acoes_br=appData.fundosPorModalidade.acoes;
if(appData.fundosPorModalidade.imobiliarios&&!appData.fundosPorModalidade.acoes_ext)appData.fundosPorModalidade.acoes_ext=appData.fundosPorModalidade.imobiliarios;
['acoes_br','fiis','acoes_ext'].forEach(m=>{if(!appData.fundosPorModalidade[m])appData.fundosPorModalidade[m]=JSON.parse(JSON.stringify(dadosPadrao.fundosPorModalidade[m]));});
if(!Array.isArray(appData.carteiraAtivos)){
appData.carteiraAtivos=[];
['acoes_br','fiis','acoes_ext'].forEach(m=>{
const item=appData.fundosPorModalidade[m];
if(item&&Number(item.cotasAtuais)>0&&item.ticker){
appData.carteiraAtivos.push({ticker:item.ticker.toUpperCase(),modalidade:m,cotas:Number(item.cotasAtuais),precoCota:Number(item.precoCota)||10,ultimoDiv:Number(item.ultimoDiv)||0.1});
}
});
}
if(appData.catalogoCotacoesCache){
['acoes_br','fiis','acoes_ext'].forEach(g=>{
if(Array.isArray(appData.catalogoCotacoesCache[g])){
appData.catalogoCotacoesCache[g].forEach(cached=>{
const item=CATALOGO_ATIVOS_FAMOSOS[g]?.find(x=>x.ticker===cached.ticker);
if(item&&cached.preco>0){item.preco=cached.preco;item.div=cached.div;}
});
}
});
}
}

async function verificarEAtualizarCotacoes24h(forcar=false){
garantirEstruturaInvestimentos();
const agora=Date.now(),ultimo=Number(appData.ultimoSyncCotacoesTs)||0;
if(!forcar&&ultimo>0&&(agora-ultimo)<INTERVALO_24H_MS){
const dtStr=appData.fundoConfig.dataAtualizacao||dataHoraAtualFormatada();
const elDt=document.getElementById('fnDataAtualizacao');if(elDt)elDt.value=dtStr;
return;
}
const lblSync=document.getElementById('lblStatusSync24h');if(lblSync)lblSync.textContent='🔄 Sincronizando cotações B3...';
let atualizadosApi=0;
for(const grupo of ['acoes_br','fiis']){
const lista=CATALOGO_ATIVOS_FAMOSOS[grupo];
const lotes=[lista.slice(0,10),lista.slice(10,20)];
for(const lote of lotes){
const tickersStr=lote.map(x=>x.ticker).join(',');
try{
const resp=await fetch(`https://brapi.dev/api/quote/${tickersStr}`);
if(resp.ok){
const json=await resp.json();
(json?.results||[]).forEach(r=>{
const alvo=lista.find(x=>x.ticker===r.symbol);
if(alvo&&r.regularMarketPrice>0){
const dyRatio=alvo.preco>0?(alvo.div/alvo.preco):0.008;
alvo.preco=Number(r.regularMarketPrice.toFixed(2));
alvo.div=Number(Math.max(0.01,alvo.preco*dyRatio).toFixed(2));
atualizadosApi++;
}
});
}
}catch(e){}
}
}
const carimbo=dataHoraAtualFormatada();
appData.ultimoSyncCotacoesTs=agora;
appData.catalogoCotacoesCache=JSON.parse(JSON.stringify(CATALOGO_ATIVOS_FAMOSOS));
['acoes_br','fiis','acoes_ext'].forEach(g=>{
const cfg=appData.fundosPorModalidade[g];
if(cfg){
const ref=CATALOGO_ATIVOS_FAMOSOS[g].find(x=>x.ticker===(cfg.ticker||'').toUpperCase());
if(ref){cfg.precoCota=ref.preco;cfg.ultimoDiv=ref.div;}
cfg.dataAtualizacao=carimbo;
}
});
(appData.carteiraAtivos||[]).forEach(item=>{
const ref=(CATALOGO_ATIVOS_FAMOSOS[item.modalidade]||[]).find(x=>x.ticker===item.ticker);
if(ref){item.precoCota=ref.preco;item.ultimoDiv=ref.div;}
});
const modAtual=appData.fundoConfig.modalidade||'fiis';
if(appData.fundosPorModalidade[modAtual]){
appData.fundoConfig=Object.assign({modalidade:modAtual},appData.fundosPorModalidade[modAtual]);
}
appData.fundoConfig.dataAtualizacao=carimbo;
preencherInputsFundo(appData.fundoConfig);
renderizarAtalhosAtivosFamosos(modAtual);
renderizarCarteiraMultiAtivos();
calcularTotaisInvestimento();
renderizarMetaInvestimento();
renderizarSimulacaoFundo();
if(lblSync)lblSync.textContent=atualizadosApi>0?`⚡ B3 Sincronizada (${carimbo})`:`⚡ Catálogo Base Ativo (${carimbo})`;
salvar();
}

function iniciarMonitoramento24h(){
if(timerAutoSync24h)clearInterval(timerAutoSync24h);
verificarEAtualizarCotacoes24h(false);
timerAutoSync24h=setInterval(()=>verificarEAtualizarCotacoes24h(false),60*60*1000);
}

function preencherCamposInterface(){
garantirEstruturaInvestimentos();
const dt=appData.globalDate||new Date().toISOString().slice(0,7);
document.getElementById('globalDate').value=dt;
const mobDt=document.getElementById('globalDateMobile');if(mobDt)mobDt.value=dt;
document.getElementById('metaEconomia').value=appData.metaEconomia>0?appData.metaEconomia:'';
document.getElementById('metaInvestimento').value=appData.metaInvestimento>0?appData.metaInvestimento:'';
document.getElementById('seletorTema').value=appData.tema||'dark';
const selIr=document.getElementById('selectAliquotaIrCaixinha');if(selIr)selIr.value=String(appData.aliquotaIrCaixinha||0);
aplicarTemaBancario(appData.tema||'dark');
carregarCamposCaixinhaAtiva();
carregarCamposFundo();
renderizarCarteiraMultiAtivos();
}

async function entrarNoApp(){carregandoInicial=true;document.getElementById('telaAuth').classList.add('hidden');document.getElementById('appPrincipal').classList.remove('hidden');document.getElementById('buscaGlobal').value='';document.getElementById('filtroPago').value='todos';const cacheLocal=localStorage.getItem('cashflow_'+usuarioAtual.id);if(cacheLocal){try{appData=Object.assign(JSON.parse(JSON.stringify(dadosPadrao)),JSON.parse(cacheLocal));preencherCamposInterface();renderizarTudo(true);}catch(e){}}await Promise.all([verificarAdmin(),carregarDoSupabase()]);carregandoInicial=false;preencherCamposInterface();renderizarTudo(true);iniciarMonitoramento24h();}

async function verificarAdmin(){if(!usuarioAtual)return;try{const{data}=await dbSupabase.from('perfis').select('is_admin').eq('id',usuarioAtual.id).maybeSingle();document.getElementById('btnAdminPainel').classList.toggle('hidden',!(data&&data.is_admin===true));}catch(e){document.getElementById('btnAdminPainel').classList.add('hidden');}}
function abrirModalAdmin(){document.getElementById('modalAdmin').classList.remove('hidden');}
function fecharModalAdmin(){document.getElementById('modalAdmin').classList.add('hidden');}

async function carregarDoSupabase(){if(!usuarioAtual)return;const uid=usuarioAtual.id;try{const{data,error}=await dbSupabase.from('transacoes').select('payload').eq('user_id',uid).limit(1).maybeSingle();if(error)throw error;const cacheLocal=localStorage.getItem('cashflow_'+uid),cacheObj=cacheLocal?JSON.parse(cacheLocal):null;if(data&&data.payload){appData=Object.assign(JSON.parse(JSON.stringify(dadosPadrao)),data.payload);localStorage.setItem('cashflow_'+uid,JSON.stringify(appData));atualizarBadgeNuvem('salvo');}else if(cacheObj){appData=Object.assign(JSON.parse(JSON.stringify(dadosPadrao)),cacheObj);await salvarNaNuvemAgora(uid,appData);}}catch(err){atualizarBadgeNuvem('erro');}}

async function salvarNaNuvemAgora(uid,dados){if(!uid)return;try{atualizarBadgeNuvem('salvando');const{error}=await dbSupabase.from('transacoes').upsert({user_id:uid,payload:dados,Titulo:'Painel Principal'},{onConflict:'user_id'});if(error)throw error;atualizarBadgeNuvem('salvo');}catch(err){atualizarBadgeNuvem('erro');}}
function salvar(){if(!usuarioAtual||carregandoInicial)return;const uid=usuarioAtual.id,copia=JSON.parse(JSON.stringify(appData));localStorage.setItem('cashflow_'+uid,JSON.stringify(copia));atualizarBadgeNuvem('salvando');if(timerSalvarNuvem)clearTimeout(timerSalvarNuvem);timerSalvarNuvem=setTimeout(()=>salvarNaNuvemAgora(uid,copia),450);}
function resetarPadrao(){if(confirm('Tem certeza que deseja limpar todos os dados da conta?')){appData=JSON.parse(JSON.stringify(dadosPadrao));document.getElementById('buscaGlobal').value='';document.getElementById('filtroPago').value='todos';preencherCamposInterface();salvar();renderizarTudo(true);toast('Dados resetados!');}}

function mudarAba(abaId){
document.querySelectorAll('.tab-pane').forEach(el=>el.classList.add('hidden'));
document.querySelectorAll('.tab-btn').forEach(btn=>{btn.classList.remove('bg-emerald-500','text-black','shadow-lg','shadow-emerald-500/25');btn.classList.add('bg-white/5','text-slate-300','border','border-white/5');});
const targetPane=document.getElementById('aba-'+abaId);if(targetPane)targetPane.classList.remove('hidden');
const activeBtn=document.getElementById('btnTab-'+abaId);if(activeBtn){activeBtn.classList.remove('bg-white/5','text-slate-300','border','border-white/5');activeBtn.classList.add('bg-emerald-500','text-black','shadow-lg','shadow-emerald-500/25');}
if(abaId==='investimentos'){
carregarCamposCaixinhaAtiva();carregarCamposFundo();renderizarCarteiraMultiAtivos();calcularTotaisInvestimento();renderizarMetaInvestimento();renderizarSimulacaoFundo();renderizarProjecaoMeses();calcularProjecaoMeses();
setTimeout(()=>{atualizarGraficoCaixinha();if(chartCaixinhaComparativo)chartCaixinhaComparativo.resize();if(chartProjecaoAportes)chartProjecaoAportes.resize();},60);
}else if(abaId==='analise'){gerarAnaliseInteligente();}else{renderizarTudo(true);}
}

function toggleAccordionInv(idWrapper,idIcone,idTxt,isCaixinha){
const wrap=document.getElementById(idWrapper),ic=document.getElementById(idIcone),txt=document.getElementById(idTxt);
if(!wrap)return;
const estaRetraido=wrap.classList.toggle('retraido');
if(ic)ic.classList.toggle('rotacionado-180',!estaRetraido);
if(txt)txt.textContent=estaRetraido?'Expandir':'Retrair';
if(!estaRetraido&&isCaixinha){setTimeout(()=>{atualizarGraficoCaixinha();calcularProjecaoMeses();if(chartCaixinhaComparativo)chartCaixinhaComparativo.resize();if(chartProjecaoAportes)chartProjecaoAportes.resize();},80);}
}

const nomesBancos={bb:'Banco do Brasil',mp:'Mercado Pago',inter:'Inter',nubank:'Nubank'};
function selecionarBancoCaixinha(banco,ev){
if(ev){ev.stopPropagation();criarRipple(ev);}
garantirEstruturaInvestimentos();appData.caixinhaAtiva=banco;
carregarCamposCaixinhaAtiva();calcularTotaisInvestimento();renderizarMetaInvestimento();atualizarGraficoCaixinha();calcularProjecaoMeses();salvar();
}

function carregarCamposCaixinhaAtiva(){
garantirEstruturaInvestimentos();const banco=appData.caixinhaAtiva||'nubank',b=appData.caixinhasBancos[banco];if(!b)return;
const aliqIr=(Number(appData.aliquotaIrCaixinha)||0)/100;
const taxaEfetivaAnual=((b.taxaCdi||13.65)/100)*((b.pctCdi||100)/100);
const taxaDiaria=taxaEfetivaAnual>0?(Math.pow(1+taxaEfetivaAnual,1/252)-1)*(1-aliqIr):0;
b.divDiario=(Number(b.aportado)||0)*taxaDiaria;
document.getElementById('cxValorAportado').value=b.aportado>0?b.aportado:'';
document.getElementById('inputTaxaCdi').value=b.taxaCdi>0?b.taxaCdi:(appData.taxaCdi||13.65);
document.getElementById('inputPctCdi').value=b.pctCdi>0?b.pctCdi:(appData.pctCdi||100);
document.getElementById('cxDividendoDiario').value=b.divDiario>0?Number(b.divDiario).toFixed(2):'0,00';
document.getElementById('cxDividendoBruto').value=b.divBruto>0?Number(b.divBruto).toFixed(2):'';
const lblNome=document.getElementById('lblNomeBancoForm');if(lblNome)lblNome.textContent=nomesBancos[banco]||banco;
selecionarVisualBotaoBanco(banco);
}

function selecionarVisualBotaoBanco(banco){
document.querySelectorAll('.btn-banco').forEach(b=>{b.classList.remove('border-amber-500/50','bg-amber-500/20','text-amber-300');b.classList.add('border-white/10','bg-white/5','text-slate-300');});
const btn=document.getElementById('btnBanco-'+banco);if(btn){btn.classList.remove('border-white/10','bg-white/5','text-slate-300');btn.classList.add('border-amber-500/50','bg-amber-500/20','text-amber-300');}
const badge=document.getElementById('badgeBancoAtivo');if(badge)badge.textContent=nomesBancos[banco]||banco;
}

function salvarDadosCaixinha(manualBruto=false){
garantirEstruturaInvestimentos();const b=appData.caixinhasBancos[appData.caixinhaAtiva];
b.aportado=lerNumero(document.getElementById('cxValorAportado').value);
b.taxaCdi=lerNumero(document.getElementById('inputTaxaCdi').value)||13.65;
b.pctCdi=lerNumero(document.getElementById('inputPctCdi').value)||100;
const selIr=document.getElementById('selectAliquotaIrCaixinha');
appData.aliquotaIrCaixinha=selIr?lerNumero(selIr.value):0;
const aliqIr=appData.aliquotaIrCaixinha/100;
appData.taxaCdi=b.taxaCdi;appData.pctCdi=b.pctCdi;
const taxaEfetivaAnual=(b.taxaCdi/100)*(b.pctCdi/100);
const taxaDiaria=taxaEfetivaAnual>0?(Math.pow(1+taxaEfetivaAnual,1/252)-1)*(1-aliqIr):0;
const taxaMensal=taxaEfetivaAnual>0?(Math.pow(1+taxaEfetivaAnual,1/12)-1)*(1-aliqIr):0;
b.divDiario=b.aportado*taxaDiaria;
document.getElementById('cxDividendoDiario').value=b.divDiario>0?b.divDiario.toFixed(2):'0,00';
if(!manualBruto){
b.divBruto=b.aportado*taxaMensal;
document.getElementById('cxDividendoBruto').value=b.divBruto>0?b.divBruto.toFixed(2):'';
}else{
b.divBruto=lerNumero(document.getElementById('cxDividendoBruto').value);
}
calcularTotaisInvestimento();renderizarMetaInvestimento();atualizarGraficoCaixinha();calcularProjecaoMeses();gerarAnaliseInteligente();salvar();
}

function atualizarGraficoCaixinha(){
const canvas=document.getElementById('chartCaixinhaComparativo');if(!canvas)return;
garantirEstruturaInvestimentos();const b=appData.caixinhasBancos[appData.caixinhaAtiva];
const aliqIr=(Number(appData.aliquotaIrCaixinha)||0)/100;
const aportado=Number(b.aportado)||0,taxaEfetiva=((Number(b.taxaCdi)||13.65)/100)*((Number(b.pctCdi)||100)/100);
const divDiario=aportado*(taxaEfetiva>0?(Math.pow(1+taxaEfetiva,1/252)-1)*(1-aliqIr):0);
const divMensal=Number(b.divBruto)>0?Number(b.divBruto):(divDiario*21);
const lbl=document.getElementById('lblResumoCaixinha'),lblMes=document.getElementById('lblResumoCaixinhaMes');
if(lbl)lbl.textContent=`+${moeda(divDiario)} / dia`;
if(lblMes)lblMes.textContent=`+${moeda(divMensal)} / mês`;
const diasLabels=Array.from({length:15},(_,i)=>`${(i+1)*2}º Dia`);
const serieAporte=diasLabels.map((_,i)=>Number((aportado+(divDiario*(i+1)*2)).toFixed(2)));
const serieDividendoAcum=diasLabels.map((_,i)=>Number((divDiario*(i+1)*2).toFixed(2)));
if(!chartCaixinhaComparativo){
chartCaixinhaComparativo=new Chart(canvas,{type:'line',data:{labels:diasLabels,datasets:[{label:'Patrimônio c/ Aporte (R$)',data:serieAporte,borderColor:'#10b981',backgroundColor:'rgba(16,185,129,0.08)',borderWidth:2.5,tension:0.25,fill:false,yAxisID:'y'},{label:'Dividendo Diário Acumulado (R$)',data:serieDividendoAcum,borderColor:'#06b6d4',backgroundColor:'rgba(6,182,212,0.18)',borderWidth:3,tension:0.35,fill:true,yAxisID:'y1'}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},plugins:{legend:{position:'top'}},scales:{y:{type:'linear',display:true,position:'left',grid:{color:'rgba(255,255,255,0.05)'},ticks:{callback:v=>'R$ '+Number(v).toLocaleString('pt-BR',{maximumFractionDigits:0})}},y1:{type:'linear',display:true,position:'right',beginAtZero:true,grid:{drawOnChartArea:false},ticks:{color:'#22d3ee',callback:v=>'+R$ '+Number(v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2})}},x:{grid:{display:false}}}}});
}else{
chartCaixinhaComparativo.data.datasets[0].data=serieAporte;
chartCaixinhaComparativo.data.datasets[1].data=serieDividendoAcum;
chartCaixinhaComparativo.update();
}
}

const nomesModalidadesFundo={acoes_br:'Ações Brasileiras',fiis:'Fundos Imobiliários',acoes_ext:'Ações Estrangeiras'};
function selecionarModalidadeFundo(mod,ev){
if(ev){ev.stopPropagation();criarRipple(ev);}
garantirEstruturaInvestimentos();
if(!CATALOGO_ATIVOS_FAMOSOS[mod])mod='fiis';
appData.fundoConfig.modalidade=mod;
const dadosMod=appData.fundosPorModalidade[mod]||dadosPadrao.fundosPorModalidade[mod];
appData.fundoConfig=Object.assign({modalidade:mod},dadosMod);
document.querySelectorAll('.btn-mod-fundo').forEach(b=>{b.classList.remove('border-indigo-500/50','bg-indigo-500/20','text-indigo-300');b.classList.add('border-white/10','bg-white/5','text-slate-300');});
const btn=document.getElementById('btnModFundo-'+mod);if(btn){btn.classList.remove('border-white/10','bg-white/5','text-slate-300');btn.classList.add('border-indigo-500/50','bg-indigo-500/20','text-indigo-300');}
const badge=document.getElementById('badgeTipoFundo'),lblCat=document.getElementById('lblCategoriaFundoDados'),lblBusca=document.getElementById('lblBuscaModalidade');
if(badge)badge.textContent=nomesModalidadesFundo[mod]||mod;
if(lblCat)lblCat.textContent=nomesModalidadesFundo[mod]||mod;
if(lblBusca)lblBusca.textContent=nomesModalidadesFundo[mod]||mod;
const inpBusca=document.getElementById('buscaAtivoFamoso');if(inpBusca)inpBusca.value='';
preencherInputsFundo(appData.fundoConfig);
renderizarAtalhosAtivosFamosos(mod);
filtrarAtivosFamosos('');
calcularTotaisInvestimento();renderizarMetaInvestimento();renderizarSimulacaoFundo();salvar();
}

function renderizarAtalhosAtivosFamosos(mod){
const container=document.getElementById('atalhosAtivosFamosos');if(!container)return;
const lista=CATALOGO_ATIVOS_FAMOSOS[mod]||[];
const tickerAtual=(appData.fundoConfig.ticker||'').toUpperCase();
container.innerHTML=lista.map(item=>{
const ativo=item.ticker===tickerAtual;
return `<button type="button" onclick="escolherAtivoFamoso('${mod}','${item.ticker}',event)" class="px-2.5 py-1 rounded-full text-[11px] font-bold shrink-0 border transition-all cursor-pointer ${ativo?'bg-emerald-500 text-black border-emerald-400 shadow-md':'bg-[#0a0f1e] text-slate-300 border-white/10 hover:border-emerald-500/50 hover:text-emerald-300'}">${item.ticker} <span class="opacity-70 font-normal">R$${item.preco.toFixed(2)}</span></button>`;
}).join('');
}

function salvarAtivoNaCarteira(){
garantirEstruturaInvestimentos();
const f=appData.fundoConfig;
const ticker=(document.getElementById('fnTickerAtivo').value||'').trim().toUpperCase();
const preco=lerNumero(document.getElementById('fnSimPrecoCota').value);
const div=lerNumero(document.getElementById('fnSimDivCota').value);
const cotas=lerNumero(document.getElementById('fnSimCotasAtuais').value);
if(!ticker||preco<=0){toast('Informe um Ticker e Preço válidos');return;}
const idx=appData.carteiraAtivos.findIndex(x=>x.ticker===ticker);
if(cotas<=0){
if(idx>=0){appData.carteiraAtivos.splice(idx,1);toast(`${ticker} removido da carteira`);}
else{toast('Informe a quantidade de cotas atuais (> 0)');return;}
}else{
const obj={ticker,modalidade:f.modalidade||'fiis',cotas,precoCota:preco,ultimoDiv:div};
if(idx>=0)appData.carteiraAtivos[idx]=obj;else appData.carteiraAtivos.push(obj);
toast(`${ticker} (${cotas} cotas) salvo na carteira!`);
}
renderizarCarteiraMultiAtivos();calcularTotaisInvestimento();renderizarMetaInvestimento();gerarAnaliseInteligente();salvar();
}

function removerAtivoDaCarteira(ticker,ev){
if(ev)ev.stopPropagation();
appData.carteiraAtivos=(appData.carteiraAtivos||[]).filter(x=>x.ticker!==ticker);
renderizarCarteiraMultiAtivos();calcularTotaisInvestimento();renderizarMetaInvestimento();gerarAnaliseInteligente();salvar();
}

function carregarAtivoDaCarteira(ticker,ev){
if(ev)ev.stopPropagation();
const item=(appData.carteiraAtivos||[]).find(x=>x.ticker===ticker);if(!item)return;
appData.fundosPorModalidade[item.modalidade]=Object.assign({},appData.fundosPorModalidade[item.modalidade],{ticker:item.ticker,precoCota:item.precoCota,ultimoDiv:item.ultimoDiv,cotasAtuais:item.cotas});
selecionarModalidadeFundo(item.modalidade);
}

function renderizarCarteiraMultiAtivos(){
const c=document.getElementById('listaCarteiraMultiAtivos');if(!c)return;
garantirEstruturaInvestimentos();
const lista=appData.carteiraAtivos||[];
if(lista.length===0){
c.innerHTML=`<div class="col-span-full text-xs text-slate-400 py-2 text-center bg-black/20 rounded-xl border border-white/5">Nenhum ativo fixado ainda. Preencha "Qtd. Cotas Atuais" abaixo e clique em "+ Salvar/Atualizar Ativo na Carteira".</div>`;
return;
}
c.innerHTML=lista.map(a=>{
const pat=a.cotas*a.precoCota,renda=a.cotas*a.ultimoDiv;
return `<div onclick="carregarAtivoDaCarteira('${a.ticker}',event)" class="bg-[#0a0f1e] p-3 rounded-xl border border-white/10 hover:border-indigo-400/50 cursor-pointer flex justify-between items-center transition-all"><div><div class="flex items-center gap-1.5"><span class="font-extrabold text-xs text-emerald-300 valor-mono">${a.ticker}</span><span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-300">${a.cotas} cotas</span></div><div class="text-[11px] valor-mono text-slate-300 mt-1">Total: <b class="text-cyan-300">${moeda(pat)}</b> <span class="text-emerald-400">(+${moeda(renda)}/mês)</span></div></div><button type="button" onclick="removerAtivoDaCarteira('${a.ticker}',event)" class="w-6 h-6 rounded-full bg-rose-500/15 text-rose-300 hover:bg-rose-500/30 flex items-center justify-center"><i class="fa-solid fa-xmark text-[10px]"></i></button></div>`;
}).join('');
}

function abrirListaAtivosFamosos(){filtrarAtivosFamosos(document.getElementById('buscaAtivoFamoso')?.value||'');const dd=document.getElementById('dropdownAtivosFamosos');if(dd)dd.classList.remove('hidden');}
function toggleListaAtivosFamosos(ev){if(ev)ev.stopPropagation();const dd=document.getElementById('dropdownAtivosFamosos');if(!dd)return;if(dd.classList.contains('hidden'))abrirListaAtivosFamosos();else dd.classList.add('hidden');}

function filtrarAtivosFamosos(termo){
const dd=document.getElementById('dropdownAtivosFamosos');if(!dd)return;
const q=(termo||'').trim().toLowerCase();
const modAtual=appData.fundoConfig.modalidade||'fiis';
let resultados=[];
const grupos=q?['acoes_br','fiis','acoes_ext']:[modAtual];
grupos.forEach(g=>{
(CATALOGO_ATIVOS_FAMOSOS[g]||[]).forEach(a=>{
if(!q||a.ticker.toLowerCase().includes(q)||a.nome.toLowerCase().includes(q)){
resultados.push(Object.assign({grupo:g,grupoNome:nomesModalidadesFundo[g]},a));
}
});
});
if(resultados.length===0){dd.innerHTML=`<div class="p-3 text-xs text-slate-400 text-center">Nenhum ativo encontrado para "${termo}"</div>`;return;}
dd.innerHTML=resultados.map(r=>`<div onclick="escolherAtivoFamoso('${r.grupo}','${r.ticker}',event)" class="px-3.5 py-2.5 hover:bg-indigo-500/20 cursor-pointer flex justify-between items-center gap-2 transition-colors"><div><span class="font-extrabold text-xs text-emerald-300 valor-mono">${r.ticker}</span> <span class="text-xs text-slate-200 font-semibold ml-1">${r.nome}</span> <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 ml-1">${r.grupoNome}</span></div><div class="text-right text-[11px] valor-mono"><span class="text-cyan-300 font-bold">Cota: ${moeda(r.preco)}</span> <span class="text-emerald-400 ml-2">Div: ${moeda(r.div)}</span></div></div>`).join('');
}

function escolherAtivoFamoso(grupo,ticker,ev){
if(ev)ev.stopPropagation();
garantirEstruturaInvestimentos();
const item=(CATALOGO_ATIVOS_FAMOSOS[grupo]||[]).find(x=>x.ticker===ticker);if(!item)return;
if(appData.fundoConfig.modalidade!==grupo)appData.fundoConfig.modalidade=grupo;
const naCarteira=(appData.carteiraAtivos||[]).find(x=>x.ticker===item.ticker);
const cotasExistentes=naCarteira?naCarteira.cotas:(Number(appData.fundosPorModalidade[grupo]?.cotasAtuais)||0);
const aporteExistente=Number(appData.fundosPorModalidade[grupo]?.aporteMensal)||500;
const dtSync=appData.fundoConfig.dataAtualizacao||dataHoraAtualFormatada();
const novoObj={modalidade:grupo,ticker:item.ticker,precoCota:item.preco,ultimoDiv:item.div,dataAtualizacao:dtSync,aporteMensal:aporteExistente,cotasAtuais:cotasExistentes};
appData.fundosPorModalidade[grupo]=Object.assign({},novoObj);
appData.fundoConfig=Object.assign({},novoObj);
selecionarModalidadeFundo(grupo);
const inpBusca=document.getElementById('buscaAtivoFamoso');if(inpBusca)inpBusca.value=`${item.ticker} - ${item.nome}`;
const dd=document.getElementById('dropdownAtivosFamosos');if(dd)dd.classList.add('hidden');
toast(`${item.ticker} carregado!`);
}

function preencherInputsFundo(f){
document.getElementById('fnTickerAtivo').value=f.ticker||'';
document.getElementById('fnPrecoCotaDados').value=f.precoCota>0?f.precoCota:'';
document.getElementById('fnSimPrecoCota').value=f.precoCota>0?f.precoCota:'';
document.getElementById('fnUltimoDivDados').value=f.ultimoDiv>0?f.ultimoDiv:'';
document.getElementById('fnSimDivCota').value=f.ultimoDiv>0?f.ultimoDiv:'';
document.getElementById('fnDataAtualizacao').value=f.dataAtualizacao||dataHoraAtualFormatada();
document.getElementById('fnSimAporteMensal').value=f.aporteMensal>0?f.aporteMensal:'';
document.getElementById('fnSimCotasAtuais').value=f.cotasAtuais>0?f.cotasAtuais:'';
}

function carregarCamposFundo(){
garantirEstruturaInvestimentos();const mod=appData.fundoConfig.modalidade||'fiis';
selecionarModalidadeFundo(mod);
}

function sincronizarCotaFundo(val){document.getElementById('fnPrecoCotaDados').value=val;document.getElementById('fnSimPrecoCota').value=val;agendarSalvarDadosFundo();}
function sincronizarDivFundo(val){document.getElementById('fnUltimoDivDados').value=val;document.getElementById('fnSimDivCota').value=val;agendarSalvarDadosFundo();}

function agendarSalvarDadosFundo(){
if(timerDebounceFundo)clearTimeout(timerDebounceFundo);
timerDebounceFundo=setTimeout(()=>salvarDadosFundo(),180);
}

function salvarDadosFundo(){
garantirEstruturaInvestimentos();const f=appData.fundoConfig,mod=f.modalidade||'fiis';
f.ticker=document.getElementById('fnTickerAtivo').value.trim().toUpperCase();
f.precoCota=lerNumero(document.getElementById('fnSimPrecoCota').value);
f.ultimoDiv=lerNumero(document.getElementById('fnSimDivCota').value);
f.aporteMensal=lerNumero(document.getElementById('fnSimAporteMensal').value);
f.cotasAtuais=lerNumero(document.getElementById('fnSimCotasAtuais').value);
appData.fundosPorModalidade[mod]=Object.assign({},f);
const itemCarteira=(appData.carteiraAtivos||[]).find(x=>x.ticker===f.ticker);
if(itemCarteira&&f.cotasAtuais>0){itemCarteira.cotas=f.cotasAtuais;itemCarteira.precoCota=f.precoCota;itemCarteira.ultimoDiv=f.ultimoDiv;renderizarCarteiraMultiAtivos();}
renderizarAtalhosAtivosFamosos(mod);
calcularTotaisInvestimento();renderizarMetaInvestimento();renderizarSimulacaoFundo();gerarAnaliseInteligente();salvar();
}

function renderizarSimulacaoFundo(){
garantirEstruturaInvestimentos();const f=appData.fundoConfig;
const precoCotaBase=Math.max(0.01,Number(f.precoCota)||0),divCotaBase=Math.max(0,Number(f.ultimoDiv)||0),aporteBase=Math.max(0,Number(f.aporteMensal)||0),cotasIniciais=Math.max(0,Number(f.cotasAtuais)||0);
const corrigirIpca=document.getElementById('chkCorrigirIpcaFundo')?.checked||false;
const divTotalAtual=cotasIniciais*divCotaBase,cotasMagicNumber=divCotaBase>0?Math.ceil(precoCotaBase/divCotaBase):0;
const elDivTotal=document.getElementById('fnSimDivTotal'),elMagic=document.getElementById('fnSimCotasPorDiv');
if(elDivTotal)elDivTotal.value=moeda(divTotalAtual);
if(elMagic)elMagic.value=cotasMagicNumber>0?`${cotasMagicNumber} cotas`:'0 cotas';
const tbody=document.getElementById('tabela360MesesFundo');if(!tbody)return;
let qtdCotas=cotasIniciais,caixaSobras=0;
let htmlLinhas=[],patFinal=0;
for(let m=1;m<=360;m++){
const anoIdx=Math.ceil(m/12);
const fatorIpca=corrigirIpca?Math.pow(1.045,anoIdx-1):1;
const precoCota=precoCotaBase*fatorIpca;
const divCota=divCotaBase*fatorIpca;
const aporteMensal=aporteBase*fatorIpca;
const rendimentoMes=qtdCotas*divCota;
const disponivelParaCompra=aporteMensal+rendimentoMes+caixaSobras;
const novasCotas=precoCota>0?Math.floor(disponivelParaCompra/precoCota):0;
qtdCotas+=novasCotas;
caixaSobras=precoCota>0?disponivelParaCompra-(novasCotas*precoCota):0;
const patrimonioCotas=qtdCotas*precoCota;
const rendimentoNovo=qtdCotas*divCota;
patFinal=patrimonioCotas;
htmlLinhas.push(`<tr class="hover:bg-white/[0.03]"><td class="py-2 px-3 text-slate-400">Ano ${anoIdx}</td><td class="py-2 px-3 font-bold text-slate-200">${m}º Mês</td><td class="py-2 px-3 text-indigo-300">${moeda(aporteMensal)}</td><td class="py-2 px-3 text-amber-300 font-bold">${qtdCotas.toLocaleString('pt-BR')}</td><td class="py-2 px-3 text-cyan-300 font-bold">${moeda(patrimonioCotas)}</td><td class="py-2 px-3 text-right text-emerald-400 font-bold">+ ${moeda(rendimentoNovo)}</td></tr>`);
}
tbody.innerHTML=htmlLinhas.join('');
const elPat360=document.getElementById('lblPatrimonio360Meses');if(elPat360)elPat360.textContent=moeda(patFinal);
}

function mudarTemaBancario(tema){appData.tema=tema;salvar();aplicarTemaBancario(tema);}
function aplicarTemaBancario(tema){document.body.classList.remove('light','theme-nubank','theme-apple','theme-pink');if(tema==='light')document.body.classList.add('light');else if(tema==='nubank')document.body.classList.add('theme-nubank');else if(tema==='apple')document.body.classList.add('theme-apple');else if(tema==='pink')document.body.classList.add('theme-pink');}

function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.remove('opacity-0');t.classList.add('opacity-100');setTimeout(()=>t.classList.add('opacity-0'),2000);}
function moeda(v){return(Number(v)||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function verificarSeFinalizado(tipo,dataFim){if(tipo!=='data'||!dataFim)return false;return appData.globalDate>dataFim;}
function formatarPrazoLabel(tipo,dataFim,diaVenc){
const badgeDia=diaVenc?`<span class="text-amber-300 mr-1">Dia ${diaVenc} •</span>`:'';
if(tipo==='fixo'||!dataFim)return `<span class="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 cursor-pointer">${badgeDia}∞ Fixo</span>`;
const fin=verificarSeFinalizado(tipo,dataFim);
if(fin)return `<span class="text-[10px] px-2 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">✓ ${dataFim.split('-').reverse().join('/')}</span>`;
let[a1,m1]=appData.globalDate.split('-').map(Number),[a2,m2]=dataFim.split('-').map(Number),diff=(a2-a1)*12+(m2-m1)+1;
return `<span class="text-[10px] px-2 py-1 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 cursor-pointer">${badgeDia}Restam ${diff}m</span>`;
}

function mudarMesGlobal(d){let[a,m]=appData.globalDate.split('-').map(Number);m+=d;if(m>12){m=1;a++;}if(m<1){m=12;a--;}sincronizarDataGlobal(`${a}-${String(m).padStart(2,'0')}`);}
function sincronizarDataGlobal(novaData){if(!novaData)return;appData.globalDate=novaData;const el1=document.getElementById('globalDate'),el2=document.getElementById('globalDateMobile');if(el1)el1.value=novaData;if(el2)el2.value=novaData;salvar();renderizarTudo(false);}
function atualizarDataGlobal(){sincronizarDataGlobal(document.getElementById('globalDate').value);}
function salvarMeta(){appData.metaEconomia=lerNumero(document.getElementById('metaEconomia').value);salvar();renderizarResumo();atualizarGastoDiarioRecomendado();gerarAnaliseInteligente();}
function salvarMetaInvestimento(){appData.metaInvestimento=lerNumero(document.getElementById('metaInvestimento').value);salvar();renderizarMetaInvestimento();gerarAnaliseInteligente();}

function calcularTotaisInvestimento(){
garantirEstruturaInvestimentos();
let somaCaixinhas=0,lucroCaixinhas=0;
['bb','mp','inter','nubank'].forEach(k=>{
const b=appData.caixinhasBancos[k];
if(b){
const ap=Number(b.aportado)||0,luc=Number(b.divBruto)||0;
somaCaixinhas+=ap;lucroCaixinhas+=luc;
const mini=document.getElementById('miniSaldo-'+k);if(mini)mini.textContent=moeda(ap+luc);
}
});
let patrimonioFundos=0,lucroFundos=0;
if(Array.isArray(appData.carteiraAtivos)&&appData.carteiraAtivos.length>0){
appData.carteiraAtivos.forEach(item=>{
patrimonioFundos+=(Number(item.cotas)||0)*(Number(item.precoCota)||0);
lucroFundos+=(Number(item.cotas)||0)*(Number(item.ultimoDiv)||0);
});
}else{
['acoes_br','fiis','acoes_ext'].forEach(m=>{
const item=appData.fundosPorModalidade[m];
if(item){
patrimonioFundos+=(Number(item.cotasAtuais)||0)*(Number(item.precoCota)||0);
lucroFundos+=(Number(item.cotasAtuais)||0)*(Number(item.ultimoDiv)||0);
}
});
}
const somaInvestido=somaCaixinhas+patrimonioFundos,lucroCalculado=lucroCaixinhas+lucroFundos;
const elInv=document.getElementById('inputValorInvestido'),elLuc=document.getElementById('inputValorLucrado');
if(elInv)elInv.value=somaInvestido>0?somaInvestido.toFixed(2):'0,00';
if(elLuc)elLuc.value=lucroCalculado>0?lucroCalculado.toFixed(2):'0,00';
const totalCaixinhasLiquido=somaCaixinhas+lucroCaixinhas,totalFundosLiquido=patrimonioFundos+lucroFundos;
const patrimonioLiquido=Math.max(0,totalCaixinhasLiquido+totalFundosLiquido);
const lblPat=document.getElementById('lblPatrimonioTotal'),lblSubCx=document.getElementById('lblSubtotalCaixinhas'),lblSubFn=document.getElementById('lblSubtotalFundos'),lblHeadCx=document.getElementById('lblHeaderTotalCaixinha'),lblHeadFn=document.getElementById('lblHeaderTotalFundos');
if(lblPat)lblPat.textContent=moeda(patrimonioLiquido);
if(lblSubCx)lblSubCx.textContent=moeda(totalCaixinhasLiquido);
if(lblSubFn)lblSubFn.textContent=moeda(totalFundosLiquido);
if(lblHeadCx)lblHeadCx.textContent=moeda(totalCaixinhasLiquido);
if(lblHeadFn)lblHeadFn.textContent=moeda(totalFundosLiquido);
return{somaInvestido,lucroCalculado,patrimonioLiquido,totalCaixinhasLiquido,totalFundosLiquido};
}

function renderizarMetaInvestimento(){
const{patrimonioLiquido,totalCaixinhasLiquido,totalFundosLiquido}=calcularTotaisInvestimento(),meta=appData.metaInvestimento||0,barra=document.getElementById('barraMetaInvestida'),lblStatus=document.getElementById('lblMetaInvestidaStatus'),lblPct=document.getElementById('lblPctMetaInvestida');
if(!barra||!lblStatus||!lblPct)return;
if(meta>0){const pct=Math.min(100,Math.round((patrimonioLiquido/meta)*100));barra.style.width=pct+'%';lblPct.textContent=pct+'%';if(patrimonioLiquido>=meta){lblStatus.innerHTML=`<span class="text-emerald-400 font-bold">✅ Meta batida! Superou em ${moeda(patrimonioLiquido-meta)} (Bancos: ${moeda(totalCaixinhasLiquido)} | Carteira: ${moeda(totalFundosLiquido)}).</span>`;}else{lblStatus.innerHTML=`Faltam <b class="text-amber-300 valor-mono">${moeda(meta-patrimonioLiquido)}</b> para atingir a meta (Acumulado: <b class="text-emerald-300 valor-mono">${moeda(patrimonioLiquido)}</b>).`;}}else{barra.style.width='0%';lblPct.textContent='0%';lblStatus.textContent='Defina uma meta para acompanhar o progresso somado de Caixinhas e Carteira.';}
}

function agendarRenderizacao(){if(timerRenderizacao)clearTimeout(timerRenderizacao);timerRenderizacao=setTimeout(()=>renderizarTudo(true),220);}
function renderizarTudo(apenasVisual=false){renderizarResumo();renderizarMetaInvestimento();renderizarRenda();renderizarTopicos();renderizarVencimentos();salvarHistorico(apenasVisual);atualizarGrafico();atualizarGastoDiarioRecomendado();atualizarGraficoCaixinha();renderizarSimulacaoFundo();renderizarProjecaoMeses();calcularProjecaoMeses();gerarAnaliseInteligente();}

function renderizarResumo(){
let totalR=0,rendaRecebida=0,totalD=0,totalPago=0,totalPendente=0,encerr=0,qtdPagos=0,qtdPendentes=0;
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim)){const v=Number(r.valor)||0;totalR+=v;if(isRecebidoNoMes(r))rendaRecebida+=v;}});
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(verificarSeFinalizado(i.tipoPrazo,i.dataFim))encerr++;else{const v=Number(i.valor)||0;totalD+=v;if(isPagoNoMes(i)){totalPago+=v;qtdPagos++;}else{totalPendente+=v;qtdPendentes++;}}}));
const saldo=totalR-totalD,pct=totalR>0?Math.round((totalD/totalR)*100):0,pctQuitado=totalD>0?Math.round((totalPago/totalD)*100):0,taxaPoupanca=totalR>0?Math.max(0,Math.round((saldo/totalR)*100)):0;
const{lucroCalculado,patrimonioLiquido}=calcularTotaisInvestimento();
document.getElementById('resumoCards').innerHTML=`
<div class="card-dark bg-gradient-to-br from-[#12233a] to-[#0e1a2e] border ${pct>=80?'pisca border-rose-500/50':'border-white/[0.08]'} rounded-[20px] p-5 card-anim shadow-xl"><div class="flex justify-between items-center"><p class="text-[10px] uppercase tracking-widest text-slate-400">Renda vs Despesas</p><span class="text-[10px] px-2 py-0.5 rounded-full ${pct>=80?'bg-rose-500/20 text-rose-300':'bg-emerald-500/15 text-emerald-300'} font-bold">${pct}% usado</span></div><h3 class="text-xl font-black valor-mono mt-1">${moeda(totalR)} <span class="text-sm text-rose-300">/ ${moeda(totalD)}</span></h3><div class="mt-3 h-2.5 bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10"><div class="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 rounded-full transition-all duration-500" style="width:${Math.min(pct,100)}%"></div></div><div class="flex justify-between text-[10px] text-slate-400 mt-2"><span>Recebido: <b class="text-emerald-300 valor-mono">${moeda(rendaRecebida)}</b></span><span>A receber: <b class="text-slate-200 valor-mono">${moeda(Math.max(0,totalR-rendaRecebida))}</b></span></div></div>
<div class="card-dark bg-gradient-to-br from-[#1a2040] to-[#13172e] border border-white/[0.08] rounded-[20px] p-5 card-anim shadow-xl"><div class="flex justify-between items-center"><p class="text-[10px] uppercase tracking-widest text-indigo-300/70">Saldo Livre do Mês</p><span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">Execução: ${pctQuitado}%</span></div><h3 class="text-2xl font-black valor-mono mt-1 ${saldo>=0?'text-emerald-300':'text-rose-300'}">${moeda(saldo)}</h3><p class="text-[11px] mt-2 font-bold" id="lblMetaStatus2"></p></div>`;

const painelKpis=document.getElementById('painelKpisGeral');
if(painelKpis){
painelKpis.innerHTML=`
<div class="card-dark rounded-2xl p-3.5 border-emerald-500/25 bg-[#101c2c] flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-300 shrink-0"><i class="fa-solid fa-shield-heart"></i></div><div><span class="text-[10px] uppercase tracking-wider text-slate-400 block">Taxa de Poupança</span><h4 class="text-sm sm:text-base font-black valor-mono text-emerald-400">${taxaPoupanca}% da Renda</h4></div></div>
<div class="card-dark rounded-2xl p-3.5 border-cyan-500/25 bg-[#101c2c] flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0"><i class="fa-solid fa-circle-check"></i></div><div><span class="text-[10px] uppercase tracking-wider text-slate-400 block">Contas Quitadas</span><h4 class="text-sm sm:text-base font-black valor-mono text-cyan-300">${moeda(totalPago)} <span class="text-[10px] text-slate-400">(${qtdPagos})</span></h4></div></div>
<div class="card-dark rounded-2xl p-3.5 border-amber-500/25 bg-[#101c2c] flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0"><i class="fa-solid fa-hourglass-half"></i></div><div><span class="text-[10px] uppercase tracking-wider text-slate-400 block">Falta Pagar no Mês</span><h4 class="text-sm sm:text-base font-black valor-mono text-amber-300">${moeda(totalPendente)} <span class="text-[10px] text-slate-400">(${qtdPendentes})</span></h4></div></div>
<div class="card-dark rounded-2xl p-3.5 border-indigo-500/25 bg-[#101c2c] flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0"><i class="fa-solid fa-vault"></i></div><div><span class="text-[10px] uppercase tracking-wider text-slate-400 block">Patrimônio + Dividendos</span><h4 class="text-sm sm:text-base font-black valor-mono text-indigo-300">${moeda(patrimonioLiquido)} <span class="text-[10px] text-emerald-400">(+${moeda(lucroCalculado)})</span></h4></div></div>`;
}

const meta=appData.metaEconomia||0,lbl=document.getElementById('lblMetaStatus'),lbl2=document.getElementById('lblMetaStatus2');
if(meta>0){if(saldo>=meta){lbl.textContent=`✅ Meta batida!`;lbl.className="text-[11px] mt-2 text-emerald-400 font-bold";if(lbl2)lbl2.textContent=`Sobrou ${moeda(saldo-meta)} acima da meta`;}else{lbl.textContent=`⚠️ Faltam ${moeda(meta-saldo)}`;lbl.className="text-[11px] mt-2 text-amber-400 font-bold";if(lbl2)lbl2.textContent=`Faltam ${moeda(meta-saldo)} para a meta`;}}else{lbl.textContent="Defina sua meta";if(lbl2)lbl2.textContent="";}
document.getElementById('lblContasEncerradas').textContent=encerr+' encerradas';
}

function atualizarGastoDiarioRecomendado(){
const[ano,mes]=(appData.globalDate||new Date().toISOString().slice(0,7)).split('-').map(Number),hoje=new Date(),anoAtual=hoje.getFullYear(),mesAtual=hoje.getMonth()+1,diaAtual=hoje.getDate(),ultimoDiaMes=new Date(ano,mes,0).getDate();
let diasRestantes=ultimoDiaMes;if(ano===anoAtual&&mes===mesAtual)diasRestantes=Math.max(1,ultimoDiaMes-diaAtual+1);
let totalR=0,rendaRec=0,totalD=0,totalPago=0;
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim)){const v=Number(r.valor)||0;totalR+=v;if(isRecebidoNoMes(r))rendaRec+=v;}});
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim)){const v=Number(i.valor)||0;totalD+=v;if(isPagoNoMes(i))totalPago+=v;}}));
const metaEco=Number(appData.metaEconomia)||0;
const saldoLiquido=totalR-totalD,caixaReal=rendaRec-totalPago,gastoDiario=saldoLiquido>0?saldoLiquido/diasRestantes:0;
const saldoProtegido=Math.max(0,saldoLiquido-metaEco),gastoDiarioComMeta=saldoProtegido>0?saldoProtegido/diasRestantes:0;
const elSaldo=document.getElementById('lblSaldoLiquidoGeral'),elCaixa=document.getElementById('lblCaixaRealHoje'),elMetaRes=document.getElementById('lblMetaReservaGeral'),elDias=document.getElementById('lblDiasRestantes'),elDiario=document.getElementById('lblGastoDiarioRecomendado'),elDiarioMeta=document.getElementById('lblGastoDiarioComMeta');
if(elSaldo){elSaldo.textContent=moeda(saldoLiquido);elSaldo.className=`font-black valor-mono text-sm sm:text-base ${saldoLiquido>=0?'text-cyan-300':'text-rose-400'}`;}
if(elCaixa){elCaixa.textContent=moeda(caixaReal);elCaixa.className=`font-black valor-mono text-sm sm:text-base ${caixaReal>=0?'text-amber-300':'text-rose-400'}`;}
if(elMetaRes)elMetaRes.textContent=moeda(metaEco);
if(elDias)elDias.textContent=`${diasRestantes} dias`;
if(elDiario){elDiario.textContent=`${moeda(gastoDiario)} / dia`;elDiario.className=`text-base sm:text-lg font-black valor-mono mt-0.5 ${gastoDiario>0?'text-emerald-400':'text-rose-400'}`;}
if(elDiarioMeta){elDiarioMeta.textContent=`${moeda(gastoDiarioComMeta)} / dia`;elDiarioMeta.className=`text-base sm:text-lg font-black valor-mono mt-0.5 ${gastoDiarioComMeta>0?'text-indigo-300':'text-amber-300'}`;}
}

function abrirModalInvestirSaldo(){
let totalR=0,totalD=0;
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))totalD+=Number(i.valor)||0;}));
const disponivel=Math.max(0,totalR-totalD);
document.getElementById('inputValorTransferirInv').value=disponivel>0?disponivel.toFixed(2):'';
document.getElementById('selectDestinoTransferirInv').value=appData.caixinhaAtiva||'nubank';
document.getElementById('modalInvestirSaldo').classList.remove('hidden');
}
function fecharModalInvestirSaldo(){document.getElementById('modalInvestirSaldo').classList.add('hidden');}
function confirmarInvestirSaldo(){
const valor=lerNumero(document.getElementById('inputValorTransferirInv').value);
const banco=document.getElementById('selectDestinoTransferirInv').value||'nubank';
const lancarDesp=document.getElementById('chkLancarComoDespesaInv').checked;
if(valor<=0){toast('Informe um valor válido');return;}
garantirEstruturaInvestimentos();
appData.caixinhasBancos[banco].aportado=(Number(appData.caixinhasBancos[banco].aportado)||0)+valor;
appData.caixinhaAtiva=banco;
if(lancarDesp){
if(!Array.isArray(appData.topicos))appData.topicos=[];
let topInv=appData.topicos.find(t=>(t.titulo||'').toLowerCase().includes('invest'));
if(!topInv){topInv={id:'top_'+Date.now(),titulo:'Investimentos',descricao:'Aportes mensais',cor:'emerald',colapsado:false,itens:[]};appData.topicos.push(topInv);}
const novoItem={id:'ap_'+Date.now(),nome:`Aporte Caixinha ${nomesBancos[banco]}`,valor,tipoPrazo:'data',dataFim:appData.globalDate,pago:true,pagosPorMes:{[appData.globalDate]:true}};
topInv.itens.push(novoItem);
}
carregarCamposCaixinhaAtiva();salvarDadosCaixinha(false);fecharModalInvestirSaldo();renderizarTudo();
toast(`${moeda(valor)} aplicados no ${nomesBancos[banco]}!`);
}

function renderizarVencimentos(){
const div=document.getElementById('listaVencimentos');div.innerHTML='';let alertas=[];
const diaHoje=new Date().getDate();
(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{
if(verificarSeFinalizado(i.tipoPrazo,i.dataFim))return;
const pagoMes=isPagoNoMes(i);
if(!pagoMes&&i.diaVencimento){
const diffDias=Number(i.diaVencimento)-diaHoje;
if(diffDias>=-5&&diffDias<=7){
alertas.push({nome:i.nome,topico:t.titulo,badge:diffDias<0?`Atrasado (Dia ${i.diaVencimento})`:diffDias===0?'Vence Hoje!':`Dia ${i.diaVencimento} (${diffDias}d)`,cor:diffDias<=0?'bg-rose-500/20 text-rose-300 border-rose-500/40':'bg-amber-500/15 text-amber-300 border-amber-500/30',ordem:diffDias});
}
}
if(i.tipoPrazo==='data'&&i.dataFim){
let[a1,m1]=appData.globalDate.split('-').map(Number),[a2,m2]=i.dataFim.split('-').map(Number),diffMes=(a2-a1)*12+(m2-m1);
if(diffMes<=2)alertas.push({nome:i.nome,topico:t.titulo,badge:`Fim: ${i.dataFim.split('-').reverse().join('/')}`,cor:'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',ordem:10+diffMes});
}
}));
if(!alertas.length){div.innerHTML='<p class="text-slate-500 text-center py-2 text-[11px]">Nenhum vencimento pendente próximo</p>';return;}
alertas.sort((a,b)=>a.ordem-b.ordem).slice(0,6).forEach(p=>{div.innerHTML+=`<div class="flex justify-between items-center bg-[#0a0f1e] border border-white/5 rounded-full px-3 py-2"><span class="truncate pr-2">${p.nome} <span class="text-slate-500">(${p.topico})</span></span><span class="px-2 py-0.5 rounded-full text-[10px] border shrink-0 ${p.cor}">${p.badge}</span></div>`;});
}

function renderizarRenda(){
const busca=(document.getElementById('buscaGlobal')?.value||'').trim().toLowerCase(),c=document.getElementById('listaRenda');c.innerHTML='';
const lista=(appData.rendas||[]).filter(r=>!busca||(r.nome||'').toLowerCase().includes(busca));
if(lista.length===0){c.innerHTML=`<p class="text-xs text-slate-400 text-center py-4 bg-black/20 rounded-xl border border-white/5">Nenhuma renda cadastrada.</p>`;return;}
lista.forEach(r=>{
const fin=verificarSeFinalizado(r.tipoPrazo,r.dataFim),rec=isRecebidoNoMes(r),div=document.createElement('div');div.className=`card-dark group bg-[#0a0f1e] border ${fin?'border-amber-500/25 opacity-60':rec?'border-emerald-500/30':'border-white/[0.08]'} rounded-[14px] p-3 card-anim`;
div.innerHTML=`<div class="flex justify-between items-center"><div class="flex items-center gap-2 flex-1"><input type="checkbox" ${rec?'checked':''} onchange="toggleRecebidoRenda(${r.id})" class="w-4 h-4 rounded cursor-pointer accent-emerald-500"><input value="${(r.nome||'').replace(/"/g,'&quot;')}" oninput="editarNomeRenda(${r.id},this.value)" class="input-dark bg-transparent text-[13px] font-semibold w-full outline-none border border-transparent hover:border-white/10 rounded-full px-2 py-1"></div><button type="button" onclick="removerRenda(${r.id});criarRipple(event)" class="w-6 h-6 rounded-full bg-white/5 hover:bg-rose-500/20 hover:text-rose-300 flex items-center justify-center"><i class="fa-solid fa-trash text-[10px]"></i></button></div><div class="flex gap-2 mt-2"><div class="relative flex-1"><span class="absolute left-2.5 top-2 text-[10px] text-emerald-400 font-bold">R$</span><input type="text" inputmode="decimal" value="${r.valor||''}" oninput="editarValorRenda(${r.id},this.value)" class="input-dark valor-mono w-full bg-white/[0.03] border border-white/10 rounded-full pl-7 pr-2 py-2 text-xs font-bold text-emerald-300"></div><button type="button" onclick="abrirModalPrazo('renda',null,${r.id});criarRipple(event)">${formatarPrazoLabel(r.tipoPrazo,r.dataFim,r.diaVencimento)}</button></div>`;
c.appendChild(div);
});
}

function adicionarRenda(){if(!Array.isArray(appData.rendas))appData.rendas=[];appData.rendas.push({id:Date.now(),nome:"Nova Renda",valor:0,tipoPrazo:"fixo",dataFim:"",recebido:true,recebidosPorMes:{[appData.globalDate]:true}});salvar();renderizarTudo();}
function removerRenda(id){if(confirm('Excluir renda?')){appData.rendas=appData.rendas.filter(r=>r.id!==id);salvar();renderizarTudo();}}
function editarNomeRenda(id,v){const r=appData.rendas.find(x=>x.id===id);if(r){r.nome=v;salvar();}}
function editarValorRenda(id,v){const r=appData.rendas.find(x=>x.id===id);if(r){r.valor=Math.max(0,lerNumero(v));salvarHistorico(false);renderizarResumo();atualizarGrafico();atualizarGastoDiarioRecomendado();gerarAnaliseInteligente();}}
function toggleRecebidoRenda(id){const r=appData.rendas.find(x=>x.id===id);if(r){setRecebidoNoMes(r,!isRecebidoNoMes(r));salvar();renderizarResumo();atualizarGastoDiarioRecomendado();renderizarRenda();}}

function renderizarTopicos(){
const busca=(document.getElementById('buscaGlobal')?.value||'').trim().toLowerCase(),filtro=document.getElementById('filtroPago')?.value||'todos',c=document.getElementById('containerTopicos');c.innerHTML='';
if(!appData.topicos||appData.topicos.length===0){c.innerHTML=`<div class="col-span-full text-center py-8 text-slate-400 text-xs bg-black/20 rounded-2xl border border-white/5">Nenhum tópico criado ainda. Clique em "+ Novo Tópico" para começar.</div>`;return;}
appData.topicos.forEach(top=>{
if(!Array.isArray(top.itens))top.itens=[];let soma=0,somaPago=0;top.itens.forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim)){const v=Number(i.valor)||0;soma+=v;if(isPagoNoMes(i))somaPago+=v;}});
const itensFiltrados=top.itens.filter(i=>{const pago=isPagoNoMes(i),matchBusca=!busca||(i.nome||'').toLowerCase().includes(busca)||(top.titulo||'').toLowerCase().includes(busca),matchPago=filtro==='todos'||(filtro==='pago'&&pago)||(filtro==='naopago'&&!pago);return matchBusca&&matchPago;});
if(busca&&itensFiltrados.length===0&&!(top.titulo||'').toLowerCase().includes(busca))return;
let tr=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))tr+=Number(r.valor)||0;});
const pctRenda=tr>0?Math.round((soma/tr)*100):0,pctPagoTop=soma>0?Math.round((somaPago/soma)*100):0,corPulse=pctRenda>40?'bg-rose-500':pctRenda>20?'bg-amber-500':'bg-emerald-500';
const div=document.createElement('div');div.className="card-dark rounded-[22px] p-5 flex flex-col card-anim shadow-xl relative overflow-hidden";
div.innerHTML=`<div class="absolute top-4 right-4 flex items-center gap-1.5"><span class="w-2 h-2 rounded-full ${corPulse} status-pulse"></span><span class="text-[9px] uppercase tracking-wider text-slate-400 font-bold" id="pctRendaTop-${top.id}">${pctRenda}% renda</span></div><div class="flex justify-between items-start mb-3 pr-16"><div class="flex-1"><input value="${(top.titulo||'').replace(/"/g,'&quot;')}" oninput="atualizarTituloTopico('${top.id}',this.value)" class="font-bold text-[14px] bg-transparent border border-transparent hover:border-white/10 rounded-full px-2 py-1 outline-none w-full" placeholder="Título"><input value="${(top.descricao||'').replace(/"/g,'&quot;')}" oninput="atualizarDescTopico('${top.id}',this.value)" class="text-[11px] text-slate-400 bg-transparent border border-transparent hover:border-white/10 rounded-full px-2 py-1 outline-none w-full mt-1" placeholder="Descrição..."></div></div><div class="bg-black/25 rounded-2xl px-4 py-2.5 mb-3 border border-white/5"><div class="flex justify-between items-center"><span class="text-[11px] text-slate-400" id="lblPagoTop-${top.id}">Total (${pctPagoTop}% pago)</span><span class="text-sm font-black valor-mono" id="lblSomaTop-${top.id}">${moeda(soma)}</span></div><div class="h-1.5 bg-white/5 rounded-full overflow-hidden mt-1.5"><div id="barraPagoTop-${top.id}" class="h-full bg-emerald-400 rounded-full transition-all" style="width:${pctPagoTop}%"></div></div></div><div class="flex gap-1.5 mb-2 justify-end flex-wrap"><button type="button" onclick="quitarTodosTopico('${top.id}');criarRipple(event)" class="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/25 font-bold cursor-pointer">✓ Quitar Mês</button><button type="button" onclick="toggleColapso('${top.id}');criarRipple(event)" class="text-[10px] px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 cursor-pointer">${top.colapsado?'Expandir':'Colapsar'}</button><button type="button" onclick="removerTopico('${top.id}');criarRipple(event)" class="text-[10px] px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 cursor-pointer">Excluir</button></div><div class="${top.colapsado?'hidden':''} space-y-2 mb-3">${itensFiltrados.map(item=>{const fin=verificarSeFinalizado(item.tipoPrazo,item.dataFim),pago=isPagoNoMes(item);return `<div class="card-dark bg-[#0a0f1e] border ${fin?'border-amber-500/25 opacity-60':pago?'border-emerald-500/25':'border-white/[0.05]'} rounded-[14px] p-3"><div class="flex justify-between items-center gap-2"><div class="flex items-center gap-2 flex-1"><input type="checkbox" ${pago?'checked':''} onchange="togglePagoItem('${top.id}','${item.id}')" class="w-4 h-4 rounded cursor-pointer accent-emerald-500"><input value="${(item.nome||'').replace(/"/g,'&quot;')}" oninput="editarNomeItem('${top.id}','${item.id}',this.value)" class="bg-transparent text-[12px] font-medium w-full outline-none border border-transparent hover:border-white/10 rounded-full px-2 py-1 ${pago?'line-through text-slate-500':''}"></div><button type="button" onclick="removerItem('${top.id}','${item.id}');criarRipple(event)" class="text-slate-500 hover:text-rose-400 w-6 h-6 rounded-full flex items-center justify-center"><i class="fa-solid fa-xmark text-[11px]"></i></button></div><div class="flex gap-2 mt-2"><div class="relative flex-1"><span class="absolute left-2.5 top-2 text-[10px] text-slate-500 font-bold">R$</span><input type="text" inputmode="decimal" value="${item.valor||''}" oninput="editarValorItem('${top.id}','${item.id}',this.value)" class="input-dark valor-mono w-full bg-white/[0.03] border border-white/10 rounded-full pl-7 pr-2 py-2 text-xs font-bold"></div><button type="button" onclick="abrirModalPrazo('despesa','${top.id}','${item.id}');criarRipple(event)">${formatarPrazoLabel(item.tipoPrazo,item.dataFim,item.diaVencimento)}</button></div></div>`;}).join('')||'<p class="text-xs text-slate-500 text-center py-2">Nenhum gasto</p>'}</div><button type="button" onclick="adicionarItem('${top.id}');criarRipple(event)" class="${top.colapsado?'hidden':''} mt-auto w-full py-2.5 btn-press rounded-full bg-white/5 border border-white/10 text-xs hover:bg-emerald-500 hover:text-black font-bold cursor-pointer">+ Adicionar Gasto</button>`;
c.appendChild(div);
});
}

function atualizarCabecalhoTopicoDOM(top){
if(!top)return;
let soma=0,somaPago=0;(top.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim)){const v=Number(i.valor)||0;soma+=v;if(isPagoNoMes(i))somaPago+=v;}});
let tr=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))tr+=Number(r.valor)||0;});
const pctRenda=tr>0?Math.round((soma/tr)*100):0,pctPagoTop=soma>0?Math.round((somaPago/soma)*100):0;
const elSoma=document.getElementById(`lblSomaTop-${top.id}`),elPago=document.getElementById(`lblPagoTop-${top.id}`),elBarra=document.getElementById(`barraPagoTop-${top.id}`),elPct=document.getElementById(`pctRendaTop-${top.id}`);
if(elSoma)elSoma.textContent=moeda(soma);
if(elPago)elPago.textContent=`Total (${pctPagoTop}% pago)`;
if(elBarra)elBarra.style.width=`${pctPagoTop}%`;
if(elPct)elPct.textContent=`${pctRenda}% renda`;
}

function quitarTodosTopico(id){
const t=appData.topicos.find(x=>String(x.id)===String(id));if(!t||!Array.isArray(t.itens))return;
const todosPagos=t.itens.every(i=>isPagoNoMes(i));
t.itens.forEach(i=>setPagoNoMes(i,!todosPagos));
salvar();renderizarResumo();atualizarGastoDiarioRecomendado();renderizarVencimentos();renderizarTopicos();
}

function alternarTodosTopicos(){
if(!appData.topicos||!appData.topicos.length)return;
const algumAberto=appData.topicos.some(t=>!t.colapsado);
appData.topicos.forEach(t=>{t.colapsado=algumAberto;});
salvar();renderizarTopicos();
}

function toggleColapso(id){const t=appData.topicos.find(x=>String(x.id)===String(id));if(t){t.colapsado=!t.colapsado;salvar();renderizarTopicos();}}
function abrirModalTopico(){document.getElementById('modalTopico').classList.remove('hidden');setTimeout(()=>document.getElementById('inputNovoTopico').focus(),100);}
function fecharModalTopico(){document.getElementById('modalTopico').classList.add('hidden');}
function confirmarNovoTopico(){const nome=document.getElementById('inputNovoTopico').value.trim();if(!nome)return;if(!Array.isArray(appData.topicos))appData.topicos=[];appData.topicos.push({id:'top_'+Date.now(),titulo:nome,descricao:"",cor:"emerald",colapsado:false,itens:[]});document.getElementById('inputNovoTopico').value='';fecharModalTopico();salvar();renderizarTudo();}
function removerTopico(id){if(confirm("Excluir tópico inteiro?")){appData.topicos=appData.topicos.filter(t=>String(t.id)!==String(id));salvar();renderizarTudo();}}
function atualizarTituloTopico(id,v){const t=appData.topicos.find(x=>String(x.id)===String(id));if(t){t.titulo=v;salvar();atualizarGrafico();}}
function atualizarDescTopico(id,v){const t=appData.topicos.find(x=>String(x.id)===String(id));if(t){t.descricao=v;salvar();}}
function adicionarItem(tid){const t=appData.topicos.find(x=>String(x.id)===String(tid));if(t){if(!Array.isArray(t.itens))t.itens=[];t.itens.push({id:'item_'+Date.now(),nome:"Novo Gasto",valor:0,tipoPrazo:"fixo",dataFim:"",diaVencimento:"",pago:false,pagosPorMes:{}});salvar();renderizarTudo();}}
function removerItem(tid,iid){const t=appData.topicos.find(x=>String(x.id)===String(tid));if(t){t.itens=t.itens.filter(i=>String(i.id)!==String(iid));salvar();renderizarTudo();}}
function editarNomeItem(tid,iid,v){const t=appData.topicos.find(x=>String(x.id)===String(tid)),i=t?.itens.find(x=>String(x.id)===String(iid));if(i){i.nome=v;salvar();}}
function editarValorItem(tid,iid,v){const t=appData.topicos.find(x=>String(x.id)===String(tid)),i=t?.itens.find(x=>String(x.id)===String(iid));if(i){i.valor=Math.max(0,lerNumero(v));atualizarCabecalhoTopicoDOM(t);salvarHistorico(false);renderizarResumo();atualizarGrafico();atualizarGastoDiarioRecomendado();gerarAnaliseInteligente();}}
function togglePagoItem(tid,iid){const t=appData.topicos.find(x=>String(x.id)===String(tid)),i=t?.itens.find(x=>String(x.id)===String(iid));if(i){setPagoNoMes(i,!isPagoNoMes(i));salvar();renderizarResumo();atualizarGastoDiarioRecomendado();renderizarVencimentos();renderizarTopicos();}}

function abrirModalQuickExpense(){const select=document.getElementById('qeTopico');select.innerHTML='';if(!appData.topicos||appData.topicos.length===0){toast('Crie um tópico primeiro');return;}appData.topicos.forEach(t=>select.innerHTML+=`<option value="${t.id}">${t.titulo}</option>`);document.getElementById('qeNome').value='';document.getElementById('qeValor').value='';document.getElementById('modalQuickExpense').classList.remove('hidden');}
function fecharModalQuickExpense(){document.getElementById('modalQuickExpense').classList.add('hidden');}
function salvarQuickExpense(){const nome=document.getElementById('qeNome').value.trim()||'Gasto',valor=Math.max(0,lerNumero(document.getElementById('qeValor').value)),tid=document.getElementById('qeTopico').value;if(valor<=0){toast('Valor inválido');return;}const t=appData.topicos.find(x=>String(x.id)===String(tid));if(t){if(!Array.isArray(t.itens))t.itens=[];t.itens.push({id:'qe_'+Date.now(),nome,valor,tipoPrazo:'fixo',dataFim:'',diaVencimento:'',pago:false,pagosPorMes:{}});salvar();fecharModalQuickExpense();renderizarTudo();toast('Adicionado!');}}

function abrirModalPrazo(tipo,topicoId,itemId){itemEditandoPrazo={tipo,topicoId,itemId};let obj=null;if(tipo==='renda')obj=appData.rendas.find(r=>String(r.id)===String(itemId));else{const t=appData.topicos.find(x=>String(x.id)===String(topicoId));obj=t?.itens.find(x=>String(x.id)===String(itemId));}if(obj){document.getElementById('modalTipoPrazo').value=obj.tipoPrazo||'fixo';document.getElementById('modalDataFim').value=obj.dataFim||appData.globalDate;document.getElementById('modalDiaVencimento').value=obj.diaVencimento||'';alternarTipoPrazoModal();document.getElementById('modalPrazo').classList.remove('hidden');}}
function fecharModalPrazo(){document.getElementById('modalPrazo').classList.add('hidden');}
function alternarTipoPrazoModal(){document.getElementById('divDataFimModal').classList.toggle('hidden',document.getElementById('modalTipoPrazo').value!=='data');}
function salvarPrazoModal(){if(!itemEditandoPrazo)return;const tipo=document.getElementById('modalTipoPrazo').value,data=document.getElementById('modalDataFim').value,diaRaw=parseInt(document.getElementById('modalDiaVencimento').value,10),diaVenc=(!isNaN(diaRaw)&&diaRaw>=1&&diaRaw<=31)?diaRaw:'';if(itemEditandoPrazo.tipo==='renda'){const r=appData.rendas.find(x=>String(x.id)===String(itemEditandoPrazo.itemId));if(r){r.tipoPrazo=tipo;r.dataFim=tipo==='data'?data:'';r.diaVencimento=diaVenc;}}else{const t=appData.topicos.find(x=>String(x.id)===String(itemEditandoPrazo.topicoId)),i=t?.itens.find(x=>String(x.id)===String(itemEditandoPrazo.itemId));if(i){i.tipoPrazo=tipo;i.dataFim=tipo==='data'?data:'';i.diaVencimento=diaVenc;}}salvar();fecharModalPrazo();renderizarTudo();}

function abrirModalConquista(){document.getElementById('inputTextoConquista').value='';document.getElementById('modalConquista').classList.remove('hidden');}
function fecharModalConquista(){document.getElementById('modalConquista').classList.add('hidden');}
function salvarConquistaModal(){const txt=document.getElementById('inputTextoConquista').value.trim();if(!txt){toast('Escreva sua conquista');return;}if(!Array.isArray(appData.conquistasManuais))appData.conquistasManuais=[];appData.conquistasManuais.push(txt);salvar();fecharModalConquista();gerarAnaliseInteligente();toast('Conquista salva!');}

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
function renderizarProjecaoMeses(){
const container=document.getElementById('containerProjecaoMeses');if(!container)return;if(!appData.projecaoMeses)appData.projecaoMeses={};
container.innerHTML='';const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);
['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m=>{const chaveMes=`${anoAtual}-${m}`,valProj=appData.projecaoMeses[chaveMes]!==undefined?appData.projecaoMeses[chaveMes]:0;container.innerHTML+=`<div class="bg-black/30 p-3 rounded-xl border border-white/5 flex flex-col justify-between"><span class="text-[10px] uppercase font-bold text-emerald-300 mb-1"><i class="fa-solid fa-coins mr-1"></i> ${mesesNomes[m]}/${anoAtual}</span><div class="relative mt-1"><span class="absolute left-2.5 top-2 text-[10px] text-emerald-400 font-bold">R$</span><input type="text" inputmode="decimal" value="${valProj}" oninput="editarProjecaoMes('${chaveMes}',this.value)" class="input-dark campo-interativo valor-mono w-full bg-[#0a0f1e] border border-white/10 rounded-full pl-7 pr-3 py-1.5 text-xs font-bold text-emerald-300"></div></div>`;});
}
function editarProjecaoMes(chaveMes,valor){if(!appData.projecaoMeses)appData.projecaoMeses={};appData.projecaoMeses[chaveMes]=lerNumero(valor);salvar();calcularProjecaoMeses();}
function preencherProjecaoComSaldo(){let totalR=0,totalD=0;(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});(appData.topicos||[]).forEach(t=>(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))totalD+=Number(i.valor)||0;}));const saldo=Math.max(0,totalR-totalD);if(!appData.projecaoMeses)appData.projecaoMeses={};const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);['01','02','03','04','05','06','07','08','09','10','11','12'].forEach(m=>{appData.projecaoMeses[`${anoAtual}-${m}`]=saldo;});salvar();renderizarProjecaoMeses();calcularProjecaoMeses();toast('Saldo aplicado aos 12 meses!');}

function calcularProjecaoMeses(){
if(!appData.projecaoMeses)appData.projecaoMeses={};const anoAtual=(appData.globalDate||new Date().toISOString()).slice(0,4);
let totalAportado=0,mesesOrdem=['01','02','03','04','05','06','07','08','09','10','11','12'],dadosAportesGrafico=[];
const aliqIr=(Number(appData.aliquotaIrCaixinha)||0)/100;
const taxaAnual=(appData.taxaCdi||0)/100,pctCdi=(appData.pctCdi||100)/100,taxaEfetivaAnual=taxaAnual*pctCdi*(1-aliqIr),taxaMensal=taxaEfetivaAnual>0?Math.pow(1+taxaEfetivaAnual,1/12)-1:0;
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

function geraranaliseInteligente(){
const elConteudo=document.getElementById('conteudoAnalise');if(!elConteudo)return;
let totalR=0,totalD=0,resumoTopicos=[];
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>{let somaTop=0;(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))somaTop+=Number(i.valor)||0;});if(somaTop>0)resumoTopicos.push({titulo:t.titulo,valor:somaTop,pct:totalR>0?Math.round((somaTop/totalR)*100):0});totalD+=somaTop;});
const saldo=totalR-totalD,pctComprometido=totalR>0?Math.round((totalD/totalR)*100):0;
const{somaInvestido,lucroCalculado,patrimonioLiquido}=calcularTotaisInvestimento();
const taxaEfetiva=((appData.taxaCdi||0)*((appData.pctCdi||100)/100))/100,rendaPassivaMensalEstimada=lucroCalculado>0?lucroCalculado:patrimonioLiquido*(taxaEfetiva>0?Math.pow(1+taxaEfetiva,1/12)-1:0);
renderizarConquistasAnalise(patrimonioLiquido,rendaPassivaMensalEstimada);
let score=50;if(totalR===0&&totalD===0&&patrimonioLiquido===0)score=0;else{if(pctComprometido<=50)score+=25;else if(pctComprometido<=70)score+=10;else if(pctComprometido>85)score-=20;if(saldo<0)score-=25;if(patrimonioLiquido>0)score+=15;if(totalD>0&&(patrimonioLiquido/totalD)>=6)score+=10;score=Math.max(0,Math.min(100,score));}
const lblScore=document.getElementById('lblScoreNota');if(lblScore){lblScore.textContent=`${score} / 100`;lblScore.className=`font-black valor-mono text-base ${score>=75?'text-emerald-400':score>=50?'text-amber-300':'text-rose-400'}`;}
let statusBanner='';if(totalR===0&&totalD===0){statusBanner=`<div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-300"><b>📊 Sem dados</b></div>`;}else if(pctComprometido<=55){statusBanner=`<div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200"><b>🟢 Excelente (${pctComprometido}% comprometido)</b></div>`;}else if(pctComprometido<=79){statusBanner=`<div class="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200"><b>🔵 Equilibrado (${pctComprometido}% comprometido)</b></div>`;}else{statusBanner=`<div class="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200"><b>🔴 Risco (${pctComprometido}% comprometido)</b></div>`;}
elConteudo.innerHTML=`<div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-center"><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Renda</span><h4 class="text-sm font-black valor-mono text-emerald-400">${moeda(totalR)}</h4></div><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Despesas</span><h4 class="text-sm font-black valor-mono text-rose-400">${moeda(totalD)}</h4></div><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Margem</span><h4 class="text-sm font-black valor-mono ${saldo>=0?'text-indigo-300':'text-rose-400'}">${moeda(saldo)}</h4></div><div class="bg-black/30 p-3.5 rounded-2xl border border-white/5"><span class="text-[10px] uppercase text-slate-400 block">Patrimônio</span><h4 class="text-sm font-black valor-mono text-cyan-300">${moeda(patrimonioLiquido)}</h4></div></div>${statusBanner}`;

let diagInv=[];
if(patrimonioLiquido<=0){diagInv.push(`<b>Carteira Zerada:</b> Registre saldo nas Caixinhas ou adicione ativos na Carteira.`);}else{diagInv.push(`<b>Renda Passiva:</b> ~+${moeda(rendaPassivaMensalEstimada)}/mês.`);}
diagInv.push(`<b>Eficiência CDI:</b> ${(taxaEfetiva*100).toFixed(2)}% a.a. Total Investido: <b>${moeda(somaInvestido)}</b>.`);
document.getElementById('analiseInvestimentosDetalhada').innerHTML=diagInv.map(d=>`<div class="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5"><i class="fa-solid fa-chart-line text-cyan-400"></i><span>${d}</span></div>`).join('');

let dicas=[];if(saldo>0)dicas.push(`<b>Aporte Rápido:</b> Use o botão "Investir Saldo Livre" na Aba Geral para aplicar parte dos ${moeda(saldo)} livres.`);
document.getElementById('dicasEconomia').innerHTML=dicas.map(d=>`<div class="flex items-start gap-2 bg-black/20 p-2.5 rounded-xl border border-white/5"><i class="fa-solid fa-check text-emerald-400"></i><span>${d}</span></div>`).join('');

const elRanking=document.getElementById('rankingTopicosAnalise');if(resumoTopicos.length===0){elRanking.innerHTML=`<p class="text-slate-500 py-2">Sem gastos.</p>`;}else{resumoTopicos.sort((a,b)=>b.valor-a.valor);elRanking.innerHTML=resumoTopicos.map(t=>`<div class="bg-black/20 p-2.5 rounded-xl border border-white/5"><div class="flex justify-between items-center mb-1"><span class="font-bold text-slate-200">${t.titulo}</span><span class="valor-mono font-bold text-amber-300">${moeda(t.valor)} (${t.pct}%)</span></div><div class="h-1.5 bg-white/5 rounded-full overflow-hidden"><div class="h-full ${t.pct>35?'bg-rose-500':t.pct>20?'bg-amber-400':'bg-emerald-400'}" style="width:${Math.min(100,t.pct)}%"></div></div></div>`).join('');}
}
window.gerarAnaliseInteligente=geraranaliseInteligente;

function initCharts(){
if(chartPizza)return;Chart.defaults.color='#94a3b8';Chart.defaults.borderColor='rgba(255,255,255,0.06)';
chartPizza=new Chart(document.getElementById('chartPizza'),{type:'doughnut',data:{labels:[],datasets:[{data:[],backgroundColor:['#10b981','#6366f1','#f59e0b','#f43f5e','#06b6d4','#8b5cf6'],borderWidth:0}]},options:{responsive:true,maintainAspectRatio:false,cutout:'68%',plugins:{legend:{display:false}}}});
chartBar=new Chart(document.getElementById('chartBar'),{type:'bar',data:{labels:['Renda','Despesas','Lucro','Saldo'],datasets:[{data:[0,0,0,0],backgroundColor:['#10b981','#f43f5e','#06b6d4','#6366f1'],borderRadius:10}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true}}}});
chartLinha=new Chart(document.getElementById('chartLinha').getContext('2d'),{type:'line',data:{labels:[],datasets:[{label:'Saldo',data:[],borderColor:'#10b981',backgroundColor:'rgba(16,185,129,0.1)',fill:true,tension:0.3,borderWidth:2.5}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{grid:{color:'rgba(255,255,255,0.05)'}},x:{grid:{display:false}}}}});
}

function atualizarGrafico(){
if(!chartPizza)return;let porTopico={},totalR=0,totalD=0;
(appData.rendas||[]).forEach(r=>{if(!verificarSeFinalizado(r.tipoPrazo,r.dataFim))totalR+=Number(r.valor)||0;});
(appData.topicos||[]).forEach(t=>{let s=0;(t.itens||[]).forEach(i=>{if(!verificarSeFinalizado(i.tipoPrazo,i.dataFim))s+=Number(i.valor)||0;});if(s>0)porTopico[t.titulo]=s;totalD+=s;});
chartPizza.data.labels=Object.keys(porTopico);chartPizza.data.datasets[0].data=Object.values(porTopico);chartPizza.update();
const{lucroCalculado}=calcularTotaisInvestimento();chartBar.data.datasets[0].data=[totalR,totalD,lucroCalculado,totalR-totalD];chartBar.update();
const leg=document.getElementById('legendaPizza'),lblMaior=document.getElementById('lblMaiorTopicoGeral');leg.innerHTML='';const entries=Object.entries(porTopico).sort((a,b)=>b[1]-a[1]);
if(entries.length===0){leg.innerHTML=`<p class="text-[11px] text-slate-500 text-center py-2">Sem despesas</p>`;if(lblMaior)lblMaior.textContent='Maior: —';}else{
if(lblMaior)lblMaior.textContent=`Maior: ${entries[0][0]} (${moeda(entries[0][1])})`;
entries.forEach(([nome,valor],idx)=>{const cores=['bg-emerald-500','bg-indigo-500','bg-amber-500','bg-rose-500','bg-cyan-500','bg-violet-500'],pct=Math.round((valor/(totalR||1))*100);leg.innerHTML+=`<div class="flex justify-between items-center bg-[#0a0f1e] border border-white/5 rounded-full px-2.5 py-1"><div class="flex items-center gap-1.5 truncate"><span class="w-2 h-2 rounded-full shrink-0 ${cores[idx%cores.length]}"></span><span class="truncate">${nome}</span> <span class="text-slate-500 text-[10px]">${pct}%</span></div><span class="font-bold valor-mono text-[10px] ml-1 shrink-0">${moeda(valor)}</span></div>`;});
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
function importarBackup(e){const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{try{appData=JSON.parse(ev.target.result);salvar();location.reload();}catch{toast('Arquivo inválido');}};r.readAsText(file);}
function importarExtrato(){
const txt=document.getElementById('extratoInput').value.trim();if(!txt)return;let linhas=txt.split('\n'),criados=0;
if(!Array.isArray(appData.topicos))appData.topicos=[];let topDestino=appData.topicos[0]||{id:'top_'+Date.now(),titulo:"Geral",descricao:"",cor:"emerald",colapsado:false,itens:[]};
if(!appData.topicos.includes(topDestino))appData.topicos.push(topDestino);
linhas.forEach(l=>{const match=l.match(/([0-9]+[.,][0-9]{2})/);if(match){const valor=lerNumero(match[1]),nome=l.replace(match[1],'').trim()||'Gasto';if(valor>0){topDestino.itens.push({id:'imp_'+Date.now()+criados,nome:nome.slice(0,30),valor,tipoPrazo:'fixo',dataFim:'',diaVencimento:'',pago:false,pagosPorMes:{}});criados++;}}});
document.getElementById('extratoInput').value='';salvar();renderizarTudo();toast(`${criados} gastos adicionados!`);
}
function pedirNotificacao(){if('Notification' in window)Notification.requestPermission().then(p=>toast(p==='granted'?'Alertas ativados!':'Permissão negada'));}
