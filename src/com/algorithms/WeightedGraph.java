package com.algorithms;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.algorithms.Edge.Direction;

public class WeightedGraph extends Graph {

	private List<Edge> c_edgeList;
	public WeightedGraph(){
		c_nodeConnections = new HashMap<Node, List<Node>>();
		c_nodesList = new ArrayList<>();
		c_edgeList = new ArrayList<Edge>();
	}
	
	public void addEdge(Edge edge){
		c_edgeList.add(edge);
		if(edge.getDirection() == Direction.BIDIRECTION) {
			c_edgeList.add(new Edge(edge.getNode2(), edge.getNode1(), edge.getDirection(), edge.getWeight()));
		}
		addToNodeConnections(edge);	
	}
	
	public int getWeight(Node node1, Node node2) {
		for(Edge edge : c_edgeList) {
//			System.out.println("\tComparing " + edge.getNode1() + " with " + node1);
//			System.out.println("\tComparing " + edge.getNode2() + " with " + node2);
//			System.out.println("\tEdge: " + edge.getWeight());

			if((edge.getNode1().equals(node1)) && (edge.getNode2().equals(node2))){
				//System.out.println("\t\tFound edge weight: " + edge.getWeight());
				return edge.getWeight();
			}
		}
		return Integer.MAX_VALUE;
	}

	public List<Edge> getEdgeList() {
		return c_edgeList;
	}	
}