import robot from 'robotjs';

export class DesktopAutomation {
  moveMouse(x: number, y: number): void {
    robot.moveMouse(x, y);
  }

  clickMouse(button: 'left' | 'right' | 'middle' = 'left'): void {
    robot.mouseClick(button);
  }

  typeString(text: string): void {
    robot.typeString(text);
  }

  keyTap(key: string, modifier?: string | string[]): void {
    robot.keyTap(key, modifier);
  }

  getScreenSize(): { width: number; height: number } {
    return robot.getScreenSize();
  }

  getPixelColor(x: number, y: number): string {
    return robot.getPixelColor(x, y);
  }
}
