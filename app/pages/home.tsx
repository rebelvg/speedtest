import * as React from 'react';

import { config } from '../config';

export class Home extends React.Component {
  public state = {
    isRunning: false,
    startedDate: 0,
    updatedDate: 0,
    endedDate: 0,
    bytesDownloaded: 0,
    allBytes: 0,
    error: null,
  };

  private async _downloadRequest(size: number) {
    console.log('_downloadRequest');

    this.setState({
      isRunning: true,
      startedDate: 0,
      updatedDate: 0,
      endedDate: 0,
      bytesDownloaded: 0,
      allBytes: 0,
      error: null,
    });

    let bytesDownloaded = 0;

    try {
      const response = await fetch(`${config.API_HOST}/download/${size}`, {
        method: 'GET',
      });

      if (response.status > 300) {
        throw new Error(`ERROR ${response.status}`);
      }

      this.setState({
        startedDate: Date.now(),
        allBytes: parseInt(response.headers.get('Content-Length')),
      });

      const reader = response.body.getReader();

      while (true) {
        const { done, value } = await reader.read();

        if (value) {
          bytesDownloaded += value.length;

          this.setState({
            updatedDate: Date.now(),
            bytesDownloaded,
          });
        }

        if (done) {
          break;
        }
      }

      this.setState({
        updatedDate: Date.now(),
        endedDate: Date.now(),
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }

    this.setState({
      isRunning: false,
    });
  }

  private async _uploadRequest(size: number) {
    console.log('_uploadRequest');

    const uploadBytes = size * 1024 * 1024;

    this.setState({
      isRunning: true,
      startedDate: Date.now(),
      updatedDate: Date.now(),
      endedDate: 0,
      bytesDownloaded: 0,
      allBytes: uploadBytes,
      error: null,
    });

    let bytesDownloaded = 0;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', `${config.API_HOST}/upload`, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.upload.addEventListener('progress', (event) => {
      if (!event.lengthComputable) {
        return;
      }

      bytesDownloaded = event.loaded;

      this.setState({
        updatedDate: Date.now(),
        bytesDownloaded,
      });
    });

    try {
      await new Promise<void>((resolve, reject) => {
        xhr.onloadend = (event) => {
          if (xhr.readyState !== xhr.DONE) {
            return;
          }

          if (xhr.status > 300) {
            reject(new Error(`ERROR ${xhr.status}`));
          } else {
            resolve();
          }
        };

        xhr.onerror = (error) => {
          console.error(error);

          reject(new Error('ERROR'));
        };

        xhr.send(new ArrayBuffer(uploadBytes));
      });

      this.setState({
        updatedDate: Date.now(),
        endedDate: Date.now(),
        bytesDownloaded,
      });
    } catch (error) {
      this.setState({
        error: error.message,
      });
    }

    this.setState({
      isRunning: false,
    });
  }

  public render() {
    const {
      isRunning,
      startedDate,
      updatedDate,
      endedDate,
      bytesDownloaded,
      allBytes,
      error,
    } = this.state;

    const progressPercent = Math.floor(
      (allBytes ? bytesDownloaded / allBytes : 0) * 100,
    );

    console.log(progressPercent, allBytes, bytesDownloaded);

    const clampedProgressPercent = Math.min(100, Math.max(0, progressPercent));

    const barWidth = 50;
    const filledBars = Math.round((clampedProgressPercent / 100) * barWidth);
    const emptyBars = barWidth - filledBars;
    const progressBar = `${'#'.repeat(filledBars)}${'.'.repeat(emptyBars)}`;

    const speedMbps =
      (((bytesDownloaded / 1024 / 1024) * 8) / (updatedDate - startedDate)) *
      1000;

    return (
      <div style={{}}>
        {`Speedtest`}

        <br />
        <br />
        <br />

        <button
          disabled={isRunning}
          onClick={() => {
            this._downloadRequest(32);
          }}
        >
          Download 32MB
        </button>

        <button
          disabled={isRunning}
          onClick={() => {
            this._downloadRequest(512);
          }}
        >
          Download 512MB
        </button>

        <br />
        <br />

        <button
          disabled={isRunning}
          onClick={() => {
            this._uploadRequest(32);
          }}
        >
          Upload 32MB
        </button>

        <button
          disabled={isRunning}
          onClick={() => {
            this._uploadRequest(128);
          }}
        >
          Upload 128MB
        </button>

        <br />
        <br />

        {!error
          ? `Speed - ${(Number.isFinite(speedMbps) ? speedMbps : 0).toFixed(
              2,
            )} mbps`
          : error}

        <br />
        <br />

        <div style={{ fontFamily: 'monospace' }}>
          {`[${progressBar}] ${clampedProgressPercent}%`}
        </div>
      </div>
    );
  }
}
