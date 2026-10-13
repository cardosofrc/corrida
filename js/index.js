const SUPABASE_URL =
    "https://bsadzpxcxoeutockphjm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2eNohK0WFyzO2R0Adx9-tg_e_WTPaQv";


const formulario =
    document.getElementById("formInscricao");

const resultado =
    document.getElementById("resultado");


function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    let resto;

    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(9, 10))) {
        return false;
    }
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) {
        resto = 0;
    }
    if (resto !== parseInt(cpf.substring(10, 11))) {
        return false;
    }
    
    return true;
}

formulario.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const botao =
            formulario.querySelector(
                "button[type='submit']"
            );

        botao.disabled = true;

        botao.textContent =
            "REGISTRANDO INSCRIÇÃO...";


        try {

            // -----------------------------------------
            // COLETA DOS DADOS
            // -----------------------------------------

            const dados = {

                p_nome:
                    document
                        .getElementById("nome")
                        .value
                        .trim(),

                p_cpf:
                    document
                        .getElementById("cpf")
                        .value
                        .trim(),

                p_data_nascimento:
                    document
                        .getElementById("nascimento")
                        .value,

                p_sexo:
                    document
                        .getElementById("sexo")
                        .value,

                p_telefone:
                    document
                        .getElementById("telefone")
                        .value
                        .trim(),

                p_email:
                    document
                        .getElementById("email")
                        .value
                        .trim(),

                p_cidade:
                    document
                        .getElementById("cidade")
                        .value
                        .trim(),

                p_percurso:
                    document
                        .getElementById("percurso")
                        .value,

                p_tamanho_camisa:
                    document
                        .getElementById("camisa")
                        .value,

                p_contato_emergencia:
                    document
                        .getElementById("emergencia")
                        .value
                        .trim()
            };


            // -----------------------------------------
            // VALIDAÇÃO DO PERCURSO
            // -----------------------------------------

            if (
                dados.p_percurso !== "3 km" &&
                dados.p_percurso !== "5 km"
            ) {

                throw new Error(
                    "Selecione o percurso."
                );
            }


            if (!validarCPF(dados.p_cpf)){
                throw new Error(
                    "CPF inválido."
                );
            }


            // -----------------------------------------
            // CHAMADA DA FUNÇÃO SUPABASE
            // -----------------------------------------


            //if (validarCPF(dados.p_cpf)){
                const resposta =
                await fetch(
                    `${SUPABASE_URL}/rest/v1/rpc/criar_inscricao`,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

                            "apikey":
                                SUPABASE_KEY,

                            "Authorization":
                                `Bearer ${SUPABASE_KEY}`

                        },

                        body:
                            JSON.stringify(dados)
                    }
                );
            //} else {
            //    throw new Error(
            //        "CPF inválido."
            //    );
            //}

           


            // -----------------------------------------
            // VERIFICA ERRO
            // -----------------------------------------

           if (!resposta.ok) {

                const erro = await resposta.text();

                console.error(
                    "Erro Supabase:",
                    erro
                );

                // CPF já cadastrado: a tabela possui uma restrição UNIQUE.
                let detalheErro = {};
                try {
                    detalheErro = JSON.parse(erro);
                } catch (_) {
                    // A resposta pode não estar em formato JSON.
                }

                const mensagemErro = String(
                    detalheErro.message || detalheErro.details || erro
                ).toLowerCase();

                if (
                    detalheErro.code === "23505" ||
                    mensagemErro.includes("inscricoes_cpf_key") ||
                    mensagemErro.includes("duplicate key") ||
                    mensagemErro.includes("cpf") && mensagemErro.includes("already exists")
                ) {
                    throw new Error(
                        "Este CPF já possui uma inscrição cadastrada. Para consultar seus dados e o status da inscrição, acesse a opção ‘Consultar minha inscrição’. Não é necessário fazer uma nova inscrição."
                    );
                }

                throw new Error(
                    "Não foi possível registrar a inscrição neste momento. Confira os dados e tente novamente."
                );
            }


            // -----------------------------------------
            // RECEBE A INSCRIÇÃO
            // -----------------------------------------

            const inscricoes =
                await resposta.json();


            const inscricao =
                inscricoes[0];


            // -----------------------------------------
            // MOSTRA RESULTADO
            // -----------------------------------------

            resultado.style.display =
                "block";

            resultado.innerHTML = `

                <strong>
                    🎉 INSCRIÇÃO REALIZADA!
                </strong>

                <br><br>

                Olá,
                <strong>
                    ${inscricao.nome}
                </strong>!

                <br><br>

                Sua inscrição foi registrada
                com sucesso.

                <div class="protocolo">

                    Número da inscrição:

                    <br>

                    <strong>
                        ${inscricao.protocolo}
                    </strong>

                </div>

                <br>

                <strong>
                    Percurso:
                </strong>

                ${inscricao.percurso}

                <br>

                <strong>
                    Camisa:
                </strong>

                ${inscricao.tamanho_camisa}

                <br>

                <strong>
                    Valor:
                </strong>

                R$ 60,00

                <br><br>

                <strong>
                    Status do pagamento:
                </strong>

                <br>

                ⏳ AGUARDANDO PAGAMENTO

                <br><br>

                O pagamento PIX será
                disponibilizado na próxima etapa.

            `;


            resultado.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });


            botao.textContent =
                "INSCRIÇÃO REGISTRADA";

        }


        catch (erro) {

            console.error(erro);

            resultado.style.display =
                "block";

            resultado.innerHTML = `

                <strong>
                    ❌ Não foi possível realizar
                    a inscrição.
                </strong>

                <br><br>

                ${erro.message}

                <br><br>

                Verifique os dados e tente novamente.

            `;


            botao.disabled = false;

            botao.textContent =
                "ENVIAR INSCRIÇÃO";
        }

    });