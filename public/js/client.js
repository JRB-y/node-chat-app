$(function () {
    let socket = io.connect();
    // chat vars
    let $messageArea = $('#messageArea');
    let $messageForm = $('#messageForm');
    let $chat = $('#chat')
    let $message = $('#message');
    // user vars
    let $userFormArea = $('#userFormArea');
    let $userForm = $('#userForm');
    let $username = $('#username');
    // users area
    let $users = $('#users');

    // submit message
    $messageForm.submit(e => {
        e.preventDefault();
        socket.emit('send-message', $message.val());
        $message.val('');
        // console.log($message.val());
    });

    // user login
    $userForm.submit(e => {
        e.preventDefault();
        socket.emit('user-login', $username.val(), (data) => {
            if (data) {
                $userFormArea.hide();
                $messageArea.css('display', 'flex');
            }
        });
        $username.val('');
        // console.log($message.val());
    });

    socket.on('new-message', data => {
        $chat.append('<div class="card message"><strong>' + data.user + '</strong>' + data.msg +
            '</div>');
    })

    socket.on('get-users', (data) => {
        let html = "";
        for (i = 0; i < data.length; i++) {
            html += '<li class="list-group-item user"> ' + data[i] + ' </li>';
        }
        $users.html(html);
    })

});