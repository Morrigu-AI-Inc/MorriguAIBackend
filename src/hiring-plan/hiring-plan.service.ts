// src/hiring-plan/hiring-plan.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from 'src/db/schemas/Employee';
import { HiringPlan } from 'src/db/schemas/HiringPlan';
import { Team } from 'src/db/schemas/Team';

@Injectable()
export class HiringPlanService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
    @InjectModel(HiringPlan.name) private hiringPlanModel: Model<HiringPlan>,
  ) {}

  async initializeHiringPlan(owner: string): Promise<HiringPlan> {
    const currentDate = new Date();
    const currentEmployees = await this.employeeModel.find({
      hireDate: { $lte: currentDate },
      $or: [
        { terminationDate: { $gte: currentDate } },
        { terminationDate: { $exists: false } },
      ],
    });

    const newHiringPlan = new this.hiringPlanModel({
      startDate: currentDate,
      currentEmployees: currentEmployees.map((emp) => emp._id),
      futureEmployees: [], // No future employees initially
      owner: owner,
    });

    return newHiringPlan.save();
  }

  // Create a new team
  async createTeam(data: any): Promise<Team> {
    const newTeam = new this.teamModel(data);
    return newTeam.save();
  }

  async getTeam(teamId: string): Promise<Team> {
    const team = await this.teamModel.findById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    return team;
  }

  async getTeamEmployees(teamId: string): Promise<Employee[]> {
    return this.employeeModel.find({
      teamId: teamId,
    });
  }

  async getAllTeams(): Promise<Team[]> {
    return this.teamModel.find();
  }

  // Create a new employee
  async createEmployee(data: any): Promise<Employee> {
    const newEmployee = new this.employeeModel(data);
    return newEmployee.save();
  }

  // Create a new hiring plan
  async createHiringPlan(data: any): Promise<HiringPlan> {
    const newPlan = new this.hiringPlanModel(data);
    return newPlan.save();
  }

  // Update an existing employee
  async updateEmployee(employeeId: string, updateData: any): Promise<Employee> {
    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true },
    );
    if (!updatedEmployee) {
      throw new NotFoundException('Employee not found');
    }
    return updatedEmployee;
  }

  // Delete an employee
  async deleteEmployee(employeeId: string): Promise<void> {
    const result = await this.employeeModel.deleteOne({ _id: employeeId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Employee not found');
    }
  }

  async getEmployee(employeeId: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(employeeId);
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return this.employeeModel.find();
  }

  // Calculate forecasts for the specified number of months ahead
  async calculateForecasts(
    startMonth: Date,
    monthsAhead: number,
  ): Promise<any[]> {
    const forecasts = [];
    for (let i = 0; i < monthsAhead; i++) {
      const forecastDate = new Date(
        startMonth.getFullYear(),
        startMonth.getMonth() + i,
        1,
      );
      const monthlyForecast = await this.calculateMonthlyForecast(forecastDate);
      forecasts.push(monthlyForecast);
    }
    return forecasts;
  }

  private async calculateMonthlyForecast(date: Date): Promise<any> {
    // Example calculations for salaries, taxes, and benefits for the given month
    const salaries = await this.aggregateSalariesWithRaisesAndBonuses(date);
    const taxes = await this.aggregateTaxes(date);
    const benefits = await this.aggregateBenefits(date);
    return { date, salaries, taxes, benefits };
  }

  private async aggregateSalaries(date: Date): Promise<number> {
    // Aggregate total salaries for all employees whose employment includes the given date
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result = await this.employeeModel.aggregate([
      {
        $match: {
          hireDate: { $lte: endOfMonth },
          $or: [
            { terminationDate: { $gte: startOfMonth } },
            { terminationDate: { $exists: false } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalSalary: { $sum: '$salary' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalSalary : 0;
  }

  private async aggregateSalariesWithRaisesAndBonuses(
    date: Date,
  ): Promise<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const employees = await this.employeeModel.find({
      hireDate: { $lte: startOfMonth },
      $or: [
        { terminationDate: { $gte: startOfMonth } },
        { terminationDate: { $exists: false } },
      ],
    });

    let totalSalary = 0;
    employees.forEach((employee) => {
      let salary = employee.salary;
      const yearsEmployed =
        date.getFullYear() - employee.hireDate.getFullYear();

      // Apply annual increase if applicable
      if (employee.annualIncreasePercent && employee.annualIncreaseDate) {
        for (let i = 0; i < yearsEmployed; i++) {
          const increaseDate = new Date(employee.hireDate);
          increaseDate.setFullYear(increaseDate.getFullYear() + i + 1);
          if (increaseDate <= date) {
            salary += salary * (employee.annualIncreasePercent / 100);
          }
        }
      }

      totalSalary += salary;
    });

    return totalSalary;
  }

  private async aggregateTaxes(date: Date): Promise<number> {
    // Aggregate payroll taxes based on the salaries and tax rates
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result = await this.employeeModel.aggregate([
      {
        $match: {
          hireDate: { $lte: endOfMonth },
          $or: [
            { terminationDate: { $gte: startOfMonth } },
            { terminationDate: { $exists: false } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalTax: { $sum: { $multiply: ['$salary', '$payrollTax'] } },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalTax : 0;
  }

  private async aggregateBenefits(date: Date): Promise<number> {
    // Aggregate benefits based on the benefits settings per employee
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const result = await this.employeeModel.aggregate([
      {
        $match: {
          hireDate: { $lte: endOfMonth },
          $or: [
            { terminationDate: { $gte: startOfMonth } },
            { terminationDate: { $exists: false } },
          ],
        },
      },
      {
        $group: {
          _id: null,
          totalBenefits: { $sum: '$dollarBenefits' },
        },
      },
    ]);

    return result.length > 0 ? result[0].totalBenefits : 0;
  }
}
