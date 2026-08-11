import { updateCartBadge } from "./app.js";

export const renderCart = () => {
  const container = document.getElementById('cart-items-list');
  const subtotalEl = document.getElementById('cart-subtotal');
  const totalEl = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  if (!container) return;

  const cart = JSON.parse(localStorage.getItem('kk_cart') || '[]');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <h3 class="empty-state-title">Your cart is empty.</h3>
        <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Start Shopping</a>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = "$0.00";
    if (totalEl) totalEl.textContent = "$0.00";
    if (checkoutBtn) checkoutBtn.style.pointerEvents = 'none';
    return;
  }

  if (checkoutBtn) checkoutBtn.style.pointerEvents = 'auto';

  let subtotal = 0;

  container.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    return `
      <div style="display: flex; align-items: center; justify-content: space-between; background: white; border: 1px solid var(--border); padding: 1rem; border-radius: 12px; gap: 1rem;">
        <img src="${item.imageUrl || 'assets/images/placeholder.webp'}" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
        <div style="flex: 1;">
          <h4 style="font-size: 1rem; font-weight: 700;">${item.name}</h4>
          <p style="color: var(--primary); font-weight: 700;">$${Number(item.price).toFixed(2)}</p>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <button class="btn btn-outline qty-btn" data-id="${item.id}" data-action="dec" style="padding: 0.3rem 0.6rem;">-</button>
          <span style="font-weight: 700; width: 24px; text-align: center;">${item.quantity}</span>
          <button class="btn btn-outline qty-btn" data-id="${item.id}" data-action="inc" style="padding: 0.3rem 0.6rem;">+</button>
        </div>
        <button class="remove-btn" data-id="${item.id}" style="background: none; border: none; color: #EF4444; cursor: pointer; padding: 0.5rem;">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
        </button>
      </div>
    `;
  }).join('');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Event Listeners for Cart Management
  container.querySelectorAll('.qty-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const action = e.currentTarget.dataset.action;
      let currentCart = JSON.parse(localStorage.getItem('kk_cart') || '[]');
      const target = currentCart.find(i => i.id === id);

      if (target) {
        if (action === 'inc') target.quantity += 1;
        if (action === 'dec') target.quantity = Math.max(1, target.quantity - 1);
        localStorage.setItem('kk_cart', JSON.stringify(currentCart));
        renderCart();
        updateCartBadge();
      }
    });
  });

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      let currentCart = JSON.parse(localStorage.getItem('kk_cart') || '[]');
      currentCart = currentCart.filter(i => i.id !== id);
      localStorage.setItem('kk_cart', JSON.stringify(currentCart));
      renderCart();
      updateCartBadge();
      window.showToast("Item removed from cart");
    });
  });
};

document.addEventListener('DOMContentLoaded', renderCart);
