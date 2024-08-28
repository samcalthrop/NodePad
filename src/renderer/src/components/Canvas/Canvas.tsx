import { DrawFunc } from '@renderer/types';
import { useEffect, useRef, useState } from 'react';

export type CanvasProps = React.DetailedHTMLProps<
  React.CanvasHTMLAttributes<HTMLCanvasElement>,
  HTMLCanvasElement
> & {
  drawFunc: DrawFunc;
};

// Taken from https://medium.com/@ruse.marshall/converting-a-vanilla-js-canvas-animation-to-react-78443bad6d7b
export const Canvas = ({ drawFunc, ...rest }: CanvasProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);
  const [animationFrameId, setAnimationFrameId] = useState<number>(0);

  const resizeCanvas = (canvasContext: CanvasRenderingContext2D): void => {
    const canvas = canvasContext.canvas;
    const { width, height } = canvas.getBoundingClientRect();

    if (canvas.width !== width || canvas.height !== height) {
      const { devicePixelRatio: ratio = 1 } = window;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvasContext.scale(ratio, ratio);
    }
  };

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const canvasContext = canvasRef.current.getContext('2d');
    if (canvasContext === null) {
      return;
    }

    setCanvasContext(canvasContext);
    resizeCanvas(canvasContext);
  }, []);

  useEffect(() => {
    let frameCount = 0;

    if (canvasContext) {
      const render = (): void => {
        frameCount++;
        drawFunc(frameCount, canvasContext);
        setAnimationFrameId(window.requestAnimationFrame(render));
      };
      render();
    }

    return (): void => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [canvasContext]);

  return <canvas ref={canvasRef} {...rest} />;
};
