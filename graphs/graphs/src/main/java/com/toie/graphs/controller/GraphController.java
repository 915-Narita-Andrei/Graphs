package com.toie.graphs.controller;

import com.toie.graphs.api.GraphApi;
import com.toie.graphs.model.GraphDto;
import com.toie.graphs.service.BfsService;
import com.toie.graphs.service.DfsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class GraphController implements GraphApi {

    private final BfsService bfsService;
    private final DfsService dfsService;


    @Override
    public ResponseEntity<List<String>> bfs(GraphDto graphDto) {
        var res = bfsService.runBfs(graphDto.getGraph(), graphDto.getStartNode());
        return ResponseEntity.ok(res);
    }

    @Override
    public ResponseEntity<List<String>> dfs(GraphDto graphDto) {
        var res = dfsService.runDfs(graphDto.getGraph(), graphDto.getStartNode());
        return ResponseEntity.ok(res);
    }
}
