import { LitElement, html, css } from 'lit';

class LoginForm extends LitElement {
  static styles = css`
    form{display:flex;flex-direction:column;gap:8px;max-width:360px}
    input{padding:8px;border:1px solid #ddd;border-radius:6px}
    button{padding:8px 12px;background:var(--primary);color:white;border:none;border-radius:6px}
  `;

  render() {
    return html`
      <form id="login-form" @submit=${this._onSubmit}>
        <input id="login-username" name="username" placeholder="Enter username" data-testid="login-username" />
        <input id="login-password" name="password" type="password" placeholder="Enter password" data-testid="login-password" />
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="login-submit" type="submit" name="action" value="login" data-testid="login-submit">Login</button>
          <button id="login-register" type="button" name="action" value="register" data-testid="login-register">Register</button>
          <button id="login-forgot" type="button" name="action" value="forgot" data-testid="login-forgot">Forgot</button>
        </div>
      </form>
    `;
  }

  async _onSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData(form);
    const body = { username: fd.get('username'), password: fd.get('password') };
    try {
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Login failed');
      const json = await res.json();
      alert(`Logged in as ${json.username}. Token: ${json.token}`);
      this.dispatchEvent(new CustomEvent('login-success', { detail: json }));
    } catch (err) {
      console.error(err);
      alert('Login failed (is backend running?)');
    }
  }
}

customElements.define('login-form', LoginForm);
