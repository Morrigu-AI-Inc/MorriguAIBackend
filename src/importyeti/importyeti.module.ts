import { Module } from '@nestjs/common';
import { ImportyetiService } from './importyeti.service';
import { ImportyetiController } from './importyeti.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [ImportyetiController],
  providers: [ImportyetiService],
  imports: [DbModule],
})
export class ImportyetiModule {}
