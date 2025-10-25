import './styles.css';
import './components/nav-bar.js';
import './components/login-form.js';
import './components/product-card.js';

const app = document.getElementById('app');

const renderApp = async () => {
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
          <h2>QA Resources</h2>
          <div id="resources" class="resource-list"></div>
        </section>
      </div>

      <aside class="side-column">
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

    const productsEl = document.getElementById('products');
    productsEl.innerHTML = products
      .map(p => `<product-card .data='${JSON.stringify(p).replace(/'/g, "\\'")}'></product-card>`)
      .join('\n');

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
  } catch (err) {
    console.warn('Could not fetch demo data (is backend running?)', err);
  }
};

renderApp();
