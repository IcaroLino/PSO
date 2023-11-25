import PSO from './models/PSO';
import OptType from './enums/optimizationType';
import * as fs from 'fs';

function objectiveFn(x: number): number {
    // return Math.pow(x, 3) - (1.5 * x * y);
    // return x * Math.sin(10 * Math.PI * x) + 1;
    return Math.pow(x, 2) - 3 * x + 4;
}

const objFn = { objectiveFunction : objectiveFn };
const optimizationType = OptType.MIN;
const minPosition = [-10];
const maxPosition = [10];
const decimalPrecision = 5;

const swarmSize = 4;
const dimensions = minPosition.length;
const generation = 25;

PSO.setSwarmParams(objFn, optimizationType, minPosition, maxPosition);
try {
    const p = new PSO(swarmSize, dimensions, generation);
    p.printGlobalBestHistory(decimalPrecision);
    fs.writeFile('swarm.txt', p.getSwarmLog, (err) => {
        if (err) throw new Error('File writing Erro:', err);
    });
} catch (e) {
    console.error((e as Error).message);
}
