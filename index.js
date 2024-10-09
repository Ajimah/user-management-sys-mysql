      
        const express = require("express");
        const  exphbs =require('express-handlebars');
        const bodyParser = require('body-parser');

        const mysql2 = require('mysql2');


        const dotenv = require("dotenv");
        dotenv.config();

        const app = express();

        const port = process.env.PORT || 5000

        app.use(bodyParser.urlencoded({extended: false}));

        app.use(bodyParser.json());

        app.use(express.static('public'));



        const hbs = exphbs.create({ extname: '.hbs' });;

        app.engine('hbs', hbs.engine);
        app.set('view engine', 'hbs');


        //connection pool

        const pool = mysql2.createPool({

            connectionLimit: 100,
            host           :process.env.DB_HOST ,
            user           :process.env.DB_USER,
            password       :process.env.DB_PASS,
            database       :process.env.DB_NAME,

           
        });

        //connect to DB
        pool.getConnection((err, connection) => {
            if (err) throw err;
            console.log('connected as ID ' + connection.threadId );
        });



        const route = require('./server/route/user.js');

        app.use('/', route)




        app.listen(port,() =>{
            console.log("listening on port" + port)
        })