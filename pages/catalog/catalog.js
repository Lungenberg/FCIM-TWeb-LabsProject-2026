var API_BASE = 'http://localhost:5000';

var cart = [];

// ── Fetch albums from API and render catalog cards ────────────────────────────
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

// Event delegation for order buttons (works with dynamically rendered cards)
document.querySelector('.catalog-grid').addEventListener('click', function(e) {
    var btn = e.target.closest('.order-btn');
    if (!btn) return;
    e.preventDefault();

    var card = btn.closest('.catalog-item');
    var name = card.querySelector('h3').textContent.trim();
    var priceText = card.querySelector('.price').childNodes[0].textContent;
    var price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;

    addToCart(name, price);
    showToast('«' + name + '» добавлен в корзину!');
});

function addToCart(name, price) {
    var existing = cart.find(function(item) {
        return item.name === name;
    });
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1 });
    }

    renderCart();
    updateBadge();
}

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
    cart.forEach(function(item, index) {
        total += item.price * item.qty;

        var div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML =
            '<span class="cart-item-name">' + escapeHtml(item.name) + '</span>' +
            '<div class="cart-item-qty">' +
                '<button data-action="dec" data-index="' + index + '">&#8722;</button>' +
                '<span>' + item.qty + '</span>' +
                '<button data-action="inc" data-index="' + index + '">&#43;</button>' +
            '</div>' +
            '<span class="cart-item-price">$' + (item.price * item.qty) + '</span>' +
            '<button class="cart-item-remove" data-action="remove" data-index="' + index + '" aria-label="Удалить">&#10005;</button>';
        list.appendChild(div);
    });

    totalEl.textContent = '$' + total;
}

document.getElementById('cart-items-list').addEventListener('click', function(e) {
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    var index = parseInt(btn.dataset.index);
    var action = btn.dataset.action;

    if (action === 'inc') {
        cart[index].qty += 1;
    } else if (action === 'dec') {

        if (cart[index].qty > 1) {
            cart[index].qty -= 1;
        } else {
            cart.splice(index, 1);
        }

    } else if (action === 'remove') {
        cart.splice(index, 1);
    }

    renderCart();
    updateBadge();
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
    renderCart();
    cartModal.classList.add('open');
    cartOverlay.classList.add('open');
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

