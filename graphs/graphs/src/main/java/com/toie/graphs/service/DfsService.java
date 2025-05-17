package com.toie.graphs.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@AllArgsConstructor
public class DfsService {

    public List<String> runDfs(Map<String, List<String>> graph, String start) {
        List<String> result = new ArrayList<>();
        Set<String> visited = new HashSet<>();
        dfs(graph, start, visited, result);
        return result;
    }

    private void dfs(Map<String, List<String>> graph, String node, Set<String> visited, List<String> result) {
        if (visited.contains(node)) return;
        visited.add(node);
        result.add(node);
        for (String neighbor : graph.getOrDefault(node, new ArrayList<>())) {
            dfs(graph, neighbor, visited, result);
        }
    }
}
