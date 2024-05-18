import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamService {
  create(createTeamDto: CreateTeamDto) {
    return {
      message: 'Team created successfully',
      data: createTeamDto,
    };
  }

  findAll() {
    return [];
  }

  findOne(id: number) {
    return {
      _id: id,
      name: 'Team Name',
      description: 'Team Description',
    };
  }

  update(id: number, updateTeamDto: UpdateTeamDto) {
    return {
      message: 'Team updated successfully',
      data: updateTeamDto,
    };
  }

  remove(id: number) {
    return {
      message: 'Team deleted successfully',
      data: id,
    };
  }
}
