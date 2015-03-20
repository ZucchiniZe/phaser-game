var express = require('express');
var morgan = require('morgan')
var app = express();

app.use(morgan('dev'));

app.use(express.static(__dirname + '/static'));

var port = process.env.PORT || 3000;
app.listen(port);

console.log('Listening on port', port);
