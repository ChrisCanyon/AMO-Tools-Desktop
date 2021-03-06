import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Settings } from '../../../../shared/models/settings';
import { FSAT } from '../../../../shared/models/fans';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';
import { HelpPanelService } from '../../../help-panel/help-panel.service';
import { ModifyConditionsService } from '../../../modify-conditions/modify-conditions.service';
import { FanFieldDataWarnings } from '../../../fsat-warning.service';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-system-data-form',
    templateUrl: './system-data-form.component.html',
    styleUrls: ['./system-data-form.component.css']
})
export class SystemDataFormComponent implements OnInit {
    @Input()
    settings: Settings;
    @Input()
    exploreModIndex: number;
    @Input()
    fsat: FSAT;
    @Output('emitCalculate')
    emitCalculate = new EventEmitter<boolean>();
    @Input()
    baselineForm: FormGroup;
    @Input()
    modificationForm: FormGroup;
    @Input()
    modificationWarnings: FanFieldDataWarnings;
    @Input()
    baselineWarnings: FanFieldDataWarnings;
    @Output('showPressureModal')
    showPressureModal = new EventEmitter<string>();
    @Input()
    isVFD: boolean;

    showSystemData: boolean = false;
    showCost: boolean = false;
    showFlowRate: boolean = false;
    showOperatingHours: boolean = false;
    showPressure: boolean = false;

    constructor(
        private convertUnitsService: ConvertUnitsService,
        private helpPanelService: HelpPanelService,
        private modifyConditionsService: ModifyConditionsService) {
    }

    ngOnInit() {
        this.init();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.exploreModIndex) {
            if (!changes.exploreModIndex.isFirstChange()) {
                this.init()
            }
        }
        if (changes.isVFD) {
            if (!changes.isVFD.isFirstChange()) {
                this.init();
            }
        }
    }

    init() {
        this.initCost();
        this.initFlowRate();
        this.initPressure();
        this.initOperatingHours();
        this.initSystemData();
    }

    initCost() {
        if (this.baselineForm.controls.cost.value != this.modificationForm.controls.cost.value) {
            this.showCost = true;
        } else {
            this.showCost = false;
        }
    }

    initFlowRate() {
        if (this.baselineForm.controls.flowRate.value != this.modificationForm.controls.flowRate.value) {
            this.showFlowRate = true;
        } else {
            this.showFlowRate = false;
        }
    }

    initPressure() {
        if (this.baselineForm.controls.inletPressure.value != this.modificationForm.controls.inletPressure.value ||
            this.baselineForm.controls.outletPressure.value != this.modificationForm.controls.outletPressure.value) {
            this.showPressure = true;
        } else {
            this.showPressure = false;
        }
    }

    initOperatingHours() {
        if (this.baselineForm.controls.operatingHours.value != this.modificationForm.controls.operatingHours.value) {
            this.showOperatingHours = true;
        } else {
            this.showOperatingHours = false;
        }
    }

    initSystemData() {
        if (this.showCost || this.showOperatingHours) {
            this.showSystemData = true;
        } else {
            this.showSystemData = false;
        }
    }

    toggleSystemData() {
        if (this.showSystemData == false) {
            this.showCost = false;
            this.showOperatingHours = false;
            this.toggleCost();
            this.toggleOperatingHours();
        }
    }

    toggleCost() {
        if (this.showCost == false) {
            this.modificationForm.controls.cost.patchValue(this.baselineForm.controls.cost.value);
            this.calculate();
        }
    }

    togglePressure() {
        if (this.showPressure == false) {
            this.modificationForm.controls.inletPressure.patchValue(this.baselineForm.controls.inletPressure.value);
            this.modificationForm.controls.outletPressure.patchValue(this.baselineForm.controls.outletPressure.value);
            this.calculate();
        }
    }

    toggleOperatingHours() {
        if (this.showOperatingHours == false) {
            this.modificationForm.controls.operatingHours.patchValue(this.baselineForm.controls.operatingHours.value);
            this.calculate();
        }
    }

    toggleFlowRate() {
        if (this.showFlowRate == false) {
            this.modificationForm.controls.flowRate.patchValue(this.baselineForm.controls.flowRate.value);
            this.calculate();
        }
    }

    calculate() {
        this.emitCalculate.emit(true);
    }

    focusField(str: string) {
        this.helpPanelService.currentField.next(str);
        this.modifyConditionsService.modifyConditionsTab.next('fan-field-data');
    }

    getDisplayUnit(unit: string) {
        let tmpUnit = this.convertUnitsService.getUnit(unit);
        let dsp = tmpUnit.unit.name.display.replace('(', '');
        dsp = dsp.replace(')', '');
        return dsp;
    }

    showInletPressureModal() {
        this.showPressureModal.emit('inlet')
    }

    showOutletPressureModal() {
        this.showPressureModal.emit('outlet');
    }
}
