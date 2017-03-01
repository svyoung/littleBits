// server.js
// load the things we need
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var path = require('path');


var fs = require('fs');
var content = fs.readFileSync('./bits.json');
var pc = fs.readFileSync('./pc.json');
var bits = JSON.parse(content);

// set the view engine to ejs
app.engine('.html', require('ejs').__express);
app.set('views', __dirname);
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

// index page
app.get('/', function(req, res) {
    res.render('index', {bits: bits});
});

io.on('connection', function(socket){
    socket.on('send bits', function(data){
        var lastBitId = parseInt(bits[0].bitId);
        var newBit = {
            bitId: ++lastBitId,
            content: data.bittext
        };

        var ppc = JSON.parse(pc);
        var response = {
            text: data.bittext
        };
        
        // code to confirm passcode match
        // code to add new bits to existing bits.json
        // code to write into bits.json file
        
        io.emit('receive bits', response);
    });
});


http.listen(8090);
// console.log(io);
