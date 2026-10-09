const SUPABASE_URL =
    "https://bsadzpxcxoeutockphjm.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_2eNohK0WFyzO2R0Adx9-tg_e_WTPaQv";


const formulario =
    document.getElementById("formInscricao");

const resultado =
    document.getElementById("resultado");


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


            // -----------------------------------------
            // CHAMADA DA FUNÇÃO SUPABASE
            // -----------------------------------------

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


            // -----------------------------------------
            // VERIFICA ERRO
            // -----------------------------------------

            if (!resposta.ok) {

                const erro =
                    await resposta.text();

                console.error(
                    "Erro Supabase:",
                    erro
                );

                throw new Error(
                    "Erro ao registrar inscrição."
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