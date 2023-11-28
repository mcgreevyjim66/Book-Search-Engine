// Importing the mongoose module, which is an ODM (Object Data Modeling) library for MongoDB and Node.js.
// It manages relationships between data, provides schema validation, and is used to translate between objects in code and the representation of those objects in MongoDB.
const mongoose = require('mongoose');

// Connecting to the MongoDB database using mongoose.
// 'process.env.MONGODB_URI' is an environment variable that should contain the URI of your MongoDB database.
// If 'process.env.MONGODB_URI' is not set (i.e., it's undefined), the connection falls back to a default local MongoDB server at 'mongodb://127.0.0.1:27017/googlebooks'.
// The string 'mongodb://127.0.0.1:27017/googlebooks' is a standard MongoDB URI where:
// - 'mongodb://' is the protocol specification,
// - '127.0.0.1' is the local IP address (localhost),
// - '27017' is the default port for MongoDB,
// - 'googlebooks' is the name of the database to which we are connecting.
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks');

// Exporting the mongoose connection object.
// This allows other files in the application to import and use this established database connection.
module.exports = mongoose.connection;
