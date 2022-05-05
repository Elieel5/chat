const express = require('express');
const path = require('path');
const http = require('http');
const PORT = 3000;

const app = express();
const server = http.createServer(app);


server.listen(PORT);
app.use(express.static(path.join(__dirname, 'public')));


