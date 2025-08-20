// Core
import { LitElement, html } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

// Styles + Interface + Utils
import { cardStyles } from "./disney-card.styles";
import type { DisneyCharacter } from "../interfaces/DisneyCharacter";
import { SEOUtils } from "../seo-utils";

@customElement("disney-card")
export class DisneyCard extends LitElement {
  @property({ type: Object }) character!: DisneyCharacter;
  @property({ type: Boolean }) isFavorite = false;

  @state() private open = false;

  @query(".dialog") private dialogEl?: HTMLElement | null;

  private lastFocusedElement: HTMLElement | null = null;

  static styles = [cardStyles];

  private toggleDialog(open: boolean) {
    if (open) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
      this.open = true;
      this.updateComplete.then(() => {
        this.dialogEl?.focus();
        document.addEventListener("keydown", this.handleKeyDown);
      });

      SEOUtils.setMeta(
        `${this.character.name} | Disney Characters`,
        `${this.character.name} appears in ${
          this.character.films?.join(", ") || "various works"
        }.`,
        `${window.location.origin}/characters/${encodeURIComponent(
          this.character.name
        )}`
      );

      SEOUtils.setStructuredData({
        "@context": "https://schema.org",
        "@type": "Person",
        name: this.character.name,
        description: `Disney character known from: ${
          this.character.films?.join(", ") || "N/A"
        }`,
        url: `${window.location.origin}/characters/${encodeURIComponent(
          this.character.name
        )}`,
        image: this.character.imageUrl,
      });
    } else {
      this.open = false;
      document.removeEventListener("keydown", this.handleKeyDown);
      this.lastFocusedElement?.focus();
      SEOUtils.setMeta(
        "Disney Characters Directory",
        "Search and explore your favorite Disney characters.",
        window.location.origin
      );

      SEOUtils.setStructuredData({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Disney Character Search",
        url: window.location.href,
        description:
          "Browse Disney characters from films, TV shows, and games.",
      });
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this.toggleDialog(false);
    }
    if (e.key === "Tab" && this.dialogEl) {
      const focusableEls = this.dialogEl.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusableEls[0];
      const last = focusableEls[focusableEls.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  private _onToggleFavorite(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("toggle-favorite", {
        detail: this.character,
        bubbles: true,
        composed: true,
      })
    );
  }

  private _onFavoriteKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._onToggleFavorite(e);
    }
  }

  render() {
    const { name, imageUrl, films, tvShows, videoGames, parkAttractions } =
      this.character;
    const content = [
      films?.length ? `Films: ${films.join(", ")}` : "",
      tvShows?.length ? `TV Shows: ${tvShows.join(", ")}` : "",
      videoGames?.length ? `Games: ${videoGames.join(", ")}` : "",
      parkAttractions?.length
        ? `Attractions: ${parkAttractions.join(", ")}`
        : "",
    ].filter(Boolean);

    return html`
      <!-- Card -->
      <div
        class="card"
        @click=${() => this.toggleDialog(true)}
        tabindex="0"
        role="button"
        aria-label="Open ${name} details"
      >
        <button
          class="favorite-btn"
          @click=${(e: Event) => {
            e.stopPropagation();
            this._onToggleFavorite(e);
          }}
          @keydown=${this._onFavoriteKeydown}
          aria-label=${this.isFavorite
            ? `Remove ${name} from favorites`
            : `Add ${name} to favorites`}
          aria-pressed=${this.isFavorite ? "true" : "false"}
        >
          ${this.isFavorite ? "❤️" : "🤍"}
        </button>
        <div class="header">${name}</div>
        <div class="image">
          ${imageUrl
            ? html`<img src=${imageUrl} alt=${name} loading="lazy" />`
            : html`<span>No Image</span>`}
        </div>
      </div>

      <!-- Popup Dialog -->
      ${this.open
        ? html`
            <div class="overlay" @click=${() => this.toggleDialog(false)}>
              <div
                class="dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="dialog-title-${name}"
                aria-describedby="dialog-desc-${name}"
                tabindex="0"
                @click=${(e: Event) => e.stopPropagation()}
              >
                <div class="dialog-header">
                  <span id="dialog-title-${name}">${name}</span>
                  <button
                    class="close-btn"
                    @click=${() => this.toggleDialog(false)}
                    aria-label="Close dialog"
                  >
                    &times;
                  </button>
                </div>
                <div class="dialog-image">
                  ${imageUrl
                    ? html`<img src=${imageUrl} alt=${name} />`
                    : html`<span>No Image</span>`}
                </div>
                <div class="dialog-body" id="dialog-desc-${name}">
                  ${content.length
                    ? content.map(
                        (line) => html`<div class="property">${line}</div>`
                      )
                    : html`<p>No extra details available.</p>`}
                </div>
              </div>
            </div>
          `
        : null}
    `;
  }
}
