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
        if ($message.val()) {
            socket.emit('send-message', {
                msg: $message.val(),
                date: new Date()
            });
            $message.css('border', '1px solid #ced4da');
        } else {
            $message.css('border', '1px solid red');
        }
        $message.val('');
        // console.log($message.val());
    });

    // user login
    $userForm.submit(e => {
        e.preventDefault();
        socket.emit('user-login', $username.val(), (data) => {
            console.log(data);
            if (data) {
                $userFormArea.hide();
                $messageArea.css('display', 'flex');
            }
        });
        $username.val('');
        // console.log($message.val());
    });

    socket.on('new-message', data => {
        $chat.append('<div class="card message"><strong>' + data.user + '</strong> <div class="card-body">' + data.msg +
            '</div><br><div class="card-footer"><small>' +
            data.date + '</small></div></div>');
    })

    socket.on('get-users', (data) => {
        let html = "";
        for (i = 0; i < data.length; i++) {
            html += '<li class="list-group-item user"> ' + data[i] + ' </li>';
        }
        $users.html(html);
    })

});