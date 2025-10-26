package com.algorithms;

import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Node {
	@JsonProperty("Name")
	private String c_name;

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
