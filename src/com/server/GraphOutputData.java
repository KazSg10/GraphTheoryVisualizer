package com.server;

import java.util.ArrayList;
import java.util.List;

import com.algorithms.Graph;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GraphOutputData {
	@JsonProperty("Graph")
	private Graph c_graph;
	@JsonProperty("Pseudocode")
	private List<String> c_pseudoCode = new ArrayList<>(); 
	@JsonProperty("StepsList")
	private List<SimulationSteps> c_stepsList = new ArrayList<>();
	
	public GraphOutputData(Graph graph, List<String> pseudoCode) {
		c_graph = graph;
		c_pseudoCode = pseudoCode;
	}
	public List<SimulationSteps> getSimulationSteps(){
		return c_stepsList;
	}
	
	public String toJson() {
		//Creating an objectMapper to map GraphOutputData to Json
		ObjectMapper objectMapper = new ObjectMapper();
		//Creating an empty string for Json at the start
		String json = null;
		try {
			//TODO
			objectMapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
			//Converting current object to Json string 
			json = objectMapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			System.out.println(e);
		}
		return json;
	}
	
	
	


	
}
