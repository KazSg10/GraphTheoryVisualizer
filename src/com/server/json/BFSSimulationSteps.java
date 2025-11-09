package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Child class of SimulationSteps, used for creating simulation steps for BFS algorithm
 */
public class BFSSimulationSteps extends SimulationSteps {
	@JsonProperty("QueueEntry")
	private QueueEntry c_queueEntry;
	
	public BFSSimulationSteps(String visitedNodeName, int pseudocodeLineIndex, QueueEntry queueEntry, String fromNode, String toNode ) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode );
		c_queueEntry = queueEntry;
	}
//	public QueueEntry getC_queueEntry() {
//		return c_queueEntry;
//	}
}
