import { PreAssessment } from "../../calculator/utilities/pre-assessment/pre-assessment";
import { MotorPerformanceInputs } from "../../calculator/motors/motor-performance/motor-performance.service";
import { NemaInputs } from "../../calculator/motors/nema-energy-efficiency/nema-energy-efficiency.service";
import { O2Enrichment } from "./phast/o2Enrichment";
import { EfficiencyImprovementInputs } from "./phast/efficiencyImprovement";
import { EnergyEquivalencyFuel, EnergyEquivalencyElectric } from "./phast/energyEquivalency";
import { FlowCalculations } from "./phast/flowCalculations";
import { FanEfficiencyInputs } from "../../calculator/fans/fan-efficiency/fan-efficiency.service";
import { Fan203Inputs } from "./fans";

export interface Calculator {
    directoryId?: number,
    assessmentId?: number,
    id?: number,
    name?: string,
    type?: string,
    preAssessments?: Array<PreAssessment>,
    headTool?: HeadTool,
    headToolSuction?: HeadToolSuction,
    headToolType?: string,
    systemCurve?: SystemCurve,
    pumpCurve?: PumpCurve,
    motorPerformanceInputs?: MotorPerformanceInputs
    nemaInputs?: NemaInputs,
    specificSpeedInputs?: SpecificSpeedInputs,
    o2Enrichment?: O2Enrichment,
    efficiencyImprovementInputs?: EfficiencyImprovementInputs,
    energyEquivalencyInputs?: {
        energyEquivalencyFuel: EnergyEquivalencyFuel,
        energyEquivalencyElectric: EnergyEquivalencyElectric
    },
    flowCalculations?: FlowCalculations,
    fanEfficiencyInputs?: FanEfficiencyInputs,
    fan203Inputs?: Fan203Inputs,
    selected?: boolean
}

export interface HeadToolSuction {
    specificGravity: number,
    flowRate: number,
    suctionPipeDiameter: number,
    suctionTankGasOverPressure: number,
    suctionTankFluidSurfaceElevation: number,
    suctionLineLossCoefficients: number,
    dischargePipeDiameter: number,
    dischargeGaugePressure: number,
    dischargeGaugeElevation: number,
    dischargeLineLossCoefficients: number,
}


export interface HeadTool {
    specificGravity: number,
    flowRate: number,
    suctionPipeDiameter: number,
    suctionGaugePressure: number,
    suctionGaugeElevation: number,
    suctionLineLossCoefficients: number,
    dischargePipeDiameter: number,
    dischargeGaugePressure: number,
    dischargeGaugeElevation: number,
    dischargeLineLossCoefficients: number,
}

export interface SystemCurve {
    specificGravity?: number,
    systemLossExponent?: number,
    dataPoints?: Array<CurveData>,
    selectedP1Name?: string,
    selectedP2Name?: string
}

export interface CurveData {
    flowRate?: number,
    head?: number,
    modName?: string
}


// export interface PumpCurveForm {
export interface PumpCurve {
    dataRows?: PumpCurveDataRow[],
    dataOrder?: number,
    measurementOption?: string,
    baselineMeasurement?: number,
    modifiedMeasurement?: number,
    exploreLine?: number,
    exploreHead?: number,
    exploreFlow?: number,
    explorePumpEfficiency?: number,
    headOrder?: number,
    headConstant?: number,
    headFlow?: number,
    headFlow2?: number,
    headFlow3?: number,
    headFlow4?: number,
    headFlow5?: number,
    headFlow6?: number,
    pumpEfficiencyOrder?: number,
    pumpEfficiencyConstant?: number,
    maxFlow?: number
}

export interface PumpCurveDataRow {
    head: number,
    flow: number
}

export interface SpecificSpeedInputs {
    pumpType: number,
    pumpRPM: number,
    flowRate: number,
    head: number
}