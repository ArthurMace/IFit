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

  if (!name || !email || !password) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send("Já existe uma conta com esse e-mail.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.redirect('/auth/login');
  } catch (error) {
    console.log('Erro ao cadastrar usuário:', error);
    res.status(500).send('Erro ao cadastrar usuário');
  }
});

// Rota para exibir a página de login
router.get('/login', (req, res) => {
  res.render('login');
});

// Rota para login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("E-mail e senha são obrigatórios.");
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Usuário não encontrado");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Senha incorreta");
    }

    req.session.userId = user._id;
    res.redirect('/profile');
  } catch (error) {
    console.log('Erro no login:', error);
    res.status(500).send('Erro ao fazer login');
  }
});

module.exports = router;
