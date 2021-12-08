import forge from "node-forge";
import * as bip39 from "bip39";

import { calculateKid } from "./cose";
import { Cbor, Identity as ID } from "./types";

const ed25519 = forge.pki.ed25519;
const ANONYMOUS = Buffer.from([0x00]);

export function getSeedWords(): string {
  return bip39.generateMnemonic();
}

export function fromSeedWords(mnemonic: string): ID {
  const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);
  const keys = ed25519.generateKeyPair({ seed });
  return keys;
}

export function fromPem(pem: string): ID {
  const der = forge.pem.decode(pem)[0].body;
  const asn1 = forge.asn1.fromDer(der.toString());
  const { privateKeyBytes } = ed25519.privateKeyFromAsn1(asn1);
  const keys = ed25519.generateKeyPair({ seed: privateKeyBytes });
  return keys;
}

export function toString(keys: ID = null): string {
  if (!keys) {
    return "oaa";
  }
  throw new Error("Not implemented");
}

export function toHex(keys: ID = null): string {
  if (!keys) {
    return "00";
  }
  try {
    const coseKey = toCoseKey(keys);
    return coseKey.toString("hex");
  } catch (e) {
    return (e as Error).message;
  }
}

export function toCoseKey(keys: ID = null): Cbor {
  const publicKey = keys ? keys.publicKey : ANONYMOUS;
  return calculateKid(publicKey);
}
