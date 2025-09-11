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

		function createJSON(tableName, algorithm, sourceNodeName){
			var table = document.getElementById(tableName);

			var numberOfRows = table.rows.length;
			var postJSON = "{";
			postJSON += "\"algorithm\"" + ":" + "\"" + algorithm + "\",";
			postJSON+= "\"source node\"" + ":" + "\"" + sourceNodeName + "\",";
			postJSON += "\"connections\"" + ":[";

			for(let rowIndex = 1; rowIndex < numberOfRows; rowIndex++){
				var row = table.rows[rowIndex];
				var cellsCount = row.cells.length;					
				postJSON += "{";
				for(let cellIndex = 0; cellIndex < cellsCount; cellIndex++){
					var headerId = tableName + "Header" + (cellIndex + 1).toString();
					postJSON += "\"" + document.getElementById(headerId).innerText + "\"";
					var cellId = tableName + rowIndex.toString() + cellIndex.toString()
					var cell = document.getElementById(cellId);
					if(cell != null){
						postJSON += ":";
						postJSON += "\"" + cell.value +  "\"";

						if((rowIndex == numberOfRows-1) && (cellIndex == cellsCount-1)){ //Last row's last cell, add only closing curly bracket

								postJSON += "}";
						} else if(cellIndex == cellsCount-1){ //Last cell of any row apart from last row, add curly bracket with comma
								postJSON += "},";
						} else {
								postJSON += ","; //Else add comma
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
    