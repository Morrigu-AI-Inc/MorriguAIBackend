import { Injectable } from '@nestjs/common';
import { CreateGenerativeDto } from './dto/create-generative.dto';
import { UpdateGenerativeDto } from './dto/update-generative.dto';
import { AssistantService } from 'src/assistant/assistant.service';
import OpenAI from 'openai';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  AssistantDocument,
  Media,
  ToolOutputDocument,
  User,
  UserDocument,
} from 'src/db/schemas';
import { ThreadDocument } from 'src/db/schemas/Thread';
import { MessageDocument } from 'src/db/schemas/Message';
import { promises as fsPromises, unlink } from 'fs';
import { createReadStream } from 'fs';
import { AttachmentDocument } from 'src/db/schemas/Attachment';
import { MediaService } from 'src/media/media.service';
import { ThreadMessageDocument } from 'src/db/schemas/ThreadMessage';
import { RunDocument } from 'src/db/schemas/Run';
import { RunStepDocument } from 'src/db/schemas/Step';
@Injectable()
export class GenerativeService {
  private openai: OpenAI;

  constructor(
    private assistantService: AssistantService,
    private mediaService: MediaService,
    @InjectModel('Assistant') private assistantModel: Model<AssistantDocument>,
    @InjectModel('Thread') private threadModel: Model<ThreadDocument>,
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Run')
    private runModel: Model<RunDocument>,
    @InjectModel('RunStep')
    private runStepModel: Model<RunStepDocument>,
    @InjectModel('ToolOutput')
    private toolOutputModel: Model<ToolOutputDocument>,
    @InjectModel('ThreadMessage')
    private threadMessageModel: Model<ThreadMessageDocument>,
    @InjectModel('Attachment')
    private attachmentModel: Model<AttachmentDocument>,
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  create(createGenerativeDto: CreateGenerativeDto) {
    return 'This action adds a new generative';
  }

  findAll() {
    return `This action returns all generative`;
  }

  findOne(id: number) {
    return `This action returns a #${id} generative`;
  }

  update(id: number, updateGenerativeDto: UpdateGenerativeDto) {
    return `This action updates a #${id} generative`;
  }

  remove(id: number) {
    return `This action removes a #${id} generative`;
  }

  async getThread(id: string) {
    const thread = await this.threadModel.findOne({
      id,
    });

    if (!thread) {
      throw new Error('Thread not found');
    }

    const messages = await this.threadMessageModel.find({
      thread_id: thread.id,
    });

    // get the run steps to recreate the thread
    const runSteps = await this.runStepModel.find({
      thread_id: thread.id,
    });

    // error check
    if (!runSteps) {
      throw new Error('Run steps not found');
    }

    const runStepsGrouped = runSteps.reduce((acc, step) => {
      if (!acc[step.run_id]) {
        acc[step.run_id] = [];
      }

      acc[step.run_id].push(step);

      return acc;
    }, {});


    console.log('Run Steps:', JSON.stringify(runStepsGrouped, null, 2));


    /// below basically adds the steps to the messages and return the thread. 
    /// In a long worded way we are now able to iterate through the messages on the front end when we render the thread. 
    /// When we find something that was a tool-call we can now render the tool output.
    return {
      ...thread,
      messages: messages.map((msg) => {
        return {
          ...msg.toObject(),
          // we want to find the message_creation step and add the message to the object to return
          steps: runStepsGrouped[msg.run_id]?.map((step) => {
            if (step.step_details.type === 'message_creation') {
              return {
                ...step.toObject(),
                message: messages.find(
                  (m) =>
                    m.id === step.step_details?.message_creation?.message_id,
                ),
              };
            }
            return step.toObject();
          }),
        };
      }),
    };
  }

  async createThread(owner: UserDocument, alternate_instructions?: string) {
    const thread = await this.openai.beta.threads.create();

    try {
      const options = alternate_instructions
        ? {
            ...thread,
            alternate_instructions,
            owner: owner._id,
          }
        : {
            ...thread,
            owner: owner._id,
          };
      const newThread = await this.threadModel.create(options);

      return newThread;
    } catch (error) {
      console.error('Error creating thread:', error);
    }
  }

  async createMessage(
    assistantId: string,
    threadId: string,
    message: string,
    file: [any, Media | Error],
    alternateInstruction?: string,
  ) {
    const thread = await this.threadModel.findOne({
      id: threadId,
    });

    if (!thread) {
      throw new Error('Thread not found');
    }

    const files = [];

    if (file[0] && file[1]) {
      const base64Data = file[0].buffer.toString('base64');
      if (!base64Data) {
        throw new Error('Invalid base64 data');
      }

      const buffer = Buffer.from(base64Data, 'base64');

      const tempFilePath = `./${file[0].originalname}`;

      await fsPromises.writeFile(tempFilePath, buffer);

      try {
        const readStream = createReadStream(tempFilePath);

        const response = await this.openai.files.create({
          file: readStream,
          purpose: 'assistants',
        });

        if (!response) {
          throw new Error('Error uploading file');
        }

        const attachment = await this.attachmentModel.create({
          file_id: response.id,
          media: file[1],
        });

        files.push(attachment);

        // console.log('File uploaded:', response, attachment);

        await fsPromises.unlink(tempFilePath);
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    }

    // console.log('Files:', files);

    const msg = await this.openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
      attachments: files.map((f) => {
        return {
          file_id: f.file_id,
          tools: [
            {
              type: 'code_interpreter',
            },
            {
              type: 'file_search',
            },
          ],
        };
      }) as any,
    });

    // console.log('Message:', msg);

    const threadMessage = await this.threadMessageModel.create({
      ...msg,
    });

    // console.log('Thread Message:', threadMessage);

    const savedMsg = await this.messageModel.create({
      ...msg,
      id: msg.id,
      meta: msg,
      owner: thread.owner,
    });
    // console.log('Message:', alternateInstruction);

    return savedMsg;
  }

  async createRun(threadId, { assistantId }, stream: boolean = false) {}

  async getAndRunAssistant(
    owner: string,
    userId: string,
    assistantId: string,
    message: string,
    file: File,
  ) {
    const user = await this.userModel.findOne({
      _id: userId,
    });

    const assistant = await this.assistantModel.find({
      owner: owner,
      _id: assistantId,
    });

    if (assistant.length === 0) {
      throw new Error('Assistant not found');
    }

    const newThread = (await this.createThread(user._id)) as any;

    const add = await this.openai.files.create({
      // file: fs.createReadStream('mydata.jsonl'),
      file: file,
      purpose: 'assistants',
    });

    const newMEssage = await this.openai.beta.threads.messages.create(
      newThread.id || '',
      {
        role: 'user',
        content: message,
      },
    );

    // console.log('Add:', add);

    // this.openai.beta.threads.create({
    //   model: assistant.model,
    //   messages: [
    //     {
    //       role: 'system',
    //       content: 'You are knowledgeable about the tools available to you. You can ask me to update the tools available to you.',
    //     },
    //   ],
    // });
  }
}
