// GlicoCare - Script principal
// Camada de dados: Supabase (autenticação + tabelas glicemia, alimentacao, medicamentos, profiles).

const ROTULOS_MOMENTO = {
    'jejum': 'Em jejum',
    'antes-refeicao': 'Antes da refeição',
    'depois-refeicao': 'Depois da refeição',
    'antes-dormir': 'Antes de dormir'
};

const TIPOS_REFEICAO = {
    'cafe-manha': {
        rotulo: 'Café da manhã',
        icone: '<path d="M4 9h13a3 3 0 0 1 0 6h-1m-12 0V9m0 6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3M8 3v2M11 3v2M14 3v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'almoco': {
        rotulo: 'Almoço',
        icone: '<path d="M7 3v18M5 3v6a2 2 0 0 0 4 0V3M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4m0-8v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'lanche': {
        rotulo: 'Lanche',
        icone: '<path d="M12 7c0-2 1-4 3-4M8 7c-3 0-5 2.5-5 6 0 4 3 8 6 8 1 0 2-.5 3-.5s2 .5 3 .5c3 0 6-4 6-8 0-3.5-2-6-5-6-1.5 0-2.5.5-4 .5S9.5 7 8 7z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'jantar': {
        rotulo: 'Jantar',
        icone: '<path d="M3 18h18M5 18a7 7 0 0 1 14 0M12 7V4M9 4h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'ceia': {
        rotulo: 'Ceia',
        icone: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    }
};

const TIPOS_MEDICAMENTO = {
    'comprimido': {
        rotulo: 'Comprimido',
        icone: '<path d="M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7zM8.5 8.5l7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    },
    'insulina': {
        rotulo: 'Insulina',
        icone: '<path d="M18 2l4 4M17 3l4 4M14 6l4 4M5 21l-3-3M5 21l8-8M16 8L8 16m6-10l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
    }
};

const DICAS = {
    baixa: {
        titulo: 'Glicemia baixa — atenção redobrada',
        mensagem: 'Sua glicemia está abaixo do esperado. Estas sugestões ajudam você a se recuperar com segurança.',
        alimentos_imediatos: [
            '1 colher de sopa de mel puro',
            '150 ml de suco de laranja natural sem açúcar adicionado',
            '3 a 4 balas mastigáveis de fruta (não diet)',
            '1 colher de sopa de açúcar dissolvida em meio copo de água',
            '1 copo pequeno (150 ml) de refrigerante comum, NÃO diet',
            '4 tabletes de glicose ou 1 sachê de gel de glicose, se tiver em casa',
            '1 banana média madura, comida devagar',
            '1 copo de leite com 1 colher de chocolate em pó',
            '1 fatia de pão branco com 1 colher de chá de geleia comum',
            '1 caixinha pequena (200 ml) de suco de uva integral'
        ],
        cuidados: [
            'Sente-se ou deite-se em um local seguro até melhorar',
            'Não dirija e evite esforço físico até a glicemia voltar ao normal',
            'Meça novamente em 15 minutos para confirmar a recuperação',
            'Se ainda estiver baixa após 15 minutos, repita a dose de carboidrato rápido',
            'Avise alguém próximo que você está com hipoglicemia',
            'Depois de estabilizar, faça uma refeição leve com carboidrato complexo (pão integral, fruta com aveia, biscoito de água e sal)',
            'Evite gorduras logo na primeira dose — elas atrasam a absorção do açúcar',
            'Anote o episódio (horário, valor e o que comeu) para conversar com seu médico',
            'Se sentir confusão, fala arrastada ou sonolência intensa, peça ajuda imediatamente',
            'Tenha sempre uma fonte de açúcar rápido por perto (na bolsa, no carro, no escritório)'
        ]
    },
    normal: {
        titulo: 'Glicemia dentro do esperado — continue assim!',
        mensagem: 'Excelente! Sua glicemia está em uma faixa saudável. Aqui vão algumas ideias para manter o bom ritmo.',
        sugestoes_refeicao: [
            'Café da manhã: 2 fatias de pão integral com queijo branco + 1 ovo mexido + café sem açúcar',
            'Café da manhã: 1 tigela de iogurte natural sem açúcar com 2 colheres de aveia, meia banana picada e canela',
            'Café da manhã: 1 tapioca pequena recheada com queijo branco e ovo mexido + chá sem açúcar',
            'Café da manhã: 1 fatia de pão de centeio com pasta de abacate + 1 fatia de peito de peru + 1 fruta',
            'Almoço: 4 colheres de arroz integral + 1 concha pequena de feijão + 1 filé de frango grelhado + salada de folhas verdes com tomate',
            'Almoço: 1 batata-doce média assada + filé de peixe grelhado + brócolis no vapor + salada de pepino com azeite',
            'Almoço: salada completa com folhas, tomate, cenoura ralada, ovo cozido, atum e azeite + 2 colheres de quinoa',
            'Almoço: 3 colheres de arroz integral + lentilha cozida + cubos de tofu grelhado + abobrinha refogada',
            'Lanche da tarde: 1 maçã com 1 colher de sopa de pasta de amendoim sem açúcar',
            'Lanche da tarde: 1 iogurte natural sem açúcar com 1 colher de chia e meia banana',
            'Lanche da tarde: 2 castanhas-do-pará + 5 amêndoas + 1 fruta da estação',
            'Lanche da tarde: 1 fatia de pão integral com requeijão light + chá de hortelã sem açúcar',
            'Jantar: omelete com 2 ovos, queijo branco e espinafre + salada de alface e tomate',
            'Jantar: sopa de legumes (cenoura, abobrinha, chuchu) com pedaços de frango desfiado + 1 fatia de pão integral',
            'Jantar: wrap de pão sírio integral com peito de frango desfiado, alface, tomate e iogurte natural',
            'Ceia: 1 copo de leite morno sem açúcar + 1 fatia fina de pão integral com queijo branco',
            'Ceia: 1 iogurte natural sem açúcar com 1 colher de aveia e canela'
        ],
        cuidados: [
            'Beba água ao longo do dia — em torno de 2 litros, em pequenos goles',
            'Procure se movimentar ao menos 30 minutos por dia: caminhada, dança ou alongamento',
            'Mantenha horários regulares para as refeições; evite pular o café da manhã',
            'Durma de 7 a 8 horas por noite — sono ruim atrapalha o controle da glicemia',
            'Prefira frutas in natura no lugar de sucos, mesmo os naturais',
            'Inclua proteínas magras em cada refeição principal (ovo, frango, peixe, leguminosas)',
            'Use temperos naturais (alho, cebola, manjericão, orégano) em vez de caldos prontos',
            'Continue medindo a glicemia conforme orientação médica para acompanhar a evolução',
            'Lembre-se de tomar os medicamentos e a insulina nos horários prescritos',
            'Faça pausas durante o dia para respirar fundo — o estresse também afeta a glicemia'
        ]
    },
    alta: {
        titulo: 'Glicemia acima do esperado — vamos cuidar disso',
        mensagem: 'Sua glicemia está alta. Veja o que evitar, o que preferir e algumas atitudes que ajudam a estabilizar.',
        evitar: [
            'Refrigerantes, sucos de caixinha e bebidas adoçadas',
            'Pão branco, biscoitos doces, bolos e doces em geral',
            'Frituras e alimentos muito gordurosos nas próximas refeições',
            'Massas brancas em grande quantidade (macarrão, lasanha, nhoque)',
            'Açúcar, mel e adoçantes calóricos ao preparar bebidas',
            'Molhos prontos (ketchup, barbecue, agridoce) que escondem muito açúcar',
            'Cereais matinais açucarados e granolas com xarope',
            'Sucos detox e shakes prontos — costumam ter muito carboidrato simples',
            'Arroz branco em porções grandes — substitua por porções menores de integral',
            'Frutas muito doces e maduras em grande quantidade (manga, uva, banana bem madura)'
        ],
        preferir: [
            'Água, água com limão ou chá sem açúcar',
            'Pão integral, de centeio ou multigrãos com sementes no lugar do pão branco',
            'Frutas com casca como maçã, pera e ameixa, em pequena quantidade',
            'Vegetais folhosos (alface, rúcula, agrião, couve) à vontade no prato',
            'Proteínas magras: peito de frango, peixe assado, ovo cozido ou tofu',
            'Carboidratos integrais em pequena porção (arroz integral, quinoa, batata-doce)',
            'Gorduras boas em pouca quantidade: azeite extravirgem, abacate, castanhas',
            'Chás naturais como camomila, hortelã ou hibisco, sem açúcar',
            'Leguminosas (feijão, lentilha, grão-de-bico) — ajudam a controlar a glicose',
            'Iogurte natural sem açúcar com sementes de chia ou linhaça'
        ],
        cuidados: [
            'Beba água em pequenos goles ao longo da próxima hora',
            'Se foi liberado pelo médico, faça uma caminhada leve de 15 a 20 minutos',
            'Confira se tomou o medicamento ou a insulina no horário correto',
            'Meça a glicemia novamente em 1 a 2 horas para acompanhar a evolução',
            'Evite refeições muito grandes nas próximas horas; prefira porções menores',
            'Procure descansar e reduzir o estresse — ele também eleva a glicemia',
            'Anote o que comeu antes da medição para conversar com seu médico',
            'Se aparecerem sintomas como sede excessiva, sonolência, visão turva ou náusea, procure atendimento médico',
            'Não pule a próxima refeição, mas faça-a leve e balanceada',
            'Evite bebidas alcoólicas até a glicemia voltar ao normal'
        ]
    }
};

// Cores por categoria (usadas no gráfico e no PDF)
const CORES_CATEGORIA = {
    baixa: '#e74c3c',
    normal: '#2bb673',
    alta: '#e67e22'
};

// Estado da sessão
let usuarioAtual = null;
let perfilUsuario = null;

// Estado da Evolução
let graficoGlicemia = null;
let periodoEvolucao = 'semana';
let dadosEvolucaoAtuais = [];

// Estado dos Alertas
let alertasCache = [];
let timerAlertas = null;
const alertasJaDisparados = new Set();   // chave: alertaId-YYYYMMDD-HHMM
let modalAlertaAberto = false;
let snoozeTimeouts = [];                 // setTimeouts pendentes para o "Adiar 10 min"

const DIAS_SEMANA_KEYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']; // ordem getDay()
const DIAS_ROTULO_CURTO = { seg: 'Seg', ter: 'Ter', qua: 'Qua', qui: 'Qui', sex: 'Sex', sab: 'Sáb', dom: 'Dom' };
const DIAS_ORDEM_EXIBICAO = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];

document.addEventListener('DOMContentLoaded', async function () {
    atualizarAnoRodape();
    inicializarTelasAuth();
    inicializarBotaoSair();
    inicializarRegistroGlicemia();
    inicializarRegistroAlimentacao();
    inicializarRegistroMedicamento();
    inicializarEvolucao();
    inicializarAlertasMedicacao();
    inicializarModalAlerta();

    await checarSessao();

    console.log('%cGlicoCare', 'color: #0d8abc; font-size: 20px; font-weight: bold;');
});

// ===== Utilitários =====
function atualizarAnoRodape() {
    const anoAtual = document.getElementById('ano-atual');
    if (anoAtual) anoAtual.textContent = new Date().getFullYear();
}

function obterDataHoraLocalISO() {
    const agora = new Date();
    const deslocamento = agora.getTimezoneOffset() * 60000;
    return new Date(agora - deslocamento).toISOString().slice(0, 16);
}

function localParaISO(valorLocal) {
    // Converte "YYYY-MM-DDTHH:MM" (hora local) em ISO completo UTC
    return new Date(valorLocal).toISOString();
}

function formatarDataHora(isoString) {
    const data = new Date(isoString);
    if (isNaN(data.getTime())) return isoString;
    return data.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

function classificarGlicemia(valor) {
    const v = Number(valor);
    if (v < 70) return { categoria: 'baixa', etiqueta: 'Baixa' };
    if (v <= 140) return { categoria: 'normal', etiqueta: 'Normal' };
    return { categoria: 'alta', etiqueta: 'Alta' };
}

// Sorteia n itens aleatórios de um array (sem repetição). Fisher-Yates shuffle parcial.
function sortear(array, n) {
    if (!Array.isArray(array) || array.length === 0) return [];
    const copia = array.slice();
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copia[i], copia[j]] = [copia[j], copia[i]];
    }
    return copia.slice(0, Math.min(n, copia.length));
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

function traduzirErroSupabase(error, contexto) {
    if (!error) return 'Não foi possível concluir a operação. Tente novamente.';
    const msg = (error.message || '').toLowerCase();

    if (contexto === 'login') {
        if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
            return 'E-mail ou senha incorretos. Verifique e tente novamente.';
        }
        if (msg.includes('email not confirmed')) {
            return 'Confirme seu e-mail antes de entrar.';
        }
    }
    if (contexto === 'cadastro') {
        if (msg.includes('already registered') || msg.includes('user already')) {
            return 'Este e-mail já está cadastrado. Tente fazer login.';
        }
        if (msg.includes('password') && msg.includes('6')) {
            return 'A senha precisa ter no mínimo 6 caracteres.';
        }
        if (msg.includes('valid email') || msg.includes('invalid email')) {
            return 'Informe um e-mail válido.';
        }
    }
    return error.message || 'Erro inesperado. Tente novamente.';
}

// ===== Autenticação =====
function inicializarTelasAuth() {
    const btnIrLogin = document.getElementById('ir-login');
    const btnIrCadastro = document.getElementById('ir-cadastro');
    const formLogin = document.getElementById('auth-login');
    const formCadastro = document.getElementById('auth-cadastro');

    if (btnIrLogin) btnIrLogin.addEventListener('click', () => mostrarTelaAuth('login'));
    if (btnIrCadastro) btnIrCadastro.addEventListener('click', () => mostrarTelaAuth('cadastro'));

    document.querySelectorAll('[data-voltar]').forEach(b => {
        b.addEventListener('click', () => mostrarTelaAuth('bem-vindo'));
    });

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const senha = document.getElementById('login-senha').value;
            const mensagem = document.getElementById('mensagem-login');

            if (!email || !senha) {
                exibirMensagem(mensagem, 'Preencha e-mail e senha.', 'erro');
                return;
            }

            exibirMensagem(mensagem, 'Entrando...', 'sucesso');
            const { data, error } = await window.supabaseClient.auth.signInWithPassword({ email, password: senha });
            if (error) {
                exibirMensagem(mensagem, traduzirErroSupabase(error, 'login'), 'erro');
                return;
            }
            limparMensagem(mensagem);
            await aposLoginBemSucedido(data.user);
        });
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nome = document.getElementById('cad-nome').value.trim();
            const email = document.getElementById('cad-email').value.trim();
            const senha = document.getElementById('cad-senha').value;
            const mensagem = document.getElementById('mensagem-cadastro');

            if (!nome) { exibirMensagem(mensagem, 'Informe seu nome.', 'erro'); return; }
            if (!email) { exibirMensagem(mensagem, 'Informe um e-mail.', 'erro'); return; }
            if (!senha || senha.length < 6) {
                exibirMensagem(mensagem, 'A senha precisa ter no mínimo 6 caracteres.', 'erro');
                return;
            }

            exibirMensagem(mensagem, 'Criando sua conta...', 'sucesso');
            const { data, error } = await window.supabaseClient.auth.signUp({
                email, password: senha,
                options: { data: { nome } }
            });
            if (error) {
                exibirMensagem(mensagem, traduzirErroSupabase(error, 'cadastro'), 'erro');
                return;
            }

            // Se a confirmação de e-mail estiver desativada, já temos sessão.
            if (data.session) {
                // Criar o perfil
                await window.supabaseClient.from('profiles').insert({
                    user_id: data.user.id,
                    nome: nome,
                    email: email
                });
                limparMensagem(mensagem);
                await aposLoginBemSucedido(data.user);
            } else {
                exibirMensagem(mensagem, 'Conta criada! Faça login para entrar.', 'sucesso');
                setTimeout(() => mostrarTelaAuth('login'), 1500);
            }
        });
    }
}

function inicializarBotaoSair() {
    const btn = document.getElementById('botao-sair');
    if (!btn) return;
    btn.addEventListener('click', async () => {
        if (!confirm('Deseja realmente sair da sua conta?')) return;
        await window.supabaseClient.auth.signOut();
        usuarioAtual = null;
        perfilUsuario = null;
        dadosEvolucaoAtuais = [];
        if (graficoGlicemia) { graficoGlicemia.destroy(); graficoGlicemia = null; }
        pararTimerAlertas();
        alertasCache = [];
        alertasJaDisparados.clear();
        fecharModalAlerta();
        document.body.classList.remove('autenticado');
        mostrarTelaAuth('bem-vindo');
    });
}

function mostrarTelaAuth(qual) {
    const bemVindo = document.getElementById('auth-bem-vindo');
    const login = document.getElementById('auth-login');
    const cadastro = document.getElementById('auth-cadastro');
    [bemVindo, login, cadastro].forEach(el => { if (el) el.hidden = true; });
    if (qual === 'login' && login) login.hidden = false;
    else if (qual === 'cadastro' && cadastro) cadastro.hidden = false;
    else if (bemVindo) bemVindo.hidden = false;

    // Limpa mensagens ao trocar
    ['mensagem-login', 'mensagem-cadastro'].forEach(id => limparMensagem(document.getElementById(id)));
}

async function checarSessao() {
    const { data: { session } } = await window.supabaseClient.auth.getSession();
    if (session && session.user) {
        await aposLoginBemSucedido(session.user);
    } else {
        document.body.classList.remove('autenticado');
        mostrarTelaAuth('bem-vindo');
    }
}

async function aposLoginBemSucedido(usuario) {
    usuarioAtual = usuario;
    perfilUsuario = await carregarPerfil(usuario.id);

    // Se não existir perfil ainda (signUp anterior sem profile), cria um
    if (!perfilUsuario) {
        const nomeFallback = usuario.user_metadata?.nome || (usuario.email || '').split('@')[0] || 'Usuário';
        await window.supabaseClient.from('profiles').insert({
            user_id: usuario.id, nome: nomeFallback, email: usuario.email
        });
        perfilUsuario = await carregarPerfil(usuario.id);
    }

    const nomeEl = document.getElementById('usuario-nome');
    if (nomeEl) nomeEl.textContent = perfilUsuario?.nome || 'Usuário';

    document.body.classList.add('autenticado');

    // Carrega tudo
    await Promise.all([
        renderizarHistorico(),
        renderizarRefeicoes(),
        renderizarMedicamentos(),
        renderizarAlertas()
    ]);
    await renderizarDicas();
    await renderizarEvolucao();

    atualizarBannerPermissao();
    iniciarTimerAlertas();
}

async function carregarPerfil(userId) {
    const { data, error } = await window.supabaseClient
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
    if (error) {
        console.warn('Não foi possível carregar perfil:', error.message);
        return null;
    }
    return data;
}

// ===== Glicemia =====
function inicializarRegistroGlicemia() {
    const formulario = document.getElementById('form-glicemia');
    const campoData = document.getElementById('glic-data');
    if (!formulario || !campoData) return;

    campoData.value = obterDataHoraLocalISO();

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        await tratarEnvioGlicemia();
    });

    document.getElementById('lista-historico').addEventListener('click', async (e) => {
        const botao = e.target.closest('.botao-excluir');
        if (!botao) return;
        const id = botao.dataset.id;
        if (id) await excluirRegistro(id);
    });
}

async function tratarEnvioGlicemia() {
    const campoValor = document.getElementById('glic-valor');
    const campoData = document.getElementById('glic-data');
    const campoMomento = document.getElementById('glic-momento');
    const mensagem = document.getElementById('mensagem-form');
    const formulario = document.getElementById('form-glicemia');

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
    const momento = campoMomento.value;
    if (!ROTULOS_MOMENTO[momento]) {
        exibirMensagem(mensagem, 'Escolha um momento da medição válido.', 'erro');
        return;
    }

    const dataHora = localParaISO(campoData.value || obterDataHoraLocalISO());

    if (!usuarioAtual) {
        exibirMensagem(mensagem, 'Sessão expirada. Faça login novamente.', 'erro');
        return;
    }

    const { error } = await window.supabaseClient.from('glicemia').insert({
        user_id: usuarioAtual.id,
        valor: Math.round(valor),
        momento: momento,
        data_hora: dataHora
    });

    if (error) {
        exibirMensagem(mensagem, 'Não foi possível salvar: ' + error.message, 'erro');
        return;
    }

    exibirMensagem(mensagem, 'Registro salvo com sucesso!', 'sucesso');
    formulario.reset();
    campoData.value = obterDataHoraLocalISO();
    await renderizarHistorico();
    await renderizarDicas();
    await renderizarEvolucao();
    setTimeout(() => limparMensagem(mensagem), 3500);
}

async function carregarRegistros() {
    if (!usuarioAtual) return [];
    const { data, error } = await window.supabaseClient
        .from('glicemia')
        .select('*')
        .order('data_hora', { ascending: false });
    if (error) {
        console.error('Erro ao carregar glicemia:', error);
        return [];
    }
    return data || [];
}

async function renderizarHistorico() {
    const lista = document.getElementById('lista-historico');
    const vazio = document.getElementById('historico-vazio');
    const contador = document.getElementById('historico-contador');
    if (!lista || !vazio) return;

    const registros = await carregarRegistros();
    lista.innerHTML = '';

    if (registros.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }

    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = registros.length === 1 ? '1 registro' : `${registros.length} registros`;
    }

    const fragmento = document.createDocumentFragment();
    registros.forEach(r => fragmento.appendChild(criarItemHistorico(r)));
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
    data.textContent = formatarDataHora(registro.data_hora);

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

async function excluirRegistro(id) {
    if (!confirm('Deseja realmente excluir este registro?')) return;
    const { error } = await window.supabaseClient.from('glicemia').delete().eq('id', id);
    if (error) {
        alert('Não foi possível excluir: ' + error.message);
        return;
    }
    await renderizarHistorico();
    await renderizarDicas();
    await renderizarEvolucao();
}

// ===== Alimentação =====
function inicializarRegistroAlimentacao() {
    const formulario = document.getElementById('form-alimentacao');
    const campoData = document.getElementById('alim-data');
    if (!formulario || !campoData) return;

    campoData.value = obterDataHoraLocalISO();

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        await tratarEnvioAlimentacao();
    });

    document.getElementById('lista-alimentacao').addEventListener('click', async (e) => {
        const botao = e.target.closest('.botao-excluir');
        if (!botao) return;
        const id = botao.dataset.id;
        if (id) await excluirRefeicao(id);
    });
}

async function tratarEnvioAlimentacao() {
    const campoTipo = document.getElementById('alim-tipo');
    const campoDescricao = document.getElementById('alim-descricao');
    const campoData = document.getElementById('alim-data');
    const mensagem = document.getElementById('mensagem-alimentacao');
    const formulario = document.getElementById('form-alimentacao');

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
    if (!usuarioAtual) {
        exibirMensagem(mensagem, 'Sessão expirada. Faça login novamente.', 'erro');
        return;
    }

    const dataHora = localParaISO(campoData.value || obterDataHoraLocalISO());

    const { error } = await window.supabaseClient.from('alimentacao').insert({
        user_id: usuarioAtual.id,
        tipo: tipo,
        descricao: descricao,
        data_hora: dataHora
    });

    if (error) {
        exibirMensagem(mensagem, 'Não foi possível salvar: ' + error.message, 'erro');
        return;
    }

    exibirMensagem(mensagem, 'Refeição salva com sucesso!', 'sucesso');
    formulario.reset();
    campoData.value = obterDataHoraLocalISO();
    await renderizarRefeicoes();
    setTimeout(() => limparMensagem(mensagem), 3500);
}

async function carregarRefeicoes() {
    if (!usuarioAtual) return [];
    const { data, error } = await window.supabaseClient
        .from('alimentacao')
        .select('*')
        .order('data_hora', { ascending: false });
    if (error) {
        console.error('Erro ao carregar refeições:', error);
        return [];
    }
    return data || [];
}

async function renderizarRefeicoes() {
    const lista = document.getElementById('lista-alimentacao');
    const vazio = document.getElementById('alimentacao-vazio');
    const contador = document.getElementById('alimentacao-contador');
    if (!lista || !vazio) return;

    const refeicoes = await carregarRefeicoes();
    lista.innerHTML = '';

    if (refeicoes.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }

    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = refeicoes.length === 1 ? '1 refeição' : `${refeicoes.length} refeições`;
    }

    const fragmento = document.createDocumentFragment();
    refeicoes.forEach(r => fragmento.appendChild(criarItemRefeicao(r)));
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
    data.textContent = formatarDataHora(refeicao.data_hora);

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

async function excluirRefeicao(id) {
    if (!confirm('Deseja realmente excluir esta refeição?')) return;
    const { error } = await window.supabaseClient.from('alimentacao').delete().eq('id', id);
    if (error) {
        alert('Não foi possível excluir: ' + error.message);
        return;
    }
    await renderizarRefeicoes();
}

// ===== Medicamentos / Insulina =====
function inicializarRegistroMedicamento() {
    const formulario = document.getElementById('form-medicamento');
    const campoData = document.getElementById('med-data');
    if (!formulario || !campoData) return;

    campoData.value = obterDataHoraLocalISO();

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        await tratarEnvioMedicamento();
    });

    document.getElementById('lista-medicamento').addEventListener('click', async (e) => {
        const botao = e.target.closest('.botao-excluir');
        if (!botao) return;
        const id = botao.dataset.id;
        if (id) await excluirMedicamento(id);
    });
}

async function tratarEnvioMedicamento() {
    const campoTipo = document.getElementById('med-tipo');
    const campoNome = document.getElementById('med-nome');
    const campoDose = document.getElementById('med-dose');
    const campoData = document.getElementById('med-data');
    const mensagem = document.getElementById('mensagem-medicamento');
    const formulario = document.getElementById('form-medicamento');

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
    if (!usuarioAtual) {
        exibirMensagem(mensagem, 'Sessão expirada. Faça login novamente.', 'erro');
        return;
    }

    const dataHora = localParaISO(campoData.value || obterDataHoraLocalISO());

    const { error } = await window.supabaseClient.from('medicamentos').insert({
        user_id: usuarioAtual.id,
        tipo: tipo,
        nome: nome,
        dose: dose,
        data_hora: dataHora
    });

    if (error) {
        exibirMensagem(mensagem, 'Não foi possível salvar: ' + error.message, 'erro');
        return;
    }

    exibirMensagem(mensagem, 'Medicamento salvo com sucesso!', 'sucesso');
    formulario.reset();
    campoData.value = obterDataHoraLocalISO();
    await renderizarMedicamentos();
    setTimeout(() => limparMensagem(mensagem), 3500);
}

async function carregarMedicamentos() {
    if (!usuarioAtual) return [];
    const { data, error } = await window.supabaseClient
        .from('medicamentos')
        .select('*')
        .order('data_hora', { ascending: false });
    if (error) {
        console.error('Erro ao carregar medicamentos:', error);
        return [];
    }
    return data || [];
}

async function renderizarMedicamentos() {
    const lista = document.getElementById('lista-medicamento');
    const vazio = document.getElementById('medicamento-vazio');
    const contador = document.getElementById('medicamento-contador');
    if (!lista || !vazio) return;

    const medicamentos = await carregarMedicamentos();
    lista.innerHTML = '';

    if (medicamentos.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }

    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = medicamentos.length === 1 ? '1 medicamento' : `${medicamentos.length} medicamentos`;
    }

    const fragmento = document.createDocumentFragment();
    medicamentos.forEach(m => fragmento.appendChild(criarItemMedicamento(m)));
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
    data.textContent = formatarDataHora(medicamento.data_hora);

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

async function excluirMedicamento(id) {
    if (!confirm('Deseja realmente excluir este medicamento?')) return;
    const { error } = await window.supabaseClient.from('medicamentos').delete().eq('id', id);
    if (error) {
        alert('Não foi possível excluir: ' + error.message);
        return;
    }
    await renderizarMedicamentos();
}

// ===== Dicas =====
async function obterUltimaGlicemia() {
    if (!usuarioAtual) return null;
    const { data, error } = await window.supabaseClient
        .from('glicemia')
        .select('*')
        .order('data_hora', { ascending: false })
        .limit(1)
        .maybeSingle();
    if (error) {
        console.warn('Erro ao buscar última glicemia:', error.message);
        return null;
    }
    return data;
}

// Ícones SVG reutilizados nos cartões de dicas
const ICONES_DICAS = {
    alimento:   '<path d="M4 9h13a3 3 0 0 1 0 6h-1m-12 0V9m0 6a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3M8 3v2M11 3v2M14 3v2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    refeicao:   '<path d="M7 3v18M5 3v6a2 2 0 0 0 4 0V3M17 3c-1.5 0-3 1.5-3 4s1.5 4 3 4m0-8v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    cuidados:   '<path d="M12 2a7 7 0 00-4 12.7V17a2 2 0 002 2h4a2 2 0 002-2v-2.3A7 7 0 0012 2zM10 22h4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    evitar:     '<path d="M9 9l6 6m0-6l-6 6M3 12a9 9 0 1018 0 9 9 0 00-18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    preferir:   '<path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>',
    alerta:     '<path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>'
};

async function renderizarDicas() {
    const resumo = document.getElementById('dicas-resumo');
    const conteudo = document.getElementById('dicas-conteudo');
    if (!resumo || !conteudo) return;

    const ultima = await obterUltimaGlicemia();

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
                Última medição: ${formatarDataHora(ultima.data_hora)} · ${ROTULOS_MOMENTO[ultima.momento] || ''}
            </p>
        </div>
    `;

    conteudo.innerHTML = '';

    if (categoria === 'baixa') {
        conteudo.appendChild(criarGrupoDicas('Para subir a glicemia', sortear(dicas.alimentos_imediatos, 3), ICONES_DICAS.alimento));
        conteudo.appendChild(criarGrupoDicas('Cuidados agora', sortear(dicas.cuidados, 3), ICONES_DICAS.cuidados));
        conteudo.appendChild(criarCartaoAlerta(
            'Se não melhorar em 15 minutos',
            'Procure ajuda médica ou ligue para alguém de confiança imediatamente. Hipoglicemia prolongada exige avaliação profissional.'
        ));
    } else if (categoria === 'normal') {
        const refeicoes = sortear(dicas.sugestoes_refeicao, 2);
        conteudo.appendChild(criarGrupoDicas('Sugestão de refeição', [refeicoes[0] || 'Sem sugestões disponíveis.'], ICONES_DICAS.refeicao));
        conteudo.appendChild(criarGrupoDicas('Outra opção', [refeicoes[1] || 'Sem sugestões disponíveis.'], ICONES_DICAS.refeicao));
        conteudo.appendChild(criarGrupoDicas('Mantenha esses hábitos', sortear(dicas.cuidados, 3), ICONES_DICAS.cuidados));
    } else { // alta
        conteudo.appendChild(criarGrupoDicas('Evite agora', sortear(dicas.evitar, 3), ICONES_DICAS.evitar, 'evitar'));
        conteudo.appendChild(criarGrupoDicas('Prefira', sortear(dicas.preferir, 3), ICONES_DICAS.preferir, 'preferir'));
        conteudo.appendChild(criarGrupoDicas('Cuidados agora', sortear(dicas.cuidados, 3), ICONES_DICAS.cuidados));
    }
}

function criarGrupoDicas(titulo, listaDicas, svgInterno, variante) {
    const grupo = document.createElement('div');
    grupo.className = 'dicas-grupo' + (variante ? ` dicas-grupo-${variante}` : '');

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

function criarCartaoAlerta(titulo, mensagem) {
    const cartao = document.createElement('div');
    cartao.className = 'dicas-grupo dicas-grupo-alerta';
    cartao.setAttribute('role', 'note');
    cartao.innerHTML = `
        <div class="dicas-grupo-titulo">
            <div class="icone-grupo" aria-hidden="true">
                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${ICONES_DICAS.alerta}</svg>
            </div>
            <span>${titulo}</span>
        </div>
        <p class="dicas-alerta-texto">${mensagem}</p>
    `;
    return cartao;
}

// ===== Evolução da Glicemia =====
const PERIODOS = {
    'dia':    { dias: 1,  rotuloCurto: 'Último dia (24h)',  rotuloPDF: 'Últimas 24 horas' },
    'semana': { dias: 7,  rotuloCurto: 'Últimos 7 dias',    rotuloPDF: 'Últimos 7 dias' },
    'mes':    { dias: 30, rotuloCurto: 'Últimos 30 dias',   rotuloPDF: 'Últimos 30 dias' }
};

function inicializarEvolucao() {
    document.querySelectorAll('.chip-filtro').forEach(chip => {
        chip.addEventListener('click', async () => {
            const periodo = chip.dataset.periodo;
            if (!PERIODOS[periodo] || periodo === periodoEvolucao) return;
            periodoEvolucao = periodo;
            document.querySelectorAll('.chip-filtro').forEach(c => c.classList.toggle('ativo', c === chip));
            await renderizarEvolucao();
            // Resorteia as dicas para variar a experiência ao trocar o filtro
            await renderizarDicas();
        });
    });

    const btnPdf = document.getElementById('btn-exportar-pdf');
    if (btnPdf) btnPdf.addEventListener('click', exportarRelatorioPDF);
}

async function carregarGlicemiaPeriodo(periodo) {
    if (!usuarioAtual) return [];
    const config = PERIODOS[periodo] || PERIODOS.semana;
    const desde = new Date();
    desde.setDate(desde.getDate() - config.dias);

    const { data, error } = await window.supabaseClient
        .from('glicemia')
        .select('*')
        .gte('data_hora', desde.toISOString())
        .order('data_hora', { ascending: true });

    if (error) {
        console.error('Erro ao carregar evolução:', error);
        return [];
    }
    return data || [];
}

function calcularResumo(registros) {
    if (registros.length === 0) {
        return { total: 0, media: 0, max: 0, min: 0 };
    }
    const valores = registros.map(r => Number(r.valor));
    const soma = valores.reduce((a, b) => a + b, 0);
    return {
        total: valores.length,
        media: Math.round(soma / valores.length),
        max: Math.max(...valores),
        min: Math.min(...valores)
    };
}

function formatarRotuloEixo(isoString, periodo) {
    const data = new Date(isoString);
    if (periodo === 'dia') {
        return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    }
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
        ' ' + data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

async function renderizarEvolucao() {
    const canvas = document.getElementById('grafico-glicemia');
    const vazio = document.getElementById('evolucao-vazio');
    if (!canvas || !vazio) return;

    const registros = await carregarGlicemiaPeriodo(periodoEvolucao);
    dadosEvolucaoAtuais = registros;

    atualizarResumoEvolucao(calcularResumo(registros));

    if (registros.length === 0) {
        canvas.style.visibility = 'hidden';
        vazio.hidden = false;
        if (graficoGlicemia) {
            graficoGlicemia.destroy();
            graficoGlicemia = null;
        }
        return;
    }

    canvas.style.visibility = 'visible';
    vazio.hidden = true;

    const labels = registros.map(r => formatarRotuloEixo(r.data_hora, periodoEvolucao));
    const valores = registros.map(r => Number(r.valor));
    const cores = registros.map(r => CORES_CATEGORIA[classificarGlicemia(r.valor).categoria]);

    const dados = {
        labels,
        datasets: [{
            label: 'Glicemia (mg/dL)',
            data: valores,
            borderColor: '#0d8abc',
            backgroundColor: 'rgba(13, 138, 188, 0.10)',
            borderWidth: 2.5,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: cores,
            pointBorderColor: cores,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    };

    const opcoes = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const v = ctx.parsed.y;
                        const cls = classificarGlicemia(v).etiqueta;
                        return `${v} mg/dL  ·  ${cls}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: { display: true, text: 'mg/dL', color: '#4a6670', font: { weight: '600' } },
                grid: { color: 'rgba(13, 138, 188, 0.08)' },
                ticks: { color: '#4a6670' }
            },
            x: {
                grid: { display: false },
                ticks: {
                    color: '#4a6670',
                    autoSkip: true,
                    maxRotation: 0,
                    maxTicksLimit: 8
                }
            }
        }
    };

    if (graficoGlicemia) {
        graficoGlicemia.data = dados;
        graficoGlicemia.options = opcoes;
        graficoGlicemia.update();
    } else {
        graficoGlicemia = new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: dados,
            options: opcoes
        });
    }
}

function atualizarResumoEvolucao(resumo) {
    const formatar = (v) => v ? `${v} mg/dL` : '—';
    const setText = (id, valor) => {
        const el = document.getElementById(id);
        if (el) el.textContent = valor;
    };
    setText('resumo-total', resumo.total || '—');
    setText('resumo-media', formatar(resumo.media));
    setText('resumo-max', formatar(resumo.max));
    setText('resumo-min', formatar(resumo.min));
}

// ===== Exportação PDF =====
async function exportarRelatorioPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert('Biblioteca de PDF não carregada. Recarregue a página e tente de novo.');
        return;
    }

    const btn = document.getElementById('btn-exportar-pdf');
    if (btn) btn.disabled = true;

    try {
        const config = PERIODOS[periodoEvolucao] || PERIODOS.semana;
        const registros = dadosEvolucaoAtuais.length ? dadosEvolucaoAtuais : await carregarGlicemiaPeriodo(periodoEvolucao);
        const resumo = calcularResumo(registros);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });
        const larguraPagina = doc.internal.pageSize.getWidth();
        const alturaPagina = doc.internal.pageSize.getHeight();
        const margem = 14;

        // Cabeçalho
        doc.setFillColor(13, 138, 188);
        doc.rect(0, 0, larguraPagina, 22, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('Relatorio de Glicemia — GlicoCare', margem, 14);

        // Dados do paciente
        doc.setTextColor(31, 58, 68);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const nome = perfilUsuario?.nome || 'Usuario';
        const email = usuarioAtual?.email || '';
        const hoje = new Date();
        const desde = new Date(); desde.setDate(desde.getDate() - config.dias);
        const fmtData = d => d.toLocaleDateString('pt-BR');

        doc.text(`Paciente: ${nome}`, margem, 32);
        if (email) doc.text(`E-mail: ${email}`, margem, 38);
        doc.text(`Periodo: ${config.rotuloPDF} (${fmtData(desde)} a ${fmtData(hoje)})`, margem, 44);
        doc.text(`Gerado em: ${hoje.toLocaleString('pt-BR')}`, margem, 50);

        let y = 60;

        // Gráfico (se existir)
        if (graficoGlicemia && registros.length > 0) {
            try {
                const imagemBase64 = graficoGlicemia.toBase64Image('image/png', 1);
                const larguraImg = larguraPagina - margem * 2;
                const alturaImg = 80;
                doc.addImage(imagemBase64, 'PNG', margem, y, larguraImg, alturaImg);
                y += alturaImg + 8;
            } catch (e) {
                console.warn('Não foi possível inserir o gráfico no PDF:', e);
            }
        }

        // Resumo
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumo do periodo', margem, y);
        y += 7;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(`Medicoes: ${resumo.total}`, margem, y);
        doc.text(`Media: ${resumo.media || '—'} mg/dL`, margem + 50, y);
        doc.text(`Maximo: ${resumo.max || '—'} mg/dL`, margem + 100, y);
        doc.text(`Minimo: ${resumo.min || '—'} mg/dL`, margem + 150, y);
        y += 10;

        // Tabela
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Medicoes detalhadas', margem, y);
        y += 6;

        const colunas = [
            { titulo: 'Data/hora',     x: margem,        largura: 50 },
            { titulo: 'Valor (mg/dL)', x: margem + 50,   largura: 30 },
            { titulo: 'Momento',       x: margem + 80,   largura: 55 },
            { titulo: 'Classificacao', x: margem + 135,  largura: 45 }
        ];

        doc.setFillColor(224, 242, 250);
        doc.rect(margem, y - 4, larguraPagina - margem * 2, 7, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(7, 91, 125);
        colunas.forEach(c => doc.text(c.titulo, c.x + 2, y));
        y += 6;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(31, 58, 68);

        if (registros.length === 0) {
            doc.setTextColor(120);
            doc.text('Nenhuma medicao encontrada no periodo.', margem, y);
        } else {
            // Mostrar do mais recente para o mais antigo na tabela
            const ordenados = [...registros].sort((a, b) => new Date(b.data_hora) - new Date(a.data_hora));
            ordenados.forEach((r, idx) => {
                if (y > alturaPagina - 25) {
                    doc.addPage();
                    y = 20;
                }
                if (idx % 2 === 0) {
                    doc.setFillColor(248, 251, 253);
                    doc.rect(margem, y - 4, larguraPagina - margem * 2, 6, 'F');
                }
                const cls = classificarGlicemia(r.valor).etiqueta;
                doc.text(formatarDataHora(r.data_hora), colunas[0].x + 2, y);
                doc.text(String(r.valor), colunas[1].x + 2, y);
                doc.text(ROTULOS_MOMENTO[r.momento] || '—', colunas[2].x + 2, y);
                doc.text(cls, colunas[3].x + 2, y);
                y += 6;
            });
        }

        // Rodapé em todas as páginas
        const totalPaginas = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPaginas; p++) {
            doc.setPage(p);
            doc.setFontSize(8);
            doc.setTextColor(122, 140, 147);
            doc.setFont('helvetica', 'italic');
            doc.text(
                'Este relatorio e gerado pelo GlicoCare — sistema educativo, nao substitui orientacao medica.',
                larguraPagina / 2,
                alturaPagina - 8,
                { align: 'center' }
            );
            doc.text(`Pagina ${p} de ${totalPaginas}`, larguraPagina - margem, alturaPagina - 8, { align: 'right' });
        }

        const dataArquivo = hoje.toISOString().slice(0, 10);
        doc.save(`glicocare-relatorio-${dataArquivo}.pdf`);
    } catch (e) {
        console.error(e);
        alert('Não foi possível gerar o PDF. Veja o console para detalhes.');
    } finally {
        if (btn) btn.disabled = false;
    }
}

// ===== Alertas de Medicação =====
function inicializarAlertasMedicacao() {
    const formulario = document.getElementById('form-alerta');
    if (!formulario) return;

    // Toggle de chips de dia
    document.querySelectorAll('.chip-dia').forEach(chip => {
        chip.addEventListener('click', () => {
            chip.classList.toggle('ativo');
            atualizarBotaoTodosDias();
        });
    });

    // Botão "Todos os dias"
    const btnTodos = document.getElementById('btn-todos-dias');
    if (btnTodos) {
        btnTodos.addEventListener('click', () => {
            const chips = Array.from(document.querySelectorAll('.chip-dia'));
            const todosAtivos = chips.every(c => c.classList.contains('ativo'));
            chips.forEach(c => c.classList.toggle('ativo', !todosAtivos));
            atualizarBotaoTodosDias();
        });
    }

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        await tratarEnvioAlerta();
    });

    // Delegação de eventos da lista (toggle ativo/inativo e excluir)
    document.getElementById('lista-alertas').addEventListener('click', async (e) => {
        const btnExcluir = e.target.closest('.botao-excluir');
        if (btnExcluir) {
            const id = btnExcluir.dataset.id;
            if (id) await excluirAlerta(id);
            return;
        }
        const btnToggle = e.target.closest('.botao-toggle');
        if (btnToggle) {
            const id = btnToggle.dataset.id;
            const ativoAtual = btnToggle.classList.contains('ligado');
            if (id) await alternarAtivoAlerta(id, !ativoAtual);
        }
    });

    // Botão de pedir permissão para notificações
    const btnPerm = document.getElementById('btn-permissao-notificacao');
    if (btnPerm) {
        btnPerm.addEventListener('click', async () => {
            if (!('Notification' in window)) return;
            try {
                await Notification.requestPermission();
            } catch (e) {
                console.warn('Erro pedindo permissão:', e);
            }
            atualizarBannerPermissao();
        });
    }
}

function atualizarBotaoTodosDias() {
    const chips = Array.from(document.querySelectorAll('.chip-dia'));
    const btn = document.getElementById('btn-todos-dias');
    if (!btn) return;
    const todosAtivos = chips.length > 0 && chips.every(c => c.classList.contains('ativo'));
    btn.classList.toggle('ativo', todosAtivos);
    btn.textContent = todosAtivos ? 'Limpar dias' : 'Todos os dias';
}

function atualizarBannerPermissao() {
    const banner = document.getElementById('permissao-notificacao');
    if (!banner) return;
    if (!('Notification' in window)) {
        banner.hidden = true;
        return;
    }
    if (Notification.permission === 'granted') {
        banner.hidden = true;
    } else if (Notification.permission === 'denied') {
        banner.hidden = false;
        banner.classList.add('permissao-bloqueada');
        const texto = banner.querySelector('.permissao-texto');
        if (texto) {
            texto.innerHTML = '<strong>Notificações bloqueadas</strong><p>Habilite as notificações deste site nas configurações do navegador para receber lembretes.</p>';
        }
        const botao = document.getElementById('btn-permissao-notificacao');
        if (botao) botao.style.display = 'none';
    } else {
        banner.hidden = false;
        banner.classList.remove('permissao-bloqueada');
    }
}

async function tratarEnvioAlerta() {
    const campoTipo = document.getElementById('alerta-tipo');
    const campoNome = document.getElementById('alerta-nome');
    const campoDose = document.getElementById('alerta-dose');
    const campoHorario = document.getElementById('alerta-horario');
    const mensagem = document.getElementById('mensagem-alerta');
    const formulario = document.getElementById('form-alerta');

    const nome = campoNome.value.trim();
    const dose = campoDose.value.trim();
    const horario = campoHorario.value; // "HH:MM"
    const tipo = campoTipo.value;

    if (!nome) {
        exibirMensagem(mensagem, 'Por favor, informe o nome do medicamento.', 'erro');
        campoNome.focus();
        return;
    }
    if (!dose) {
        exibirMensagem(mensagem, 'Por favor, informe a dose do medicamento.', 'erro');
        campoDose.focus();
        return;
    }
    if (!horario || !/^\d{2}:\d{2}$/.test(horario)) {
        exibirMensagem(mensagem, 'Informe um horário válido (formato HH:MM).', 'erro');
        campoHorario.focus();
        return;
    }
    if (!TIPOS_MEDICAMENTO[tipo]) {
        exibirMensagem(mensagem, 'Escolha um tipo de medicamento válido.', 'erro');
        return;
    }

    const dias = Array.from(document.querySelectorAll('.chip-dia.ativo'))
        .map(c => c.dataset.dia);
    if (dias.length === 0) {
        exibirMensagem(mensagem, 'Selecione pelo menos um dia da semana.', 'erro');
        return;
    }
    if (!usuarioAtual) {
        exibirMensagem(mensagem, 'Sessão expirada. Faça login novamente.', 'erro');
        return;
    }

    // Ordena na ordem natural da semana antes de salvar
    const diasOrdenados = DIAS_ORDEM_EXIBICAO.filter(d => dias.includes(d));

    const { error } = await window.supabaseClient.from('alertas_medicacao').insert({
        user_id: usuarioAtual.id,
        tipo, nome, dose, horario,
        dias_semana: diasOrdenados.join(','),
        ativo: true
    });

    if (error) {
        exibirMensagem(mensagem, 'Não foi possível salvar: ' + error.message, 'erro');
        return;
    }

    exibirMensagem(mensagem, 'Alerta salvo com sucesso! Avisaremos no horário marcado.', 'sucesso');
    formulario.reset();
    document.querySelectorAll('.chip-dia').forEach(c => c.classList.remove('ativo'));
    atualizarBotaoTodosDias();

    await renderizarAlertas();
    setTimeout(() => limparMensagem(mensagem), 3500);
}

async function carregarAlertas() {
    if (!usuarioAtual) { alertasCache = []; return []; }
    const { data, error } = await window.supabaseClient
        .from('alertas_medicacao')
        .select('*')
        .order('horario', { ascending: true });
    if (error) {
        console.error('Erro ao carregar alertas:', error);
        alertasCache = [];
        return [];
    }
    alertasCache = data || [];
    return alertasCache;
}

async function renderizarAlertas() {
    const lista = document.getElementById('lista-alertas');
    const vazio = document.getElementById('alertas-vazio');
    const contador = document.getElementById('alertas-contador');
    if (!lista || !vazio) return;

    const alertas = await carregarAlertas();
    lista.innerHTML = '';

    if (alertas.length === 0) {
        vazio.style.display = 'block';
        if (contador) contador.textContent = '';
        return;
    }
    vazio.style.display = 'none';
    if (contador) {
        contador.textContent = alertas.length === 1 ? '1 alerta' : `${alertas.length} alertas`;
    }

    // Ordena pelo horário mais próximo de "agora"
    const agora = new Date();
    const minAtual = agora.getHours() * 60 + agora.getMinutes();
    const ordenados = [...alertas].sort((a, b) => {
        const aMin = horarioParaMinutos(a.horario);
        const bMin = horarioParaMinutos(b.horario);
        const aDist = ((aMin - minAtual) + 1440) % 1440;
        const bDist = ((bMin - minAtual) + 1440) % 1440;
        return aDist - bDist;
    });

    const fragmento = document.createDocumentFragment();
    ordenados.forEach(a => fragmento.appendChild(criarItemAlerta(a)));
    lista.appendChild(fragmento);
}

function horarioParaMinutos(hhmm) {
    if (!hhmm || hhmm.length < 4) return 0;
    const [h, m] = hhmm.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
}

function criarItemAlerta(alerta) {
    const config = TIPOS_MEDICAMENTO[alerta.tipo] || { rotulo: 'Medicamento', icone: '' };
    const tipoClasse = `tipo-${alerta.tipo}`;
    const inativoClasse = alerta.ativo ? '' : 'inativo';

    const item = document.createElement('li');
    item.className = `item-alerta ${tipoClasse} ${inativoClasse}`;

    // Ícone do tipo
    const icone = document.createElement('div');
    icone.className = 'item-alerta-icone';
    icone.setAttribute('aria-hidden', 'true');
    icone.innerHTML = `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">${config.icone}</svg>`;

    // Horário em destaque
    const horario = document.createElement('div');
    horario.className = 'item-alerta-horario';
    horario.textContent = alerta.horario;

    // Info: nome + dose + dias
    const info = document.createElement('div');
    info.className = 'item-alerta-info';

    const nome = document.createElement('span');
    nome.className = 'item-alerta-nome';
    nome.textContent = alerta.nome;

    const dose = document.createElement('span');
    dose.className = 'item-alerta-dose';
    dose.textContent = `Dose: ${alerta.dose}`;

    const dias = document.createElement('div');
    dias.className = 'item-alerta-dias';
    const diasSalvos = (alerta.dias_semana || '').split(',').map(s => s.trim()).filter(Boolean);
    DIAS_ORDEM_EXIBICAO.forEach(d => {
        if (diasSalvos.includes(d)) {
            const span = document.createElement('span');
            span.className = 'item-alerta-dia';
            span.textContent = DIAS_ROTULO_CURTO[d];
            dias.appendChild(span);
        }
    });

    info.appendChild(nome);
    info.appendChild(dose);
    info.appendChild(dias);

    // Ações: toggle + excluir
    const acoes = document.createElement('div');
    acoes.className = 'item-alerta-acoes';

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'botao-toggle' + (alerta.ativo ? ' ligado' : '');
    toggle.dataset.id = alerta.id;
    toggle.setAttribute('aria-label', alerta.ativo ? 'Desativar alerta' : 'Ativar alerta');
    toggle.title = alerta.ativo ? 'Desativar' : 'Ativar';

    const excluir = document.createElement('button');
    excluir.type = 'button';
    excluir.className = 'botao-excluir';
    excluir.dataset.id = alerta.id;
    excluir.setAttribute('aria-label', 'Excluir este alerta');
    excluir.title = 'Excluir alerta';
    excluir.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14zM10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    acoes.appendChild(toggle);
    acoes.appendChild(excluir);

    item.appendChild(icone);
    item.appendChild(horario);
    item.appendChild(info);
    item.appendChild(acoes);
    return item;
}

async function alternarAtivoAlerta(id, novoAtivo) {
    const { error } = await window.supabaseClient
        .from('alertas_medicacao')
        .update({ ativo: novoAtivo })
        .eq('id', id);
    if (error) {
        alert('Não foi possível atualizar: ' + error.message);
        return;
    }
    await renderizarAlertas();
}

async function excluirAlerta(id) {
    if (!confirm('Deseja realmente excluir este alerta?')) return;
    const { error } = await window.supabaseClient
        .from('alertas_medicacao')
        .delete()
        .eq('id', id);
    if (error) {
        alert('Não foi possível excluir: ' + error.message);
        return;
    }
    await renderizarAlertas();
}

// ===== Sistema de disparo de alertas =====
function iniciarTimerAlertas() {
    pararTimerAlertas();
    verificarAlertas();   // checa imediatamente
    timerAlertas = setInterval(verificarAlertas, 30 * 1000);
}

function pararTimerAlertas() {
    if (timerAlertas) { clearInterval(timerAlertas); timerAlertas = null; }
    // Cancela os snoozes pendentes
    snoozeTimeouts.forEach(t => clearTimeout(t));
    snoozeTimeouts = [];
}

function verificarAlertas() {
    if (!usuarioAtual || !alertasCache || alertasCache.length === 0) return;
    if (modalAlertaAberto) return;

    const agora = new Date();
    const diaAtual = DIAS_SEMANA_KEYS[agora.getDay()];
    const hhmmAtual = `${String(agora.getHours()).padStart(2, '0')}:${String(agora.getMinutes()).padStart(2, '0')}`;
    const dataChave = `${agora.getFullYear()}${String(agora.getMonth() + 1).padStart(2, '0')}${String(agora.getDate()).padStart(2, '0')}`;

    for (const alerta of alertasCache) {
        if (!alerta.ativo) continue;
        if (alerta.horario !== hhmmAtual) continue;
        const dias = (alerta.dias_semana || '').split(',').map(s => s.trim());
        if (!dias.includes(diaAtual)) continue;

        const chave = `${alerta.id}-${dataChave}-${hhmmAtual}`;
        if (alertasJaDisparados.has(chave)) continue;

        alertasJaDisparados.add(chave);
        dispararAlerta(alerta);
        break; // só um por vez
    }
}

function dispararAlerta(alerta) {
    tocarBeep();
    mostrarNotificacaoNavegador(alerta);
    mostrarModalAlerta(alerta);
}

function tocarBeep() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const tons = [880, 1108]; // lá + dó# — 2 bipes curtos
        tons.forEach((freq, i) => {
            const inicio = ctx.currentTime + i * 0.35;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, inicio);
            gain.gain.linearRampToValueAtTime(0.3, inicio + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, inicio + 0.4);
            osc.connect(gain).connect(ctx.destination);
            osc.start(inicio);
            osc.stop(inicio + 0.45);
        });
        // Fecha o contexto depois para liberar recursos
        setTimeout(() => { try { ctx.close(); } catch (e) {} }, 1500);
    } catch (e) {
        console.warn('Não foi possível tocar o beep:', e);
    }
}

function mostrarNotificacaoNavegador(alerta) {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
        const n = new Notification('GlicoCare — Hora do remédio!', {
            body: `Está na hora de tomar ${alerta.nome} — ${alerta.dose}`,
            tag: `glicocare-${alerta.id}`,
            requireInteraction: false
        });
        n.onclick = () => { window.focus(); n.close(); };
    } catch (e) {
        console.warn('Erro ao criar notificação:', e);
    }
}

function inicializarModalAlerta() {
    const btnOk = document.getElementById('modal-alerta-ok');
    const btnSnooze = document.getElementById('modal-alerta-snooze');
    if (btnOk) btnOk.addEventListener('click', () => fecharModalAlerta());
    if (btnSnooze) btnSnooze.addEventListener('click', () => {
        const alertaAtual = window._alertaModalAtual;
        fecharModalAlerta();
        if (alertaAtual) {
            const t = setTimeout(() => {
                if (!modalAlertaAberto) dispararAlerta(alertaAtual);
            }, 10 * 60 * 1000);
            snoozeTimeouts.push(t);
        }
    });
}

function mostrarModalAlerta(alerta) {
    const modal = document.getElementById('modal-alerta');
    const titulo = document.getElementById('modal-alerta-titulo');
    const texto = document.getElementById('modal-alerta-texto');
    if (!modal || !titulo || !texto) return;

    const tipoRotulo = (TIPOS_MEDICAMENTO[alerta.tipo]?.rotulo || 'medicamento').toLowerCase();
    titulo.textContent = alerta.tipo === 'insulina' ? 'Hora da insulina!' : `Hora do ${tipoRotulo}!`;
    texto.innerHTML = `Está na hora de tomar <strong>${alerta.nome}</strong><br>Dose: <strong>${alerta.dose}</strong>`;

    window._alertaModalAtual = alerta;
    modal.hidden = false;
    modalAlertaAberto = true;
}

function fecharModalAlerta() {
    const modal = document.getElementById('modal-alerta');
    if (modal) modal.hidden = true;
    modalAlertaAberto = false;
    window._alertaModalAtual = null;
}
