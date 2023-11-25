interface ObjectiveFn {
  objectiveFunction: (...args: number[]) => number;  
}

export default ObjectiveFn;
