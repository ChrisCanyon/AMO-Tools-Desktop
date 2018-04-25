import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Settings } from '../../../shared/models/settings';
import { ModalDirective } from 'ngx-bootstrap';
import { SuiteDbService } from '../../suite-db.service';
import { IndexedDbService } from '../../../indexedDb/indexed-db.service';
import { GasLoadChargeMaterial } from '../../../shared/models/materials';

@Component({
  selector: 'app-custom-gas-load-charge-materials',
  templateUrl: './custom-gas-load-charge-materials.component.html',
  styleUrls: ['./custom-gas-load-charge-materials.component.css']
})
export class CustomGasLoadChargeMaterialsComponent implements OnInit {
  @Input()
  settings: Settings;

  gasChargeMaterials: Array<GasLoadChargeMaterial>;

  @ViewChild('materialModal') public materialModal: ModalDirective;

  constructor(private suiteDbService: SuiteDbService, private indexedDbService: IndexedDbService) { }

  ngOnInit() {
    this.getCustomMaterials();
  }

  getCustomMaterials() {
    this.gasChargeMaterials = new Array<GasLoadChargeMaterial>();
    this.indexedDbService.getAllGasLoadChargeMaterial().then(idbResults => {
      this.gasChargeMaterials = idbResults;
    });
  }
}
