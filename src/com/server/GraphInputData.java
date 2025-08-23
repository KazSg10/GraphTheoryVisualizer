package com.server;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GraphInputData {
	@JsonProperty("algorithm")
	private String algorithm;
	
	@JsonProperty("connections")
	private List<ConnectionData> connections = new ArrayList<>();

	public String getAlgorithm() {
		return algorithm;
	}

	public void setAlgorithm(String algorithm) {
		this.algorithm = algorithm;
	}

	public List<ConnectionData> getConnections() {
		return connections;
	}

	public void setConnections(List<ConnectionData> connections) {
		this.connections = connections;
	}

	static class ConnectionData{
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



