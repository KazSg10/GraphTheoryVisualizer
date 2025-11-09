package com.algorithms;

import java.util.ArrayList;
import java.util.List;

/**
 * Class for creating Queue ADT objects which follow the FIFO system 
 * @param <T> - Generic, data type of elements in queue must be swapped with the T
 */
public class Queue<T> {
	private List<T> c_queue;

	public Queue(){		
		c_queue = new ArrayList<>();
	}
	
	public boolean isEmpty() {
		return c_queue.isEmpty();
	}

	public void enqueue(T element) {
		c_queue.add(element);
	}

	public T dequeue() {
		T dequeuedElement = c_queue.get(0);
		c_queue.remove(0);
		return dequeuedElement;	
	}
	public boolean contains(T element) {
		return c_queue.contains(element);
	}
	
	/**
	 * Overridden function of toString()
	 */
	@Override 
	public String toString() {
		List <String> nodeNames = new ArrayList<String>();
		for(T node : c_queue) {
			nodeNames.add(node.toString());
		}
		return "List: " + nodeNames;
	}

	/**
	 * Retrieving the list of the queue
	 * @return - Returning list of queue
	 */
	public List<T> getList() {
		return c_queue;
	}
	
	/**
	 * Dequeuing a node from the queue
	 * @param node - Dequeued node
	 */
	public void dequeue(T node) {
		c_queue.remove(node);
	}
}