package com.server.json;
import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Child class of SimulationSteps, used for creating simulation steps for Dijkstra's algorithm
 */
public class DijkstraSimulationSteps extends SimulationSteps{

	@JsonProperty("TraversedNodeName")
	private String c_traversedNodeName;
	
	@JsonProperty("NewDistance")
	private int c_newDistance;
	
	@JsonProperty("NewPreviousNode")
	private String c_newPreviousNode;

	@JsonProperty("NodeOfPath")
	private String c_nodeOfPath;
	
	@JsonProperty("Path")
	private String c_path;
	
	
	public DijkstraSimulationSteps(String traversedNodeName, String visitedNodeName, int pseudocodeLineIndex, String fromNode, String toNode, int newDistance, String newPreviousNode, String nodeOfPath, String path) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode);

		c_traversedNodeName = traversedNodeName;
		c_newDistance = newDistance;
		c_newPreviousNode = newPreviousNode;
		c_nodeOfPath = nodeOfPath;
		c_path = path;
	}
}





