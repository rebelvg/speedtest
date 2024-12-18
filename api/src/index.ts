import * as express from 'express';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as cors from 'cors';

import { API } from './config';

import { CustomReadable } from './helpers/custom-readable';
import { CustomWritable } from './helpers/custom-writable';
import { rateLimitMiddleware } from './middleware/rate-limit';

const app = express();

app.use(cors());
app.set('trust proxy', true);

const router = express.Router();

router.get('/download/:size', rateLimitMiddleware, async (req, res, next) => {
  const { size } = req.params;

  const fileSize = Number(size) * 1024 * 1024;

  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=binary',
    'Content-Length': `${fileSize}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });

  const readable = new CustomReadable({
    fileSize,
    // simulatedSpeedKBps: 1024,
  });

  readable.pipe(res);
});

router.post('/upload', rateLimitMiddleware, async (req, res, next) => {
  const fileSize = Number(req.headers['content-length']);

  const writable = new CustomWritable({
    fileSize,
    // simulatedSpeedKBps: 1024,
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
if (typeof API.PORT === 'string') {
  if (fs.existsSync(API.PORT)) {
    fs.unlinkSync(API.PORT);
  }
}

if (API.HOST) {
  app.listen(API.PORT as number, API.HOST, () => {
    console.log('api_server_running', API.PORT, API.HOST);

    //set unix socket rw rights for nginx
    if (typeof API.PORT === 'string') {
      fs.chmodSync(API.PORT, '777');
    }
  });
} else {
  app.listen(API.PORT as number, () => {
    console.log('api_server_running', API.PORT);

    //set unix socket rw rights for nginx
    if (typeof API.PORT === 'string') {
      fs.chmodSync(API.PORT, '777');
    }
  });
}
