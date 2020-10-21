import * as express from 'express';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as cors from 'cors';

import { API_SERVER } from './config';

import { CustomReadable } from './helpers/custom-readable';
import { CustomWritable } from './helpers/custom-writable';

const app = express();

app.use(cors());
app.set('trust proxy', true);

const router = express.Router();

router.get('/download', async (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=binary',
    'Content-Length': `${30 * 1024 * 1024}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const readable = new CustomReadable({
    fileSize: 30 * 1024 * 1024,
    // simulatedSpeed: 1024,
  });

  readable.pipe(res);
});

router.post('/upload', async (req, res, next) => {
  const fileSize = 30 * 1024 * 1024;

  const writable = new CustomWritable({
    fileSize,
    // simulatedSpeed: 1024,
  });

  try {
    await new Promise((resolve, reject) => {
      writable.on('error', reject);

      writable.on('finish', resolve);

      req.pipe(writable);
    });
  } catch (error) {
    res.status(400).send('fail');

    return;
  }

  res.send('ok');
});

app.use(router);

app.use((req, res, next) => {
  throw new Error('Not found.');
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack.split('\n') });
});

//remove previous unix socket
if (typeof API_SERVER.port === 'string') {
  if (fs.existsSync(API_SERVER.port)) {
    fs.unlinkSync(API_SERVER.port);
  }
}

app.listen(API_SERVER.port, () => {
  console.log('api_server_running');

  //set unix socket rw rights for nginx
  if (typeof API_SERVER.port === 'string') {
    fs.chmodSync(API_SERVER.port, '777');
  }
});
