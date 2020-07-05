const express = require('express');
const fs = require('fs');

let app = express();

app.use(express.static('public'));
app.get('/', function(req, res){
    res.redirect('/index.html');
});

app.listen(3000);