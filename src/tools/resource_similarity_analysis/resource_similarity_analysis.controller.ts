import { Controller, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import PurchaseOrder, {
  PurchaseOrderDocument,
} from 'src/db/schemas/PurchaseOrder';

@Controller('tools/resource_similarity_analysis')
export class ResourceSimilarityAnalysisController {
  constructor(
    @InjectModel('PurchaseOrder') private poModel: Model<PurchaseOrderDocument>,
  ) {}

  @Get()
  async getDivisionData() {
    // get top 100 records data
    const pos = await this.poModel
      .find()
      .limit(100)
      .populate('line_items')
      .exec();

    return {
      tool_instructions: `
          Use this tool to analyze the procurement data of the organization.
          We are looking for cost savings opportunities, supplier performance, and other insights.

          Each section should be detailed and provide a clear analysis of the data.
          
          - Cost savings opportunities: [list of opportunities]
          - Supplier performance: [list of suppliers and their performance]
          - Other insights: [list of insights]
          - Supplier Abuse Potential: [list of suppliers and their potential for abuse]
          - Supplier Price Gouging: [list of suppliers and their potential for price gouging]
          - Potential Realized Savings: [amount and you must give a detailed analysis of how you arrived at this number.]

          Before responding think about your answer and use other tools like web_search if need to research something in their procurement data.
          You can search and compare with live data on the web to provide a detailed analysis.

          The user will not respond to this so make sure to do your research with the tools and provide a detailed analysis.
          
          When you give your cost savings breakdown you must show examples of the line items you are considering and how you arrived at the savings.
          
        `,
      data: pos,
    };
  }
}
