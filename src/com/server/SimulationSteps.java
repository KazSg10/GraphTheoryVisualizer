package com.server;

public abstract class SimulationSteps {
	private String c_visitedNodeName;
	private String c_pseudoCodeLine;
	
	public SimulationSteps(String visitedNodeName, String pseudoCodeLine) {
		c_visitedNodeName = visitedNodeName;
		c_pseudoCodeLine = pseudoCodeLine;
	}

	public String getC_visitedNodeName() {
		return c_visitedNodeName;
	}

	public String getC_pseudoCodeLine() {
		return c_pseudoCodeLine;
	}
	
}
