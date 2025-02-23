import Database from 'better-sqlite3';

const database = new Database('./db/nodepad.sqlite3', {
  verbose: console.log,
});

// initialise database with a Users table if it doesn't already exist
database.exec(`
  CREATE TABLE IF NOT EXISTS Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// log all current users
const allUsers = database.prepare('SELECT * FROM Users').all();
console.log('Current users in database:', allUsers);

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

    // if the record is not updated
    if (result.changes === 0) {
      return Promise.resolve({ success: false, message: 'account not found' });
    }
    return Promise.resolve({ success: true });
  } catch (err) {
    console.error('!! Error updating password:', err);
    return Promise.resolve({ success: false, message: 'an unknown error occurred' });
  }
};
