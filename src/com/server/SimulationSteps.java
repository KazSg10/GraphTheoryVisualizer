package com.server;

import com.fasterxml.jackson.annotation.JsonProperty;

public abstract class SimulationSteps {
	@JsonProperty("VisitedNodeName")
	private String c_visitedNodeName;
	
	@JsonProperty("PseudoCodeLine")
	private String c_pseudoCodeLine;
	
	public SimulationSteps(String visitedNodeName, String pseudoCodeLine) {
		c_visitedNodeName = visitedNodeName;
		c_pseudoCodeLine = pseudoCodeLine;
	}

	public String getC_visitedNodeName() {
		return c_visitedNodeName;
	}

	public String getC_pseudoCodeLine() {
		return c_pseudoCodeLine;
	}
	
}
