package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DFSSimulationSteps extends SimulationSteps{
	@JsonProperty("StackEntry")
	private StackEntry c_stackEntry;
	
	public DFSSimulationSteps(String visitedNodeName, String pseudoCodeLine, StackEntry stackEntry, String fromNode, String toNode) {
		super(visitedNodeName, pseudoCodeLine, fromNode, toNode);
		c_stackEntry = stackEntry;
	}
	public StackEntry getC_stackEntry() {
		return c_stackEntry;
	}
}




