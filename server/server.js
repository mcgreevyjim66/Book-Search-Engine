const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;

//***************************** */
// Import the ApolloServer class and expressMiddleware helper function
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');

const server = new ApolloServer({
    typeDefs,
    resolvers
  });

//********************************************* */

const app = express();

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

//********************************* */

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
    await server.start();
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use(routes);
  
    app.use('/graphql', expressMiddleware(server));
  
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      })
    })
  };
  
  // Call the async function to start the server
  startApolloServer();
