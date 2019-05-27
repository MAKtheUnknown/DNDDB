
var mysql = require('mysql'); //imports mysql module

var loginInfo = new Object(); //objects in JavaScript are more like dictionaries

var questions = [
    "host (default localhost): ",
    "user (default root): ",
    "password: "
];
var answers = [];

function ask(i) {
    process.stdout.write(`\n ${questions[i]}`);
    process.stdout.write("\n  >  ");
}

process.stdin.on('data', function(data) {
    console.log('detected data');
    answers.push(data.toString().trim());
    if (answers.length < questions.length) {
        ask(answers.length);
    } else {
        storeLoginInfo();
        process.exit();
    }
});


function storeLoginInfo() {
    console.log("storing login info");
    loginInfo.host = answers[0];
    loginInfo.user = answers[1];
    loginInfo.password = answers[2];
    loginInfo.database = answers[3];
    establishConnection();
}

function establishConnection() {
    console.log("Collected login information: ")
    console.log(loginInfo);
    console.log("Attempting server connection with provided information");
//    var connection = mysql.createConnection(loginInfo);
    var connection = mysql.createConnection({
        host : 'localhost',
        user : 'root',
        password : 'password',
        database: 'dnddb'
    });

    connection.connect(function(err) {
        if (err) {
            console.err("error connecting: " + err.stack);
        }
        console.log('connected as id ' + connection.threadId);
    });

    
    connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].solution);
    });

    if(connection.state === 'connected') {
        console.log("Successfully connected!");
    } else {
        console.log(`Connection unsuccessful: connection state is [${connection.state}]`);
    }
}


ask(0);
/*rl.question("host (default localhost): ", (answer) => { //user input to insert hostname
    console.log(answer);
    loginInfo.host = answer;
    rl.close();
});

rl.question("user (default root): ", (answer) => { //user input to input user name
    loginInfo.user = answer;
    rl.close();
});

rl.question("password: ", (answer) => { //user input to input answer
    loginInfo.password = answer;
    rl.close();
});
*/