package com.server;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
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
import com.algorithms.WeightedGraph;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.server.json.GraphInputData;
import com.server.json.GraphInputData.ConnectionData;
import com.server.json.GraphOutputData;

/**
 * Class containing functionalities related to communicating with the browser client
 */
public class WebServer {
	//Enum to store constants of the HTTP Methods which will be included in the client browser request
	enum HttpMethods{
		GET,
		POST;
	}
	
	public static void main(String[]args) {
		WebServer webServer = new WebServer();
		//Web server starting
		webServer.startServer();
	}
	
	/**
	 * Starts server
	 */
	public void startServer() {
		System.out.println("Web server started");
		int portNumber = -1;
		//Getting current working directory
		String directory = System.getProperty("user.dir");
		System.out.println(directory);
		String projectPath = directory;
		//Getting portNumber from server.config
		try {
			BufferedReader buffer = new BufferedReader(new FileReader(projectPath + "/src/com/server/server.config"));
			String line = buffer.readLine();
			if(line != null) {
				String[] arr = line.split("=");
				if(arr != null && arr.length > 1) {
					portNumber = Integer.parseInt(arr[1]);
				}
			} 
			/*
			 * Setting up a socket for client-server connections and 
			 * retrieving the local computer's hostname and IP address.
			 */
			InetAddress localHost = InetAddress.getLocalHost();
			//Getting IP address and converting to InetAddress object
			InetAddress addr = InetAddress.getByName(localHost.getHostAddress());
			
			writeFile(projectPath + "/src/webcontent/connectionToServer.js", connectionToServerFileUpdate(localHost));
			/*
			 * Creating server socket that listens for clients on a specified port number, backlog of 50 connections and bound specifically
			 * to this computer's IP address.
			 * Since I am using the private IP address, this webapp can only work on devices in the LAN, at the moment.
			 */
			ServerSocket serverSocket = new ServerSocket(portNumber, 50, addr);
			//Processing HTTP requests
			while(true) {
				System.out.println(String.format("Server waiting for connection on IP address: %s and port: %d", serverSocket.getInetAddress().getHostAddress(), portNumber));
				System.out.println("URL to access webapp -> http://" + serverSocket.getInetAddress().getHostAddress() + ":" + portNumber);
				//Server is now waiting for a connection
				Socket socket = serverSocket.accept();
				/*
				 * The request from browser is being stored.
				 * socket.getInputStream is used to read the data coming from the socket.
				 * InputStreamReader reads bytes in the data and decodes them into characters.
				 */
				InputStreamReader input = new InputStreamReader(socket.getInputStream());
				//Getting each message from input, one line at a time
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
				 * Checking whether first line is valid or not.
				 * If not, then close current connection and wait for a new client connection.
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
					//Unsupported request line received, we need to close the connection since it can not be handled
					socket.close();
				}
			}
		}catch(Exception e) {
			System.out.println(e);
		}
	}
	/**
	 * Parsing the first line of http request, which is the request line
	 * @param httpRequestLine - httpRequestLine string in request from client
	 * @return - returning the different components of this requestLine, in an array
	 */
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
	
	/**
	 * Processing GET Request from browser client
	 * @param path - Path of the file request by browser client
	 * @param socket
	 */
	//Function for processing HTTP GET request from browser
	private void processMethodGet(String path, Socket socket) {
		//Getting current working directory
		String directory = System.getProperty("user.dir");
		String projectPath = directory;
		try {
			System.out.println("Handling HTTP Method GET " + path);
			if(path.equals("/")) {
				//Default path of html file code to return 
				path = projectPath + "/src/webcontent/Index.html";
			}else {
				//Processing the path of the html file code requested
				path = projectPath + "/src/webcontent" + path;
			}
			/*
			 * Creating a PrintWriter, which will be used to send data back to client.
			 * Second parameter being true indicates auto-flushing data back to client
			 */
			PrintWriter outputWriter = new PrintWriter(socket.getOutputStream());
			System.out.println("Reading file " + path);
			BufferedReader buffer = new BufferedReader(new FileReader(path));
			System.out.println("Reading content from file");	
			/*
			 * Status line of the HTTP response from response
			 * HTTP/1.1 = HTTP version
			 * 200 OK = status code, successful response code
			 * \r\n = carriage return
			 */
			outputWriter.println("HTTP/1.1 200 OK\r\n");	
			//Leaving a gap between status line and headers
			outputWriter.println("\r\n");
			String outputLine = buffer.readLine();
			while(outputLine != null) {
				//returning the html file code requested by the browser
				outputWriter.println(outputLine);
				outputLine = buffer.readLine();
			}
			outputWriter.flush();			
			//Sending the html file data to browser
			socket.close();
		}catch(Exception e) {
			System.out.println(e);
		}
	}
	
	//Function for processing HTTP POST request from browser
	private void processMethodPost(String path, String body, Socket socket){
		try {
			//Creating a ObjectMapper for mapping input data received from the client to a class' fields
			ObjectMapper graphInputDataMapper = new ObjectMapper();
			//Mapping the body containing the client data received in the POST request to the GraphInputData class 
			GraphInputData inputData = graphInputDataMapper.readValue(body,GraphInputData.class);
			//Processing inputData using the algorithm specified in the body
			String json = simulateAlgorithm(inputData);
			/*
			 * Creating a PrintWriter, which will be used to send data back to client.
			 */
			PrintWriter outputWriter = new PrintWriter(socket.getOutputStream());		
			/*
			 * Status line of the HTTP response from response
			 * HTTP/1.1 = HTTP version
			 * 200 OK = status code, successful response code
			 * \r\n = carriage return
			 */
			outputWriter.println("HTTP/1.1 200 OK\r\n");
			//Header providing body length
			outputWriter.println("Content-Length: " + json.getBytes().length);
			//Header providing type of content in the body
			outputWriter.println("Content-Type: application/json;charset=UTF-8");
			//Blank line to separate headers and body
			outputWriter.println();
			//Adding body to response
			outputWriter.print(json); 
			outputWriter.flush();
			//Closing client socket
			socket.close();
		}catch(Exception e) {
			System.out.println(e);
		}
	}
	
	/**
	 * Reading the body of the client data in the http request
	 * @param reader - Buffer containing the lines in the request
	 * @param headers - Dictionary containing key-value pairs of headers and their values
	 * @return - Returning body of the request
	 */
	private String readBody(BufferedReader reader, Map<String, String> headers) {	
		/*
		 * Retrieving the length of the body from the Content-Length header to know how many
		 * characters are part of the body.
		*/
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

	/**
	 * Simulating the algorithm requested to get the json of the steps which will be returned to the browser client.
	 * @param inputData - Object which contains the data that has come from the client
	 * @return
	 */
	private String simulateAlgorithm(GraphInputData inputData) {
		//Getting working directory
		String directory = System.getProperty("user.dir");
		String projectPath = directory;
		if(inputData.getAlgorithm().equals("DFS") || inputData.getAlgorithm().equals("BFS")){
			UnweightedGraph graph = new UnweightedGraph();			
			Node sourceNode = new Node(inputData.getSourceNodeName());			
			//Creating a graph based on the client data
			for(ConnectionData data: inputData.getConnections()) {
				Node node1 = new Node(data.getNode1());
				Node node2 = new Node(data.getNode2());
				Edge edge = new Edge(node1, node2, Direction.valueOf(data.getEdgeDirection()));
				graph.addEdge(edge);
			}			
			//Simulating DFS
			if(inputData.getAlgorithm().equals("DFS")) {
				GraphOutputData c_graphOutputDataDFS = new GraphOutputData(inputData.getAlgorithm(), graph, readFile(projectPath + "/src/com/algorithms/DFSPseudoCode.txt"), sourceNode);
				Algorithm algorithmDFS = new Algorithm(c_graphOutputDataDFS);
				List<Node> visitedDFS = new ArrayList<Node>();
				Stack<Node> stack = new Stack<Node>();
				algorithmDFS.depthFirstTraversal(graph, sourceNode, visitedDFS, stack);
				//Returning the steps of the traversal in json form
				return toJson(c_graphOutputDataDFS);
			}
			//Simulating BFS
			if(inputData.getAlgorithm().equals("BFS")) {
				GraphOutputData c_graphOutputDataBFS = new GraphOutputData(inputData.getAlgorithm(), graph, readFile(projectPath + "/src/com/algorithms/BFSPseudoCode.txt"), sourceNode);
				Algorithm algorithmBFS = new Algorithm(c_graphOutputDataBFS);
				Queue<Node> queue = new Queue<Node>();
				algorithmBFS.BreadthFirstTraversal(graph, sourceNode);			
				//Returning the steps of the traversal in json form
				return toJson(c_graphOutputDataBFS);
			}		
		}	
		else if(inputData.getAlgorithm().equals("Dijkstra")) {
			WeightedGraph graph = new WeightedGraph();			
			Node sourceNode = new Node(inputData.getSourceNodeName());
			//Creating a graph based on the client data
			for(ConnectionData data: inputData.getConnections()) {
				Node node1 = new Node(data.getNode1());
				Node node2 = new Node(data.getNode2());
				Edge edge = new Edge(node1, node2, Direction.valueOf(data.getEdgeDirection()), Integer.valueOf(data.getWeight()));
				graph.addEdge(edge);
			}		
			//Simulating Dijkstra's Algorithm
			GraphOutputData c_graphOutputDataDijkstra = new GraphOutputData(inputData.getAlgorithm(), graph, readFile(projectPath + "/src/com/algorithms/DijkstraPseudoCode.txt"), sourceNode);
			Algorithm algorithmDijkstra = new Algorithm(c_graphOutputDataDijkstra);
			algorithmDijkstra.DijkstraShortestPathFinding(graph, sourceNode);
			//Returning the steps of the traversal in json form
			return toJson(c_graphOutputDataDijkstra);
		}
		return null;
	}

	/**
	 * Converting the fields and their values in the GraphOutputData object to json
	 * @param outputData - GraphOutputData object
	 * @return
	 */
	public String toJson(GraphOutputData outputData) {
		//Creating an objectMapper to map GraphOutputData to Json
		ObjectMapper objectMapper = new ObjectMapper();
		//Creating an empty string for Json at the start
		String json = null;
		try {
			json = objectMapper.writeValueAsString(outputData);
		} catch (JsonProcessingException e) {
			System.out.println(e);
		}
		System.out.println("Graph output data json: " + json);
		return json;
	}
	
	/**
	 * Reading a file
	 * @param path - Path fo file that is to be read from
	 * @return - Returning a list of all the lines in the file
	 */
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
	
	/**
	 * Reading a file
	 * @param path - Path of file that is to be written to
	 * @param fileList - List of all the lines in the file given by path
	 * @return - Returning a list of all the lines in the file
	 */
	public void writeFile(String path, List<String> fileList) throws IOException {
		File currentFile = new File(path);
		currentFile.delete();
		File newFile = new File(path);
		BufferedWriter buffer = new BufferedWriter(new FileWriter(path));
		try {
			for(String line : fileList) {
				buffer.write(line);
				buffer.newLine();
			}
		}catch (IOException e) {
			e.printStackTrace();
		}	
		buffer.close();
	}
	 
	/**
	 * Updating the connectionToServer.js file with new IP address 
	 * @param localHost - This computer 
	 * @return
	 */
	public List<String> connectionToServerFileUpdate(InetAddress localHost) {
		String directory = System.getProperty("user.dir");
		String projectPath = directory;
		String filePath = projectPath + "/src/webcontent/connectionToServer.js";
		List<String> jsFileList = readFile(filePath);
		int index = 0;
		for(int i = 0; i<jsFileList.size(); i++) {
			if(jsFileList.get(i).contains("	var response = await fetch")) {
				index = i;
				break;
			}
		}
		//Updating the fetch() line with the new IP address
		jsFileList.add(index, "	var response = await fetch(\"http://"+ localHost.getHostAddress() + ":8908/visualize\",");
		jsFileList.remove(index + 1);
		System.out.println("updated file");
		return jsFileList;
	}
}