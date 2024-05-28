import {LitElement, css, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

type CursorStyle = "block" | "line" 

@customElement('tt-cursor')
export class Cursor extends LitElement {
  @property()
  public cStyle? : CursorStyle = 'block';
  
  @state()
  private _isBlink : boolean;
  
  @property()
  private interval: number;

  constructor() {
    super();

    this._isBlink = true;
    this.interval = setInterval(() => this._isBlink = !this._isBlink, 1000);
  }

  disconnectedCallback() {
    clearInterval(this.interval);
  }

  static styles = css`
    .cursor {
      display: inline-block;
      color: white;
      background: white;
    }

    .block {
      height: 1em;
      width: 8px;
    }
  `

  render() {
    return this._isBlink 
      ? html`<div class="cursor block"></div>`
      : html``;
  }
}
