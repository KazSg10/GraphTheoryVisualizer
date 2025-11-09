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
	
	/**
	 * BFSSimulationSteps constructor
	 * @param visitedNodeName - Name of visited node
	 * @param pseudocodeLineIndex - Index of the pseudocode line to be highlighted
	 * @param queueEntry - Value to be enqueued or dequeued into the queue
	 * @param fromNode - Start from node where the animation of the edge will begin
	 * @param toNode - End node where the animation of the edge will stop
	 */
	
	/**
	 * DijkstraSimulationSteps constructor
	 * @param traversedNodeName - name of node who have had the paths between itself and all of its neighbouring nodes travelled on
	 * @param visitedNodeName - Name of visited node
	 * @param pseudocodeLineIndex - Index of the pseudocode line to be highlighted
	 * @param fromNode - Start from node where the animation of the edge will begin
	 * @param toNode - End node where the animation of the edge will stop
	 * @param newDistance - New calculated shortest distance
	 * @param newPreviousNode - New previous node after a change in distance
	 * @param nodeOfPath - Node for which the shortest path from the source node is for
	 * @param path - Shortest path of nodes between nodeOfPath and source node
	 */
	public DijkstraSimulationSteps(String traversedNodeName, String visitedNodeName, int pseudocodeLineIndex, String fromNode, String toNode, int newDistance, String newPreviousNode, String nodeOfPath, String path) {
		super(visitedNodeName, pseudocodeLineIndex, fromNode, toNode);

		c_traversedNodeName = traversedNodeName;
		c_newDistance = newDistance;
		c_newPreviousNode = newPreviousNode;
		c_nodeOfPath = nodeOfPath;
		c_path = path;
	}
}





