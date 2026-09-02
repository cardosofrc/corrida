const formulario =
    document.getElementById("formInscricao");

const resultado =
    document.getElementById("resultado");


function gerarProtocolo() {

    const numero =
        Math.floor(
            10000 + Math.random() * 90000
        );

    return "CNS-2026-" + numero;
}


formulario.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const nome =
            document.getElementById("nome").value;

        const protocolo =
            gerarProtocolo();


        resultado.style.display = "block";


        resultado.innerHTML = `

                <strong>
                    🎉 Inscrição registrada!
                </strong>

                <br><br>

                Olá,
                <strong>${nome}</strong>!

                <br>

                Sua inscrição foi registrada
                nesta primeira versão do sistema.

                <div class="protocolo">

                    Número da inscrição:

                    <br>

                    ${protocolo}

                </div>

                <br>

                <strong>
                    Status: AGUARDANDO PAGAMENTO
                </strong>

                <br><br>

                Valor:
                <strong>R$ 60,00</strong>

                <br><br>

                O QR Code e o código PIX Copia e Cola
                serão disponibilizados após a integração
                do sistema de pagamento.

            `;


        resultado.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
);