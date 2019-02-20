const express = require('express');

const UserController = require('../controllers/user');

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post('/login', UserController.userLogin);

// router.post("/login", async (req, res, next) => {
//   try {
//     let user = await User.findOne({userName: req.body.email});
//     console.log(user);
//     if (!user) {
//       return res.status(401).send("Auth Failed");
//     }
//     const validPassword = await bcrypt.compareSync(req.body.password, user.password);
//     if (!validPassword) {
//       return res.status(401).send("Auth Failed");
//     }
//     const token = jwt.sign(
//     { email: user.email, userId: user._id },
//     "secret",
//     { expiresIn: "1h"} );

//     res.status(200).json({
//       token: token
//     });
//   }
//   catch (err) {
//   res.status(401).send("Auth Failed");
//   }
//  });

module.exports = router;

