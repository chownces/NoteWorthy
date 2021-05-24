import { Card, Divider, Grid, Header, Label, List } from 'semantic-ui-react';
// import { Card, Divider, Grid, Header, Image, Label, List } from 'semantic-ui-react';
const BoardView = () => {
  const data = {
    getUser: {
      databases: [
        {
          id: 'database1',
          database_title: 'my first database',
          current_view: 'board',
          notes: [
            {
              id: 'note1',
              note_title: 'my first note',
              note_blocks: [
                {
                  id: 'abc',
                  html: 'hello world!',
                  tag: 'p'
                },
                {
                  id: 'def',
                  html: 'this is my first note',
                  tag: 'p'
                }
              ]
            },
            {
              id: 'note2',
              note_title: 'my second note',
              note_blocks: [
                {
                  id: 'dsfgdg',
                  html: 'bye!',
                  tag: 'p'
                },
                {
                  id: 'def',
                  html: 'dfgxdfghgfdg',
                  tag: 'p'
                }
              ]
            }
          ]
        }
      ]
    }
  };

  const databases = data.getUser.databases;

  // const database0 = databases[0];

  // const notes = database0.notes;

  return (
    <>
      {databases.map(database => (
        <>
          <Header as="h1" textAlign="center" style={{ marginTop: '20px' }}>
            {database.database_title}
          </Header>
          <Divider></Divider>
          <Grid columns="equal">
            {database.notes.map(note => (
              <Grid.Column>
                <Header as="h2" textAlign="center">
                  {note.note_title}
                </Header>
                {note.note_blocks.map(block => (
                  <Card fluid>
                    <Card.Content>
                      <Card.Header>{block.id}</Card.Header>
                      <Card.Description>
                        <List bulleted>
                          <List.Item style={{ lineHeight: '1.4285em' }}>{block.html}</List.Item>
                        </List>
                        <Card.Meta>
                          <span className="date">Joined in 2015</span>
                        </Card.Meta>
                      </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <Label>{block.tag}</Label>
                    </Card.Content>
                  </Card>
                ))}
              </Grid.Column>
            ))}
          </Grid>
        </>
      ))}
    </>
  );
  // return <div>{notes.map(note => <div>{note.note_blocks.map(block => block.html)}</div>)}mama</div>;
};

export default BoardView;
