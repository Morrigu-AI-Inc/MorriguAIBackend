import { Injectable } from '@nestjs/common';
import { parseStringPromise, Builder } from 'xml2js';

@Injectable()
export class Xml2JsonServiceService {
  async convertXmlToJson(input: string): Promise<any> {
    try {
      const result = await parseStringPromise(input, {
        explicitArray: false,
        ignoreAttrs: true,
        stripPrefix: true,
      });

      return result;
    } catch (error) {
      throw new Error('Failed to process input');
    }
  }

  public extractXmlContent(input: string): string {
    // Regex to match XML content, adjusting as necessary for your specific cases
    const xmlContentMatch = input.match(
      /<function_calls>[\s\S]*?<\/function_calls>/,
    );
    if (!xmlContentMatch) {
      throw new Error('No XML content found');
    }
    return xmlContentMatch[0];
  }

  public jsonToXML(input: any): string {
    const builder = new Builder({
      stripPrefix: true,
    });

    return builder.buildObject(input).replace(/^<\?xml.*\?>\s*/, '');
  }
}
