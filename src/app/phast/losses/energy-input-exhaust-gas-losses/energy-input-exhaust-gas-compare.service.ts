import { Injectable } from '@angular/core';
import { EnergyInputExhaustGasLoss } from '../../../shared/models/phast/losses/energyInputExhaustGasLosses';
import { PHAST } from '../../../shared/models/phast/phast';

@Injectable()
export class EnergyInputExhaustGasCompareService {
  baselineEnergyInputExhaustGasLosses: EnergyInputExhaustGasLoss[];
  modifiedEnergyInputExhaustGasLosses: EnergyInputExhaustGasLoss[];
  constructor() {
  }
  compareAllLosses(): boolean {
    let index = 0;
    let numLoss = this.baselineEnergyInputExhaustGasLosses.length;
    let isDiff: boolean = false;
    if (this.modifiedEnergyInputExhaustGasLosses) {
      for (index; index < numLoss; index++) {
        if (this.compareLoss(index) == true) {
          isDiff = true;
        }
      }
    }
    return isDiff;
  }

  compareLoss(index: number): boolean {
    return (
      this.compareExcessAir(index) ||
      this.compareCombustionAirTemp(index) ||
      this.compareExhaustGasTemp(index) ||
      this.compareTotalHeatInput(index) ||
      this.compareElectricalPowerInput(index)
    )
  }
  compareExcessAir(index: number): boolean {
    return this.compare(this.baselineEnergyInputExhaustGasLosses[index].excessAir, this.modifiedEnergyInputExhaustGasLosses[index].excessAir);
  }
  compareCombustionAirTemp(index: number): boolean {
    return this.compare(this.baselineEnergyInputExhaustGasLosses[index].combustionAirTemp, this.modifiedEnergyInputExhaustGasLosses[index].combustionAirTemp);
  }
  compareExhaustGasTemp(index: number): boolean {
    return this.compare(this.baselineEnergyInputExhaustGasLosses[index].exhaustGasTemp, this.modifiedEnergyInputExhaustGasLosses[index].exhaustGasTemp);
  }
  compareTotalHeatInput(index: number): boolean {
    return this.compare(this.baselineEnergyInputExhaustGasLosses[index].totalHeatInput, this.modifiedEnergyInputExhaustGasLosses[index].totalHeatInput);
  }
  compareElectricalPowerInput(index: number): boolean {
    return this.compare(this.baselineEnergyInputExhaustGasLosses[index].electricalPowerInput, this.modifiedEnergyInputExhaustGasLosses[index].electricalPowerInput);
  }

  compareBaselineModification(baseline: PHAST, modification: PHAST) {
    let isDiff = false;
    if (baseline && modification) {
      if (baseline.losses.energyInputExhaustGasLoss) {
        let index = 0;
        baseline.losses.energyInputExhaustGasLoss.forEach(loss => {
          if (this.compareBaseModLoss(loss, modification.losses.energyInputExhaustGasLoss[index]) == true) {
            isDiff = true;
          }
          index++;
        })
      }
    }
    return isDiff;
  }

  compareBaseModLoss(baseline: EnergyInputExhaustGasLoss, modification: EnergyInputExhaustGasLoss): boolean {
    return (
      this.compare(baseline.excessAir, modification.excessAir) ||
      this.compare(baseline.combustionAirTemp, modification.combustionAirTemp) ||
      this.compare(baseline.exhaustGasTemp, modification.exhaustGasTemp) ||
      this.compare(baseline.totalHeatInput, modification.totalHeatInput) ||
      this.compare(baseline.electricalPowerInput, modification.electricalPowerInput)
    )
  }

  compare(a: any, b: any) {
    if (a && b) {
      if (a != b) {
        return true;
      } else {
        return false;
      }
    }
    else if ((a && !b) || (!a && b)) {
      return true
    } else {
      return false;
    }
  }
}
