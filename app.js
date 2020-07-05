const express = require('express');
const fs = require('fs');

let app = express();

app.use(express.static('public'));

app.listen(3000);