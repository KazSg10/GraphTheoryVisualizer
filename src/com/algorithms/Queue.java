package com.algorithms;

import java.util.ArrayList;
import java.util.List;

//Class for creating Queue ADT objects which follow the FIFO system 
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
	
	@Override 
	public String toString() {
		List <String> nodeNames = new ArrayList<String>();
		for(T node : c_queue) {
			nodeNames.add(node.toString());
		}
		return "List: " + nodeNames;
	}

	public List<T> getList() {
		return c_queue;
	}
	
	public void dequeue(T node) {
		c_queue.remove(node);
	}
}
