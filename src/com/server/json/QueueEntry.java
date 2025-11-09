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

	/**
	 * QueueEntry constructor
	 * @param value - Value to be enqueued or dequeued
	 * @param action - Enqueue or dequeue
	 */
	public QueueEntry(String value, ActionBFS action) {	
		c_value = value;
		c_action = action;
	}
}