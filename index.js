const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var app = express()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/hello", (req, res) => {
    res.send("Hello world");
  });

app.listen(3000, function()
{console.log(`Server is listening on port 3000`)})
module.exports = app;