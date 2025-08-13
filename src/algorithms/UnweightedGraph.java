package com.Classes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class UnweightedGraph extends Graph {
	private final Map<Node,List<Node>> nodeConnections;
	private final List<Node> c_nodesList;
	
	public UnweightedGraph(){
		nodeConnections = new HashMap<Node, List<Node>>();
		c_nodesList = new ArrayList<>();
	}
	
	public Map<Node, List<Node>> getNodeConnections() {
		return nodeConnections;
	}
	

	public void addConnection(Edge edge){
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
			if(nodeConnections.containsKey(node1)){
				List<Node> neighbours = nodeConnections.get(node1);
				neighbours.add(node2);
			} else {
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.add(node2);
				nodeConnections.put(node1, neighbours);
			}
			
			if(nodeConnections.containsKey(node2)) {
				List<Node> neighbours = nodeConnections.get(node2);
				neighbours.add(node1);
			} else {
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.add(node1);
				nodeConnections.put(node2, neighbours);
			}
			break;
		
		case UNIDIRECTION:
			if(nodeConnections.containsKey(node1)) {
				List<Node> neighbours = nodeConnections.get(node1);
				neighbours.add(node2);
			} else {
				List<Node> neighbours = new ArrayList<Node>();
				neighbours.add(node2);
				nodeConnections.put(node1, neighbours);
			}
		}
	}
}
