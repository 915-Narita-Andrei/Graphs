import {Component, ElementRef, ViewChild} from '@angular/core';
import {GraphService} from "../../api-client/generated-sources/graph-api";
import {GraphEditorComponent} from "./graph-editor/graph-editor.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @ViewChild(GraphEditorComponent) graphEditorComponent!: GraphEditorComponent;

  nodeInput1 = '';
  nodeInput2 = '';
  edgeInputFrom = '';
  edgeInputTo = '';

  constructor(private readonly graphService: GraphService) {
  }

  runBfs() {
    const startNode = this.nodeInput1.trim().toUpperCase();
    if (!startNode) return;

    const payload = {
      graph: this.buildAdjacencyList(),
      startNode
    };

    this.graphService.bfs(payload).subscribe({
      next: res => {
        console.log('BFS result:', res);
        this.graphEditorComponent.animateTraversal(res);
      },
      error: err => console.error('BFS error:', err)
    });
  }

  runDfs() {
    const startNode = this.nodeInput2.trim().toUpperCase();
    if (!startNode) return;

    const payload = {
      graph: this.buildAdjacencyList(),
      startNode
    };

    this.graphService.dfs(payload).subscribe({
      next: res => {
        console.log('DFS result:', res);
        this.graphEditorComponent.animateTraversal(res);
      },
      error: err => console.error('DFS error:', err)
    });
  }

  // runDijkstra() {
    // const startNode = this.nodeInput2.trim().toUpperCase();
    // if (!startNode) return;
    //
    // const payload = {
    //   graph: this.buildAdjacencyList(),
    //   startNode
    // };
    //
    // this.graphService.dfs(payload).subscribe({
    //   next: res => console.log('DFS result:', res),
    //   error: err => console.error('DFS error:', err)
    // });
  // }


  buildAdjacencyList(): Record<string, string[]> {
    const adjacencyList: Record<string, string[]> = {};

    // Initialize all nodes
    this.graphEditorComponent.nodes.forEach(node => {
      adjacencyList[node.label] = [];
    });

    // Add edges (directed)
    this.graphEditorComponent.edges.forEach(edge => {
      if (adjacencyList[edge.from]) {
        adjacencyList[edge.from].push(edge.to);
      }
    });

    return adjacencyList;
  }

  reset() {
    this.graphEditorComponent.resetTraversal();
  }
}
