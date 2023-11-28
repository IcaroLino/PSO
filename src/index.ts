import PSO from './models/PSO';
import OptType from './enums/optimizationType';
import * as fs from 'fs';
import objectiveFn from './objectives/objectiveFunction';

const objFn = { objectiveFunction : objectiveFn };
const optimizationType = OptType.MIN;
const minPosition = [-500, -500];
const maxPosition = [500, 500];
const decimalPrecision = 5;

const swarmSize = 35;
const dimensions = minPosition.length;
const generation = 100;

// console.log(objectiveFn(-420, 500));
// console.log(objectiveFn(-65, -230));
// console.log(objectiveFn(-430, 110));

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
