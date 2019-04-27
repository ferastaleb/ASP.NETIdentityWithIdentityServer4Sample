
$(document).ready(function () {
    function log() {
        document.getElementById('results').innerText = '';

        Array.prototype.forEach.call(arguments, function (msg) {
            if (msg instanceof Error) {
                msg = "Error: " + msg.message;
            }
            else if (typeof msg !== 'string') {
                msg = JSON.stringify(msg, null, 2);
            }
            document.getElementById('results').innerHTML += msg + '\r\n';
        });
    }

    var config = {
        authority: "https://localhost:5000",
        client_id: "spaclient",
        redirect_uri: "https://localhost:5003/callback.html",
        response_type: "code",
        scope: "openid profile identity.api test.api",
        post_logout_redirect_uri: "https://localhost:5003/index.html",
    };

    var mgr = new Oidc.UserManager(config);

    mgr.getUser().then(function (user) {
        if (user) {
            log("User logged in", user.profile);
        }
        else {
            log("User not logged in");
        }
    });

    $('#login').click(function () {
        mgr.signinRedirect();
    });
    $('#api').click(function () {
        mgr.getUser().then(function (user) {
            var url = "https://localhost:5001/api/test";

            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.onload = function () {
                log(xhr.status, JSON.parse(xhr.responseText));
            };
            xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
            xhr.send();
        });
    });

    $('#logout').click(function () {
        mgr.signoutRedirect();
    });
});
