import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { WindowRefService } from '../../../../indexedDb/window-ref.service';
import { ChargeMaterialCompareService } from '../charge-material-compare.service';
import { ModalDirective } from 'ngx-bootstrap';
import { LossesService } from '../../losses.service';
import { Settings } from '../../../../shared/models/settings';
import { ConvertUnitsService } from '../../../../shared/convert-units/convert-units.service';
import { FormGroup } from '@angular/forms';
import { SolidLoadChargeMaterial } from '../../../../shared/models/materials';
import { SolidMaterialWarnings, ChargeMaterialService } from '../charge-material.service';
import { SolidChargeMaterial } from '../../../../shared/models/phast/losses/chargeMaterial';

@Component({
  selector: 'app-solid-charge-material-form',
  templateUrl: './solid-charge-material-form.component.html',
  styleUrls: ['./solid-charge-material-form.component.css']
})
export class SolidChargeMaterialFormComponent implements OnInit {
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

  firstChange: boolean = true;

  materialTypes: any;
  selectedMaterialId: any;
  selectedMaterial: any;
  showModal: boolean = false;
  warnings: SolidMaterialWarnings;
  idString: string;
  constructor(private suiteDbService: SuiteDbService, private chargeMaterialCompareService: ChargeMaterialCompareService, private chargeMaterialService: ChargeMaterialService, private lossesService: LossesService, private convertUnitsService: ConvertUnitsService) {
  }

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
    //get material types from ToolSuiteDb
    this.materialTypes = this.suiteDbService.selectSolidLoadChargeMaterials();
    if (this.chargeMaterialForm) {
      if (this.chargeMaterialForm.controls.materialId.value && this.chargeMaterialForm.controls.materialId.value != '') {
        if (this.chargeMaterialForm.controls.materialLatentHeatOfFusion.value == '') {
          this.setProperties();
        }
      }
    }
    if (!this.baselineSelected) {
      this.disableForm();
    }
    this.checkWarnings();
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
    let selectedMaterial = this.suiteDbService.selectSolidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (this.settings.unitsOfMeasure == 'Metric') {
      selectedMaterial.latentHeat = this.convertUnitsService.value(selectedMaterial.latentHeat).from('btuLb').to('kJkg');
      selectedMaterial.meltingPoint = this.convertUnitsService.value(selectedMaterial.meltingPoint).from('F').to('C');
      selectedMaterial.specificHeatLiquid = this.convertUnitsService.value(selectedMaterial.specificHeatLiquid).from('btulbF').to('kJkgC');
      selectedMaterial.specificHeatSolid = this.convertUnitsService.value(selectedMaterial.specificHeatSolid).from('btulbF').to('kJkgC');
    }
    this.chargeMaterialForm.patchValue({
      materialLatentHeatOfFusion: this.roundVal(selectedMaterial.latentHeat, 4),
      materialMeltingPoint: this.roundVal(selectedMaterial.meltingPoint, 4),
      materialHeatOfLiquid: this.roundVal(selectedMaterial.specificHeatLiquid, 4),
      materialSpecificHeatOfSolidMaterial: this.roundVal(selectedMaterial.specificHeatSolid, 4)
    })
    this.save();
  }

  roundVal(val: number, digits: number) {
    let test = Number(val.toFixed(digits));
    return test;
  }

  checkWarnings() {
    let tmpMaterial: SolidChargeMaterial = this.chargeMaterialService.buildSolidChargeMaterial(this.chargeMaterialForm).solidChargeMaterial;
    this.warnings = this.chargeMaterialService.checkSolidWarnings(tmpMaterial);
    let hasWarning: boolean = this.chargeMaterialService.checkWarningsExist(this.warnings);
    this.inputError.emit(hasWarning);
  }

  save() {
    this.checkWarnings();
    this.saveEmit.emit(true);
    this.calculate.emit(true);
  }

  checkSpecificHeatOfSolid() {
    let material: SolidLoadChargeMaterial = this.suiteDbService.selectSolidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        material.specificHeatSolid = this.convertUnitsService.value(material.specificHeatSolid).from('btulbF').to('kJkgC')
      }
      material.specificHeatSolid = this.roundVal(material.specificHeatSolid, 4);
      if (material.specificHeatSolid != this.chargeMaterialForm.controls.materialSpecificHeatOfSolidMaterial.value) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkLatentHeatOfFusion() {
    let material: SolidLoadChargeMaterial = this.suiteDbService.selectSolidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.latentHeat).from('btuLb').to('kJkg')
        material.latentHeat = this.roundVal(val, 4);
      }
      if (material.latentHeat != this.chargeMaterialForm.controls.materialLatentHeatOfFusion.value) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkHeatOfLiquid() {
    let material: SolidLoadChargeMaterial = this.suiteDbService.selectSolidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.specificHeatLiquid).from('btulbF').to('kJkgC')
        material.specificHeatLiquid = this.roundVal(val, 4);
      }
      if (material.specificHeatLiquid != this.chargeMaterialForm.controls.materialHeatOfLiquid.value) {
        return true;
      } else {
        return false;
      }
    }
  }
  checkMeltingPoint() {
    let material: SolidLoadChargeMaterial = this.suiteDbService.selectSolidLoadChargeMaterialById(this.chargeMaterialForm.controls.materialId.value);
    if (material) {
      if (this.settings.unitsOfMeasure == 'Metric') {
        let val = this.convertUnitsService.value(material.meltingPoint).from('F').to('C')
        material.meltingPoint = this.roundVal(val, 4);
      }
      if (material.meltingPoint != this.chargeMaterialForm.controls.materialMeltingPoint.value) {
        return true;
      } else {
        return false;
      }
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
  compareSolidMaterialId() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidMaterialId(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidThermicReactionType() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidThermicReactionType(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidSpecificHeatSolid() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidSpecificHeatSolid(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidLatentHeat() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidLatentHeat(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidSpecificHeatLiquid() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidSpecificHeatLiquid(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidMeltingPoint() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidMeltingPoint(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidChargeFeedRate() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidChargeFeedRate(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidWaterContentCharged() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidWaterContentCharged(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidWaterContentDischarged() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidWaterContentDischarged(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidInitialTemperature() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidInitialTemperature(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidDischargeTemperature() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidDischargeTemperature(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidWaterVaporDischargeTemperature() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidWaterVaporDischargeTemperature(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidChargeMelted() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidChargeMelted(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidChargeReacted() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidChargeReacted(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidReactionHeat() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidReactionHeat(this.lossIndex);
    } else {
      return false;
    }
  }
  compareSolidAdditionalHeat() {
    if (this.canCompare()) {
      return this.chargeMaterialCompareService.compareSolidAdditionalHeat(this.lossIndex);
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
      this.materialTypes = this.suiteDbService.selectSolidLoadChargeMaterials();
      let newMaterial = this.materialTypes.filter(material => { return material.substance == event.substance })
      if (newMaterial.length != 0) {
        this.chargeMaterialForm.patchValue({
          materialId: newMaterial[0].id
        })
        this.setProperties();
      }
    }
    this.showModal = false;
    this.materialModal.hide();
    this.lossesService.modalOpen.next(false);
  }
}
