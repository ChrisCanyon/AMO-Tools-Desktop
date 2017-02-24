import { Component, OnInit, Input } from '@angular/core';
import { MockDirectory } from '../../shared/mocks/mock-directory';
import { Directory } from '../../shared/models/directory';
import { AddonService } from '../../shared/addon.service';

@Component({
  selector: 'app-assessment-dashboard',
  templateUrl: './assessment-dashboard.component.html',
  styleUrls: ['./assessment-dashboard.component.css']
})
export class AssessmentDashboardComponent implements OnInit {
  @Input()
  directory: Directory;

  view: string = 'grid';
  isSettingsView: boolean = false;
  constructor(private addonService: AddonService) { }

  ngOnInit() {
    let loss = this.addonService.wallLosses(500.0, 80.0, 225.0, 10.0, 0.9, 1.394, 1.0);
    console.log(loss);
    //console.log(addon.wallLosses(500.0, 80.0, 225.0, 10.0, 0.9, 1.394, 1.0));
  }

  changeView($event){
    this.view = $event;
  }

  viewSettings(){
    this.isSettingsView = !this.isSettingsView;
  }

}
