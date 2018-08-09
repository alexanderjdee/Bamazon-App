var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (error) {
    if (error) throw error;
    runApp();
});

function runApp() {
    establishConnection();
}

function establishConnection() {
    var query = "SELECT * FROM products";
    connection.query(query, function (error, result) {
        if (error) throw error;

        console.log("--------------------------------------");
        for (var i = 0; i < result.length; i++) {
            console.log(result[i].item_id + " | " + result[i].product_name + " | " + result[i].department_name + " | " + result[i].price + " | " + result[i].stock_quantity);
        }
        console.log("--------------------------------------");

        runInquiry();
    });
}

function runInquiry() {
    inquirer.prompt([{
        name: "itemID",
        type: "input",
        message: "Please enter the id of the product you would like to purchase",
    },
    {
        name: "purchaseCount",
        type: "input",
        message: "How many units would you like to purchase?"
    }]).then(function (answer) {
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, { item_id: answer.itemID }, function (error, result) {
            if (error) throw error;

            var id = result[0].item_id;
            if (result[0].stock_quantity < answer.purchaseCount) {
                console.log("Insufficient quantity!");
            }
            else{
                var totalCost = result[0].price * answer.purchaseCount;
                console.log("The total cost of your purchase is $" + totalCost.toFixed(2));

                var newStockQuantity = result[0].stock_quantity - answer.purchaseCount;
                var query = "Update products SET ? WHERE?";
                connection.query(query, [{ stock_quantity: newStockQuantity }, {item_id: id}], function(error, result){
                   if(error) throw error;
                });
            }

            connection.end();
        });
    });
}