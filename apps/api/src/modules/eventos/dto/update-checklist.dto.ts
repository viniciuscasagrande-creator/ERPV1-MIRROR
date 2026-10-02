import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChecklistDto {
  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  vendasConferidas?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  cancelamentosConferidos?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  estornosConferidos?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  gatewayConciliado?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  bancoConciliado?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  financeiroApurado?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  contabilidadeProcessada?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  repasseCalculado?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  repasseAprovado?: boolean;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  eventoFechado?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  observacoes?: string;
}
