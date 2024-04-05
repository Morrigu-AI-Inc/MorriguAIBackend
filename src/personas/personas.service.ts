import { Injectable } from '@nestjs/common';

export type Persona = {
  name: string;
  age: number;
  job: string;
  hobbies: string[];
  jobDescription: string;
  skills: string[];
  personality: string;
};

@Injectable()
export class PersonasService {}
