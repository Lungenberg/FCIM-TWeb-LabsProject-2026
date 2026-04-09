(function() {
    var API_BASE = 'http://localhost:5000';

    // ── Auth state ────────────────────────────────────────────────────────────
    var user = null;
    try { user = JSON.parse(localStorage.getItem('musicstore_user')); } catch(e) {}

    // ── Render auth area ──────────────────────────────────────────────────────
    var authArea = document.getElementById('auth-area');
    if (authArea) {
        if (user) {
            authArea.innerHTML =
                '<span class="auth-user-name"><i class="fa-solid fa-user"></i> ' + escapeHtml(user.name) + '</span> ' +
                '<a href="#" class="auth-logout-link" id="auth-logout">Выйти</a>';
            document.getElementById('auth-logout').addEventListener('click', function(e) {
                e.preventDefault();
                fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' })
                    .finally(function() {
                        localStorage.removeItem('musicstore_user');
                        window.location.reload();
                    });
            });
        } else {
            var authPath = window.location.pathname.indexOf('/pages/') !== -1
                ? '../auth/auth.html'
                : 'pages/auth/auth.html';
            authArea.innerHTML =
                '<a href="' + authPath + '" class="auth-login-link"><i class="fa-solid fa-right-to-bracket"></i> Войти</a>';
        }
    }

    // ── Cart modal (inject on pages that don't already have one) ─────────────
    if (!document.getElementById('cart-modal')) {
        var overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        document.body.appendChild(overlay);

        var modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.innerHTML =
            '<div class="cart-modal-header">' +
                '<h3><i class="fa-solid fa-cart-shopping"></i> Корзина</h3>' +
                '<button id="cart-close" aria-label="Закрыть">&times;</button>' +
            '</div>' +
            '<div id="cart-items-list"></div>' +
            '<div class="cart-empty" id="cart-empty">Корзина пуста</div>' +
            '<div class="cart-footer" id="cart-footer">' +
                '<div class="cart-total">Итого: <strong id="cart-total-val">$0</strong></div>' +
                '<button class="btn btn-primary cart-checkout-btn" id="nav-checkout-btn">' +
                    '<i class="fa-solid fa-paper-plane"></i> Оформить заказ' +
                '</button>' +
            '</div>';
        document.body.appendChild(modal);

        document.getElementById('cart-close').addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);

        document.getElementById('nav-checkout-btn').addEventListener('click', function() {
            if (!user) { window.location.href = resolveAuthPath(); return; }
            var items = currentCart;
            if (!items || items.length === 0) { return; }
            fetch(API_BASE + '/api/orders/checkout', { method: 'POST', credentials: 'include' })
                .then(function(res) { return res.ok ? res.json() : Promise.reject(); })
                .then(function() {
                    currentCart = [];
                    renderModal();
                    updateBadges(0);
                    alert('Заказ оформлен!');
                    closeModal();
                })
                .catch(function() { alert('Ошибка при оформлении заказа'); });
        });

        document.getElementById('cart-items-list').addEventListener('click', function(e) {
            var btn = e.target.closest('[data-action]');
            if (!btn) return;
            var id = parseInt(btn.dataset.id);
            var action = btn.dataset.action;
            if (action === 'inc') {
                cartRequest('PUT', id, parseInt(btn.dataset.qty) + 1);
            } else if (action === 'dec') {
                var q = parseInt(btn.dataset.qty);
                if (q > 1) cartRequest('PUT', id, q - 1);
                else cartRequest('DELETE', id, null);
            } else if (action === 'remove') {
                cartRequest('DELETE', id, null);
            }
        });
    }

    // ── Cart button intercept ─────────────────────────────────────────────────
    document.querySelectorAll('.cart-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });

    // ── Cart state & helpers ──────────────────────────────────────────────────
    var currentCart = [];

    function openModal() {
        if (user) {
            fetch(API_BASE + '/api/cart', { credentials: 'include' })
                .then(function(res) { return res.ok ? res.json() : []; })
                .then(function(items) {
                    currentCart = items;
                    renderModal();
                    updateBadges(items.reduce(function(s,i){return s+i.qty;},0));
                }).catch(function() {});
        } else {
            currentCart = [];
            renderModal();
        }
        document.getElementById('cart-modal').classList.add('open');
        document.getElementById('cart-overlay').classList.add('open');
    }

    function closeModal() {
        document.getElementById('cart-modal').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('open');
    }

    function renderModal() {
        var list   = document.getElementById('cart-items-list');
        var empty  = document.getElementById('cart-empty');
        var footer = document.getElementById('cart-footer');
        var total  = document.getElementById('cart-total-val');
        if (!list) return;
        list.innerHTML = '';
        if (!currentCart || currentCart.length === 0) {
            empty.style.display  = 'block';
            footer.style.display = 'none';
            return;
        }
        empty.style.display  = 'none';
        footer.style.display = 'block';
        var sum = 0;
        currentCart.forEach(function(item) {
            sum += item.albumPrice * item.qty;
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
        total.textContent = '$' + sum;
    }

    function cartRequest(method, id, qty) {
        var url = API_BASE + '/api/cart' + (id ? '/' + id : '');
        var opts = { method: method, credentials: 'include', headers: { 'Content-Type': 'application/json' } };
        if (qty !== null) opts.body = JSON.stringify({ qty: qty });
        fetch(url, opts)
            .then(function() {
                return fetch(API_BASE + '/api/cart', { credentials: 'include' });
            })
            .then(function(res) { return res.ok ? res.json() : []; })
            .then(function(items) {
                currentCart = items;
                renderModal();
                updateBadges(items.reduce(function(s,i){return s+i.qty;},0));
            }).catch(function() {});
    }

    function updateBadges(count) {
        document.querySelectorAll('.cart-badge').forEach(function(b) { b.textContent = count; });
    }

    function resolveAuthPath() {
        return window.location.pathname.indexOf('/pages/') !== -1
            ? '../auth/auth.html'
            : 'pages/auth/auth.html';
    }

    function escapeHtml(str) {
        return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    // ── Update badge on load ──────────────────────────────────────────────────
    if (user) {
        fetch(API_BASE + '/api/cart', { credentials: 'include' })
            .then(function(res) { return res.ok ? res.json() : []; })
            .then(function(items) {
                updateBadges(items.reduce(function(s,i){return s+i.qty;},0));
            }).catch(function() {});
    }
})();

