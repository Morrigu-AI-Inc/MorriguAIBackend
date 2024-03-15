import { Injectable, Logger } from '@nestjs/common';
import {
  BedrockRuntimeClient,
  InvokeModelWithResponseStreamCommand,
  ResponseStream,
} from '@aws-sdk/client-bedrock-runtime'; // ES Modules import

import { PromptflagService } from 'src/promptflag/promptflag.service';
import { QueryDocument } from 'src/db/schemas/Query';
import { QueryResponseDocument } from 'src/db/schemas/QueryResponse';
import { QueryResponsePairDocument } from 'src/db/schemas/QueryResponsePair';

type BodyProps = {
  prompt: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens_to_sample: number;
  stop_sequences?: Array<string>;
};

@Injectable()
export class BedrockService {
  private logger = new Logger(BedrockService.name);

  constructor(private readonly promptFlagService: PromptflagService) {}
  InvokeModelWithResponseStream = async (
    body: BodyProps,
    modelId: string,
    historyId?: string,
  ) => {
    const {
      flag,
      prompt,
      model,
      formattings,
      inf_params,
      history,
    }: {
      flag: any;
      prompt: any;
      model: any;
      formattings: any;
      inf_params: any;
      history: any;
    } = await this.promptFlagService.findOne(
      '65e298b099d3186571f00b64',
      '65e2419578ded9ac763cba7e',
      historyId,
    );

    let promptToInvoke = `${prompt.system_message}\n\n`;

    if (history) {
      for (let i = 0; i < history?.length; i++) {
        console.log('history[i]', history[i]);
        const pair = history[i] as unknown as QueryResponsePairDocument;
        const query = pair.query as unknown as QueryDocument;
        const response = pair.response as unknown as QueryResponseDocument;

        console;

        promptToInvoke += `${formattings?.user_prefix} ${query.body['text']}\n\n${formattings?.assistant_prefix} ${
          response?.body?.['text'] || ''
        }\n\n`;
      }
    } else {
      promptToInvoke += `${formattings?.user_prefix} ${body.prompt}\n\n${formattings?.assistant_prefix} `;
    }

    const bedrock = new BedrockRuntimeClient({ region: 'us-east-1' });

    const input = {
      // InvokeModelRequest
      body: JSON.stringify({
        ...body,
        ...inf_params,
        prompt: promptToInvoke,
      }), // required
      contentType: 'application/json',
      accept: 'application/json',
      modelId: modelId,
    };
    const command = new InvokeModelWithResponseStreamCommand(input);
    const response = await bedrock.send(command);

    return response.body as AsyncIterable<ResponseStream>;
  };
}
