const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config(); // Carregar variáveis de ambiente do .env

const app = express();

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.log('Erro ao conectar ao MongoDB', err));

// Configurar o template engine (EJS, por exemplo)
app.set('view engine', 'ejs');

// Configurar o middleware para arquivos estáticos (CSS, JS, etc)
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

// Rota inicial (Home)
app.get('/', (req, res) => {
  res.render('index');
});

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
