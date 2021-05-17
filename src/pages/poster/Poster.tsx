import { Card, Divider, Grid, Header, Image, Label, List } from 'semantic-ui-react';

import logo from '../../assets/icon.png';

const Poster: React.FC = () => {
  return (
    <>
      <Header as="h1" textAlign="center" style={{ marginTop: '20px' }}>
        What is NoteWorthy?
      </Header>
      <Divider></Divider>
      <Grid columns="equal">
        <Grid.Column>
          <Header as="h2" textAlign="center">
            Introduction
          </Header>
          {/* NOTE: A card can be formatted as a link */}
          <Card fluid>
            <Card.Content>
              <Card.Header>Our Motivation</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Ever found your note-taking apps lacking?
                  </List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Need more features packed into one solution?
                  </List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>Then try NoteWorthy!</List.Item>
                </List>
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  10 May 2021
                </span>
              </Card.Meta>
            </Card.Content>

            <Card.Content extra>
              <Label color="orange">Introduction</Label>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header>Our Aim</Card.Header>
              <Card.Description>
                We aim to make the ultimate note-taking app that university students need to create,
                manage and collaborate on their notes.
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  11 May 2021
                </span>
              </Card.Meta>
            </Card.Content>

            <Card.Content extra>
              <Label color="orange">Introduction</Label>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header>Created by students for students</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>Aiken 😉</List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>En Rong 🤪</List.Item>
                </List>
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  11 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="red">Creators</Label>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Header as="h2" textAlign="center">
            Design
          </Header>
          <Card fluid>
            <Card.Content>
              <Card.Header>All blocked up</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Notes stored in draggable blocks
                  </List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Dropdown feature to hide blocks and reduce clutter
                  </List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Coloured search tags to organise your notes!
                  </List.Item>
                </List>
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  11 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="teal">Design</Label>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header>Link 'em together</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Insert in-line links to related notes and access them through a single click!
                  </List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Click [[<a>here</a>]] to go to the introduction
                  </List.Item>
                </List>
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  12 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="teal">Design</Label>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header>LaTex</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Create beautiful Math notes with built in LaTex support!
                  </List.Item>
                </List>
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  12 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="teal">Design</Label>
            </Card.Content>
          </Card>
        </Grid.Column>

        <Grid.Column>
          <Header as="h2" textAlign="center">
            Features
          </Header>
          <Card fluid>
            <Card.Content>
              <Card.Header>Images!</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Add images into each block just like how you would for any note-taking app
                  </List.Item>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Or draw out handwritten notes and illustrations, and add them from the app
                    itself!
                  </List.Item>
                </List>
              </Card.Description>
              <Card.Description style={{ display: 'flex', justifyContent: 'center' }}>
                <Image
                  src={logo}
                  fluid
                  style={{ display: 'block', height: '100px', width: 'auto', margin: '10px' }}
                />
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  12 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="blue">Features</Label>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header>Collaborate!</Card.Header>
              <Card.Description>
                <List bulleted>
                  <List.Item style={{ lineHeight: '1.4285em' }}>
                    Invite friends to make shared notes, by sharing a link
                  </List.Item>
                </List>
              </Card.Description>
              <br />
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  15 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="blue">Features</Label>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header>Export!</Card.Header>
              <List bulleted>
                <List.Item style={{ lineHeight: '1.4285em' }}>
                  Export your notes as PDF for printing
                </List.Item>
                <List.Item style={{ lineHeight: '1.4285em' }}>
                  Alternatively, export it in raw HTML
                </List.Item>
              </List>
              <Card.Meta>
                <span className="date" style={{ fontSize: '0.9rem' }}>
                  17 May 2021
                </span>
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              <Label color="blue">Features</Label>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  );
};

export default Poster;
