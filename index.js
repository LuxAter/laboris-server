require('dotenv').config()
const express = require('express');

const os = require('os');

var bodyParser = require('body-parser');
var formParser = require('express-form-data');

var mongoose = require('mongoose');

const app = express()

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(formParser.parse({uploadDir: os.tmpdir(), autoClean: true}));
app.use(formParser.format());
app.use(formParser.stream());
app.use(formParser.union());


app.get('/', (req, res) => {
  res.json({
    'success': false
  });
});

const mongodb = 'mongodb://admin:' + process.env.DB_SECRET + '@ds233452.mlab.com:33452/laboris';
mongoose.connect(mongodb, {
  useNewUrlParser: true,
  useFindAndModify: false
});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var apiRouter = require('./routes/api.js');
app.use('/api/', apiRouter);

const port = process.env.PORT | 8000;

console.log("\033[1;36m[express] Listening on port", port, "\033[0m");

app.listen(port);
