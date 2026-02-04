import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: Types.ObjectId, required: true, index: true })
  jobId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  candidateUserId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, index: true })
  companyUserId!: Types.ObjectId;

  @Prop({ default: 'APPLIED', index: true })
  status!: string;

  @Prop({ default: 0 })
  score!: number;

  @Prop({ default: '' })
  reason!: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
ApplicationSchema.index({ jobId: 1, candidateUserId: 1 }, { unique: true });
