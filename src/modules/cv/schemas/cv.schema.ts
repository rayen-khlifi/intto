import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CvDocument = CV & Document;

@Schema({ timestamps: true })
export class CV {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  userId!: Types.ObjectId;

  @Prop({ required: true })
  filename!: string;

  @Prop({ required: true })
  text!: string;

  @Prop({ type: [String], default: [] })
  extractedSkills!: string[];
}

export const CvSchema = SchemaFactory.createForClass(CV);
