import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PneumaticValve } from '../../../../shared/models/standalone';
import { Settings } from '../../../../shared/models/settings';

@Component({
  selector: 'app-flow-factor-form',
  templateUrl: './flow-factor-form.component.html',
  styleUrls: ['./flow-factor-form.component.css']
})
export class FlowFactorFormComponent implements OnInit {
  @Input()
  settings: Settings;
  @Input()
  inputs: PneumaticValve;
  @Output('calculate')
  calculate = new EventEmitter<PneumaticValve>();
  @Output('setUser')
  setUser = new EventEmitter<boolean>();
  @Input()
  userFlowRate: boolean;
  @Input()
  valveFlowFactor: number;
  @Output('emitChangeField')
  emitChangeField = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }
  
  emitChange() {
    this.calculate.emit(this.inputs);
  }

  setUserFlowRate(bool: boolean) {
    this.setUser.emit(bool);
  }

  changeField(str: string) {
    this.emitChangeField.emit(str);
  }
}
