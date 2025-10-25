import { LitElement, html, css } from 'lit';

class NavBar extends LitElement {
  static styles = css`
    nav{display:flex;align-items:center;justify-content:space-between}
    .brand{font-weight:700}
    .actions{display:flex;gap:12px}
    button{background:transparent;color:white;border:1px solid rgba(255,255,255,0.18);padding:6px 10px;border-radius:6px}
  `;

  render() {
    return html`
      <nav>
        <div class="brand">TestApp</div>
        <div class="actions">
          <button @click=${() => window.scrollTo(0,0)}>Home</button>
          <button @click=${() => alert('Open Storybook to inspect components')}>Storybook</button>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
