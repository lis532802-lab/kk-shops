import { subscribeAuthState } from "../firebase/auth.js";
import { subscribeUserOrders } from "../firebase/firestore.js";

subscribeAuthState((user) => {
  const container = document.getElementById('orders-list-container');
  if (!container) return;

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  subscribeUserOrders(user.uid, (orders) => {
    if (orders.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3 class="empty-state-title">No orders placed yet.</h3>
          <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Shop Now</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => `
      <div style="background: white; border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.8rem;">
          <div>
            <span style="font-weight: 700;">Order #${order.id}</span>
          </div>
          <span style="padding: 0.3rem 0.8rem; border-radius: 50px; font-size: 0.8rem; font-weight: 700; background: var(--primary-light); color: var(--primary);">${order.status || 'Pending'}</span>
        </div>
        <div>
          ${(order.items || []).map(item => `
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.4rem;">
              <span>${item.name} x${item.quantity}</span>
              <span style="font-weight: 600;">$${Number(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1rem; text-align: right; font-weight: 800; font-size: 1.1rem; color: var(--primary);">
          Total: $${Number(order.totalAmount || 0).toFixed(2)}
        </div>
      </div>
    `).join('');
  });
});
