import OptType from '../enums/optimizationType';
import ObjectiveFn from '../interfaces/objectiveFunction';
import Particle from '../models/Particle';

export default class PSO {

    private _swarmLog: Array<string[]> = [];
    private _globalBestHistory: Array<number[]> = [];

    private static _objectiveFunction: ObjectiveFn;
    private static _optimizationType: OptType;
    private static _minPosition: number[];
    private static _maxPosition: number[];

    constructor(
        private swarmQuantity: number,
        private dim: number,
        private generations: number,
        private wMax = 0.9,
        private wMin = 0.4,
        private c1 = 2,
        private c2 = 2
    ) {
        Particle.setSwarmParams(PSO._objectiveFunction, PSO._optimizationType, PSO._minPosition, PSO._maxPosition);
        const swarm = new Array(swarmQuantity).fill(undefined).map(() => new Particle(dim));
        
        this._swarmLog.push(swarm.map((particle) => JSON.stringify(particle)));
        this._globalBestHistory.push(Particle.globalBest);
        
        for (let i = 0; i < generations; i++) {
            const w = wMax - i * ((wMax - wMin) / (generations - 1));

            swarm.forEach((individual) => individual.updatePosition(w, c1, c2));

            this._swarmLog.push(swarm.map((particle) => JSON.stringify(particle)));
            this._globalBestHistory.push(Particle.globalBest);
        }
    }

    public printGlobalBestHistory(decimalPrecision: number): void {
        this._globalBestHistory.forEach((history, gen) => {
            console.log(`Generation ${gen}: (Position) ${history.map((h) => ' ' + h.toFixed(decimalPrecision))} | `
                + `(Objetive): ${PSO._objectiveFunction.objectiveFunction(...history).toFixed(decimalPrecision)}`);
        });
    }

    public get getSwarmLog(): string {
        return this._swarmLog.map((row, gen) => `Generation ${gen} \n`
            + row.map((particle, id) => `Particle ${id}: ` + particle).join('\n')).join('\n');
    }

    public get getGlobalBestHistory(): Array<number[]> {
        return this._globalBestHistory;
    }

    public static setSwarmParams(objectiveFunction: ObjectiveFn, optimizationType: OptType, minPosition: number[], maxPosition: number[]): void {
        PSO._objectiveFunction = objectiveFunction;
        PSO._optimizationType = optimizationType;
        PSO._minPosition = minPosition;
        PSO._maxPosition = maxPosition;
    }
}
