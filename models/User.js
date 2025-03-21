const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  photo: String,  // Para foto do perfil
  workouts: [String],  // Exemplo de postagens de treino
});

const User = mongoose.model('User', userSchema);

module.exports = User;
