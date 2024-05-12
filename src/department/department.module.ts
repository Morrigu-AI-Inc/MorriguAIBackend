import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { DbModule } from 'src/db/db.module';

@Module({
  controllers: [DepartmentController],
  providers: [DepartmentService],
  imports: [DbModule],
})
export class DepartmentModule {}
