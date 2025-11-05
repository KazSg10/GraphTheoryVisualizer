package com.server.json;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

//Class with fields that are mapped to json, which help the browser to piece together the step by step simulation for the user
public abstract class SimulationSteps {
	@JsonProperty("VisitedNodeName")
	private String c_visitedNodeName;
	
	//Index of Pseudocode line in the Pseudocode txt file
	@JsonProperty("PseudocodeLineIndex")
	private int c_PseudocodeLineIndex;
	
	@JsonProperty("FromNode")
	private String c_fromNode;
	
	@JsonProperty("ToNode")
	private String c_toNode;
	
	public SimulationSteps(String visitedNodeName, int PseudocodeLineIndex, String fromNode, String toNode) {
		c_visitedNodeName = visitedNodeName;
		c_PseudocodeLineIndex = PseudocodeLineIndex;
		c_fromNode = fromNode;
		c_toNode = toNode;
	}

	public String getC_visitedNodeName() {
		return c_visitedNodeName;
	}

	public int getC_PseudocodeLineIndex() {
		return c_PseudocodeLineIndex;
	}	
}
