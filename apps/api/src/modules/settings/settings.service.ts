import { Injectable } from '@nestjs/common';
import { ErpSystemSettings } from '@diskingressos/types';

@Injectable()
export class SettingsService {
  private currentSettings: ErpSystemSettings = {
    empresaRazaoSocial: 'DISK INGRESSOS SERVICOS DE BILHETERIA LTDA',
    empresaNomeFantasia: 'DiskIngressos',
    empresaCnpj: '08.234.567/0001-89',
    empresaInscricaoMunicipal: '894.210-4',
    cidade: 'Curitiba',
    uf: 'PR',
    regimeTributario: 'LUCRO_PRESUMIDO',
    aliquotaIssPadrao: 2.0,
    codigoTributacaoMunicipio: '12.07',
    toleranciaDivergenciaMdr: 0.5,
    diasPadraoRepasse: 2,
    emailNotificacoesContabeis: 'financeiro@diskingressos.com.br',
    ambienteProducao: false,
    webhookNotificacoesUrl: 'https://api.diskingressos.com.br/webhooks/contabil',
  };

  async getSettings(): Promise<ErpSystemSettings> {
    return this.currentSettings;
  }

  async updateSettings(settings: Partial<ErpSystemSettings>): Promise<ErpSystemSettings> {
    this.currentSettings = {
      ...this.currentSettings,
      ...settings,
    };
    return this.currentSettings;
  }
}
