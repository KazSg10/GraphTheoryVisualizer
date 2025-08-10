
package com.Classes; // //import java.util.List; //import java.util.Map;
import java.util.Scanner; // //import com.algorithms.NodeBase.Directions;

import com.Classes.Edge.Direction;
public class MainMethod{ // //public static void main(String[] args) {
	
	UnweightedGraph graph = new UnweightedGraph();
	
	Node node1 = new Node("K");
	Node node2 = new Node("S");
	Node node3 = new Node("P");
	Node node4 = new Node("T");
	Node node5 = new Node("V");
	
	Edge edge1 = new Edge(node1, node2, Direction.BIDIRECTION);
	Edge edge2 = new Edge(node2, node3, Direction.BIDIRECTION);
	Edge edge3 = new Edge(node3, node4, Direction.BIDIRECTION);
	Edge edge4 = new Edge(node4, node1, Direction.BIDIRECTION);

	graph.addConnection(edge1);
	
	
 }
 