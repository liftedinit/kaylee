import { Message, messageToEnvelope } from "./message";
import { KeyPair } from "./identity";

export async function sendEnvelope(url: string, message: Buffer) {
  return await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/cbor" },
    body: message,
  });
}

export async function sendHex(url: string, hex: string) {
  return await sendEnvelope(url, Buffer.from(hex, "hex"));
}

export async function sendMessage(
  url: string,
  message: Message,
  keys: KeyPair
) {
  const envelope = await messageToEnvelope(message, keys);
  const reply = await sendEnvelope(url, envelope);
  return reply;
}
