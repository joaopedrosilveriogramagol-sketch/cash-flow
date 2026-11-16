// Alternador Global de Abas
function switchTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    
    const activeTab = document.getElementById(tabName + '-tab');
    if (activeTab) {
        activeTab.style.display = 'block';
    }
}

// Função para expandir e recolher os detalhes dos blocos
function toggleDetails(id) {
    const detailsElement = document.getElementById(id + '-details');
    if (detailsElement) {
        if (detailsElement.style.display === 'none' || detailsElement.style.display === '') {
            detailsElement.style.display = 'block';
        } else {
            detailsElement.style.display = 'none';
        }
    }
}

// Modais Rápidos
function abrirModalQuickExpense() {
    const modal = document.getElementById('modalQuickExpense');
    if (modal) modal.classList.remove('hidden');
}

function fecharModalQuickExpense() {
    const modal = document.getElementById('modalQuickExpense');
    if (modal) modal.classList.add('hidden');
}

function salvarQuickExpense() {
    fecharModalQuickExpense();
}

function criariaRipple(event) {
    // Efeito visual
}

// Função para buscar dados externos via API (simulação de atualização diária / 24h)
async function fetchVariableAssets() {
    try {
        // Simulação de resposta de API externa para fundos/ações
        const mockApiResponse = {
            totalPortfolio: "R$ 12.850,00",
            timestamp: new Date().toLocaleDateString('pt-BR') + " às " + new Date().toLocaleTimeString('pt-BR'),
            assets: [
                { ticker: "MXRF11", price: "R$ 10,50", variation: "+0.48%" },
                { ticker: "HGLG11", price: "R$ 162,30", variation: "-0.12%" },
                { ticker: "PETR4", price: "R$ 35,20", variation: "+1.25%" }
            ]
        };

        // Atualiza a interface
        const totalElem = document.getElementById('variable-total');
        if (totalElem) totalElem.innerText = mockApiResponse.totalPortfolio;
        
        const updateElem = document.getElementById('last-update');
        if (updateElem) updateElem.innerText = mockApiResponse.timestamp;
        
        let assetsHtml = '';
        mockApiResponse.assets.forEach(asset => {
            assetsHtml += `<p><strong>${asset.ticker}:</strong> ${asset.price} (${asset.variation})</p>`;
        });
        
        const listElem = document.getElementById('api-assets-list');
        if (listElem) listElem.innerHTML = assetsHtml;

    } catch (error) {
        console.error("Erro ao sincronizar dados da API:", error);
        const totalElem = document.getElementById('variable-total');
        if (totalElem) totalElem.innerText = "Erro na atualização";
    }
}

// Inicialização automática ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    // Exibe a aba padrão de investimentos/carteira
    switchTab('investments');
    
    // Executa a busca de dados da API ao iniciar
    fetchVariableAssets();
    
    // Configura a rotina de atualização automática diária (a cada 24 horas)
    const intervaloDiario = 24 * 60 * 60 * 1000;
    setInterval(fetchVariableAssets, intervaloDiario);
});
