package com.algorithms;

import java.util.ArrayList;
import java.util.List;

public class Stack {
	private List<Node> c_stack;

	public Stack(){		
		c_stack = new ArrayList<>();
	}

	public boolean isEmpty() {
		return c_stack.isEmpty();
	}

	public void push(Node visited) {
		c_stack.add(visited);
	}

	public Node pop() {
		System.out.println("Pop before: " + c_stack);
		Node poppedNode = c_stack.get(c_stack.size() - 1);
		c_stack.remove(c_stack.size() - 1);
		System.out.println("Pop after: " +c_stack);

		return poppedNode;
	}
	
	public boolean contains(Node node) {
		return c_stack.contains(node);
	}
	@Override 
	public String toString() {
		return "List: [" + c_stack + "]";
	}
	
	public Node peek() {
		if(!c_stack.isEmpty()) {
			return c_stack.get(c_stack.size()-1);
		}
		return null;
	}
}
