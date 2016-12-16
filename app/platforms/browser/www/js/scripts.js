(function() {



	document.addEventListener('deviceready', function(event) {
		event.preventDefault();
		console.log("cordova checked...device ready");


		document.addEventListener('init', onsInit, false);
	
		var Splitrdb;
    	var table1 = "bill_table";
		var map;

		function onsInit(e) {
			var page = e.target.id;
			//console.log("page event="+=page);

			document.getElementById('cameraPhoto').addEventListener('click', getPhoto, false);
		}

		function onSuccess(imageData) {
			console.log('success - js call');
			var image = document.getElementById('imageView');
			image.src = imageData;
			var imageReceiptId = document.getElementById('photoReceiptId');
			addPic(image.src, imageReceiptId);
			console.log(imageData);
		}

		function onFail(message) {
				console.log('Failed because: ' + message);
		}

		function getPhoto() {
			navigator.camera.getPicture(onSuccess, onFail, {
				quality: 50,
				correctOrientation: true,
				sourceType: Camera.PictureSourceType.CAMERA,
				destinationType: Camera.DestinationType.FILE_URI
			});
			console.log("camera button clicked...");
		}

		//loader function after deviceready event returns
		function onDeviceReady() {
      //open db connection - create db if not available
      Splitrdb = window.sqlitePlugin.openDatabase(
        {
          name: "SplitrDB.db",
          location: 'default'
        });

      //create table
      createTable(table1);

      //add data to table
      var tableData = {
        item: "mozerella sticks",
        price: "4.99",
        name: "Sam",
        receipt_id: "12345",
        pic_uri: ""
      }
      addData(table1, tableData);
		}

    function createTable(table) {
      //create table for db
      Splitrdb.transaction(function(transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS '+table1+' (id integer primary key, item text, price double, name text, receipt_id integer,pic_uri text)', [],
        function(tx, result) {
          console.log("table created successfully");
        },
        function(error) {
          console.log("error creating table.");
        });
      });
    }

    function addData(table, data) {
      var item = data.item;
      console.log(item);  
      var price = data.price;
      console.log(price);
      var name = data.name;
      console.log(name);
      var receipt_id = data.receipt_id;
      //add data to table - test_table
      Splitrdb.transaction(function(transaction) {
        var executeQuery = 'INSERT INTO '+table1+' (item, price,name,receipt_id) VALUES (?,?,?,?)';
        transaction.executeSql(executeQuery, [item,price,name,receipt_id],
          function(tx, result) {
          console.log('success - data inserted into table');
          },
          function(error){
            console.log('error - data not inserted into table');
        });
      });
    }

    function addPic(table,data){
      var pic_uri = "";
      console.log(pic_uri);
      Splitrdb.transaction(function(transaction){
        var executeSql = "UPDATE "+table1+" set pic_uri = " + pic_uri + " where receipt_id = " + receipt_id; 
        transaction.executeSql(executeSql,[pic_uri],
          function(tx,result){
            console.log('success - data updates in table');
          },
          function(error){
            console.log('error - data not updated in table');
          });
        });

    }

    //view all data in table
    function viewDataAll(table) {
      console.log("view data all...");
      Splitrdb.transaction(function(transaction) {
        transaction.executeSql('SELECT * FROM '+table1, [], 
    	function (tx, results) {
          var resLen = results.rows.length;
          console.log("table results="+JSON.stringify(results));
          for (i = 0; i < resLen; i++){
            console.log("id="+results.rows.item(i).id+"-item="+results.rows.item(i).item+"-price="+results.rows.item(i).price+"-name="+results.rows.item(i).name+"-receipt_id"+results.rows.item(i).receipt_id);
            $("#data-output").append("<p>id="+results.rows.item(i).id+"-item="+results.rows.item(i).item+"-price="+results.rows.item(i).price+"-name="+results.rows.item(i).name+"-receipt_id"+results.rows.item(i).receipt_id)
          }
        }, function(error){
        	console.log("error - viewDataAll");
        });
      });
    }

    
    
	function viewDataReceipt(table) {
		var receipt_id = document.getElementById("#idSearch").value;
		console.log("receipt: " + receipt_id);
		Splitrdb.transaction(function(transaction){
			var query = 'SELECT name, sum(price) as owed where receipt_id = ' + receipt_id + 'group by name';
			transaction.executeSql(query, [name,owed],
			function(tx,results) {
				var resLen = results.rows.length;
				for (i = 0; i < resLen; i ++) {
					console.log("name: " + results.rows.item(i).name + " owed = $" + results.rows.item(i).owed);
					$("#resultList").append("<ons-list_item modifier='longdivider'><div class='center'>" + results.rows.item(i).name + "</div><div class='right>" + results.rows.item(i).owed + "</div></ons-list-item>");}
				}, function(error) {
					console.log("error - viewDataReceipt");
				});
			});
		}
		
	


}, false);
})();

