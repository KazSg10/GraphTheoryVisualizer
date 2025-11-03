package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BFSSimulationSteps extends SimulationSteps {
	//Stating what the Json property will be named as when the Json of the Graph data is returned
	@JsonProperty("QueueEntry")
	private QueueEntry c_queueEntry;
	public BFSSimulationSteps(String visitedNodeName, int pseudocodeLineIndex, QueueEntry queueEntry, String fromNode, String toNode ) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode );
		c_queueEntry = queueEntry;
	}
	public QueueEntry getC_queueEntry() {
		return c_queueEntry;
	}
}
