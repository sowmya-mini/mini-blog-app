// refer CodeAndCommentsServer.js file for understanding why and what have been used 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const Post = require('./models/post');
const User = require('./models/user');

const app = express();
app.use(cors());
app.use(express.json());

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

app.get('/', (req, res) => {
  res.send('Mini Blog Backend API is running...');
});

app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
});

app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author, category } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ message: 'Title, content, and author are required' });
    }
    const newPost = new Post({ title, content, author, category});
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error: error.message });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const newUser = new User({ userName, password });
    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid Username' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid Password' });
    }
    const payload = { userName: user.userName };
    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET || 'MY_SECRET_TOKEN');
    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      jwt_token: jwtToken
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during login', error: error.message });
  }
});

app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(200).json({ message: 'Post deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting post', error: error.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected Successfully');
    const count = await Post.countDocuments();
    if (count === 0) {
      await Post.insertMany(samplePosts);
      console.log('Sample posts successfully seeded into MongoDB Atlas!');
    }
  })
  .catch((err) => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
