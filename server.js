const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');

//
const signin = require('./controller/signin');
const register = require('./controller/register');
const image = require('./controller/image');
const user = require('./controller/user');

const app = express();
const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  }
});

app.use(express.json())
app.use(cors());

// app.get('/', (req, res) => {
//   db('users').select('*')
//     .then(users => res.json(users))
//     .catch(err => res.json('cannot get users data'));
// })

app.get('/profile/:id', user.getUserById())
app.post('/signin', signin.handleSignIn(bcrypt, db))
app.post('/register', register.handleRegister(bcrypt, db))
app.put('/image', image.increaseEntries(db))
app.post('/image', image.processImage())

app.listen(3000, () => {
  console.log('App is running on port 3000');
});
