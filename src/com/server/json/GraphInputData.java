package com.server.json;

import java.util.ArrayList;
import java.util.List;

import com.algorithms.Node;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

/*
 * Class used to split up the json from the browser into the different components
 * The JsonProperty annotations instruct which values of the json should be mapped to which field
 */

//Whatever values are unknown are ignored
@JsonIgnoreProperties(ignoreUnknown = true)
public class GraphInputData {
	@JsonProperty("algorithm")
	private String algorithm;
	
	@JsonProperty("connections")
	private List<ConnectionData> connections = new ArrayList<>();

	public String getAlgorithm() {
		return algorithm;
	}
	
	@JsonProperty("source node")
	private String sourceNodeName;

	public void setAlgorithm(String algorithm) {
		this.algorithm = algorithm;
	}

	public List<ConnectionData> getConnections() {
		return connections;
	}

	public void setConnections(List<ConnectionData> connections) {
		this.connections = connections;
	}

	public String getSourceNodeName() {
		return sourceNodeName;
	}

	public static class ConnectionData{
		@JsonProperty("Node 1")
		private String node1;
		
		@JsonProperty("Node 2")
		private String node2;
		
		@JsonProperty("Edge Direction")
		private String edgeDirection;
		
		@JsonProperty("Edge Weight")
		private String weight;
		
		
		public String getNode1() {
			return node1;
		}
		public void setNode1(String node1) {
			this.node1 = node1;
		}
		public String getNode2() {
			return node2;
		}
		public void setNode2(String node2) {
			this.node2 = node2;
		}
		public String getEdgeDirection() {
			return edgeDirection;
		}
		public void setEdgeDirection(String edgeDirection) {
			this.edgeDirection = edgeDirection;
		}
		public String getWeight() {
			return weight;
		}
		public void setWeight(String weight) {
			this.weight = weight;
		}
	}

}



