import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';

export class CreateProducerDto {
  @ApiProperty({ example: 'Live Entretenimento e Eventos S.A.' })
  @IsString()
  @IsNotEmpty()
  razaoSocial: string;

  @ApiProperty({ example: 'Live Entretenimento' })
  @IsString()
  @IsNotEmpty()
  nomeFantasia: string;

  @ApiProperty({ example: '98765432000100' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ example: 'contato@liveentretenimento.com.br' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '(41) 3222-1111' })
  @IsString()
  @IsNotEmpty()
  telefone: string;

  @ApiProperty({ example: 'Curitiba', required: false })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiProperty({ example: 'PR', required: false })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({ example: 10.0, description: 'Comissão acordada Disk (%)' })
  @IsNumber()
  taxaComissao: number;

  @ApiProperty({ example: 2.9, description: 'Taxa MDR de cartão (%)' })
  @IsNumber()
  taxaMdr: number;

  @ApiProperty({ example: 'Banco Itaú', required: false })
  @IsString()
  @IsOptional()
  bancoNome?: string;

  @ApiProperty({ example: '341', required: false })
  @IsString()
  @IsOptional()
  bancoCodigo?: string;

  @ApiProperty({ example: '1234', required: false })
  @IsString()
  @IsOptional()
  agencia?: string;

  @ApiProperty({ example: '99887-1', required: false })
  @IsString()
  @IsOptional()
  contaCorrente?: string;

  @ApiProperty({ example: 'contato@liveentretenimento.com.br', required: false })
  @IsString()
  @IsOptional()
  chavePix?: string;
}
