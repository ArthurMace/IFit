const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();

// Rota para exibir a página de criação de conta
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Rota para criar um novo usuário
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    res.redirect('/auth/login'); // Redireciona para a página de login
  } catch (error) {
    res.status(500).send('Erro ao salvar usuário');
  }
});

// Rota para exibir a página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Rota para fazer login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Usuário não encontrado");
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).send("Senha incorreta");
  }

  req.session.userId = user._id;  // Armazena o ID do usuário na sessão
  res.redirect('/profile');  // Redireciona para o perfil
});

module.exports = router;
