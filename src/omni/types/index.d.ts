// IDENTITY

export type Key = Uint8Array;

export interface KeyPair {
  publicKey: Key;
  privateKey: Key;
}

export type Identity = KeyPair | null;

// MESSAGES

export type Cbor = Buffer;

export interface Message {
  data?: string;
  from?: Key;
  id?: number | string;
  method: string;
  timestamp?: number;
  to?: Key;
  version?: number;
}

export interface Payload {
  data: Cbor;
  from: Tagged | string;
  id: number | string;
  method: string;
  timestamp: Tagged;
  to: Tagged | string;
  version: number;
}

export interface Cose {
  tag: number;
  value: { data: any };
  err: number[];
}

// SERVER
