import './styles.css';
import './components/nav-bar.js';
import './components/login-form.js';
import './components/product-card.js';

const app = document.getElementById('app');

const renderApp = async () => {
  // Basic demo content that fetches products and users
  app.innerHTML = `
    <section>
      <h2>Login</h2>
      <login-form></login-form>
    </section>
    <section>
      <h2>Products</h2>
      <div id="products" class="grid"></div>
    </section>
    <section>
      <h2>Users</h2>
      <ul id="users"></ul>
    </section>
  `;

  try {
    const [prodRes, usersRes] = await Promise.all([
      fetch('http://localhost:4000/api/products'),
      fetch('http://localhost:4000/api/users'),
    ]);
    const products = await prodRes.json();
    const users = await usersRes.json();

    const productsEl = document.getElementById('products');
    productsEl.innerHTML = products
      .map(p => `<product-card .data='${JSON.stringify(p).replace(/'/g, "\\'")}'></product-card>`)
      .join('\n');

    const usersEl = document.getElementById('users');
    usersEl.innerHTML = users.map(u => `<li>${u.name} (${u.username})</li>`).join('\n');
  } catch (err) {
    console.warn('Could not fetch demo data (is backend running?)', err);
  }
};

renderApp();
