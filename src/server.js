const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

mongoose
  .connect('mongodb://localhost:27017/teste2', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((success) => {
    console.log('MongoDB Online');
  })
  .catch((error) => {
    console.log(error);
  });

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    require: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

mongoose.model('User', UserSchema);

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.post('/user', async (req, res) => {
  const UserSchema = mongoose.model('User');
  const { email, password } = req.body;

  //busca para ver se email já esta cadastrado
  const ifexists = await UserSchema.findOne({ email });

  //valido se a variavel @ifexists é true, se sim ele cai na validação
  if (ifexists) {
    return res.status(404).json({ mesage: 'email ja cadastrado' });
  }

  const response = await UserSchema.create({
    email,
    password,
  });

  return res.status(201).json({ message: 'Usuario criado com sucesso' });
});

app.post('/login', async (req, res) => {
  const UserSchema = mongoose.model('User');
  const { email, password } = req.body;

  const response = await UserSchema.findOne({ email, password });

  if (!response) {
    return res.status(404).json({ mesage: 'usuario nao encontrado' });
  }

  return res.status(200).send();
});

app.listen(8080, () => {
  console.log('server is running');
});
