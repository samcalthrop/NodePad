import Database from 'better-sqlite3';

const database = new Database('./db/nodepad.sqlite3', {
  verbose: console.log,
});

// initialise tables
createUsersTable();
createTagsTable();

// log all current users
const allUsers = database.prepare('SELECT * FROM Users').all();
console.log('Current users in database:', allUsers);

// creates table named 'Users' if one does not exist
function createUsersTable(): void {
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `);
    console.log('Users table created or already exists.');
  } catch (err) {
    console.error('Error creating Users table:', err);
  }
}

// creates table named 'Tags' if one does not exist
function createTagsTable(): void {
  try {
    database.exec(`
      CREATE TABLE IF NOT EXISTS Tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filepath TEXT NOT NULL,
        tag TEXT NOT NULL,
        UNIQUE(filepath, tag)
      )
    `);
    console.log('Tags table created or already exists.');
  } catch (err) {
    console.error('Error creating Tags table:', err);
  }
}

// create a new record with passed in credentials if they don't already exist
export const createCredentials = (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const statement = database.prepare('INSERT INTO Users (email, password) VALUES (?, ?)');
    // arguments passed into `.run()` are assigned to each consecutive `?` in the `.prepare()` statement above
    statement.run(email, password);
    return Promise.resolve({ success: true });
  } catch (err) {
    console.error('!! Error inserting user:', err);
    return Promise.resolve({ success: false, message: 'error creating credentials' });
  }
};

// check the passed in credentials to those existing in the db
export const checkCredentials = (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const statement = database.prepare('SELECT * FROM Users WHERE email = ? AND password = ?');
    const row = statement.get(email, password);
    if (!row) {
      return Promise.resolve({ success: false, message: 'invalid email or password' });
    }
    return Promise.resolve({ success: true });
  } catch (err) {
    console.error('!! Error checking credentials:', err);
    return Promise.resolve({ success: false, message: 'an unknown error occurred' });
  }
};

// update the email of an existing record
export const updateEmail = (
  oldEmail: string,
  newEmail: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const statement = database.prepare('UPDATE Users SET email = ? WHERE email = ?');
    const result = statement.run(newEmail, oldEmail);

    if (result.changes === 0) {
      return Promise.resolve({ success: false, message: 'email not found' });
    }
    return Promise.resolve({ success: true });
  } catch (err) {
    console.error('!! Error updating email:', err);
    return Promise.resolve({ success: false, message: 'an unknown error occurred' });
  }
};

// update the password of an existing record with given email
export const updatePassword = (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  try {
    const statement = database.prepare('UPDATE Users SET password = ? WHERE email = ?');
    const result = statement.run(password, email);

    // if the record is not updated, return false
    if (result.changes === 0) {
      return Promise.resolve({ success: false, message: 'account not found' });
    }
    return Promise.resolve({ success: true });
  } catch (err) {
    console.error('!! Error updating password:', err);
    return Promise.resolve({ success: false, message: 'an unknown error occurred' });
  }
};

// returns an array of all the tags attached to a particular filepath
export const getFileTags = (filePath: string): Promise<{ tags: Array<string> }> => {
  try {
    const statement = database.prepare('SELECT tag FROM Tags WHERE filepath = ?');
    const rows = statement.all(filePath);
    if (rows) {
      return Promise.resolve({ tags: rows.map((row) => row.tag) });
    }
    return Promise.resolve({ tags: [] });
  } catch (err) {
    console.error('!! Error getting file tags:', err);
    return Promise.resolve({ tags: [] });
  }
};

// save each tag in the tags array from a file to its filepath
export const saveFileTags = (
  filePath: string,
  tags: Array<string>
): Promise<{ success: boolean; message?: string }> => {
  try {
    // first remove all existing tags from the file (user may have removed tags as well as adding them)
    const removeStatement = database.prepare('DELETE FROM Tags WHERE filepath = ?');
    removeStatement.run(filePath);

    // then make sure tags is an array
    const tagsArray = Array.isArray(tags) ? tags : [];
    // before adding back all the new and/ or existing tags one-by-one
    const insertStatement = database.prepare('INSERT INTO Tags (filepath, tag) VALUES (?,?)');
    tagsArray.forEach((tag) => {
      insertStatement.run(filePath, tag);
    });
    return Promise.resolve({ success: true });
  } catch (err) {
    console.error('!! Error saving file tags:', err);
    return Promise.resolve({ success: false, message: 'an unknown error occurred' });
  }
};

// returns an array of all the tags attached to a directory of files
export const getGlobalTags = (directoryPath: string): Promise<{ tags: Array<string> }> => {
  try {
    // statement finds any tags attached to files prefixed with the given directory path
    const statement = database.prepare(`SELECT tag FROM Tags WHERE filepath LIKE ?`);
    const rows = statement.all(directoryPath + '%');
    if (rows) {
      // there will likely be duplicate tags; these must be removed by first converting to a set
      const uniqueTags: Set<string> = new Set(rows.map((row) => row.tag));
      // then convert back to an array to be returned
      return Promise.resolve({ tags: Array.from(uniqueTags) });
    }
    return Promise.resolve({ tags: [] });
  } catch (err) {
    console.error('!! Error getting global tags:', err);
    return Promise.resolve({ tags: [] });
  }
};
