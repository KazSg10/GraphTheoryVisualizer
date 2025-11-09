package com.algorithms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.algorithms.Edge.Direction;

/**
 * Child class of Graph, used for creating unweightedGraph objects 
 */
public class UnweightedGraph extends Graph {
	/**
	 * UnweightedGraph constructor
	 */
	public UnweightedGraph(){
		c_nodeConnections = new HashMap<Node, List<Node>>();
		c_nodesList = new ArrayList<>();
		c_edgeList = new ArrayList<Edge>();
	}
	
	/**
	 * Adding an edge to the edge's list
	 * @param edge - edge to be added to list
	 */
	public void addEdge(Edge edge){
		c_edgeList.add(edge);
		if(edge.getDirection() == Direction.BIDIRECTION) {
			c_edgeList.add(new Edge(edge.getNode2(), edge.getNode1(), edge.getDirection()));
		}
		addToNodeConnections(edge);	
	}	
}
