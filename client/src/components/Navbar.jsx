// Importing necessary hooks and components from React, React Router, and React Bootstrap.
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import SignUpForm from './SignupForm';
import LoginForm from './LoginForm';

// Importing the authentication utility functions.
import Auth from '../utils/auth';

// Defining the AppNavbar component.
const AppNavbar = () => {
  // State for managing the visibility of the modal.
  const [showModal, setShowModal] = useState(false);

  return (
    // JSX code for rendering the navigation bar using React Bootstrap components.
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={Link} to='/'>Google Books Search</Navbar.Brand>
          <Navbar.Toggle aria-controls='navbar' />
          <Navbar.Collapse id='navbar' className='d-flex flex-row-reverse'>
            <Nav className='ml-auto d-flex'>
              <Nav.Link as={Link} to='/'>Search For Books</Nav.Link>
              {/* Conditional rendering based on user's authentication status. */}
              {Auth.loggedIn() ? (
                <>
                  <Nav.Link as={Link} to='/saved'>See Your Books</Nav.Link>
                  <Nav.Link onClick={Auth.logout}>Logout</Nav.Link>
                </>
              ) : (
                <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Modal for login and signup forms. */}
      <Modal size='lg' show={showModal} onHide={() => setShowModal(false)} aria-labelledby='signup-modal'>
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item><Nav.Link eventKey='login'>Login</Nav.Link></Nav.Item>
                <Nav.Item><Nav.Link eventKey='signup'>Sign Up</Nav.Link></Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'><LoginForm handleModalClose={() => setShowModal(false)} /></Tab.Pane>
              <Tab.Pane eventKey='signup'><SignUpForm handleModalClose={() => setShowModal(false)} /></Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

// Exporting the AppNavbar component.
export default AppNavbar;
