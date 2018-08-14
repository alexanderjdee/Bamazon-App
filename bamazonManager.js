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
    runInquiry();
}

function runInquiry(){
    inquirer.prompt([{
        name: "options",
        type: "list",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
        ]
    }]).then(function(answer){
        switch(answer.options){
            case "View Products for Sale":
                viewProducts();
                break;
            
            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addInventory();
                break;

            case "Add New Product":
                addProduct();
                break;

            default:
                console.log("Error: Please try again");
                connection.end();
                break;
        }
    });
}

function viewProducts(){
    var query = "SELECT * FROM products";
    connection.query(query, function (error, result) {
        if (error) throw error;

        console.log("--------------------------------------");
        for (var i = 0; i < result.length; i++) {
            console.log(result[i].item_id + " | " + result[i].product_name + " | " + result[i].department_name + " | " + result[i].price + " | " + result[i].stock_quantity);
        }
        console.log("--------------------------------------");
    });

    connection.end();
}

function viewLowInventory(){
    var query = "SELECT * FROM products";

    connection.query(query, function(error, result){
        if (error) throw error;

        for(i=0; i<result.length; i++){
            if(result[i].stock_quantity < 5){
                console.log(result[i].item_id + " | " + result[i].product_name + " | " + result[i].department_name + " | " + result[i].price + " | " + result[i].stock_quantity);
            }
        }
    });

    connection.end();
}

function addInventory(){
    var query = "SELECT * FROM products";

    connection.query(query, function(error, result){
        if (error) throw error;

        for(i=0; i<result.length; i++){
            console.log(result[i].item_id + " | " + result[i].product_name + " | " + result[i].department_name + " | " + result[i].price + " | " + result[i].stock_quantity);
        }
        inquirer.prompt([{
            name: "itemID",
            type: "input",
            message: "Please enter the id of the product you would like to add to",
        },
        {
            name: "addCount",
            type: "input",
            message: "How many units would you like to add?"
        }]).then(function(answer){
            var query = "SELECT * FROM products WHERE ?";
    
            connection.query(query, {item_id: answer.itemID}, function(error, result){
                if(error) throw error;
    
                var id = result[0].item_id;
    
                var newStockQuantity = parseInt(result[0].stock_quantity) + parseInt(answer.addCount);
                var query = "Update products SET ? WHERE?";
                connection.query(query, [{ stock_quantity: newStockQuantity }, {item_id: id}], function(error, result){
                    if(error) throw error;
                });
                connection.end();
            });
        });
    });
}

function addProduct(){
    inquirer.prompt([{
            name: "itemName",
            type: "input",
            message: "Item Name: "
        },
        {
            name: "itemDepartment",
            type: "input",
            message: "Department: " 
        },
        {
            name: "itemPrice",
            type: "input",
            message: "Price: " 
        },
        {
            name: "itemQuantity",
            type: "input",
            message: "Starting Quantity: " 
        }
    ]).then(function(answer){
        var query = "INSERT INTO products SET ?";

        connection.query(query,
            {
                product_name: answer.itemName,
                department_name: answer.itemDepartment,
                price: answer.itemPrice,
                stock_quantity: answer.itemQuantity
            },
            function(error, result){
                if(error) throw error;
            }
        );
        connection.end();
    });
}

