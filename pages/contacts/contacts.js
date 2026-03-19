var form = document.getElementById('contact-form');

var successMsg = document.createElement('div');
successMsg.className = 'form-success';
successMsg.innerHTML = '<i class="fa-solid fa-circle-check"></i> Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами в течение 24 часов.';
form.parentNode.insertBefore(successMsg, form.nextSibling);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (validateAll()) {
        form.style.display = 'none';
        successMsg.style.display = 'block';
    }
});

form.addEventListener('reset', function() {
    ['userName', 'userEmail', 'userPhone', 'userMessage'].forEach(function(id) {
        clearError(id);
    });
    successMsg.style.display = 'none';
    form.style.display = '';
});

document.getElementById('userName').addEventListener('input', function() { validateName(true); });
document.getElementById('userEmail').addEventListener('input', function() { validateEmail(true); });
document.getElementById('userPhone').addEventListener('input', function() { validatePhone(true); });
document.getElementById('userMessage').addEventListener('input', function() { validateMessage(true); });

function validateAll() {
    var ok = true;
    if (!validateName()) ok = false;
    if (!validateEmail()) ok = false;
    if (!validatePhone()) ok = false;
    if (!validateMessage()) ok = false;
    return ok;
}

function validateName(silent) {
    var input = document.getElementById('userName');
    var val = input.value.trim();
    if (val.length < 2) {
        return setError(input, 'err-name', 'Введите имя (минимум 2 символа)');
    }
    if (!/^[А-ЯЁа-яёA-Za-z\s\-]+$/.test(val)) {
        return setError(input, 'err-name', 'Имя может содержать только буквы');
    }
    return setValid(input, 'err-name');
}

function validateEmail(silent) {
    var input = document.getElementById('userEmail');
    var val = input.value.trim();
    if (val === '') {
        return setError(input, 'err-email', 'Введите email');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val)) {
        return setError(input, 'err-email', 'Некорректный формат email (например: user@mail.com)');
    }
    return setValid(input, 'err-email');
}

function validatePhone(silent) {
    var input = document.getElementById('userPhone');
    var val = input.value.trim();
    if (val === '') {
        return setError(input, 'err-phone', 'Введите номер телефона');
    }
    var digits = val.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
        return setError(input, 'err-phone', 'Некорректный номер (от 7 до 15 цифр, допустим +, пробелы, дефисы)');
    }
    if (!/^[+\d][\d\s\-()]+$/.test(val)) {
        return setError(input, 'err-phone', 'Допустимы только цифры, +, пробелы и дефисы');
    }
    return setValid(input, 'err-phone');
}

function validateMessage(silent) {
    var input = document.getElementById('userMessage');
    var val = input.value.trim();
    if (val.length < 10) {
        return setError(input, 'err-message', 'Сообщение слишком короткое (минимум 10 символов)');
    }
    return setValid(input, 'err-message');
}

function setError(input, errId, message) {
    input.classList.remove('valid');
    input.classList.add('invalid');
    document.getElementById(errId).textContent = message;
    return false;
}

function setValid(input, errId) {
    input.classList.remove('invalid');
    input.classList.add('valid');
    document.getElementById(errId).textContent = '';
    return true;
}

function clearError(id) {
    var input = document.getElementById(id);
    if (!input) return;
    input.classList.remove('invalid', 'valid');
    var errMap = { userName: 'err-name', userEmail: 'err-email', userPhone: 'err-phone', userMessage: 'err-message' };
    var errEl = document.getElementById(errMap[id]);
    if (errEl) errEl.textContent = '';
}
