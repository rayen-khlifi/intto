import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class ApplyDto {
  @ApiProperty()
  @IsMongoId()
  jobId!: string;
}
