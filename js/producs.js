import { fetchProducts } from "../firebase/firestore.js";
import { updateCartBadge } from "./app.js";

let allProducts = [];

const renderEmptyState = (container) => {
  container.innerHTML = `
    <div class="empty-state">
      <svg class="empty-state-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
      <h3 class="empty-state-title">No products available yet.</h3>
      <p class="empty-state-desc">Products will automatically show here as soon as they are added to Firestore database.</p>
    </div>
  `;
};

export const renderProducts = (products, container) => {
  if (!products || products.length === 0) {
    renderEmptyState(container);
    return;
  }

  container.innerHTML = products.map(product => {
    const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
      : 0;

    return `
      <div class="product-card">
        ${discount > 0 ? `<span class="discount-badge">-${discount}%</span>` : ''}
        <img src="${product.imageUrl || 'assets/images/placeholder.webp'}" alt="${product.name}" class="product-thumb" loading="lazy">
        <div class="product-info">
          <span class="product-category">${product.category || 'General'}</span>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price-row">
            <span class="price">$${Number(product.price).toFixed(2)}</span>
            ${product.originalPrice ? `<span class="original-price">$${Number(product.originalPrice).toFixed(2)}</span>` : ''}
          </div>
          <div class="card-actions">
            <a href="product.html?id=${product.id}" class="btn btn-outline">Details</a>
            <button class="btn btn-primary add-cart-btn" data-id="${product.id}">Add</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Attach Add to Cart Quick Handlers
  container.querySelectorAll('.add-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const targetProduct = allProducts.find(p => p.id === id);
      if (targetProduct) {
        addToCart(targetProduct);
      }
    });
  });
};

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('kk_cart') || '[]');
  const existing = cart.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem('kk_cart', JSON.stringify(cart));
  updateCartBadge();
  window.showToast(`${product.name} added to cart!`);
};

// Initial Catalog Hydration
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-grid-container');
  if (!container) return;

  allProducts = await fetchProducts();
  renderProducts(allProducts, container);

  // Search Input Setup
  const searchInput = document.getElementById('live-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        (p.category && p.category.toLowerCase().includes(query))
      );
      renderProducts(filtered, container);
    });
  }
});
