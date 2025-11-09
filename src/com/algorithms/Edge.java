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
	
	public Edge(Node node1, Node node2, Direction direction, int weight) {
		c_node1 = node1;
		c_node2 = node2;
		c_direction = direction;
		c_weight = weight;
	}
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
