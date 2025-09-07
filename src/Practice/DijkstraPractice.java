package Practice;

import java.util.List;

import com.algorithms.Edge;
import com.algorithms.Node;
import com.algorithms.Queue;
import com.algorithms.WeightedGraph;
import com.algorithms.Edge.Direction;
import com.algorithms.Graph;

public class DijkstraPractice {
	public static void main(String[] args) {

		WeightedGraph graph = new WeightedGraph();
		Node sourceNode = new Node("1");
		graph.addConnection(new Edge(sourceNode, new Node("2"), Direction.BIDIRECTION, 10));
		graph.addConnection(new Edge(new Node("4"), new Node("2"), Direction.BIDIRECTION, 15));
		graph.addConnection(new Edge(new Node("2"), new Node("5"), Direction.BIDIRECTION, 13));
		graph.addConnection(new Edge(new Node("7"), new Node("6"), Direction.BIDIRECTION, 7));
		graph.addConnection(new Edge(new Node("6"), new Node("3"), Direction.BIDIRECTION, 5));
		graph.addConnection(new Edge(sourceNode, new Node("8"), Direction.BIDIRECTION, 11));
		graph.addConnection(new Edge(new Node("6"), new Node("5"), Direction.BIDIRECTION, 19));
		graph.addConnection(new Edge(new Node("7"), new Node("5"), Direction.BIDIRECTION, 16));
		graph.addConnection(new Edge(sourceNode, new Node("6"), Direction.BIDIRECTION, 3));
		DijkstraShortestPathFinding(graph, sourceNode);
		
		
	 }
	public static void DijkstraShortestPathFinding(WeightedGraph graph, Node sourceNode){
		//Creating a priority queue for the nodes
		Queue<DijkstraQueueNode> priorityQueue = new Queue<DijkstraQueueNode>();
		List<Node> NodeList = graph.getNodesList();
		for(Node node: NodeList) {
			if(node!=sourceNode) {
				System.out.println("PriorityQueue before --->  " + priorityQueue);
				
				priorityQueue.enqueue(new DijkstraQueueNode(node, false));		
				System.out.println("PriorityQueue after --->  " + priorityQueue);

			}
			else {
				
				System.out.println("PriorityQueue before --->  " + priorityQueue);
				priorityQueue.enqueue(new DijkstraQueueNode(node, true));
				System.out.println("PriorityQueue after --->  " + priorityQueue);

			}

		}

		while(!priorityQueue.isEmpty()) {
			int distance = Integer.MAX_VALUE;
			DijkstraQueueNode currentNode = null;
			for(DijkstraQueueNode node: priorityQueue.getList()) {
				if(node.getDistanceFromSourceNode() < distance) {
					currentNode = node;
					System.out.println("currentNode ---->" + currentNode.getNode());
				}
				priorityQueue.dequeueByValue(currentNode);
			}
			
			for(Node neighbouringNode: graph.getNodeConnections(currentNode.getNode())) {
				int alternateDistance = 0;
				DijkstraQueueNode dijkstraNeighbouringNode = new DijkstraQueueNode(neighbouringNode, false);
				if(priorityQueue.contains(dijkstraNeighbouringNode)){
					alternateDistance = currentNode.getDistanceFromSourceNode() + graph.getWeight(currentNode.getNode(), neighbouringNode);
					
					if(alternateDistance < dijkstraNeighbouringNode.getDistanceFromSourceNode()) {
						dijkstraNeighbouringNode.changePreviousNode(currentNode); 
 					}
				}
			}

		}
		System.out.println(priorityQueue);
	}


	public class DijkstraQueueNode{
		
		private Node node;
		private DijkstraQueueNode c_previousNode;
		private int c_distanceFromSourceNode;

		public DijkstraQueueNode(Node node, Boolean sourceNode) {
			c_previousNode = null;
			c_distanceFromSourceNode = sourceNode? 0 : Integer.MAX_VALUE;

		}
		//Do THE INFINITY THING

		
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
			return node;
		}
		public void changeDistanceFromSourceNode(int newDistance) {
			c_distanceFromSourceNode = newDistance;
		}
		public void changePreviousNode(DijkstraQueueNode node) {
			c_previousNode = node;
		}
	}
}

