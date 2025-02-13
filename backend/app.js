const express = require('express');
const app = express();
const path = require('path');
var createError = require('http-errors');
var indexRouter = require('./routes/index');
var helmet = require('helmet');

const dotenv = require("dotenv");
dotenv.config({ path: './config.env' });

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port http://192.168.1.146:${PORT}`);
});

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("DataBase Was Connect"))
.catch((error)=> console.log("DataBase Was Not Connect" + error));

// Code For Favicon Error
app.use(express.static(path.join(__dirname, 'public')));
app.get('/favicon.ico', (req, res) => res.sendFile(path.join(__dirname, 'public', 'node-favicon.png')));

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use('/uploads', express.static('uploads'));
app.use('/client', express.static(path.join(__dirname, '/client')));
app.use('/gallery-image', express.static(path.join(__dirname, '/gallery-image')));
app.use('/main-banner-admin', express.static(path.join(__dirname, '/main-banner-admin')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Set the views directory (optional, defaults to './views')
app.set('views', path.join(__dirname, 'views'));

const cors = require('cors');

app.use(cors({
  origin: process.env.FROAPI,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));


app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(helmet());

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;