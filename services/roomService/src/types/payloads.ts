import Player from "./Player";

export interface JoinTownResponse {
  coveyUserID: string,
  coveySessionToken: string,
  providerVideoToken: string,
  providerRoomID: string
}

export interface IncommingChatMessage {
  message: string;
  broadcastRadius: number;
}

export interface OutgoingChatMessage {
  sender: Player;
  message: string;
  timestamp: string;
  receivingPlayers: Player[] | undefined;
}
