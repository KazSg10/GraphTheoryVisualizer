package com.algorithms;

import java.util.LinkedList;
import java.util.List;

import com.server.json.BFSSimulationSteps;
import com.server.json.DFSSimulationSteps;
import com.server.json.GraphOutputData;
import com.server.json.QueueEntry;
import com.server.json.StackEntry;
import com.server.json.QueueEntry.ActionBFS;
import com.server.json.StackEntry.ActionDFS;



public class Algorithm {
	private GraphOutputData c_graphOutputData;
	public Algorithm(GraphOutputData graphOutputData) {
		c_graphOutputData = graphOutputData;
		
	}
	
	public List<Node> depthFirstTraversal(UnweightedGraph graph, Node currentNode, List<Node> visited, Stack stack ) {
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "SUB depthFirstTraversal(graph, currentNode, visitedList, stack )", null, null));
		if(null == visited) {
			visited = new LinkedList<>();
		}
		if(null == stack) {
			stack = new Stack();
		}
		visited.add(currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(currentNode.getName(), "append currentNode to visitedList", null, null));

		System.out.println("Visited->" + visited);
		stack.push(currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "push currentNode on to stack", new StackEntry(currentNode.getName(), ActionDFS.PUSH), null));
		System.out.println("Stack-->" + stack);
		List<Node> neighboursList = graph.getNodeConnections(currentNode);
		for(Node neighbouringNode: neighboursList) {
			c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "FOREACH(neighbouring node of currentNode)", null, null));
			
			if(!visited.contains(neighbouringNode)) {
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "IF neighbouring node NOT in visitedList THEN", null, null));

				System.out.println("Recursing  --------------->" + neighbouringNode);
				depthFirstTraversal(graph, neighbouringNode, visited, stack);
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "depthFirstTraversal(graph, currentNode, visitedList, stack)", null, null));

			}
			c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDIF", null, null));

			
			System.out.println("Not Recursing  --------------->" + neighbouringNode);
		}
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDFOREACH", null, null));

		System.out.println("Node Key Name------------------>" + currentNode.getName());
		Node poppedNode = stack.pop();
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "pop currentNode from stack", new StackEntry(poppedNode.getName(), ActionDFS.POP), stack.peek()!=null ? stack.peek().getName() : null));
		System.out.println("Back  --------------->" + currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "RETURN visitedList", null, null));
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDSUB", null, null));
		return visited;
	}
	
	public  List<Node> BreadthFirstTraversal(UnweightedGraph graph, Node sourceNode){
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "Sub BreadthFirstTraversal(graph, sourceNode)", null));	
		List<Node> visited= new LinkedList<>();
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "visited= []", null));	

		Queue<Node> queue = new Queue<Node>();
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "queue =[]", null));
		
		queue.enqueue(sourceNode);
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "enqueue sourceNode in queue",	new QueueEntry(sourceNode.getName(), ActionBFS.ENQUEUE)));

		System.out.println("Here 2");
		while(!queue.isEmpty())
		{
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "while queue is NOT empty",	null));

			System.out.println("Queue" + queue);
			Node currentNode = queue.dequeue();
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "currentNode <- dequeue node from queue",new QueueEntry(currentNode.getName(), ActionBFS.DEQUEUE)));

			System.out.println("dequeued current node: " + currentNode);
			System.out.println("Here 3");
			
			
			visited.add(currentNode);
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "append currentNode to visited", null));

			List<Node> neighboursList = graph.getNodeConnections(currentNode);
			for(Node neighbouringNode: neighboursList) {
				System.out.println("In for loop");
				c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "FOREACH(neighbouring node of currentNode)", null));

				if(!visited.contains(neighbouringNode) && !queue.contains(neighbouringNode)){
					c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "IF(visited NOT contains node && queue NOT contains node)", null));
					
					queue.enqueue(neighbouringNode);
					c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "ENDIF", null));

					System.out.println("enqueued "  + neighbouringNode.getName());
				}
				c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "enqueue node to queue", new QueueEntry(currentNode.getName(), ActionBFS.ENQUEUE)));

			}
			System.out.println("Visited->" + visited);
		}
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "ENDWHILE", null));

		if(visited.size()!= graph.getNodesList().size()){
			System.out.println("The graph is not fully connected or there are some nodes that can't be reached");
		}
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "return visited", null));
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
	
