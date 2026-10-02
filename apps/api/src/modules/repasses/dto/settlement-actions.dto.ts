import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveSettlementDto {
  @ApiProperty({ description: 'Indica se o repasse foi aprovado ou rejeitado' })
  @IsBoolean()
  aprovado: boolean;

  @ApiPropertyOptional({ description: 'Motivo de aprovação ou rejeição' })
  @IsOptional()
  @IsString()
  motivo?: string;
}

export class ExecuteSettlementDto {
  @ApiProperty({ description: 'Código ou Hash de autenticação bancária da TED / PIX / Banco', example: 'E260120261543ABC990124781' })
  @IsString()
  autenticacaoBancaria: string;

  @ApiPropertyOptional({ description: 'Observações de tesouraria' })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
