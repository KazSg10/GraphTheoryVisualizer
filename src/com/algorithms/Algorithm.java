package com.algorithms;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import com.algorithms.Edge.Direction;
import com.server.json.BFSSimulationSteps;
import com.server.json.DFSSimulationSteps;
import com.server.json.DijkstraSimulationSteps;
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
	
	public static void main(String[] args) {
		
//		WeightedGraph graph = new WeightedGraph();
//		Node sourceNode = new Node("1");
//		graph.addEdge(new Edge(sourceNode, new Node("2"), Direction.BIDIRECTION, 10));
//		graph.addEdge(new Edge(new Node("4"), new Node("2"), Direction.BIDIRECTION, 15));
//		graph.addEdge(new Edge(new Node("2"), new Node("5"), Direction.BIDIRECTION, 13));
//		graph.addEdge(new Edge(new Node("7"), new Node("6"), Direction.BIDIRECTION, 7));
//		graph.addEdge(new Edge(new Node("6"), new Node("3"), Direction.BIDIRECTION, 5));
//		graph.addEdge(new Edge(sourceNode, new Node("8"), Direction.BIDIRECTION, 11));
//		graph.addEdge(new Edge(new Node("6"), new Node("5"), Direction.BIDIRECTION, 19));
//		graph.addEdge(new Edge(new Node("7"), new Node("5"), Direction.BIDIRECTION, 16));
//		graph.addEdge(new Edge(sourceNode, new Node("6"), Direction.BIDIRECTION, 3));
//		DijkstraShortestPathFinding(graph, sourceNode);
		
	 }
	
	public List<Node> depthFirstTraversal(UnweightedGraph graph, Node visitedNode, List<Node> visited, Stack stack ) {
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "SUB depthFirstTraversal(graph, visitedNode, visitedList, stack )", null, null, null));
		if(null == visited) {
			visited = new LinkedList<>();
		}
		if(null == stack) {
			stack = new Stack();
		}
		visited.add(visitedNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(visitedNode.getName(), "append visitedNode to visitedList", null, null, null));

		System.out.println("Visited->" + visited);
		stack.push(visitedNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "push visitedNode on to stack", new StackEntry(visitedNode.getName(), ActionDFS.PUSH), null, null));
		System.out.println("Stack-->" + stack);
		List<Node> neighboursList = graph.getNodeConnections(visitedNode);
		if(neighboursList != null) {
			for(Node neighbouringNode: neighboursList) {
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "FOREACH(neighbouring node of visitedNode)", null, null, null));
				if(!visited.contains(neighbouringNode)) {
					c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "IF neighbouring node NOT in visitedList THEN", null, null, null));
					System.out.println("Recursing  --------------->" + neighbouringNode);
					c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "depthFirstTraversal(graph, visitedNode, visitedList, stack)",null, visitedNode.getName(), neighbouringNode.getName()));
					depthFirstTraversal(graph, neighbouringNode, visited, stack);
				}
				c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDIF", null, null, null));
				System.out.println("Not Recursing  --------------->" + neighbouringNode);
			}
		}
		
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDFOREACH", null, null, null));
		System.out.println("Node Key Name------------------>" + visitedNode.getName());
		Node poppedNode = stack.pop();
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "pop visitedNode from stack", new StackEntry(poppedNode.getName(), ActionDFS.POP), poppedNode.getName(), stack.peek()!=null ? stack.peek().getName() : null));
		System.out.println("Back  --------------->" + visitedNode);
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "RETURN visitedList", null, null, null));
		c_graphOutputData.getSimulationSteps().add(new DFSSimulationSteps(null, "ENDSUB", null, null, null));
		return visited;
	}
	
	public List<Node> BreadthFirstTraversal(UnweightedGraph graph, Node sourceNode){
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
			Node visitedNode = queue.dequeue();
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "visitedNode <- dequeue node from queue",new QueueEntry(visitedNode.getName(), ActionBFS.DEQUEUE), null, null ));
			System.out.println("dequeued current node: " + visitedNode);
			System.out.println("Here 3");
			visited.add(visitedNode);
			c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "append visitedNode to visited", null, null, null));
			List<Node> neighboursList = graph.getNodeConnections(visitedNode);
			for(Node neighbouringNode: neighboursList) {
				System.out.println("In for loop");
				c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "FOREACH(neighbouring node of visitedNode)", null, null, null));
				if(!visited.contains(neighbouringNode) && !queue.contains(neighbouringNode)){
					c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "IF(visited NOT contains node && queue NOT contains node)", null, null, null));
					queue.enqueue(neighbouringNode);
					c_graphOutputData.getSimulationSteps().add(new BFSSimulationSteps(null, "enqueue node to queue", 
							new QueueEntry(visitedNode.getName(), ActionBFS.ENQUEUE), visitedNode.getName(), neighbouringNode.getName()));
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
	public void DijkstraShortestPathFinding(WeightedGraph graph, Node sourceNode){
		
		c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "sub Dijkstra(graph, source)", null, null, 0, null, null, null));
		//Creating a priority queue for the nodes
		Queue<DijkstraQueueNode> priorityQueue = new Queue<DijkstraQueueNode>();
		c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "Queue = []", null, null, 0, null, null, null));

		List<DijkstraQueueNode> visitedNodes = new ArrayList<DijkstraQueueNode>();
		c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "VisitedNodes = []", null, null, 0, null, null, null));

		//Retrieving the list of nodes in the graph
		List<Node> NodeList = graph.getNodesList();
		for(Node node: NodeList){
			c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "FOREACH (node v graph.nodes)", null, null, 0, null, null, null));
			
			//System.out.println(node + " -> " + graph.getNodeConnections(node));
			/*
			 * If the node is not the source node, then the boolean value will be set to false, otherwise it will be set to true
			 * Depending on this, the distance from the source node field will be altered
			 */
			if(node!=sourceNode){
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "IF (v is the source)", null, null, 0, null, null, null));

				priorityQueue.enqueue(new DijkstraQueueNode(node, false));
				
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "dist[v] <-INFINITY", null, null, 0, null, null, null));
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "prev[v] <- NULL", null, null, 0, null, null, null));
				
 			//	System.out.println("PriorityQueue --->  " + priorityQueue);
			}else{
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "ELSE", null, null, 0, null, null, null));

				priorityQueue.enqueue(new DijkstraQueueNode(sourceNode, true));
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "dist[source] <- 0", null, null, 0, null, null, null));
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "enqueue v in Queue", null, null, 0, null, null, null));

			//	System.out.println("PriorityQueue --->  " + priorityQueue);
			}
			
		}
		c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "ENDFOREACH", null, null, 0, null, null, null));

		
		/*
		 * Trying to find the DijkstraQueueNode in the priority queue with the shortest distance from the source node
		 * In the first pass, this node will be the DijkstraQueueNode of the source node itself
		 */
		
		while(true) {
			c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "WHILE(true)", null, null, 0, null, null, null));
			int distance = Integer.MAX_VALUE;

			DijkstraQueueNode visitedNode = null;
			for(DijkstraQueueNode node: priorityQueue.getList()) {
				if(!visitedNodes.contains(node) && node.getDistanceFromSourceNode() < distance) {
					distance = node.getDistanceFromSourceNode();
					visitedNode = node;
				}		
			}
			c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "u <- node in Queue with minimum dist[u]", null, null, 0, null, null, null));

			
		
			/*
			 * For each node (neighbouringNode), for which there is a path from the visitedNode, we are calculating the shortest distance from the current node
			 * to that node  
			 */
			if(visitedNode!=null) {
				System.out.println("visitedNode ----> " + visitedNode.getNode());

				for(Node neighbouringNode: graph.getNodeConnections(visitedNode.getNode())) {
					c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "FOREACH (neighbour node v of u in Queue that is not in VisitedNodes)", null, null, 0, null, null, null));
					
					c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, null, visitedNode.getNode().getName(), neighbouringNode.getName(), 0, null, null, null));

					//Adding the current distance to the weight of the edge between the neighbouringNode and the visitedNode to calculate a new alternate distance
					int alternateDistance = visitedNode.getDistanceFromSourceNode() + graph.getWeight(visitedNode.getNode(), neighbouringNode);
					c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "altDist <- dist[u] + graph.edges(u, v)", null, null, 0, null, null, null));

					DijkstraQueueNode dijkstraNeighbouringNode = null;
					
					//Iterating through the priorityQueue to retrieve the node equal to the neighbouringNode
					for(DijkstraQueueNode nodeInPriorityQueue : priorityQueue.getList()) {
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
							c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "IF(altDist < dist[v])", null, null, 0, null, null, null));

							dijkstraNeighbouringNode.changeDistanceFromSourceNode(alternateDistance);
							c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "dist[v] <- altDist", null, null, alternateDistance, null, null, null));

							//Updating the previous node to the visitedNode since this is the previous node in this new shortest path
							dijkstraNeighbouringNode.changePreviousNode(visitedNode);
							c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "prev[v] <- u", null, null, 0, visitedNode.getNode().getName(), null, null));

							// System.out.println("PriorityQueue ---> " + priorityQueue);
						}
						c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "ENDIF", null, null, 0, null, null, null));

					
					}
					c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "ENDFOREACH", null, null, 0, null, null, null));

				visitedNodes.add(visitedNode);
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(visitedNode.getNode().getName(), "Add u to VisitedNodes", null, null, 0, null, null, null));
				}
			}else {
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "IF(all the nodes have been enqueued in Queue)", null, null, 0, null, null, null));

				for(DijkstraQueueNode queueNode: visitedNodes){
					String path = "";
					System.out.println(queueNode.getNode().getName() + ":");
					path =createPath(queueNode, sourceNode, path);
					System.out.println(createPath(queueNode, sourceNode, path) + " , shortest distance from source node to " + queueNode.getNode().getName() + ": "+ queueNode.getDistanceFromSourceNode());
					c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, null, null, null, 0, null, queueNode.getNode().getName(), path));

				} 
				c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "break from the while loop", null, null, 0, null, null, null));
				
				break;

			}
			c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "ENDIF", null, null, 0, null, null, null));
		}
		c_graphOutputData.getSimulationSteps().add(new DijkstraSimulationSteps(null, "ENDWHILE", null, null, 0, null, null, null));

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
			return createPath(node.getPreviousNode(), sourceNode, path) + " -> " + path;
		}	
	}
	
//	public static Queue<DijkstraQueueNode> sortPriorityQueue(Queue<DijkstraQueueNode> priorityQueue) {
//		
//		int distance = Integer.MAX_VALUE;
//		DijkstraQueueNode visitedNodeToAdd = null;
//		Queue<DijkstraQueueNode> sortedPriorityQueue = new Queue<DijkstraQueueNode>();
//		
//		sortedPriorityQueue.enqueue(priorityQueue.getList().get(0));
//		while(sortedPriorityQueue.getList().size() != priorityQueue.getList().size()) {
//			for(DijkstraQueueNode nodeInPriorityQueue : priorityQueue.getList()) {
//				if(nodeInPriorityQueue.getDistanceFromSourceNode() <= distance && !sortedPriorityQueue.contains(nodeInPriorityQueue)){
//					visitedNodeToAdd = nodeInPriorityQueue;
//				}
//				sortedPriorityQueue.enqueue(visitedNodeToAdd);
//				System.out.println(visitedNodeToAdd.getNode());
//				System.out.println(sortedPriorityQueue);
//			}
//		}
//		return priorityQueue;
//	}
	
	

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
	
