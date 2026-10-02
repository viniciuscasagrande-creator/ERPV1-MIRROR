import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PerfilUsuario } from '@diskingressos/types';

export class CreateUserDto {
  @ApiProperty({ example: 'Renato Silveira' })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  nome: string;

  @ApiProperty({ example: 'renato@diskingressos.com.br' })
  @IsEmail({}, { message: 'Informe um e-mail válido' })
  email: string;

  @ApiProperty({ example: 'SenhaSegura@2026' })
  @IsString()
  @MinLength(6, { message: 'A senha deve possuir no mínimo 6 caracteres' })
  senha: string;

  @ApiProperty({ example: 'Analista Financeiro Pleno' })
  @IsString()
  @IsNotEmpty({ message: 'O cargo é obrigatório' })
  cargo: string;

  @ApiProperty({ example: '(41) 99999-1234', required: false })
  @IsString()
  @IsOptional()
  telefone?: string;

  @ApiProperty({ enum: PerfilUsuario, isArray: true, example: [PerfilUsuario.FINANCEIRO] })
  @IsEnum(PerfilUsuario, { each: true, message: 'Perfil inválido' })
  roles: PerfilUsuario[];

  @ApiProperty({ description: 'ID do Produtor (apenas para perfil PRODUTOR)', required: false })
  @IsString()
  @IsOptional()
  producerId?: string;
}
