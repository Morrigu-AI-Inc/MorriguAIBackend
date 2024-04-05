import { Module } from '@nestjs/common';
import { PersonasService } from './personas.service';

@Module({
  providers: [PersonasService],
})
export class PersonasModule {}
