var socket = io.connect('http://localhost:3000')
socket.on('connect', function() {
    $('chat').addClass('connected');
})

socket.on('user message', message);

function message(from, msg) {
    $( '#banner' ).replaceWith( "<div class=\"jumbotron jumbotron-fluid\"> <div class=\"container\"><h1 class=\"display-4\">" + msg + "</h1></div></div>" );
    $("#panel").slideDown("slow");
}
