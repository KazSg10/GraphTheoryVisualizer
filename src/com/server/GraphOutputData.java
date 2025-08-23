package com.server;

import java.util.ArrayList;
import java.util.List;

import com.algorithms.Graph;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class GraphOutputData {
	private Graph c_graph;
	private List<String> c_pseudoCode = new ArrayList<>(); 
	private List<SimulationSteps> c_stepsList = new ArrayList<>();
	
	public GraphOutputData(Graph graph, List<String> pseudoCode) {
		c_graph = graph;
		c_pseudoCode = pseudoCode;
	}
	public List<SimulationSteps> getSimulationSteps(){
		return c_stepsList;
	}
	
	public String toJson() {
		ObjectMapper objectMapper = new ObjectMapper();
		String json = null;
		try {
			objectMapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
			json = objectMapper.writeValueAsString(this);
		} catch (JsonProcessingException e) {
			System.out.println(e);
		}
		return json;
	}
	
	
	


	
}
