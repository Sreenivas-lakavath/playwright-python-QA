import './styles.css';
import './components/nav-bar.js';
import './components/login-form.js';
import './components/product-card.js';

const app = document.getElementById('app');

const renderApp = async () => {
  // Inject a red gradient theme override (keeps existing stylesheet but forces a red look)
  if (!document.getElementById('theme-override')) {
    const style = document.createElement('style');
    style.id = 'theme-override';
    style.textContent = `
      :root{ --bg:#0f0b10; --panel:#1a0f12; --muted:#f3dede; --accent:#ff5a5f; --accent-2:#ff2d55; --card:#1f1214; }
      body{ background: linear-gradient(180deg, rgba(40,8,12,1) 0%, rgba(10,6,8,1) 100%); color: #ffecec; }
      .hero{ background: linear-gradient(90deg, rgba(255,90,95,0.08), rgba(255,45,85,0.03)); border-left:4px solid rgba(255,90,95,0.25); }
      .card{ background: linear-gradient(180deg, rgba(25,12,14,0.6), rgba(18,8,10,0.4)); border: 1px solid rgba(255,90,95,0.06); box-shadow: 0 6px 18px rgba(255,30,40,0.03); }
      h1,h2,h3{ color: #ffdfe1 }
      .btn{ background: linear-gradient(180deg,var(--accent),var(--accent-2)); color:#fff; border:none; padding:6px 10px; border-radius:6px; cursor:pointer }
      .btn.secondary{ background:transparent; color:#ffdfe1; border:1px solid rgba(255,90,95,0.12) }
      .grid.cards { display:grid; grid-template-columns: repeat(auto-fit,minmax(260px,1fr)); gap:16px }
      product-card{ display:block }
      product-card .thumb{ border-radius:8px; overflow:hidden }
  /* clickable tool cards */
  product-card[data-url]{ cursor:pointer }
  /* centered modal with backdrop */
  #product-details-backdrop{ display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:1198 }
  #product-details-modal.card{ display:none; position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); z-index:1200; max-width:420px; width:90%; background:linear-gradient(180deg,#2a0c0f,#1b0709); color:#fff; box-shadow:0 12px 34px rgba(0,0,0,0.6); border-radius:10px }
      .chip{ background: rgba(255,90,95,0.06); color:#ffdfe1; padding:2px 6px; border-radius:6px }
    `;
    document.head.appendChild(style);
  }
  // Basic demo content that fetches products and users
  app.innerHTML = `
    <div class="hero card">
      <div class="info">
        <h1>TestApp — Testing Playground</h1>
        <p class="muted">A small demo app designed for automation practice: web components, sample forms and product cards to experiment with Playwright & Selenium selectors.</p>
      </div>
      <div class="actions">
        <button class="btn" id="open-app" data-testid="open-app">Open App</button>
        <button class="btn secondary" id="open-storybook" data-testid="open-storybook">Storybook</button>
      </div>
    </div>

    <div class="sections">
      <div class="main-column">
        <section class="card">
          <h2>Featured Phones</h2>
          <div id="featured" class="grid cards"></div>
        </section>

        <section class="card">
          <h2>Login</h2>
          <login-form></login-form>
        </section>

        <section class="card">
          <h2>Products</h2>
          <div id="products" class="grid"></div>
        </section>

        <section class="card">
          <h2>Users</h2>
          <ul id="users"></ul>
        </section>

        <section class="card">
          <h2>Automation Tools</h2>
          <div id="automation-tools" class="grid cards"></div>
        </section>

        <section class="card">
          <h2>QA Resources</h2>
          <div id="resources" class="resource-list"></div>
        </section>
      </div>

      <aside class="side-column">
        <section class="card">
          <h2>Cart</h2>
          <div id="cart" data-testid="cart">
            <div class="muted">No items in cart</div>
          </div>
        </section>

        <section class="card">
          <h2>Sample Form for Testing</h2>
          <form id="sample-form" data-testid="sample-form">
            <label for="sample-name">Name</label>
            <input id="sample-name" name="name" placeholder="Full name" data-testid="sample-name" />

            <label for="sample-email">Email</label>
            <input id="sample-email" name="email" placeholder="you@example.com" data-testid="sample-email" />

            <label for="sample-phone">Phone</label>
            <input id="sample-phone" name="phone" placeholder="(555) 555-5555" data-testid="sample-phone" />

            <label for="sample-note" class="full">Note</label>
            <textarea id="sample-note" name="note" placeholder="Enter notes" data-testid="sample-note" class="full"></textarea>

            <label for="sample-role">Role</label>
            <select id="sample-role" name="role" data-testid="sample-role">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div class="full">
              <input type="checkbox" id="sample-optin" name="optin" data-testid="sample-optin" /> <label for="sample-optin">Opt-in</label>
            </div>

            <div>
              <input type="radio" id="radio-a" name="radio-choice" value="a" data-testid="sample-radio-a" /> <label for="radio-a">Choice A</label>
              <input type="radio" id="radio-b" name="radio-choice" value="b" data-testid="sample-radio-b" /> <label for="radio-b">Choice B</label>
            </div>

            <label for="sample-file" class="full">Upload</label>
            <input type="file" id="sample-file" name="file" data-testid="sample-file" class="full" />

            <div style="margin-top:8px" class="full">
              <button id="sample-submit" type="submit" data-testid="sample-submit" class="btn">Submit</button>
              <button id="sample-cancel" type="button" data-testid="sample-cancel" class="btn secondary">Cancel</button>
              <button id="sample-clear" type="button" data-testid="sample-clear" class="btn secondary">Clear</button>
            </div>
          </form>
        </section>

        <section class="card">
          <h2>Quick tips</h2>
          <p class="muted">Try selectors like <span class="chip">[data-testid="sample-name"]</span> or <span class="chip">login-form (shadow)</span>. Use the Storybook button to inspect components in isolation.</p>
        </section>
      </aside>
    </div>
  `;

    try {
    const [prodRes, usersRes] = await Promise.all([
      fetch('http://localhost:4000/api/products'),
      fetch('http://localhost:4000/api/users'),
    ]);
    const products = await prodRes.json();
    const users = await usersRes.json();

    // fallback sample products if backend returns empty list
    const sampleProducts = [
      { id: 'p-1', title: 'Blue Widget', price: '19.99', image: '/src/assets/phone-1.svg', description: 'Compact widget — great for demos' },
      { id: 'p-2', title: 'Red Gadget', price: '29.50', image: '/src/assets/phone-2.svg', description: 'Handy gadget for everyday tasks' },
      { id: 'p-3', title: 'Green Gizmo', price: '9.75', image: '/src/assets/phone-3.svg', description: 'Small gizmo for quick testing' }
    ];

    const resolvedProducts = (Array.isArray(products) && products.length) ? products : sampleProducts;

    const productsEl = document.getElementById('products');
    productsEl.innerHTML = resolvedProducts
      .map(p => `<product-card .data='${JSON.stringify(p).replace(/'/g, "\\'")}'></product-card>`)
      .join('\n');

    // Featured phones (demo items with images/specs)
    // Visible demo featured phones (use local open-source SVG assets)
    const featured = [
      { id: 'phone-1', title: 'Apex Phone Pro', price: '999.00', image: '/src/assets/phone-1.svg', description: '6.7" OLED • 128GB • 48MP camera' },
      { id: 'phone-2', title: 'Apex Phone Mini', price: '699.00', image: '/src/assets/phone-2.svg', description: '5.8" OLED • 64GB • 12MP camera' },
      { id: 'phone-3', title: 'Apex Phone SE', price: '499.00', image: '/src/assets/phone-3.svg', description: '6.1" LCD • 64GB • 12MP camera' }
    ];

    // render featured into the featured container
    const featuredEl = document.getElementById('featured');
  // add data-testid attribute so automation can find each card easily
  featuredEl.innerHTML = featured.map(p => `<product-card data-testid="product-${p.id}" .data='${JSON.stringify(p).replace(/'/g, "\\'")}'></product-card>`).join('\n');

    // Automation tools list (cards that open the tool's get-started page)
    const tools = [
      { id: 'playwright', title: 'Playwright', url: 'https://playwright.dev/docs/intro', image: '/src/assets/playwright.svg', description: 'End-to-end testing for modern web apps' },
      { id: 'cypress', title: 'Cypress', url: 'https://www.cypress.io/', image: '/src/assets/cypress.svg', description: 'Fast, easy and reliable testing for anything that runs in a browser' },
      { id: 'webdriverio', title: 'WebdriverIO', url: 'https://webdriver.io/docs/gettingstarted', image: '/src/assets/webdriverio.svg', description: 'Next-gen browser and mobile automation test framework' },
      { id: 'selenium', title: 'Selenium', url: 'https://www.selenium.dev/documentation/getting_started/', image: '/src/assets/selenium.svg', description: 'The WebDriver standard for browser automation' }
    ];

    const toolsEl = document.getElementById('automation-tools');
    toolsEl.innerHTML = tools.map(t => `<product-card data-testid="tool-${t.id}" data-url="${t.url}" .data='${JSON.stringify(t).replace(/'/g, "\\'")}'></product-card>`).join('\n');

    // Delegated click handler: clicking a tool card opens its get-started page in a new tab
    document.addEventListener('click', (ev) => {
      const host = ev.target.closest && ev.target.closest('product-card[data-url]');
      if (!host) return;
      const href = host.getAttribute('data-url');
      if (href) {
        window.open(href, '_blank', 'noopener');
      }
    });

    const usersEl = document.getElementById('users');
    usersEl.innerHTML = users.map(u => `<li>${u.name} (${u.username})</li>`).join('\n');

    // QA resources (curated links). Each resource has an id used for storing likes.
    const resources = [
      { id: 'r-docker', title: 'Docker — Get Started', url: 'https://docs.docker.com/get-started/' },
      { id: 'r-aws', title: 'AWS — Getting Started', url: 'https://aws.amazon.com/getting-started/' },
      { id: 'r-db-testing', title: 'Database Testing Guide', url: 'https://martinfowler.com/articles/microservice-testing/' },
      { id: 'r-storybook', title: 'Storybook Docs', url: 'https://storybook.js.org/docs/react/get-started/introduction' },
      { id: 'r-winscp', title: 'WinSCP (SFTP client)', url: 'https://winscp.net/eng/docs/start' },
      { id: 'r-putty', title: 'PuTTY — SSH client', url: 'https://www.chiark.greenend.org.uk/~sgtatham/putty/' },
      { id: 'r-testing-types', title: 'Testing Types & Pyramid', url: 'https://martinfowler.com/articles/practical-test-pyramid.html' },
      { id: 'r-reports', title: 'Test Reporting Best Practices', url: 'https://www.softwaretestinghelp.com/test-reporting/' },
      { id: 'r-gherkin', title: 'Gherkin & Cucumber', url: 'https://cucumber.io/docs/gherkin/reference/' },
      { id: 'r-npm-webapps', title: 'Build Web Apps with npm & Vite', url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Client-side_JavaScript_frameworks/Modern_web_development' },
      { id: 'r-microservices', title: 'What are Microservices (Martin Fowler)', url: 'https://martinfowler.com/articles/microservices.html' },
      { id: 'r-cmake', title: 'CMake Documentation', url: 'https://cmake.org/documentation/' },
      { id: 'r-iot', title: 'IoT Overview & Resources', url: 'https://www.iotforall.com/learn/iot' },
      { id: 'r-medium-qa', title: 'QA Interview Prep (Medium)', url: 'https://medium.com/tag/qa-interview-preparation' }
    ];

    const resourcesEl = document.getElementById('resources');

    // load likes from localStorage
    const storageKey = 'resourceLikes:v1';
    let likes = {};
    try {
      likes = JSON.parse(localStorage.getItem(storageKey) || '{}');
    } catch (e) {
      likes = {};
    }

    function saveLikes() {
      localStorage.setItem(storageKey, JSON.stringify(likes));
    }

    function renderResources() {
      resourcesEl.innerHTML = resources.map(r => {
        const count = likes[r.id] || 0;
        return `
          <div class="resource-row" data-resource-id="${r.id}">
            <a href="${r.url}" target="_blank" rel="noopener" data-testid="${r.id}-link">${r.title}</a>
            <button class="like-btn" data-testid="${r.id}-like">❤ <span class="like-count">${count}</span></button>
          </div>
        `;
      }).join('\n');

      // attach handlers
      resourcesEl.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (ev) => {
          const row = ev.currentTarget.closest('.resource-row');
          const id = row && row.getAttribute('data-resource-id');
          if (!id) return;
          likes[id] = (likes[id] || 0) + 1;
          saveLikes();
          const span = row.querySelector('.like-count');
          if (span) span.textContent = likes[id];
        });
      });
    }

    renderResources();

    // Simple cart implementation
    const cartEl = document.getElementById('cart');
    const cart = {}; // id -> { item, qty }

    function renderCart() {
      const entries = Object.values(cart);
      if (!entries.length) {
        cartEl.innerHTML = `<div class="muted">No items in cart</div>`;
        return;
      }
      cartEl.innerHTML = entries.map(e => `
        <div class="resource-row" data-cart-id="${e.item.id}">
          <div>${e.item.title} <small class="muted">x${e.qty}</small></div>
          <div>$${(parseFloat(e.item.price||0) * e.qty).toFixed(2)}</div>
        </div>
      `).join('\n') + `
        <div style="margin-top:8px"><strong>Total: $${entries.reduce((s, e) => s + (parseFloat(e.item.price||0) * e.qty), 0).toFixed(2)}</strong></div>`;
    }

    // Listen for add-to-cart events from product-card components
    document.addEventListener('add-to-cart', (ev) => {
      const item = ev.detail || {};
      const id = item.id || ('p-' + Math.random().toString(36).slice(2,7));
      if (!cart[id]) cart[id] = { item, qty: 0 };
      cart[id].qty += 1;
      renderCart();
    });

    // Show product details in a simple modal/panel
    // create backdrop and centered modal for product details
    const detailsBackdrop = document.createElement('div');
    detailsBackdrop.id = 'product-details-backdrop';
    detailsBackdrop.style.display = 'none';
    document.body.appendChild(detailsBackdrop);

    const detailsModal = document.createElement('div');
    detailsModal.id = 'product-details-modal';
    detailsModal.className = 'card';
    detailsModal.style.display = 'none';
    detailsModal.innerHTML = `<div id="details-content"></div><div style="text-align:right;margin-top:8px"><button id="details-close" class="btn secondary">Close</button></div>`;
    document.body.appendChild(detailsModal);

    // clicking backdrop closes modal
    detailsBackdrop.addEventListener('click', () => {
      detailsModal.style.display = 'none';
      detailsBackdrop.style.display = 'none';
    });

    document.addEventListener('product-details', (ev) => {
      const item = ev.detail || {};
      const content = document.getElementById('details-content');
      content.innerHTML = `
        <h3>${item.title}</h3>
        ${item.image ? `<img src="${item.image}" style="max-width:260px;border-radius:8px;display:block;margin-bottom:8px" />` : ''}
        <div class="muted">${item.description || ''}</div>
        <div style="margin-top:8px"><strong>Price: $${item.price || '0.00'}</strong></div>
        <div style="margin-top:8px"><button id="details-add" class="btn">Add to cart</button></div>
      `;
      detailsBackdrop.style.display = 'block';
      detailsModal.style.display = 'block';

      // wire close
      document.getElementById('details-close').onclick = () => {
        detailsModal.style.display = 'none';
        detailsBackdrop.style.display = 'none';
      };
      document.getElementById('details-add').onclick = () => { document.dispatchEvent(new CustomEvent('add-to-cart', { detail: item })); };
    });

  } catch (err) {
    console.warn('Could not fetch demo data (is backend running?)', err);
  }
};

renderApp();
