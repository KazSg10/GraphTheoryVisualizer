
import java.net.ServerSocket;
import java.net.Socket;
import java.util.List;
import java.util.Scanner;
import java.io.*;
import java.util.ArrayList;
import java.io.FileNotFoundException;

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
		try {
			BufferedReader buffer = new BufferedReader(new FileReader("server.config"));
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
				BufferedReader clientBuffer = new BufferedReader(input);			
				StringBuilder requestBuilder = new StringBuilder();
				List<String> httpRequest = new ArrayList<String>();

				String clientLine = clientBuffer.readLine();
				while(clientLine != null && !clientLine.isBlank()) {
					httpRequest.add(clientLine);
					System.out.println(clientLine);
					clientLine = clientBuffer.readLine();
				}
				processInput(httpRequest, socket);
				System.out.println();
			}
		}catch(Exception e) {
			System.out.println(e);
		}
		
	}

	private void processInput(List<String> httpRequest, Socket socket) {
		String httpRequestLine = httpRequest.get(0);
		String[] httpRequestLineArray = httpRequestLine.split(" ");
		if(httpRequestLineArray != null && httpRequestLineArray.length == 3) {
			String httpMethod = httpRequestLineArray[0];
			HttpMethods method = HttpMethods.valueOf(httpMethod);

			switch (method) {
			case GET:
				processMethodGet(httpRequestLineArray[1], socket);
				break;
			case POST:
				processMethodPost(httpRequestLineArray[1], socket);
				break;
			default:
				break;
			}
		}


	}
	private void processMethodGet(String path, Socket socket) {
		try {
			System.out.println("Handling HTTP Method GET " + path);
			if(path.equals("/")) {
				path = "../web/Index.html";
			}else {
				path = "../web" + path;
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
				System.out.println(outputLine);
				outputLine = buffer.readLine();
			}
			
			outputWriter.flush();
			socket.close();
		}catch(Exception e) {
			System.out.println(e);
		}
	}
	private void processMethodPost(String path, Socket socket) {
		try {
			
		}catch(Exception e) {
			System.out.println(e);
		}
	}
}