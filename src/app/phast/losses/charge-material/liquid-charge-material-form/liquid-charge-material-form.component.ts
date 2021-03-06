import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { ChargeMaterialCompareService } from '../charge-material-compare.service';
import { ModalDirective } from 'ngx-bootstrap';
import { LossesService } from '../../losses.service';
import { Settings } from '../../../../shared/models/settings';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';
import { FormGroup } from '@angular/forms';
import { LiquidLoadChargeMaterial } from '../../../../shared/models/materials';
import { LiquidChargeMaterial } from '../../../../shared/models/phast/losses/chargeMaterial';
import { ChargeMaterialService, LiquidMaterialWarnings } from '../charge-material.service';

@Component({
  selector: 'app-liquid-charge-material-form',
  templateUrl: './liquid-charge-material-form.component.html',
  styleUrls: ['./liquid-charge-material-form.component.css']
})
export class LiquidChargeMaterialFormComponent implements OnInit {
  @Input()
  chargeMaterialForm: FormGroup;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  baselineSelected: boolean;
  @Output('changeField')
  changeField = new EventEmitter<string>();
  @Output('saveEmit')
  saveEmit = new EventEmitter<boolean>();
  @Input()
  lossIndex: number;
  @Input()
  settings: Settings;
  @Output('inputError')
  inputError = new EventEmitter<boolean>();
  @Input()
  inSetup: boolean;
  @Input()
  isBaseline: boolean;

  @ViewChild('materialModal') public materialModal: ModalDirective;

  materialTypes: any;
  selectedMaterial: any;

  warnings: LiquidMaterialWarnings;
  showModal: boolean = false;
  idString: string;
  constructor(private suiteDbService: SuiteDbService, private chargeMaterialService: ChargeMaterialService, private chargeMaterialCompareService: ChargeMaterialCompareService, private windowRefService: WindowRefService, private lossesService: LossesService, private convertUnitsService: ConvertUnitsService) { }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.baselineSelected){
      if(!changes.baselineSelected.firstChange){
        if (!this.baselineSelected) {
          this.disableForm();
        } else {
          this.enableForm();
        }
      }
    }
  }

  ngOnInit() {
    if (!this.isBaseline) {
      this.idString = 'phast_modification_solid_' + this.lossIndex;
    }
    else {
      this.idString = 'phast_baseline_solid_' + this.lossIndex;
    }
    this.materialTypes = this.suiteDbService.selectLiquidLoadChargeMaterials();
    if (this.chargeMaterialForm) {
      if (this.chargeMaterialForm.controls.materialId.value && this.chargeMaterialForm.controls.materialId.value != '') {
        if (this.chargeMaterialForm.controls.materialLatentHeat.value == '') {
          this.setProperties();
        }
      }
    }
    this.checkWarnings();
    if (!this.baselineSelected) {
      this.disableForm();
    }
  }

  ngOnDestroy() {
    this.lossesService.modalOpen.next(false);
  }

  disableForm() {
    this.chargeMaterialForm.controls.materialId.disable();
    this.chargeMaterialForm.controls.endothermicOrExothermic.disable();
  }

  enableForm() {
    this.chargeMaterialForm.controls.materialId.enable();
    this.chargeMaterialForm.controls.endothermicOrExothermic.enable();
  }

  focusField(str: string) {
    this.changeField.emit(str);
  }
  focusOut() {
    this.changeField.emit('default');
  }

  setProperties() {
    let selectedMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (this.settings.unitsOfMeasure == 'Metric') {
      selectedMaterial.vaporizationTemperature = this.convertUnitsService.value(this.roundVal(selectedMaterial.vaporizationTemperature, 4)).from('F').to('C');
      selectedMaterial.latentHeat = this.convertUnitsService.value(selectedMaterial.latentHeat).from('btuLb').to('kJkg');
      selectedMaterial.specificHeatLiquid = this.convertUnitsService.value(selectedMaterial.specificHeatLiquid).from('btulbF').to('kJkgC');
      selectedMaterial.specificHeatVapor = this.convertUnitsService.value(selectedMaterial.specificHeatVapor).from('btulbF').to('kJkgC');
    }
    this.chargeMaterialForm.patchValue({
      materialLatentHeat: this.roundVal(selectedMaterial.latentHeat, 4),
      materialSpecificHeatLiquid: this.roundVal(selectedMaterial.specificHeatLiquid, 4),
      materialSpecificHeatVapor: this.roundVal(selectedMaterial.specificHeatVapor, 4),
      materialVaporizingTemperature: this.roundVal(selectedMaterial.vaporizationTemperature, 4)
    })
    this.save();
  }

  roundVal(val: number, digits: number) {
    let test = Number(val.toFixed(digits));
    return test;
  }

  checkWarnings() {
    let tmpMaterial: LiquidChargeMaterial = this.chargeMaterialService.buildLiquidChargeMaterial(this.chargeMaterialForm).liquidChargeMaterial;
    this.warnings = this.chargeMaterialService.checkLiquidWarnings(tmpMaterial);
    let hasWarning: boolean = this.chargeMaterialService.checkWarningsExist(this.warnings);
    this.inputError.emit(hasWarning);
  }

  save() {
    this.checkWarnings();
    this.saveEmit.emit(true);
    this.calculate.emit(true);
  }
  
  checkSpecificHeatDiffLiquid() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.specificHeatLiquid).from('btulbF').to('kJkgC');
        material.specificHeatLiquid = this.roundVal(val, 4);
      }
      if (material.specificHeatLiquid != this.chargeMaterialForm.controls.materialSpecificHeatLiquid.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkVaporizingTempDiff() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.vaporizationTemperature).from('F').to('C');
        material.vaporizationTemperature = this.roundVal(val, 4);
      }
      if (material.vaporizationTemperature != this.chargeMaterialForm.controls.materialVaporizingTemperature.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkLatentHeatDiff() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.latentHeat).from('btuLb').to('kJkg');
        material.latentHeat = this.roundVal(val, 4);
      }
      if (material.latentHeat != this.chargeMaterialForm.controls.materialLatentHeat.value) {
        return true;
      } else {
        return false;
      }
    }
  }

  checkSpecificHeatVaporDiff() {
    let material: LiquidLoadChargeMaterial = this.suiteDbService.selectLiquidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.specificHeatVapor).from('btulbF').to('kJkgC');
        material.specificHeatVapor = this.roundVal(val, 4);
      }
      if (material.specificHeatVapor != this.chargeMaterialForm.controls.materialSpecificHeatVapor.value) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkFeedRateDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidChargeFeedRate(this.lossIndex);
    } else {
      return false;
    }
  }
  canCompare() {
    if (this.chargeMaterialCompareService.baselineMaterials && this.chargeMaterialCompareService.modifiedMaterials && !this.inSetup) {
      if (this.chargeMaterialCompareService.compareMaterialType(this.lossIndex) == false) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  checkInitialTempDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidInitialTemperature(this.lossIndex);
    } else {
      return false;
    }
  }
  checkDischargeTempDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidDischargeTemperature(this.lossIndex);
    } else {
      return false;
    }
  }
  checkChargeReactedDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidPercentReacted(this.lossIndex);
    } else {
      return false;
    }
  }
  checkReactionHeatDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidReactionHeat(this.lossIndex);
    } else {
      return false;
    }
  }
  checkExothermicDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidThermicReaction(this.lossIndex);
    } else {
      return false;
    }
  }
  checkAdditionalHeatDiff() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidAdditionalHeat(this.lossIndex);
    } else {
      return false;
    }
  }
  checkLiquidVaporizedDiff(){
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidPercentVaporized(this.lossIndex);
    } else {
      return false;
    }
  }
  checkMaterialDiff(){
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareLiquidMaterialId(this.lossIndex);
    } else {
      return false;
    }
  }
  showMaterialModal() {
    this.showModal = true;
    this.lossesService.modalOpen.next(true);
    this.materialModal.show();
  }
  hideMaterialModal(event?: any) {
    if (event) {
      this.materialTypes = this.suiteDbService.selectLiquidLoadChargeMaterials();
      let newMaterial = this.materialTypes.filter(material => { return material.substance == event.substance })
      if (newMaterial.length != 0) {
        this.chargeMaterialForm.patchValue({
          materialId: newMaterial[0].id
        })
        this.setProperties();
      }
    }
    this.materialModal.hide();
    this.showModal = false;
    this.lossesService.modalOpen.next(false);
  }
}
