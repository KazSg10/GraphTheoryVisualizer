package com.Classes;


public class Edge {
	public enum Direction{
		BIDIRECTION(0),
		UNIDIRECTION(1);

		int c_direction;

		Direction(int direction){
			c_direction = direction;
		}   		int getDirection() {
			return c_direction;
		}
		public static Direction fromId(int id) {
			for (Direction type: values()) {
				if(type.getDirection() == id) {
					return type;
				}
			}	
			return null;
		}
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
