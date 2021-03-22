const app = require('../app');
const db = require('../model/db');
const createFolderIsExist = require('../services/create-dir');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

db.then(() => {
  app.listen(PORT, async () => {
    const TMP_DIR = process.env.TMP_DIR;
    const PUBLIC_DIR = process.env.PUBLIC_DIR;
    const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
    await createFolderIsExist(TMP_DIR);
    await createFolderIsExist(PUBLIC_DIR);
    await createFolderIsExist(AVATARS_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server not running. Error message: ${err.message}`);
  process.exit(1);
});
