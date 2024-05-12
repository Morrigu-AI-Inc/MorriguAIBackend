import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { DbModule } from 'src/db/db.module';
import { RolesController } from './roles.controller';

@Module({
  providers: [RolesService],
  imports: [DbModule],
  controllers: [RolesController],
})
export class RolesModule {}
