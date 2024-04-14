const bodyParser = require('body-parser')
const exp = require("express");
const app = exp();
app.use(bodyParser.json())

app.listen(3000,function(){
    console.log("Start Server.");
})

const mysql = require('mysql');

let con = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    port : '3306',
    database : 'test_rank'
});

app.get("/Get",function(req,res,nex){
    con.query("SELECT * FROM RANK",function(e,r){
            console.log(r);
            responseGet(res,"OK",r);
    })
})

app.post("/Post",function(req,res,nex){
    let b = req.body;
    console.log("POST Receive. req.body=["+b.id+","+b.action+","+b.name+","+b.score+"]");
    database_action(res,b.id,b.action,b.name,b.score);
})

function database_action(res,id,action,name,score){
     switch(action){
         case "ADD":
             console.log("Run Query : INSERT INTO RANK VALUES("+id+","+name+","+score+",now())");
             con.query("INSERT INTO RANK VALUES('"+id+"','"+name+"',"+score+",now())",function(e,r){
                if(e) responsePost(res,"ERROR",null);
                else responsePost(res,"OK",null);
            })
         break;
     }
}

function responseGet(res,result,data){
    let resJson = {status:result,data:data.sort(scoreCompare)};
    console.log("resJson.data:"+resJson.data);
    res.json(resJson);
}

function responsePost(res,result,data){
    let resJson = {status:result,data:data};
    res.json(resJson);
}

function scoreCompare(a,b){
    let r = 0;
    console.log("a:"+a+" b:"+b);
    console.log("a.score:"+a.score+" b.score:"+b.score);
    if(a.score < b.score){r = -1;}
    else if(a.score > b.score){r = 1;}

    console.log("r:"+r);
    return r;
}