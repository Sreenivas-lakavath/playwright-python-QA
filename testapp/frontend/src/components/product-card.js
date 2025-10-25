import { LitElement, html, css } from 'lit';

class ProductCard extends LitElement {
  static properties = { data: { type: Object } };

  static styles = css`
    .card{border:1px solid #eee;padding:12px;border-radius:8px;background:white}
    .title{font-weight:600}
    .price{color:var(--primary);font-weight:700}
  `;

  constructor() {
    super();
    this.data = {};
  }

  render() {
    // data may be passed as property or attribute; try to parse if string
    let d = this.data;
    try { if (typeof d === 'string') d = JSON.parse(d); } catch (e) {}
    return html`
      <div class="card">
        <div class="title">${d.title || 'Untitled'}</div>
        <div class="price">$${d.price || '0.00'}</div>
        <div><button @click=${() => alert('Add to cart: ' + (d.title || 'item'))}>Add</button></div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);
