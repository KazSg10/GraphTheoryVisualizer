package com.algorithms;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Super abstract class for creating graphs 
 */
public abstract class Graph {
	@JsonProperty("NodeConnections")
	protected  Map<Node,List<Node>> c_nodeConnections;
	
	@JsonProperty("NodesList")
	protected  List<Node> c_nodesList;
	
	@JsonProperty("edgeList")
	protected List<Edge> c_edgeList;

	public Map<Node, List<Node>> getNodeConnections() {
		return c_nodeConnections;
	}
	
	/**
	 * Getting the list of all the nodes in a graph
	 * @return - Returning the list of the nodes in the graph
	 */
	public List<Node> getNodesList(){
		return c_nodesList;
	}
	
	/**
	 * Adding an edge to the graph
	 * @param edge - Edge to be added
	 */
	public abstract void addEdge(Edge edge);

	/**
	 * Returning the neighbours of a node in the graph
	 * @param inputNode - Node of which we need the neighbours
	 * @return - Returning the neighbours of inputNode
	 */
	public List<Node> getNodeConnections(Node inputNode) {
		for(Map.Entry<Node, List<Node>> nodeEntry: c_nodeConnections.entrySet()) {
			if(nodeEntry.getKey().getName().equals(inputNode.getName())){
				return nodeEntry.getValue();
			}
		}
		return null;
	}
	public void addToNodeConnections(Edge edge) {
		Node node1 = edge.getNode1();
		Node node2 = edge.getNode2();
		
		if(!c_nodesList.contains(node1)) {
			c_nodesList.add(node1);
		}
		if(!c_nodesList.contains(node2)) {
			c_nodesList.add(node2);
		}
		
		switch(edge.getDirection()) {
		case BIDIRECTION:
			if(c_nodeConnections.containsKey(node1)){
				List<Node> neighbours = c_nodeConnections.get(node1);
				neighbours.add(node2);
			} else {
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.add(node2);
				c_nodeConnections.put(node1, neighbours);
			}
			
			if(c_nodeConnections.containsKey(node2)) {
				List<Node> neighbours = c_nodeConnections.get(node2);
				neighbours.add(node1);
			} else {
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.add(node1);
				c_nodeConnections.put(node2, neighbours);
			}
			break;
		
		case UNIDIRECTION:
			if(c_nodeConnections.containsKey(node1)) {
				List<Node> neighbours = c_nodeConnections.get(node1);
				neighbours.add(node2);
			} else {
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.add(node2);
				c_nodeConnections.put(node1, neighbours);
			}
		}
	}
}
