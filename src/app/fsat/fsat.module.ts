import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsatComponent } from './fsat.component';
import { FsatService } from './fsat.service';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingsModule } from '../settings/settings.module';
import { FsatBannerComponent } from './fsat-banner/fsat-banner.component';
import { FsatTabsComponent } from './fsat-tabs/fsat-tabs.component';
import { SystemBasicsComponent } from './system-basics/system-basics.component';

import { RatedOperatingPointsComponent } from './rated-operating-points/rated-operating-points.component';
import { RatedOperatingPointsFormComponent } from './rated-operating-points/rated-operating-points-form/rated-operating-points-form.component';
import { Fsat203Module } from '../calculator/fans/fsat-203/fsat-203.module';
import { ModalModule } from 'ngx-bootstrap';
import { FsatFluidComponent } from './fsat-fluid/fsat-fluid.component';
import { FsatFluidService } from './fsat-fluid/fsat-fluid.service';
import { SharedModule } from '../shared/shared.module';
import { FanSetupComponent } from './fan-setup/fan-setup.component';
import { FanSetupService } from './fan-setup/fan-setup.service';
import { FanMotorComponent } from './fan-motor/fan-motor.component';
import { FanMotorService } from './fan-motor/fan-motor.service';
import { PsatService } from '../psat/psat.service';
import { FanFieldDataComponent } from './fan-field-data/fan-field-data.component';
import { FanFieldDataService } from './fan-field-data/fan-field-data.service';
import { ExploreOpportunitiesModule } from './explore-opportunities/explore-opportunities.module';
import { ModifyConditionsTabsComponent } from './modify-conditions/modify-conditions-tabs/modify-conditions-tabs.component';
import { ModifyConditionsComponent } from './modify-conditions/modify-conditions.component';
import { ModifyConditionsService } from './modify-conditions/modify-conditions.service';
import { AddModificationComponent } from './add-modification/add-modification.component';
import { CompareService } from './compare.service';
import { ModificationListComponent } from './modification-list/modification-list.component';
import { ModifyFieldDataFormComponent } from './modify-conditions/modify-field-data-form/modify-field-data-form.component';
import { FsatResultsModule } from './fsat-results/fsat-results.module';
import { FsatReportModule } from './fsat-report/fsat-report.module';
import { HelpPanelModule } from './help-panel/help-panel.module';
// import { FsatReportSankeyComponent } from './fsat-report/fsat-report-sankey/fsat-report-sankey.component';

import { ConvertFsatService } from './convert-fsat.service';
import { FsatSankeyModule } from './fsat-sankey/fsat-sankey.module';
import { PumpCurveModule } from '../calculator/pumps/pump-curve/pump-curve.module';
import { MotorPerformanceModule } from '../calculator/motors/motor-performance/motor-performance.module';
import { NemaEnergyEfficiencyModule } from '../calculator/motors/nema-energy-efficiency/nema-energy-efficiency.module';
import { SystemCurveModule } from '../calculator/pumps/system-curve/system-curve.module';
import { FanEfficiencyModule } from '../calculator/fans/fan-efficiency/fan-efficiency.module';
import { ToastyModule } from '../../../node_modules/ng2-toasty';
import { FsatDiagramComponent } from './fsat-diagram/fsat-diagram.component';
import { FsatWarningService } from './fsat-warning.service';
import { CalculatePressuresModule } from './calculate-pressures/calculate-pressures.module';
@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsModule,
    SettingsModule,
    Fsat203Module,
    ModalModule,
    SharedModule,
    ExploreOpportunitiesModule,
    FsatResultsModule,
    FsatReportModule,
    HelpPanelModule,
    FsatSankeyModule,
    SystemCurveModule,
    NemaEnergyEfficiencyModule,
    MotorPerformanceModule,
    PumpCurveModule,
    FanEfficiencyModule,
    ToastyModule,
    CalculatePressuresModule
  ],
  declarations: [
    FsatComponent,
    FsatBannerComponent,
    FsatTabsComponent,
    SystemBasicsComponent,
    RatedOperatingPointsComponent,
    RatedOperatingPointsFormComponent,
    FsatFluidComponent,
    FanSetupComponent,
    FanMotorComponent,
    FanFieldDataComponent,
    ModifyConditionsComponent,
    ModifyConditionsTabsComponent,
    AddModificationComponent,
    ModificationListComponent,
    ModifyFieldDataFormComponent,
    FsatDiagramComponent,
    // FsatReportSankeyComponent  
  ],
  providers: [
    FsatService,
    FsatFluidService,
    FanSetupService,
    FanMotorService,
    PsatService,
    FanFieldDataService,
    ModifyConditionsService,
    CompareService,
    ConvertFsatService,
    FsatWarningService
  ],
  exports: [
    FsatComponent
  ]
})
export class FsatModule { }
