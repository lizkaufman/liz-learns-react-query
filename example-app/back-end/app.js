var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var todosRouter = require('./routes/todos');

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/todos', todosRouter);

app.get('/', (req,res)=>{
    res.send("Send requests for todos to the /todos endpoint please!")
})

module.exports = app;
