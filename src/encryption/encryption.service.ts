import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = Buffer.from(
    process.env.ENCRYPTION_KEY,
    'base64',
  );

  public constructor() {

    if (!process.env.ENCRYPTION_KEY) {
      throw new Error('ENCRYPTION_KEY is not defined in the environment');
    }
    if (this.key.length !== 32) {
      // AES-256 requires a 32-byte key
      throw new Error(
        'Invalid ENCRYPTION_KEY length. Key must be 32 bytes long for AES-256.',
      );
    }
  }

  public encrypt(text: string): string {
    const iv = crypto.randomBytes(16); // Generate a new IV for each encryption
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  public decrypt(encryptedText: string): string {
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv); // Use the correct IV
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
}
