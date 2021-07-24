import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, Divider, Form, Header, Input, Message } from 'semantic-ui-react';

import userContext from '../../components/userContext/UserContext';

const Register: React.FC = () => {
  const history = useHistory();
  const user = React.useContext(userContext);

  const [formState, setFormState] = React.useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    updatedFirstname: false,
    updatedLastname: false,
    updatedEmail: false,
    updatedPassword: false
  });
  const [isError, setIsError] = React.useState(false);

  const REGISTER_MUTATION = gql`
    mutation register(
      $firstname: String!
      $lastname: String!
      $email: String!
      $password: String!
    ) {
      register(
        input: { firstname: $firstname, lastname: $lastname, email: $email, password: $password }
      ) {
        user {
          firstname
          lastname
          email
          databases
        }
      }
    }
  `;

  const [register] = useMutation(REGISTER_MUTATION, {
    variables: {
      firstname: formState.firstname,
      lastname: formState.lastname,
      email: formState.email,
      password: formState.password
    },
    onCompleted: ({ register }) => {
      const firstDatabase = register.user.databases[0];
      console.log(register.user);
      user.login(register.user.email, register.user.firstname, register.user.lastname);
      history.push(`/database/${firstDatabase}`);
    },
    onError: err => console.log(err, setIsError(true))
  });

  const handleSubmit = () => {
    if (!formState.email || !formState.password || !formState.firstname || !formState.lastname) {
      setFormState({
        ...formState,
        updatedEmail: true,
        updatedPassword: true,
        updatedFirstname: true,
        updatedLastname: true
      });
      return;
    }
    register();
  };

  return (
    <>
      <Header as="h3" textAlign="center">
        Register new account
      </Header>
      <Card.Group centered>
        <Card className="login-container">
          <Card.Content>
            <Form error={isError} onSubmit={handleSubmit}>
              <Form.Field
                control={Input}
                placeholder="Firstname"
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({ ...formState, firstname: e.target.value, updatedFirstname: true })
                }
                error={
                  formState.updatedFirstname && formState.firstname === ''
                    ? {
                        content: 'Please enter your firstname'
                      }
                    : false
                }
              />
              <Form.Field
                control={Input}
                placeholder="Lastname"
                type="text"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormState({ ...formState, lastname: e.target.value, updatedLastname: true })
                }
                error={
                  formState.updatedLastname && formState.lastname === ''
                    ? {
                        content: 'Please enter your lastname'
                      }
                    : false
                }
              />
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
                        content: 'Please enter a password'
                      }
                    : false
                }
              />
              <Message error header="Registration failed" content="Please try again later." />
              {/* NOTE: There is a findDomNode deprecation warning when using semantic-ui-react's Button component. This is a known issue. */}
              <Button primary fluid type="submit">
                Register
              </Button>
            </Form>
            <Divider />
            <p style={{ textAlign: 'center' }}>Already have an account?</p>
            <Link to="/login">
              <p style={{ textAlign: 'center' }}>Sign in</p>
            </Link>
          </Card.Content>
        </Card>
      </Card.Group>
    </>
  );
};

export default Register;
