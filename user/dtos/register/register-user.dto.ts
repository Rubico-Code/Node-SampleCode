import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUniqueEmail } from '../../validators/unique-email/unique-email.validator';
import { VerifyClientCredentials } from '../../validators/verify-client-credentials/verify-client-credentials.validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail({ require_tld: false })
  @MinLength(2)
  @IsUniqueEmail()
  public email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(2)
  @IsString()
  public password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  @VerifyClientCredentials('client_secret')
  public client_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  public client_secret: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  public name: string;
}
