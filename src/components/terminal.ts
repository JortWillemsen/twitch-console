import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import "./cursor.js";

@customElement('tt-terminal')
export class Terminal extends LitElement {
  @property()
  tPrefix?: string = '$>';

  @state()
  text: string[];

  constructor() {
    super();

    this.text = [];
  }

  connectedCallback(): void {
    super.connectedCallback();

    addEventListener('tt-write', (e: Event) => this._handleWrite(e.detail.text));
  }

  delay(ms: number) { return new Promise(res => setTimeout(res, ms))};

  async _handleWrite(text: string) {
    await this._clear();
    await this._write(text);
  }

  async _write(toWrite: string) {
    let arr = toWrite.split('');

    for(let i = 0; i < arr.length; i++) {
      this.text.push(arr[i]);
      this.requestUpdate();

      await this.delay(150);
    }
  }

  async _clear() {
    while(this.text.length > 0) {
      this.text.pop();
      this.requestUpdate();

      await this.delay(50);
    }

    await this.delay(1000);
  }
  
  static styles = css`
    .terminal {
      font-family: monospace;
      color: white;
      display: flex;
      height: 1em;
    }

    .line {
      margin: 0;
    }
  `

  render() {
    return html`
      <div class='terminal'>
        <p class='line'>${this.tPrefix} &#8203;${this.text}</p>
        <tt-cursor></tt-cursor>
      </div>
    `;
  }
}
