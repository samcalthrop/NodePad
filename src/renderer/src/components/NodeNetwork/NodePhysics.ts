import { Node, Position } from '../../types/index';

export class PhysicsSystem {
  // basic physics variables
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
    // if mouse is dragging, calculate its velocity
    let mouseVelocity = { x: 0, y: 0 };
    if (mousePos && this.lastMousePos) {
      mouseVelocity = {
        // speed = (distance (pixels) / time (1 frame)) * slowing factor
        x: (mousePos.x - this.lastMousePos.x) * this.velocityDamper,
        y: (mousePos.y - this.lastMousePos.y) * this.velocityDamper,
      };
    }
    this.lastMousePos = mousePos || null;

    // update node positions and apply basic physics every frame (collisions etc.)
    nodes.forEach((node) => {
      if (node.id === draggedNodeId) {
        if (mousePos) {
          node.x = mousePos.x;
          node.y = mousePos.y;
          node.vx = mouseVelocity.x;
          node.vy = mouseVelocity.y;
        }
      } else {
        // slows nodes by friction factor
        node.vx *= this.drag;
        node.vy *= this.drag;

        // update positions of nodes based on velocity
        node.x += node.vx;
        node.y += node.vy;
      }
    });

    // only execute boids if user is idle
    if (isIdle) {
      nodes.forEach((node) => {
        // skip the node being targeted (dragged)
        if (node.id === draggedNodeId) return;

        // initialise the rest of boids variables to 0 (these only require this scope)
        let close_dx = 0;
        let close_dy = 0;
        let xposAvg = 0;
        let yposAvg = 0;
        let xvelAvg = 0;
        let yvelAvg = 0;
        let neighbouringBoids = 0;

        // perform boid's on this node using each other node in turn
        nodes.forEach((otherNode) => {
          if (node.id === otherNode.id) return;

          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const squaredDistance = dx * dx + dy * dy;

          // if within the protected range
          if (squaredDistance < this.protectedRange * this.protectedRange) {
            // move out of protected range
            close_dx += dx;
            close_dy += dy;
            // otherwise, if in the visual range
          } else if (squaredDistance < this.visualRange * this.visualRange) {
            // update average velocities
            xposAvg += otherNode.x;
            yposAvg += otherNode.y;
            xvelAvg += otherNode.vx;
            yvelAvg += otherNode.vy;
            neighbouringBoids++;
          }
        });

        // apply flocking behavior
        if (neighbouringBoids > 0) {
          xposAvg /= neighbouringBoids;
          yposAvg /= neighbouringBoids;
          xvelAvg /= neighbouringBoids;
          yvelAvg /= neighbouringBoids;

          // apply centering and match velocities by matching factor
          node.vx +=
            (xposAvg - node.x) * this.centeringFactor + (xvelAvg - node.vx) * this.matchingFactor;
          node.vy +=
            (yposAvg - node.y) * this.centeringFactor + (yvelAvg - node.vy) * this.matchingFactor;
        }

        // cause nodes to avoid by an additional avoid factor
        node.vx += close_dx * this.avoidFactor;
        node.vy += close_dy * this.avoidFactor;

        // start avoiding edges if within padding's distance of them
        const padding = 50;
        if (node.y - node.radius < padding) node.vy += this.turnFactor;
        if (node.x + node.radius > this.canvasWidth - padding) node.vx -= this.turnFactor;
        if (node.x - node.radius < padding) node.vx += this.turnFactor;
        if (node.y + node.radius > this.canvasHeight - padding) node.vy -= this.turnFactor;

        // place limits on speed of nodes
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

        // update positions based on velocity
        node.x += node.vx;
        node.y += node.vy;
      });
    }

    // collision handling
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      // collision with canvas edges (reverse x/ y velocities respectively)
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

          // calculate velocities of A and B relative to one another
          const dvx = nodeB.vx - nodeA.vx;
          const dvy = nodeB.vy - nodeA.vy;
          const velocityAlongNormal = dvx * nx + dvy * ny;

          // no need for collision resolution if nodes are moving away from one another
          if (velocityAlongNormal > 0) continue;

          // impulse = m(delta v)
          const j = -(1 + this.restitution) * velocityAlongNormal;
          const impulse = (2 * j) / (nodeA.mass + nodeB.mass);

          // apply impulse to nodes
          if (nodeA.id !== draggedNodeId) {
            nodeA.vx -= impulse * nx * nodeB.mass;
            nodeA.vy -= impulse * ny * nodeB.mass;
          }
          if (nodeB.id !== draggedNodeId) {
            nodeB.vx += impulse * nx * nodeA.mass;
            nodeB.vy += impulse * ny * nodeA.mass;
          }

          // if overlapping, separate nodes
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
