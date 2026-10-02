import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PerfilUsuario, StatusOperacao } from '@diskingressos/types';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  nome?: string;

  @ApiProperty({ required: false })
  @IsString()
  @MinLength(6)
  @IsOptional()
  senha?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  cargo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  ativo?: boolean;

  @ApiProperty({ enum: StatusOperacao, required: false })
  @IsEnum(StatusOperacao)
  @IsOptional()
  status?: StatusOperacao;

  @ApiProperty({ enum: PerfilUsuario, isArray: true, required: false })
  @IsEnum(PerfilUsuario, { each: true })
  @IsOptional()
  roles?: PerfilUsuario[];
}
