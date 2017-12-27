import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { PHAST } from '../../../../shared/models/phast/phast';
import { SuiteDbService } from '../../../../suiteDb/suite-db.service';
import { Settings } from '../../../../shared/models/settings';
@Component({
  selector: 'app-exhaust-gas-summary',
  templateUrl: './exhaust-gas-summary.component.html',
  styleUrls: ['./exhaust-gas-summary.component.css']
})
export class ExhaustGasSummaryComponent implements OnInit {
  @Input()
  phast: PHAST;
  @Input()
  settings: Settings;

  numLosses: number = 0;
  collapse: boolean = true;
  lossData: Array<any>;

  offGasTempDiff: boolean = false;
  CODiff: boolean = false;
  H2Diff: boolean = false;
  combustibleGasesDiff: boolean = false;
  vfrDiff: boolean = false;
  dustLoadingDiff: boolean = false;

  constructor(private suiteDbService: SuiteDbService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.lossData = new Array();
    if (this.phast.losses) {
      if (this.phast.losses.exhaustGasEAF) {
        this.numLosses = this.phast.losses.exhaustGasEAF.length;
        let index = 0;
        this.phast.losses.exhaustGasEAF.forEach(loss => {
          let modificationData = new Array();
          if (this.phast.modifications) {
            this.phast.modifications.forEach(mod => {
              let modData = mod.phast.losses.exhaustGasEAF[index];
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
