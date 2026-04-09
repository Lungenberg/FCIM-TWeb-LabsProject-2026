var API_BASE = 'http://localhost:5000';

var cart = []; // server-side cart items: { id, albumId, qty, albumTitle, albumArtist, albumPrice, albumImageUrl }
var isLoggedIn = false;

function checkAuth() {
    return fetch(API_BASE + '/api/auth/me', { credentials: 'include' })
        .then(function(res) {
            if (res.ok) {
                isLoggedIn = true;
                return res.json();
            }
            isLoggedIn = false;
            return null;
        })
        .catch(function() { isLoggedIn = false; return null; });
}

function initAuthUI() {
    checkAuth().then(function(user) {
        var authArea = document.getElementById('auth-area');
        if (!authArea) return;
        if (user) {
            authArea.innerHTML =
                '<span class="auth-user-name"><i class="fa-solid fa-user"></i> ' + escapeHtml(user.name) + '</span>' +
                ' <a href="#" id="logout-btn" class="auth-link">Выйти</a>';
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' })
                    .then(function() {
                        localStorage.removeItem('musicstore_user');
                        isLoggedIn = false;
                        cart = [];
                        renderCart();
                        updateBadge();
                        initAuthUI();
                    });
            });
            loadServerCart();
        } else {
            authArea.innerHTML = '<a href="../auth/auth.html" class="auth-link"><i class="fa-solid fa-right-to-bracket"></i> Войти</a>';
        }
    });
}

initAuthUI();

function loadServerCart() {
    return fetch(API_BASE + '/api/cart', { credentials: 'include' })
        .then(function(res) { return res.ok ? res.json() : []; })
        .then(function(items) {
            cart = items;
            renderCart();
            updateBadge();
        })
        .catch(function() { cart = []; });
}

function addToCartServer(albumId) {
    return fetch(API_BASE + '/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ albumId: albumId, qty: 1 })
    }).then(function() { loadServerCart(); });
}

function updateCartItemServer(cartItemId, qty) {
    return fetch(API_BASE + '/api/cart/' + cartItemId, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ qty: qty })
    }).then(function() { loadServerCart(); });
}

function removeCartItemServer(cartItemId) {
    return fetch(API_BASE + '/api/cart/' + cartItemId, {
        method: 'DELETE',
        credentials: 'include'
    }).then(function() { loadServerCart(); });
}

function checkoutServer() {
    return fetch(API_BASE + '/api/orders', {
        method: 'POST',
        credentials: 'include'
    })
    .then(function(res) {
        if (!res.ok) return res.json().then(function(d) { throw new Error(d.message || 'Ошибка оформления'); });
        return res.json();
    })
    .then(function(order) {
        cart = [];
        renderCart();
        updateBadge();
        closeCart();
        showToast('Заказ #' + order.id + ' оформлен! Сумма: $' + order.totalPrice);
    })
    .catch(function(err) {
        showToast(err.message);
    });
}

function loadAlbums() {
    var grid = document.querySelector('.catalog-grid');
    grid.innerHTML = '<p style="padding:20px">Загрузка...</p>';

    fetch(API_BASE + '/api/albums')
        .then(function(res) {
            if (!res.ok) throw new Error('Ошибка сервера: ' + res.status);
            return res.json();
        })
        .then(function(albums) {
            grid.innerHTML = '';
            if (albums.length === 0) {
                grid.innerHTML = '<p style="padding:20px">Альбомы не найдены.</p>';
                return;
            }
            albums.forEach(function(album) {
                var imgSrc = album.imageUrl
                    ? '../../' + album.imageUrl
                    : '../../assets/img/placeholder.jpg';
                var div = document.createElement('div');
                div.className = 'catalog-item';
                div.dataset.genre = album.genre;
                div.dataset.price = album.price;
                div.dataset.albumId = album.id;
                div.innerHTML =
                    '<div class="catalog-item-img-wrap">' +
                        '<a href="../contacts/contacts.html">' +
                            '<img src="' + escapeHtml(imgSrc) + '" alt="' + escapeHtml(album.artist) + '">' +
                        '</a>' +
                    '</div>' +
                    '<div class="catalog-item-body">' +
                        '<h3>' + escapeHtml(album.title) + '</h3>' +
                        '<p class="catalog-item-artist">' + escapeHtml(album.artist) + '</p>' +
                        '<p class="price">$' + album.price + '</p>' +
                        '<a href="#" class="btn btn-primary order-btn">Заказать</a>' +
                    '</div>';
                grid.appendChild(div);
            });
            document.querySelector('.catalog-count').textContent = albums.length + ' альбомов';
            filterCards();
        })
        .catch(function(err) {
            grid.innerHTML = '<p style="padding:20px;color:red">Не удалось загрузить каталог. Убедитесь, что сервер запущен.</p>';
            console.error(err);
        });
}

loadAlbums();

document.querySelector('.catalog-grid').addEventListener('click', function(e) {
    var btn = e.target.closest('.order-btn');
    if (!btn) return;
    e.preventDefault();

    if (!isLoggedIn) {
        showToast('Войдите в аккаунт, чтобы добавить в корзину');
        window.location.href = '../auth/auth.html';
        return;
    }

    var card = btn.closest('.catalog-item');
    var albumId = parseInt(card.dataset.albumId);
    var name = card.querySelector('h3').textContent.trim();

    addToCartServer(albumId);
    showToast('«' + name + '» добавлен в корзину!');
});

function renderCart() {
    var list = document.getElementById('cart-items-list');
    var empty = document.getElementById('cart-empty');
    var footer = document.getElementById('cart-footer');
    var totalEl = document.getElementById('cart-total-val');

    list.innerHTML = '';

    if (cart.length === 0) {
        empty.style.display = 'block';
        footer.style.display = 'none';
        return;
    }

    empty.style.display = 'none';
    footer.style.display = 'block';

    var total = 0;
    cart.forEach(function(item) {
        total += item.albumPrice * item.qty;

        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML =
            '<span class="cart-item-name">' + escapeHtml(item.albumTitle) + '</span>' +
            '<div class="cart-item-qty">' +
                '<button data-action="dec" data-id="' + item.id + '" data-qty="' + item.qty + '">&#8722;</button>' +
                '<span>' + item.qty + '</span>' +
                '<button data-action="inc" data-id="' + item.id + '" data-qty="' + item.qty + '">&#43;</button>' +
            '</div>' +
            '<span class="cart-item-price">$' + (item.albumPrice * item.qty) + '</span>' +
            '<button class="cart-item-remove" data-action="remove" data-id="' + item.id + '" aria-label="Удалить">&#10005;</button>';
        list.appendChild(div);
    });

    totalEl.textContent = '$' + total;
}

document.getElementById('cart-items-list').addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var cartItemId = parseInt(btn.dataset.id);
    var action = btn.dataset.action;

    if (action === 'inc') {
        var currentQty = parseInt(btn.dataset.qty);
        updateCartItemServer(cartItemId, currentQty + 1);
    } else if (action === 'dec') {
        var qty = parseInt(btn.dataset.qty);
        if (qty > 1) {
            updateCartItemServer(cartItemId, qty - 1);
        } else {
            removeCartItemServer(cartItemId);
        }
    } else if (action === 'remove') {
        removeCartItemServer(cartItemId);
    }
});

function updateBadge() {
    var total = cart.reduce(function(sum, item) {
        return sum + item.qty; 
    }, 0);
    
    document.querySelector('.cart-badge').textContent = total;
}

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

var cartModal = document.getElementById('cart-modal');
var cartOverlay = document.getElementById('cart-overlay');

document.getElementById('cart-toggle').addEventListener('click', function(e) {
    e.preventDefault();
    openCart();
});

document.getElementById('cart-close').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function openCart() {
    if (isLoggedIn) {
        loadServerCart().then(function() {
            renderCart();
        });
    } else {
        cart = [];
        renderCart();
    }
    cartModal.classList.add('open');
    cartOverlay.classList.add('open');
}

var checkoutBtn = document.querySelector('.cart-checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (!isLoggedIn) {
            window.location.href = '../auth/auth.html';
            return;
        }
        if (cart.length === 0) {
            showToast('Корзина пуста');
            return;
        }
        checkoutServer();
    });
}

function closeCart() {
    cartModal.classList.remove('open');
    cartOverlay.classList.remove('open');
}

function showToast(message) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

var slider = document.getElementById('price-slider');
var priceVal = document.getElementById('price-val');

slider.addEventListener('input', function() {
    priceVal.textContent = '$' + this.value;
});

document.querySelectorAll('.genre-check').forEach(function(checkbox) {
    checkbox.addEventListener('change', filterCards);
});

function filterCards() {
    var active = [];
    document.querySelectorAll('.genre-check:checked').forEach(function(cb) {
        active.push(cb.dataset.genre);
    });

    document.querySelectorAll('.catalog-item').forEach(function(card) {
        if (active.length === 0 || active.includes(card.dataset.genre)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

