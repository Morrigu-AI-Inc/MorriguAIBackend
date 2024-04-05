import { Controller, Get, Logger, Query } from '@nestjs/common';
import * as yup from 'yup';

/**
{
  "tool_name": "submit_seller_contact_information",
  "description": "The 'submit_seller_contact_information' tool is designed to streamline the process of collecting and storing contact information from sellers looking to list their properties. This tool is an integral part of a real estate platform, enabling a seamless exchange of information between sellers and realtors. By automating the data collection process, it ensures accuracy and efficiency, reducing the potential for human error. The tool supports various data fields, catering to the essential contact details required for effective communication and follow-up. It's built to accommodate the dynamic needs of real estate transactions, ensuring sellers' information is promptly and securely handled.",
  "parameters": [
    {
      "name": "seller_name",
      "type": "string",
      "description": "The full name of the seller submitting the property listing."
    },
    {
      "name": "phone_number",
      "type": "string",
      "description": "The contact phone number of the seller, formatted to include country and area codes where applicable."
    },
    {
      "name": "email_address",
      "type": "string",
      "description": "The email address of the seller, used for sending confirmations, notifications, and further communication."
    },
    {
      "name": "property_address",
      "type": "string",
      "description": "The physical address of the property being listed, including street name, number, city, and postal code."
    },
    {
      "name": "preferred_contact_method",
      "type": "string",
      "description": "The seller's preferred method of communication, such as 'email', 'phone', or 'text', to ensure messages are received in a timely and convenient manner."
    }
  ]
}
 */

@Controller('tools/submit_seller_contact_information')
export class SubmitSellerContactInformationController {
  private readonly logger: Logger = new Logger();
  @Get()
  async submitSellerContactInformation(
    @Query('parameters') parameters: string,
  ): Promise<any> {
    const validation = yup.object().shape({
      seller_name: yup.string().required(),
      phone_number: yup.string().required(),
      email_address: yup.string().email().required(),
      property_address: yup.string().required(),
      preferred_contact_method: yup.string().required(),
    });

    try {
      const parsedParameters = JSON.parse(parameters);

      this.logger.log('submit_seller_contact_information', parsedParameters);

      validation.validateSync(parsedParameters, { abortEarly: true });



      return {
        result: {
          tool_name: 'submit_seller_contact_information',
          stdout: {
            message: 'Seller contact information submitted successfully.',
            data: parsedParameters,
          },
        },
      };
    } catch (error) {
      return {
        result: {
          tool_name: 'submit_seller_contact_information',
          stdout: {
            message: 'Error submitting seller contact information.',
            error: error.message,
          },
        },
      };
    }
  }
}
