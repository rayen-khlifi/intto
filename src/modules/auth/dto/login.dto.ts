import { IsEmail, IsNotEmpty, MinLength, ValidateIf } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email obligatoire' })
  @IsEmail({}, { message: 'Email not correcte' })
  email: string;

  @ValidateIf((o) => o.email) // ✅ password يتفحص كان email موجود
  @IsNotEmpty({ message: 'Mot de passe obligatoire' })
  @MinLength(8, { message: 'Mot de passe minimum 8 caractères' })
  password: string;
}
