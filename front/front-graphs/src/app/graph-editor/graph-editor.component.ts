import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface Node {
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
}

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss']
})
export class GraphEditorComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  nodes: Node[] = [];
  edges: Edge[] = [];
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  nextNodeIndex = 0;
  nodeRadius = 20;
  selectedNodeLabel: string | null = null;
  visitedNodes: Set<string> = new Set();

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.redraw();
  }

  onCanvasClick(event: MouseEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = this.findNodeAtPosition(x, y);
    if (clickedNode) {
      this.handleNodeClick(clickedNode.label);
    } else {
      this.addNode(x, y);
    }
  }

  addNode(x: number, y: number) {
    if (this.nextNodeIndex >= this.alphabet.length) {
      alert("Maximum of 26 nodes (A-Z) supported.");
      return;
    }

    const label = this.alphabet[this.nextNodeIndex++];
    this.nodes.push({ x, y, label });
    this.redraw();
  }

  findNodeAtPosition(x: number, y: number): Node | null {
    return this.nodes.find(
      node => Math.hypot(node.x - x, node.y - y) <= this.nodeRadius
    ) || null;
  }

  handleNodeClick(label: string) {
    if (this.selectedNodeLabel === null) {
      this.selectedNodeLabel = label;
    } else if (this.selectedNodeLabel !== label) {
      this.edges.push({ from: this.selectedNodeLabel, to: label });
      this.selectedNodeLabel = null;
      this.redraw();
    } else {
      this.selectedNodeLabel = null;
    }
  }

  redraw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw edges
    this.edges.forEach(edge => {
      const fromNode = this.nodes.find(n => n.label === edge.from)!;
      const toNode = this.nodes.find(n => n.label === edge.to)!;
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
    //
    // // Draw nodes
    // this.nodes.forEach(node => {
    //   // Circle
    //   ctx.beginPath();
    //   ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);
    //   ctx.fillStyle = node.label === this.selectedNodeLabel ? 'red' : 'blue';
    //   ctx.fill();
    //
    //   // Label
    //   ctx.fillStyle = 'white';
    //   ctx.font = '14px Arial';
    //   ctx.textAlign = 'center';
    //   ctx.textBaseline = 'middle';
    //   ctx.fillText(node.label, node.x, node.y);
    // });
    this.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, this.nodeRadius, 0, Math.PI * 2);

      if (this.visitedNodes.has(node.label)) {
        ctx.fillStyle = 'green';
      } else if (node.label === this.selectedNodeLabel) {
        ctx.fillStyle = 'red';
      } else {
        ctx.fillStyle = 'blue';
      }

      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  }

  async animateTraversal(order: string[]) {
    this.visitedNodes.clear(); // Reset any previous animations
    for (const label of order) {
      this.visitedNodes.add(label);
      this.redraw();
      await this.delay(1000); // 1 second delay
    }
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  resetTraversal() {
    this.visitedNodes.clear();
    this.redraw();
  }
}
