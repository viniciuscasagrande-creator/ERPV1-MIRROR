export interface ErpSystemSettings {
  empresaRazaoSocial: string;
  empresaNomeFantasia: string;
  empresaCnpj: string;
  empresaInscricaoMunicipal: string;
  cidade: string;
  uf: string;
  regimeTributario: string;
  aliquotaIssPadrao: number;
  codigoTributacaoMunicipio: string;
  toleranciaDivergenciaMdr: number;
  diasPadraoRepasse: number;
  emailNotificacoesContabeis: string;
  ambienteProducao: boolean;
  webhookNotificacoesUrl?: string;
}
