import { Component, OnInit, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { SettingsDbService } from '../../../indexedDb/settings-db.service';
import { FieldMeasurementInputs, SlipMethod, FieldMeasurementOutputs, PercentLoadEstimationService } from './percent-load-estimation.service';

@Component({
  selector: 'app-percent-load-estimation',
  templateUrl: './percent-load-estimation.component.html',
  styleUrls: ['./percent-load-estimation.component.css']
})
export class PercentLoadEstimationComponent implements OnInit {
  @Input()
  settings: Settings;

  @ViewChild('leftPanelHeader') leftPanelHeader: ElementRef;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeTabs();
  }

  headerHeight: number;
  tabSelect: string = 'results';
  toggleCalculate = false;
  loadEstimationMethod: number = 0;
  percentLoadEstimation: number;

  slipMethodData: SlipMethod;

  fieldMeasurementData: FieldMeasurementInputs
  fieldMeasurementResults: FieldMeasurementOutputs;
  constructor(private percentLoadEstimationService: PercentLoadEstimationService, private settingsDbService: SettingsDbService) { }

  ngOnInit() {
    if (!this.settings) {
      this.settings = this.settingsDbService.globalSettings;
    }
    if (this.settingsDbService.globalSettings.defaultPanelTab) {
      this.tabSelect = this.settingsDbService.globalSettings.defaultPanelTab;
    }
    this.fieldMeasurementData = this.percentLoadEstimationService.fieldMeasurementInputs;
    this.slipMethodData = this.percentLoadEstimationService.slipMethodInputs;
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.resizeTabs();
    }, 100);
  }

  resizeTabs() {
    if (this.leftPanelHeader.nativeElement.clientHeight) {
      this.headerHeight = this.leftPanelHeader.nativeElement.clientHeight;
    }
  }

  setTab(str: string) {
    this.tabSelect = str;
  }

  calculateSlipMethod(data: SlipMethod) {
    this.slipMethodData = data;
    this.percentLoadEstimationService.slipMethodInputs = this.slipMethodData;
    this.percentLoadEstimation = ((data.synchronousSpeed - data.measuredSpeed)
      / (data.synchronousSpeed - data.nameplateFullLoadSpeed)) * 100;
  }

  calculateFieldMeasurementMethod(data: FieldMeasurementInputs) {
    this.fieldMeasurementData = data;
    this.percentLoadEstimationService.fieldMeasurementInputs = this.fieldMeasurementData
    this.fieldMeasurementResults = this.percentLoadEstimationService.getResults(data);
    if (isNaN(this.fieldMeasurementResults.percentLoad) == false && this.fieldMeasurementResults.percentLoad != Infinity) {
      this.percentLoadEstimation = this.fieldMeasurementResults.percentLoad;
    } else {
      this.percentLoadEstimation = 0;
    }
  }

}

