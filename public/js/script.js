// login
document.getElementById('loginButton').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    fetch('/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('mainApp').style.display = 'block';
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
    alert('Failed to login: ' + error.message);
    });
});

// loading
document.getElementById('loadData').addEventListener('click', function() {
    fetch('/api/data')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => alert(data.message))
        .catch(error => alert('Failed to fetch data: ' + error.message));
});