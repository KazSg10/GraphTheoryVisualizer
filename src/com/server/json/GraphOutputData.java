package com.server.json;

import java.util.ArrayList;
import java.util.List;

import com.algorithms.Graph;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GraphOutputData {
	@JsonProperty("Graph")
	private Graph c_graph;
	@JsonProperty("Pseudocode")
	private List<String> c_pseudoCode = new ArrayList<>(); 
	@JsonProperty("StepsList")
	private List<SimulationSteps> c_stepsList = new ArrayList<>();
	
	public GraphOutputData(Graph graph, List<String> pseudoCode) {
		c_graph = graph;
		c_pseudoCode = pseudoCode;
	}
	public List<SimulationSteps> getSimulationSteps(){
		return c_stepsList;
	}

}
