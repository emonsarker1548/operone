import { ModelProvider } from '../model-provider';
import { generateText } from 'ai';
import { EventBus } from '../core/EventBus';
import { PLANNER_SYSTEM_PROMPT } from '../prompts/planner';

export interface PlannerOptions {
  provider: ModelProvider;
  eventBus?: EventBus;
}

export interface PlanStep {
  step: number;
  action: string;
  tool?: string;
  parameters?: Record<string, any>;
  expected_outcome: string;
}

export interface Plan {
  goal: string;
  steps: PlanStep[];
  estimated_time?: string;
  dependencies?: string[];
}

/**
 * Planner - Creates step-by-step plans for achieving goals
 */
export class Planner {
  private provider: ModelProvider;
  private eventBus: EventBus;

  constructor(options: PlannerOptions | ModelProvider) {
    // Support both old and new constructor signatures
    if (options instanceof ModelProvider) {
      this.provider = options;
      this.eventBus = EventBus.getInstance();
    } else {
      this.provider = options.provider;
      this.eventBus = options.eventBus || EventBus.getInstance();
    }
  }

  /**
   * Create a plan for achieving a goal
   */
  async createPlan(goal: string, availableTools: string[] = []): Promise<string> {
    try {
      const model = this.provider.getModel();
      
      const toolsInfo = availableTools.length > 0 
        ? `\n\nAvailable tools: ${availableTools.join(', ')}`
        : '';

      const { text } = await generateText({
        model,
        messages: [
          { role: 'system', content: PLANNER_SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: `Create a detailed step-by-step plan for the following goal:\n\n"${goal}"${toolsInfo}\n\nFormat your response as a numbered list with clear, actionable steps.`
          }
        ],
      });

      this.eventBus.publish('planner', 'plan-created', { goal, plan: text });

      return text;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  }

  /**
   * Create a structured plan with detailed steps
   */
  async createStructuredPlan(goal: string, availableTools: string[] = []): Promise<Plan> {
    try {
      const model = this.provider.getModel();
      
      const toolsInfo = availableTools.length > 0 
        ? `\n\nAvailable tools: ${availableTools.join(', ')}`
        : '';

      const { text } = await generateText({
        model,
        messages: [
          { role: 'system', content: PLANNER_SYSTEM_PROMPT },
          { 
            role: 'user', 
            content: `Create a detailed plan for: "${goal}"${toolsInfo}\n\nRespond in JSON format with: { "goal": "...", "steps": [{ "step": 1, "action": "...", "tool": "...", "expected_outcome": "..." }], "estimated_time": "...", "dependencies": ["..."] }`
          }
        ],
      });

      // Try to parse as JSON
      try {
        const parsed = JSON.parse(text);
        this.eventBus.publish('planner', 'structured-plan-created', { goal, plan: parsed });
        return parsed;
      } catch {
        // If parsing fails, create a basic structure from the text
        const plan: Plan = {
          goal,
          steps: [{
            step: 1,
            action: text,
            expected_outcome: 'Complete the goal'
          }]
        };
        return plan;
      }
    } catch (error) {
      console.error('Error creating structured plan:', error);
      throw error;
    }
  }

  /**
   * Validate a plan
   */
  async validatePlan(plan: Plan): Promise<{
    valid: boolean;
    issues: string[];
    suggestions: string[];
  }> {
    try {
      const model = this.provider.getModel();
      
      const { text } = await generateText({
        model,
        messages: [
          { role: 'system', content: 'You are a plan validation expert. Analyze plans for completeness, feasibility, and potential issues.' },
          { 
            role: 'user', 
            content: `Validate this plan:\n\n${JSON.stringify(plan, null, 2)}\n\nRespond in JSON format with: { "valid": true/false, "issues": ["..."], "suggestions": ["..."] }`
          }
        ],
      });

      try {
        return JSON.parse(text);
      } catch {
        return {
          valid: true,
          issues: [],
          suggestions: [text]
        };
      }
    } catch (error) {
      console.error('Error validating plan:', error);
      throw error;
    }
  }
}
