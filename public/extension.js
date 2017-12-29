(function(ext) {
  var scriptpath = document.currentScript.src.match(/.*\//);
  var serverpath = scriptpath + '';
  // Socket.IOスクリプトを読み込んでから各種挙動を定義
  $.getScript(scriptpath + 'socket.io/socket.io.js')
    .done(function() {
      var socket = io.connect(serverpath);
      var received = false;
      var from = '';
      var subject = '';
      var text = '';
      socket.on('receive_mail', function(data) {
        from = data.from;
        subject = data.subject;
        text = data.text;
        received = true;
      });
      // Cleanup function when the extension is unloaded
      ext._shutdown = function() {};
      // Status reporting code
      // Use this to report missing hardware, plugin or unsupported browser
      ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
      };
      // メール送信
      ext.send_mail = function(to, subject, text) {
        socket.emit(
          'send_mail', {to: to, subject: subject, text: text}
        );
      };
      // 送信元アドレス
      ext.from = function() {
        return from;
      };
      // 件名
      ext.subject = function() {
        return subject;
      };
      // 本文
      ext.text = function() {
        return text;
      };
      // メール受信
      ext.received = function() {
        if (received === true) {
          received = false;
          return true;
        }
        return false;
      };
      // Block and block menu descriptions
      var descriptor = {
        blocks: [
          // Block type, block name, function name
          [' ', '%s 宛にメールを送信する。件名 %s 、本文 %s', 'send_mail', '', '', ''],
          ['r', '受信メールのfromアドレス', 'from'],
          ['r', '受信メールの件名', 'subject'],
          ['r', '受信メールの本文', 'text'],
          ['h', 'メールを受信', 'received']
        ]
      };

      ScratchExtensions.register('ネコメールエクステンション', descriptor, ext);
    });
})({});
