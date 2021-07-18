export type Database = {
  id: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
};

export type DatabaseProps = {
  id: string;
  nonCategorisedId: string;
  title: string;
  currentView: string;
  categories: Category[];
  notes: Note[];
  createNoteHandler: (categoryId: string, title: string, index: number) => void;
  deleteNoteHandler: (noteId: string) => void;
  createDatabaseCategoryHandler: (databaseId: string, categoryName: string, index: number) => void;
  deleteDatabaseCategoryHandler: (databaseId: string, categoryId: string) => void;
  updateDatabaseViewHandler: (databaseId: string, view: string) => void;
  updateNoteCategoryHandler: (
    noteId: string,
    categoryId: string,
    index: number,
    updatedDatabase: Database
  ) => void;
  updateNoteTitleHandler: (noteId: string, title: string) => void;
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
