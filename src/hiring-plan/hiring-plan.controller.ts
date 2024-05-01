// src/hiring-plan/hiring-plan.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { HiringPlanService } from './hiring-plan.service';

@Controller('hiring-plans')
export class HiringPlanController {
  constructor(private readonly hiringPlanService: HiringPlanService) {}

  @Post('/initialize')
  async initializeHiringPlan(@Body() hiringPlanData: any) {
    return this.hiringPlanService.initializeHiringPlan(hiringPlanData.owner);
  }

  @Post('/team')
  async createTeam(@Body() teamData: any) {
    return this.hiringPlanService.createTeam(teamData);
  }

  @Get('/team')
  async getAllTeams() {
    return this.hiringPlanService.getAllTeams();
  }

  @Get('/team/:id')
  async getTeam(@Param('id') id: string) {
    return this.hiringPlanService.getTeam(id);
  }

  @Get('/team/:id/employees')
  async getTeamEmployees(@Param('id') id: string) {
    return this.hiringPlanService.getTeamEmployees(id);
  }

  @Post('/employee')
  async createEmployee(@Body() employeeData: any) {
    return this.hiringPlanService.createEmployee(employeeData);
  }

  @Put('/employee/:id')
  async updateEmployee(@Param('id') id: string, @Body() updateData: any) {
    return this.hiringPlanService.updateEmployee(id, updateData);
  }

  @Delete('/employee/:id')
  async deleteEmployee(@Param('id') id: string) {
    return this.hiringPlanService.deleteEmployee(id);
  }

  @Get('/employee/:id')
  async getEmployee(@Param('id') id: string) {
    return this.hiringPlanService.getEmployee(id);
  }

  @Get('/employee')
  async getAllEmployees() {
    return this.hiringPlanService.getAllEmployees();
  }

  @Get('/forecast')
  async calculateForecasts(
    @Query('startMonth') startMonth: Date,
    @Query('monthsAhead') monthsAhead: number,
  ) {
    const startDate = new Date(startMonth);
    return this.hiringPlanService.calculateForecasts(startDate, monthsAhead);
  }
}
