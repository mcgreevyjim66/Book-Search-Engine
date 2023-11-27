const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');

const PORT = process.env.PORT || 3001;

//***************************** */
// Import the ApolloServer class and expressMiddleware helper function
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');

const server = new ApolloServer({
    typeDefs,
    resolvers
  });

//********************************************* */

const app = express();


//********************************* */

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
    await server.start();
    
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
      // Important for MERN Setup: When our application runs from production, it functions slightly differently than in development
  // In development, we run two servers concurrently that work together
  // In production, our Node server runs and delivers our client-side bundle from the dist/ folder 
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }
    
    //app.use(routes);
  
   //app.use('/graphql', expressMiddleware(server));
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));
  
    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      })
    })
  };
  
  // Call the async function to start the server
  startApolloServer();
