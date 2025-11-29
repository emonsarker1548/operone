// Default worker entry point
module.exports = async (task: any) => {
  // This is a placeholder. In a real app, this would dispatch to specific handlers
  // based on the task type.
  
  if (task.type === 'echo') {
    return task.data;
  }
  
  if (task.type === 'compute') {
    // Simulate heavy computation
    let result = 0;
    for(let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return { result, input: task.data };
  }

  throw new Error(`Unknown task type: ${task.type}`);
};
