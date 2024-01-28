
const express = require('express')
const mysql = require('mysql')
const app = express()
const bodyParser = require('body-parser')
// const cors = require('cors')

app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
// app.use(cors())
const connection = mysql.createConnection({
    host:'localhost',
    port: 3306,  
    database:'laravel',
    user:'root',
    password:''
})

function fetchData(sql,fields){
    return new Promise((resolve,reject)=>{
        connection.query(sql, (error, results, fields) => {
            if (error) {
                reject(error.message);
            }
            console.log("Printing the result")
            console.log(results)
            // resp.send(results)
            resolve(results)
        });
    })
}

function insertData(sql,fields){
    return new Promise((resolve,reject)=>{
        connection.query(sql,[fields], (error, results, field) => {
            if (error) {
                reject(error.message);
            }
            
            console.log("Printing the result")
            console.log(results)
            // resp.send(results)
            resolve(results)
        });
    })
}

function updateData(sql,fields){
    return new Promise((resolve,reject)=>{
        console.log("Updating query")
        console.log(fields)
        connection.query(sql,fields, (error, results, field) => {
            if (error) {
                console.log(error)
                reject(error.message);
            }
            
            console.log("Printing the result")
            console.log(results)
            // resp.send(results)
            resolve(results)
        });
    })
}

app.options('*',(req,resp)=>{
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    resp.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
    resp.setHeader('Access-Control-Allow-Headers','*');
    resp.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    resp.writeHead(204);
    resp.end();
    
})

app.post('/update',async(req,resp)=>{
    let errors = validate(req)
    if(errors && errors.length==0){
    
        let name = req.body.name
        console.log("Check1")
        console.log(req.body)
        
        if(name!=undefined && name!=null){
            let score = Number(req.body.reactjs) + Number(req.body.nodejs)
            let stmt = `update try1 set name=?,email=?,phone=?,qualification=?,currentstatus=?,expectedsalary=?,nodejs=?,reactjs=?,totalscore=? where id =? `;
            let fields = [
                name,req.body.email,req.body.phone,req.body.qualification,req.body.currentstatus,req.body.expectedsalary,
                req.body.nodejs,req.body.reactjs,score,req.body.id,
            ];
            await updateData(stmt,fields)
        }
    }
    let data = {}
    data.errors = errors
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    resp.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
    resp.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    if(errors && errors.length>0){
        resp.writeHead(400);
    } else {
        resp.writeHead(200);
    }
    resp.end(JSON.stringify(data, null));
})

app.post('/insert',async(req,resp)=>{
    
    let name = req.body.name
    /**
     * name:name, email:email,phone:phone,qualification:qualification,currentstatus:currentStatus,expectedsalary:expectedSalary,
            nodejs:nodeJs,reactjs:reactJs,totalscore
     */
    let errors = validate(req)
    if(errors && errors.length==0){
        if(name!=undefined && name!=null){
            let score = Number(req.body.reactjs) + Number(req.body.nodejs)
            let stmt = `INSERT INTO try1(name,email,phone,qualification,currentstatus,expectedsalary,nodejs,reactjs,totalscore) VALUES ?`;
            let fields = [
                [name,req.body.email,req.body.phone,req.body.qualification,req.body.currentstatus,req.body.expectedsalary,
                req.body.nodejs,req.body.reactjs,score]

            ];
            // let stmt = `INSERT INTO try1(name,email) VALUES ?`;
            // let fields = [
            //     [name,name]
            // ];
            await insertData(stmt,fields)
        }
        //
    } else {
        //
    }
    let data = {}
    data.errors = errors
    resp.setHeader("Content-Type", "application/json");
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    resp.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
    resp.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    if(errors && errors.length>0){
        resp.writeHead(400);
    } else {
        resp.writeHead(200);
    }
    resp.end(JSON.stringify(data, null));
})


function validate(req){
    //check for mandatory values
    let errors = []
    console.log(req.body)
    
    if(req.body.name!=undefined && req.body.email!=undefined && req.body.phone!=undefined && req.body.qualification!=undefined 
        && req.body.currentstatus!=undefined && req.body.expectedsalary!=undefined && 
        req.body.nodejs!=undefined && req.body.reactjs!=undefined){

    } else {
        errors.push("Mandatory fields are required")
    }
    if(req.body.name!=undefined && req.body.name.length>255){
        errors.push("Maximum limit of name is 255 characters")
    }
    if(req.body.email!=undefined && req.body.email.length>255){
        errors.push("Maximum limit of email is 255 characters")
    }
    let pattern = /^\+[1-9]{1}[0-9]{3,14}$/
    if(req.body.phone!=undefined && (req.body.phone.length>15 || req.body.phone.match( pattern ))){
        errors.push("Phone no should be of proper format")
    }
    
    if(req.body.expectedsalary!=undefined && !parseInt(req.body.expectedsalary) && req.body.expectedsalary!=0){
        errors.push("Expected Salary should be of proper format")
    }
    return errors
}

app.post('/fetch',async (req,resp)=>{
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
    resp.setHeader('Access-Control-Allow-Headers','Origin, Content-Type, X-Auth-Token');
    resp.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    // await connection.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    //   })
    let sql = `SELECT * FROM try1`;
    let result = await fetchData(sql)
    resp.setHeader("Content-Type", "application/json");
    resp.writeHead(200);
    resp.end(JSON.stringify(result, null));
    //resp.send("<html>hello</html>")
    
})

app.listen("3001",()=>{
    console.log("Server started")
    
})