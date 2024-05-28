type NotificationMessage = {
  metadata: {
    message_id: string,
    message_type: string,
    message_timestamp: Date,
    subscription_type: string,
    subscription_version: string
  },
  payload: {
      subscription: {
          id: string,
          status: string,
          type: string,
          version: string,
          cost: number,
          condition: {
              broadcaster_user_id: string
          },
          transport: {
              method: string,
              session_id: string
          },
          created_at: Date
      },
      event: {
          user_id: string,
          user_login: string,
          user_name: string,
          broadcaster_user_id: string,
          broadcaster_user_login: string,
          broadcaster_user_name: string,
          followed_at: Date
      }
  }
}

export class TwitchSocket {
  private url: string = "wss://eventsub.wss.twitch.tv/ws";
  private socket: WebSocket;
  
  // constructor() {
  //   this.socket = await new WebSocket(this.url);
  //   this.socket.onopen()
  // }
}

export class TwitchApi {
  private clientId: string;
  private sockId: string | null = null;
  private secret: string;
  private token: string = "";
  private broadcasterId: string;

  constructor(cId: string, sc: string, bId: string) {
    this.clientId = cId;
    this.secret = sc;
    this.broadcasterId = bId;
  }

  async authorize() {

    // channel:read:subscriptions
    // 
    var response  = await fetch(
      `https://id.twitch.tv/oauth2/authorize?client_id=${this.clientId}&redirect_uri=http://localhost:5371&response_type=code&scope=channel%3Aread%3Asubscriptions`, {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(response => {
        if (response.ok) {
          return response.json() as Promise<AuthorizeResponse>
        }
      }
    );

    this.token = response!.access_token;

    console.log(this.token);
  }

  async addSubscription() {
    if (this.sockId === null) {
      return;
    }

    const requestBody: SubscribeRequest = {
      type: "channel.follow",
      version: "2",
      condition: {
        "broadcaster_user_id": this.broadcasterId,
        "moderator_user_id": this.broadcasterId
      },
      transport: {
        method: "websocket",
        secret: "thisisasecretstring",
        session_id: this.sockId,
      }
    }

    var response  = await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify(requestBody)
    }).then(response => {
      if (response.ok) {
        return response.json() as Promise<AuthorizeResponse>
      }
    });
  }
}

type AuthorizeResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
}

type SubscribeRequest = {
  type: "channel.follow" | "channel.subscribe" | "channel.subscription.gift" | "channel.cheer" | "channel.raid";
  version: "1" | "2" | "beta";
  condition: object;
  transport: TransportRequest;

}

type TransportRequest = {
  method: "webhook" | "websocket";
  callback?: string;
  secret: string;
  session_id: string;

}