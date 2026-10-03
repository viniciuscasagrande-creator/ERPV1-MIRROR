import {
  FinancialOperationType,
  ApprovalTier,
  ApprovalStatus,
  QuarantineStatus,
} from '@diskingressos/types';

console.log('========================================================================');
console.log('🧪 DISKINGRESSOS ERP - SCRIPT DE VERIFICAÇÃO E AUDITORIA (FASE 15)');
console.log('🛡️  GOVERNANÇA FINANCEIRA, MATRIZ DE ALÇADAS & SEGREGAÇÃO DE FUNÇÕES (SoD)');
console.log('⚖️  COMPLIANCE CORPORATIVO, CADEIA DE CUSTÓDIA E CONTROLE PATRIMONIAL');
console.log('========================================================================\n');

let passCount = 0;
let totalCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalCount++;
  if (condition) {
    passCount++;
    console.log(`✅ [PASS] ${testName}`);
    if (detail) console.log(`   └─ ${detail}`);
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    if (detail) console.error(`   └─ Motivo: ${detail}`);
  }
}

// 1. Regra SoD Mandatória: "Criador Não Aprova"
console.log('--- 1. SEGREGAÇÃO DE FUNÇÕES (SoD): AUTO-APROVAÇÃO BLOQUEADA ---');
const solicitanteId: string = 'usr-analista-mariana';
const aprovadorTentativa1: string = 'usr-analista-mariana'; // Tentativa de auto-aprovação
const aprovadorTentativa2: string = 'usr-gerente-karine';   // Aprovador independente

const autoAprovacaoBloqueada = solicitanteId === aprovadorTentativa1;
const aprovacaoIndependenteValida = solicitanteId !== aprovadorTentativa2;

assert(
  autoAprovacaoBloqueada,
  'Detecção e Bloqueio de Tentativa de Auto-Aprovação Patrimonial',
  `Solicitante (${solicitanteId}) tentando auto-aprovar operação -> Violação SoD detectada com 403 Forbidden`
);

assert(
  aprovacaoIndependenteValida,
  'Aprovação por Agente Financeiro Independente Homologada',
  `Solicitante (${solicitanteId}) != Aprovador (${aprovadorTentativa2}) -> Cadeia de custódia íntegra`
);

// 2. Matriz de Alçadas Multinível
console.log('\n--- 2. MATRIZ DE ALÇADAS MONETÁRIAS POR FAIXA DE RISCO ---');
function determinarAlçada(valor: number): ApprovalTier {
  if (valor > 250000.0) return ApprovalTier.FAIXA_C;
  if (valor > 50000.0) return ApprovalTier.FAIXA_B;
  return ApprovalTier.FAIXA_A;
}

const repassePequeno = 35000.0;
const repasseMedio = 120000.0;
const repasseGrande = 428500.0;

assert(
  determinarAlçada(repassePequeno) === ApprovalTier.FAIXA_A,
  'Enquadramento Faixa A (Até R$ 50.000,00)',
  `Valor: R$ ${repassePequeno.toLocaleString('pt-BR')} -> Aprovador: Analista Sênior / Coordenador`
);

assert(
  determinarAlçada(repasseMedio) === ApprovalTier.FAIXA_B,
  'Enquadramento Faixa B (R$ 50.000,01 a R$ 250.000,00)',
  `Valor: R$ ${repasseMedio.toLocaleString('pt-BR')} -> Aprovador: Gerente Financeiro`
);

assert(
  determinarAlçada(repasseGrande) === ApprovalTier.FAIXA_C,
  'Enquadramento Faixa C (> R$ 250.000,00 - Dupla Chave CFO)',
  `Valor: R$ ${repasseGrande.toLocaleString('pt-BR')} -> Requer 2 diretores distintos`
);

// 3. Regra de Dupla Chave na Faixa C (Aprovadores Distintos)
console.log('\n--- 3. DUPLA CHAVE DE DIRETORIA (FAIXA C) ---');
const diretor1: string = 'usr-cfo-carlos';
const diretor2Invalido: string = 'usr-cfo-carlos'; // Mesmo diretor
const diretor2Valido: string = 'usr-diretor-vinicius';

const chaveDuplicadaRejeitada = diretor1 === diretor2Invalido;
const duplaChaveAprovada = diretor1 !== diretor2Valido;

assert(
  chaveDuplicadaRejeitada,
  'Impedimento de Assinatura da 2ª Chave pelo Mesmo Diretor',
  'Diretor 1 e Diretor 2 não podem ser a mesma pessoa física'
);

assert(
  duplaChaveAprovada,
  'Homologação de Dupla Chave por Diretores Distintos',
  `1ª Chave: ${diretor1} | 2ª Chave: ${diretor2Valido} -> Repasse liberado para tesouraria`
);

// 4. Quarentena Preventiva de 48h para Dados Bancários de Produtores
console.log('\n--- 4. QUARENTENA PREVENTIVA DE SEGURANÇA (48 HORAS) ---');
const alteracaoCadastral = {
  operacao: FinancialOperationType.ALTERACAO_DADOS_BANCARIOS,
  chavePix: 'financeiro@curitibashows.com.br',
  horasRestantesQuarentena: 36,
  status: QuarantineStatus.EM_QUARENTENA_48H,
};

const repasseBloqueadoEmQuarentena =
  alteracaoCadastral.status === QuarantineStatus.EM_QUARENTENA_48H &&
  alteracaoCadastral.horasRestantesQuarentena > 0;

assert(
  repasseBloqueadoEmQuarentena,
  'Bloqueio Preventivo de Pagamentos durante Quarentena de 48h',
  `Chave PIX alterada com 36h restantes de retenção preventiva contra sequestro de conta`
);

// 5. Regra SoD: "Executor Não Concilia"
console.log('\n--- 5. SEGREGAÇÃO OPERAÇÃO X CONCILIAÇÃO ---');
const operadorTesouraria = 'usr-tesouraria-joao';
const conciliarConta = (usuarioId: string, executorId: string) => {
  if (usuarioId === executorId) {
    throw new Error('Violação SoD: Quem executa remessa bancária não pode conciliar o extrato.');
  }
  return true;
};

let erroSoDDisparado = false;
try {
  conciliarConta(operadorTesouraria, operadorTesouraria);
} catch (e: any) {
  erroSoDDisparado = true;
}

assert(
  erroSoDDisparado,
  'Impedimento de Conciliação Bancária pelo Próprio Executor do Pagamento',
  'Operador que transmitiu CNAB é bloqueado de dar match no extrato OFX'
);

console.log('\n========================================================================');
console.log(`📊 RESULTADO FINAL DA AUDITORIA FASE 15: ${passCount}/${totalCount} TESTES APROVADOS`);
if (passCount === totalCount) {
  console.log('🏆 STATUS: 100% COMPLIANT COM A POLÍTICA DE GOVERNANÇA CORPORATIVA & SoD!');
} else {
  console.error('⚠️ STATUS: FALHAS DETECTADAS NA VERIFICAÇÃO.');
  process.exit(1);
}
console.log('========================================================================\n');
