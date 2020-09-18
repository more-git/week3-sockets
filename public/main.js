$(function() {
  var FADE_TIME = 150;
  var TYPING_TIMER_LENGTH = 400;
  var $window = $(window);
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  var username = "user";
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var socket = io.connect('localhost:3000');

  const sendMessage = () => {
    var message = $inputMessage.val();
    message = cleanInput(message);

    if (message) {
      $inputMessage.val('');
      addMessage({
        username: username,
        message: message
      });

      socket.emit('new message', message);
    }
  }

  const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  const addMessage = (data, options) => {
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var $usernameDiv = "";
    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
    $('#banner').empty().append( "<div class=\"jumbotron jumbotron-fluid\"> <div class=\"container\"><h1 class=\"display-4\">" + data.message  + "</h1></div></div>");
  }

  const addMessageElement = (el, options) => {
    var $el = $(el);

    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;

  }

  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }


  const updateTyping = () => {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(() => {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  const getTypingMessages = (data) => {
    return $('.typing.message').filter(function (i) {
      return $(this).data('username') === data.username;
    });
  }

  $window.keydown(event => {
    if (event.which === 13) {
      if (username) {
        sendMessage();
      }
    }
  });


  $inputMessage.on('input', () => {
    updateTyping();
  });

  $inputMessage.click(() => {
    $inputMessage.focus();
  });

});


function setBanner() {
  var msg = document.getElementById('message').value;
  socket.emit('new message', msg);
  var $inputMessage = $('.inputMessage');
  var message = $inputMessage.val();
  $('#banner').empty().append( "<div class=\"jumbotron jumbotron-fluid\"> <div class=\"container\"><h1 class=\"display-4\">" + message  + "</h1></div></div>");

}