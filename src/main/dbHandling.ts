import { Database } from 'sqlite3';

export const createCredentials = (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    console.log('createCredentials', { email, password });
    database.run('INSERT INTO Users (email, password) VALUES (?, ?)', [email, password], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
        resolve({ success: false, message: err.message });
        return;
      }
      console.log('User created successfully');
      resolve({ success: true });
    });
  });
};

export const checkCredentials = (
  email: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  return new Promise((resolve) => {
    console.log('checkCredentials', { email, password });
    database.get(
      'SELECT * FROM Users WHERE email = ? AND password = ?',
      [email, password],
      (err, row) => {
        if (err) {
          console.error('Error checking credentials:', err);
          resolve({ success: false, message: err.message });
          return;
        }
        if (!row) {
          console.log('User not found');
          resolve({ success: false, message: 'Invalid email or password' });
          return;
        }
        console.log('User exists');
        resolve({ success: true });
      }
    );
  });
};

// /**
//  * @link https://github.com/electron/electron/issues/19775#issuecomment-834649057
//  */
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const database = new Database('./db/nodepad.sqlite3', (err) => {
  if (err) {
    console.error('Database opening error:', err);
  }
});

database.all('SELECT * FROM Users', (err, rows) => {
  if (err) {
    console.error('Database SELECT error:', err);
    return;
  }
  console.log('Database SELECT result:', { rows });
});
