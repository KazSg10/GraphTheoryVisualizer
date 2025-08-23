package com.server;

import java.io.OutputStream;
import java.net.Socket;

public class SampleClient {
	public static void main(String[]args) {
		try {
			System.out.println("Creating socket");
			Thread.sleep(2000);
			Socket socket = new Socket("192.168.1.194", 8808);
		
			System.out.println("Creating output stream");

			OutputStream output = socket.getOutputStream();
			System.out.println("Creating byte data");
			Thread.sleep(2000);

			output.write("Karan".getBytes());
			output.flush();
			socket.close();
			

		} catch(Exception e){
			System.out.println(e);
		}
		
	}
}
