package com.server.json;

import java.util.ArrayList;
import java.util.List;

import com.algorithms.Graph;
import com.algorithms.Node;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class containing fields will be mapped to json components which will be sent to the browser.
 * Any other classes objects, in this class, have their fields also converted to json. 
 */
public class GraphOutputData {
	@JsonProperty("Algorithm")
	private String c_algorithm;
	@JsonProperty("SourceNode")
	private Node c_sourceNode;
	@JsonProperty("Graph")
	private Graph c_graph;
	@JsonProperty("Pseudocode")
	private List<String> c_pseudoCode = new ArrayList<>(); 

	private List<SimulationSteps> c_stepsList = new ArrayList<>();
	
	public GraphOutputData(String algorithm, Graph graph, List<String> pseudoCode, Node sourceNode ) {
		c_algorithm = algorithm;
		c_graph = graph;
		c_pseudoCode = pseudoCode;
		c_sourceNode = sourceNode;
	}
	public List<SimulationSteps> getSimulationSteps(){
		return c_stepsList;
	}
}