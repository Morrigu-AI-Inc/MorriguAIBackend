import {
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Query,
  Sse,
} from '@nestjs/common';

import { BedrockService } from './bedrock.service';
import { Observable } from 'rxjs';
import * as yup from 'yup';

type Payload = {
  body: {
    prompt: string;
    max_tokens_to_sample: number;
  };
  modelId: string;
};

const validation = yup.object<Payload>().shape({
  id: yup.string().required('id is required.'),
  payload: yup.object().shape({
    body: yup
      .object()
      .shape({
        prompt: yup.string().required('prompt is required.'),
        max_tokens_to_sample: yup
          .number()
          .required('max_tokens_to_sample is required.'),
      })
      .required('body is required.'),
    historyId: yup.string(),
    modelId: yup.string().required('modelId is required.'),
  }),
});

@Controller('bedrock')
export class BedrockController {
  private readonly logger = new Logger(BedrockController.name);

  constructor(private readonly bedrockService: BedrockService) {}

  @Sse('InvokeStream/:featureId')
  @Get('InvokeStream/:featureId')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache, no-transform')
  @Header('Content-Encoding', 'none')
  @Header('Transfer-Encoding', 'chunked')
  async invokeStream(
    @Param('featureId') id: string,
    @Query('payload') payload: string,
    @Query('token') token: string,
  ): Promise<Observable<any>> {
    try {
      const validPayload = await validation.validate(
        { id: id?.[0], payload: JSON.parse(payload) },
        { abortEarly: false },
      );

      this.logger.log('InvokeStream called with payload: ' + payload);

      return new Observable((observer) => {
        this.bedrockService
          .InvokeModelWithResponseStream(
            {
              prompt:
                '\n\nHuman: What is the capital of France?\n\nAssistant: ',
              max_tokens_to_sample: 50,
            },
            'anthropic.claude-v2:1',
            validPayload.payload.historyId as string,
          )
          .then(async (stream) => {
            if (stream) {
              for await (const chunk of stream) {
                const jsonString = new TextDecoder().decode(chunk.chunk?.bytes);
                const parsedChunk = JSON.parse(jsonString);
                // Emit each chunk as a message event

                observer.next({ data: JSON.stringify(parsedChunk) });
              }
              // Complete the observable when the stream ends
              observer.complete();
            }
          })
          .catch((error) => {
            // Emit an error if something goes wrong
            observer.error(error);
          });
      });

      // const flag = this.promptFlagService.findOne(validPayload.id as string, token);
    } catch (error) {
      this.logger.error('Error invoking stream', error);
    }
  }
}
