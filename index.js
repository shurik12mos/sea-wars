const express    = require('express');
const mongoose   = require('mongoose');
const helmet     = require('helmet');
const bodyParser = require('body-parser');
const morgan     = require('morgan');
const bluebird   = require('bluebird');

const config = require('./config');
const routes = require('./routes');
const socketModule = require('./socket/');

const app  = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

mongoose.Promise = bluebird;
mongoose.connect(config.mongo.url);

app.use(express.static(__dirname + config.static.client));
app.use(express.static(__dirname + config.static.node));
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

socketModule(io);

app.use('/', routes);

http.listen(config.server.port, () => {
  console.log(`Magic happens on port ${config.server.port}`);
  console.log(`Env ${process.env.NODE_ENV}`);
});

module.exports = app;
