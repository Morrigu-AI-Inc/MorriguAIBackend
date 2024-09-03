import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { CreateAmazonDto } from './dto/create-amazon.dto';
import { UpdateAmazonDto } from './dto/update-amazon.dto';
import { Request, Response } from 'express';
import { POStatus } from 'src/db/schemas/PurchaseOrder';

@Controller('punchouts/amazon')
export class AmazonController {
  constructor(private readonly amazonService: AmazonService) {}

  @Post('credentials')
  async create(
    @Body()
    credentials: {
      punchoutEnabled: boolean;
      punchoutUrl: string;
      punchoutSecret: string;
      punchoutIdentity: string;
      owner: string;
    },
  ) {
    return this.amazonService.saveCredentials(credentials.owner, credentials);
  }

  @Get('credentials')
  async findAll(@Query('owner') owner: string) {
    return this.amazonService.getCredentials(owner);
  }

  // New endpoint to initiate a PunchOut session
  @Post('start')
  async startPunchOut(
    @Body('owner') owner: string,
    @Query('test') test: boolean,
  ) {
    return this.amazonService.createPunchOutSetupRequest(owner, !!test);
  }

  @Post('status')
  async status(
    @Body('poId') poid: string,
    @Body('status') status: POStatus,
    @Body('actionBy') actionBy: string,
  ) {
    return this.amazonService.setStatus(poid, status, actionBy);
  }

  // New endpoint to handle the PunchOut Order Message (POM) return
  @Post('order')
  async handlePunchOutOrder(@Req() req: Request, @Res() res: Response) {
    // Capture the raw XML data
    const rawXml = req.body;

    const { po } = await this.amazonService.handlePunchOutOrderMessage(rawXml);
    // redirect to the edit page

    // Redirect to the edit page

    return res.redirect(
      `${process.env.FRONTEND_URL}/purchasing/edit/${po.po_number}`,
    );
  }

  // New endpoint to send a purchase order to Amazon
  @Post('order/:id/send')
  async sendPurchaseOrder(
    @Param('id') id: string,
    @Body('owner') owner: string,
  ) {
    return this.amazonService.sendPurchaseOrder(id, owner, false);
  }
}
