const express = require("express");
const fs = require("fs");
const cors = require("cors")
const path = require("path")


const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const clientesFile = path.join(__dirname, "clientes.json");

function salvarClientes(clientes) {
    fs.writeFileSync(clientesFile, JSON.stringify(clientes, null, 2), "utf-8")
}

    function lerClientes(){
        if(!fs.existsSync(clientesFile)){
            return [];
        }
        const dados=fs.readFileSync(clientesFile, "utf-8")
        try {
            return JSON.parse(dados) || [];
        }
        catch(e){
            return []
        }
    }
    


app.post("/clientes", (req, res) => {
    const {nome, cpf, cep, rua, cidade, estado, numero} = req.body
    if(!nome || !cpf || !cep){
        return res.status(404).json({erro: "dados incompletos"})
    }
    const clientes= lerClientes();
    if(clientes.some(c => c.cpf===cpf )){
        return res.status(400).json({erro: "cliente já cadastrado"})
    }
    const novoCliente={nome, cpf, cep, rua, cidade, estado, numero};
    clientes.push(novoCliente);
    salvarClientes(clientes);
     return res.status(201).json({mensagem: "cliente cadastrado com sucesso"})

})

//http://localhost:3000/saudacao?nome=rafa
app.get("/saudacao", (req, res) => {
    const nome = req.query.nome;
    if (!nome) {
        return res.status(404).json(
            {
                erro: "nome não informado"
            }
        )
    }
    res.json(
        {
            mensagem: `saudação ${nome}!`
        }
    )
})
app.post("/imc", (req, res) => {
    const { nome, idade, altura, peso } = req.body;

    if (!nome || !idade || !altura || !peso) {
        return res.status(404).json({ erro: "dados imcompletos" })
    }
    const imc = peso / (altura * altura);
    res.json({
        nome,
        idade,
        imc: imc.toFixed(2)
    })
})
app.post("/media", (req, res) => {
    const { nota1, nota2 } = req.body;

    if (!nota1 || !nota2) {
        return res.status(404).json({ erro: "dados incompletos" })
    }
    const media = (parseFloat(nota1) + parseFloat(nota2)) / 2;

    res.json({
        mensagem: media >= 7 ? "aprovado" : "reprovado",
        media: parseFloat(media)
    })

})
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(404).json({ erro: "dados incompletos" })
    }
    if (email === "admin@admin.com" && senha === "123456") {
        return res.status(200).json({ token: "123456" })
    } else {
        return res.status(404).json({ erro: "senha ou email incorreto" })
    }
})
//finalzao
app.listen(port, () => {
    console.log(`servidor rodando em http://localhost:${port}`)
})