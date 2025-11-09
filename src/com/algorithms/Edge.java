package com.algorithms;

/**
 * Class for creating edges between the nodes
 */
public class Edge {
	public enum Direction{
		BIDIRECTION,
		UNIDIRECTION;	
	}
	
	private Node c_node1;
	private Node c_node2;
	private Direction c_direction;
	private int c_weight;
	
	/**
	 * Edge constructor for weighted graph
	 * @param node1 - First node on the edge
	 * @param node2 - Second node on the edge
	 * @param direction - Direction of edge
	 * @param weight - Weight of edge 
	 */
	public Edge(Node node1, Node node2, Direction direction, int weight) {
		c_node1 = node1;
		c_node2 = node2;
		c_direction = direction;
		c_weight = weight;
	}
	
	/**
	 * Edge constructor for unweighted graph
	 * @param node1 - First node on the edge
	 * @param node2 - Second node on the edge
	 * @param direction - Direction of edge
	 */
	public Edge(Node node1, Node node2, Direction direction) {
		c_node1 = node1;
		c_node2 = node2;
		c_direction = direction;
	}
	public Node getNode1() {
		return c_node1;
	}
	public Node getNode2() {
		return c_node2;
	}
	public Direction getDirection() {
		return c_direction;
	}
	public int getWeight() {
		return c_weight;
	}
}
