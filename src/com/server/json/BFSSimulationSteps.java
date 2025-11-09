package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Child class of SimulationSteps, used for creating simulation steps for BFS algorithm
 */
public class BFSSimulationSteps extends SimulationSteps {
	@JsonProperty("QueueEntry")
	private QueueEntry c_queueEntry;
	/**
	 * BFSSimulationSteps constructor
	 * @param visitedNodeName - Name of visited node
	 * @param pseudocodeLineIndex - Index of the pseudocode line to be highlighted
	 * @param queueEntry - Value to be enqueued or dequeued into the queue
	 * @param fromNode - Start from node where the animation of the edge will begin
	 * @param toNode - End node where the animation of the edge will stop
	 */
	public BFSSimulationSteps(String visitedNodeName, int pseudocodeLineIndex, QueueEntry queueEntry, String fromNode, String toNode ) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode );
		c_queueEntry = queueEntry;
	}
}
