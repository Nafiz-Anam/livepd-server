require('dotenv').config();

const http = require('http');
const app = require('./app');

const port = process.env.SERVER_PORT || 4000;
const server = http.createServer(app);
server.listen(process.env.SERVER_PORT,process.env.SERVER_ADDR);

console.log(process.env.SERVER_ADDR+':'+port);