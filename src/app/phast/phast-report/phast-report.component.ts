import { Component, OnInit, Input, ViewChild, TemplateRef, ElementRef, SimpleChanges } from '@angular/core';
import { PhastService } from '../phast.service';
import { PHAST } from '../../shared/models/phast/phast';
import { Settings } from '../../shared/models/settings';
import { Assessment } from '../../shared/models/assessment';
import { IndexedDbService } from '../../indexedDb/indexed-db.service';
import { Directory } from '../../shared/models/directory';
import { ReportRollupService } from '../../report-rollup/report-rollup.service';
import { WindowRefService } from '../../indexedDb/window-ref.service';
import { SettingsService } from '../../settings/settings.service';
import { PhastReportService } from './phast-report.service';
import { ModalDirective } from 'ngx-bootstrap';
import { SettingsDbService } from '../../indexedDb/settings-db.service';
import { DirectoryDbService } from '../../indexedDb/directory-db.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-phast-report',
  templateUrl: './phast-report.component.html',
  styleUrls: ['./phast-report.component.css']
})
export class PhastReportComponent implements OnInit {

  @Input()
  settings: Settings;
  @Input()
  phast: PHAST;
  @Input()
  inPhast: boolean;
  @Input()
  assessment: Assessment;
  @Input()
  inRollup: boolean;
  @Input()
  quickReport: boolean;
  @Input()
  containerHeight: number;
  @Input()
  printView: boolean;
  @Input()
  printInputSummary: boolean;
  @Input()
  printResultsData: boolean;
  @Input()
  printReportGraphs: boolean;
  @Input()
  printReportSankey: boolean;
  @Input()
  printEnergyUsed: boolean;
  @Input()
  printExecutiveSummary: boolean;

  @ViewChild('reportTemplate') reportTemplate: TemplateRef<any>;

  @ViewChild('printMenuModal') public printMenuModal: ModalDirective;

  @ViewChild('reportBtns') reportBtns: ElementRef;
  @ViewChild('reportHeader') reportHeader: ElementRef;

  currentTab: string = 'energy-used';
  assessmentDirectories: Array<Directory>;
  createdDate: Date;
  showPrint: boolean = false;
  showPrintMenu: boolean = false;
  showPrintDiv: boolean = false;

  selectAll: boolean = false;
  reportContainerHeight: number;
  constructor(private phastService: PhastService, private settingsDbService: SettingsDbService, private directoryDbService: DirectoryDbService, private indexedDbService: IndexedDbService, private phastReportService: PhastReportService, private reportRollupService: ReportRollupService, private windowRefService: WindowRefService, private settingsService: SettingsService) { }

  ngOnInit() {
    this.initPrintLogic();
    this.createdDate = new Date();
    if (this.settings) {
      if (!this.settings.energyResultUnit) {
        this.settings = this.settingsService.setEnergyResultUnitSetting(this.settings);
      }
    }
    if (this.assessment.phast && this.settings && !this.phast) {
      this.phast = this.assessment.phast;
    } else if (this.assessment.phast && !this.settings) {
      this.getSettings();
    }

    if (this.assessment) {
      this.assessmentDirectories = new Array<Directory>();
      this.getDirectoryList(this.assessment.directoryId);
    }
    if (!this.inPhast) {
      this.currentTab = 'executive-summary';
    }

    if (!this.phast.operatingHours.hoursPerYear) {
      this.phast.operatingHours.hoursPerYear = 8736;
    }

    if (this.inRollup) {
      this.showPrint = this.printView;
    }
    else {
      //subscribe to print event
      this.phastReportService.showPrint.subscribe(printVal => {
        //shows loading print view
        this.showPrintDiv = printVal;
        if (printVal == true) {
          //use delay to show loading before print payload starts
          setTimeout(() => {
            this.showPrint = printVal;
          }, 20)
        } else {
          this.showPrint = printVal;
        }
      });
    }

  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.containerHeight && !changes.containerHeight.firstChange) {
      this.getContainerHeight();
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.getContainerHeight();
    }, 100)
  }

  getContainerHeight() {
    let btnHeight: number = this.reportBtns.nativeElement.clientHeight;
    let headerHeight: number = this.reportHeader.nativeElement.clientHeight;
    this.reportContainerHeight = this.containerHeight - btnHeight - headerHeight - 25;
  }

  initPrintLogic() {
    if (!this.inRollup) {
      this.printEnergyUsed = false;
      this.printExecutiveSummary = false;
      this.printResultsData = false;
      this.printReportGraphs = false;
      this.printReportSankey = false;
      this.printInputSummary = false;
    }
  }

  setTab(str: string): void {
    this.currentTab = str;
    setTimeout(() => {
      d3.selectAll('.tick text').style('display', 'initial');
    }, 50);
  }


  getSettings(): void {
    let tmpSettings: Settings = this.settingsDbService.getByAssessmentId(this.assessment);
    if (tmpSettings) {
      if (!tmpSettings.energyResultUnit) {
        tmpSettings = this.settingsService.setEnergyResultUnitSetting(tmpSettings);
      }
      this.settings = tmpSettings;
    } else {
      this.getParentDirectorySettings(this.assessment.directoryId);
    }
  }


  getParentDirectorySettings(dirId: number): void {
    let tmpSettings: Settings = this.settingsDbService.getByDirectoryId(dirId);
    if (tmpSettings) {
      if (!tmpSettings.energyResultUnit) {
        tmpSettings = this.settingsService.setEnergyResultUnitSetting(tmpSettings);
      }
      this.settings = tmpSettings;
    } else {
      let parentDirectory = this.directoryDbService.getById(dirId);
      //get parent directory settings
      this.getParentDirectorySettings(parentDirectory.parentDirectoryId);
    }
  }

  getDirectoryList(id: number): void {
    if (id && id != 1) {
      let tmpDir: Directory = this.directoryDbService.getById(id);
      if (tmpDir) {
        this.assessmentDirectories.push(tmpDir);
        if (tmpDir.parentDirectoryId != 1) {
          this.getDirectoryList(tmpDir.parentDirectoryId);
        }
      }
    }
  }

  showModal(): void {
    this.showPrintMenu = true;
  }

  closeModal(reset: boolean): void {
    if (reset) {
      this.resetPrintSelection();
    }
    this.showPrintMenu = false;
  }

  resetPrintSelection() {
    this.selectAll = false;
    this.printEnergyUsed = false;
    this.printExecutiveSummary = false;
    this.printResultsData = false;
    this.printReportGraphs = false;
    this.printReportSankey = false;
    this.printInputSummary = false;
  }

  togglePrint(section: string): void {
    switch (section) {
      case "selectAll": {
        this.selectAll = !this.selectAll;
        if (this.selectAll) {
          this.printEnergyUsed = true;
          this.printExecutiveSummary = true;
          this.printResultsData = true;
          this.printReportGraphs = true;
          this.printReportSankey = true;
        }
        else {
          this.printEnergyUsed = false;
          this.printExecutiveSummary = false;
          this.printResultsData = false;
          this.printReportGraphs = false;
          this.printReportSankey = false;
        }
        break;
      }
      case "energyUsed": {
        this.printEnergyUsed = !this.printEnergyUsed;
        break;
      }
      case "executiveSummary": {
        this.printExecutiveSummary = !this.printExecutiveSummary;
        break;
      }
      case "results": {
        this.printResultsData = !this.printResultsData;
        break;
      }
      case "reportGraphs": {
        this.printReportGraphs = !this.printReportGraphs;
        break;
      }
      case "reportSankey": {
        this.printReportSankey = !this.printReportSankey;
        break;
      }
      case "inputData": {
        this.printInputSummary = !this.printInputSummary;
        break;
      }
      default: {
        break;
      }
    }
  }


  print(): void {
    this.closeModal(false);
    //when print clicked set show print value to true
    this.phastReportService.showPrint.next(true);
    setTimeout(() => {
      let win = this.windowRefService.nativeWindow;
      let doc = this.windowRefService.getDoc();
      win.print();
      //after printing hide content again
      this.phastReportService.showPrint.next(false);
      this.resetPrintSelection();
    }, 2000);
  }
}