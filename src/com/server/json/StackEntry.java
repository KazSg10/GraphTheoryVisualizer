package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StackEntry{
	public enum ActionDFS{
		PUSH,
		POP;
	}

	@JsonProperty("Value")
	private String c_value;
	
	@JsonProperty("Action")
	private ActionDFS c_action;

	public StackEntry(String value, ActionDFS action) {
		c_value = value;
		c_action = action;
	}
}