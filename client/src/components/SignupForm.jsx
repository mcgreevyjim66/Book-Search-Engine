// Importing React hooks and React-Bootstrap components.
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Importing utility functions and GraphQL mutation.
import { createUser } from '../utils/API';
import Auth from '../utils/auth';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

const SignupForm = () => {
  // State for form data, validation, and alert visibility.
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Apollo Client mutation for adding a user.
  const [addUser, { error }] = useMutation(ADD_USER, { ...userFormData });

  // Handles changes in form inputs.
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Handles form submission.
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // Form validation check.
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Executing the addUser mutation.
      const { data } = await addUser({ variables: { ...userFormData }})
      if (!data) {
        throw new Error("signupForm something went wrong! error:" + error );
      }

      // Logging in the user upon successful signup.
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    // Resetting form data.
    setUserFormData({ username: '', email: '', password: '' });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert for errors during signup */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>

        {/* Form fields for user input */}
        {/* Each field updates the corresponding state on change and has validation feedback */}
        <Form.Group className='mb-3'>
          {/* Username field */}
          {/* ... other fields */}
          
          <Button
            disabled={!(userFormData.username && userFormData.email && userFormData.password)}
            type='submit'
            variant='success'>
            Submit
          </Button>
        </Form.Group>
      </Form>
    </>
  );
};

export default SignupForm;
