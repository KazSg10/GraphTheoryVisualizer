package com.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.algorithms.Node.Directions;
import com.algorithms.UnweightedGraph;
import com.algorithms.UnweightedNode;

public class VisualizerServlet extends HttpServlet{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public void init() throws ServletException {

	}
	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
		response.setContentType("text/html");
		PrintWriter out = response.getWriter();
		response.sendRedirect("App.html"); 
	}

	@Override
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException{
		String connectionnode1A = request.getParameter("connectionnode1A");
		String connectionnode1B = request.getParameter("connectionnode1B");
		String connectionnode1C = request.getParameter("connectionnode1C");
		response.setContentType("text/html");
		
		PrintWriter out = response.getWriter();

		
		UnweightedGraph graph = new UnweightedGraph();
		
		UnweightedNode node1 = new UnweightedNode(connectionnode1A, Directions.BIDIRECTION);
		UnweightedNode node2 = new UnweightedNode(connectionnode1B, Directions.BIDIRECTION);
		UnweightedNode node3 = new UnweightedNode(connectionnode1C, Directions.BIDIRECTION);
		graph.addConnection(node1, node2);
		graph.addConnection(node2, node3);
		graph.addConnection(node1, node3);
		
		//System.out.println("===>" + graph.getNodeConnections());
		out.println("<html><body>\"===>\"" + graph.getNodeConnections() + "</body></html>");
	//	
	//BreadthFirstTraversal breadthFirstTraversal = new BreadthFirstTraversal();
	//breadthFirstTraversal.traverse(graph, node1);
		
	}

}
