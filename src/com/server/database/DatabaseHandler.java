package com.server.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseHandler {

	private String url = "jdbc:mysql://localhost:3306/GraphsVisualizer";
	Runtime runTime = Runtime.getRuntime();
	Connection connection = null;
	
	final static String username = "root";
	final static String password = "p&=0cBc/ogshq";
	
	public void start() {
		try {
			runTime.exec("\"C:\\Users\\karan\\mysql\\bin\\mysqld.exe\"");
			System.out.println("Started mysql server");
		} catch(Exception e) {
			System.out.println(e);
		}
		this.connect();
	}
	
	//Function for creating the database and table - only needed to be called once
	public static void createDatabase() {
		try(Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/", username, password)){
			Statement stmt = conn.createStatement();
			stmt.executeUpdate("DROP DATABASE GraphsVisualizer");
			System.out.println("Deleted database");
			String sql = "CREATE DATABASE GraphsVisualizer";
			stmt.executeUpdate(sql);
			System.out.println("Database created successfully");
			stmt.executeUpdate("USE graphsvisualizer");
			sql = """
					CREATE TABLE user_graphs_json (
					user_key VARCHAR(10) PRIMARY KEY,
					graph_json TEXT
					);
				""";
			stmt.executeUpdate(sql);
			System.out.println("Created table");
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void stop() {
		try {
			System.out.println("Stopping mysql server");
			runTime.exec("\"C:\\Users\\karan\\mysql\\bin\\mysqld.exe\" -u root shutdown");
		} catch(Exception e) {
			System.out.println(e);
		}
	}

	public void connect() {
		try {
			System.out.println("Connecting to database");
			connection = DriverManager.getConnection(url, username, password);
			System.out.println("Database connected successfully");

		} catch (SQLException e) {
			System.out.println(e.getMessage());
		}
	}

	public void disconnect() {
		try {
			connection.close();
			System.out.println("Disconnected from database");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}



	public void readRecord() {
		Statement statement = null; 
		ResultSet result = null;
		String sqlQuery = null;
		try {
			statement = connection.createStatement();
			sqlQuery = "SELECT * FROM user WHERE username = \"Karan\"";
			result = statement.executeQuery(sqlQuery);
			
		
			while(result.next()) {
				String username = result.getString("username");
				String password = result.getString("password");
				
				System.out.println("username: " + username + " password: " + password);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public void addRecord() {
		
	}
	
	
	public static void main(String[] args) {
		DatabaseHandler dh = new DatabaseHandler();
		dh.start();
		dh.connect();
		//createDatabase();
		//dh.readRecord();
		dh.disconnect();
		dh.stop();
		
		
		
		
		
		
	}

}
