import { IsString, IsNotEmpty, IsEnum, IsNumber, IsOptional, IsDateString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoriaDespesa } from '@prisma/client';

export class CreatePayableDto {
  @ApiProperty({ description: 'Descrição da despesa / obrigação' })
  @IsString()
  @IsNotEmpty()
  descricao: string;

  @ApiProperty({ enum: CategoriaDespesa, description: 'Categoria contábil da despesa' })
  @IsEnum(CategoriaDespesa)
  categoria: CategoriaDespesa;

  @ApiProperty({ description: 'Nome ou Razão Social do fornecedor / favorecido' })
  @IsString()
  @IsNotEmpty()
  fornecedorNome: string;

  @ApiProperty({ description: 'CNPJ ou CPF do fornecedor' })
  @IsString()
  @IsNotEmpty()
  fornecedorCpfCnpj: string;

  @ApiProperty({ description: 'Valor a pagar', example: 3500.00 })
  @IsNumber()
  @Min(0.01)
  valor: number;

  @ApiProperty({ description: 'Data de vencimento (ISO)', example: '2026-10-15T00:00:00Z' })
  @IsDateString()
  dataVencimento: string;

  @ApiPropertyOptional({ description: 'Forma de pagamento prevista (PIX, TED, Boleto)', default: 'PIX' })
  @IsOptional()
  @IsString()
  formaPagamento?: string;

  @ApiPropertyOptional({ description: 'ID do Evento relacionado, se houver' })
  @IsOptional()
  @IsString()
  eventId?: string;
}
