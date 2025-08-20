// Core
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

// Components
import "./components/disney-search";
import "./components/disney-loading";
import "./components/disney-error";
import "./components/disney-card";

// Service + Interfaces
import { fetchCharacters } from "./services/disney-api";
import type { DisneyCharacter } from "./interfaces/DisneyCharacter";

@customElement("disney-app")
export class DisneyApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
      padding: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    .card-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `;

  @state() private characters: DisneyCharacter[] = [];
  @state() private filtered: DisneyCharacter[] = [];

  @state() private films: string[] = [];
  @state() private tvShows: string[] = [];
  @state() private videoGames: string[] = [];

  @state() loading: boolean = false;
  @state() error: string | null = null;

  connectedCallback() {
    super.connectedCallback();
    this.loadCharacters();
  }

  async loadCharacters() {
    this.loading = true;
    this.error = null;
    try {
      await this.initializeData();
    } catch (err) {
      this.error = "Failed to load Disney characters. Please try again.";
    } finally {
      this.loading = false;
    }
  }

  async initializeData() {
    const data = await fetchCharacters();
    this.characters = data;
    this.filtered = data;

    this.films = [...new Set(data.flatMap((c) => c.films))].filter(Boolean);
    this.tvShows = [...new Set(data.flatMap((c) => c.tvShows))].filter(Boolean);
    this.videoGames = [...new Set(data.flatMap((c) => c.videoGames))].filter(
      Boolean
    );
  }

  private handleFilters(e: CustomEvent) {
    const { name, film, tvShow, videoGame } = e.detail;

    this.filtered = this.characters.filter(
      (c) =>
        (!name || c.name.toLowerCase().includes(name.toLowerCase())) &&
        (!film || c.films.includes(film)) &&
        (!tvShow || c.tvShows.includes(tvShow)) &&
        (!videoGame || c.videoGames.includes(videoGame))
    );
  }

  render() {
    if (this.loading) return html`<disney-loading></disney-loading>`;
    if (this.error) return html`<disney-error></disney-error>`;

    return html`
      <h1>Disney Character Explorer</h1>
      <disney-search
        .films=${this.films}
        .tvShows=${this.tvShows}
        .videoGames=${this.videoGames}
        @filters-changed=${this.handleFilters}
      ></disney-search>

      <div class="card-grid">
        ${this.filtered.map(
          (c) => html`<disney-card .character=${c}></disney-card>`
        )}
      </div>
    `;
  }
}
