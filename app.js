const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

const app = express();

app.use(cors());

//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.get('/', (req, res) => {
//   res.json(db.users);
// });

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.handleProfile(db));

app.put('/image', image.handleImage(db));

app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

app.post('/imageurlgrpc', (req, res) => {
  image.handleGrpcCall(req, res);
});

app.listen(3000, () => {
  console.log('app is running on port 3000');
});
