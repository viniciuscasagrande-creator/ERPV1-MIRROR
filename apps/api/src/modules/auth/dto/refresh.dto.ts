import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @ApiProperty({ description: 'Refresh Token opaco ou criptográfico emitido no login' })
  @IsString({ message: 'Refresh token deve ser uma string' })
  @IsNotEmpty({ message: 'O Refresh Token é obrigatório' })
  refreshToken: string;
}
