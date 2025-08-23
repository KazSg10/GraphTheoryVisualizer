package com.server;

public class StackEntry{
	public enum Action{
		PUSH,
		POP;
	}
	private String c_value;
	private Action c_action;

	public StackEntry(String value, Action action) {
		c_value = value;
		c_action = action;
	}
}