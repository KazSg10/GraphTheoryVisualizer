package com.algorithms;

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
	
}
