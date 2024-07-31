import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type USDAReportDocument = USDAReport & Document;

type Statistics = {
  totalHeadSlaughtered: {
    description: string;
    date: string;
    value: number;
  };
  averageLiveWeight: {
    description: string;
    date: string;
    value: number;
  };
  commercialRedMeatProduction: {
    description: string;
    date: string;
    value: number;
  };
  slaughterDistributionByState: {
    description: string;
    states: {
      state: string;
      slaughterRate: number | string;
    }[];
  };
  dressedWeight: {
    description: string;
    date: string;
    value: number;
  };
  feedlotData: {
    description: string;
    dataInferred: boolean;
    details: string;
  };
  cattleSlaughterDataByState: {
    states: {
      state: string;
      total_head_slaughtered: number | string;
      total_live_weight: number | string;
      average_live_weight: number | string;
    }[];
  };
}

type GeneratedContent = {
  title: string;
  summary: string;
  statistics: Statistics;
};


@Schema({
  timestamps: true,
  versionKey: 'version',
})
export class USDAReport extends Document {
  @Prop({ required: false })
  title: string;

  @Prop({ required: false })
  reportDate: Date;

  @Prop({ required: false })
  reportType: string;

  @Prop({ required: false })
  fullText: string;

  @Prop({ required: false })
  abstract: string;

  @Prop({ required: false })
  summary: string;

  @Prop({ type: Map, of: String, required: false })
  parsedDetails: Map<string, string>;

  @Prop({ required: false })
  pdfLink: string;

  @Prop({ required: false })
  textLink: string;

  @Prop({ required: false })
  zipLink: string;

  @Prop({ required: false })
  generatedSummary: any[];

  @Prop({ required: false })
  slug: string;

  @Prop({ required: false, type: Object })
  generated: GeneratedContent;
}

const USDAReportSchema = SchemaFactory.createForClass(USDAReport);

export default USDAReportSchema;
