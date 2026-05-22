// GlicoCare - Script principal
// Funcionalidade: Registro de glicemia (cadastro, histórico e exclusão).

const CHAVE_STORAGE = 'glicocare:registros-glicemia';
const CHAVE_STORAGE_ALIMENTACAO = 'glicocare:registros-alimentacao';
const CHAVE_STORAGE_MEDICAMENTO = 'glicocare:registros-medicamentos';

const ROTULOS_MOMENTO = {
    'jejum': 'Em jejum',
    'antes-refeicao': 'Antes da refeição',
    'depois-refeicao': 'Depois da refeição',
    'antes-dormir': 'Antes de dormir'
};

const TIPOS_REFEICAO = {
    'cafe-manha': {
        rotulo: 'Café da manhã',
        // Xícara de café
        icone: '<path d="M4 9h13a3 3 0 0 1 0 6h-1m-12 0V9m0 6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3M8 3v2M11 3v2M14 3v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'almoco': {
        rotulo: 'Almoço',
        // Garfo e faca
        icone: '<path d="M7 3v18M5 3v6a2 2 0 0 0 4 0V3M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4m0-8v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'lanche': {
        rotulo: 'Lanche',
        // Maçã
        icone: '<path d="M12 7c0-2 1-4 3-4M8 7c-3 0-5 2.5-5 6 0 4 3 8 6 8 1 0 2-.5 3-.5s2 .5 3 .5c3 0 6-4 6-8 0-3.5-2-6-5-6-1.5 0-2.5.5-4 .5S9.5 7 8 7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'jantar': {
        rotulo: 'Jantar',
        // Prato com tampa
        icone: '<path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 7V4M9 4h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'ceia': {
        rotulo: 'Ceia',
        // Lua
        icone: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    }
};

const TIPOS_MEDICAMENTO = {
    'comprimido': {
        rotulo: 'Comprimido',
        // Cápsula de comprimido
        icone: '<path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'insulina': {
        rotulo: 'Insulina',
        // Seringa
        icone: '<path d="M18 2l4 4M17 3l4 4M14 6l4 4M5 21l-3-3M5 21l8-8M16 8L8 16m6-10l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    }
};

const DICAS = {
    baixa: {
        titulo: 'Glicemia baixa — atenção redobrada',
        mensagem: 'Sua glicemia está abaixo do esperado. Siga estas orientações para se recuperar com segurança.',
        alimentacao: [
            'Consuma de imediato 15g de carboidrato de absorção rápida (1 colher de sopa de açúcar, 150ml de suco natural ou 3 balas).',
            'Após 15 minutos, meça novamente. Se ainda estiver baixa, repita a dose.',
            'Quando estabilizar, faça uma refeição leve com carboidratos complexos (pão integral, fruta com aveia).',
            'Evite gorduras logo após a hipoglicemia — elas atrasam a absorção do açúcar.'
        ],
        cuidados: [
            'Sente-se ou deite-se em um local seguro até melhorar; não dirija ou faça esforço físico.',
            'Avise alguém próximo que você está com a glicemia baixa.',
            'Se houver confusão, desmaio ou os sintomas persistirem, procure atendimento médico imediatamente.',
            'Anote o episódio para conversar com seu médico na próxima consulta.'
        ]
    },
    normal: {
        titulo: 'Glicemia dentro do esperado — continue assim!',
        mensagem: 'Excelente! Sua glicemia está em uma faixa saudável. Mantenha os bons hábitos.',
        alimentacao: [
            'Mantenha refeições equilibradas com vegetais, proteínas magras e carboidratos integrais.',
            'Beba bastante água ao longo do dia (em média 2 litros).',
            'Procure comer em horários regulares para evitar picos e quedas de glicose.',
            'Prefira frutas in natura no lugar de sucos ou doces.'
        ],
        cuidados: [
            'Faça atividade física regular, ao menos 30 minutos por dia, 5 vezes na semana.',
            'Continue medindo a glicemia conforme orientação médica para acompanhar a evolução.',
            'Mantenha o sono em dia — dormir bem ajuda no controle da glicose.',
            'Lembre-se de tomar seus medicamentos e insulina nos horários corretos.'
        ]
    },
    alta: {
        titulo: 'Glicemia acima do esperado — vamos cuidar disso',
        mensagem: 'Sua glicemia está alta. Algumas atitudes simples podem ajudar a estabilizar.',
        alimentacao: [
            'Beba água em pequenos goles para ajudar o corpo a eliminar o excesso de glicose.',
            'Evite doces, refrigerantes, sucos açucarados e pães brancos nas próximas refeições.',
            'Prefira saladas, vegetais cozidos, proteínas magras e carboidratos integrais em pequena quantidade.',
            'Não pule refeições — isso pode descontrolar ainda mais a glicemia depois.'
        ],
        cuidados: [
            'Se foi orientado pelo médico, faça uma caminhada leve de 15 a 20 minutos.',
            'Confira se tomou os medicamentos e a insulina conforme a prescrição.',
            'Meça a glicemia novamente em 1 a 2 horas para ver se está reduzindo.',
            'Se os valores continuarem muito altos, com sintomas como sede excessiva, sonolência ou mal-estar, procure atendimento médico.'
        ]
    }
};

document.addEventListener('DOMContentLoaded', function () {
    atualizarAnoRodape();
    inicializarRegistroGlicemia();
    inicializarRegistroAlimentacao();
    inicializarRegistroMedicamento();
    renderizarDicas();

    console.log('%cGlicoCare', 'color: #0d8abc; font-size: 20px; font-weight: bold;');
    console.log('Bem-vindo(a)! O sistema foi carregado com sucesso.');
});

// ===== Utilitários =====
function atualizarAnoRodape() {
    const anoAtual = document.getElementById('ano-atual');
    if (anoAtual) {
        anoAtual.textContent = new Date().getFullYear();
    }
}

function obterDataHoraLocalISO() {
    // Retorna string no formato "YYYY-MM-DDTHH:MM" no fuso local, pronto para <input type="datetime-local">
    const agora = new Date();
    const deslocamento = agora.getTimezoneOffset() * 60000;
    return new Date(agora - deslocamento).toISOString().slice(0, 16);
}

function formatarDataHora(isoString) {
    const data = new Date(isoString);
    if (isNaN(data.getTime())) return isoString;
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function classificarGlicemia(valor) {
    if (valor < 70) return { categoria: 'baixa', etiqueta: 'Baixa' };
    if (valor <= 140) return { categoria: 'normal', etiqueta: 'Normal' };
    return { categoria: 'alta', etiqueta: 'Alta' };
}

// ===== Armazenamento =====
function carregarRegistros() {
    try {
        const dados = localStorage.getItem(CHAVE_STORAGE);
        if (!dados) return [];
        const lista = JSON.parse(dados);
        return Array.isArray(lista) ? lista : [];
    } catch (e) {
        console.error('Não foi possível ler os registros salvos:', e);
        return [];
    }
}

function salvarRegistros(lista) {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(lista));
}

// ===== Inicialização do módulo de glicemia =====
function inicializarRegistroGlicemia() {
    const formulario = document.getElementById('form-glicemia');
    const campoData = document.getElementById('glic-data');
    const campoValor = document.getElementById('glic-valor');
    const campoMomento = document.getElementById('glic-momento');
    const mensagem = document.getElementById('mensagem-form');
    const lista = document.getElementById('lista-historico');

    if (!formulario || !campoData || !campoValor || !campoMomento || !lista) return;

    // Preenche a data/hora atual por padrão
    campoData.value = obterDataHoraLocalISO();

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        tratarEnvio({ campoValor, campoData, campoMomento, mensagem, formulario });
    });

    // Delegação de eventos para botões de excluir
    lista.addEventListener('click', function (evento) {
        const botao = evento.target.closest('.botao-excluir');
        if (!botao) return;
        const id = botao.dataset.id;
        if (id) excluirRegistro(id);
    });

    renderizarHistorico();
}

function tratarEnvio({ campoValor, campoData, campoMomento, mensagem, formulario }) {
    const valorBruto = campoValor.value.trim();

    if (valorBruto === '') {
        exibirMensagem(mensagem, 'Por favor, informe o valor da glicemia.', 'erro');
        campoValor.focus();
        return;
    }

    const valor = Number(valorBruto);
    if (!Number.isFinite(valor) || valor <= 0) {
        exibirMensagem(mensagem, 'O valor da glicemia precisa ser um número maior que zero.', 'erro');
        campoValor.focus();
        return;
    }

    if (valor > 1000) {
        exibirMensagem(mensagem, 'O valor informado parece muito alto. Confira a medição.', 'erro');
        campoValor.focus();
        return;
    }

    const dataHora = campoData.value || obterDataHoraLocalISO();
    const momento = campoMomento.value;

    if (!ROTULOS_MOMENTO[momento]) {
        exibirMensagem(mensagem, 'Escolha um momento da medição válido.', 'erro');
        return;
    }

    const novoRegistro = {
        id: gerarId(),
        valor: Math.round(valor),
        dataHora: dataHora,
        momento: momento,
        criadoEm: new Date().toISOString()
    };

    const registros = carregarRegistros();
    registros.push(novoRegistro);
    salvarRegistros(registros);

    exibirMensagem(mensagem, 'Registro salvo com sucesso!', 'sucesso');
    formulario.reset();
    campoData.value = obterDataHoraLocalISO();
    renderizarHistorico();
    renderizarDicas();

    // Esconde a mensagem de sucesso depois de alguns segundos
    setTimeout(() => limparMensagem(mensagem), 3500);
}

function gerarId() {
    return 'g-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

function exibirMensagem(elemento, texto, tipo) {
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = 'mensagem-form visivel ' + tipo;
}

function limparMensagem(elemento) {
    if (!elemento) return;
    elemento.textContent = '';
    elemento.className = 'mensagem-form';
}

// ===== Renderização do histórico =====
function renderizarHistorico() {
    const lista = document.getElementById('lista-historico');
    const vazio = document.getElementById('historico-vazio');
    const contador = document.getElementById('historico-contador');
    if (!lista || !vazio) return;

    const registros = carregarRegistros();

    // Mais recentes primeiro (ordena pela data/hora informada)
    registros.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    lista.innerHTML = '';

    if (registros.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }

    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = registros.length === 1
            ? '1 registro'
            : `${registros.length} registros`;
    }

    const fragmento = document.createDocumentFragment();
    registros.forEach(registro => {
        fragmento.appendChild(criarItemHistorico(registro));
    });
    lista.appendChild(fragmento);
}

function criarItemHistorico(registro) {
    const { categoria, etiqueta } = classificarGlicemia(registro.valor);

    const item = document.createElement('li');
    item.className = `item-historico ${categoria}`;

    const valor = document.createElement('div');
    valor.className = 'item-valor';
    valor.innerHTML = `${registro.valor}<span class="unidade">mg/dL</span>`;

    const info = document.createElement('div');
    info.className = 'item-info';

    const momento = document.createElement('span');
    momento.className = 'item-momento';
    momento.textContent = ROTULOS_MOMENTO[registro.momento] || 'Momento não informado';

    const data = document.createElement('span');
    data.className = 'item-data';
    data.textContent = formatarDataHora(registro.dataHora);

    info.appendChild(momento);
    info.appendChild(data);

    const tag = document.createElement('span');
    tag.className = `etiqueta ${categoria}`;
    tag.textContent = etiqueta;

    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'botao-excluir';
    excluir.dataset.id = registro.id;
    excluir.setAttribute('aria-label', 'Excluir este registro');
    excluir.title = 'Excluir registro';
    excluir.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    item.appendChild(valor);
    item.appendChild(info);
    item.appendChild(tag);
    item.appendChild(excluir);

    return item;
}

function excluirRegistro(id) {
    if (!confirm('Deseja realmente excluir este registro?')) return;
    const registros = carregarRegistros().filter(r => r.id !== id);
    salvarRegistros(registros);
    renderizarHistorico();
    renderizarDicas();
}

// ===== Alimentação =====
function carregarRefeicoes() {
    try {
        const dados = localStorage.getItem(CHAVE_STORAGE_ALIMENTACAO);
        if (!dados) return [];
        const lista = JSON.parse(dados);
        return Array.isArray(lista) ? lista : [];
    } catch (e) {
        console.error('Não foi possível ler as refeições salvas:', e);
        return [];
    }
}

function salvarRefeicoes(lista) {
    localStorage.setItem(CHAVE_STORAGE_ALIMENTACAO, JSON.stringify(lista));
}

function inicializarRegistroAlimentacao() {
    const formulario = document.getElementById('form-alimentacao');
    const campoTipo = document.getElementById('alim-tipo');
    const campoDescricao = document.getElementById('alim-descricao');
    const campoData = document.getElementById('alim-data');
    const mensagem = document.getElementById('mensagem-alimentacao');
    const lista = document.getElementById('lista-alimentacao');

    if (!formulario || !campoTipo || !campoDescricao || !campoData || !lista) return;

    campoData.value = obterDataHoraLocalISO();

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        tratarEnvioAlimentacao({ campoTipo, campoDescricao, campoData, mensagem, formulario });
    });

    lista.addEventListener('click', function (evento) {
        const botao = evento.target.closest('.botao-excluir');
        if (!botao) return;
        const id = botao.dataset.id;
        if (id) excluirRefeicao(id);
    });

    renderizarRefeicoes();
}

function tratarEnvioAlimentacao({ campoTipo, campoDescricao, campoData, mensagem, formulario }) {
    const descricao = campoDescricao.value.trim();

    if (descricao === '') {
        exibirMensagem(mensagem, 'Por favor, descreva o que você consumiu nesta refeição.', 'erro');
        campoDescricao.focus();
        return;
    }

    if (descricao.length < 3) {
        exibirMensagem(mensagem, 'A descrição está muito curta. Tente detalhar um pouco mais.', 'erro');
        campoDescricao.focus();
        return;
    }

    const tipo = campoTipo.value;
    if (!TIPOS_REFEICAO[tipo]) {
        exibirMensagem(mensagem, 'Escolha um tipo de refeição válido.', 'erro');
        return;
    }

    const novaRefeicao = {
        id: gerarId(),
        tipo: tipo,
        descricao: descricao,
        dataHora: campoData.value || obterDataHoraLocalISO(),
        criadoEm: new Date().toISOString()
    };

    const refeicoes = carregarRefeicoes();
    refeicoes.push(novaRefeicao);
    salvarRefeicoes(refeicoes);

    exibirMensagem(mensagem, 'Refeição salva com sucesso!', 'sucesso');
    formulario.reset();
    campoData.value = obterDataHoraLocalISO();
    renderizarRefeicoes();

    setTimeout(() => limparMensagem(mensagem), 3500);
}

function renderizarRefeicoes() {
    const lista = document.getElementById('lista-alimentacao');
    const vazio = document.getElementById('alimentacao-vazio');
    const contador = document.getElementById('alimentacao-contador');
    if (!lista || !vazio) return;

    const refeicoes = carregarRefeicoes();
    refeicoes.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    lista.innerHTML = '';

    if (refeicoes.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }

    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = refeicoes.length === 1
            ? '1 refeição'
            : `${refeicoes.length} refeições`;
    }

    const fragmento = document.createDocumentFragment();
    refeicoes.forEach(refeicao => {
        fragmento.appendChild(criarItemRefeicao(refeicao));
    });
    lista.appendChild(fragmento);
}

function criarItemRefeicao(refeicao) {
    const config = TIPOS_REFEICAO[refeicao.tipo] || { rotulo: 'Refeição', icone: '' };

    const item = document.createElement('li');
    item.className = 'item-refeicao';

    const icone = document.createElement('div');
    icone.className = 'refeicao-icone';
    icone.setAttribute('aria-hidden', 'true');
    icone.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${config.icone}</svg>`;

    const info = document.createElement('div');
    info.className = 'refeicao-info';

    const tipo = document.createElement('span');
    tipo.className = 'refeicao-tipo';
    tipo.textContent = config.rotulo;

    const descricao = document.createElement('span');
    descricao.className = 'refeicao-descricao';
    descricao.textContent = refeicao.descricao;

    const data = document.createElement('span');
    data.className = 'refeicao-data';
    data.textContent = formatarDataHora(refeicao.dataHora);

    info.appendChild(tipo);
    info.appendChild(descricao);
    info.appendChild(data);

    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'botao-excluir';
    excluir.dataset.id = refeicao.id;
    excluir.setAttribute('aria-label', 'Excluir esta refeição');
    excluir.title = 'Excluir refeição';
    excluir.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    item.appendChild(icone);
    item.appendChild(info);
    item.appendChild(excluir);

    return item;
}

function excluirRefeicao(id) {
    if (!confirm('Deseja realmente excluir esta refeição?')) return;
    const refeicoes = carregarRefeicoes().filter(r => r.id !== id);
    salvarRefeicoes(refeicoes);
    renderizarRefeicoes();
}

// ===== Medicamentos / Insulina =====
function carregarMedicamentos() {
    try {
        const dados = localStorage.getItem(CHAVE_STORAGE_MEDICAMENTO);
        if (!dados) return [];
        const lista = JSON.parse(dados);
        return Array.isArray(lista) ? lista : [];
    } catch (e) {
        console.error('Não foi possível ler os medicamentos salvos:', e);
        return [];
    }
}

function salvarMedicamentos(lista) {
    localStorage.setItem(CHAVE_STORAGE_MEDICAMENTO, JSON.stringify(lista));
}

function inicializarRegistroMedicamento() {
    const formulario = document.getElementById('form-medicamento');
    const campoTipo = document.getElementById('med-tipo');
    const campoNome = document.getElementById('med-nome');
    const campoDose = document.getElementById('med-dose');
    const campoData = document.getElementById('med-data');
    const mensagem = document.getElementById('mensagem-medicamento');
    const lista = document.getElementById('lista-medicamento');

    if (!formulario || !campoTipo || !campoNome || !campoDose || !campoData || !lista) return;

    campoData.value = obterDataHoraLocalISO();

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        tratarEnvioMedicamento({ campoTipo, campoNome, campoDose, campoData, mensagem, formulario });
    });

    lista.addEventListener('click', function (evento) {
        const botao = evento.target.closest('.botao-excluir');
        if (!botao) return;
        const id = botao.dataset.id;
        if (id) excluirMedicamento(id);
    });

    renderizarMedicamentos();
}

function tratarEnvioMedicamento({ campoTipo, campoNome, campoDose, campoData, mensagem, formulario }) {
    const nome = campoNome.value.trim();
    const dose = campoDose.value.trim();

    if (nome === '') {
        exibirMensagem(mensagem, 'Por favor, informe o nome do medicamento.', 'erro');
        campoNome.focus();
        return;
    }

    if (dose === '') {
        exibirMensagem(mensagem, 'Por favor, informe a dose do medicamento.', 'erro');
        campoDose.focus();
        return;
    }

    const tipo = campoTipo.value;
    if (!TIPOS_MEDICAMENTO[tipo]) {
        exibirMensagem(mensagem, 'Escolha um tipo de medicamento válido.', 'erro');
        return;
    }

    const novoMedicamento = {
        id: gerarId(),
        tipo: tipo,
        nome: nome,
        dose: dose,
        dataHora: campoData.value || obterDataHoraLocalISO(),
        criadoEm: new Date().toISOString()
    };

    const medicamentos = carregarMedicamentos();
    medicamentos.push(novoMedicamento);
    salvarMedicamentos(medicamentos);

    exibirMensagem(mensagem, 'Medicamento salvo com sucesso!', 'sucesso');
    formulario.reset();
    campoData.value = obterDataHoraLocalISO();
    renderizarMedicamentos();

    setTimeout(() => limparMensagem(mensagem), 3500);
}

function renderizarMedicamentos() {
    const lista = document.getElementById('lista-medicamento');
    const vazio = document.getElementById('medicamento-vazio');
    const contador = document.getElementById('medicamento-contador');
    if (!lista || !vazio) return;

    const medicamentos = carregarMedicamentos();
    medicamentos.sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));

    lista.innerHTML = '';

    if (medicamentos.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }

    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = medicamentos.length === 1
            ? '1 medicamento'
            : `${medicamentos.length} medicamentos`;
    }

    const fragmento = document.createDocumentFragment();
    medicamentos.forEach(med => {
        fragmento.appendChild(criarItemMedicamento(med));
    });
    lista.appendChild(fragmento);
}

function criarItemMedicamento(medicamento) {
    const config = TIPOS_MEDICAMENTO[medicamento.tipo] || { rotulo: 'Medicamento', icone: '' };
    const tipoClasse = medicamento.tipo;

    const item = document.createElement('li');
    item.className = `item-medicamento ${tipoClasse}`;

    const icone = document.createElement('div');
    icone.className = `medicamento-icone ${tipoClasse}`;
    icone.setAttribute('aria-hidden', 'true');
    icone.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${config.icone}</svg>`;

    const info = document.createElement('div');
    info.className = 'medicamento-info';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'medicamento-cabecalho';

    const nome = document.createElement('span');
    nome.className = 'medicamento-nome';
    nome.textContent = medicamento.nome;

    const tag = document.createElement('span');
    tag.className = `medicamento-tipo ${tipoClasse}`;
    tag.textContent = config.rotulo;

    cabecalho.appendChild(nome);
    cabecalho.appendChild(tag);

    const dose = document.createElement('span');
    dose.className = 'medicamento-dose';
    dose.textContent = `Dose: ${medicamento.dose}`;

    const data = document.createElement('span');
    data.className = 'medicamento-data';
    data.textContent = formatarDataHora(medicamento.dataHora);

    info.appendChild(cabecalho);
    info.appendChild(dose);
    info.appendChild(data);

    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'botao-excluir';
    excluir.dataset.id = medicamento.id;
    excluir.setAttribute('aria-label', 'Excluir este medicamento');
    excluir.title = 'Excluir medicamento';
    excluir.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    item.appendChild(icone);
    item.appendChild(info);
    item.appendChild(excluir);

    return item;
}

function excluirMedicamento(id) {
    if (!confirm('Deseja realmente excluir este medicamento?')) return;
    const medicamentos = carregarMedicamentos().filter(m => m.id !== id);
    salvarMedicamentos(medicamentos);
    renderizarMedicamentos();
}

// ===== Dicas =====
function obterUltimaGlicemia() {
    const registros = carregarRegistros();
    if (registros.length === 0) return null;
    // Considera o registro mais recente pela data/hora da medição
    return registros.reduce((maisRecente, atual) => {
        return new Date(atual.dataHora) > new Date(maisRecente.dataHora) ? atual : maisRecente;
    });
}

function renderizarDicas() {
    const resumo = document.getElementById('dicas-resumo');
    const conteudo = document.getElementById('dicas-conteudo');
    if (!resumo || !conteudo) return;

    const ultima = obterUltimaGlicemia();

    if (!ultima) {
        resumo.className = 'dicas-resumo sem-registro';
        resumo.innerHTML = `
            <div class="dicas-resumo-texto">
                <h4>Ainda não há medições registradas</h4>
                <p>Registre sua primeira medição de glicemia na seção acima para receber dicas personalizadas para o seu momento.</p>
            </div>
        `;
        conteudo.innerHTML = `
            <div class="dicas-vazio">
                Assim que você cadastrar uma medição, suas dicas aparecerão aqui automaticamente.
            </div>
        `;
        return;
    }

    const { categoria, etiqueta } = classificarGlicemia(ultima.valor);
    const dicas = DICAS[categoria];

    resumo.className = `dicas-resumo ${categoria}`;
    resumo.innerHTML = `
        <div class="dicas-resumo-valor">
            ${ultima.valor}
            <small>mg/dL</small>
        </div>
        <div class="dicas-resumo-texto">
            <h4>${dicas.titulo} <span class="etiqueta ${categoria}">${etiqueta}</span></h4>
            <p>${dicas.mensagem}</p>
            <p style="margin-top:4px; font-size:0.85rem; color:var(--texto-claro);">
                Última medição: ${formatarDataHora(ultima.dataHora)} · ${ROTULOS_MOMENTO[ultima.momento] || ''}
            </p>
        </div>
    `;

    conteudo.innerHTML = '';

    const grupoAlimentacao = criarGrupoDicas('Alimentação', dicas.alimentacao, `
        <path d="M7 3v18M5 3v6a2 2 0 0 0 4 0V3M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4m0-8v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    `);

    const grupoCuidados = criarGrupoDicas('Cuidados gerais', dicas.cuidados, `
        <path d="M12 2a7 7 0 00-4 12.7V17a2 2 0 002 2h4a2 2 0 002-2v-2.3A7 7 0 0012 2zM10 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    `);

    conteudo.appendChild(grupoAlimentacao);
    conteudo.appendChild(grupoCuidados);
}

function criarGrupoDicas(titulo, listaDicas, svgInterno) {
    const grupo = document.createElement('div');
    grupo.className = 'dicas-grupo';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'dicas-grupo-titulo';
    cabecalho.innerHTML = `
        <div class="icone-grupo" aria-hidden="true">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${svgInterno}</svg>
        </div>
        <span>${titulo}</span>
    `;

    const lista = document.createElement('ul');
    lista.className = 'dicas-lista';
    listaDicas.forEach(textoDica => {
        const item = document.createElement('li');
        item.innerHTML = `<span>${textoDica}</span>`;
        lista.appendChild(item);
    });

    grupo.appendChild(cabecalho);
    grupo.appendChild(lista);
    return grupo;
}
