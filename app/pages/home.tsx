import React, { Component } from 'react';

import { config } from '../config';

export class Home extends Component {
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

    try {
      const response = await fetch(`${config.API_HOST}/download/${size}`, {
        method: 'GET',
      });

      this.setState({
        startedDate: Date.now(),
        allBytes: parseInt(response.headers.get('Content-Length')),
      });

      if (response.status > 300) {
        throw new Error(`ERROR ${response.status}`);
      }

      for await (const chunk of response.body) {
        this.setState({
          updatedDate: Date.now(),
          bytesDownloaded: this.state.bytesDownloaded + chunk.length,
        });
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

    let uploadOffset = 0;

    const uploadBytes = 32 * 1024 * 1024;

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
      if (event.lengthComputable) {
        if (!uploadOffset) {
          uploadOffset = event.loaded;
        } else {
          bytesDownloaded = event.loaded - uploadOffset;

          this.setState({
            updatedDate: Date.now(),
            bytesDownloaded,
          });
        }
      }
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
          reject(new Error('ERROR'));
        };

        xhr.send(new ArrayBuffer(uploadBytes));
      });

      this.setState({
        updatedDate: Date.now(),
        endedDate: Date.now(),
        bytesDownloaded: bytesDownloaded + uploadOffset,
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

        {`[${Array.from({ length: progressPercent })
          .map((i) => '|')
          .join('')}${Array.from({ length: (progressPercent - 100) * -1 })
          .map((i) => '/')
          .join('')}] ${progressPercent}%`}
      </div>
    );
  }
}
