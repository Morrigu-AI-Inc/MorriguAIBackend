import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';
import * as sanitizeHtml from 'sanitize-html';
import { Xml2JsonServiceService } from 'src/xml2-json-service/xml2-json-service.service';

@Injectable()
export class ActionsService {
  constructor(private readonly xmlService: Xml2JsonServiceService) {}

  async handleAction(action: string, options?: unknown) {
    switch (action) {
      case 'webScraper':
        return await this.webScraper(options as string);
      default:
        return 'Action not found';
    }
  }

  async routeFunctionCalls(functionCalls: unknown, token) {
    console.log(JSON.stringify(functionCalls));
    return fetch(`${process.env.TOOLCHEST_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify(functionCalls),
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      });
  }

  async webScraper(url: string) {
    const { data } = await axios.get(url);
    const $ = load(data);

    const bodyToSummarize = $('body').text();

    return bodyToSummarize;
  }

  async searchGoogle(query: string): Promise<string[]> {
    console.log('searchGoogle', query);
    const links = await this.getLinksFromGoogle(query);

    console.log('links', links);

    return await this.fetchTopFiveLinksText([
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      ...links,
    ]);
  }

  async getLinksFromGoogle(query: string): Promise<string[]> {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });
    const $ = load(data);
    const links = [];

    $('a').each((i, element) => {
      const href = $(element).attr('href');
      // Only process links that start with "/url?" and contain "url=" parameter
      if (href && href.startsWith('/url?') && href.includes('url=')) {
        const urlParams = new URLSearchParams(href.substring(5)); // Remove '/url?' prefix
        const actualLink = urlParams.get('url');
        if (actualLink && actualLink.startsWith('http')) {
          links.push(decodeURIComponent(actualLink));
        }
      }
    });

    return [
      ...links,
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    ];
  }

  async fetchTopFiveLinksText(
    links: string[],
    num: number = 5,
  ): Promise<string[]> {
    // Limit to the top 5 links
    const topFiveLinks = links.slice(0, num);

    // Create a promise for each link to fetch and process its content
    const textPromises = topFiveLinks.map(async (link) => {
      try {
        const { data } = await axios.get(link, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
          },
        });

        // Use Cheerio to load the webpage content

        // Extract the text from the body or another suitable tag that encompasses the content you're interested in

        const pageText = sanitizeHtml(data, {
          allowedTags: [],
          allowedAttributes: {},
        });

        return this.compressWhitespace(pageText);
      } catch (error) {
        return ''; // Return an empty string in case of an error
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(textPromises);

    // Filter out empty strings in case some fetches failed
    return results.filter((text) => text.trim() !== '');
  }

  cleanText(rawText: string): string {
    // Remove script and style sections
    let cleanedText = rawText.replace(
      /<script[^>]*>([\S\s]*?)<\/script>/gim,
      '',
    );
    cleanedText = cleanedText.replace(/<style[^>]*>([\S\s]*?)<\/style>/gim, '');

    // Remove HTML tags
    cleanedText = cleanedText.replace(/<\/?[^>]+(>|$)/g, '');

    // Decode HTML entities
    cleanedText = cleanedText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    // Normalize whitespace
    cleanedText = cleanedText.replace(/\s+/g, ' ');

    return cleanedText.trim();
  }

  compressWhitespace = (html: string): string => {
    return html
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .replace(/\t/g, ' ') // Replace tabs with spaces
      .replace(/\s\s+/g, ' ') // Collapse multiple spaces into one
      .trim(); // Trim leading and trailing whitespace
  };
}
