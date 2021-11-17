import { sign } from "cosette";
import cbor from "cbor";

export function getFormValue(form: HTMLFormElement, name: string): string {
  return (form.elements.namedItem(name) as HTMLInputElement).value;
}

export async function generateKeys() {
  return await crypto.subtle.generateKey(
    { name: "ECDSA", namedCurve: "P-256" },
    true,
    ["sign"]
  );
}

interface MessagePayload {
  version?: number;
  from?: CryptoKey;
  to?: CryptoKey;
  method: string;
  data?: string;
  id?: number;
}

export async function encodeMessage(
  message: MessagePayload,
  keys: CryptoKeyPair
) {
  if (!keys.publicKey || !keys.privateKey) {
    throw new Error("An asymmetric algorithm is required.");
  }
  const payload = await createPayload(message, keys.publicKey);
  const signed = await signPayload(payload, keys.privateKey);
  return signed;
}

export async function createPayload(payload: MessagePayload, key: CryptoKey) {
  const publicKey = await crypto.subtle.exportKey("raw", key);
  return cbor.encodeOne({
    ...payload,
    from: new Uint8Array(publicKey),
    timestamp: Math.floor(Date.now() / 1000),
  });
}

export async function signPayload(payload: Buffer, key: CryptoKey) {
  const anonymous = cbor.encode(new cbor.Tagged(10000, Buffer.from([0x00])));
  console.log(anonymous);
  return await sign.create(
    {
      p: { alg: "ES256", kid: "oaa" },
      u: {},
    },
    payload,
    {
      key,
    }
  );
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
  return data;
}

function getValue(buffer: ArrayBuffer) {
  const { err, value } = cbor.decodeFirstSync(buffer, { preferWeb: true });
  if (err) {
    throw new Error(err);
  }
  return value;
}

export function replacer(_: string, value: any) {
  if (value.tag === 10000) {
    return Buffer.from(value.value).toString("hex");
  }
  return value;
}
