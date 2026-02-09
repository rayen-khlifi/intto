import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../../../shared/enums/role.enum';


export class RegisterDto {
  @ApiProperty({ example: 'rayen@example.com' })
  @IsNotEmpty({ message: 'Email obligatoire' })
  @IsEmail({}, { message: 'Email not correcte' })
  email!: string;

  @ApiProperty({ minLength: 8 })
  @IsNotEmpty({ message: 'Mot de passe obligatoire' })
  @MinLength(8, { message: 'Mot de passe minimum 8 caractères' })
  password!: string;

  @ApiProperty({ enum: Role, example: Role.JOB_SEEKER })
  @IsNotEmpty({ message: 'Role obligatoire' })
  @IsEnum(Role, { message: 'Role is not found' })
  role!: Role;

  @ApiProperty({ example: 'Rayen Khelifi' })
  @IsNotEmpty({ message: 'Display name obligatoire' })
  displayName!: string;
}
