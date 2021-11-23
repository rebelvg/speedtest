import React, { Component } from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';
import { Container, ButtonOutline, Heading, Donut, Lead } from 'rebass';

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

    return (
      <Container>
        <Wrapper>
          <Header>Speedtest</Header>

          <ButtonWrap>
            <Button
              disabled={isRunning}
              onClick={() => {
                this._downloadRequest();
              }}
            >
              Check Download Speed
            </Button>

            <Button
              disabled={isRunning}
              onClick={() => {
                this._uploadRequest();
              }}
            >
              Check Upload Speed
            </Button>
          </ButtonWrap>

          <Speed>
            {!error
              ? `Speed - ${
                  _.round(
                    (((bytesDownloaded / 1024 / 1024) * 8) /
                      (updatedDate - startedDate)) *
                      1000,
                    2,
                  ) || 0
                } mbps`
              : error}
          </Speed>

          <ProgressWrapper>
            <Donut
              strokeWidth={3}
              size={256}
              color={!error ? '#2a6044' : '#ff0000'}
              value={bytesDownloaded / allBytes || 0}
            />

            <Progress>
              {_.ceil((bytesDownloaded / allBytes) * 100) || 0}%
            </Progress>
          </ProgressWrapper>
        </Wrapper>
      </Container>
    );
  }
}

const Wrapper = styled.div`
  margin: 0px auto;
`;

const ProgressWrapper = styled.div`
  width: 256px;
  height: 256px;
  position: relative;
  margin: 0px auto;
`;

const Speed = styled(Lead)`
  text-align: center;
  padding: 20px;
`;

const Progress = styled.div`
  width: 256px;
  height: 256px;
  display: flex;
  position: absolute;
  top: 0px;
  align-items: center;
  justify-content: center;
  font-size: 36px;
`;

const Button = styled(ButtonOutline)`
  margin: 0px 20px;
  padding: 20px;
  width: 25%;
  color: ${(props) => props.theme.primary};

  &:disabled:hover {
    background-color: white;
    box-shadow: inset 0 0 0 2px;
    color: ${(props) => props.theme.primary};
  }
  &:hover {
    color: ${(props) => props.theme.light};
    background-color: ${(props) => props.theme.primary};
  }

  @media (max-width: 667px) {
    width: 100%;
    padding: 10px;
    margin: 5px 0px;
  }
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 667px) {
    flex-direction: column;
  }
`;

const Header = styled(Heading)`
  color: #1c1c1c;
  font-size: 2em;
  margin: 10px 0px;
  text-transform: uppercase;
  text-align: center;
`;
