package com.server.json;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Class for creating queue entries
 */
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