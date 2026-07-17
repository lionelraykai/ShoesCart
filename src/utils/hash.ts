import * as Crypto from 'expo-crypto';

/**
 * SHA-256 digest, used so account passwords are never stored in plain text in
 * (persisted) Redux state. This is still not production-grade auth — no salt/pepper,
 * no server-side verification — see README for what a real implementation would add.
 */
export function hashPassword(password: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
}
