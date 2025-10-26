import { LitElement, html, css } from 'lit';

class ProductCard extends LitElement {
  static properties = { data: { type: Object } };

  static styles = css`
    :host{display:block}
    .card{border-radius:10px;padding:12px;background:var(--glass);border:1px solid rgba(255,255,255,0.02);min-height:120px}
    .thumb{width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px;background:linear-gradient(90deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))}
    .title{font-weight:700;color:var(--primary)}
    .price{color:var(--primary);font-weight:700}
    .desc{color:var(--muted);font-size:13px;margin-top:6px}
  `;

  constructor() {
    super();
    this.data = {};
  }

  render() {
    // data may be passed either as a property (preferred) or as an attribute
    // When `main.js` injects HTML it uses a literal attribute like `.data='...'` so we
    // support reading that attribute name as well as `data` or `data-prop`.
    let d = this.data || {};
    try {
      if (typeof d === 'string') d = JSON.parse(d);
    } catch (e) {
      d = {};
    }

    // fallback to attribute-based data (some callers inject raw HTML with a ".data" attribute)
    if ((!d || (Object.keys(d).length === 0))) {
      const raw = this.getAttribute('.data') || this.getAttribute('data') || this.getAttribute('data-prop');
      if (raw) {
        try { d = JSON.parse(raw); } catch (e) { d = {}; }
      }
    }
    return html`
      <div class="card" data-testid="product-card-${d.id}" role="group" aria-label="product ${d.title || ''}">
        ${d.image ? html`<img class="thumb" src="${d.image}" alt="${d.title || 'product'}" loading="lazy" data-testid="product-image-${d.id}" />` : ''}
        <div class="title" data-testid="product-title-${d.id}">${d.title || 'Untitled'}</div>
        <div class="price" data-testid="product-price-${d.id}">$${d.price || '0.00'}</div>
        ${d.description ? html`<div class="desc" data-testid="product-desc-${d.id}">${d.description}</div>` : ''}
        <div style="display:flex;gap:8px;margin-top:8px">
          <button id="add-${d.id}" name="action" value="add" class="btn" data-testid="product-add-${d.id}" aria-label="Add ${d.title || ''} to cart" @click=${() => this._onAdd(d)}>Add</button>
          <button id="details-${d.id}" class="btn secondary" data-testid="product-details-${d.id}" aria-label="Show details for ${d.title || ''}" @click=${() => this._onDetails(d)}>Details</button>
        </div>
      </div>
    `;
  }

  _onAdd(d) {
    this.dispatchEvent(new CustomEvent('add-to-cart', { detail: d, bubbles: true, composed: true }));
  }

  _onDetails(d) {
    this.dispatchEvent(new CustomEvent('product-details', { detail: d, bubbles: true, composed: true }));
  }
}

customElements.define('product-card', ProductCard);
