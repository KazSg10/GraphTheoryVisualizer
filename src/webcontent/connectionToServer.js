async function postData(tableName, algorithm, sourceNodeName){
			var jsonData = createJSON(tableName, algorithm, sourceNodeName);
			//Submit POST request to the server for processing algorithm input data
			//var promise = fetch("http://localhost:8908/visualize",
			/*
			* JS is a single-threaded language, therefore this asynchronous approach is required
			* to wait response from the server 
			* await causes the thread to wait for the promise to be fulfilled
			* Waiting for Promise<Response> to be fulfilled
			* After fulfilling we will get response of type Response.
			* Any manipulations on object of type "Response" will return a new Promise<Response>
			* for which we need to wait again for it to be fulfilled. All manipulations on 
			* further responses of Promises will continue to return new Promises.	
			*/
			var response = await fetch("http://localhost:8908/visualize",
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
			window.location.href = "loadvisualizer.html";

	}

//Function for creating the json data from the table to pass on to the server
function createJSON(tableName, algorithm, sourceNodeName){
	checkForErrors(tableName, sourceNodeName);

	//Retrieving the table from the DOM
	var table = document.getElementById(tableName);

	//Retrieving the number of rows from the table
	var numberOfRows = table.rows.length;
	
	//Starting to create Json
	var postJSON = "{";
	postJSON += "\"algorithm\"" + ":" + "\"" + algorithm + "\",";
	postJSON+= "\"source node\"" + ":" + "\"" + sourceNodeName + "\",";
	postJSON += "\"connections\"" + ":[";

	/**
	 * A for loop iterating over rows, starting from second row since 
	 * first row consists of headers
	 * */
	for(let rowIndex = 1; rowIndex < numberOfRows; rowIndex++){
		var row = table.rows[rowIndex];
		
		//Retrieving the number of cells in one row
		var cellsCount = row.cells.length;					
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
function bodyfromResponse(text){
	//Splitting text on the basis of new lines
	const textSplit = text.split("\r\n");
	//Body is always at the end of the text
	var body = textSplit[textSplit.length - 1];
	//console.log(body);
	return body;
}

function savingGraphData(){
	createJSON('DFSTable', 'DFS', document.getElementById('dfsSourceNode').value)
}

function checkForErrors(tableName, sourceNodeName){
	var table = document.getElementById(tableName);
	var numberOfRows = table.rows.length;
	const nodesList = [];
	
	for(let rowIndex = 1; rowIndex < numberOfRows; rowIndex++){
		var row = table.rows[rowIndex];
		var cellsCount = row.cells.length;	
		for(let cellIndex = 0; cellIndex < cellsCount; cellIndex++){
			var headerId = tableName + "Header" + (cellIndex).toString();
			var cellId = tableName + rowIndex.toString() + cellIndex.toString();
			var cell = document.getElementById(cellId);

			if(cell == null){
				raiseError("WARNING - There is no value in cell highlighted ", cell);
			}
			if(tableName == "DijkstraGraphTable"){
			 	if(cellIndex % 3){
					if(Number.isInteger(Number(cell.value)) == false){
						raiseError("WARNING - The value in the highlighted cell must be an integer or a decimal followed by 0s");
					}
				}
			}
			if(!nodesList.includes(cell.value)){
				nodesList.push(cell.value);
			}else{
				raiseError("WARNING - Please remove any node duplicates in the graph");
			}
		
		}

		if(!nodesList.includes(sourceNodeName)){
			raiseError("WARNING - The source node is not in the graph");
		}
	}
}

function raiseError(message, cell){
	cell.style.backgroundColor = "yellow";
	const errorDiv = document.createElement("div");

	errorDiv.textContent = message;
	errorDiv.style.backgroundColor = "#ffe0e0";
	errorDiv.style.color = "#b00020";
	errorDiv.style.padding = "12px 16px";
	errorDiv.style.margin = "10px";
	errorDiv.style.border = "1px solid #b00020";
	errorDiv.style.borderRadius = "8px";
	errorDiv.style.fontFamily = "sans-serif";

	document.body.appendChild(errorDiv);

	setTimeout(errorDiv.remove, 3000);
}

function raiseError(message){
	const errorDiv = document.createElement("div");

	errorDiv.textContent = message;
	errorDiv.style.backgroundColor = "#ffe0e0";
	errorDiv.style.color = "#b00020";
	errorDiv.style.padding = "12px 16px";
	errorDiv.style.margin = "10px";
	errorDiv.style.border = "1px solid #b00020";
	errorDiv.style.borderRadius = "8px";
	errorDiv.style.fontFamily = "sans-serif";

	document.body.appendChild(errorDiv);

	setTimeout(errorDiv.remove, 3000);
}



    