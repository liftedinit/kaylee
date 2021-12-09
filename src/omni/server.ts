import { Cbor, Identity as ID, Message } from "./types";
import { decode, encode } from "./message";

export async function sendEncoded(url: string, cbor: Cbor): Promise<Cbor> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/cbor" },
    body: cbor,
  });
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer);
}

export async function send(
  url: string,
  message: Message,
  keys: ID = null
): Promise<any> {
  const cbor = encode(message, keys);
  const reply = await sendEncoded(url, cbor);
  // @TODO: Verify response
  return decode(reply);
}
