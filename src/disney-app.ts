// Core
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

// Component, Service, Interfaces
import { fetchCharacters } from "./services/disney-api";
import type { DisneyCharacter } from "./interfaces/DisneyCharacter";
import { DisneySearch } from "./components/disney-search";

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

  @state()
  private characters: DisneyCharacter[] = [];

  connectedCallback() {
    super.connectedCallback();
    this.loadCharacters();
  }

  async loadCharacters() {
    this.characters = await fetchCharacters();
  }

  private handleFilters(e: CustomEvent) {
    const { query, franchise } = e.detail;
    console.log("Filters:", query, franchise);

    // Filter logic
  }

  render() {
    return html`
      <h1>Disney Character Explorer</h1>
      <disney-search @filters-changed=${this.handleFilters}></disney-search>
      <ul>
        ${this.characters.length > 0
          ? this.characters.map((char) => html`<li>${char.name}</li>`)
          : html`<li>Loading characters...</li>`}
      </ul>
    `;
  }
}
