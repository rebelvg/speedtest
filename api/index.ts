import * as express from 'express';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as cors from 'cors';

import { PORT } from '../config-api';

import { CustomReadable } from './helpers/custom-readable';
import { CustomWritable } from './helpers/custom-writable';
import { rateLimitMiddleware } from './middleware/rate-limit';

const app = express();

app.use(cors());
app.set('trust proxy', true);

const router = express.Router();

router.get('/download', rateLimitMiddleware, async (req, res, next) => {
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

router.post('/upload', rateLimitMiddleware, async (req, res, next) => {
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
  throw new Error('not_found');
});

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ error: err.message });

    return;
  }

  res.status(500).json({ error: err.stack.split('\n') });
});

//remove previous unix socket
if (typeof PORT === 'string') {
  if (fs.existsSync(PORT)) {
    fs.unlinkSync(PORT);
  }
}

app.listen(PORT, () => {
  console.log('api_server_running');

  //set unix socket rw rights for nginx
  if (typeof PORT === 'string') {
    fs.chmodSync(PORT, '777');
  }
});
