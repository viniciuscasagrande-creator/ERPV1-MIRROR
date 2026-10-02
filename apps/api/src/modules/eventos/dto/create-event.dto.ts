import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDateString, IsOptional, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTicketTypeDto {
  @ApiProperty({ example: 'Pista Inteira' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 120.0 })
  precoUnitario: number;

  @ApiProperty({ example: 10.0, required: false })
  @IsOptional()
  taxaServico?: number;

  @ApiProperty({ example: 1000 })
  @IsInt()
  quantidadeTotal: number;
}

export class CreateTicketBatchDto {
  @ApiProperty({ example: '1º Lote' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ type: [CreateTicketTypeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketTypeDto)
  ticketTypes: CreateTicketTypeDto[];
}

export class CreateEventDto {
  @ApiProperty({ example: 'Festival Curitiba 2026' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({ example: 'Festival Musical' })
  @IsString()
  @IsNotEmpty()
  categoria: string;

  @ApiProperty({ example: '2026-11-15T18:00:00.000Z' })
  @IsDateString()
  dataEvento: string;

  @ApiProperty({ example: 'Pedreira Paulo Leminski' })
  @IsString()
  @IsNotEmpty()
  local: string;

  @ApiProperty({ example: 'Curitiba', required: false })
  @IsString()
  @IsOptional()
  cidade?: string;

  @ApiProperty({ example: 'PR', required: false })
  @IsString()
  @IsOptional()
  estado?: string;

  @ApiProperty({ example: 25000 })
  @IsInt()
  capacidadeTotal: number;

  @ApiProperty({ description: 'ID do produtor responsável' })
  @IsString()
  @IsNotEmpty()
  producerId: string;

  @ApiProperty({ type: [CreateTicketBatchDto], required: false })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTicketBatchDto)
  batches?: CreateTicketBatchDto[];
}
