package com.server.database;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseHandler {

	private String url = "jdbc:mysql://localhost:3306/graphs";
	Runtime runTime = Runtime.getRuntime();
	Connection connection = null;

	public void start() {
		try {
			System.out.println("Starting mysql server");
			runTime.exec("C:\\Users\\karan\\Downloads\\mysql-9.4.0-winx64\\mysql-9.4.0-winx64\\bin\\mysqld.exe");
		} catch(Exception e) {
			System.out.println(e);
		}
	}

	public void stop() {
		try {
			System.out.println("Stopping mysql server");
			runTime.exec("C:\\Users\\karan\\Downloads\\mysql-9.4.0-winx64\\mysql-9.4.0-winx64\\bin>mysqladmin.exe -u root shutdown");
		} catch(Exception e) {
			System.out.println(e);
		}
	}

	public void connect() {
		try {
			System.out.println("Connecting to database");
			connection = DriverManager.getConnection(url, "root", null);
			System.out.println("Database connected");

		} catch (SQLException e) {
			start();
		}
	}

	public void disconnect() {
		try {
			connection.close();
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
				
				System.out.println("username: " + username + " password: " + "password");
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
		dh.readRecord();
	}

}
