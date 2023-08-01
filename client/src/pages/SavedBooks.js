import React from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_ME } from '../graphql/queries';
import { REMOVE_BOOK } from '../graphql/mutations';

const SavedBooks = () => {
  // Use the useQuery hook to make the GET_ME query on component load
  const { loading, data } = useQuery(GET_ME);

  // Use the useMutation hook to get the REMOVE_BOOK mutation function
  const [removeBook] = useMutation(REMOVE_BOOK);

  // If data is still loading, display a loading message
  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // If the data has loaded, extract the user's saved books from the data object
  const userData = data?.me || {};

  // Create a function that will execute the REMOVE_BOOK mutation when a book is clicked
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      // Use the removeBook function returned from the useMutation hook to execute the mutation
      await removeBook({
        variables: { bookId }
      });

      // Remove the book ID from the list in localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div fluid className='text-light bg-dark p-5'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
