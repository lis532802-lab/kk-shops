import { subscribeAuthState, logoutUser } from "../firebase/auth.js";

// Global Toast System
window.showToast = (message, type = 'success') => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Render Global Floating Telegram Support Button
const renderSupportButton = () => {
  const btn = document.createElement('a');
  btn.href = 'https://t.me/DEVBRONX';
  btn.target = '_blank';
  btn.className = 'support-float';
  btn.innerHTML = `
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
    <span>Support</span>
  `;
  document.body.appendChild(btn);
};

// Update Local Cart Badge Count
export const updateCartBadge = () => {
  const cart = JSON.parse(localStorage.getItem('kk_cart') || '[]');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'inline-block' : 'none';
  });
};

// Shared Auth Navigation Sync
export const initNavbarAuth = () => {
  subscribeAuthState((user) => {
    const navActions = document.getElementById('nav-user-actions');
    if (!navActions) return;

    if (user) {
      const initial = user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U';
      navActions.innerHTML = `
        <a href="cart.html" class="nav-icon-btn">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="cart-badge">0</span>
        </a>
        <a href="profile.html" class="user-avatar" title="${user.displayName || 'Profile'}">${initial}</a>
      `;
    } else {
      navActions.innerHTML = `
        <a href="cart.html" class="nav-icon-btn">
          <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          <span class="cart-badge">0</span>
        </a>
        <a href="login.html" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.85rem;">Login</a>
      `;
    }
    updateCartBadge();
  });
};

document.addEventListener('DOMContentLoaded', () => {
  renderSupportButton();
  initNavbarAuth();
  updateCartBadge();
});
