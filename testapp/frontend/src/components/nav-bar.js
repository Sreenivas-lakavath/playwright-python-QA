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
      <nav id="main-nav" data-testid="nav-bar">
        <div class="brand" id="nav-brand" data-testid="nav-brand">Sreenivas Lakavath Testing world</div>
        <div class="actions">
          <button id="nav-home" data-testid="nav-home" @click=${() => window.scrollTo(0,0)}>Home</button>
          <button id="nav-storybook" data-testid="nav-storybook" @click=${() => alert('Open Storybook to inspect components')}>Storybook</button>
          <button id="nav-help" data-testid="nav-help" @click=${() => alert('Help clicked')}>Help</button>
          <!-- About me: opens GitHub profile in a new tab. Update URL if you want a different profile -->
          <button id="nav-about" data-testid="nav-about" @click=${() => window.open('https://github.com/Sreenivas-lakavath', '_blank', 'noopener')}>About</button>
        </div>
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
