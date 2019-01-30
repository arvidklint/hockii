import express from 'express';
import { Server } from 'http';
import { Hub } from './Hub';

var app = express();
const http = new Server(app);


const hub = new Hub(http);

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/', function (req, res) {
    res.send('hello');
})

http.listen(3000, () => {
    console.log("Server running on port 3000");
});
