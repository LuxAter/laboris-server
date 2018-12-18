const express = require('express');
require('dotenv').config()

var os = require('os');
var path = require('path');

var cookieParser = require('cookie-parser');
var formParser = require('express-form-data');
var session = require('cookie-session');

var passport = require('passport');

var mongoose = require('mongoose');

var apiRouter = require('./routes/api/index.js');

var cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(formParser.parse({uploadDir: os.tmpdir(), autoClean: true}));
app.use(formParser.format());
app.use(formParser.stream());
app.use(formParser.union());
app.use(session({name:'session',secret: process.env.SESSION_SECRET ,resave:false,saveUninitialized:true}));
app.use(express.static(path.join(__dirname, 'client/dist')));
app.use(cors({origin: 'http://localhost:8080', credentials: true}));


app.use(passport.initialize());
app.use(passport.session());

const mongodb = 'mongodb://admin:' + process.env.DB_SECRET + '@ds233452.mlab.com:33452/laboris';
mongoose.connect(mongodb, {useNewUrlParser: true});
mongoose.Promise=global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/', (req, res) => {
  console.log(req.body)
  console.log(req.user)
  res.send("World!")
});

app.use('/api/', apiRouter)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
})

console.log("Listening on", process.env.PORT || 8000);
app.listen(process.env.PORT || 8000);

