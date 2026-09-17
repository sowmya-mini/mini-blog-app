// Import the mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Define the blueprint (schema) for how blog post documents must be structured in MongoDB
const blogPostSchema = new mongoose.Schema({
    // Field for the blog post title
    title: {
        type: String,     // Must be string text data
        required: true    // Mandatory field; MongoDB will throw an error if missing
    },
    // Field for the main body content of the blog post
    content: {
        type: String,     // Must be string text data
        required: true    // Mandatory field; cannot be left blank
    },
    // Field for the author's name
    author: {
        type: String,     // Must be string text data
        required: true    // Mandatory field; every post must have an author name
    },
    // Field to categorize the blog post (e.g., 'React', 'Web Development')
    category: {
        type: String,          // Must be string text data
        default: 'General'     // Optional field; automatically defaults to 'General' if not provided
    },
    // Field to record when the blog post was created
    createdAt: {
        type: Date,            // Must be a valid date/time value
        default: Date.now      // Automatically saves the current exact timestamp when created
    }
});

// Compile the schema into a reusable Mongoose model named 'Post' and export it
// Note: Mongoose automatically creates a plural 'posts' collection in MongoDBAtlas
module.exports = mongoose.model('Post', blogPostSchema);