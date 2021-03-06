import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { FormGroup } from '@angular/forms';
import { PsatWarningService } from '../../../../psat/psat-warning.service';
import { pumpTypesConstant } from '../../../../psat/psatConstants';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';

@Component({
  selector: 'app-achievable-efficiency-form',
  templateUrl: './achievable-efficiency-form.component.html',
  styleUrls: ['./achievable-efficiency-form.component.css']
})
export class AchievableEfficiencyFormComponent implements OnInit {
  @Input()
  efficiencyForm: FormGroup;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  settings: Settings;

  pumpTypes: Array<{ display: string, value: number }>;
  flowRateWarning: string = null;
  constructor(private psatWarningsService: PsatWarningService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    this.pumpTypes = pumpTypesConstant;
    //remove specified efficiency
    this.pumpTypes.pop();
    this.checkWarnings();
  }

  emitChange() {
    this.checkWarnings();
    this.calculate.emit(true);
  }

  checkWarnings() {
    this.flowRateWarning = this.psatWarningsService.checkFlowRate(this.efficiencyForm.controls.pumpType.value, this.efficiencyForm.controls.flowRate.value, this.settings);
  }

  getDisplayUnit(unit: any) {
    if (unit) {
      let dispUnit: string = this.convertUnitsService.getUnit(unit).unit.name.display;
      dispUnit = dispUnit.replace('(', '');
      dispUnit = dispUnit.replace(')', '');
      return dispUnit;
    }
  }
}





