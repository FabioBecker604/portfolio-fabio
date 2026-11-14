
// ======================================
// PORTFÓLIO - SISTEMA DE CONTATO
// ======================================

// Verifica se já existem mensagens salvas
let mensagens = JSON.parse(
    localStorage.getItem("mensagensContato")
);

// Cria 20 mensagens de teste na primeira utilização
if (mensagens === null) {

    mensagens = [];

    for (let i = 1; i <= 20; i++) {

        mensagens.push({
            id: i,
            nome: "Usuário Teste " + i,
            email: "teste" + i + "@email.com",
            assunto: "Mensagem de teste " + i,
            mensagem: "Esta é uma mensagem utilizada para testar o sistema.",
            data: new Date().toLocaleDateString("pt-BR")
        });

    }

    // Salva as mensagens no navegador
    localStorage.setItem(
        "mensagensContato",
        JSON.stringify(mensagens)
    );

}








// ======================================
// CONFIGURAÇÃO DO EMAILJS
// ======================================

emailjs.init({
    publicKey: "mkFLry2j7VmLEmVZb"
});

// ======================================
// ENVIO DE NOVAS MENSAGENS
// ======================================

const formulario = document.getElementById("formContato");

formulario.addEventListener("submit", async function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const assunto = document.getElementById("assunto").value;
    const mensagem = document.getElementById("mensagem").value;

    const novaMensagem = {
        id: mensagens.length > 0
            ? Math.max(...mensagens.map(m => m.id)) + 1
            : 1,
        nome: nome,
        email: email,
        assunto: assunto,
        mensagem: mensagem,
        data: new Date().toLocaleDateString("pt-BR")
    };

    // Salva a mensagem no LocalStorage
    mensagens.push(novaMensagem);

    localStorage.setItem(
        "mensagensContato",
        JSON.stringify(mensagens)
    );

    const status = document.getElementById("statusContato");
    status.textContent = "Mensagem salva! Enviando e-mail...";

    // Envia a mensagem pelo EmailJS
    try {

        await emailjs.send(
            "service_oq8halo",
            "template_vt290sc",
            {
                nome: nome,
                email: email,
                assunto: assunto,
                mensagem: mensagem
            }
        );

        status.textContent =
            "Mensagem enviada com sucesso!";

    } catch (erro) {

        console.error("Erro ao enviar e-mail:", erro);

        status.textContent =
            "Mensagem salva no navegador, mas não foi possível enviar o e-mail.";

    }

    formulario.reset();

});




// ======================================
// PAINEL ADMINISTRATIVO
// ======================================

// Atalho Ctrl + Shift + A para abrir ou fechar o painel
document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
        const painel = document.getElementById("painelAdmin");

        if (painel.style.display === "none") {
            painel.style.display = "block";
            carregarMensagens();
            painel.scrollIntoView({ behavior: "smooth" });
        } else {
            painel.style.display = "none";
        }
    }
});

// Exibe as mensagens na tabela
function carregarMensagens() {
    const lista = document.getElementById("listaMensagens");

    lista.innerHTML = "";

    mensagens.forEach(function(item) {
        const linha = document.createElement("tr");

        const dados = [
            item.nome,
            item.email,
            item.assunto,
            item.mensagem,
            item.data
        ];

        dados.forEach(function(dado) {
            const coluna = document.createElement("td");
            coluna.textContent = dado;
            linha.appendChild(coluna);
        });

        const colunaAcoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.className = "btn btn-sm btn-primary me-2";
        botaoEditar.addEventListener("click", function() {
            editarMensagem(item.id);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.className = "btn btn-sm btn-danger";
        botaoExcluir.addEventListener("click", function() {
            excluirMensagem(item.id);
        });

        colunaAcoes.appendChild(botaoEditar);
        colunaAcoes.appendChild(botaoExcluir);
        linha.appendChild(colunaAcoes);

        lista.appendChild(linha);
    });
}

// Edita uma mensagem
function editarMensagem(id) {
    const mensagem = mensagens.find(function(item) {
        return item.id === id;
    });

    if (!mensagem) return;

    const novoNome = prompt("Digite o novo nome:", mensagem.nome);
    if (novoNome === null) return;

    const novoEmail = prompt("Digite o novo e-mail:", mensagem.email);
    if (novoEmail === null) return;

    const novoAssunto = prompt("Digite o novo assunto:", mensagem.assunto);
    if (novoAssunto === null) return;

    const novaMensagem = prompt("Digite a nova mensagem:", mensagem.mensagem);
    if (novaMensagem === null) return;

    mensagem.nome = novoNome;
    mensagem.email = novoEmail;
    mensagem.assunto = novoAssunto;
    mensagem.mensagem = novaMensagem;

    localStorage.setItem("mensagensContato", JSON.stringify(mensagens));

    carregarMensagens();
}

// Exclui uma mensagem
function excluirMensagem(id) {
    const confirmar = confirm("Deseja realmente excluir esta mensagem?");

    if (!confirmar) return;

    mensagens = mensagens.filter(function(item) {
        return item.id !== id;
    });

    localStorage.setItem("mensagensContato", JSON.stringify(mensagens));

    carregarMensagens();
}
