const handleSignIn = (bcrypt, db) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json('email and password invalid.')
  }
  db('login').select('email', 'hash')
    .where('email', '=', email)
    .then(login => {
      const isValid = bcrypt.compareSync(password, login[0].hash);
      if (isValid) {
        db('users').select('*')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('can not get user.'))
      }
      else {
        res.status(400).json('wrong credentials');
      }
    }).catch(err => res.status(400).json('wrong credentials'))
}

module.exports = { handleSignIn: handleSignIn };