var express = require('express');
var router = express.Router();
const userModel = require('../models/users');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Sign up
router.post('/sign-up', async (req, res) => {

  const searchUser = await userModel.findOne({ email: req.body.email });
  let user;

  if (searchUser === null) {
    const hash = bcrypt.hashSync(req.body.password, 10)
    const newUser = new userModel({
      email: req.body.email,
      userName: req.body.userName,
      password: hash,
      lang: 'fr',
      token: uid2(32)
    });
    user = await newUser.save();
  };

  res.json({ user });
});


// Sign in
router.post('/sign-in', async (req, res) => {

  const user = await userModel.findOne({ email: req.body.email });

  if (bcrypt.compareSync(req.body.password, user.password)) {
    res.json({ userFound: true, user });
  } else {
    res.json({ userFound: false });
  };
});

module.exports = router;
