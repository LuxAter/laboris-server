const express = require('express');

var os = require('os');

var cookieParser = require('cookie-parser');
var formParser = require('express-form-data');
var session = require('cookie-session');

var passport = require('passport');

var mongoose = require('mongoose');

var apiRouter = require('./routes/api/index.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(formParser.parse({uploadDir: os.tmpdir(), autoClean: true}));
app.use(formParser.format());
app.use(formParser.stream());
app.use(formParser.union());
app.use(session({name:'session',secret:'laboris',resave:false,saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());

const mongodb = 'mongodb://ardenrasmussen:Tristan11@ds233452.mlab.com:33452/laboris';
mongoose.connect(mongodb);
mongoose.Promise=global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  console.log(req.body)
  console.log(req.user)
  res.send("World!")
});

app.use('/api/', apiRouter)

app.listen(3000);
