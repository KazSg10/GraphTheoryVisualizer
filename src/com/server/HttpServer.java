package com.server;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.algorithms.Algorithm;
import com.algorithms.Edge;
import com.algorithms.Edge.Direction;
import com.algorithms.Node;
import com.algorithms.Queue;
import com.algorithms.Stack;
import com.algorithms.UnweightedGraph;
import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.json.GraphInputData;
import com.server.json.GraphInputData.ConnectionData;
import com.server.json.GraphOutputData;

public class HttpServer {

	enum HttpMethods{
		GET,
		POST;
	}
	//Class for Http Server
	public static void main(String[]args) {
		HttpServer server = new HttpServer();
		System.out.println("Server starting...");
		server.startServer();
	}



	private void startServer() {
		int portNumber = -1;
		String projectPath = System.getenv("NEA_PROJECT_ROOT");
		try {
			BufferedReader buffer = new BufferedReader(new FileReader(projectPath + "/src/com/server/server.config"));
			String line = buffer.readLine();
			if(line != null) {
				String[] arr = line.split("=");
				if(arr != null && arr.length > 1) {
					portNumber = Integer.parseInt(arr[1]);
				}
			} 
			//The server sets up a socket for client connections 
			ServerSocket serverSocket = new ServerSocket(portNumber);

			while(true) {
				System.out.println(String.format("Server waiting for connection on port %d", portNumber));
				//Server is now waiting for a connection
				Socket socket = serverSocket.accept();
				System.out.println(socket.toString());
				InputStreamReader input = new InputStreamReader(socket.getInputStream());

				//Getting each message from input one at a time
				BufferedReader clientBufferedReader = new BufferedReader(input);	
				/*
				 * First line of the http request is the request line which contains following information:
				 * Http Method -> e.g. GET, POST etc
				 * Path -> Path of the resource the client wants
				 * Http Version -> e.g. HTTP/1.0
				 * 
				 * (Syntax ->  Request-Line   = Method SP Request-URI SP HTTP-Version CRLF)
				 */

				//Reading the first line in the http request
				String httpRequestLine = clientBufferedReader.readLine();

				/*
				 * Checking whether first line is valid or not
				 * If not, then close current connection and wait for a new client connection
				 */
				if(httpRequestLine != null) {
					//Parsing the httpRequestLine into its 3 components
					Map<String, String> parsedRequestLine = parseRequestLine(httpRequestLine);
					//Creating a dictionary to assign headers to their values							
					Map<String, String> httpRequestHeaders = new HashMap<String, String>();

					//Start fetching headers
					String headerLine = clientBufferedReader.readLine();
					while(headerLine != null && !headerLine.isBlank()) {
						//Splitting the header line into header and its value
						String[] headerParse = headerLine.split(":");
						//Checking if headerParse contains two values: the header name and its value
						if(headerParse.length == 2) {
							httpRequestHeaders.put(headerParse[0], headerParse[1]);
						}
						//Reading next header line
						headerLine = clientBufferedReader.readLine();
					}	

					//Depending on the http method, call that particular function
					if(parsedRequestLine.get("Method").equals("GET")) {
						processMethodGet(parsedRequestLine.get("Path"), socket);
					}else if(parsedRequestLine.get("Method").equals("POST")){
						processMethodPost(parsedRequestLine.get("Path"), readBody(clientBufferedReader, httpRequestHeaders), socket);
					}

					System.out.println();
				} else {
					//Unsupported request line received, we need to close the connection since it can't be handled
					socket.close();
				}
			}
		}catch(Exception e) {
			System.out.println(e);
		}

	}
	//Parses the first line of http request, which is the request line
	private	Map<String, String> parseRequestLine(String httpRequestLine) {
		Map<String, String> httpRequestLineComponents = new HashMap<String, String>();
		//Parsing the first line into 3 components
		String[] httpRequestLineArray = httpRequestLine.split(" ");
		if(httpRequestLineArray != null && httpRequestLineArray.length == 3) {
			//Storing each component as key-value pairs in the dictionary
			httpRequestLineComponents.put("Method", httpRequestLineArray[0]);
			httpRequestLineComponents.put("Path", httpRequestLineArray[1]);
			httpRequestLineComponents.put("Version", httpRequestLineArray[2]);	
		}
		return httpRequestLineComponents;
	}

	private void processMethodGet(String path, Socket socket) {
		String projectPath = System.getenv("NEA_PROJECT_ROOT");

		try {
			System.out.println("Handling HTTP Method GET " + path);
			if(path.equals("/")) {
				path = projectPath + "/src/webcontent/Index.html";
			}else {
				path = projectPath + "/src/webcontent" + path;
			}


			PrintWriter outputWriter = new PrintWriter(socket.getOutputStream());
			System.out.println("Reading file " + path);
			BufferedReader buffer = new BufferedReader(new FileReader(path));

			System.out.println("Reading content from file");
			outputWriter.println("HTTP/1.1 200 OK\r\n");
			outputWriter.println("\r\n");
			String outputLine = buffer.readLine();
			while(outputLine != null) {
				outputWriter.println(outputLine);
				outputLine = buffer.readLine();
			}

			outputWriter.flush();
			socket.close();
		}catch(Exception e) {
			System.out.println(e);
		}
	}
	private void processMethodPost(String path, String body, Socket socket) {
		try {
			System.out.println("Body: " + body);
			//Creating a ObjectMapper for mapping input data received from the client to a class
			ObjectMapper graphInputDataMapper = new ObjectMapper();
			//Mapping the body containing the client data received in the POST request to the GraphInputData class 
			GraphInputData inputData = graphInputDataMapper.readValue(body,GraphInputData.class);
			//Processing inputData using the algorithm specified in the body
			String json = simulateAlgorithm(inputData);

			//Creating a PrintWriter, which will be used to send data back to client
			PrintWriter outputWriter = new PrintWriter(socket.getOutputStream());
			//Response's first line containing the HTTP version, HTTP status code and status
			outputWriter.println("HTTP/1.1 200 OK\r\n");
			//Header providing body length
			System.out.println(json.getBytes().length);
			outputWriter.println("Content-Length: " + json.getBytes().length);
			//Header providing type of content in the body
			outputWriter.println("Content-Type: application/json;charset=UTF-8");
			//Blank line to separate headers and body
			outputWriter.println();
			//Adding body to response
			outputWriter.print(json);

			System.out.println(json.getBytes());
			//Sending response back to client
			outputWriter.flush();
			//Closing client socket
			socket.close();

		}catch(Exception e) {
			System.out.println(e);
		}
	}
	private String readBody(BufferedReader reader, Map<String, String> headers) {
		int bodyLength = Integer.parseInt(headers.get("Content-Length").trim());
		String body = "";
		for(int i = 0; i<bodyLength; i++) {	
			try {
				body+=(char)reader.read();
			} catch (Exception e) {
				System.out.println(e);
			}
		}
		return body;

	}

	private String simulateAlgorithm(GraphInputData inputData) {
		String projectPath = System.getenv("NEA_PROJECT_ROOT");
		if(inputData.getAlgorithm().equals("DFS") || inputData.getAlgorithm().equals("BFS")){
			UnweightedGraph graph = new UnweightedGraph();

			//TODO hardcoded source node need to take from ui
			Node sourceNode = new Node(inputData.getSourceNodeName());

			for(ConnectionData data: inputData.getConnections()) {
				Node node1 = new Node(data.getNode1());
				Node node2 = new Node(data.getNode2());
				Edge edge = new Edge(node1, node2, Direction.valueOf(data.getEdgeDirection()));
				graph.addConnection(edge);
			}

			if(inputData.getAlgorithm().equals("DFS")) {
				GraphOutputData c_graphOutputDataDFS = new GraphOutputData(graph, readFile(projectPath + "/src/com/algorithms/DFSPseudoCode.txt"));
				Algorithm algorithmDFS = new Algorithm(c_graphOutputDataDFS);
				List<Node> visitedDFS = new ArrayList<Node>();
				Stack stack = new Stack();
				algorithmDFS.depthFirstTraversal(graph, sourceNode, visitedDFS, stack);
				return toJson(c_graphOutputDataDFS);
			}

//			if(inputData.getAlgorithm().equals("BFS")) {
//				GraphOutputData c_graphOutputDataBFS = new GraphOutputData(graph, readFile(projectPath + "/src/com/algorithms/BFSPseudoCode.txt"));
//				Algorithm algorithmBFS = new Algorithm(c_graphOutputDataBFS);
//				Queue<Node> queue = new Queue<Node>();
//				algorithmBFS.BreadthFirstTraversal(graph, sourceNode);
//				return toJson(c_graphOutputDataBFS);
//			}
		}
		return null;
	}
	
	public List<String> readFile(String path){
		List<String> output = null;
		try {
			BufferedReader buffer = new BufferedReader(new FileReader(path));
			output = new ArrayList<String>();
			String outputLine = buffer.readLine();
			while(outputLine != null) {
				output.add(outputLine);
				try {
					outputLine = buffer.readLine();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}catch (Exception e) {
			System.out.println(e);
		}
		return output;


	}


	public String toJson(GraphOutputData outputData) {
		//Creating an objectMapper to map GraphOutputData to Json
		ObjectMapper objectMapper = new ObjectMapper();
		//Creating an empty string for Json at the start
		String json = null;
		try {
			//TODO
			//objectMapper.setVisibility(PropertyAccessor.FIELD, Visibility.ANY);
			//Converting current object to Json string 
			json = objectMapper.writeValueAsString(outputData);
		} catch (JsonProcessingException e) {
			System.out.println(e);
		}
		System.out.println("Graph output data json: " + json);
		return json;
	}
}