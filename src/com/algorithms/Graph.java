package com.algorithms;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public abstract class Graph {
	@JsonProperty("NodeConnections")
	protected  Map<Node,List<Node>> nodeConnections;
	@JsonProperty("NodesList")
	protected  List<Node> c_nodesList;
	protected List<Edge> c_edgeList;

	
	public Map<Node, List<Node>> getNodeConnections() {
		return nodeConnections;
	}
	public List<Node> getNodesList(){
		return c_nodesList;
	}
	public abstract void addConnection(Edge edge);
//	public boolean routeFromSourceNodeToNode(Node sourceNode) {
//		List<Node> hasRouteFromSourceNode = new ArrayList<Node>(); 
//		for(Node node: c_nodesList) {
//			
//		}
//	}
	public String toJson() {
		ObjectMapper objectMapper = new ObjectMapper();
		String json = null;
		try {
			json = objectMapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			System.out.println(e);
		}
		return json;
	}

}
