package com.algorithms;

import java.util.ArrayList;
import java.util.List;

//Class for creating Stack ADT objects which follow the FIFO system 
public class Stack<T> {
	private List<T> c_stack;

	public Stack(){		
		c_stack = new ArrayList<T>();
	}

	public boolean isEmpty() {
		return c_stack.isEmpty();
	}

	public void push(T visited) {
		c_stack.add(visited);
	}

	public T pop() {
		System.out.println("Pop before: " + c_stack);
		T poppedNode = c_stack.get(c_stack.size() - 1);
		c_stack.remove(c_stack.size() - 1);
		System.out.println("Pop after: " +c_stack);

		return poppedNode;
	}
	
	public boolean contains(Node node) {
		return c_stack.contains(node);
	}
	
	public T peek() {
		if(!c_stack.isEmpty()) {
			return c_stack.get(c_stack.size()-1);
		}
		return null;
	}
	
	@Override 
	public String toString() {
		List <String> nodeNames = new ArrayList<String>();
		for(T node : c_stack) {
			nodeNames.add(node.toString());
		}
		return "List: " + nodeNames;
	}
}
