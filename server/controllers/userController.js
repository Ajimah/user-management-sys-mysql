const mysql2 = require ('mysql2')

const dotenv = require('dotenv')

dotenv.config();


const pool = mysql2.createPool({

    connectionLimit: 100,
    host           :process.env.DB_HOST,
    user           :process.env.DB_USER,
    password       :process.env.DB_PASS,
    database       :process.env.DB_NAME,

   
});


    //find user by search
   exports.view = (req, res) => {
    
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID ' + connection.threadId )
        
        //user the connection
        connection.query('SELECT * FROM user WHERE statuses = "active"', (err, rows) => {
          
            //when done with the connection release it 
            connection.release();
             if(!err){
                let removedUser = req.query.removed;
                res.render('home' ,{rows, removedUser});
             }else{
                console.log(err);
             }

             console.log('the data from user table: \n', rows)

        });

    });


    }


//find user by search

exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID ' + connection.threadId )


        let searchTerm = req.body.search;
       
        connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?',['%'  + searchTerm + '%','%'  + searchTerm + '%', ], (err, rows) => {

            connection.release();
             if(!err){
                res.render('home' ,{rows})
             }else{
                console.log(err);
             }

             console.log('the data from user table: \n', rows)

        });

    });
} 


exports.form = (req, res) => {
    res.render('add-user' )
};


   //add new user 
   exports.create = (req, res) => {
    // Extract values from the request body
    const { first_name, last_name, email, phone, comments } = req.body;
  
   
    // Establish MySQL connection
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error connecting to the database:', err);
        res.status(500).send('Error connecting to the database');
        return;
      }
      
      console.log('Connected as ID ' + connection.threadId);
  
      // Correct SQL query with placeholders
      const query = 'INSERT INTO user (first_name, last_name, email, phone, comments) VALUES (?, ?, ?, ?, ?)';
  
      // Execute the query with the data
      connection.query(query, [first_name, last_name, email, phone, comments], (err, rows) => {
        // Release the connection back to the pool
        connection.release();
  
        if (!err) {
          // Render the 'add-user' page on successful insertion
          res.render('add-user', { alert: 'User added successfully' });
        } else {
          console.error('Error inserting user into the database:', err);
          res.status(500).send('Error inserting user into the database');
        }
  
        console.log('The data from the user table:', rows);
      });
    });
  };


//edit user

   exports.edit = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID ' + connection.threadId )
        
        //user the connection
        connection.query('SELECT * FROM user WHERE user_id = ?', [req.params.user_id], (err, rows) => {
          
            //when done with the connection release it
            connection.release();
             if(!err){
                res.render('edit-user' ,{rows})
             }else{
                console.log(err);
             }

             console.log('the data from user table: \n', rows)

        });

    });

   };




   //update user


   exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID ' + connection.threadId )
        
        //user the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ? ,email = ?, phone = ? , comments = ?,  WHERE user_id = ?', [first_name, last_name, email, phone ,comments, req.params.user_id], (err, rows) => {
          
            //when done with the connection release it
            connection.release();


             if(!err){
                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('connected as ID ' + connection.threadId )
                    
                    //user the connection
                    connection.query('SELECT * FROM user WHERE user_id = ?', [req.params.user_id], (err, rows) => {
                      
                        //when done with the connection release it
                        connection.release();
                         if(!err){
                            res.render('edit-user' ,{rows , alert: `${first_name} has been updated` })
                         }else{
                            console.log(err);
                         }
            
                         console.log('the data from user table: \n', rows)
            
                    });
            
                });



             }else{
                console.log(err);
             }

             console.log('the data from user table: \n', rows)

        });

    });

   };



  

   //delete user from


   exports.delete = (req, res) => {

    // pool.getConnection((err, connection) => {
    //     if (err) throw err;
    //     console.log('connected as ID ' + connection.threadId )
        
    //     //user the connection
    //     connection.query('DELETE FROM user WHERE user_id = ?', [req.params.user_id], (err, rows) => {
          
    //         //when done with the connection release it
    //         connection.release();
    //          if(!err){
    //             res.redirect('/');
    //          }else{
    //             console.log(err);
    //          }

    //          console.log('the data from user table: \n', rows)

    //     });

    // });


        pool.getConnection((err, connection) => {
            if(err) throw err;
            connection.query('UPDATE user SET statuses = ? WHERE user_id = ?', ['removed', req.params.user_id], (err, rows) => {
                connection.release();
                if(!err){

                    let removedUser = encodeURIComponent('User successfully removed');
                    res.redirect('/?removed' + removedUser);
                }else{
                    console.log(err);
                }
                console.log('the data from beer table: \n', rows);
        });
    });

   };



   exports.viewall = (req, res) => {
    
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('connected as ID ' + connection.threadId )
        
        //user the connection
        connection.query('SELECT * FROM user WHERE user_id = ?', [req.params.user_id], (err, rows) => {
          
            //when done with the connection release it 
            connection.release();
             if(!err){
                res.render('view-user' ,{rows});
             }else{
                console.log(err);
             }

             console.log('the data from user table: \n', rows)

        });

    });


    }