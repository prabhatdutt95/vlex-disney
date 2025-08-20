import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("disney-search")
export class DisneySearch extends LitElement {
  @property({ type: Array }) franchises: string[] = [];
  @property({ type: Array }) roles: string[] = [];
  @property({ type: Array }) eras: string[] = [];

  @state() private name: string = "";
  @state() private franchise: string = "";
  @state() private characterRole: string = "";
  @state() private era: string = "";

  static styles = css`
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
    select,
    input {
      padding: 6px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  `;

  private onInput(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;

    switch (target.name) {
      case "name":
        this.name = target.value;
        break;
      case "franchise":
        this.franchise = target.value;
        break;
      case "role":
        this.characterRole = target.value;
        break;
      case "era":
        this.era = target.value;
        break;
    }

    this.emitFilters();
  }

  private emitFilters() {
    const filters = {
      name: this.name,
      franchise: this.franchise,
      role: this.characterRole,
      era: this.era,
    };
    this.dispatchEvent(
      new CustomEvent("filters-changed", {
        detail: filters,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="filters">
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          .value=${this.name}
          @input=${this.onInput}
        />

        <select
          name="franchise"
          .value=${this.franchise}
          @change=${this.onInput}
        >
          <option value="">All Franchises</option>
          ${this.franchises.map((f) => html`<option value=${f}>${f}</option>`)}
        </select>

        <select
          name="role"
          .value=${this.characterRole}
          @change=${this.onInput}
        >
          <option value="">All Roles</option>
          ${this.roles.map((r) => html`<option value=${r}>${r}</option>`)}
        </select>

        <select name="era" .value=${this.era} @change=${this.onInput}>
          <option value="">All Eras</option>
          ${this.eras.map((e) => html`<option value=${e}>${e}</option>`)}
        </select>
      </div>
    `;
  }
}
