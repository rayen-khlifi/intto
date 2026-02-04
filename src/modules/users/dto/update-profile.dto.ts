import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Rayen Khelifi' })
  @IsOptional()
  @IsString()
  displayName?: string;

  @ApiPropertyOptional({ example: 'Tunis' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: ['Node.js', 'NestJS', 'MongoDB'] })
  @IsOptional()
  @IsArray()
  skills?: string[];

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsOptional()
  @IsString()
  education?: string;

  @ApiPropertyOptional({ example: '2 years internship experience' })
  @IsOptional()
  @IsString()
  experience?: string;
}
