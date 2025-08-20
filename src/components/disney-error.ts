import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

@customElement("disney-error")
export class DisneyError extends LitElement {
  @property({ type: String }) message: string = "Something went wrong!";

  static styles = css`
    .error {
      color: red;
      padding: 1rem;
      text-align: center;
      border: 1px solid red;
      border-radius: 6px;
      background: #ffe6e6;
      margin: 1rem;
    }
  `;

  render() {
    return html` <div class="error">${this.message}</div> `;
  }
}
