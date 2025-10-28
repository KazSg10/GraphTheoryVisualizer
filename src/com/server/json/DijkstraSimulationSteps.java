package com.server.json;
import com.fasterxml.jackson.annotation.JsonProperty;

public class DijkstraSimulationSteps extends SimulationSteps{
	@JsonProperty("VisitedNodesEntry")
	private String c_visitedNodeName;
	
	@JsonProperty("NewDistance")
	private int c_newDistance;
	
	@JsonProperty("NewPreviousNode")
	private String c_newPreviousNode;

	@JsonProperty("NodeOfPath")
	private String c_nodeOfPath;
	
	@JsonProperty("Path")
	private String c_path;
	
	public DijkstraSimulationSteps(String visitedNodeName, String pseudoCodeLine, String fromNode, String toNode, int newDistance, String newPreviousNode, String nodeOfPath, String path) {
		super(visitedNodeName, pseudoCodeLine, fromNode, toNode);

		c_visitedNodeName = visitedNodeName;
		c_newDistance = newDistance;
		c_newPreviousNode = newPreviousNode;
		c_nodeOfPath = nodeOfPath;
		c_path = path;
	}
}





