//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const notifier = require('node-notifier');
const axios = require('axios');

const API_KEY = '7c020dc3c50fdb639f81999630743ff1';
 
//initialize the app as an express app
const app = express();
const router = express.Router();
const { Client } = require('pg');
const bcrypt = require('bcrypt');

//Insiasi koneksi ke database
const db = new Client({
    user: 'basisdatay25',
    host: 'ep-throbbing-shape-154266.ap-southeast-1.aws.neon.tech',
    database: 'WatchYouWant',
    ssl:{
        rejectUnauthorized: false,
        },
    password: 'LBKTf3bXwu9l',
    port: 5432,
})

//Melakukan koneksi dan menunjukkan indikasi database terhubung
db.connect((err)=>{
    if(err){
        console.log(err)
        return
    }
    console.log('Database berhasil terkoneksi')
})

//jalankan koneksi ke database

 
//middleware (session)
app.use(
    session({
        secret: 'ini contoh secret',
        saveUninitialized: false,
        resave: false
    })
);
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

var temp;
 
//ROUTERS
 
// //Router 1: Menampilkan landing page (login/register)
// router.get('/', (req, res) => {
//     temp = req.session;
//     if (temp.username && temp.visits) { //jika user terdaftar maka akan masuk ke halaman admin
//         return res.redirect('/admin');
//     } else { //login / register page
//         temp.visits = 1;
//         res.end(
            
//         );
//     }
// });
 
//Router 2: Melakukan Login
router.post('/login', (req, res) => {
    const {username, password} = req.body
    temp = req.session;
    temp.username = username;
    temp.password = password;
    const query = `SELECT FROM users where username = '${temp.username}'`; //query ambil data user untuk login

    //mengecek informasi yang dimasukkan user apakah terdaftar pada database
    bcrypt.compare(plaintextPassword, hash, function(err, result) {
            if (result) {
                // password is valid
            }
        });
    db.query(query, (err, results) => {
       //tambahkan konfigurasi login di sini
    });
 
});

//router 3: melakukan register akun
router.post('/register', (req, res) => {
    const {username, password} = req.body
    temp = req.session;
    temp.username = username;
    temp.password = password;

    bcrypt.hash(temp.password, 10, (err, hashedPassword) => {
        if (err) {
            notifier.notify('Hash Gagal')
            return;
        }

        //melakukan registrasi user baru ke dalam database
        const query = `INSERT INTO users (username, password) VALUES
        ('${temp.username}', '${hashedPassword}');`

        db.query(query, (err, results) => {
            if(err){
                console.log(err)
                notifier.notify("Register Gagal")
                return
            }
            res.send(`Username : ${req.body.username} berhasil terdaftar`);
        });
    });
    res.end(`Username : ${req.body.username} berhasil terdaftar`);
});

app.delete('/deleteacc', async (req, res) => {
    const {user_id} = req.body
    temp = req.session;
    temp.user_id = user_id;
    try {
      // Delete the user row from the PostgreSQL database based on the user ID
      const query = 'DELETE FROM users WHERE user_id = $1';
      const values = [user_id];

      await db.query(query, values);
  
      res.sendStatus(200); // Send a success status
    } catch (error) {
      console.error('An error occurred while deleting the user:', error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
    }
  });

router.get('/getmovie', async (req, res) => {
    const {search} = req.body
    temp = req.session;
    temp.search = search;
  
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=7c020dc3c50fdb639f81999630743ff1&query=${encodeURIComponent(temp.search)}`);
        const movies = response.data.results;
    
        res.json(movies); // Send the movie data as a JSON response
      } catch (error) {
        console.error('An error occurred while fetching data from the TMDB API:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
      }
  });


router.post('/addfav', async (req, res) => {
const {movie_id, user_id} = req.body
temp = req.session;
temp.movie_ID = movie_id;
temp.user_ID = user_id;

// Make a GET request to OMDB API to fetch movie details
try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${temp.movie_ID}?api_key=7c020dc3c50fdb639f81999630743ff1`);
    const movie = response.data;

    // Insert the movie data into the PostgreSQL database
    const query = 'INSERT INTO fav_movie (user_id, movie_id) VALUES ($1, $2)';
    const values = [temp.user_ID , temp.movie_ID];

    await db.query(query, values);
    res.send(`${movie.title} ditambahkan ke favorit`);
} catch (error) {
    console.error('An error occurred while fetching data from OMDB API or inserting into the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});

router.get('/getfav', async (req, res) => {
const {user_id} = req.body
temp = req.session;
temp.user_ID = user_id;
try {
    // Retrieve the IMDb IDs associated with the user from the PostgreSQL database
    const query = 'SELECT movie_id FROM fav_movie WHERE user_id = $1';
    const values = [user_id];

    const result = await db.query(query, values);
    const movie_IDs = result.rows.map(row => row.movie_id);

    // Fetch movie data from the TMDB API for each IMDb ID and extract the desired fields
    const movies = await Promise.all(movie_IDs.map(async movie_id => {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=7c020dc3c50fdb639f81999630743ff1`);
        const movieData = response.data;
        
        // Extract the desired fields from the movie data
        const { id, title, release_date, overview, poster_path } = movieData;

        return { id, title, release_date, overview, poster_path };
    }));

    res.json(movies); // Send the filtered movie list as a JSON response
    } catch (error) {
    console.error('An error occurred while fetching data from the database or TMDB API:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});
  
router.delete('/removefav', async (req, res) => {
const {movie_id} = req.body
temp = req.session;
temp.movie_ID = movie_id;
try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${temp.movie_ID}?api_key=7c020dc3c50fdb639f81999630743ff1`);
    const movie = response.data;
    // Delete the data from the PostgreSQL database
    const query = 'DELETE FROM fav_movie WHERE movie_id = $1';
    const values = [temp.movie_ID];
    
    await db.query(query, values);
    res.send(`${movie.title} dihapus dari favorit`);
} catch (error) {
    console.error('An error occurred while deleting data from the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});

router.post('/addcomment', async (req, res) => {
const { movie_id, user_id, comment} = req.body; // Get the movie ID, user ID, and comment from the request body
temp = req.session;
temp.user_ID = user_id;
temp.movie_ID = movie_id;
temp.comments = comment;
try {
    // Insert the comment into the PostgreSQL database
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${temp.movie_ID}?api_key=7c020dc3c50fdb639f81999630743ff1`);
    const movie = response.data;
    const query = 'INSERT INTO comments (comment, user_id, movie_id) VALUES ($1, $2, $3)';
    const values = [temp.comments, temp.user_ID, temp.movie_ID];

    await db.query(query, values);
    res.send(`komen pada ${movie.title} berhasil ditambahkan`);
} catch (error) {
    console.error('An error occurred while inserting the comment into the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});

router.delete('/deletecomment', async (req, res) => {
const { comment_id } = req.body; // Get the movie ID, user ID, and comment from the request body
temp = req.session;
temp.comments_ID = comment_id;
try {
    // Delete the comment from the PostgreSQL database
    const query = 'DELETE FROM comments WHERE comment_id = $1';
    const values = [temp.comments_ID];

    await db.query(query, values);
    res.send(`komen berhasil dihapus`);
} catch (error) {
    console.error('An error occurred while deleting the comment from the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});

router.get('/getcomment', async (req, res) => {
const { movie_id } = req.body;
temp = req.session;
temp.movie_id = movie_id;
try {
    // Retrieve the comments and user IDs from the PostgreSQL database based on the movie ID
    const query = `
    SELECT c.comment, c.user_id, u.username
    FROM comments AS c
    JOIN users AS u ON c.user_id = u.user_id
    WHERE c.movie_id = $1
    `;
    const values = [temp.movie_id];

    const result = await db.query(query, values);
    const comments = result.rows;

    res.json(comments); // Send the comments as a JSON response
} catch (error) {
    console.error('An error occurred while fetching data from the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});
  
router.get('/getrating', async (req, res) => {
const { movie_id } = req.body; 
temp = req.session;
temp.movie_id = movie_id;

try {
    // Retrieve the average rating from the PostgreSQL database based on the movie ID
    const query = 'SELECT AVG(rating) AS average_rating FROM ratings WHERE movie_id = $1';
    const values = [temp.movie_id];

    const result = await db.query(query, values);
    const averageRating = result.rows[0].average_rating;

    res.json({ averageRating }); // Send the average rating as a JSON response
} catch (error) {
    console.error('An error occurred while fetching data from the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});

router.post('/addrating', async (req, res) => {
const { user_id, movie_id, rating } = req.body; 
temp = req.session;
temp.user_id = user_id;
temp.movie_id = movie_id;
temp.rating = rating;
try {
    // Store the rating in the PostgreSQL database
    const query = 'INSERT INTO ratings (user_id, movie_id, rating) VALUES ($1, $2, $3)';
    const values = [temp.user_id, temp.movie_id, temp.rating];

    await db.query(query, values);

    res.sendStatus(200); // Send a success status
} catch (error) {
    console.error('An error occurred while storing the rating:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
}
});
  
// // Router 6: merupakan tampilan data ketika login berhasil dilakukan
// router.get('/admin', (req, res) => {
//     temp = req.session;
//     if (temp.username) {
//         res.write(`<html>
//         <head>
//             <title>Modul 9 - SBD</title>
//         </head>
//         <body style="background-color: F8CB2E; text-align: center;">`);
        
//         //tambahkan welcoming beserta username
        
//         res.write(
//         `<a> Jumlah kunjungan ${temp.visits}</a>
//         <h5>Refresh page to increase visits</h5>
//         `
//         );
//         temp.visits++;
//         res.write( // table header
//            `<table id=data_gaming>
//                 <tr>
//                     <th>ID</th>
//                     <th>Nama Game</th>
//                     <th>Jumlah Game</th>
//                 </tr>`
//         );  
//         res.end(`</table></body>
//         <script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
//         <script>
//         alert("berhasil masuk");
//             // Isi konfigurasi delete disini


//             jQuery(document).ready(function($) {
//                 $.post('/getdata', { }, function(data) {
//                     console.log(data);
//                     //melakukan pemanggilan data disini
//                 });
//             });
//             </script>
//         </html>`);
//         console.log('Data Fetch successful');
//         res.write('<a href=' + '/logout' + '>Click here to log out</a>');
//     } 
//     else {
//         res.write('<h1>You need to log in before you can see this page.</h1>');
//         res.end('<a href=' + '/' + '>Login</a>');
//     }
// });
 
//Router 7: mengheapus session
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return console.log(err);
        }
        res.redirect('/');
    });
});
 
app.use('/', router);
app.listen(process.env.PORT || 5555, () => {
    console.log(`App Started on PORT ${process.env.PORT || 5555}`);
});