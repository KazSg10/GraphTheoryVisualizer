package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Child class of SimulationSteps, used for creating simulation steps for DFS algorithm
 */
public class DFSSimulationSteps extends SimulationSteps{
	@JsonProperty("StackEntry")
	private StackEntry c_stackEntry;
	
	public DFSSimulationSteps(String visitedNodeName, int pseudocodeLineIndex, StackEntry stackEntry, String fromNode, String toNode) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode);
		c_stackEntry = stackEntry;
	}
//	public StackEntry getC_stackEntry() {
//		return c_stackEntry;
//	}
}




