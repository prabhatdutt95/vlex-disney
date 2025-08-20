// src/components/disney-card.ts
import { LitElement, html, css } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";
import type { DisneyCharacter } from "../interfaces/DisneyCharacter";

@customElement("disney-card")
export class DisneyCard extends LitElement {
  @property({ type: Object }) character!: DisneyCharacter;
  @state() private open = false;

  @query(".dialog") private dialogEl!: HTMLElement;
  private lastFocusedElement: HTMLElement | null = null;

  static styles = css`
    /* Card */
    .card {
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      cursor: pointer;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      width: 260px;
      margin: 1rem;
      display: flex;
      flex-direction: column;
      text-align: center;
    }
    .card:hover {
      transform: translateY(-6px) scale(1.03);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    }

    .header {
      font-weight: bold;
      padding: 0.75rem;
      font-size: 1.1rem;
      background: #f7f7f7;
    }

    .image {
      width: 100%;
      height: 220px;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .card:hover .image img {
      transform: scale(1.1);
    }

    /* Dialog Overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
      animation: fadeIn 0.3s ease;
    }

    /* Dialog Content */
    .dialog {
      background: #fff;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
      position: relative;
      padding-bottom: 1rem;
      outline: none; /* important for focus */
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      font-weight: bold;
      font-size: 1.3rem;
      border-bottom: 1px solid #eee;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #555;
      transition: color 0.2s;
    }
    .close-btn:hover {
      color: #000;
    }

    .dialog-body {
      padding: 1rem;
      text-align: left;
    }

    .dialog-image {
      width: 100%;
      height: 300px;
      background: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .dialog-image img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .property {
      margin: 0.5rem 0;
      font-size: 0.95rem;
    }

    /* Animations */
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  private toggleDialog(open: boolean) {
    if (open) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
      this.open = true;
      this.updateComplete.then(() => {
        this.dialogEl?.focus();
        document.addEventListener("keydown", this.handleKeyDown);
      });
    } else {
      this.open = false;
      document.removeEventListener("keydown", this.handleKeyDown);
      this.lastFocusedElement?.focus();
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
