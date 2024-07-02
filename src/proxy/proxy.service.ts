import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { APIIntegrationDocument } from 'src/db/schemas/APIIntegration';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

@Injectable()
export class ProxyService {
  constructor(
    @InjectModel('APIIntegration')
    private readonly apiIntegrationModel: Model<APIIntegrationDocument>,
  ) {}

  async getAPIIntegrationById(id: string): Promise<APIIntegrationDocument> {
    return this.apiIntegrationModel.findById(id).exec();
  }

  async getAPIIntegrationsByOwner(
    owner: string,
  ): Promise<APIIntegrationDocument[]> {
    return this.apiIntegrationModel.find({ owner }).exec();
  }

  async createAPIIntegration(
    apiIntegration: Partial<APIIntegrationDocument>,
    credentials: {
      [key: string]: string;
    },
  ): Promise<APIIntegrationDocument> {
    const creds = jwt.sign(credentials, process.env.JWT_KEY);

    const decrypted = jwt.verify(creds, process.env.JWT_KEY);

    const algorithm = 'aes-256-cbc';
    const secretKey = Buffer.from(process.env.CREDENTIAL_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(creds, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    apiIntegration.settings = {
      encryptedData: encrypted,
      iv: iv.toString('hex'),
    };

    return this.apiIntegrationModel.create(apiIntegration);
  }

  async updateAPIIntegration(
    id: string,
    apiIntegration: Partial<APIIntegrationDocument>,
  ): Promise<APIIntegrationDocument> {
    return this.apiIntegrationModel
      .findByIdAndUpdate(id, apiIntegration)
      .exec();
  }

  async deleteAPIIntegration(id: string): Promise<APIIntegrationDocument> {
    return this.apiIntegrationModel.findByIdAndDelete(id).exec();
  }

  public async decryptAPIIntegration(apiIntegration: APIIntegrationDocument) {
    const { encryptedData, iv } = apiIntegration.settings;

    const algorithm = 'aes-256-cbc';
    const secretKey = Buffer.from(process.env.CREDENTIAL_KEY, 'hex');
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto.createDecipheriv(algorithm, secretKey, ivBuffer);
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // this is the JWT

    const creds = jwt.verify(decrypted, process.env.JWT_KEY);

    return { ...apiIntegration, settings: creds };
  }

  public async encryptAPIIntegration(apiIntegration: APIIntegrationDocument) {
    const creds = jwt.sign(apiIntegration.settings, process.env.JWT_KEY);

    const algorithm = 'aes-256-cbc';
    const secretKey = Buffer.from(process.env.CREDENTIAL_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    let encrypted = cipher.update(creds, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
  }
}
