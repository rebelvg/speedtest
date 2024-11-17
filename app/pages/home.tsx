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

  private _downloadRequest() {
    console.log('_downloadRequest');

    const xhr = new XMLHttpRequest();

    xhr.open('GET', `${config.API_HOST}/download`, true);

    xhr.onerror = (error) => {
      console.log('onerror');

      this.setState({
        isRunning: false,
        startedDate: Date.now(),
        updatedDate: Date.now(),
        allBytes: 0,
        error: 'network_error',
      });
    };

    xhr.onloadstart = () => {
      console.log('onloadstart');

      this.setState({
        isRunning: true,
        startedDate: Date.now(),
        updatedDate: Date.now(),
        bytesDownloaded: 0,
        allBytes: 0,
        error: null,
      });
    };

    xhr.onprogress = () => {
      console.log('onprogress', xhr.response.length);

      this.setState({
        bytesDownloaded: xhr.response.length,
        updatedDate: Date.now(),
      });
    };

    xhr.onloadend = (event) => {
      console.log('onloadend');

      if (xhr.readyState !== xhr.DONE) {
        return;
      }

      if (xhr.status > 300) {
        this.setState({
          updatedDate: Date.now(),
          endedDate: Date.now(),
          isRunning: false,
          error: JSON.parse(xhr.response)?.error || 'ui_unknown_error',
        });

        return;
      }

      this.setState({
        updatedDate: Date.now(),
        endedDate: Date.now(),
        isRunning: false,
        error: null,
      });
    };

    xhr.onreadystatechange = () => {
      console.log('onreadystatechange');

      if (xhr.readyState === xhr.HEADERS_RECEIVED) {
        this.setState({
          allBytes: parseInt(xhr.getResponseHeader('Content-Length')),
        });
      }
    };

    xhr.send();
  }

  private _uploadRequest() {
    console.log('_uploadRequest');

    const uploadBytes = 32 * 1024 * 1024;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', `${config.API_HOST}/upload`, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onerror = (error) => {
      console.log('onerror');

      this.setState({
        isRunning: false,
        startedDate: Date.now(),
        updatedDate: Date.now(),
        allBytes: 0,
        error: 'network_error',
      });
    };

    xhr.onloadstart = () => {
      console.log('onloadstart');

      this.setState({
        isRunning: true,
        startedDate: Date.now(),
        updatedDate: Date.now(),
        allBytes: uploadBytes,
        error: null,
      });
    };

    xhr.upload.addEventListener('progress', (event) => {
      console.log('onprogress', event.loaded);

      if (event.lengthComputable) {
        this.setState({
          bytesDownloaded: event.loaded,
          updatedDate: Date.now(),
          allBytes: event.total,
        });
      }
    });

    xhr.onloadend = (event) => {
      console.log('onloadend');

      if (xhr.readyState !== xhr.DONE) {
        return;
      }

      if (xhr.status > 300) {
        this.setState({
          updatedDate: Date.now(),
          endedDate: Date.now(),
          isRunning: false,
          error: JSON.parse(xhr.response)?.error || 'ui_unknown_error',
        });

        return;
      }

      this.setState({
        updatedDate: Date.now(),
        endedDate: Date.now(),
        isRunning: false,
        error: null,
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

    const progressPercent = Math.round((bytesDownloaded / allBytes || 0) * 100);

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
          ? `Speed - ${
              Math.round(
                (((bytesDownloaded / 1024 / 1024) * 8) /
                  (updatedDate - startedDate)) *
                  1000,
              ) || 0
            } mbps`
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
