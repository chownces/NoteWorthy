import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button, Card, Divider, Form, Header, Input, Message } from 'semantic-ui-react';

const Login: React.FC = () => {
  const history = useHistory();

  // TODO: Set this to true if the server returns invalid credentials
  const [isWrongCredentials, _] = React.useState(false);

  const [user, setUser] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState<string | null>(null);

  const handleSubmit = () => {
    // Check for empty input, and set the relevant states to trigger the Form error message
    if (!user || !password) {
      if (!user) {
        setUser('');
      }
      if (!password) {
        setPassword('');
      }
      return;
    }

    // TODO: Handle the backend authentication logic
    history.push('/');
  };

  return (
    <>
      <Header as="h3" textAlign="center">
        Welcome to NoteWorthy!
      </Header>
      <Card.Group centered>
        <Card className="login-container">
          <Card.Content>
            <Form error={isWrongCredentials} onSubmit={handleSubmit}>
              <Form.Field
                control={Input}
                placeholder="Username or email"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUser(e.target.value)}
                error={
                  user === ''
                    ? {
                        content: 'Please enter a valid username or email'
                      }
                    : false
                }
              />
              <Form.Field
                control={Input}
                placeholder="Password"
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                error={
                  password === ''
                    ? {
                        content: 'Please enter your password'
                      }
                    : false
                }
              />
              <Message error header="Login Failed" content="Invalid username or password!" />
              <Button primary fluid type="submit">
                Log In
              </Button>
            </Form>
            <Divider horizontal>OR</Divider>
            {/* TODO: Handle create new account */}
            <Link to="/">
              <p style={{ textAlign: 'center' }}>Create a new account</p>
            </Link>
          </Card.Content>
        </Card>
      </Card.Group>
    </>
  );
};

export default Login;
