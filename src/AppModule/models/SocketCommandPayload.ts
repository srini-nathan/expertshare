import Peer from "simple-peer";

export interface SocketCommandPayload {
    signal?: Peer.SignalData;
}
