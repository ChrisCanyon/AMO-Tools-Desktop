import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Settings } from '../../../../../shared/models/settings';
import { SuiteDbService } from '../../../../../suiteDb/suite-db.service';
import { PhastService } from '../../../../../phast/phast.service';

@Component({
  selector: 'app-stack-loss-by-mass',
  templateUrl: './stack-loss-by-mass.component.html',
  styleUrls: ['./stack-loss-by-mass.component.css']
})
export class StackLossByMassComponent implements OnInit {
  @Input()
  stackLossForm: FormGroup;
  @Output('emitCalculate')
  emitCalculate = new EventEmitter<FormGroup>();
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  settings: Settings;

  options: any;
  showModal: boolean = false;

  calculationMethods: Array<string> = [
    'Excess Air',
    'Oxygen in Flue Gas'
  ];

  calculationExcessAir = 0.0;
  calculationFlueGasO2 = 0.0;
  calcMethodExcessAir: boolean;


  constructor(private suiteDbService: SuiteDbService,
    private phastService: PhastService, private cd: ChangeDetectorRef) { }


  ngOnInit() {
    this.options = this.suiteDbService.selectSolidLiquidFlueGasMaterials();
    if (this.stackLossForm) {
      if (this.stackLossForm.controls.gasTypeId.value && this.stackLossForm.controls.gasTypeId.value != '') {
        if (this.stackLossForm.controls.carbon.value == '') {
          this.setProperties();
        }
      }
    }
    this.setCalcMethod();
    this.setCombustionValidation();
    this.setFuelTempValidation();
  }
  focusOut() {
    this.changeField.emit('default');
  }
  focusField(str: string) {
    this.changeField.emit(str);
  }

  setCombustionValidation() {
    this.stackLossForm.controls.combustionAirTemperature.setValidators([Validators.required, Validators.max(this.stackLossForm.controls.flueGasTemperature.value)]);
    this.stackLossForm.controls.combustionAirTemperature.reset(this.stackLossForm.controls.combustionAirTemperature.value);
    if (this.stackLossForm.controls.combustionAirTemperature.value) {
      this.stackLossForm.controls.combustionAirTemperature.markAsDirty();
    }
    this.calculate();
  }

  setFuelTempValidation() {
    this.stackLossForm.controls.flueGasTemperature.setValidators([Validators.required, Validators.min(this.stackLossForm.controls.combustionAirTemperature.value)]);
    this.stackLossForm.controls.flueGasTemperature.reset(this.stackLossForm.controls.flueGasTemperature.value);
    if (this.stackLossForm.controls.flueGasTemperature.value) {
      this.stackLossForm.controls.flueGasTemperature.markAsDirty();
    }
    this.calculate();
  }

  calcExcessAir() {
    let input = {
      carbon: this.stackLossForm.controls.carbon.value,
      hydrogen: this.stackLossForm.controls.hydrogen.value,
      sulphur: this.stackLossForm.controls.sulphur.value,
      inertAsh: this.stackLossForm.controls.inertAsh.value,
      o2: this.stackLossForm.controls.o2.value,
      moisture: this.stackLossForm.controls.moisture.value,
      nitrogen: this.stackLossForm.controls.nitrogen.value,
      moistureInAirCombustion: this.stackLossForm.controls.moistureInAirComposition.value,
      o2InFlueGas: this.stackLossForm.controls.o2InFlueGas.value,
      excessAir: this.stackLossForm.controls.excessAirPercentage.value
    };

    if (!this.calcMethodExcessAir) {
      if (this.stackLossForm.controls.o2InFlueGas.status == 'VALID') {
        this.calculationExcessAir = this.phastService.flueGasByMassCalculateExcessAir(input);
        this.stackLossForm.patchValue({
          excessAirPercentage: this.calculationExcessAir
        })
      } else {
        this.calculationExcessAir = 0
        this.stackLossForm.patchValue({
          excessAirPercentage: this.calculationExcessAir
        })
      }
    }

    if (this.calcMethodExcessAir) {
      if (this.stackLossForm.controls.excessAirPercentage.status == 'VALID') {
        this.calculationFlueGasO2 = this.phastService.flueGasByMassCalculateO2(input);
        this.stackLossForm.patchValue({
          o2InFlueGas: this.calculationFlueGasO2
        })
      } else {
        this.calculationFlueGasO2 = 0
        this.stackLossForm.patchValue({
          o2InFlueGas: this.calculationFlueGasO2
        })
      }
    }
    this.calculate();
  }

  setProperties() {
    let tmpFlueGas = this.suiteDbService.selectSolidLiquidFlueGasMaterialById(this.stackLossForm.controls.gasTypeId.value);
    this.stackLossForm.patchValue({
      carbon: this.roundVal(tmpFlueGas.carbon, 4),
      hydrogen: this.roundVal(tmpFlueGas.hydrogen, 4),
      sulphur: this.roundVal(tmpFlueGas.sulphur, 4),
      inertAsh: this.roundVal(tmpFlueGas.inertAsh, 4),
      o2: this.roundVal(tmpFlueGas.o2, 4),
      moisture: this.roundVal(tmpFlueGas.moisture, 4),
      nitrogen: this.roundVal(tmpFlueGas.nitrogen, 4)
    });
  }
  calculate() {
    this.emitCalculate.emit(this.stackLossForm);
  }

  roundVal(val: number, digits: number) {
    let test = Number(val.toFixed(digits));
    return test;
  }

  changeMethod() {
    this.stackLossForm.patchValue({
      o2InFlueGas: 0,
      excessAirPercentage: 0
    });
    this.setCalcMethod();
  }

  setCalcMethod() {
    if (this.stackLossForm.controls.oxygenCalculationMethod.value == 'Excess Air') {
      this.calcMethodExcessAir = true;
    } else {
      this.calcMethodExcessAir = false;
    }
    this.calcExcessAir();
  }
}
