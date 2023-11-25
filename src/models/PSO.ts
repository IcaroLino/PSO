import OptType from '../enums/optimizationType';
import ObjectiveFn from '../interfaces/objectiveFunction';
import Particle from '../models/Particle';

export default class PSO {

    private swarmHistory: Array<Particle[]> = [];
    private globalBestHistory: Array<number[]> = [];

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

        this.swarmHistory.push(swarm);
        this.globalBestHistory.push(Particle.globalBest);

        for (let i = 0; i < generations; i++) {
            const w = wMax - i * ((wMax - wMin) / (generations - 1));

            swarm.forEach((individual) => individual.updatePosition(w, c1, c2));

            this.swarmHistory.push(swarm);
            this.globalBestHistory.push(Particle.globalBest);
        }
    }

    public get getSwarmHistory(): Array<Particle[]> {
        return this.swarmHistory;
    }

    public get getGlobalBestHistory(): Array<number[]> {
        return this.globalBestHistory;
    }

    public static setSwarmParams(objectiveFunction: ObjectiveFn, optimizationType: OptType, minPosition: number[], maxPosition: number[]): void {
        PSO._objectiveFunction = objectiveFunction;
        PSO._optimizationType = optimizationType;
        PSO._minPosition = minPosition;
        PSO._maxPosition = maxPosition;
    }
}
