import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type JobDocument = Job & Document;

@Schema({ timestamps: true })
export class Job {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  companyUserId!: Types.ObjectId;

  @Prop({ required: true, trim: true })
  title!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ default: '' })
  location!: string;

  @Prop({ type: [String], default: [] })
  skillsRequired!: string[];

  @Prop({ default: 'FULL_TIME' })
  type!: string;

  @Prop({ default: 'OPEN', index: true })
  status!: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
