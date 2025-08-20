import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";

@customElement("disney-search")
export class DisneySearch extends LitElement {
  @property({ type: Array }) films: string[] = [];
  @property({ type: Array }) tvShows: string[] = [];
  @property({ type: Array }) videoGames: string[] = [];

  @state() private name: string = "";
  @state() private film: string = "";
  @state() private tvShow: string = "";
  @state() private videoGame: string = "";

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
      case "film":
        this.film = target.value;
        break;
      case "tvShow":
        this.tvShow = target.value;
        break;
      case "videoGame":
        this.videoGame = target.value;
        break;
    }

    this.emitFilters();
  }

  private emitFilters() {
    const filters = {
      name: this.name,
      film: this.film,
      tvShow: this.tvShow,
      videoGame: this.videoGame,
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

        <select name="film" .value=${this.film} @change=${this.onInput}>
          <option value="">All Films</option>
          ${this.films.map((f) => html`<option value=${f}>${f}</option>`)}
        </select>

        <select name="tvShow" .value=${this.tvShow} @change=${this.onInput}>
          <option value="">All TV Shows</option>
          ${this.tvShows.map((s) => html`<option value=${s}>${s}</option>`)}
        </select>

        <select
          name="videoGame"
          .value=${this.videoGame}
          @change=${this.onInput}
        >
          <option value="">All Video Games</option>
          ${this.videoGames.map((g) => html`<option value=${g}>${g}</option>`)}
        </select>
      </div>
    `;
  }
}
