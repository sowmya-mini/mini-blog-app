// Import the Mongoose library to interact with MongoDB collections using schemas and models
const mongoose = require('mongoose');

// Import the bcryptjs library for generating salts, hashing passwords, and comparing credentials securely
const bcrypt = require('bcryptjs');

// Create a new Mongoose Schema to define the structure and validation rules for User documents in MongoDB
const userSchema = new mongoose.Schema(
  {
    // Define the 'userName' field in the schema
    userName: {
      type: String,     // Must be a text string
      required: true,   // Field is mandatory; saving fails if missing
      unique: true,     // Creates a unique index in MongoDB to prevent duplicate usernames
      trim: true        // Automatically removes leading and trailing whitespace before saving (e.g., " mini " -> "mini")
    },
    // Define the 'password' field in the schema
    password: {
      type: String,     // Must be a text string (stores the bcrypt hash, not plain text)
      required: true    // Field is mandatory
    }
  },
  { 
    // Schema Option: automatically adds 'createdAt' and 'updatedAt' ISO timestamp fields to every document
    timestamps: true 
  }
);

/**
 * PRE-SAVE HOOK (Middleware)
 * //pre is a built-in Mongoose method (a middleware registration function).
 * //save is the name of the Mongoose document event/action being targeted.
 * Runs automatically right BEFORE a user document is saved to the database (e.g., user.save()).
 * 
 * Note: Uses standard 'function ()' instead of an arrow function '() => {}' 
 * so that 'this' points directly to the current user document being saved.
 */
userSchema.pre('save', async function () {
  // Check if the password field was modified (new user creation or password update).
  // If the password hasn't changed (e.g., updating user email), exit early to avoid re-hashing an already hashed password.
  if (!this.isModified('password')) return;

  // 1. SALT GENERATION:
  // 'bcrypt.genSalt(10)' is a built-in method from the 'bcryptjs' package.
  // It generates a unique, random string of cryptographic data (the "Salt").
  // The number 10 is the "cost factor" (10 rounds = 2^10 = 1,024 iterations), which slows down potential attackers trying to guess passwords.
  // We store this generated random string in our local variable named 'salt'.
  const salt = await bcrypt.genSalt(10);

  // 2. PASSWORD HASHING USING THE SALT:
  // 'bcrypt.hash()' is a built-in method from 'bcryptjs'.
  // It takes two parameters: (1) your plain-text password ('this.password') and (2) the random 'salt' string created above.
  // It combines them to produce a secure, irreversible 60-character hash string (e.g., "$2b$10$b/WqcN...").
  // We then overwrite 'this.password' with this newly generated hash before saving it to the database.
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * CUSTOM INSTANCE METHOD
 * Adds a helper function to user instances (e.g., user.comparePassword('myPassword')) to check credentials during login.
 * 
 * @param {string} candidatePassword - The plain-text password entered by the user in the login form.
 * @returns {Promise} - Resolves to true if passwords match, or false if they do not.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  // 'bcrypt.compare()' is a built-in method from 'bcryptjs'.
  // It extracts the salt embedded inside 'this.password', hashes 'candidatePassword' with that same salt, 
  // and returns true if the resulting hash matches 'this.password', or false if it does not.
  return await bcrypt.compare(candidatePassword, this.password);
};

// Compile the schema into a Mongoose Model named 'User' (MongoDB will create/use a collection named 'users')
// and export it so it can be imported in server.js or API routes
module.exports = mongoose.model('User', userSchema);