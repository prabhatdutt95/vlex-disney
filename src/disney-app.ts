// Core
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

// Component, Service, Interfaces
import { fetchCharacters } from "./services/disney-api";
import type { DisneyCharacter } from "./interfaces/DisneyCharacter";
import "./components/disney-search";

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
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      padding: 0.5rem;
      border-bottom: 1px solid #ddd;
    }
  `;

  @state() private characters: DisneyCharacter[] = [];
  @state() private filtered: DisneyCharacter[] = [];

  @state() private films: string[] = [];
  @state() private tvShows: string[] = [];
  @state() private videoGames: string[] = [];

  async firstUpdated() {
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
    return html`
      <h1>Disney Character Explorer</h1>
      <disney-search
        .films=${this.films}
        .tvShows=${this.tvShows}
        .videoGames=${this.videoGames}
        @filters-changed=${this.handleFilters}
      ></disney-search>

      <ul>
        ${this.filtered.map(
          (c) => html`
            <li>
              <img src=${c.imageUrl} width="40" />
              ${c.name}
            </li>
          `
        )}
      </ul>
    `;
  }
}
