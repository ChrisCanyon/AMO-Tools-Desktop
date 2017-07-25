import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable()
export class HelpPanelService {

  currentTab: BehaviorSubject<string>;
  currentField: BehaviorSubject<string>;

  constructor() { 
    this.currentField = new BehaviorSubject<string>(null);

  }

}
