import React, { Component } from 'react';
import styled from 'styled-components';
import * as _ from 'lodash';
import { Container, ButtonOutline, Heading, Donut, Lead } from 'rebass';

export class Home extends Component {
  public state = { isRunning: false, started: 0, updated: 0, ended: 0, bytesDownloaded: 0, allBytes: 0 };

  private _downloadRequest() {
    console.log('_downloadRequest');

    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'api/download', true);

    xhr.onerror = () => {
      console.log('onerror');
    };

    xhr.onloadstart = () => {
      console.log('onloadstart');

      this.setState({
        isRunning: true,
        started: Date.now(),
        updated: Date.now(),
      });
    };

    xhr.onprogress = () => {
      console.log('onprogress', xhr.response.length);

      this.setState({
        bytesDownloaded: xhr.response.length,
        updated: Date.now(),
      });
    };

    xhr.onloadend = () => {
      console.log('onloadend');

      this.setState({
        //updated: Date.now(),
        ended: Date.now(),
        isRunning: false,
      });
    };

    xhr.onreadystatechange = () => {
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

    const uploadBytes = 30 * 1024 * 1024;

    const xhr = new XMLHttpRequest();

    xhr.open('POST', 'api/upload', true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onerror = () => {
      console.log('onerror');
    };

    xhr.onloadstart = () => {
      console.log('onloadstart');

      this.setState({
        isRunning: true,
        started: Date.now(),
        updated: Date.now(),
        allBytes: uploadBytes,
      });
    };

    xhr.upload.addEventListener('progress', event => {
      console.log('onprogress', event.loaded);

      if (event.lengthComputable) {
        this.setState({
          bytesDownloaded: event.loaded,
          updated: Date.now(),
          allBytes: event.total,
        });
      }
    });

    xhr.onloadend = () => {
      console.log('onloadend');

      this.setState({
        //updated: Date.now(),
        ended: Date.now(),
        isRunning: false,
      });
    };

    xhr.send(new ArrayBuffer(uploadBytes));
  }

  public render() {
    const { isRunning, started: startedAt, updated: updatedAt, bytesDownloaded, allBytes } = this.state;

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
            {`Speed - ${_.round((((bytesDownloaded / 1024 / 1024) * 8) / (updatedAt - startedAt)) * 1000, 2) ||
              0} mbps`}
          </Speed>

          <ProgressWrapper>
            <Donut strokeWidth={3} size={256} color="#2a6044" value={bytesDownloaded / allBytes || 0} />

            <Progress>{_.ceil((bytesDownloaded / allBytes) * 100) || 0}%</Progress>
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
  color: ${props => props.theme.primary};

  &:disabled:hover {
    background-color: white;
    box-shadow: inset 0 0 0 2px;
    color: ${props => props.theme.primary};
  }
  &:hover {
    color: ${props => props.theme.light};
    background-color: ${props => props.theme.primary};
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
