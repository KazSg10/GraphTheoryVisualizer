package com.server;

import com.fasterxml.jackson.annotation.JsonProperty;

public class StackEntry{
	public enum Action{
		PUSH,
		POP;
	}

	@JsonProperty("Value")
	private String c_value;
	
	@JsonProperty("Action")
	private Action c_action;

	public StackEntry(String value, Action action) {
		c_value = value;
		c_action = action;
	}
}