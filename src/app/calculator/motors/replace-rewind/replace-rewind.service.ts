import { Injectable } from '@angular/core';
import { ReplaceRewindData, ReplaceRewindResults } from './replace-rewind.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Injectable()
export class ReplaceRewindService {
  replaceRewindData: ReplaceRewindData = {
    operatingHours: 6000,
    motorSize: 350,
    load: 75,
    electricityCost: 0.08,
    currentEfficiency: 94.4,
    rewindEfficiencyLoss: 0.5,
    costOfRewind: 8384,
    newEfficiency: 95.7,
    purchaseCost: 33163,
  };
  constructor(private formBuilder: FormBuilder) { }

  initForm(): FormGroup {
    let tmpForm: FormGroup = this.formBuilder.group({
      operatingHours: [6000, [Validators.required, Validators.min(0)]],
      motorSize: [350, [Validators.required, Validators.min(0)]],
      load: [75, [Validators.required, Validators.min(0), Validators.max(100)]],
      electricityCost: [0.08, [Validators.required, Validators.min(0)]],
      currentEfficiency: [94.4, [Validators.required, Validators.min(0), Validators.max(100)]],
      rewindEfficiencyLoss: [0.5, [Validators.required, Validators.min(0), Validators.max(100)]],
      costOfRewind: [8384, [Validators.required, Validators.min(0)]],
      newEfficiency: [95.7, [Validators.required, Validators.min(0), Validators.max(100)]],
      purchaseCost: [33163, [Validators.required, Validators.min(0)]]
    });
    return tmpForm;
  }

  getFormFromObj(inputObj: ReplaceRewindData): FormGroup {
    let tmpForm: FormGroup = this.formBuilder.group({
      operatingHours: [inputObj.operatingHours, [Validators.required, Validators.min(0)]],
      motorSize: [inputObj.motorSize, [Validators.required, Validators.min(0)]],
      load: [inputObj.load, [Validators.required, Validators.min(0), Validators.max(100)]],
      electricityCost: [inputObj.electricityCost, [Validators.required, Validators.min(0)]],
      currentEfficiency: [inputObj.currentEfficiency, [Validators.required, Validators.min(0), Validators.max(100)]],
      rewindEfficiencyLoss: [inputObj.rewindEfficiencyLoss, [Validators.required, Validators.min(0), Validators.max(100)]],
      costOfRewind: [inputObj.costOfRewind, [Validators.required, Validators.min(0)]],
      newEfficiency: [inputObj.newEfficiency, [Validators.required, Validators.min(0), Validators.max(100)]],
      purchaseCost: [inputObj.purchaseCost, [Validators.required, Validators.min(0)]]
    });
    return tmpForm;
  }

  getObjFromForm(form: FormGroup): ReplaceRewindData {
    this.replaceRewindData = {
      operatingHours: form.controls.operatingHours.value,
      motorSize: form.controls.motorSize.value,
      load: form.controls.load.value,
      electricityCost: form.controls.electricityCost.value,
      currentEfficiency: form.controls.currentEfficiency.value,
      rewindEfficiencyLoss: form.controls.rewindEfficiencyLoss.value,
      costOfRewind: form.controls.costOfRewind.value,
      newEfficiency: form.controls.newEfficiency.value,
      purchaseCost: form.controls.purchaseCost.value
    }
    return this.replaceRewindData;
  }

  initReplaceRewindData(): ReplaceRewindData {
    this.replaceRewindData = {
      operatingHours: 6000,
      motorSize: 350,
      load: 75,
      electricityCost: 0.08,
      currentEfficiency: 94.4,
      rewindEfficiencyLoss: 0.5,
      costOfRewind: 8384,
      newEfficiency: 95.7,
      purchaseCost: 33163
    };
    return this.replaceRewindData;
  }

  getResults(inputs: ReplaceRewindData): ReplaceRewindResults {
    let results: ReplaceRewindResults = {
      differentialCost: 0,
      rewoundEnergyUse: 0,
      rewoundEnergyCost: 0,
      newEnergyUse: 0,
      newEnergyCost: 0,
      annualEnergySavings: 0,
      costSavings: 0,
      simplePayback: 0
    }
    results.differentialCost = this.getDifferentialCost(inputs);
    results.rewoundEnergyUse = this.getRewoundEnergyUse(inputs);
    results.rewoundEnergyCost = this.getRewoundEnergyCost(inputs, results);
    results.newEnergyUse = this.getNewEnergyUse(inputs);
    results.newEnergyCost = this.getNewEnergyCost(inputs, results);
    results.annualEnergySavings = this.getAnnualEnergySavings(results);
    results.costSavings = this.getCostSavings(results);
    results.simplePayback = this.getSimplePayback(results);
    return results;
  }
  getDifferentialCost(inputs: ReplaceRewindData): number {
    return inputs.purchaseCost - inputs.costOfRewind;
  }
  getRewoundEnergyUse(inputs: ReplaceRewindData): number {
    return 0.746 * inputs.motorSize * (inputs.load / 100) * inputs.operatingHours * (100 / (inputs.currentEfficiency - inputs.rewindEfficiencyLoss));
  }
  getRewoundEnergyCost(inputs: ReplaceRewindData, results: ReplaceRewindResults): number {
    return results.rewoundEnergyUse * inputs.electricityCost;
  }
  getNewEnergyUse(inputs: ReplaceRewindData): number {
    return 0.746 * inputs.motorSize * (inputs.load / 100) * inputs.operatingHours * (100 / inputs.newEfficiency);
  }
  getNewEnergyCost(inputs: ReplaceRewindData, results: ReplaceRewindResults): number {
    return results.newEnergyUse * inputs.electricityCost;
  }
  getAnnualEnergySavings(results: ReplaceRewindResults): number {
    return results.rewoundEnergyUse - results.newEnergyUse;
  }
  getCostSavings(results: ReplaceRewindResults): number {
    return results.rewoundEnergyCost - results.newEnergyCost;
  }
  getSimplePayback(results: ReplaceRewindResults): number {
    return results.differentialCost / results.costSavings;
  }

  //may want to add percent savings as a result. talk to kristina first
}