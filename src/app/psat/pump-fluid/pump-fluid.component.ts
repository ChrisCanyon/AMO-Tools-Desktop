import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { PsatService } from '../psat.service';
import { PSAT, PsatInputs } from '../../shared/models/psat';

@Component({
  selector: 'app-pump-fluid',
  templateUrl: './pump-fluid.component.html',
  styleUrls: ['./pump-fluid.component.css']
})
export class PumpFluidComponent implements OnInit {
  @Input()
  psat: PSAT;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Input()
  saveClicked: boolean;
  @Output('saved')
  saved = new EventEmitter<boolean>();
  @Output('isValid')
  isValid = new EventEmitter<boolean>();
  @Output('isInvalid')
  isInvalid = new EventEmitter<boolean>();
  @Input()
  selected: boolean;

  formValid: boolean;
  pumpTypes: Array<string> = [
    'End Suction Slurry',
    'End Suction Sewage',
    'End Suction Stock',
    'API Double Suction',
    'Multistage Boiler Feed',
    'End Suction ANSI/API',
    'Axial Flow',
    'Double Suction',
    'Vertical Turbine',
    'Large End Suction',
    // When user selects below they need a way to provide the optimal efficiency
    'Specified Optimal Efficiency'
  ];

  drives: Array<string> = [
    'Direct Drive',
    'Belt Drive'
  ];
  psatForm: any;
  isFirstChange: boolean = true;

  constructor(private psatService: PsatService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.isFirstChange) {
      if (changes.saveClicked) {
        this.savePsat(this.psatForm);
      }
    }
    else {
      this.isFirstChange = false;
    }
  }

  ngOnInit() {
    this.psatForm = this.psatService.getFormFromPsat(this.psat.inputs);
    this.checkForm(this.psatForm);
  }

  addNum(str: string) {
    if (str == 'viscosity') {
      this.psatForm.value.viscosity++;
    } else if (str == 'stages') {
      this.psatForm.value.stages++;
    }
  }

  subtractNum(str: string) {
    if (str == 'viscosity') {
      if (this.psatForm.value.viscosity != 0) {
        this.psatForm.value.viscosity--;
      }
    } else if (str == 'stages') {
      if (this.psatForm.value.stages != 0) {
        this.psatForm.value.stages--;
      }
    }
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }

  checkForm(form: any) {
    this.formValid = this.psatService.isPumpFluidFormValid(form);
    if (this.formValid) {
      this.isValid.emit(true)
    }else{
      this.isInvalid.emit(true)
    }
  }

  savePsat(form: any) {
    if (this.formValid) {
      this.psat.inputs = this.psatService.getPsatInputsFromForm(form);
      this.saved.emit(this.selected);
    }
  }

}
