const express = require('express');
const fs = require('fs');
const _ = require('lodash');
const cors = require('cors');

const { api: config } = require('../config');

const CustomReadable = require('./helpers/customReadable');
const CustomWritable = require('./helpers/customWritable');

const app = express();

app.use(cors());
app.set('trust proxy', true);

const router = express.Router();

router.get('/download', async (req, res, next) => {
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream',
    'Content-Disposition': 'attachment; filename=binary',
    'Content-Length': `${30 * 1024 * 1024}`,
    'Cache-Control': 'no-cache, no-store, must-revalidate'
  });

  const readable = new CustomReadable({
    fileSize: 30 * 1024 * 1024
    //simulatedSpeed: 128
  });

  readable.pipe(res);
});

router.post('/upload', (req, res, next) => {
  const writable = new CustomWritable({
    fileSize: 30 * 1024 * 1024
    //simulatedSpeed: 128
  });

  req.pipe(writable);

  writable.on('error', () => {
    req.destroy();
  });

  req.on('end', () => {
    res.send('Ok');
  });
});

app.use(router);

app.use((req, res, next) => {
  throw new Error('Not found.');
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack.split('\n') });
});

//remove previous unix socket
if (typeof config.port === 'string') {
  if (fs.existsSync(config.port)) {
    fs.unlinkSync(config.port);
  }
}

app.listen(config.port, () => {
  console.log('server is running.');

  //set unix socket rw rights for nginx
  if (typeof config.port === 'string') {
    fs.chmodSync(config.port, '777');
  }
});
