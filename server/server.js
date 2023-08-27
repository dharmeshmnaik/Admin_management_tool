var express = require('express');
const app = express();
var mysql2 =  require('mysql2');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
var multer = require('multer');
var path = require('path');


app.use(cors(
    {
        origin: ["http://localhost:3000"],
        methods: ["POST", "GET", "PUT"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const con = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "login"
})

/*const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})*/

/*const upload = multer({
    storage: storage
})*/

con.connect(function(err) {
    if(err) {
        console.log("Error in Connection "+ err);
    } else {
        console.log("Connected");
    }
})

app.get('/getEmployee', (req, res) => {
    const sql = "SELECT * FROM employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.get('/get/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM employee where id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "Get employee error in sql"});
        return res.json({Status: "Success", Result: result})
    })
})

app.put('/update/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set contact = ?, email = ?, comment = ?, oldemail = ?, oldcontact = ? WHERE id = ?";
    con.query(sql, [req.body.contact, req.body.email, req.body.comment, req.body.oldemail, req.body.oldcontact, id], (err, result) => {
        if(err) return res.json({Error: "update employee error in sql"});
        console.log(result)
        return res.json({Status: "Success"})
    })
})
app.put('/updateapproval/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set oldemail = ?, oldcontact = ?, comment = ? WHERE id = ?";
    con.query(sql, [req.body.oldemail, req.body.oldcontact, req.body.comment, id], (err, result) => {
        if(err) return res.json({Error: "update employee error in sql"});
        console.log(result)
        return res.json({Status: "Success"})
    })
})
app.put('/updateemployee/:id', (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE employee set contact = ?, email = ?,oldemail = ?, oldcontact = ?, comment = ? WHERE id = ?";
    con.query(sql, [req.body.contact, req.body.email,req.body.oldemail, req.body.oldcontact, req.body.comment, id], (err, result) => {
        if(err) return res.json({Error: "update employee error in sql"});
        console.log(result)
        return res.json({Status: "Success"})
    })
})
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM employee WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Error: "delete employee error in sql"});
        return res.json({Status: "Success"})
    })
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if(!token) {
        return res.json({Error: "You are no Authenticated"});
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) return res.json({Error: "Token wrong"});
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        } )
    }
}

app.get('/dashboard',verifyUser, (req, res) => {
    return res.json({Status: "Success", role: req.role, id: req.id})
})

app.get('/adminCount', (req, res) => {
    const sql = "Select count(id) as admin from users";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})
app.get('/employeeCount', (req, res) => {
    const sql = "Select count(id) as employee from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})

app.get('/salary', (req, res) => {
    const sql = "Select sum(salary) as sumOfSalary from employee";
    con.query(sql, (err, result) => {
        if(err) return res.json({Error: "Error in runnig query"});
        return res.json(result);
    })
})

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users Where email = ? AND  password = ?";
    //console.log(JSON.stringify)
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
            const id = result[0].id;
            const token = jwt.sign({role: "admin"}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
            return res.json({Status: "Success"})
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
    })
})

app.post('/employeelogin', (req, res) => {
    const sql = "SELECT * FROM employee Where email = ? AND  password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
            //const id = result[0].id;
            const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
            res.cookie('token', token);
            return res.json({Status: "Success",id: result[0].id })
        } else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }
        /*if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
        if(result.length > 0) {
            bcrypt.compare(req.body.password.toString(), result[0].password, (err, response)=> {
                if(err) return res.json({Error: "password error"});
                if(response) {
                    const token = jwt.sign({role: "employee", id: result[0].id}, "jwt-secret-key", {expiresIn: '1d'});
                    res.cookie('token', token);
                    return res.json({Status: "Success", id: result[0].id})
                } else {
                    return res.json({Status: "Error", Error: "Wrong Email or Password"});
                }
                
            })
            
        } 
        else {
            return res.json({Status: "Error", Error: "Wrong Email or Password"});
        }*/
    })
})



app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
})

app.post('/create', (req, res) => {
    const sql = "INSERT INTO employee (`name`,`email`,`password`,`contact`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.body.contact
        
    ]
    con.query(sql, [values], (err, result) => {
        console.log(`server - ${values}`)
        if(err) return res.json({Error: "Inside singup query"});
        console.log(JSON.stringify(result))
        return res.json({Status: "Success"});
    })
})

app.listen(7500, ()=> {
    console.log("Running");
})
