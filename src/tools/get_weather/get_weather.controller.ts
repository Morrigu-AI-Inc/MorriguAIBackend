import { Controller, Get, Query } from '@nestjs/common';
import * as yup from 'yup';

@Controller('tools/get_weather')
export class GetWeatherController {
  @Get()
  async getWeather(@Query('parameters') parameters: string): Promise<any> {
    try {
      const jsonObj = JSON.parse(parameters);

      const validation = yup.object().shape({
        location: yup.string().required(),
      });

      validation.validateSync(jsonObj, {
        abortEarly: true,
      });

      return {
        result: {
          tool_name: 'get_weather',
          stdout: `
          <weather>
          <temperature>72</temperature>
          <humidity>0.5</humidity>
          <wind_speed>10</wind_speed>
          <wind_direction>NE</wind_direction>
          </weather>
          `,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        result: {
          tool_name: 'get_weather',
          stdout: {
            error: error.message,
          },
        },
      };
    }
  }
}
