import OptType from '../enums/optimizationType';
import ObjectiveFn from '../interfaces/objectiveFunction';

export default class Particle {
    private _velocity: number[];
    private _position: number[];
    private _personalBest: number[];
    private static _globalBest: number[];

    private static _objectiveFunction: ObjectiveFn;
    private static _optimizationType: OptType;
    private static _minPosition: number[];
    private static _maxPosition: number[];

    constructor(dimensions: number) {
        if (!Particle._objectiveFunction || !Particle._optimizationType || Particle._minPosition.length === 0 || Particle._maxPosition.length === 0)
            throw new Error('Set static swarm Params!');

        if (Particle._minPosition.length !== dimensions || Particle._maxPosition.length !== dimensions)
            throw new Error('minPosition and maxPosition must have the same length as dimensions!');

        this._velocity = new Array(dimensions).fill(0);
        this._position = new Array(dimensions).fill(0).map((_, index) => {
            return (Math.random() * (Particle._maxPosition[index] - Particle._minPosition[index])) + Particle._minPosition[index];
        });

        this._personalBest = this._position;
        if (!Particle._globalBest) Particle._globalBest = this._position;
        else this.checkPerformance();
    }

    private checkPerformance(): void {
        const performance = Particle._objectiveFunction.objectiveFunction(...this._position);
        const globalBestValue = Particle._objectiveFunction.objectiveFunction(...Particle._globalBest);
        const personalBestValue = Particle._objectiveFunction.objectiveFunction(...this._personalBest);
        if ((Particle._optimizationType === 'max' && performance > globalBestValue)
            || (Particle._optimizationType === 'min' && performance < globalBestValue)) {
            Particle._globalBest = this._position;
            this._personalBest = this._position;
        } else if ((Particle._optimizationType === 'max' && performance > personalBestValue)
            || (Particle._optimizationType === 'min' && performance < personalBestValue)) {
            this._personalBest = this._position;
        } else {
            throw new Error('checkPerformance Error!'); //Just a test, Remove Later
        }
    }

    public get globalBest() {
        return Particle._globalBest;
    }

    public static setSwarmParams(objectiveFunction: ObjectiveFn, optimizationType: OptType, minPosition: number[], maxPosition: number[]): void {
        Particle._objectiveFunction = objectiveFunction;
        Particle._optimizationType = optimizationType;
        Particle._minPosition = minPosition;
        Particle._maxPosition = maxPosition;
    }
}
