import { Agent } from './Agent';

export class AgentManager {
  private agents: Map<string, Agent> = new Map();

  registerAgent(agent: Agent): void {
    this.agents.set(agent.config.id, agent);
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  async runAgent(id: string, task: string): Promise<any> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error(`Agent ${id} not found`);
    return agent.run(task);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }
}
