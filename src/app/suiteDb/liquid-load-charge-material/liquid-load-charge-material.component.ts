import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { LiquidLoadChargeMaterial } from '../../shared/models/materials';
import { SuiteDbService } from '../suite-db.service';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';
import * as _ from 'lodash';
import { Settings } from '../../shared/models/settings';

@Component({
  selector: 'app-liquid-load-charge-material',
  templateUrl: './liquid-load-charge-material.component.html',
  styleUrls: ['./liquid-load-charge-material.component.css']
})
export class LiquidLoadChargeMaterialComponent implements OnInit {
  @Output('closeModal')
  closeModal = new EventEmitter<LiquidLoadChargeMaterial>();
  @Input()
  settings: Settings;

  newMaterial: LiquidLoadChargeMaterial = {
    latentHeat: 0,
    specificHeatLiquid: 0,
    specificHeatVapor: 0,
    substance: 'New Material',
    vaporizationTemperature: 0
  };
  selectedMaterial: LiquidLoadChargeMaterial;
  allMaterials: Array<LiquidLoadChargeMaterial>;
  isValidMaterialName: boolean = true;
  nameError: string = null;
  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService) { }

  ngOnInit() {
    this.allMaterials = this.suiteDbService.selectLiquidLoadChargeMaterials();
    this.checkMaterialName();
    //this.selectedMaterial = this.allMaterials[0];
    if (!this.settings) {
      this.indexedDbService.getSettings(1).then(results => {
        this.settings = results;
      })
    }
  }

  addMaterial() {
    let suiteDbResult = this.suiteDbService.insertLiquidLoadChargeMaterial(this.newMaterial);
    if (suiteDbResult == true) {
      this.indexedDbService.addLiquidLoadChargeMaterial(this.newMaterial).then(idbResults => {
        this.closeModal.emit(this.newMaterial);
      })
    }
  }

  setExisting() {
    this.newMaterial = {
      substance: this.selectedMaterial.substance + ' (mod)',
      latentHeat: this.selectedMaterial.latentHeat,
      specificHeatLiquid: this.selectedMaterial.specificHeatLiquid,
      specificHeatVapor: this.selectedMaterial.specificHeatVapor,
      vaporizationTemperature: this.selectedMaterial.vaporizationTemperature
    }
  }


  checkMaterialName() {
    let test = _.filter(this.allMaterials, (material) => { return material.substance == this.newMaterial.substance })
    if (test.length > 0) {
      this.nameError = 'Cannot have same name as existing material';
      this.isValidMaterialName = false;
    } else {
      this.isValidMaterialName = true;
      this.nameError = null;
    }
  }
}
