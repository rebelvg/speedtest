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

  private uploadOffset = 0;
  private lastUpdatedTime = 0;

  private _downloadRequest() {
    console.log('_downloadRequest');

    this.lastUpdatedTime = Date.now();

    this.setState({
      isRunning: true,
      startedDate: 0,
      updatedDate: 0,
      endedDate: 0,
      bytesDownloaded: 0,
      allBytes: 0,
      error: null,
    });

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${config.API_HOST}/download`, true);

    xhr.onerror = (error) => {
      console.log('onerror');

      this.setState({
        isRunning: false,
        error: 'ERROR',
      });
    };

    xhr.onloadstart = () => {
      console.log('onloadstart');

      this.setState({
        startedDate: Date.now(),
      });
    };

    xhr.onprogress = () => {
      if (Date.now() - this.lastUpdatedTime > 300) {
        this.setState({
          updatedDate: Date.now(),
          bytesDownloaded: xhr.response.length,
        });

        this.lastUpdatedTime = Date.now();
      }
    };

    xhr.onloadend = (event) => {
      console.log('onloadend');

      if (xhr.readyState !== xhr.DONE) {
        return;
      }

      this.setState({
        isRunning: false,
        updatedDate: Date.now(),
        endedDate: Date.now(),
        bytesDownloaded: xhr.response.length,
        error: xhr.status > 300 ? `ERROR ${xhr.status}` : null,
      });
    };

    xhr.onreadystatechange = () => {
      console.log('onreadystatechange');

      if (xhr.readyState !== xhr.HEADERS_RECEIVED) {
        return;
      }

      this.setState({
        allBytes: parseInt(xhr.getResponseHeader('Content-Length')),
        updatedDate: Date.now(),
      });
    };

    xhr.send();
  }

  private _uploadRequest() {
    console.log('_uploadRequest');

    this.uploadOffset = 0;
    this.lastUpdatedTime = Date.now();

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

    xhr.onerror = (error) => {
      console.log('onerror');

      this.setState({
        isRunning: false,
        error: 'ERROR',
      });
    };

    xhr.onloadstart = () => {
      console.log('onloadstart');
    };

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        if (!this.uploadOffset) {
          this.uploadOffset = event.loaded;
        } else {
          bytesDownloaded = event.loaded - this.uploadOffset;

          if (Date.now() - this.lastUpdatedTime > 300) {
            this.setState({
              updatedDate: Date.now(),
              bytesDownloaded,
            });

            this.lastUpdatedTime = Date.now();
          }
        }
      }
    });

    xhr.onloadend = (event) => {
      console.log('onloadend');

      if (xhr.readyState !== xhr.DONE) {
        return;
      }

      this.setState({
        isRunning: false,
        updatedDate: Date.now(),
        endedDate: Date.now(),
        bytesDownloaded: bytesDownloaded + this.uploadOffset,
        error: xhr.status > 300 ? `ERROR ${xhr.status}` : null,
      });
    };

    xhr.send(new ArrayBuffer(uploadBytes));
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

    const progressPercent = Math.round(
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
            this._downloadRequest();
          }}
        >
          Check Download Speed
        </button>

        <br />
        <br />

        <button
          disabled={isRunning}
          onClick={() => {
            this._uploadRequest();
          }}
        >
          Check Upload Speed
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
