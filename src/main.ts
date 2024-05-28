import './style.css'
import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import './components/terminal.js';
import './api/twitch.js';
import { TwitchApi, TwitchSocket } from './api/twitch.js';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = /*html*/`
  <div class="background">
    <div id="queue" class="queue">
    </div>
    <tt-terminal></tt-terminal>
  </div>
`

// const event = new CustomEvent("tt-write", { detail: {text: "Hello World!"} });
// dispatchEvent(event);
const sock = new TwitchSocket();

const api = new TwitchApi("CLIENT_ID", "CLIENT_SECRET", "BROADCASTER_ID");
api.authorize();
