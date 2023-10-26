const express = require("express");
const mongoose = require("mongoose");
const User = require("./User");
const cors = require('cors');
//const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
require("dotenv").config({ path: "../../.env" });

mongoose.connect("mongodb://localhost:27017/users");

const app = express();
const corsOptions = {
  origin: true, 
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

function authenticateToken(req, res, next) {
  const token = req.cookies['auth-token'];
  const secretKey = process.env.SECRET_KEY;
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  jwt.verify(token, secretKey, (err, decodedToken) => {
    if (err) {
      return res.status(403).send('Invalid Token');
    }

    req.user = decodedToken; 
    next();
  });
}

app.post("/register", (req, res) => {
  const newUser = new User(req.body);
  newUser.save().then(
    (msg) => res.status(200).send(msg),
    (err) => res.status(401).send(err)
  );
});
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email: email }).then((user) => {
    if (!user) res.send("User Not Found.");
    if (password === user?.password) {
      const secretKey = process.env.SECRET_KEY;
      const token = jwt.sign(
        { id: user?._id, email: user.email },
        secretKey,
        { expiresIn: "1h" }
      );
      res.cookie("auth-token", token, { maxAge: 3600000, secure: false });
      res.send("OK");
    } else {
      res.send("Invalid Password");
    }
  });
});
app.get('/getuser', authenticateToken, (req, res) => {
  const token = req.cookies['auth-token'];
  const decodedToken = jwt.decode(token, process.env.SECRET_KEY);
  const now = Math.floor(Date.now() / 1000);
  const expirationTime = decodedToken.exp;
  const userID = decodedToken.id;
  if (now < expirationTime) 
    User.findById(userID,'-password').then(async (user) =>{
      res.status(200).send(user)
    })
  else res.send('Unauthorized');
  
});

app.listen(3001);
