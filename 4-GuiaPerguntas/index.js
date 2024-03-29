const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

// Database
connection
  .authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados!")
  })
  .catch((msgErro) => {
    console.log(msgErro);
  })

// Estou dizendo para o Express usar o EJS como View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Rotas
// app.get("/:nome/:lang", (req, res) => {
app.get("/", (req, res) => {
  Pergunta.findAll({
    raw: true, order: [
      ['id', 'DESC'] // ASC = Crescente || DESC = Decrescente 
    ]
  }).then(perguntas => {
    //console.log(perguntas);
    res.render("index", {
      perguntas: perguntas
    });
  });
  // SELECT * ALL FROM perguntas
  // res.send("Bem vindo ao meu site!");
  // res.render("index");
  // res.render("home");
  // var nome = "ÉrikDMCosta";
  // var lang = "JavaScript";
  // var nome = req.params.nome;
  // var lang = req.params.lang;
  // var exibirMsg = false;
  // res.render("principal/perfil");

  //   var produtos = [
  //     {nome: "Doritos",preco: 3.14},
  //     {nome: "Coca-cola",preco:5},
  //     {nome: "Leite",preco:1.45},
  //     {nome: "Carne", preco:15},
  //     {nome: "Redbull", preco: 6},
  //     {nome: "Nescau", preco: 4}
  // ]

  // res.render("index",{
  //   // nome: "ÉrikDMCosta",
  //   // lang: "JavaScript",
  //   nome: nome,
  //   lang: lang,
  //   empresa: "Guia do Programador",
  //   inscritos: 8040,
  //   msg: exibirMsg,
  //   produtos: produtos
  // });
  // res.render("index");
});
app.get("/perguntar", (req, res) => {
  res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) => {
  var titulo = req.body.titulo;
  var descricao = req.body.descricao;
  // res.send("Formulário recebido! titulo " + titulo + " " + " descricao " + descricao);
  // '' INSERT INTO perguntas ... Pergunta

  var titulo = req.body.titulo;
  var descricao = req.body.descricao;

  Pergunta.create({
    // titulo: {
    //   type: Sequelize.STRING,
    //   allowNull: false
    // },
    // descricao: {
    //   type: Sequelize.TEXT,
    //   allowNull: false
    // }
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id", (req, res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: { id: id }
  }).then(pergunta => {
    if (pergunta != undefined) { // Pergunta encontrada
      Resposta.findAll({
        where: {
          perguntaId: pergunta.id
        },
        order: [
          ['id', 'DESC']
        ]
      }).then(respostas => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas
        });
      });
    } else { // Não encontrada
      res.redirect("/");
    }
  });
})

app.post("/responder", (req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId); // Exemplo: res.redirect("/pergunta/3");
  });
});

app.listen(8080, () => { console.log("App rodando!"); })