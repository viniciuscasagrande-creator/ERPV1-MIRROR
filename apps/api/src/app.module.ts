import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { PrismaService } from './database/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuditModule } from './modules/audit/audit.module';
import { HealthModule } from './modules/health/health.module';
import { ProducersModule } from './modules/producers/producers.module';
import { EventosModule } from './modules/eventos/eventos.module';
import { VendasModule } from './modules/vendas/vendas.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { EventsGatewayModule } from './modules/events-gateway/events-gateway.module';
import { ContasReceberModule } from './modules/contas-receber/contas-receber.module';
import { ContasPagarModule } from './modules/contas-pagar/contas-pagar.module';
import { RepassesModule } from './modules/repasses/repasses.module';
import { FluxoCaixaModule } from './modules/fluxo-caixa/fluxo-caixa.module';
import { BancosModule } from './modules/bancos/bancos.module';
import { ConciliacaoModule } from './modules/conciliacao/conciliacao.module';
import { GatewaysModule } from './modules/gateways/gateways.module';
import { ContabilidadeModule } from './modules/contabilidade/contabilidade.module';
import { FiscalModule } from './modules/fiscal/fiscal.module';
import { BiModule } from './modules/bi/bi.module';
import { RelatoriosModule } from './modules/relatorios/relatorios.module';
import { ProducerPortalModule } from './modules/producer-portal/producer-portal.module';
import { AccountingPeriodModule } from './modules/accounting-period/accounting-period.module';
import { GedModule } from './modules/ged/ged.module';
import { CnabModule } from './modules/cnab/cnab.module';
import { SettingsModule } from './modules/settings/settings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { ExportadorModule } from './modules/exportador/exportador.module';
import { DisasterRecoveryModule } from './modules/disaster-recovery/disaster-recovery.module';
import { GovernanceSodModule } from './modules/governance-sod/governance-sod.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    RolesModule,
    AuditModule,
    HealthModule,
    ProducersModule,
    EventosModule,
    VendasModule,
    DashboardModule,
    EventsGatewayModule,
    ContasReceberModule,
    ContasPagarModule,
    RepassesModule,
    FluxoCaixaModule,
    BancosModule,
    ConciliacaoModule,
    GatewaysModule,
    ContabilidadeModule,
    FiscalModule,
    BiModule,
    RelatoriosModule,
    ProducerPortalModule,
    AccountingPeriodModule,
    GedModule,
    CnabModule,
    SettingsModule,
    NotificationsModule,
    WebhooksModule,
    ExportadorModule,
    DisasterRecoveryModule,
    GovernanceSodModule,
  ],
  providers: [
    PrismaService,
    // Global Filter para Erros Padronizados
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // Global Interceptor para Envelope JSON
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    // Global Interceptor de Auditoria
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    // Global JWT Guard (requer autenticação por padrão, exceto @Public())
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global Roles Guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    // Global Tenant Guard
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
  ],
})
export class AppModule {}
