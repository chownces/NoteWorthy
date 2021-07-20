export type Database = {
  id: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
};

export type Category = {
  id: string;
  name: string;
  notes: string[];
  databaseId: string;
};

export enum DatabaseViews {
  TABLE = 'table',
  BOARD = 'board'
}

export type Note = {
  userId: string;
  databaseId: string;
  id: string;
  categoryId: string;
  title: string;
  blocks: [
    {
      id: string;
      html: string;
      tag: string;
    }
  ];
  creationDate: string;
  latestUpdate: string;
};
