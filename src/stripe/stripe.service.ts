import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createCustomer(email: string, name: string) {
    return this.stripe.customers.create({
      email,
      name,
    });
  }

  async findAllCustomers() {
    return this.stripe.customers.list();
  }

  async findOneCustomer(id: string) {
    return this.stripe.customers.retrieve(id);
  }

  async updateCustomer(id: string, email: string, name: string) {
    return this.stripe.customers.update(id, {
      email,
      name,
    });
  }

  async removeCustomer(id: string) {
    return this.stripe.customers.del(id);
  }

  async saveCard(customerId: string, source: any) {
    return this.stripe.customers.createSource(customerId, source);
  }

  async listCards(customerId: string) {
    return this.stripe.customers.listSources(customerId, {
      object: 'card',
    });
  }

  async removeCard(customerId: string, cardId: string) {
    return this.stripe.customers.deleteSource(customerId, cardId);
  }

  async fetchOrCreateNew(email: string, name: string) {
    console.log('FETCHING STRIPE USER:', email, name);
    const customers = await this.stripe.customers.list({
      email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // Customer with the given email does not exist, create new one
      return this.createCustomer(email, name);
    }

    // Return the first customer found with this email
    return customers.data[0];
  }
}
