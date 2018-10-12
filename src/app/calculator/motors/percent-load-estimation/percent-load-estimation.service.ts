import { Injectable } from '@angular/core';

@Injectable()
export class PercentLoadEstimationService {
  slipMethodInputs: SlipMethod = {
    synchronousSpeed: 0,
    measuredSpeed: 0,
    nameplateFullLoadSpeed: 0
  };
  fieldMeasurementInputs: FieldMeasurementInputs = {
    phase1Voltage: 0,
    phase1Amps: 0,
    phase2Voltage: 0,
    phase2Amps: 0,
    phase3Voltage: 0,
    phase3Amps: 0,
    ratedVoltage: 0,
    ratedCurrent: 0,
    powerFactor: 0
  };
  loadEstimationMethod: number = 0;
  constructor() { }

  initSlipMethodInputs(): SlipMethod {
    this.slipMethodInputs = {
      synchronousSpeed: 0,
      measuredSpeed: 0,
      nameplateFullLoadSpeed: 0
    };
    return this.slipMethodInputs;
  }

  initFieldMeasurementInputs(): FieldMeasurementInputs {
    this.fieldMeasurementInputs = {
      phase1Voltage: 0,
      phase1Amps: 0,
      phase2Voltage: 0,
      phase2Amps: 0,
      phase3Voltage: 0,
      phase3Amps: 0,
      ratedVoltage: 0,
      ratedCurrent: 0,
      powerFactor: 0
    }
    return this.fieldMeasurementInputs;
  }

  getResults(data: FieldMeasurementInputs): FieldMeasurementOutputs {
    let outputs: FieldMeasurementOutputs = {
      averageVoltage: this.averageVoltage(data),
      averageCurrent: this.averageCurrent(data),
      inputPower: this.inputPower(data),
      percentLoad: this.percentLoad(data),
      maxVoltageDeviation: this.voltageDeviation(data),
      voltageUnbalance: this.voltageUnbalance(data)
    }
    return outputs;
  }

  averageVoltage(data: FieldMeasurementInputs): number {
    let sum: number = data.phase1Voltage + data.phase2Voltage + data.phase3Voltage;
    return sum / 3;
  }

  averageCurrent(data: FieldMeasurementInputs): number {
    let sum: number = data.phase1Amps + data.phase2Amps + data.phase3Amps;
    return sum / 3;
  }

  inputPower(data: FieldMeasurementInputs): number {
    let val: number = data.ratedVoltage * data.ratedCurrent * data.powerFactor * Math.sqrt(3);
    return val / 1000;
  }

  percentLoad(data: FieldMeasurementInputs): number {
    let averageCurrent: number = this.averageCurrent(data);
    let percentLoadCurrent: number = averageCurrent / data.ratedCurrent;

    let averageVoltage: number = this.averageVoltage(data);
    let percentLoadVoltage: number = averageVoltage / data.ratedVoltage;

    let percentLoad: number = percentLoadVoltage * percentLoadCurrent * 100;
    return percentLoad;
  }

  voltageDeviation(data: FieldMeasurementInputs): number {
    let avgVoltage: number = this.averageVoltage(data);
    let deviation1: number = Math.abs(avgVoltage - data.phase1Voltage);
    let deviation2: number = Math.abs(avgVoltage - data.phase2Voltage);
    let deviation3: number = Math.abs(avgVoltage - data.phase3Voltage);
    return Math.max(deviation1, deviation2, deviation3);
  }

  voltageUnbalance(data: FieldMeasurementInputs): number {
    let deviation: number = this.voltageDeviation(data);
    let avgVoltage: number = this.averageVoltage(data);
    return (deviation / avgVoltage) * 100;
  }
}

export interface SlipMethod {
  synchronousSpeed: number,
  measuredSpeed: number,
  nameplateFullLoadSpeed: number
}


export interface FieldMeasurementInputs {
  phase1Voltage: number,
  phase1Amps: number,
  phase2Voltage: number,
  phase2Amps: number,
  phase3Voltage: number,
  phase3Amps: number,
  ratedVoltage: number,
  ratedCurrent: number,
  powerFactor: number
}

export interface FieldMeasurementOutputs {
  averageVoltage: number,
  averageCurrent: number,
  inputPower: number,
  percentLoad: number,
  maxVoltageDeviation: number,
  voltageUnbalance: number
}
