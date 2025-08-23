package com.algorithms;
import java.util.ArrayList;
import java.util.List;

public class PriorityQueue{
	
	List<Node> c_queue;
	public PriorityQueue() {
		c_queue = new ArrayList<Node>();
	}
	
	public boolean isEmpty() {
		return c_queue.isEmpty();
	}
	
	public void enqueue(Node node, int priority) {
		if(c_queue.isEmpty()) {
			c_queue.add(node);
		}
		
	}
	
	
	
	

}
