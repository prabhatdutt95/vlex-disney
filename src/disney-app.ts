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
import { FavoritesService } from "./services/favorites-service";

import type { DisneyCharacter } from "./interfaces/DisneyCharacter";

@customElement("disney-app")
export class DisneyApp extends LitElement {
  @state() private characters: DisneyCharacter[] = [];
  @state() private filtered: DisneyCharacter[] = [];

  @state() private films: string[] = [];
  @state() private tvShows: string[] = [];
  @state() private videoGames: string[] = [];

  @state() loading: boolean = false;
  @state() error: string | null = null;

  @state() private favorites: string[] = [];

  @state() private activeFilters: {
    name?: string;
    film?: string;
    tvShow?: string;
    videoGame?: string;
  } = { name: "", film: "", tvShow: "", videoGame: "" };

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

  connectedCallback() {
    super.connectedCallback();
    this.loadCharacters();
    this.loadFavorites();
    window.addEventListener("popstate", this.restoreFiltersFromURL.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener(
      "popstate",
      this.restoreFiltersFromURL.bind(this)
    );
    super.disconnectedCallback();
  }

  async loadCharacters() {
    this.loading = true;
    this.error = null;
    try {
      await this.initializeData();
      this.restoreFiltersFromURL();
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

  private loadFavorites() {
    this.favorites = FavoritesService.getFavorites();
  }

  private handleToggleFavorite(e: CustomEvent<{ id: string }>) {
    const id = e.detail.id;
    FavoritesService.toggleFavorite(id);
    this.favorites = FavoritesService.getFavorites();
  }

  private handleFilters(e: CustomEvent) {
    this.activeFilters = e.detail;
    this.applyFilters();
    this.updateURLWithFilters();
  }

  private applyFilters() {
    const { name, film, tvShow, videoGame } = this.activeFilters;
    this.filtered = this.characters.filter(
      (c) =>
        (!name || c.name.toLowerCase().includes(name.toLowerCase())) &&
        (!film || c.films.includes(film)) &&
        (!tvShow || c.tvShows.includes(tvShow)) &&
        (!videoGame || c.videoGames.includes(videoGame))
    );
  }

  private updateURLWithFilters() {
    const params = new URLSearchParams();

    if (this.activeFilters.name) params.set("name", this.activeFilters.name);
    if (this.activeFilters.film) params.set("film", this.activeFilters.film);
    if (this.activeFilters.tvShow)
      params.set("tvShow", this.activeFilters.tvShow);
    if (this.activeFilters.videoGame)
      params.set("videoGame", this.activeFilters.videoGame);

    history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  }

  private restoreFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);

    this.activeFilters = {
      name: params.get("name") || "",
      film: params.get("film") || "",
      tvShow: params.get("tvShow") || "",
      videoGame: params.get("videoGame") || "",
    };

    this.applyFilters();
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
        .activeFilters=${this.activeFilters}
        @filters-changed=${this.handleFilters}
      ></disney-search>

      <div class="card-grid">
        ${this.filtered.map(
          (c) => html`<disney-card
            .character=${c}
            .isFavorite=${this.favorites.includes(String(c._id))}
            @toggle-favorite=${this.handleToggleFavorite}
          ></disney-card>`
        )}
      </div>
    `;
  }
}
