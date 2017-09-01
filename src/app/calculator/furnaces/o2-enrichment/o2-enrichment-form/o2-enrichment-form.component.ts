import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { O2Enrichment, O2EnrichmentOutput } from '../../../../shared/models/phast/o2Enrichment';
@Component({
  selector: 'app-o2-enrichment-form',
  templateUrl: './o2-enrichment-form.component.html',
  styleUrls: ['./o2-enrichment-form.component.css']
})
export class O2EnrichmentFormComponent implements OnInit {
  @Input()
  o2Enrichment: O2Enrichment;
  @Output('calculate')
  calculate = new EventEmitter<boolean>();
  @Input()
  o2EnrichmentOutput: O2EnrichmentOutput;
  @Output('changeFieldEmit')
  changeFieldEmit = new EventEmitter<string>();
  constructor() { }

  ngOnInit() {
  }
  calc() {
    this.calculate.emit(true);
  }

  changeField(str: string){
    this.changeFieldEmit.emit(str);
  }
}
