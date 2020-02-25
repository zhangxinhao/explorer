var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var bitcoinCore = require("bitcoin-core");

var apiRouter = require('./routes/api');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/api', apiRouter);

app.onStartup = function () {
    var rpcClientProperties = {
        host: "127.0.0.1",
        port: 18332,
        username: 'user',
        password: '123456',
        timeout: 5000
    };

    global.rpcClient = new bitcoinCore(rpcClientProperties);
}

module.exports = app;
