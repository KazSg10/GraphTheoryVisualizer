package com.server;

import com.fasterxml.jackson.annotation.JsonProperty;

public class QueueEntry{
	public enum ActionBFS{
		ENQUEUE,
		DEQUEUE
	}

	@JsonProperty("Value")
	private String c_value;
	
	@JsonProperty("Action")
	private ActionBFS c_action;

	public QueueEntry(String value, ActionBFS action) {
		
		c_value = value;
		c_action = action;
	}
}
