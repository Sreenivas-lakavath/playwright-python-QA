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
      <div class="card" data-testid="product-card-${d.id}">
        <div class="title" data-testid="product-title-${d.id}">${d.title || 'Untitled'}</div>
        <div class="price" data-testid="product-price-${d.id}">$${d.price || '0.00'}</div>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="add-${d.id}" name="action" value="add" data-testid="product-add-${d.id}" @click=${() => alert('Add to cart: ' + (d.title || 'item'))}>Add</button>
          <button id="details-${d.id}" data-testid="product-details-${d.id}" @click=${() => alert('Details: ' + (d.title || 'item'))}>Details</button>
        </div>
      </div>
    `;
  }
}

customElements.define('product-card', ProductCard);
