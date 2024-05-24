document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = [
        { username: 'admin', password: 'password' },
        { username: 'luan', password: '123456' },
        { username: 'roberto', password: '654321' }
    ];

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('loggedIn', true);
        window.location.href = 'index.html';
    } else {
        alert('Nome de usuário ou senha incorretos');
    }
});
