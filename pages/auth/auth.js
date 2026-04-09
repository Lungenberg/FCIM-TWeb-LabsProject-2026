var API_BASE = 'http://localhost:5000';

document.querySelectorAll('.auth-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
        document.querySelectorAll('.auth-tab').forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        var target = tab.dataset.tab;
        document.getElementById('login-form').style.display = target === 'login' ? '' : 'none';
        document.getElementById('register-form').style.display = target === 'register' ? '' : 'none';

        document.getElementById('login-error').textContent = '';
        document.getElementById('register-error').textContent = '';
    });
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var errEl = document.getElementById('login-error');
    errEl.textContent = '';

    var email = document.getElementById('login-email').value.trim();
    var password = document.getElementById('login-password').value;

    if (!email || !password) {
        errEl.textContent = 'Заполните все поля.';
        return;
    }

    var btn = this.querySelector('.auth-submit');
    btn.disabled = true;
    btn.textContent = 'Вход...';

    fetch(API_BASE + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password })
    })
    .then(function(res) {
        if (!res.ok) return res.json().then(function(d) { throw new Error(d.message || 'Ошибка входа'); });
        return res.json();
    })
    .then(function(user) {
        localStorage.setItem('musicstore_user', JSON.stringify(user));
        window.location.href = '../catalog/catalog.html';
    })
    .catch(function(err) {
        errEl.textContent = err.message;
    })
    .finally(function() {
        btn.disabled = false;
        btn.textContent = 'Войти';
    });
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    var errEl = document.getElementById('register-error');
    errEl.textContent = '';

    var name     = document.getElementById('reg-name').value.trim();
    var email    = document.getElementById('reg-email').value.trim();
    var password = document.getElementById('reg-password').value;
    var password2 = document.getElementById('reg-password2').value;

    if (!name || !email || !password || !password2) {
        errEl.textContent = 'Заполните все поля.';
        return;
    }
    if (password.length < 6) {
        errEl.textContent = 'Пароль должен содержать минимум 6 символов.';
        return;
    }
    if (password !== password2) {
        errEl.textContent = 'Пароли не совпадают.';
        return;
    }

    var btn = this.querySelector('.auth-submit');
    btn.disabled = true;
    btn.textContent = 'Регистрация...';

    fetch(API_BASE + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email, password: password, name: name })
    })
    .then(function(res) {
        if (!res.ok) return res.json().then(function(d) { throw new Error(d.message || 'Ошибка регистрации'); });
        return res.json();
    })
    .then(function(user) {
        localStorage.setItem('musicstore_user', JSON.stringify(user));
        window.location.href = '../catalog/catalog.html';
    })
    .catch(function(err) {
        errEl.textContent = err.message;
    })
    .finally(function() {
        btn.disabled = false;
        btn.textContent = 'Зарегистрироваться';
    });
});

fetch(API_BASE + '/api/auth/me', { credentials: 'include' })
    .then(function(res) {
        if (res.ok) window.location.href = '../catalog/catalog.html';
    })
    .catch(function() {});
