import forge from "node-forge";
import * as bip39 from "bip39";
const ed25519 = forge.pki.ed25519;

export interface KeyPair {
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export type Key = Uint8Array;

export function createMnemonic(): string {
  return bip39.generateMnemonic();
}

export function mnemonicToKeyPair(mnemonic: string): KeyPair {
  const seed = bip39.mnemonicToSeedSync(mnemonic).slice(0, 32);
  const keys = ed25519.generateKeyPair({ seed });
  return keys;
}

export function pemToKeyPair(pem: string): KeyPair {
  const der = forge.pem.decode(pem)[0].body;
  const asn1 = forge.asn1.fromDer(der.toString());
  const { privateKeyBytes } = ed25519.privateKeyFromAsn1(asn1);
  const keys = ed25519.generateKeyPair({ seed: privateKeyBytes });
  return keys;
}

export function keyPairToKid(keys: KeyPair): string {
  return "oaa";
}
