package com.algorithms;

import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

//Class for creating graph objects
public abstract class Graph {
	
	//Naming the connections in Json
	@JsonProperty("NodeConnections")
	protected  Map<Node,List<Node>> nodeConnections;
	
	//Naming the list in Json
	@JsonProperty("NodesList")
	protected  List<Node> c_nodesList;
	@JsonProperty("edgeList")
	protected List<Edge> c_edgeList;

	
	public Map<Node, List<Node>> getNodeConnections() {
		return nodeConnections;
	}
	public List<Node> getNodesList(){
		
		//Returning the list of nodes in the graph
		return c_nodesList;
	}
	public abstract void addEdge(Edge edge);

//	//Converting the information of the graph object into Json for portability
//	public String toJson() {
//		//Creating an object mapper which is used to map the fields of the graph into a Json form
//		ObjectMapper objectMapper = new ObjectMapper();
//		String json = null;
//		try {
//			json = objectMapper.writeValueAsString(this);
//		} catch (JsonProcessingException e) {
//			System.out.println(e);
//		}
//		return json;
//	}
	
	public List<Node> getNodeConnections(Node inputNode) {
		for(Map.Entry<Node, List<Node>> nodeEntry: nodeConnections.entrySet()) {
			if(nodeEntry.getKey().getName().equals(inputNode.getName())){
				return nodeEntry.getValue();
			}
		}
		return null;
	}

}
