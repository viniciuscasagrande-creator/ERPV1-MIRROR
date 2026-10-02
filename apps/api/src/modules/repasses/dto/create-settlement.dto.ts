import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSettlementDto {
  @ApiProperty({ description: 'ID do Evento para liquidação/repasse' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ description: 'Valor solicitado para repasse', example: 45000.00 })
  @IsNumber()
  @Min(0.01)
  valorSolicitado: number;

  @ApiPropertyOptional({ description: 'Retenção técnica de segurança para chargebacks futuros', default: 0.0 })
  @IsOptional()
  @IsNumber()
  retencaoSeguranca?: number;

  @ApiPropertyOptional({ description: 'Observações ou dados complementares do borderô' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
