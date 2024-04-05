import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { QueryDocument } from 'src/db/schemas/Query';
import { PrompthistoryService } from './prompthistory.service';
import { PromptHistoryDocument } from 'src/db/schemas/PromptHistory';
import * as yup from 'yup';

@Controller('prompthistory')
export class PrompthistoryController {
  constructor(private readonly prompthistoryService: PrompthistoryService) {}

  @Get()
  findAll() {
    return 'This action returns all prompthistory';
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PromptHistoryDocument> {
    return this.prompthistoryService.getHistoryById(id);
  }

  @Post(':id/appendQuery')
  appendQueryToHistory(
    @Param('id') id: string,
    @Body()
    body: {
      message: string;
    },
  ) {
    try {
      const validation = yup.object().shape({
        body: yup.object().required(),
      });

      console.log('body', body, id);

      const query = validation.validateSync(
        {
          body: {
            text: body.message,
          },
        },
        {
          abortEarly: true,
        },
      );

      console.log('query', query);

      return this.prompthistoryService.appendQueryToHistory(id, query);
    } catch (e) {
      return e;
    }
  }

  @Get(':id/appendResponse')
  appendResponseToHistory(id, response: Partial<QueryDocument>) {
    return this.prompthistoryService.appendResponseToHistory(id, response);
  }

  @Post()
  async create(@Body() body: Partial<PromptHistoryDocument>) {
    try {
      const validation = yup.object().shape({});

      const values = await validation.validate(body, {
        abortEarly: false,
      });

      return this.prompthistoryService.createHistory(values);
    } catch (e) {
      console.log(e);
    }
  }

  @Put(':id')
  update(@Param('id') id: string) {
    return `This action updates a #${id} prompthistory`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} prompthistory`;
  }
}
