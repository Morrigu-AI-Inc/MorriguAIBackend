import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import * as crypto from 'crypto';

export type APIIntegrationDocument = Document & {
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  settings: {
    encryptedData: any;
    iv: any;
  }; // Simplified as encrypted settings string
  owner: string; // Simplified as owner string
};

@Schema({ timestamps: true }) // Automatically manage createdAt and updatedAt
export class APIIntegration {
  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  // This will be an encrypted JWT string
  @Prop({
    required: true,
    type: {
      encryptedData: String,
      iv: String,
    },
  })
  settings: {
    encryptedData: string;
    iv: string;
  };

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: 'Organization' })
  owner: string;
}

export const APIIntegrationSchema =
  SchemaFactory.createForClass(APIIntegration);

// Extend the schema with virtuals or methods for encryption and decryption
APIIntegrationSchema.methods.encryptSettings = function (jwt: string) {
  const algorithm = 'aes-256-cbc';
  const secretKey = Buffer.from(process.env.CREDENTIAL_KEY, 'hex');
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(jwt, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { encryptedData: encrypted, iv: iv.toString('hex') };
};

APIIntegrationSchema.methods.decryptSettings = function (
  encryptedData: string,
  iv: string,
) {
  const algorithm = 'aes-256-cbc';
  const secretKey = Buffer.from(process.env.CREDENTIAL_KEY, 'hex');
  const ivBuffer = Buffer.from(iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
