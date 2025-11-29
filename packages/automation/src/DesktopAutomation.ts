// RobotJS is optional - it requires native dependencies (X11) that aren't available in all environments
let robot: any;
try {
  robot = require('robotjs');
} catch (error) {
  // RobotJS not available - desktop automation features will throw errors
  robot = null;
}

export class DesktopAutomation {
  private ensureRobotAvailable(): void {
    if (!robot) {
      throw new Error('RobotJS is not available. Desktop automation requires native dependencies that may not be installed in this environment.');
    }
  }

  moveMouse(x: number, y: number): void {
    this.ensureRobotAvailable();
    robot.moveMouse(x, y);
  }

  clickMouse(button: 'left' | 'right' | 'middle' = 'left'): void {
    this.ensureRobotAvailable();
    robot.mouseClick(button);
  }

  typeString(text: string): void {
    this.ensureRobotAvailable();
    robot.typeString(text);
  }

  keyTap(key: string, modifier?: string | string[]): void {
    this.ensureRobotAvailable();
    robot.keyTap(key, modifier);
  }

  getScreenSize(): { width: number; height: number } {
    this.ensureRobotAvailable();
    return robot.getScreenSize();
  }

  getPixelColor(x: number, y: number): string {
    this.ensureRobotAvailable();
    return robot.getPixelColor(x, y);
  }

  isAvailable(): boolean {
    return robot !== null;
  }
}
