import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Divider, Form, Header, Input, Message } from 'semantic-ui-react';

import userContext from '../../components/userContext/UserContext';

const Login: React.FC = () => {
  const user = React.useContext(userContext);
  const [isWrongCredentials, setIsWrongCredentials] = React.useState<boolean>(false);
  const [loadingLogin, setLoadingLogin] = React.useState<boolean>(false);

  const [formState, setFormState] = React.useState({
    email: '',
    password: '',
    updatedEmail: false,
    updatedPassword: false
  });

  const LOGIN_MUTATION = gql`
    mutation login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          firstname
          lastname
          email
          databases
          lastVisited
        }
      }
    }
  `;

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ login }) => {
      user.login(login.user.email, login.user.firstname, login.user.lastname);
    },
    onError: err => {
      setIsWrongCredentials(true);
      setLoadingLogin(false);
    }
  });

  const handleSubmit = () => {
    if (!formState.email || !formState.password) {
      setFormState({ ...formState, updatedEmail: true, updatedPassword: true });
      return;
    }
    setLoadingLogin(true);
    login();
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <Header as="h3" textAlign="center">
        Welcome to NoteWorthy!
      </Header>
      <Card.Group centered>
        <Card className="login-container">
          <Card.Content>
            <Form error={isWrongCredentials} onSubmit={handleSubmit}>
              <Form.Field
                control={Input}
                placeholder="Email"
                type="email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({ ...formState, email: e.target.value, updatedEmail: true })
                }
                error={
                  formState.updatedEmail && formState.email === ''
                    ? {
                        content: 'Please enter a valid email'
                      }
                    : false
                }
              />
              <Form.Field
                control={Input}
                placeholder="Password"
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({ ...formState, password: e.target.value, updatedPassword: true })
                }
                error={
                  formState.updatedPassword && formState.password === ''
                    ? {
                        content: 'Please enter your password'
                      }
                    : false
                }
              />
              <Message error header="Login Failed" content="Invalid username or password!" />
              {/* NOTE: There is a findDomNode deprecation warning when using semantic-ui-react's Button component. This is a known issue. */}
              <Button primary fluid type="submit" loading={loadingLogin}>
                Log In
              </Button>
            </Form>
            <Divider horizontal>OR</Divider>
            <Link to="/register">
              <p style={{ textAlign: 'center' }}>Create a new account</p>
            </Link>
          </Card.Content>
        </Card>
      </Card.Group>
    </div>
  );
};

export default Login;
