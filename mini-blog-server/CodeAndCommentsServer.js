// 1. IMPORT NECESSARY PACKAGES & MODELS

// Import Express framework: used for building web servers, routing API endpoints, and handling HTTP requests (GET, POST)
const express = require('express');

// Import Mongoose library: an ODM (Object Data Modeling) library that provides helper methods to interact with MongoDB Atlas
const mongoose = require('mongoose');

// Import CORS (Cross-Origin Resource Sharing): middleware that allows your frontend (port 3000) to communicate with backend (port 5000) without browser security blocks
const cors = require('cors');

const jwt = require('jsonwebtoken');

// Load environment variables: reads the key-value pairs inside your local '.env' file and attaches them to Node's 'process.env' object
require('dotenv').config();

// Import Mongoose Models: schema blueprints that allow us to perform database operations on 'posts' and 'users' collections
const Post = require('./models/post');
const User = require('./models/user');

// 2. INITIALIZE THE EXPRESS APPLICATION
// Creates an instance of an Express application to configure routes, register middleware, and start the server
const app = express();

// 3. SETUP MIDDLEWARES
// Built-in/External Middleware 1: Enables cross-origin request permissions so React can make fetch calls to Express
app.use(cors());

// Built-in Middleware 2: Parses incoming HTTP requests with JSON payloads (e.g., req.body sent from forms) into readable JavaScript objects
app.use(express.json());


// INITIAL SAMPLE DATA FOR SEEDING
// Pre-defined sample posts array used to populate empty MongoDB database instances on initial server start
const samplePosts = [
  {
    title: 'The Great Coffee Spill of 2026',
    content: 'Tried coding without morning coffee today. Lasted exactly 12 minutes before knocking over my iced latte straight onto my desk. The code still compiled, though!',
    author: 'Sowmya',
    category: 'Life & Stories',
    createdAt: '2026-09-01'
  },
  {
    title: 'Why Midnight Coding Hits Different',
    content: 'There is something magical about writing code at 2 AM with dark mode enabled, lo-fi beats playing in the background, and zero notifications distracting you.',
    author: 'Ramya',
    category: 'Thoughts',
    createdAt: '2026-09-03'
  },
  {
    title: 'Top 3 Movies You Must Watch This Weekend',
    content: 'If you need a break from debugging, check out Sci-Fi classics like Interstellar, Inception, and Spider-Man: Into the Spider-Verse. Pure cinematic masterclasses!',
    author: 'Happy',
    category: 'Entertainment',
    createdAt: '2026-09-05'
  },
  {
    title: 'Adventures of Haizel and Leo',
    content: 'Took the dogs to the park today. Leo chased a butterfly for 20 minutes straight while Haizel judged him silently from under the shade of a big oak tree.',
    author: 'Haizel and Leo',
    category: 'Pets & Fun',
    createdAt: '2026-09-08'
  },
  {
    title: 'The Ultimate Recipe for 5-Minute Maggi',
    content: 'Secret technique: Add a slice of cheese, a pinch of chili flakes, and a dash of butter right before taking it off the stove. You will never eat regular Maggi again!',
    author: 'Ginger and Candy',
    category: 'Food & Recipes',
    createdAt: '2026-09-10'
  }
];


// ==========================================
// 4. DEFINE API ROUTES
// ==========================================

/**
 * ROOT TEST ROUTE (GET '/')
 * Used for testing if the backend server is online and running in a browser.
 * 
 * @param {Object} req - The incoming HTTP request object from the client.
 * @param {Object} res - The HTTP response object used to send data back to the client.
 */
app.get('/', (req, res) => {
  // 'res.send()' is a built-in Express method that sends a basic plain-text or HTML response to the browser
  res.send('Mini Blog Backend API is running...');
});

/**
 * GET ALL POSTS ROUTE (GET '/api/posts')
 * Fetches all existing blog post documents from MongoDB Atlas.
 */
app.get('/api/posts', async (req, res) => {
  try {
    // 'Post.find()' is a built-in Mongoose model method that retrieves all documents from the 'posts' collection.
    // '.sort({ createdAt: -1 })' orders the results descending so newest posts appear first (-1 = newest first, 1 = oldest first).
    const posts = await Post.find().sort({ createdAt: -1 });

    // 'res.json()' is a built-in Express method that sends an HTTP 200 (OK) response containing the formatted JSON data
    res.json(posts);
  } catch (error) {
    // 'res.status(500)' sets HTTP status code to 500 (Internal Server Error) if a database query fails
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

/**
 * CREATE NEW POST ROUTE (POST '/api/posts')
 * Receives title, content, author, and category from the client form and creates a new post document in MongoDB Atlas.
 */
app.post('/api/posts', async (req, res) => {
  try {
    // Destructure required properties directly out of the incoming request body object ('req.body')
    const { title, content, author, category } = req.body;

    // Validation Check: Verify that all mandatory fields are present
    if (!title || !content || !author) {
      // 'res.status(400)' returns HTTP status 400 (Bad Request) if required input fields are missing
      return res.status(400).json({ message: 'Title, content, and author are required' });
    }

    // Instantiate a new document instance in memory using our imported Mongoose Post model
    const newPost = new Post({
      title,
      content,
      author,
      category
    });

    // 'newPost.save()' is a built-in Mongoose document method that writes and commits the new document into MongoDB Atlas
    const savedPost = await newPost.save();

    // 'res.status(201)' sets HTTP status 201 (Created) and sends the newly created document back to the React app
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

/**
 * USER REGISTRATION ROUTE (POST '/api/register')
 * Handles new account creation by validating credentials, checking uniqueness, and storing hashed user passwords.
 */
app.post('/api/register', async (req, res) => {
  try {
    // Destructure userName and password from incoming JSON payload
    const { userName, password } = req.body;

    // Input Validation: Check if both input fields exist
    if (!userName || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // 'User.findOne({ userName })' is a built-in Mongoose query method that searches for an existing document with the given username
    const existingUser = await User.findOne({ userName });

    // Duplicate Check: Prevent multiple accounts from sharing identical usernames
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create a new User document instance
    const newUser = new User({ userName, password });

    // 'newUser.save()' triggers the 'pre("save")' hook in models/user.js, automatically hashing the password before inserting into Atlas
    await newUser.save();

    // Respond with success status 201 (Created)
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
});

/**
 * USER LOGIN ROUTE (POST '/api/login')
 * Authenticates users by verifying username existence and comparing submitted passwords against stored bcrypt hashes.
 */
app.post('/api/login', async (req, res) => {
  try {
    // Destructure login credentials from incoming payload
    const { userName, password } = req.body;

    // Field Validation: Verify user entered values in both form fields
    if (!userName || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    // Step 1: Query database to find user document by username
    const user = await User.findOne({ userName });

    // Username Check: If no user document matches the entered username, return error status 401 (Unauthorized)
    if (!user) {
      return res.status(401).json({ success: false,message: 'Invalid Username' });
    }

    // Step 2: Call custom instance method 'comparePassword()' defined on User model (in models/user.js)
    // Uses 'bcrypt.compare()' under the hood to safely evaluate candidate password against stored hash
    const isMatch = await user.comparePassword(password);

    // Password Check: If bcrypt comparison returns false, return error status 401 (Unauthorized)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }

    // JWT TOKEN GENERATION
    // 1. Define Payload: JavaScript object containing non-sensitive user identity information to encode inside the token
    const payload = { userName: user.userName };
    // 'jwt.sign()' is a built-in method from the 'jsonwebtoken' package that creates a signed JWT token string.
    // 
    // PARAMETERS EXPLAINED:
    // 1. payload ({ userName: user.userName }): 
    //    The JavaScript object containing user identity data to encode inside the token.
    // 
    // 2. secret key (process.env.JWT_SECRET || 'MY_SECRET_TOKEN'): 
    //    The secret signature used to encrypt and verify the token's authenticity.
    //    - 'process.env.JWT_SECRET': Securely reads the secret string from your hidden '.env' file.
    //    - Logical OR ('||'): Acts as a safety fallback. If 'JWT_SECRET' is missing in '.env', 
    //      it safely defaults to 'MY_SECRET_TOKEN' so local development won't crash.
    // 
    // OUTPUT:
    // Encodes the payload and secret into a 3-part Base64 URL string (Header.Payload.Signature).
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'MY_SECRET_TOKEN');

    // Step 3: Success response - Return HTTP status 200 (OK) with success status, message, and the generated token
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      jwt_token: jwtToken // Sends token to React frontend so Cookies.set('jwt_token', jwtToken) stores a valid value!
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

/**
 * DELETE POST ROUTE (DELETE '/api/posts/:id')
 * Removes a single blog post document from MongoDB Atlas based on its unique ID.
 * 
 * @param {Object} req - The incoming HTTP request object from the client.
 *   - 'req.params.id' contains the unique MongoDB ObjectId of the post to delete.
 *   - Example: DELETE /api/posts/64f1a2c9e1234567890abcd → req.params.id = "64f1a2c9e1234567890abcd"
 * 
 * @param {Object} res - The HTTP response object used to send data back to the client.
 *   - Returns JSON with success or error messages depending on the outcome.
 */
app.delete('/api/posts/:id', async (req, res) => {
  try {
    // Step 1: Extract the 'id' parameter directly from the request URL
    const { id } = req.params;

    // Step 2: Use Mongoose helper method 'findByIdAndDelete()'
    // - Searches the 'posts' collection for a document with the matching ObjectId
    // - If found, deletes it permanently from MongoDB Atlas
    const deletedPost = await Post.findByIdAndDelete(id);

    // Step 3: Handle case where no post matches the given ID
    if (!deletedPost) {
      // Respond with HTTP 404 (Not Found) if the post does not exist
      return res.status(404).json({ message: 'Post not found' });
    }

    // Step 4: Success response
    // Respond with HTTP 200 (OK) and a success message confirming deletion
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    // Step 5: Error handling
    // Respond with HTTP 500 (Internal Server Error) if database operation fails
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});



// ==========================================
// 5. CONNECT TO MONGODB ATLAS & SEED DATA
// ==========================================

// 'mongoose.connect()' is a built-in Mongoose method that establishes a connection pool to your cloud MongoDB Atlas database
// 'process.env.MONGO_URI' safely reads your hidden MongoDB connection string from your local .env file
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    // Callback executed when connection to MongoDB Atlas successfully opens
    console.log('MongoDB Connected Successfully');

    // 'Post.countDocuments()' is a built-in Mongoose method that counts total existing documents in the 'posts' collection
    const count = await Post.countDocuments();

    // Initial Seeding Logic: If database collection is brand new and empty (0 items), populate it with sample posts
    if (count === 0) {
      // 'Post.insertMany()' is a built-in Mongoose method that performs bulk insertion of an array of objects simultaneously
      await Post.insertMany(samplePosts);
      console.log('Sample posts successfully seeded into MongoDB Atlas!');
    }
  })
  // Catch block triggers if connection credentials or connection string parameters are invalid
  .catch((err) => console.error('MongoDB Connection Error:', err));


// ==========================================
// 6. START THE EXPRESS SERVER
// ==========================================

// Define port number: defaults to process.env.PORT provided by cloud host (e.g., Heroku/Render) or fallback to 5000 for local testing
const PORT = process.env.PORT || 5000;

// 'app.listen()' is a built-in Express method that binds and listens for incoming network connections on the designated port
app.listen(PORT, () => {
  // Output server readiness log message in system terminal console
  console.log(`Backend server running on port ${PORT}`);
});