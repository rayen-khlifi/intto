import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: 'Backend Intern (NestJS)' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiProperty({ example: 'We are looking for a NestJS intern...' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiPropertyOptional({ example: 'Tunis' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ example: ['NestJS', 'MongoDB', 'JWT'] })
  @IsOptional()
  @IsArray()
  skillsRequired?: string[];

  @ApiPropertyOptional({ example: 'INTERNSHIP' })
  @IsOptional()
  @IsString()
  type?: string;
}
