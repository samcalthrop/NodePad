import { DrawFunc } from '@renderer/types';

// see https://medium.com/@ruse.marshall/converting-a-vanilla-js-canvas-animation-to-react-78443bad6d7b
export const drawPulsingDot: DrawFunc = (frameCount: number, context: CanvasRenderingContext2D) => {
  context.clearRect(0, 0, context.canvas.width, context.canvas.height);
  context.fillStyle = 'var(--mantine-primary-color-filled)'; // doesn't work
  context.beginPath();
  context.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI);
  context.fill();
};
