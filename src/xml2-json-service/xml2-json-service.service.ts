import { Injectable } from '@nestjs/common';
import { parseStringPromise, Builder } from 'xml2js';

@Injectable()
export class Xml2JsonServiceService {
  async convertXmlToJson(input: string): Promise<any> {
    try {
      // Attempt to isolate XML content from potential preceding text
      const xml = this.extractXmlContent(input);

      console.log('xml-converted', xml);

      const result = await parseStringPromise(xml, {
        explicitArray: false,
        ignoreAttrs: true,
        stripPrefix: true,
      });

      console.log('result', result);

      return result;
    } catch (error) {
      console.log('error', error);
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
