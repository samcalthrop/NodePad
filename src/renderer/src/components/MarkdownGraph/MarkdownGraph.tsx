import { useEffect, useRef, useState } from 'react';
import { Node, Connection } from '../../types/index';
import { TreeNodeData } from '@mantine/core';

interface MarkdownGraphProps {
  files: Array<TreeNodeData>;
}

export const MarkdownGraph = ({ files }: MarkdownGraphProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [draggingConnection, setDraggingConnection] = useState<{
    fromId: string;
    toPos: { x: number; y: number };
  } | null>(null);

  // Check if a position is valid (not overlapping with other nodes)
  const isValidPosition = (x: number, y: number, existingNodes: Node[]): boolean => {
    const minDistance = 50; // Minimum distance between nodes
    return !existingNodes.some(
      (node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < minDistance
    );
  };

  // Get random position within canvas bounds
  const getRandomPosition = (existingNodes: Node[], attempts = 100): { x: number; y: number } => {
    const padding = 50; // Padding from canvas edges
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    for (let i = 0; i < attempts; i++) {
      const x = padding + Math.random() * (canvas.width - 2 * padding);
      const y = padding + Math.random() * (canvas.height - 2 * padding);
      if (isValidPosition(x, y, existingNodes)) {
        return { x, y };
      }
    }
    // If no valid position found after attempts, return a fallback position
    return { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
  };

  // Initialize nodes from files
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initialNodes: Node[] = [];
    // files
    //   .filter((file) => file.label?.toString().endsWith('.md'))
    //   .forEach((file, index) => {
    //     const position = getRandomPosition(initialNodes);
    //     initialNodes.push({
    //       id: `node-${index}`,
    //       x: position.x,
    //       y: position.y,
    //       title: file.label?.toString() || '',
    //       filePath: file.value?.toString() || '',
    //       connections: [],
    //     });
    //     console.log(file.label);
    //   });
    let index = 0;
    for (const file of files) {
      if (!file.children) {
        const position = getRandomPosition(initialNodes);
        initialNodes.push({
          id: `node-${index}`,
          x: position.x,
          y: position.y,
          title: file.label?.toString() || '',
          filePath: file.value?.toString() || '',
          connections: [],
        });
        index++;
      } else {
        for (const child of file.children) {
          files.push(child);
        }
      }
    }
    setNodes(initialNodes);
    console.log('initial nodes: ', initialNodes);
  }, [files]);

  // Canvas drawing function
  const draw = (ctx: CanvasRenderingContext2D): void => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw connections
    connections.forEach((connection) => {
      const fromNode = nodes.find((n) => n.id === connection.from);
      const toNode = nodes.find((n) => n.id === connection.to);
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw dragging connection line
    if (draggingConnection) {
      const fromNode = nodes.find((n) => n.id === draggingConnection.fromId);
      if (fromNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(draggingConnection.toPos.x, draggingConnection.toPos.y);
        ctx.strokeStyle = '#666';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // Draw nodes
    nodes.forEach((node) => {
      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#2196F3';
      ctx.fill();

      // Node title
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.title, node.x, node.y);

      // Connection handle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    });
  };

  // Check if click is on a connection
  const isClickOnConnection = (x: number, y: number, connection: Connection): boolean => {
    const fromNode = nodes.find((n) => n.id === connection.from);
    const toNode = nodes.find((n) => n.id === connection.to);
    if (!fromNode || !toNode) return false;

    const A = { x: fromNode.x, y: fromNode.y };
    const B = { x: toNode.x, y: toNode.y };
    const C = { x, y };

    // Calculate distance from point to line segment
    const lengthAB = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const distance =
      Math.abs((B.y - A.y) * C.x - (B.x - A.x) * C.y + B.x * A.y - B.y * A.x) / lengthAB;

    return (
      distance < 10 && // Within 10px of the line
      x >= Math.min(A.x, B.x) - 10 &&
      x <= Math.max(A.x, B.x) + 10 &&
      y >= Math.min(A.y, B.y) - 10 &&
      y <= Math.max(A.y, B.y) + 10
    );
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on a connection
    const clickedConnection = connections.find((conn) => isClickOnConnection(x, y, conn));
    if (clickedConnection) {
      setConnections((prev) =>
        prev.filter(
          (conn) => conn.from !== clickedConnection.from || conn.to !== clickedConnection.to
        )
      );
      return;
    }

    // Check if clicking on a node
    const clickedNode = nodes.find(
      (node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 30
    );

    if (clickedNode) {
      // Check if clicking near center (connection handle)
      const distanceToCenter = Math.sqrt(
        Math.pow(clickedNode.x - x, 2) + Math.pow(clickedNode.y - y, 2)
      );
      if (distanceToCenter < 10) {
        // Start dragging a connection
        setDraggingConnection({
          fromId: clickedNode.id,
          toPos: { x, y },
        });
      } else {
        // Start dragging the node
        setDraggedNode(clickedNode.id);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggedNode) {
      setNodes((prev) => prev.map((node) => (node.id === draggedNode ? { ...node, x, y } : node)));
    }

    if (draggingConnection) {
      setDraggingConnection((prev) =>
        prev
          ? {
              ...prev,
              toPos: { x, y },
            }
          : null
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggingConnection) {
      const targetNode = nodes.find(
        (node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 30
      );

      if (targetNode && targetNode.id !== draggingConnection.fromId) {
        setConnections((prev) => [
          ...prev,
          {
            from: draggingConnection.fromId,
            to: targetNode.id,
          },
        ]);
      }
      setDraggingConnection(null);
    }

    setDraggedNode(null);
  };

  // Canvas setup and animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const resizeCanvas = (): void => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationFrameId: number;
    const render = (): void => {
      draw(context);
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return (): void => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, connections, draggingConnection]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};
