/**
 * Sending data of the user input graph to the server and then extracting the relevant data from the server sent data
 * @param {*} tableName - Name of table to get the graph data from
 * @param {*} algorithm - Algorithm to be simulated
 * @param {*} sourceNode - Source node in the algorithm
 */
async function postData(tableName, algorithm, sourceNode){
	var jsonData;	
	if(boolDataFromFile(tableName, sourceNode)){
		
		jsonData = document.getElementById("savedJson"+ algorithm).value;
		
		if(!isJson(jsonData)){
			setTimeout(() => {
					window.alert("JSON entered is invalid");
				}, 70);
				return;
		}	
		if(JSON.parse(jsonData).algorithm != algorithm){
			setTimeout(() => {
				window.alert("JSON entered is invalid, make sure the algorithm in this json is the same as the algorithm you are trying to simulate");
			}, 70);
			return;
		}
	}else{
			jsonData = createJSON(tableName, algorithm, sourceNode);
		}
	localStorage.setItem('userJsonBody', jsonData);

	/*
	* Submiting POST request to the server for processing algorithm input data
	*
	* JS is a single-threaded language, therefore this asynchronous approach is required
	* to wait response from the server 
	* await causes the thread to wait for the promise to be fulfilled
	* Waiting for Promise<Response> to be fulfilled
	* After fulfilling we will get response of type Response.
	* Any manipulations on object of type "Response" will return a new Promise<Response>
	* for which we need to wait again for it to be fulfilled. All manipulations on 
	* further responses of Promises will continue to return new Promises.	
	* 
	* Fetch destination changes with local computer's (server's) IP address
	*/
	var response = await fetch("http://192.168.1.194:8908/visualize",
			{
				method:"POST",
				body: jsonData,
				headers: {
					"Content-type": "application/json; charset=UTF-8",
					"Accept": "application/json", 
				}
			});
	//response.json will return a new Promise<Response> which will need to be awaited to be fulfilled
	var bytes = await response.bytes();	
	//Converting the bytes from the server to string 
	var stringResponse = new TextDecoder().decode(bytes);
	console.log(stringResponse);	
	//Getting the body from the response from client
	var body = bodyfromResponse(stringResponse);
	localStorage.setItem('body', body);
	//Going to the loadVisualizer.html page
	window.location.href = "loadvisualizer.html";
}

/**
 * Validating json
 * @param {*} json - json to be validated 
 * @returns boolean value based on if json is valid
 */
function isJson(json){
	try{
		JSON.parse(json);
		return true;
	}catch(e){
		return false;
	}
}


/**
 * Checking if graph data is to be taken from table or savedJson cell
 * @param {*} tableName 
 * @param {*} sourceNode 
 * @returns 
 */
function boolDataFromFile(tableName, sourceNode){
	//Retrieving the contents of the table determined by the table name parameter
	var table = document.getElementById(tableName);
	var numberOfRows = table.rows.length;

	var empty = true;
	for(let rowIndex = 1; rowIndex < numberOfRows; rowIndex++){
		var row = table.rows[rowIndex];	
		var cellsCount = row.cells.length - 1;	

		for(let cellIndex = 0; cellIndex < cellsCount - 1; cellIndex++){

			//Creating a cellId for each cell to detect specific cells which have errors
			var cellId = tableName + rowIndex.toString() + cellIndex.toString();

			//Retrieving that specific cell from DOM
			var cell = document.getElementById(cellId);
			
			if(cellIndex < cellsCount){
				if(cell.value != ""){
					empty = false; 
					return empty;
				}
			}
		}
	}
	//If the values in the graph cells is empty, then the saved json that was input in the savedJson cell is used 	
	sourceNode.value != "" ? empty = false : empty = true;
	return empty;
}

/**
 * Creating the json data from the table to pass on to the server
 * @param {*} tableName - Table to get the data from
 * @param {*} algorithm - Algorithm to be simulated
 * @param {*} sourceNode - Source node in algorithm
 * @returns json to be sent to server
 */
function createJSON(tableName, algorithm, sourceNode){
	//Checking if the values for the graph typed by the user is checked for any errors
	const error = checkForErrors(tableName, sourceNode);
	if(error){
		return null;
	}

	//Retrieving the table from the DOM
	var table = document.getElementById(tableName);

	//Retrieving the number of rows from the table
	var numberOfRows = table.rows.length;
	
	//Starting to create Json
	var postJSON = "{";
	postJSON += "\"algorithm\"" + ":" + "\"" + algorithm + "\",";
	postJSON+= "\"source node\"" + ":" + "\"" + sourceNode.value + "\",";
	postJSON += "\"connections\"" + ":[";

	/**
	 * Retrieving the number of cells in one row
	 * -1 because the last cell of the first row was the source node cell 
	 * and this doesn't need to be read since we are passing this in
	 * */
	var cellsCount = table.rows[0].cells.length - 1;
	
	/**
	 * A for loop iterating over rows, starting from second row since 
	 * first row consists of headers
	 * */
	for(let rowIndex = 1; rowIndex < numberOfRows; rowIndex++){		
		postJSON += "{";	
		//A for loop iterating over the cells in one row
		for(let cellIndex = 0; cellIndex < cellsCount; cellIndex++){
			//Creating the headerId
			var headerId = tableName + "Header" + cellIndex.toString();

			//using the created headerId to retrieve the name of the header
			postJSON += "\"" + document.getElementById(headerId).innerText + "\"";

			//Creating the cellId
			var cellId = tableName + rowIndex.toString() + cellIndex.toString();

			//Retrieving the value of that particular cell using the created cellId
			var cell = document.getElementById(cellId);
			if(cell != null){
				postJSON += ":";
				postJSON += "\"" + cell.value +  "\"";

				//Last row's last cell, add only closing curly bracket
				if((rowIndex == numberOfRows-1) && (cellIndex == cellsCount-1)){ 
						postJSON += "}";

				//Last cell of any row apart from last row, add curly bracket with comma
				} else if(cellIndex == cellsCount-1){ 
						postJSON += "},";
				} else {

					//Else add comma
					postJSON += ","; 
				}
				
			}
		}
	}
	postJSON += "]}";
	console.log(postJSON);
	return postJSON;
}

/**
 * Extracting the json body containing the data for the algorithms and graphs from the server sent data
 * @param {*} text - server sent data
 * @returns json body
 */
function bodyfromResponse(text){
	//Splitting text on the basis of new lines
	const textSplit = text.split("\r\n");
	//Body is always at the end of the text
	var body = textSplit[textSplit.length - 1];
	//console.log(body);
	return body;
}

/**
 * Validation checks on table graph data
 * @param {*} tableName - Table to get the data from
 * @param {*} sourceNode - Source node in algorithm
 * @returns boolean value, if there are no errors then false will be returned, otherwise true
 */
function checkForErrors(tableName, sourceNode){
	var node1List = [];
	var node2List = [];
	//Setting a boolean value to false since no errors have been detected
	var error = false;
	//Retrieving the contents of the table determined by the table name parameter
	var table = document.getElementById(tableName);
	var numberOfRows = table.rows.length;
	//Creating a list to store the pairs of nodes linked by edges of the graph, for use of validation later
	const nodePairs = [];
	/**
	 * The last cell of the second row is the sourceNode (first row is header row), which isn't required as 
	 * we are bringing the sourceNode into the function separately
	 */
	var cellsCount = table.rows[1].cells.length - 1;	
	/**
	 * Creating a for loop to iterate over all the rows in the graph table to detect any
	 * errors in any of the rows
	 * Starting with row 1 since row 0 is the row of headers
	 */
	for(let rowIndex = 1; rowIndex < numberOfRows; rowIndex++){
		//Getting the cell elements for node1 and node2
		node1Cell = document.getElementById(tableName + rowIndex.toString() + "0");
		node2Cell = document.getElementById(tableName + rowIndex.toString() + "1");
		
		/**
		 * Resetting each cell's colour to white so it is updated with a value when going for another check to show it is right now
		 * If the value is still invalid then the cell will be coloured again	
		 */
		node1Cell.style.backgroundColor = "white";
		node2Cell.style.backgroundColor = "white";
		//Setting the node values equal to variables for use of validation later
		var node1Value = node1Cell.value;
		var node2Value = node2Cell.value;

		node1List.push(node1Value);
		node2List.push(node2Value);
		//If node1 and node2 is the same in a row, then there a is same node error
		if(node1Value == node2Value && node1Value != "" && node2Value != ""){
			errorBoxCell("same nodes", node1Cell, node2Cell);
			error = true;
		}
		
		//initialising a direction variable which will be updated later 
		var direction = "";
		/**
		 * The first row has the source node, which is passed in so the last cell does not
		 * need to be read 
		 */
		for(let cellIndex = 0; cellIndex < cellsCount; cellIndex++){
			//Creating a cellId for each cell to detect specific cells which have errors
			var cellId = tableName + rowIndex.toString() + cellIndex.toString();
			//Retrieving that specific cell from DOM
			var cell = document.getElementById(cellId);
			/**
			 * Resetting each cell's colour to white so it is updated with a value when going for another check to show it is right now
			 * If the value is still invalid then the cell will be coloured again	
			 */
			if(cellIndex!=0 && cellIndex!=1){
				cell.style.backgroundColor = "white";
			}		
			//Cell empty error if the cell is empty
			if(cellIndex == 0 || cellIndex == 1){
				if(cell.value == ""){
					errorBoxCell("cell empty", cell, null);
					error = true;
				}
			}
			if(tableName == "DijkstraGraphTable"){
				//Validating the weight value
				if(cellIndex == 2){
					if(cell.value == "" || Number.isInteger(Number(cell.value)) == false || Number(cell.value) <= 0){
						errorBoxCell("weight error", cell, null);
						error = true;
					}
				}	
			}
			//The direction cell position is in another cell in the Dijsktra graph compared to the DFS and BFS graphs
			if(tableName == "DijkstraGraphTable"){
				//Setting the direction value to a variable for validation use later 
				direction = document.getElementById(tableName + rowIndex.toString() + "3").value;
			}else{
				//Setting the direction value to a variable for validation use later 
				direction = document.getElementById(tableName + rowIndex.toString() + "2").value;
			}	
			/**
			 * Error checking for duplicate edges
			 */
			if(cellIndex == 1){
				if(node1Value != "" && node2Value != "" && !edgeChecker([node1Value, node2Value], nodePairs) && !edgeChecker([node2Value, node1Value], nodePairs)){
					nodePairs.push([node1Value, node2Value]);
					if(direction ==  "BIDIRECTION")  nodePairs.push([node2Value, node1Value]);
				}else if(edgeChecker([node1Value, node2Value], nodePairs)){
					errorBoxCell("duplicate", node1Cell, node2Cell);
					error = true;
				}
			}	
		}			
	}	

	//Error checking for empty source node cell or no source node in the graph data
	sourceNode.style.backgroundColor = "white";
	var sourceNodeError = true;
	for(const node1Value of node1List){
		if(node1Value == sourceNode.value){
			sourceNodeError = false;
		}
	}
	for(const node2Value of node2List){
		if(node2Value == sourceNode.value){
			sourceNodeError = false;
		}
	}
	
	if(sourceNodeError){
		errorBoxCell("source node error", sourceNode, null);
		error = true;	
	}
	return error;
}
	
/**
 * Validation check for duplicate edges
 * @param {*} param0 - Pair of nodes to be checked
 * @param {*} nodePairs - Array of pairs of nodes
 * @returns boolean value, true if the edge exists, otherwise false
 */
function edgeChecker([node1, node2], nodePairs){
	
	var included = false;
	for(const [node1Value, node2Value] of nodePairs){
		if(node1 == node1Value && node2 == node2Value){
			included = true;
			return included
		}
	}
	return included;
}

/**
 * Results of different error 
 * @param {*} error - Type of error
 * @param {*} cell1 
 * @param {*} cell2 
 */
function errorBoxCell(error, cell1, cell2){
	var cell1Colour;
	var cell2Colour;
	var message;
	if(error == "same nodes"){
		message = "WARNING - Please do not add the same nodes in the node 1 and node 2 cells in an edge, this error is highlighted purple";
		cell1Colour = "purple";
		cell2Colour = "purple";
	}else if(error == "duplicate"){
		message = "WARNING - Please remove any duplicate edges in the graph, these are shown in the cells highlighted blue";
		cell1Colour = "blue";
		cell2Colour = "blue";
	} else if(error == "cell empty"){
		message = "WARNING - There is no value in cell highlighted yellow";
		cell1Colour = "yellow"
		cell2Colour = "white";
	} else if(error == "source node error"){
		message = "WARNING - Source node is not in the graph; this is highlighted red";
		cell1Colour = "red";
		cell2Colour = "white";
	} else if(error == "weight error"){
		message = "WARNING - The value in the green highlighted cell must be greater than 0, and an integer or a decimal followed by 0s";
		cell1Colour = "green";
		cell2Colour = "white";
	}
	if(cell1 != null){
		cell1.style.backgroundColor = cell1Colour;
	}
	if(cell2 != null){
		cell2.style.backgroundColor = cell2Colour;
	}
	//Waiting after colouring of cells before showing window alert message
	setTimeout(() => {
		window.alert(message);
	}, 70);
}
