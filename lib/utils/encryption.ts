import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

// Generate encryption key from password
function getKey(password: string, salt: Buffer): Buffer {
  return crypto.pbkdf2Sync(password, salt, 100000, KEY_LENGTH, 'sha512');
}

// Get encryption password from environment or generate one
function getEncryptionPassword(): string {
  const password = process.env.ENCRYPTION_KEY;
  if (!password) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
  }
  return password;
}

/**
 * Encrypt text using AES-256-GCM
 * @param text - Text to encrypt
 * @returns Encrypted text in format: salt:iv:tag:encrypted
 */
export function encrypt(text: string): string {
  const password = getEncryptionPassword();
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(password, salt);
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const tag = cipher.getAuthTag();

  return `${salt.toString('hex')}:${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt text encrypted with encrypt()
 * @param encryptedText - Encrypted text in format: salt:iv:tag:encrypted
 * @returns Decrypted text
 */
export function decrypt(encryptedText: string): string {
  const password = getEncryptionPassword();
  const parts = encryptedText.split(':');

  if (parts.length !== 4) {
    throw new Error('Invalid encrypted text format');
  }

  const salt = Buffer.from(parts[0], 'hex');
  const iv = Buffer.from(parts[1], 'hex');
  const tag = Buffer.from(parts[2], 'hex');
  const encrypted = parts[3];

  const key = getKey(password, salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
