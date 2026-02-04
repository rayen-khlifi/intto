import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadCvDto {
  @ApiProperty({ description: 'Raw extracted text from PDF (simulate parsing). In production use OCR/PDF parser.' })
  @IsNotEmpty()
  @IsString()
  text!: string;

  @ApiProperty({ example: 'rayen_cv.pdf' })
  @IsNotEmpty()
  @IsString()
  filename!: string;
}
