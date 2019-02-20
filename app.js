const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

// const cors = require('cors');

const mongoose = require('mongoose');

const app = express();


mongoose.connect(
  'mongodb+srv://jitter:' +
    process.env.MONGO_ATLAS_PWD +
    '@cluster0-mkl74.azure.mongodb.net/node-angular?retryWrites=true')
.then(() => {
  console.log('Connected to Database');
})
.catch(() => {
  console.log('Connection Failed!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use('/images', express.static(path.join('images')));
app.use('/', express.static(path.join(__dirname, 'angular')));

// app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

module.exports = app;
