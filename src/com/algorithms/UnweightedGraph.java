package com.algorithms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.algorithms.Edge.Direction;

public class UnweightedGraph extends Graph {	
	public UnweightedGraph(){
		c_nodeConnections = new HashMap<Node, List<Node>>();
		c_nodesList = new ArrayList<>();
		c_edgeList = new ArrayList<Edge>();
	}
	
	public void addEdge(Edge edge){
		c_edgeList.add(edge);
		if(edge.getDirection() == Direction.BIDIRECTION) {
			c_edgeList.add(new Edge(edge.getNode2(), edge.getNode1(), edge.getDirection()));
		}
		addToNodeConnections(edge);	
	}	
}
