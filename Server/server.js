//import packages
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const notifier = require('node-notifier');
const axios = require('axios');
const cors = require('cors');


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
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
var temp;
 
router.post('/login', (req, res) => {
  const { identifier, password } = req.body;
  console.log(req.body);
  const temp = req.session;
  temp.identifier = identifier;
  temp.password = password;

  let query;
  if (identifier && identifier.includes('@')) {
    query = `SELECT * FROM users WHERE email = '${temp.identifier}'`;
  } else {
    query = `SELECT * FROM users WHERE username = '${temp.identifier}'`;
  }

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging in.");
    } else {
      if (results.rows.length > 0) {
        const user = results.rows[0];
        bcrypt.compare(temp.password, user.password, (err, isMatch) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error logging in.");
          } else {
            if (isMatch) {
              res.status(200).send(results.rows[0])
            } else {
              res.status(401).send("Invalid password.");
            }
          }
        });
      } else {
        res.status(401).send("Invalid email/username");
      }
    }
  });
});


router.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    temp = req.session;
    temp.username = username;
    temp.password = password;
    temp.email = email;
    console.log(req.body);
    bcrypt.hash(temp.password, 10, (err, hashedPassword) => {
      if (err) {
        notifier.notify('Hash Gagal');
        return;
      }
  
      // Melakukan registrasi user baru ke dalam database
      const query = `INSERT INTO users (email, username, password) VALUES ('${temp.email}', '${temp.username}', '${hashedPassword}');`;
      db.query(query, (err, results) => {
        if (err) {
          console.log(err);
          notifier.notify("Register Gagal");
          return;
        }
        res.send(`Username: ${req.body.username}, Email: ${temp.email} berhasil terdaftar`);
        res.end();
      });
    });
  });

  app.get('/getuser', async (req, res) => {
    const { identifier } = req.body;
    
      try {
        let query;
        if (identifier.includes('@')) {
          query = `SELECT * FROM users WHERE email = '${identifier}'`;
        } else {
          query = `SELECT * FROM users WHERE username = '${identifier}'`;
        }
        const result = await db.query(query);
        res.json(result.rows[0])
        console.log(result.rows[0]);
      } catch (error) {
        console.error('Error retrieving user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }
  });
  
app.delete('/deleteacc', async (req, res) => {//tambahin delete semua data user
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

router.post('/addstatus', async (req, res) => {
  const {status, user_id} = req.body;
  
  try {
    const result = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await db.query('UPDATE users SET status = $1 WHERE user_id = $2', [status, user_id]);

    return res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error adding/updating status:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getmovie', async (req, res) => {
    const {search} = req.body;
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
  const { movie_id, user_id } = req.body;

  try {
    const selectQuery = 'SELECT movie_ids FROM users WHERE user_id = $1';
    const selectValues = [user_id];
    const selectResult = await db.query(selectQuery, selectValues);

    if (selectResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const movieIds = selectResult.rows[0].movie_ids || [];

    // If the user has no favorite movie list, directly add the movie_id
    if (movieIds.length === 0) {
      const updateQuery = `
        UPDATE users
        SET movie_ids = ARRAY[$1]::integer[]
        WHERE user_id = $2
      `;
      const updateValues = [movie_id, user_id];
      const updateResult = await db.query(updateQuery, updateValues);

      if (updateResult.rowCount === 0) {
        return res.status(400).json({ error: 'Failed to add the movie to favorites' });
      }

      return res.status(200).json({ message: 'Movie successfully added to favorites' });
    }

    // Check if the movie is already in the user's favorite list
    if (movieIds.includes(parseInt(movie_id))) {
      return res.status(400).json({ error: 'Movie is already in favorites' });
    }

    const updateQuery = `
      UPDATE users
      SET movie_ids = array_append(movie_ids, $1::integer)
      WHERE user_id = $2
    `;
    const updateValues = [movie_id, user_id];
    const updateResult = await db.query(updateQuery, updateValues);

    if (updateResult.rowCount === 0) {
      return res.status(400).json({ error: 'Failed to add the movie to favorites' });
    }

    res.status(200).json({ message: 'Movie successfully added to favorites' });
  } catch (error) {
    console.error('An error occurred while updating the favorite movies:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});




router.get('/getfav/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const query = 'SELECT movie_ids FROM users WHERE user_id = $1';
    const values = [user_id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(200).json([]);
    }    

    const movieIDs = result.rows[0].movie_ids;

    if (!Array.isArray(movieIDs) || movieIDs.length === 0 || movieIDs === null) {
      return res.status(200).json([]);
    }    

    const movies = [];

    for (const movieID of movieIDs) {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${API_KEY}`);
      const movieData = response.data;

      const { id, title, release_date, overview, poster_path, genres } = movieData;
      const genreNames = genres.map((genre) => genre.name);
      movies.push({ id, title, release_date, overview, poster_path, genre: genreNames });
    }

    res.json(movies);
  } catch (error) {
    console.error('An error occurred while fetching data from the database or TMDB API:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});


router.delete('/deletefav', async (req, res) => {
    const {movie_id, user_id} = req.body
    temp = req.session;
    temp.movie_ID = movie_id;
    temp.user_ID = user_id;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${temp.movie_ID}?api_key=7c020dc3c50fdb639f81999630743ff1`);
        const movie = response.data;
        // Delete the data from the PostgreSQL database
        const query = `UPDATE users SET movie_ids = array_remove(movie_ids, ${temp.movie_ID}) where user_id = ${temp.user_ID};`;
        
        await db.query(query);
        res.send(`${movie.title} dihapus dari favorit`);
    } catch (error) {
        console.error('An error occurred while deleting data from the database:', error);
        res.status(500).json({ error: 'An error occurred while processing the request' });
    }
});

router.post('/addcomment', async (req, res) => {
const { movie_id, user_id, comment} = req.body; // Get the movie ID, user ID, and comment from the request body

try {
    // Insert the comment into the PostgreSQL database
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=7c020dc3c50fdb639f81999630743ff1`);
    const movie = response.data;
    const query = 'INSERT INTO comments (comment, user_id, movie_id) VALUES ($1, $2, $3)';
    const values = [comment, user_id, movie_id];

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

router.get('/getcomment/:movie_id', async (req, res) => {
  const { movie_id } = req.params;
  try {
    // Retrieve the comments and user IDs from the PostgreSQL database based on the movie ID
    const query = `
      SELECT c.comment AS content, c.user_id, u.username
      FROM comments AS c
      JOIN users AS u ON c.user_id = u.user_id
      WHERE c.movie_id = $1 AND c.reply_id IS NULL
      ORDER BY created_at ASC
    `;
    const values = [movie_id];

    const result = await db.query(query, values);
    const comments = result.rows;

    res.json(comments); // Send the comments as a JSON response
  } catch (error) {
    console.error('An error occurred while fetching data from the database:', error);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});



router.get('/getrating/:movie_id', async (req, res) => {
  const { movie_id } = req.params; 

  try {
      // Retrieve the average rating from the PostgreSQL database based on the movie ID
      const query = 'SELECT AVG(rating) AS average_rating FROM ratings WHERE movie_id = $1';
      const values = [movie_id];

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
  try {
      // Check if the rating already exists for the given user_id and movie_id
      const result = await db.query('SELECT * FROM ratings WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id]);
      
      if (result.rows.length > 0) {
        // If the rating exists, update it
        await db.query('UPDATE ratings SET rating = $1 WHERE user_id = $2 AND movie_id = $3', [rating, user_id, movie_id]);
      } else {
        // If the rating doesn't exist, insert a new row
        await db.query('INSERT INTO ratings (user_id, movie_id, rating) VALUES ($1, $2, $3)', [user_id, movie_id, rating]);
      }
      res.sendStatus(200); // Send a success status
  } catch (error) {
      console.error('An error occurred while storing the rating:', error);
      res.status(500).json({ error: 'An error occurred while processing the request' });
  }
  });
  
//Router 7: mengheapus session
router.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error('Error logging out:', err);
      res.status(500).send("Error logging out.");
    } else {
      res.status(200).send("Logged out successfully.");
    }
  });
});
 
app.use('/', router);
app.listen(process.env.PORT || 3001, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3001}`);
});