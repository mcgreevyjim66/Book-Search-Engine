// Importing required modules
const express = require('express');
const path = require('path');
const db = require('./config/connection');
//const routes = require('./routes'); // This line is commented out and seems unused in this setup

const PORT = process.env.PORT || 3001; // Defining the port for the server

// Importing ApolloServer and middleware for Express integration
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');

// Importing GraphQL schema definitions and resolvers
const { typeDefs, resolvers } = require('./schemas');

// Creating a new ApolloServer instance with type definitions and resolvers
const server = new ApolloServer({
    typeDefs,
    resolvers
});

const app = express(); // Creating an Express application

// Function to start the Apollo and Express servers
const startApolloServer = async () => {
    await server.start(); // Starting the Apollo server

    // Express middleware for parsing request bodies
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    // Serving static files in production from the 'dist' directory
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));

      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    }
    
    // Applying the Apollo middleware with context for authentication
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));

    // Connecting to the database and then starting the Express server
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });
};

// Starting the server
startApolloServer();
