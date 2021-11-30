import cbor from "cbor";
import Tagged from "cbor/types/lib/tagged";
import { pki } from "node-forge";
import { sha3_224 } from "js-sha3";
import { Key, KeyPair } from "./identity";
const ed25519 = pki.ed25519;

export interface Message {
  version?: number;
  from?: Key;
  to?: Key;
  method: string;
  data?: string;
  id?: number;
  timestamp?: number;
}

const EMPTY_BUFFER = new ArrayBuffer(0);
const ANONYMOUS = Buffer.from([0x00]);

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
    from: new cbor.Tagged(10000, calculateKid(publicKey)),
    to: new cbor.Tagged(10000, ANONYMOUS),
    timestamp: new cbor.Tagged(1, Math.floor(Date.now() / 1000)),
  });
}

function encodeEnvelope(payload: Tagged, keys: KeyPair) {
  const p = encodeProtectedHeader(keys.publicKey);
  const u = encodeUnprotectedHeader(keys.publicKey);
  const encodedPayload = cbor.encode(payload);
  const sig = signStructure(p, encodedPayload, keys.privateKey);
  return cbor.encodeCanonical(new cbor.Tagged(18, [p, u, encodedPayload, sig]));
}

function encodeProtectedHeader(publicKey: Key) {
  const protectedHeader = new Map();
  protectedHeader.set(1, -8); // alg: "Ed25519"
  protectedHeader.set(4, calculateKid(publicKey)); // kid: kid
  protectedHeader.set("keyset", encodeCoseKey(publicKey));
  const p = cbor.encodeCanonical(protectedHeader);
  return p;
}

function encodeUnprotectedHeader(publicKey: Key) {
  const unprotectedHeader = new Map();
  return unprotectedHeader;
}

function encodeCoseKey(publicKey: Key) {
  const coseKey = new Map();
  coseKey.set(1, 1); // kty: OKP
  coseKey.set(3, -8); // alg: EdDSA
  coseKey.set(-1, 6); // crv: Ed25519
  coseKey.set(4, [2]); // key_ops: [verify]
  coseKey.set(2, calculateKid(publicKey)); // kid: kid
  coseKey.set(-2, publicKey); // x: publicKey
  return cbor.encodeCanonical([coseKey]);
}

function calculateKid(publicKey: Key) {
  const kid = new Map();
  kid.set(1, 1);
  kid.set(3, -8);
  kid.set(-1, 6);
  kid.set(4, [2]);
  kid.set(-2, publicKey);
  const pk = "01" + sha3_224(cbor.encodeCanonical(kid));
  return Buffer.from(pk, "hex");
}

function signStructure(p: Buffer, payload: Buffer, privateKey: Key) {
  const message = cbor.encodeCanonical([
    "Signature1",
    p,
    EMPTY_BUFFER,
    payload,
  ]);
  const sig = ed25519.sign({ message, privateKey });
  return Buffer.from(sig);
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
