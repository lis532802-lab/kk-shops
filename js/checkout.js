import { subscribeAuthState } from "../firebase/auth.js";
import { createOrderInDB } from "../firebase/firestore.js";
import { updateCartBadge } from "./app.js";

let currentUser = null;

subscribeAuthState((user) => {
  currentUser = user;
  if (!user) {
    window.location.href = "login.html?redirect=checkout.html";
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('checkout-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
      window.showToast("Please login to complete purchase", "error");
      return;
    }

    const cart = JSON.parse(localStorage.getItem('kk_cart') || '[]');
    if (cart.length === 0) {
      window.showToast("Your cart is empty!", "error");
      return;
    }

    const submitBtn = document.getElementById('place-order-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = "Processing Order...";

    try {
      const orderPayload = {
        userId: currentUser.uid,
        customerName: document.getElementById('cust-name').value,
        phone: document.getElementById('cust-phone').value,
        address: document.getElementById('cust-address').value,
        district: document.getElementById('cust-district').value,
        area: document.getElementById('cust-area').value,
        items: cart,
        totalAmount: cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      };

      const orderId = await createOrderInDB(orderPayload);
      localStorage.removeItem('kk_cart');
      updateCartBadge();

      // Show Inline Success Modal Container
      document.body.innerHTML = `
        <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAFAFA;">
          <div style="background: white; padding: 3rem; border-radius: 16px; text-align: center; max-width: 450px; border: 1px solid #E5E7EB;">
            <svg style="width: 64px; height: 64px; color: #10B981; margin-0 auto 1rem;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg>
            <h1 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 0.5rem;">Order Successful!</h1>
            <p style="color: #6B7280; margin-bottom: 1.5rem;">Order ID: <strong>${orderId}</strong></p>
            <a href="orders.html" class="btn btn-primary">Track My Orders</a>
          </div>
        </div>
      `;
    } catch (error) {
      console.error(error);
      window.showToast("Failed to place order. Try again.", "error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Place Order Now";
    }
  });
});
