import fs from 'fs';
import path from 'path';

export default function writeLog(id, logs) {
  fs.writeFile(path.join(__dirname, `../../../../logs/games/${id}.js`), JSON.stringify(logs), (success) => {
    console.log(success);
  });
}
