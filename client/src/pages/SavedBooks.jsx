// Importing necessary React and React-Bootstrap components.
import React from "react";
import { Container, Row, Card, Button } from "react-bootstrap";
// Importing Apollo Client hooks for data fetching and mutations.
import { useMutation, useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import Auth from "../utils/auth";
import { removeBookId } from "../utils/localStorage";
import { REMOVE_BOOK } from "../utils/mutations";

// SavedBooks component for displaying and managing user's saved books.
const SavedBooks = () => {
  // Fetching user data using Apollo Client's useQuery hook.
  const { loading, data } = useQuery(GET_ME);
  let userData = data?.me || {};

  // Setting up a mutation for removing a book.
  const [removeBook] = useMutation(REMOVE_BOOK);

  // Function to handle book deletion both from database and local storage.
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Attempting to remove the book using the removeBook mutation.
      const { data } = await removeBook({ variables: { bookId } });

      if (!data) {
        throw new Error("something went wrong!");
      }

      // Removing the book's ID from local storage on successful deletion.
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  // Displaying a loading message if data is not yet available.
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // Rendering the saved books using a Card layout.
  return (
    <>
      <div fluid className="text-light bg-dark">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? "book" : "books"}:`
            : "You have no saved books!"}
        </h2>
        <Row>
          {userData.savedBooks?.map((book) => (
            <Card key={book.bookId} border="dark">
              {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant="top" /> : null}
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <p className="small">Authors: {book.authors}</p>
                <Card.Text>{book.description}</Card.Text>
                <Button className="btn-block btn-danger" onClick={() => handleDeleteBook(book.bookId)}>
                  Delete this Book!
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
