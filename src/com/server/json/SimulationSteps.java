package com.server.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

public abstract class SimulationSteps {
	@JsonProperty("VisitedNodeName")
	private String c_visitedNodeName;
	
	@JsonProperty("PseudoCodeLine")
	private String c_pseudoCodeLine;
	
	@JsonProperty("FromNode")
	private String c_fromNode;
	
	@JsonProperty("ToNode")
	private String c_toNode;
	
	public SimulationSteps(String visitedNodeName, String pseudoCodeLine, String fromNode, String toNode) {
		c_visitedNodeName = visitedNodeName;
		c_pseudoCodeLine = pseudoCodeLine;
		c_fromNode = fromNode;
		c_toNode = toNode;
	}

	public String getC_visitedNodeName() {
		return c_visitedNodeName;
	}

	public String getC_pseudoCodeLine() {
		return c_pseudoCodeLine;
	}
	
}
