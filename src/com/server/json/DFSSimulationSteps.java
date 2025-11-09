package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Child class of SimulationSteps, used for creating simulation steps for DFS algorithm
 */
public class DFSSimulationSteps extends SimulationSteps{
	@JsonProperty("StackEntry")
	private StackEntry c_stackEntry;
	
	/**
	 * DFSSimulationSteps constructor
	 * @param visitedNodeName - Name of visited node
	 * @param pseudocodeLineIndex - Index of the pseudocode line to be highlighted
	 * @param stackEntry - Value to be enqueued or dequeued into the queue
	 * @param fromNode - Start from node where the animation of the edge will begin
	 * @param toNode - End node where the animation of the edge will stop
	 */
	public DFSSimulationSteps(String visitedNodeName, int pseudocodeLineIndex, StackEntry stackEntry, String fromNode, String toNode) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode);
		c_stackEntry = stackEntry;
	}
}




