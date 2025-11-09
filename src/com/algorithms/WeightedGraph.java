package com.algorithms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import com.algorithms.Edge.Direction;

/**
 * Child class of Graph, used for creating weightedGraph objects 
 */
public class WeightedGraph extends Graph {
	/**
	 * WeightedGraph constructor
	 */
	public WeightedGraph(){
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
			c_edgeList.add(new Edge(edge.getNode2(), edge.getNode1(), edge.getDirection(), edge.getWeight()));
		}
		addToNodeConnections(edge);	
	}
	
	/**
	 * Retrieving the weight of a particular edge
	 * @param node1 - node 1 of edge
	 * @param node2 - node 2 of edge
	 * @return - Returning weight of the edge
	 */
	public int getWeight(Node node1, Node node2) {
		for(Edge edge : c_edgeList) {
			if((edge.getNode1().equals(node1)) && (edge.getNode2().equals(node2))){
				return edge.getWeight();
			}
		}
		return Integer.MAX_VALUE;
	}

//	public List<Edge> getEdgeList() {
//		return c_edgeList;
//	}	
}