import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { PHAST } from '../../../../shared/models/phast/phast';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { Settings } from '../../../../shared/models/settings';
@Component({
  selector: 'app-gas-leakage-summary',
  templateUrl: './gas-leakage-summary.component.html',
  styleUrls: ['./gas-leakage-summary.component.css']
})
export class GasLeakageSummaryComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  settings: Settings;
  
  numLosses: number = 0;
  collapse: boolean = true;
  lossData: Array<any>;
  draftPressureDiff: boolean = false;
  openingAreaDiff: boolean = false;
  leakageGasTemperatureDiff: boolean = false;
  specificGravityDiff: boolean = false;
  ambientTemperatureDiff: boolean = false;
  constructor(private suiteDbService: SuiteDbService, private cd: ChangeDetectorRef) { }

  ngOnInit() {    
    this.lossData = new Array();
    if (this.phast.losses) {
      if (this.phast.losses.leakageLosses) {
        this.numLosses = this.phast.losses.leakageLosses.length;
        let index = 0;
        this.phast.losses.leakageLosses.forEach(loss => {
          let modificationData = new Array();
          if(this.phast.modifications){
            this.phast.modifications.forEach(mod => {
              let modData = mod.phast.losses.leakageLosses[index];
              modificationData.push(modData);
            })
          }
          this.lossData.push({
            baseline: loss,
            modifications: modificationData
          })
          index++;
        })
      }
    }
  }

  //function used to check if baseline and modification values are different
  //called from html
  //diffBool is name of corresponding input boolean to indicate different
  checkDiff(baselineVal: any, modificationVal: any, diffBool: string) {
    if (baselineVal != modificationVal) {
      //this[diffBool] get's corresponding variable
      //only set true once
      if (this[diffBool] != true) {
        //set true/different
        this[diffBool] = true;
        //tell html to detect change
        this.cd.detectChanges();
      }
      return true;
    } else {
      return false;
    }
  }

  toggleCollapse() {
    this.collapse = !this.collapse;
  }

}
