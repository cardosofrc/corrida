const SUPABASE_URL =
    "https://bsadzpxcxoeutockphjm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2eNohK0WFyzO2R0Adx9-tg_e_WTPaQv";

const form = document.getElementById("formConsulta");
const mensagem = document.getElementById("mensagem");
const btnConsultar = document.getElementById("btnConsultar");

const cpfInput = document.getElementById("cpf");


// Máscara simples de CPF
cpfInput.addEventListener("input", function () {

    let valor = this.value.replace(/\D/g, "");

    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    valor = valor.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    valor = valor.replace(
        /(\d{3})(\d)/,
        "$1.$2"
    );

    valor = valor.replace(
        /(\d{3})(\d{1,2})$/,
        "$1-$2"
    );

    this.value = valor;
});


form.addEventListener("submit", async function (event) {

    event.preventDefault();

    mensagem.innerHTML = "";

    btnConsultar.disabled = true;
    btnConsultar.textContent = "Consultando...";

    const cpf = cpfInput.value;
    const nascimento =
        document.getElementById("nascimento").value;

    try {

        const resposta = await fetch(
            `${SUPABASE_URL}/rest/v1/rpc/consultar_inscricao`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`
                },

                body: JSON.stringify({
                    p_cpf: cpf,
                    p_data_nascimento: nascimento
                })
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {

            throw new Error(
                dados.message ||
                dados.error ||
                "Não foi possível consultar a inscrição."
            );
        }

        if (!dados || dados.length === 0) {

            mensagem.innerHTML = `
                <div class="erro">
                    <strong>Inscrição não encontrada.</strong><br>
                    Confira o CPF e a data de nascimento informados.
                </div>
            `;

            return;
        }

        const inscricao = dados[0];

        let classeStatus = "status-pendente";

        if (inscricao.status_pagamento === "CONFIRMADO") {
            classeStatus = "status-confirmado";
        }

        if (inscricao.status_pagamento === "CANCELADO") {
            classeStatus = "status-cancelado";
        }

        mensagem.innerHTML = `
            <div class="resultado">

                <h3>Inscrição encontrada!</h3>

                <strong>Inscrição:</strong>
                ${inscricao.protocolo}
                <br>

                <strong>Participante:</strong>
                ${inscricao.nome}
                <br>

                <strong>Percurso:</strong>
                ${inscricao.percurso}
                <br>

                <strong>Camisa:</strong>
                ${inscricao.tamanho_camisa}
                <br>

                <strong>Valor:</strong>
                R$ ${Number(inscricao.valor)
                    .toFixed(2)
                    .replace(".", ",")}
                <br>

                <strong>Status:</strong><br>

                <span class="status ${classeStatus}">
                    ${inscricao.status_pagamento}
                </span>

            </div>
        `;

    } catch (erro) {

        console.error(erro);

        mensagem.innerHTML = `
            <div class="erro">
                Ocorreu um erro ao consultar sua inscrição.
                Tente novamente.
            </div>
        `;

    } finally {

        btnConsultar.disabled = false;
        btnConsultar.textContent =
            "Consultar inscrição";
    }

});