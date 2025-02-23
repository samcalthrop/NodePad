import { Node, Position } from '../types/index';

export class PhysicsSystem {
  private readonly velocityDamper = 0.2;
  private readonly restitution = 0.7;
  private readonly drag = 0.97;
  private readonly minSpeed = 0.01;
  private lastMousePos: Position | null = null;

  // boids variables
  private protectedRange = 50;
  private visualRange = 300;
  private avoidFactor = 0.002;
  private turnFactor = 0.1;
  private centeringFactor = 0.0001;
  private matchingFactor = 0.05;
  private maxSpeed = 3;

  constructor(
    private canvasWidth: number,
    private canvasHeight: number
  ) {}

  update(nodes: Node[], draggedNodeId: number | null, isIdle: boolean, mousePos?: Position): void {
    // Calculate mouse velocity if dragging
    let mouseVelocity = { x: 0, y: 0 };
    if (mousePos && this.lastMousePos) {
      mouseVelocity = {
        x: (mousePos.x - this.lastMousePos.x) * this.velocityDamper,
        y: (mousePos.y - this.lastMousePos.y) * this.velocityDamper,
      };
    }
    this.lastMousePos = mousePos || null;

    // Update positions and apply physics
    nodes.forEach((node) => {
      if (node.id === draggedNodeId) {
        if (mousePos) {
          node.x = mousePos.x;
          node.y = mousePos.y;
          node.vx = mouseVelocity.x;
          node.vy = mouseVelocity.y;
        }
      } else {
        // Apply drag
        node.vx *= this.drag;
        node.vy *= this.drag;

        // Update position based on velocity
        node.x += node.vx;
        node.y += node.vy;
      }
    });

    if (isIdle) {
      nodes.forEach((node) => {
        if (node.id === draggedNodeId) return;

        let close_dx = 0;
        let close_dy = 0;
        let xposAvg = 0;
        let yposAvg = 0;
        let xvelAvg = 0;
        let yvelAvg = 0;
        let neighbouringBoids = 0;

        // Check interaction with all other nodes
        nodes.forEach((otherNode) => {
          if (node.id === otherNode.id) return;

          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;

          if (Math.abs(dx) < this.visualRange && Math.abs(dy) < this.visualRange) {
            const squaredDistance = dx * dx + dy * dy;

            if (squaredDistance < this.protectedRange * this.protectedRange) {
              close_dx += dx;
              close_dy += dy;
            } else if (squaredDistance < this.visualRange * this.visualRange) {
              xposAvg += otherNode.x;
              yposAvg += otherNode.y;
              xvelAvg += otherNode.vx;
              yvelAvg += otherNode.vy;
              neighbouringBoids++;
            }
          }
        });

        // Apply flocking behavior
        if (neighbouringBoids > 0) {
          xposAvg /= neighbouringBoids;
          yposAvg /= neighbouringBoids;
          xvelAvg /= neighbouringBoids;
          yvelAvg /= neighbouringBoids;

          // Centering and velocity matching
          node.vx +=
            (xposAvg - node.x) * this.centeringFactor + (xvelAvg - node.vx) * this.matchingFactor;
          node.vy +=
            (yposAvg - node.y) * this.centeringFactor + (yvelAvg - node.vy) * this.matchingFactor;
        }

        // Avoidance
        node.vx += close_dx * this.avoidFactor;
        node.vy += close_dy * this.avoidFactor;

        // Edge avoidance
        const padding = 50;
        if (node.y - node.radius < padding) node.vy += this.turnFactor;
        if (node.x + node.radius > this.canvasWidth - padding) node.vx -= this.turnFactor;
        if (node.x - node.radius < padding) node.vx += this.turnFactor;
        if (node.y + node.radius > this.canvasHeight - padding) node.vy -= this.turnFactor;

        // Speed limits
        const speed = Math.sqrt(node.vx * node.vx + node.vy * node.vy);
        if (speed > 0) {
          if (speed < this.minSpeed) {
            node.vx = (node.vx / speed) * this.minSpeed;
            node.vy = (node.vy / speed) * this.minSpeed;
          }
          if (speed > this.maxSpeed) {
            node.vx = (node.vx / speed) * this.maxSpeed;
            node.vy = (node.vy / speed) * this.maxSpeed;
          }
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;
      });
    }

    // Handle collisions
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // Bounce off canvas edges
      if (node.x - node.radius < 0 || node.x + node.radius > this.canvasWidth) {
        node.vx *= -this.restitution;
        node.x = Math.max(node.radius, Math.min(this.canvasWidth - node.radius, node.x));
      }
      if (node.y - node.radius < 0 || node.y + node.radius > this.canvasHeight) {
        node.vy *= -this.restitution;
        node.y = Math.max(node.radius, Math.min(this.canvasHeight - node.radius, node.y));
      }

      for (let j = i + 1; j < nodes.length; j++) {
        const nodeA = nodes[i];
        const nodeB = nodes[j];

        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // collision handling
        if (distance < nodeA.radius + nodeB.radius) {
          const angle = Math.atan2(dy, dx);
          const nx = Math.cos(angle);
          const ny = Math.sin(angle);

          // Calculate relative velocity
          const dvx = nodeB.vx - nodeA.vx;
          const dvy = nodeB.vy - nodeA.vy;
          const velocityAlongNormal = dvx * nx + dvy * ny;

          // Only resolve if objects are moving towards each other
          if (velocityAlongNormal > 0) continue;

          // Calculate impulse
          // const restitution =
          // nodeA.id === draggedNodeId || nodeB.id === draggedNodeId ? 1 : this.restitution;
          const j = -(1 + this.restitution) * velocityAlongNormal;
          const impulse = (2 * j) / (nodeA.mass + nodeB.mass);

          // Apply impulse
          if (nodeA.id !== draggedNodeId) {
            nodeA.vx -= impulse * nx * nodeB.mass;
            nodeA.vy -= impulse * ny * nodeB.mass;
          }
          if (nodeB.id !== draggedNodeId) {
            nodeB.vx += impulse * nx * nodeA.mass;
            nodeB.vy += impulse * ny * nodeA.mass;
          }

          // Separate the nodes to prevent sticking
          const overlap = nodeA.radius + nodeB.radius - distance;
          const separationX = nx * overlap;
          const separationY = ny * overlap;

          if (nodeA.id !== draggedNodeId) {
            nodeA.x -= separationX;
            nodeA.y -= separationY;
          }
          if (nodeB.id !== draggedNodeId) {
            nodeB.x += separationX;
            nodeB.y += separationY;
          }
        }
      }
    }
  }
}
