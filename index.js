require('dotenv').config();
var PORT = process.env.PORT || 3000;
var express = require('express');
var socketIO = require('socket.io');
var morgan = require('morgan');
var sendgrid = require('./models/sendgrid.js');
var multer = require('multer');
var inbound = multer({dest: './inbound/'});
var server = express()
  .use(function(req, res, next) {
  	res.header('Access-Control-Allow-Origin', req.headers.origin);
  	res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  	res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
  	res.header('Access-Control-Allow-Credentials', true);
  	res.header('Access-Control-Max-Age', '86400');
    next();
  })
  .use(morgan('dev', {immediate: true} ))
  .post('/inbound', inbound.single('file'), function(req, res) {
    // 必須パラメータのチェック
    if ('subject' in req.body && 'text' in req.body && 'from' in req.body) {
      var data = {from: req.body.from, subject: req.body.subject, text: req.body.text};
      console.log(data);
      io.sockets.emit('receive_mail', data);
      res.send('Success');
    } else {
      req.status(400).send({error: 'No subject and text in the body.'});
    }
  })
  .use(express.static('public'))
  .listen(PORT, function () {
	  console.log('Listening on port ' + PORT);
  });

var io = socketIO(server);
// Web Socketの準備
io.on('connection', function(socket) {
  // メール送信
  socket.on('send_mail', function(data) {
    console.log(data);
    var subject = data.subject;
    if(subject.indexOf('Re') !== 0){
      // 前方一致のときの処理
      subject = 'Re: ' + subject;
    }
    sendgrid.send(data.to, process.env.FROM, subject, data.text).then(function onFulfilled(result) {
      console.log(result);
    }).catch(function onRejected(error) {
      // io.to(socket.id).emit('enter_rejected');
    });
  });
  // 接続切断
  socket.on('disconnect', function() {});
});
