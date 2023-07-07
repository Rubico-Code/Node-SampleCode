import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponse {
  @ApiProperty({ enum: ['ok'] })
  status = 'ok';
}
