package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DFSSimulationSteps extends SimulationSteps{
	@JsonProperty("StackEntry")
	private StackEntry c_stackEntry;
	public DFSSimulationSteps(String visitedNodeName, String pseudoCodeLine, StackEntry stackEntry ) {
		super(visitedNodeName, pseudoCodeLine);
		c_stackEntry = stackEntry;
	}
	public StackEntry getC_stackEntry() {
		return c_stackEntry;
	}
}




