package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DFSSimulationSteps extends SimulationSteps{
	@JsonProperty("StackEntry")
	private StackEntry c_stackEntry;
	
	@JsonProperty("BackTrackedNode")
	private String c_backTrackedNode;
	public DFSSimulationSteps(String visitedNodeName, String pseudoCodeLine, StackEntry stackEntry, String backTrackedNode ) {
		super(visitedNodeName, pseudoCodeLine);
		c_stackEntry = stackEntry;
		c_backTrackedNode = backTrackedNode;
	}
	public StackEntry getC_stackEntry() {
		return c_stackEntry;
	}
}




