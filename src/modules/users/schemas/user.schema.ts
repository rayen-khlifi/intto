import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../../shared/enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, lowercase: true, unique: true, index: true })
  email!: string;

  @Prop({ required: true })
  passwordHash!: string;

  @Prop({ required: true, enum: Role, index: true })
  role!: Role;

  @Prop({ required: true })
  displayName!: string;

  @Prop({ type: Object, default: {} })
  profile!: Record<string, any>;

  // ✅ Email verification (OTP)
  @Prop({ default: false })
  isEmailVerified!: boolean;

 @Prop({ type: String, default: null })
emailOtpHash!: string | null;

@Prop({ type: Date, default: null })
emailOtpExpiresAt!: Date | null;


  // ✅ Ajout pour TS (Mongoose les ajoute via timestamps)
  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
