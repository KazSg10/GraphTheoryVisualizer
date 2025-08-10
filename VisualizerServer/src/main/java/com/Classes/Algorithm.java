package com.Classes;

import java.util.AbstractMap.SimpleEntry;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import com.Classes.Node;

public class Algorithm {
	public static List<Node> depthFirstTraversal(UnweightedGraph graph, Node currentNode, List<Node> visited, Stack stack ) {
		if(null == visited) {
			visited = new LinkedList<>();
		}
		if(null == stack) {
			stack = new Stack();
		}
		visited.add(currentNode);
		System.out.println("Visited->" + visited);
		stack.push(currentNode);
		System.out.println("Stack-->" + stack);

		List<Node> neighboursList = graph.getNodeConnections().get(currentNode);
		for(Node neighbouringNode: neighboursList) {
			if(!visited.contains(neighbouringNode)) {
				System.out.println("Recursing  --------------->" + neighbouringNode);
				depthFirstTraversal(graph, neighbouringNode, visited, stack);
			}
			System.out.println("Not Recursing  --------------->" + neighbouringNode);
		}
		System.out.println("Node Key Name------------------>" + currentNode.getName());
		stack.pop();
		System.out.println("Back  --------------->" + currentNode);
		return visited;
	}
	public static List<Node> BreadthFirstTraversal(UnweightedGraph graph, Node sourceNode){
		System.out.println("Traversal starting ------");	
		List<Node> visited= new LinkedList<>();
		Queue<Node> queue = new Queue<Node>();
		System.out.println("Here 1");
		queue.enqueue(sourceNode);
		System.out.println("Here 2");
		while(!queue.isEmpty())
		{
			System.out.println("Queue" + queue);
			Node currentNode = queue.dequeue();
			System.out.println("dequeued current node: " + currentNode);
			System.out.println("Here 3");
			
			
			visited.add(currentNode);
			List<Node> neighboursList = graph.getNodeConnections().get(currentNode);
			for(Node neighbouringNode: neighboursList) {
				if(!visited.contains(neighbouringNode) && !queue.contains(neighbouringNode)){
					queue.enqueue(neighbouringNode);
					System.out.println("enqueued "  + neighbouringNode.getName());
				}	
			}
			System.out.println("Visited->" + visited);
		}
		if(visited.size()!= graph.getNodesList().size()){
			System.out.println("The graph is not fully connected or there are some nodes that can't be reached");
		}
		return visited;
		
	}
	
//	public static SimpleEntry<Integer, List<Integer>> DijkstraShortestPathFinding(WeightedGraph graph, Node sourceNode){
//		Queue<DijkstraQueueData> queue = new Queue<DijkstraQueueData>();
//		List<Node> NodeList = graph.getNodesList();
//		for(Node node: NodeList) {
//			queue.enqueue(new DijkstraQueueData(node.getName()));		
//		}
//		
//		

	}
		
	
	class DijkstraQueueData{
		private String c_nodeName;
		private String c_previousNode;
		private int c_distanceFromSourceNode;
		
		public DijkstraQueueData(String nodeName) {
			c_nodeName = nodeName;
			c_previousNode = null;
			c_distanceFromSourceNode = Integer.MAX_VALUE;
		}

		public String getNodeName() {
			return c_nodeName;
		}
		public void setNodeName(String nodeName) {
			c_nodeName = nodeName;
		}
		public String getPreviousNode() {
			return c_previousNode;
		}
		public void setPreviousNode(String previousNode) {
			c_previousNode = previousNode;
		}
		public int getDistanceFromSourceNode() {
			return c_distanceFromSourceNode;
		}
		public void setDistanceFromSourceNode(int distanceFromSourceNode) {
			c_distanceFromSourceNode = distanceFromSourceNode;
		}
		
	
	}
	
