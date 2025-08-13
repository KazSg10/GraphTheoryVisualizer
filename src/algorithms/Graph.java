package com.Classes;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public abstract class Graph {
	private  Map<Node,List<Node>> nodeConnections;
	private  List<Node> c_nodesList;
	
	public Map<Node, List<Node>> getNodeConnections() {
		return nodeConnections;
	}
	public List<Node> getNodesList(){
		return c_nodesList;
	}
	public abstract void addConnection(Edge edge);
	

}
