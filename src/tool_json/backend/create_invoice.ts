import { invoiceSchema } from '../compiled_taps/quickbooks';

console.log(invoiceSchema);
const create_invoice = {
  type: 'function',
  function: {
    name: 'create_invoice',
    description:
      'Create an invoice for the given customer. Paya attention to the required fields.',
    parameters: {
      type: 'object',
      properties: {
        ...invoiceSchema.properties,
      },
    },
  },
};

export default create_invoice;
