import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../../../shared/shared.module";

import { PercentLoadEstimationGraphComponent } from './percent-load-estimation-graph/percent-load-estimation-graph.component';
import { PercentLoadEstimationComponent } from "./percent-load-estimation.component";
import { SlipMethodFormComponent } from './slip-method-form/slip-method-form.component';
import { FieldMeasurementFormComponent } from './field-measurement-form/field-measurement-form.component';
import { FieldMeasurementTableComponent } from './field-measurement-table/field-measurement-table.component';
import { PercentLoadEstimationService } from './percent-load-estimation.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    PercentLoadEstimationComponent,
    PercentLoadEstimationGraphComponent,
    SlipMethodFormComponent,
    FieldMeasurementFormComponent,
    FieldMeasurementTableComponent
  ],
  exports: [
    PercentLoadEstimationComponent
  ],
  providers: [
    PercentLoadEstimationService
  ]
})
export class PercentLoadEstimationModule { }
