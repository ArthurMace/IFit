const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => {
    console.log('Erro ao conectar ao MongoDB', err);
    process.exit(1); // Sai do processo em caso de erro de conexão
  });

// Configurar o template engine (EJS)
app.set('view engine', 'ejs');

// Configurar arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para parsing de corpo de requisição
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuração de sessão
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.render('index');
});

// Rota para tratar erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
