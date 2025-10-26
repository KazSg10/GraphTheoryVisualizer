package com.algorithms;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

import com.algorithms.Edge.Direction;
import com.server.json.BFSSimulationSteps;
import com.server.json.DFSSimulationSteps;
import com.server.json.GraphOutputData;
import com.server.json.QueueEntry;
import com.server.json.StackEntry;
import com.server.json.QueueEntry.ActionBFS;
import com.server.json.StackEntry.ActionDFS;

import Practice.DijkstraPractice.DijkstraQueueNode;



public class Algorithm {
	private GraphOutputData c_graphOutputData;
	public Algorithm(GraphOutputData graphOutputData) {
		c_graphOutputData = graphOutputData;
		
	}
	public static void main(String[] args) {

		WeightedGraph graph = new WeightedGraph();
		Node sourceNode = new Node("1");
		graph.addEdge(new Edge(sourceNode, new Node("2"), Direction.BIDIRECTION, 10));
		graph.addEdge(new Edge(new Node("4"), new Node("2"), Direction.BIDIRECTION, 15));
		graph.addEdge(new Edge(new Node("2"), new Node("5"), Direction.BIDIRECTION, 13));
		graph.addEdge(new Edge(new Node("7"), new Node("6"), Direction.BIDIRECTION, 7));
		graph.addEdge(new Edge(new Node("6"), new Node("3"), Direction.BIDIRECTION, 5));
		graph.addEdge(new Edge(sourceNode, new Node("8"), Direction.BIDIRECTION, 11));
		graph.addEdge(new Edge(new Node("6"), new Node("5"), Direction.BIDIRECTION, 19));
		graph.addEdge(new Edge(new Node("7"), new Node("5"), Direction.BIDIRECTION, 16));
		graph.addEdge(new Edge(sourceNode, new Node("6"), Direction.BIDIRECTION, 3));
		DijkstraShortestPathFinding(graph, sourceNode);
		
		
	 }
	
	public List<Node> depthFirstTraversal(UnweightedGraph graph, Node currentNode, List<Node> visited, Stack stack ) {
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "SUB depthFirstTraversal(graph, currentNode, visitedList, stack )", null, null, null));
		if(null == visited) {
			visited = new LinkedList<>();
		}
		if(null == stack) {
			stack = new Stack();
		}
		visited.add(currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(currentNode.getName(), "append currentNode to visitedList", null, null, null));

		System.out.println("Visited->" + visited);
		stack.push(currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "push currentNode on to stack", new StackEntry(currentNode.getName(), ActionDFS.PUSH), null, null));
		System.out.println("Stack-->" + stack);
		List<Node> neighboursList = graph.getNodeConnections(currentNode);
		for(Node neighbouringNode: neighboursList) {
			c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "FOREACH(neighbouring node of currentNode)", null, null, null));
			
			if(!visited.contains(neighbouringNode)) {
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "IF neighbouring node NOT in visitedList THEN", null, null, null));

				System.out.println("Recursing  --------------->" + neighbouringNode);
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "depthFirstTraversal(graph, currentNode, visitedList, stack)",null, currentNode.getName(), neighbouringNode.getName()));
				depthFirstTraversal(graph, neighbouringNode, visited, stack);
			}
			c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDIF", null, null, null));

			
			System.out.println("Not Recursing  --------------->" + neighbouringNode);
		}
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDFOREACH", null, null, null));

		System.out.println("Node Key Name------------------>" + currentNode.getName());
		Node poppedNode = stack.pop();
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "pop currentNode from stack", new StackEntry(poppedNode.getName(), ActionDFS.POP), poppedNode.getName(), stack.peek()!=null ? stack.peek().getName() : null));
		System.out.println("Back  --------------->" + currentNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "RETURN visitedList", null, null, null));
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDSUB", null, null, null));
		return visited;
	}
//	String visitedNodeName,
//	String pseudoCodeLine,
//	StackEntry queueEntry,
//	String fromNode,
//	String toNode
	
	public  List<Node> BreadthFirstTraversal(UnweightedGraph graph, Node sourceNode){
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "Sub BreadthFirstTraversal(graph, sourceNode)", null, null, null));	
		List<Node> visited= new LinkedList<>();
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "visited= []", null, null, null));	

		Queue<Node> queue = new Queue<Node>();
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "queue =[]", null, null, null));
		
		queue.enqueue(sourceNode);
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "enqueue sourceNode in queue",	new QueueEntry(sourceNode.getName(), ActionBFS.ENQUEUE), null, null));

		System.out.println("Here 2");
		while(!queue.isEmpty())
		{
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "while queue is NOT empty",	null, null, null));

			System.out.println("Queue" + queue);
			Node currentNode = queue.dequeue();
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "currentNode <- dequeue node from queue",new QueueEntry(currentNode.getName(), ActionBFS.DEQUEUE), null, null ));

			System.out.println("dequeued current node: " + currentNode);
			System.out.println("Here 3");
			
			
			visited.add(currentNode);
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "append currentNode to visited", null, null, null));

			List<Node> neighboursList = graph.getNodeConnections(currentNode);
			for(Node neighbouringNode: neighboursList) {
				System.out.println("In for loop");
				c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "FOREACH(neighbouring node of currentNode)", null, null, null));

				if(!visited.contains(neighbouringNode) && !queue.contains(neighbouringNode)){
					c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "IF(visited NOT contains node && queue NOT contains node)", null, null, null));
					queue.enqueue(neighbouringNode);
					c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "enqueue node to queue", 
							new QueueEntry(currentNode.getName(), ActionBFS.ENQUEUE), currentNode.getName(), neighbouringNode.getName()));
					System.out.println("enqueued "  + neighbouringNode.getName());
				}
				c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "ENDIF", null, null, null));
			}
			System.out.println("Visited->" + visited);
		}
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "ENDWHILE", null, null, null));
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "return visited", null, null, null));
		c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "ENDSUB", null, null, null));

		return visited;

	}
	@SuppressWarnings("unused")
	public static void DijkstraShortestPathFinding(WeightedGraph graph, Node sourceNode){
		
		//Creating a priority queue for the nodes
		
		Queue<DijkstraQueueNode> priorityQueue = new Queue<DijkstraQueueNode>();
		List<DijkstraQueueNode> currentNodesList = new ArrayList<DijkstraQueueNode>();
		
		//Retrieving the list of nodes in the graph
		List<Node> NodeList = graph.getNodesList();
		for(Node node: NodeList){
			System.out.println(node + " -> " + graph.getNodeConnections(node));
			/*
			 * If the node is not the source node, then the boolean value will be set to false, otherwise it will be set to true
			 * Depending on this, the distance from the source node field will be altered
			 */
			
			if(node!=sourceNode){
				priorityQueue.enqueue(new DijkstraQueueNode(node, false));
 				System.out.println("PriorityQueue --->  " + priorityQueue);
			}else{		
				priorityQueue.enqueue(new DijkstraQueueNode(sourceNode, true));
				System.out.println("PriorityQueue --->  " + priorityQueue.toString());
			}
		}
		
		/*
		 * Trying to find the DijkstraQueueNode in the priority queue with the shortest distance from the source node
		 * In the first pass, this node will be the DijkstraQueueNode of the source node itself
		 */
		
		while(true) {
			int distance = Integer.MAX_VALUE;
			DijkstraQueueNode currentNode = null;
			for(DijkstraQueueNode node: priorityQueue.getList()) {
				if(!currentNodesList.contains(node) && node.getDistanceFromSourceNode() < distance) {
					distance = node.getDistanceFromSourceNode();
					currentNode = node;
				}
				
			}
			
		
			/*
			 * For each node (neighbouringNode), for which there is a path from the currentNode, we are calculating the shortest distance from the current node
			 * to that node  
			 */
			if(currentNode!=null) {
				System.out.println("currentNode ----> " + currentNode.getNode());

				for(Node neighbouringNode: graph.getNodeConnections(currentNode.getNode())) {
					
					//Adding the current distance to the weight of the edge between the neighbouringNode and the currentNode to calculate a new alternate distance
					int alternateDistance = currentNode.getDistanceFromSourceNode() + graph.getWeight(currentNode.getNode(), neighbouringNode);
					
					DijkstraQueueNode dijkstraNeighbouringNode = null;
					
					//Iterating through the priorityQueue to retrieve the node equal to the neighbouringNode
					for(DijkstraQueueNode nodeInPriorityQueue : priorityQueue.getList())
						if(nodeInPriorityQueue.getNode().equals(neighbouringNode)) {
							
							//Now that the required node has been found, it has been stored in dijkstraNeighbouringNode
							dijkstraNeighbouringNode = nodeInPriorityQueue;
							break;
						}
						
						/*
						 * If the alternate distance is less than the current distance of the dijkstraNeighbouringNode,
						 * then current distance will be replaced with this alternate distance
						 * Now this new distance is the shortest distance
						 */
						if(alternateDistance < dijkstraNeighbouringNode.getDistanceFromSourceNode() && alternateDistance>0) {
							dijkstraNeighbouringNode.changeDistanceFromSourceNode(alternateDistance);
							
							//Updating the previous node to the currentNode since this is the previous node in this new shortest path
							dijkstraNeighbouringNode.changePreviousNode(currentNode); 
							System.out.println("PriorityQueue ---> " + priorityQueue.toString());
						}
					
					}
				currentNodesList.add(currentNode);

			}else {
				for(DijkstraQueueNode queueNode: currentNodesList){
					String path = "";
					System.out.println(queueNode.getNode().getName() + ":");
					System.out.println(createPath(queueNode, sourceNode, path));
				} 
				break;
			}
			
		}
	}
	
	//Recursive subroutine to create the shortest path for each node from the source node	
	public static String createPath(DijkstraQueueNode node, Node sourceNode, String path) {
		
		if(node.getNode() == sourceNode) {
			return sourceNode.getName();
		}
		
		else {
			
			if(node.getDistanceFromSourceNode() == Integer.MAX_VALUE) {
				System.out.println(node.getNode().getName() + " is unreachable");	
			}else{
				path = node.getNode().getName();
			}
			System.out.println(path);
			
			return createPath(node.getPreviousNode(), sourceNode, path) + " -> " + path;
		}	
			
			
	
	}
	
	
	

	//Creating special nodes called DijkstraQueueNodes which will be used to store nodes in the priority queue along with their distance from source node
	
	public static class DijkstraQueueNode{
		
		private Node c_node;
		private DijkstraQueueNode c_previousNode;
		private int c_distanceFromSourceNode;

		/*
		 * If the node is the source node, then the distance from the source node will be 0, otherwise it will be set to the largest integer to denote infinity,
		 * which will represent that a shortest distance has not been found yet
		 */
		public DijkstraQueueNode(Node node, Boolean sourceNode) {
			c_previousNode = null;
			c_distanceFromSourceNode = sourceNode? 0 : Integer.MAX_VALUE;
			c_node = node;

		}

		
		public DijkstraQueueNode getPreviousNode() {
			return c_previousNode;
		}
		public void setPreviousNode(DijkstraQueueNode previousNode) {
			c_previousNode = previousNode;
		}
		public int getDistanceFromSourceNode() {
			return c_distanceFromSourceNode;
		}
		public void setDistanceFromSourceNode(int distanceFromSourceNode) {
			c_distanceFromSourceNode = distanceFromSourceNode;
		}
		public Node getNode() {
			return c_node;
		}
		public void changeDistanceFromSourceNode(int newDistance) {
			c_distanceFromSourceNode = newDistance;
		}
		public void changePreviousNode(DijkstraQueueNode node) {
			c_previousNode = node;
		}
		
		@Override 
		public String toString() {
			return c_node.toString() + ":" + c_distanceFromSourceNode;
		}
	}

}
	
