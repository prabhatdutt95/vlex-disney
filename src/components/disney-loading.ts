import { LitElement, html, css } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("disney-loading")
export class DisneyLoading extends LitElement {
  static styles = css`
    .spinner {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
      font-size: 1.2rem;
      color: #555;
    }
  `;

  render() {
    return html` <div class="spinner">Fetching Characters...</div> `;
  }
}
