var myDB = window.sqlitePlugin.openDatabase({name: "mySQLite.db", location: 'default'});

myDB.transaction(function(transaction)){
	var executeQuery = "QUERY"
	transaction.executeSql(executeQuery, [],
	function(tx, result){

	},
	function(error){

	}
});

myDB.transaction(function(transaction) {
transaction.executeSql('CREATE TABLE IF NOT EXISTS item_info (id integer primary key, item text, price double, name text, receipt_id integer)', [],
function(tx, result) {
alert("Table created successfully");
},
function(error) {
alert("Error occurred while creating the table.");
});
});


myDB.transaction(function(transaction) {
transaction.executeSql('CREATE TABLE IF NOT EXISTS item_info (id integer primary key, item text, price double, name text, receipt_id integer)', [],
function(tx, result) {
alert("Table created successfully");
},
function(error) {
alert("Error occurred while creating the table.");
});
});

var id="";
var item="";
var price="";
var name="";
var receipt_id="";
myDB.transaction(function(transaction) {
var executeQuery = "INSERT INTO item_info (id,item,price,name,receipt_id) VALUES (?,?,?,?,?,?)";
transaction.executeSql(executeQuery, [id,item,price,name,receipt_id]
, function(tx, result) {
alert('Inserted');
},
function(error){
alert('Error occurred');
});
});

myDB.transaction(function(transaction) {
transaction.executeSql('SELECT name, sum(price) as owed FROM item_info where receipt_id = $RECIPT_ID group by name', [], function (tx, results) {
var len = results.rows.length, i;
$("#rowCount").append(len);
for (i = 0; i < len; i++){
$("#resultList").append("<ons-list-item modifier='longdivider'><div class='center'>" + results.rows.item(i).name+ 
	"</div><div class='right'>" + results.rows.item(i).owed + "</div></ons-list-item");
}
}, null);
});

