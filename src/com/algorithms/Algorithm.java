package com.algorithms;

import java.util.AbstractMap.SimpleEntry;
import java.util.LinkedList;
import java.util.List;

import com.server.DFSSimulationSteps;
import com.server.GraphOutputData;
import com.server.StackEntry;
import com.server.StackEntry.Action;



public class Algorithm {
	private GraphOutputData c_graphOutputData;
	public Algorithm(GraphOutputData graphOutputData) {
		c_graphOutputData = graphOutputData;
		
	}
	
	public List<Node> depthFirstTraversal(UnweightedGraph graph, Node currentNode, List<Node> visited, Stack stack ) {
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "SUB depthFirstTraversal(graph, currentNode, visitedList, stack )", null));
		if(null == visited) {
			visited = new LinkedList<>();
		}
		if(null == stack) {
			stack = new Stack();
		}
		visited.add(currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(currentNode.getName(), "append currentNode to visitedList", null));

		System.out.println("Visited->" + visited);
		stack.push(currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "push currentNode on to stack", new StackEntry(currentNode.getName(), Action.PUSH)));
		System.out.println("Stack-->" + stack);
		List<Node> neighboursList = graph.getNodeConnections(currentNode);
		for(Node neighbouringNode: neighboursList) {
			c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "FOREACH(neighbouring node of currentNode)", null));
			
			if(!visited.contains(neighbouringNode)) {
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "IF neighbouring node NOT in visitedList THEN", null));

				//System.out.println("Recursing  --------------->" + neighbouringNode);
				depthFirstTraversal(graph, neighbouringNode, visited, stack);
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "depthFirstTraversal(graph, currentNode, visitedList, stack)", null));

			}
			c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDIF", null));

			
			System.out.println("Not Recursing  --------------->" + neighbouringNode);
		}
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDFOREACH", null));

		System.out.println("Node Key Name------------------>" + currentNode.getName());
		Node poppedNode = stack.pop();
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "pop currentNode from stack", new StackEntry(poppedNode.getName(), Action.POP)));
		System.out.println("Back  --------------->" + currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "RETURN visitedList", null));
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDSUB", null));
		return visited;
	}
	
	public  List<Node> BreadthFirstTraversal(UnweightedGraph graph, Node sourceNode){
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
	
//	public SimpleEntry<Integer, List<Integer>> DijkstraShortestPathFinding(WeightedGraph graph, Node sourceNode){
//		Queue<DijkstraQueueNode> priorityQueue = new Queue<DijkstraQueueNode>();
//		List<Node> NodeList = graph.getNodesList();
//		for(Node node: NodeList) {
//			if(!(node==sourceNode)) {
//				priorityQueue.enqueue(new DijkstraQueueNode(node.getName()));		
//			}
//		}	
//	}
//		
//	
//	class DijkstraQueueNode{
//		private String c_nodeName;
//		private String c_previousNode;
//		private int c_distanceFromSourceNode;
//		
//		public DijkstraQueueNode(String nodeName) {
//			c_nodeName = nodeName;
//			c_previousNode = null;
//			c_distanceFromSourceNode = Integer.MAX_VALUE;
//		}
//
//		public String getNodeName() {
//			return c_nodeName;
//		}
//		public void setNodeName(String nodeName) {
//			c_nodeName = nodeName;
//		}
//		public String getPreviousNode() {
//			return c_previousNode;
//		}
//		public void setPreviousNode(String previousNode) {
//			c_previousNode = previousNode;
//		}
//		public int getDistanceFromSourceNode() {
//			return c_distanceFromSourceNode;
//		}
//		public void setDistanceFromSourceNode(int distanceFromSourceNode) {
//			c_distanceFromSourceNode = distanceFromSourceNode;
//		}
//	}
}
	
