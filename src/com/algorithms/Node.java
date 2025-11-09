package com.algorithms;

import java.util.Objects;

/**
 * Class for creating Node objects
 */
public class Node {
	private String c_name;

	/**
	 * Node constructor
	 * @param name - Node name
	 */
	public Node(String name) {
		c_name = name;
	}

	public String getName() {
		return c_name;
	}

	@Override
	public String toString() {
		return c_name;
	}
	
	/*
	 * Following two methods are auto generated and overridden to comply with comparing nodes in the algorithm
	 */
	
	@Override
	public int hashCode() {
		return Objects.hash(c_name);
	}

	/**
	 * Overriding the equals operation so the Node objects are compared on their names, not memory locations
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Node other = (Node) obj;
		return Objects.equals(c_name, other.c_name);
	}
}
