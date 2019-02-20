const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then((hash) => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user.save()
    .then((result) => {
      res.status(201).json({
        message: 'User Created!',
        result: result
      });
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        error: {
          message: 'Invalid Authentication Credentials!'
        }
      });
    });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      throw new Error('User not found');
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if (!result) {
      throw new Error('Invalid Credentials');
    }
    const token = jwt.sign({
      email: fetchedUser.email, userId: fetchedUser._id},
      process.env.JWT,
      { expiresIn: "1h" }
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id
    });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      message: 'Invalid Authentication Credentials!'
    });
  });
}
