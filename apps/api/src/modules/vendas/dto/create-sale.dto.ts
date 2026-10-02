import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsInt,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CanalVenda, MetodoPagamento } from '@prisma/client';

export class CreateSaleItemDto {
  @ApiProperty({ description: 'ID do tipo de ingresso' })
  @IsString()
  @IsNotEmpty()
  ticketTypeId: string;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantidade: number;
}

export class CreateSaleDto {
  @ApiProperty({ description: 'ID do evento' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ enum: CanalVenda, example: CanalVenda.ONLINE })
  @IsEnum(CanalVenda)
  canal: CanalVenda;

  @ApiProperty({ example: 'Ana Beatriz Souza' })
  @IsString()
  @IsNotEmpty()
  compradorNome: string;

  @ApiProperty({ example: '12345678901' })
  @IsString()
  @IsNotEmpty()
  compradorCpf: string;

  @ApiProperty({ example: 'ana.souza@email.com' })
  @IsString()
  @IsNotEmpty()
  compradorEmail: string;

  @ApiProperty({ type: [CreateSaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];

  @ApiProperty({ enum: MetodoPagamento, example: MetodoPagamento.PIX })
  @IsEnum(MetodoPagamento)
  metodoPagamento: MetodoPagamento;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  parcelas?: number;

  @ApiProperty({ example: 'Cielo', required: false })
  @IsOptional()
  gateway?: string;
}
