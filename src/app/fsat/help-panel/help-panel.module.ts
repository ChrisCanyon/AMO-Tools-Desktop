import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPanelComponent } from './help-panel.component';
import { HelpPanelService } from './help-panel.service';
import { FsatBasicsHelpComponent } from './fsat-basics-help/fsat-basics-help.component';
import { SystemBasicsHelpComponent } from './system-basics-help/system-basics-help.component';
import { FanCurveDataHelpComponent } from './fan-curve-data-help/fan-curve-data-help.component';
import { FanFieldDataHelpComponent } from './fan-field-data-help/fan-field-data-help.component';
import { FanMotorHelpComponent } from './fan-motor-help/fan-motor-help.component';
import { FanSetupHelpComponent } from './fan-setup-help/fan-setup-help.component';
import { FsatFluidHelpComponent } from './fsat-fluid-help/fsat-fluid-help.component';
import { ModifyConditionsNotesComponent } from './modify-conditions-notes/modify-conditions-notes.component';
import { FsatResultsModule } from '../fsat-results/fsat-results.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FsatResultsModule
  ],
  declarations: [
    HelpPanelComponent,
    SystemBasicsHelpComponent,
    FsatBasicsHelpComponent,
    FanCurveDataHelpComponent,
    FanFieldDataHelpComponent,
    FanMotorHelpComponent,
    FanSetupHelpComponent,
    FsatFluidHelpComponent,
    ModifyConditionsNotesComponent
  ],
  providers: [
    HelpPanelService
  ],
  exports: [
    HelpPanelComponent,
    SystemBasicsHelpComponent,
    FsatBasicsHelpComponent,
    FanCurveDataHelpComponent,
    FanFieldDataHelpComponent,
    FanMotorHelpComponent,
    FanSetupHelpComponent,
    FsatFluidHelpComponent,
    ModifyConditionsNotesComponent
  ]
})
export class HelpPanelModule { }
