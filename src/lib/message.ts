import cbor from "cbor";
import Tagged from "cbor/types/lib/tagged";
import { pki } from "node-forge";
import { Key, KeyPair } from "./identity";
const ed25519 = pki.ed25519;

export interface Message {
  version?: number;
  from?: Uint8Array;
  to?: Uint8Array;
  method: string;
  data?: string;
  id?: number;
}

const EMPTY_BUFFER = new ArrayBuffer(0);

export async function messageToEnvelope(message: Message, keys: KeyPair) {
  const sanitized = sanitizeMessage(message);
  const payload = encodePayload(sanitized, keys.publicKey);
  const envelope = encodeEnvelope(payload, keys);
  return envelope;
}

function sanitizeMessage(message: Message): Message {
  if (!message.method) {
    throw new Error("Property 'method' is required.");
  }
  const required = { method: message.method };
  const optional = Object.entries(message)
    .filter(([_, value]) => value !== "")
    .map(([key, value]) =>
      key === "data" ? [key, cbor.encode(JSON.parse(value))] : [key, value]
    )
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
  return { ...required, ...optional };
}

function encodePayload(message: Message, publicKey: Key) {
  return new cbor.Tagged(10001, {
    ...message,
    version: 1,
    // from: new cbor.Tagged(10000, Buffer.from(key)),
    timestamp: new cbor.Tagged(1, Math.floor(Date.now() / 1000)),
  });
}

function encodeEnvelope(payload: Tagged, keys: KeyPair) {
  const p = encodeProtectedHeader(keys.publicKey);
  const u = encodeUnprotectedHeader();
  const encodedPayload = cbor.encode(payload);
  const sig = signStructure(p, encodedPayload, keys.privateKey);
  return cbor.encodeCanonical(new cbor.Tagged(18, [p, u, encodedPayload, sig]));
}

function encodeProtectedHeader(publicKey: Key) {
  const protectedHeader = new Map();
  protectedHeader.set(1, -8); // alg: "Ed25519"
  protectedHeader.set(3, 60); // content-type: application/cbor
  protectedHeader.set(4, Buffer.from([0x00])); // kid: h'00'
  // protectedHeader.set(4, Buffer.from(keys.publicKey)); // kid: publicKey

  const p = cbor.encode(protectedHeader);
  return p;
}

function encodeUnprotectedHeader() {
  return new Map();
}

function signStructure(p: Buffer, payload: Buffer, privateKey: Key) {
  const toBeSigned = cbor.encode(["Signature1", p, EMPTY_BUFFER, payload]);
  const sig = ed25519.sign({
    message: toBeSigned,
    privateKey,
  });
  return sig;
}

export async function decodeResponse(response: Response) {
  const buffer = await response.arrayBuffer();
  const cose = getValue(buffer);

  // eslint-disable-next-line
  const [p, u, payload, sig] = cose;
  const data = getValue(payload);
  if (data.data) {
    return cbor.decodeFirstSync(data.data);
  }
  return data;
}

function getValue(buffer: ArrayBuffer) {
  const { err, value } = cbor.decodeFirstSync(buffer, { preferWeb: true });
  if (err) {
    throw new Error(err);
  }
  return value;
}
