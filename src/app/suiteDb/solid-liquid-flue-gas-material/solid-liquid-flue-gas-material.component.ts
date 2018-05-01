import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SolidLiquidFlueGasMaterial } from '../../shared/models/materials';
import { SuiteDbService } from '../suite-db.service';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';
import * as _ from 'lodash';
import { Settings } from '../../shared/models/settings';
import { PhastService } from '../../phast/phast.service';
import { ConvertUnitsService } from "../../shared/convert-units/convert-units.service";
@Component({
  selector: 'app-solid-liquid-flue-gas-material',
  templateUrl: './solid-liquid-flue-gas-material.component.html',
  styleUrls: ['./solid-liquid-flue-gas-material.component.css']
})
export class SolidLiquidFlueGasMaterialComponent implements OnInit {
  @Output('closeModal')
  closeModal = new EventEmitter<SolidLiquidFlueGasMaterial>();
  @Input()
  settings: Settings;
  @Input()
  editExistingMaterial: boolean;
  @Input()
  existingMaterial: SolidLiquidFlueGasMaterial;
  @Output('hideModal')
  hideModal = new EventEmitter();

  newMaterial: SolidLiquidFlueGasMaterial = {
    substance: 'New Fuel',
    carbon: 0,
    hydrogen: 0,
    inertAsh: 0,
    moisture: 0,
    nitrogen: 0,
    o2: 0,
    sulphur: 0,
    heatingValue: 0
  };
  selectedMaterial: SolidLiquidFlueGasMaterial;
  allMaterials: Array<SolidLiquidFlueGasMaterial>;
  allCustomMaterials: Array<SolidLiquidFlueGasMaterial>;
  isValid: boolean;
  nameError: string = null;
  canAdd: boolean;
  isNameValid: boolean;
  currentField: string = 'selectedMaterial';
  difference: number = 0;
  differenceError: boolean = false;

  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService, private phastService: PhastService, private convertUnitsService: ConvertUnitsService) { }

  ngOnInit() {
    if (this.editExistingMaterial) {
      this.allMaterials = this.suiteDbService.selectSolidLiquidFlueGasMaterials();
      this.indexedDbService.getSolidLiquidFlueGasMaterials().then(idbResults => {
        this.allCustomMaterials = idbResults;
        this.setExisting();
        this.setHHV();
      });

    }
    else {
      this.canAdd = true;
      this.allMaterials = this.suiteDbService.selectSolidLiquidFlueGasMaterials();
      this.checkMaterialName();
      this.setHHV();
    }
  }

  addMaterial() {
    if (this.canAdd) {
      this.canAdd = false;
      let suiteDbResult = this.suiteDbService.insertSolidLiquidFlueGasMaterial(this.newMaterial);
      if (suiteDbResult == true) {
        this.indexedDbService.addSolidLiquidFlueGasMaterial(this.newMaterial).then(idbResults => {
          this.closeModal.emit(this.newMaterial);
        })
      }
    }
  }

  updateMaterial() {
    this.closeModal.emit(this.newMaterial);
  }

  editExisting() {

  }


  setExisting() {
    if (this.editExistingMaterial && this.existingMaterial) {
      this.newMaterial = {
        id: this.existingMaterial.id,
        substance: this.existingMaterial.substance,
        carbon: this.existingMaterial.carbon,
        hydrogen: this.existingMaterial.hydrogen,
        inertAsh: this.existingMaterial.inertAsh,
        moisture: this.existingMaterial.moisture,
        nitrogen: this.existingMaterial.nitrogen,
        o2: this.existingMaterial.o2,
        sulphur: this.existingMaterial.sulphur,
        heatingValue: 0
      }
      this.setHHV();
      this.checkEditMaterialName();
    }
    else if (this.selectedMaterial) {
      this.newMaterial = {
        substance: this.selectedMaterial.substance + ' (mod)',
        carbon: this.selectedMaterial.carbon,
        hydrogen: this.selectedMaterial.hydrogen,
        inertAsh: this.selectedMaterial.inertAsh,
        moisture: this.selectedMaterial.moisture,
        nitrogen: this.selectedMaterial.nitrogen,
        o2: this.selectedMaterial.o2,
        sulphur: this.selectedMaterial.sulphur,
        heatingValue: 0
      }
      this.setHHV();
      this.checkMaterialName();
    }
  }

  setHHV() {
    const tmpHeatingVals = this.phastService.flueGasByMassCalculateHeatingValue(this.newMaterial);
    this.getDiff();
    if (isNaN(tmpHeatingVals) === false) {
      this.isValid = true;
      this.newMaterial.heatingValue = tmpHeatingVals;
      if (this.settings.unitsOfMeasure === 'Metric') {
        this.newMaterial.heatingValue = this.convertUnitsService.value(tmpHeatingVals).from('btuLb').to('kJkg');
      }
    } else {
      this.isValid = false;
      this.newMaterial.heatingValue = 0;
    }
  }

  getDiff() {
    this.difference = 100 - this.newMaterial.carbon - this.newMaterial.hydrogen - this.newMaterial.inertAsh - this.newMaterial.moisture - this.newMaterial.nitrogen - this.newMaterial.o2 - this.newMaterial.sulphur;
    if (this.difference > .4 || this.difference < -.4) {
      this.differenceError = true;
    } else {
      this.differenceError = false;
    }
  }

  checkEditMaterialName() {
    let tmp = ((this.allMaterials.length - this.allCustomMaterials.length) - 1) + this.existingMaterial.id;
    let test = _.filter(this.allMaterials, (material) => {
      if (material.id != this.allMaterials[tmp].id) {
        return material.substance.toLowerCase().trim() == this.newMaterial.substance.toLowerCase().trim();
      }
    });

    if (test.length > 0) {
      this.nameError = 'This name is in use by another material';
      this.isNameValid = false;
    }
    else if (this.newMaterial.substance.toLowerCase().trim() == '') {
      this.nameError = 'The material must have a name';
      this.isNameValid = false;
    }
    else {
      this.isNameValid = true;
      this.nameError = null;
    }
  }

  checkMaterialName() {
    let test = _.filter(this.allMaterials, (material) => { return material.substance.toLowerCase().trim() == this.newMaterial.substance.toLowerCase().trim() })
    if (test.length > 0) {
      this.nameError = 'Cannot have same name as existing material';
      this.isNameValid = false;
    } else {
      this.isNameValid = true;
      this.nameError = null;
    }
  }

  focusField(str: string) {
    this.currentField = str;
  }


  hideMaterialModal() {
    this.hideModal.emit();
  }

}
