import { useCallback, useEffect, useRef, useState } from 'react';
import { Node, Connection, NodeNetworkProps } from '../../types/index';

export const NodeNetwork = ({ files }: NodeNetworkProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const animationFrameId = useRef<number>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [draggedNode, setDraggedNode] = useState<number | null>(null);
  const [draggingConnection, setDraggingConnection] = useState<{
    fromId: number;
    toPos: { x: number; y: number };
  } | null>(null);
  const radius = 15; // radius of the nodes

  /* check if given position is valid (not overlapping with other nodes),
   memoising to optimise expensive calculations */
  const isValidPosition = useCallback(
    (x: number, y: number, existingNodes: Node[]): boolean => {
      const minDistance = 2 * radius;
      return !existingNodes.some(
        /* performing pythagoras to check if the distance between the two nodes is less than
       the minimum distance */
        (node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < minDistance
      );
    },
    [radius]
  );

  // generate random position within canvas
  const getRandomPosition = (existingNodes: Node[], attempts = 1000): { x: number; y: number } => {
    const padding = 50; // padding from canvas edges
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    for (let i = 0; i < attempts; i++) {
      const x = padding + Math.random() * (canvas.width - 2 * padding);
      const y = padding + Math.random() * (canvas.height - 2 * padding);
      if (isValidPosition(x, y, existingNodes)) {
        return { x, y };
      }
    }
    // if no valid position found after attempts, return a random position
    return { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
  };

  // initialize nodes from the array passed in
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initialNodes: Node[] = [];
    let index = 0;
    for (const item of files) {
      // if the item passed in has no children, it's assumed to be a file
      if (item.label?.toString().endsWith('.md')) {
        const file = item;
        const position = getRandomPosition(initialNodes);
        // instantiates new node with the file's name and path, at a random position
        initialNodes.push({
          id: index,
          x: position.x,
          y: position.y,
          title: file.label?.toString().replace('.md', '') || '',
          filePath: file.value?.toString() || '',
          connections: [],
        });
        // the next node id will be given the next number, which only increments if a new node is created
        index++;
      } else {
        if (item.children) {
          for (const child of item.children) {
            /* pushes each child to the end of the files array, to go through the same process
             until all children are files, and so become nodes */
            files.push(child);
          }
        }
      }
    }
    setNodes(initialNodes);
    console.log('initial nodes: ', initialNodes);
  }, [files]);

  // // canvas drawing function
  // const draw = (ctx: CanvasRenderingContext2D): void => {
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  //   // draw connections between each node
  //   connections.forEach((connection) => {
  //     const fromNode = nodes.find((node) => node.id === connection.from);
  //     const toNode = nodes.find((node) => node.id === connection.to);
  //     if (fromNode && toNode) {
  //       ctx.beginPath();
  //       ctx.moveTo(fromNode.x, fromNode.y);
  //       ctx.lineTo(toNode.x, toNode.y);
  //       ctx.strokeStyle = '#666';
  //       ctx.lineWidth = 2;
  //       ctx.stroke();
  //     }
  //   });

  //   // dragging connection line
  //   if (draggingConnection) {
  //     const fromNode = nodes.find((node) => node.id === draggingConnection.fromId);
  //     if (fromNode) {
  //       ctx.beginPath();
  //       ctx.moveTo(fromNode.x, fromNode.y);
  //       ctx.lineTo(draggingConnection.toPos.x, draggingConnection.toPos.y);
  //       ctx.strokeStyle = '#666';
  //       ctx.setLineDash([5, 5]);
  //       ctx.lineWidth = 2;
  //       ctx.stroke();
  //       ctx.setLineDash([]);
  //     }
  //   }

  //   // craw nodes
  //   nodes.forEach((node) => {
  //     // node circle
  //     ctx.beginPath();
  //     ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
  //     ctx.fillStyle = '#2196F3';
  //     ctx.fill();

  //     // connection handle
  //     ctx.beginPath();
  //     ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
  //     ctx.fillStyle = '#fff';
  //     ctx.fill();

  //     // title
  //     ctx.fillStyle = 'white';
  //     ctx.font = '12px Arial';
  //     ctx.textAlign = 'center';
  //     ctx.fillText(node.title, node.x, node.y + 30);
  //   });
  // };

  // canvas drawing function
  const draw = useCallback(() => {
    const ctx = contextRef.current;
    if (!ctx) return;

    // Clear only the used area instead of entire canvas
    const usedArea = nodes.reduce(
      (acc, node) => {
        return {
          minX: Math.min(acc.minX, node.x - radius - 30),
          minY: Math.min(acc.minY, node.y - radius - 30),
          maxX: Math.max(acc.maxX, node.x + radius + 30),
          maxY: Math.max(acc.maxY, node.y + radius + 30),
        };
      },
      { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
    );

    ctx.clearRect(
      usedArea.minX,
      usedArea.minY,
      usedArea.maxX - usedArea.minX,
      usedArea.maxY - usedArea.minY
    );

    // Batch similar operations
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;

    // draw connections
    ctx.beginPath();
    connections.forEach((connection) => {
      const fromNode = nodes.find((node) => node.id === connection.from);
      const toNode = nodes.find((node) => node.id === connection.to);
      if (fromNode && toNode) {
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
      }
    });
    ctx.stroke();

    // draw dragging connection
    if (draggingConnection) {
      const fromNode = nodes.find((node) => node.id === draggingConnection.fromId);
      if (fromNode) {
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(draggingConnection.toPos.x, draggingConnection.toPos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    // batch node drawing
    ctx.fillStyle = '#2196F3';
    ctx.beginPath();
    nodes.forEach((node) => {
      ctx.moveTo(node.x + radius, node.y);
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
    });
    ctx.fill();

    // batch connection handling
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    nodes.forEach((node) => {
      ctx.moveTo(node.x + 5, node.y);
      ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
    });
    ctx.fill();

    // batch text rendering
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    nodes.forEach((node) => {
      ctx.fillText(node.title, node.x, node.y + 30);
    });
  }, [nodes, connections, draggingConnection, radius]);

  // check if user has clicked a connection
  const isClickOnConnection = (x: number, y: number, connection: Connection): boolean => {
    const fromNode = nodes.find((n) => n.id === connection.from);
    const toNode = nodes.find((n) => n.id === connection.to);
    if (!fromNode || !toNode) return false;

    const nodeA = { x: fromNode.x, y: fromNode.y };
    const nodeB = { x: toNode.x, y: toNode.y };
    const click = { x, y };

    // calculate distance from point to line segment
    const lengthAB = Math.sqrt(Math.pow(nodeB.x - nodeA.x, 2) + Math.pow(nodeB.y - nodeA.y, 2));
    // perpendicular distance from point to line AB, using vector cross product
    const perpDistance =
      Math.abs(
        (nodeB.y - nodeA.y) * click.x -
          (nodeB.x - nodeA.x) * click.y +
          nodeB.x * nodeA.y -
          nodeB.y * nodeA.x
      ) / lengthAB;

    // calculate angle between line AB and the horizontal
    const theta = Math.atan((nodeB.y - nodeA.y) / (nodeB.x - nodeA.x));
    console.log('angle: ', theta * (180 / Math.PI));

    return (
      perpDistance < 10 && // within 10px of the line
      x >= Math.min(nodeA.x, nodeB.x) + radius * Math.cos(theta) && // click is within line segment, the node's radius
      x <= Math.max(nodeA.x, nodeB.x) - radius * Math.cos(theta) &&
      y >= Math.min(nodeA.y, nodeB.y) - radius * Math.sin(theta) &&
      y <= Math.max(nodeA.y, nodeB.y) + radius * Math.sin(theta)
    );
  };

  // mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    // mouse position relative to the canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // check if clicking on a connection (to remove it)
    const clickedConnection = connections.find((conn) => isClickOnConnection(x, y, conn));
    // remove connection if clicked
    if (clickedConnection) {
      setConnections((prev) =>
        prev.filter(
          (conn) => conn.from !== clickedConnection.from || conn.to !== clickedConnection.to
        )
      );
      // prevents any other mouse handling, graphically removing connection immediately
      return;
    }

    // check if clicking on a node
    const clickedNode = nodes.find(
      (node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < radius
    );

    if (clickedNode) {
      // check if clicking near center (connection handle)
      const distanceToCenter = Math.sqrt(
        Math.pow(clickedNode.x - x, 2) + Math.pow(clickedNode.y - y, 2)
      );
      if (distanceToCenter < 10) {
        // start dragging a connection
        setDraggingConnection({
          fromId: clickedNode.id,
          toPos: { x, y },
        });
      } else {
        // start dragging the node
        setDraggedNode(clickedNode.id);
      }
    }
  };

  // throttling mouse move handler
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>): void => {
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(() => {
          const rect = canvasRef.current?.getBoundingClientRect();
          if (!rect) return;

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          // update canvas to draw the node in its new position, and assign it a new position internally
          if (draggedNode) {
            setNodes((prev) =>
              prev.map((node) => (node.id === draggedNode ? { ...node, x, y } : node))
            );
          }

          // update canvas to draw the dragging connection by mouse, and assign it a new position internally
          if (draggingConnection) {
            setDraggingConnection((prev) => (prev ? { ...prev, toPos: { x, y } } : null));
          }

          animationFrameId.current = undefined;
        });
      }
    },
    [draggedNode, draggingConnection]
  );

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (draggingConnection) {
      // check if mouse unclicked within a node's radius
      const targetNode = nodes.find(
        (node) => Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < radius
      );

      if (targetNode && targetNode.id !== draggingConnection.fromId) {
        setConnections((prev) => [
          // extends the previous connections array to include the new connection
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

  // // configuring canvas and render loop
  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   const context = canvas.getContext('2d');
  //   if (!context) return;
  //   contextRef.current = context;
  //   const resizeCanvas = (): void => {
  //     canvas.width = canvas.clientWidth;
  //     canvas.height = canvas.clientHeight;
  //   };
  //   resizeCanvas();
  //   window.addEventListener('resize', resizeCanvas);

  //   // request animation frame to render the canvas, and call the next frame, creating a loop
  //   let animationFrameId: number;
  //   const render = (): void => {
  //     draw();
  //     animationFrameId = window.requestAnimationFrame(render);
  //   };
  //   render();

  //   return (): void => {
  //     window.removeEventListener('resize', resizeCanvas);
  //     window.cancelAnimationFrame(animationFrameId);
  //   };
  // }, [nodes, connections, draggingConnection]);

  // initialize canvas context once
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    contextRef.current = canvas.getContext('2d');
    const ctx = contextRef.current;
    if (!ctx) return;

    const resizeCanvas = (): void => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      // immediately redraw after resize
      draw();
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return (): void => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // separate render loop effect
  useEffect(() => {
    let frameId: number;
    const render = (): void => {
      draw();
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    return (): void => {
      cancelAnimationFrame(frameId);
    };
  }, [draw]);

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
