import './App.css';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
const client = new ApolloClient({
  uri: '/graphql',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Navbar />
        <div className="container">
          <Outlet />
        </div>
      </div>
    </ApolloProvider>
  );


}

export default App;
