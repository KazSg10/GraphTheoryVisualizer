package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class for creating queue entries
 */
public class StackEntry{
	public enum ActionDFS{
		PUSH,
		POP;
	}

	@JsonProperty("Value")
	private String c_value;
	
	@JsonProperty("Action")
	private ActionDFS c_action;

	/**
	 * StackEntry constructor
	 * @param value - Value to be pushed or popped 
	 * @param action - Push or pop
	 */
	public StackEntry(String value, ActionDFS action) {
		c_value = value;
		c_action = action;
	}
}