import { Component, OnInit, Output, EventEmitter, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { PsatService } from '../../../psat/psat.service';
import { PSAT } from '../../../shared/models/psat';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { Settings } from '../../../shared/models/settings';
import { SettingsService } from '../../../settings/settings.service';
import { FormGroup } from '@angular/forms';
import { Calculator } from '../../../shared/models/calculators';
import { CalculatorDbService } from '../../../indexedDb/calculator-db.service';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { HeadToolService } from './head-tool.service';
@Component({
  selector: 'app-head-tool',
  templateUrl: './head-tool.component.html',
  styleUrls: ['./head-tool.component.css']
})
export class HeadToolComponent implements OnInit {
  @Output('close')
  close = new EventEmitter<boolean>();
  @Input()
  psat: PSAT;
  @Input()
  settings: Settings;
  @Input()
  headToolResults: any;
  @Input()
  inAssessment: boolean;
  @Input()
  assessmentId: number;

  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }

  headerHeight: number;

  results: any = {
    differentialElevationHead: 0.0,
    differentialPressureHead: 0.0,
    differentialVelocityHead: 0.0,
    estimatedSuctionFrictionHead: 0.0,
    estimatedDischargeFrictionHead: 0.0,
    pumpHead: 0.0
  }

  currentField: string = 'headToolType';

  headToolForm: FormGroup;
  headToolSuctionForm: FormGroup;
  headToolType: string = "Suction tank elevation";
  tabSelect: string = 'results';
  settingsForm: FormGroup;
  canSave: boolean = false;
  isSavedCalc: boolean = false;
  calculator: Calculator;
  constructor(private headToolService: HeadToolService, private psatService: PsatService, private calculatorDbService: CalculatorDbService, private settingsService: SettingsService, private indexedDbService: IndexedDbService, private settingsDbService: SettingsDbService) { }

  ngOnInit() {
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    if (this.inAssessment) {
      this.calculator = this.calculatorDbService.getByAssessmentId(this.assessmentId);
      if (this.calculator) {
        this.isSavedCalc = true;
        if (this.calculator.headTool) {
          this.headToolForm = this.headToolService.getHeadToolFormFromObj(this.calculator.headTool);
          this.headToolSuctionForm = this.headToolService.getHeadToolSuctionFormFromObj(this.calculator.headToolSuction);
          this.headToolType = this.calculator.headToolType;
        } else {
          this.initForm();
        }
      } else {
        this.initForm();
      }
    } else {
      if (this.headToolService.headToolType) {
        this.headToolType = this.headToolService.headToolType;
      }
      this.initForm();
    }
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  ngOnDestroy() {
    if (!this.inAssessment) {
      this.headToolService.headToolType = this.headToolType;
      this.headToolService.headToolSuctionInputs = this.headToolService.getHeadToolSuctionFromForm(this.headToolSuctionForm)
      this.headToolService.headToolInputs = this.headToolService.getHeadToolFromForm(this.headToolForm);
    }
  }

  btnResetData() {
    this.headToolForm = this.headToolService.initHeadToolForm(this.settings);
    this.headToolSuctionForm = this.headToolService.initHeadToolSuctionForm(this.settings);
    this.calculateHeadTool();
    this.calculateHeadToolSuctionTank();
    // this.save();
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  initForm() {
    if (this.psat) {
      this.headToolForm = this.headToolService.initHeadToolForm(this.settings);
      this.headToolSuctionForm = this.headToolService.initHeadToolSuctionForm(this.settings);
      this.headToolForm.patchValue({
        specificGravity: this.psat.inputs.specific_gravity,
        flowRate: this.psat.inputs.flow_rate,
      });
      this.headToolSuctionForm.patchValue({
        specificGravity: this.psat.inputs.specific_gravity,
        flowRate: this.psat.inputs.flow_rate,
      })
    } else {
      if (this.headToolService.headToolInputs) {
        this.headToolForm = this.headToolService.getHeadToolFormFromObj(this.headToolService.headToolInputs);
      } else {
        this.headToolForm = this.headToolService.initHeadToolForm(this.settings);
      }
      if (this.headToolService.headToolSuctionInputs) {
        this.headToolSuctionForm = this.headToolService.getHeadToolSuctionFormFromObj(this.headToolService.headToolSuctionInputs);
      } else {
        this.headToolSuctionForm = this.headToolService.initHeadToolSuctionForm(this.settings);
      }
    }
  }


  setTab(str: string) {
    this.tabSelect = str;
  }

  closeTool() {
    this.close.emit(true);
  }

  changeField(str: string) {
    this.currentField = str;
  }

  save() {
    this.psat.inputs.head = this.results.pumpHead;
    if (this.inAssessment) {
      if (this.isSavedCalc) {
        this.calculator.headTool = this.headToolService.getHeadToolFromForm(this.headToolForm);
        this.calculator.headToolSuction = this.headToolService.getHeadToolSuctionFromForm(this.headToolSuctionForm);
        this.calculator.headToolType = this.headToolType;
        this.indexedDbService.putCalculator(this.calculator).then(() => {
          this.calculatorDbService.setAll().then(() => {
            this.closeTool();
          })
        });
      } else {
        this.calculator = {
          headTool: this.headToolService.getHeadToolFromForm(this.headToolForm),
          headToolSuction: this.headToolService.getHeadToolSuctionFromForm(this.headToolSuctionForm),
          headToolType: this.headToolType,
          assessmentId: this.assessmentId
        }
        this.indexedDbService.addCalculator(this.calculator).then(() => {
          this.calculatorDbService.setAll().then(() => {
            this.closeTool();
          })
        });;
      }
    } else {
      this.closeTool();
    }
  }



  calculateHeadTool() {
    let result = this.psatService.headTool(
      this.headToolForm.controls.specificGravity.value,
      this.headToolForm.controls.flowRate.value,
      this.headToolForm.controls.suctionPipeDiameter.value,
      this.headToolForm.controls.suctionGuagePressure.value,
      this.headToolForm.controls.suctionGuageElevation.value,
      this.headToolForm.controls.suctionLineLossCoefficients.value,
      this.headToolForm.controls.dischargePipeDiameter.value,
      this.headToolForm.controls.dischargeGaugePressure.value,
      this.headToolForm.controls.dischargeGaugeElevation.value,
      this.headToolForm.controls.dischargeLineLossCoefficients.value,
      this.settings
    );
    this.results.differentialElevationHead = result.differentialElevationHead;
    this.results.differentialPressureHead = result.differentialPressureHead;
    this.results.differentialVelocityHead = result.differentialVelocityHead;
    this.results.estimatedSuctionFrictionHead = result.estimatedSuctionFrictionHead;
    this.results.estimatedDischargeFrictionHead = result.estimatedDischargeFrictionHead;
    this.results.pumpHead = result.pumpHead;
    if (this.results.pumpHead > 0 && this.inAssessment) {
      this.canSave = true;
    }
  }


  calculateHeadToolSuctionTank() {
    let result = this.psatService.headToolSuctionTank(
      this.headToolSuctionForm.controls.specificGravity.value,
      this.headToolSuctionForm.controls.flowRate.value,
      this.headToolSuctionForm.controls.suctionPipeDiameter.value,
      this.headToolSuctionForm.controls.suctionTankGasOverPressure.value,
      this.headToolSuctionForm.controls.suctionTankFluidSurfaceElevation.value,
      this.headToolSuctionForm.controls.suctionLineLossCoefficients.value,
      this.headToolSuctionForm.controls.dischargePipeDiameter.value,
      this.headToolSuctionForm.controls.dischargeGaugePressure.value,
      this.headToolSuctionForm.controls.dischargeGaugeElevation.value,
      this.headToolSuctionForm.controls.dischargeLineLossCoefficients.value,
      this.settings
    );

    this.results.differentialElevationHead = result.differentialElevationHead;
    this.results.differentialPressureHead = result.differentialPressureHead;
    this.results.differentialVelocityHead = result.differentialVelocityHead;
    this.results.estimatedSuctionFrictionHead = result.estimatedSuctionFrictionHead;
    this.results.estimatedDischargeFrictionHead = result.estimatedDischargeFrictionHead;
    this.results.pumpHead = result.pumpHead;
    if (this.results.pumpHead > 0 && this.inAssessment) {
      this.canSave = true;
    }
  }

  setFormView(str: string) {
    this.headToolType = str;
  }
}
