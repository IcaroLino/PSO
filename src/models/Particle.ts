import OptType from '../enums/optimizationType';
import ObjectiveFunctionInterface from '../interfaces/objectiveFunctionInterface';

export default class Particle {
    private _velocity: number[];
    private _position: number[];
    private _personalBest: number[];
    private static _globalBest: number[];

    private static _objectiveFunction: ObjectiveFunctionInterface;
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
        }
    }

    private updateVelocity(w: number, c1: number, c2: number): void {
        this._velocity = this._velocity.map((_, index) => {
            const newVelocity = (w * this._velocity[index])
                + c1 * Math.random() * (this._personalBest[index] - this._position[index])
                + c2 * Math.random() * (Particle._globalBest[index] - this._position[index]);

            const maxVelocity = Math.abs(this._position[index] * 0.1);

            if (Math.abs(newVelocity) > maxVelocity) return Math.sign(newVelocity) * maxVelocity;
            return newVelocity;
        });
    }

    public updatePosition(w: number, c1: number, c2: number): void {
        this.updateVelocity(w, c1, c2);
        this._position = this._position.map((_, index) => {
            const newPosition = this._velocity[index] + this._position[index];
            if (newPosition > Particle._maxPosition[index]) return Particle._maxPosition[index];
            if (newPosition < Particle._minPosition[index]) return Particle._minPosition[index];
            return newPosition;
        });
        this.checkPerformance();
    }

    public static get globalBest(): number[] {
        return Particle._globalBest;
    }

    public static setSwarmParams(objectiveFunction: ObjectiveFunctionInterface, optimizationType: OptType, minPosition: number[], maxPosition: number[]): void {
        Particle._objectiveFunction = objectiveFunction;
        Particle._optimizationType = optimizationType;
        Particle._minPosition = minPosition;
        Particle._maxPosition = maxPosition;
    }
}
