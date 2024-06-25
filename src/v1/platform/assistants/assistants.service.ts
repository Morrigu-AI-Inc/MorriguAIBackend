import { Injectable } from '@nestjs/common';
import { CreateAssistantDto } from './dto/create-assistant.dto';
import { UpdateAssistantDto } from './dto/update-assistant.dto';
import { AssistantParams, OpenaiService } from 'src/openai/openai.service';


@Injectable()
export class AssistantsService {
  constructor(private openAiService: OpenaiService) {
    
  }
  create(createAssistantDto: AssistantParams) {
    return this.openAiService.createAssistant(createAssistantDto);
  }

  findAll() {
    return this.openAiService.getAssistants();
  }

  findOne(id: string) {
    return this.openAiService.getAssistant(id);
  }

  update(id: string, updateAssistantDto: AssistantParams) {
    return this.openAiService.updateAssistant(id, updateAssistantDto);
  }
  remove(id: string) {
    return this.openAiService.deleteAssistant(id);
  }
  
}
