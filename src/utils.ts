import nacl from "tweetnacl";
import cbor from "cbor";
import Tagged from "cbor/types/lib/tagged";

interface KeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

interface OmniMessage {
  version?: number;
  from?: Uint8Array;
  to?: Uint8Array;
  method: string;
  data?: string;
  id?: number;
}

const EMPTY_BUFFER = new ArrayBuffer(0);

export function getFormValue(form: HTMLFormElement, name: string): string {
  return (form.elements.namedItem(name) as HTMLInputElement).value;
}

export function generateKeys(): KeyPair {
  return nacl.sign.keyPair();
}

export async function encodeMessage(message: OmniMessage, keys: KeyPair) {
  const payload = createPayload(message, keys.publicKey);
  const signed = signPayload(payload, keys);
  return signed;
}

export function createPayload(payload: OmniMessage, key: Uint8Array): Tagged {
  const sanitized = Object.entries(payload)
    .filter(([_, v]) => v !== "")
    .map(([k, v]) => (k === "data" ? [k, cbor.encode(JSON.parse(v))] : [k, v]))
    .reduce((obj, [k, v]) => ({ ...obj, [k]: v }), {});

  return new cbor.Tagged(10001, {
    ...sanitized,
    version: 1,
    // from: new cbor.Tagged(10000, Buffer.from(key)),
    timestamp: new cbor.Tagged(1, Math.floor(Date.now() / 1000)),
  });
}

export function signPayload(messagePayload: Tagged, keys: KeyPair): Buffer {
  const protectedHeader = new Map();
  protectedHeader.set(1, -8); // alg: "Ed25519"
  protectedHeader.set(3, 60); // content-type: application/cbor
  protectedHeader.set(4, Buffer.from([0x00])); // kid: h'00'
  // protectedHeader.set(4, Buffer.from(keys.publicKey)); // kid: publicKey

  const p = cbor.encode(protectedHeader);
  const u = new Map();
  const payload = cbor.encode(messagePayload);

  const toBeSigned = cbor.encode(["Signature1", p, EMPTY_BUFFER, payload]);
  const sig = nacl.sign.detached(toBeSigned, keys.secretKey);
  return cbor.encodeCanonical(new cbor.Tagged(18, [p, u, payload, sig]));
}

export async function sendMessage(url: string, message: Buffer) {
  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/cbor" },
    body: message,
  });
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

export function replacer(key: string, value: any) {
  // if (key === "data") {
  //   return cbor.decodeFirstSync(value);
  // }
  if (typeof value === "bigint") {
    return value.toString() + "n";
  }
  if (value.tag === 10000) {
    return Buffer.from(value.value).toString("hex");
  }
  return value;
}
