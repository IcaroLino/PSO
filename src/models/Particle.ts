import OptType from '../enums/optimizationType';
import ObjectiveFn from '../interfaces/objectiveFunction';

export default class Particle {
    private static _objectiveFunction: ObjectiveFn;
    private static _optimizationType: OptType;
    private static _minPosition: number;
    private static _maxPosition: number;  
    private static _globalBest: number[];

    private _velocity: number[];
    private _position: number[];
    private _personalBest: number[];

    constructor(dimensions: number) {
        this._velocity = new Array(dimensions).fill(0);
        this._position = new Array(dimensions).fill(0).map(() => {
            return (Math.random() * (Particle._maxPosition - Particle._minPosition)) + Particle._minPosition;
        });

        this._personalBest = this._position;
        if (!Particle._globalBest) Particle._globalBest = this._position;
    }    

    public static setSwarmParams(objectiveFunction: ObjectiveFn, optimizationType: OptType, minPosition: number, maxPosition: number) {
        Particle._objectiveFunction = objectiveFunction;
        Particle._optimizationType = optimizationType;
        Particle._minPosition = minPosition;
        Particle._maxPosition = maxPosition;
    }
}
