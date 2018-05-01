import React, {Component} from 'react';
import styled from 'styled-components';
import _ from 'lodash';

class App extends Component {
    constructor() {
        super();

        this.state = {
            isRunning: false,
            started: 0,
            ended: 0,
            bytesDownloaded: 0,
            allBytes: 0
        };
    }

    componentDidMount() {
        //api stuff here
    }

    _makeRequest() {
        const {isRunning} = this.state;

        if (isRunning) return;

        console.log('sendRequest');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/download', true);

        xhr.onerror = () => {
            console.log('onerror');
        };

        xhr.onloadstart = () => {
            console.log('onloadstart');

            this.setState({
                isRunning: true,
                started: Date.now()
            });
        };

        xhr.onprogress = () => {
            console.log('onprogress', xhr.response.length);

            this.setState({
                bytesDownloaded: xhr.response.length
            });
        };

        xhr.onloadend = () => {
            console.log('onloadend');

            this.setState({
                isRunning: false
            });
        };

        xhr.onreadystatechange = () => {
            if (xhr.readyState === xhr.HEADERS_RECEIVED) {
                this.setState({
                    allBytes: parseInt(xhr.getResponseHeader('Content-Length'))
                });
            }
        };

        xhr.send();
    }

    render() {
        const {isRunning, started: startedAt, ended: endedAt, bytesDownloaded, allBytes} = this.state;

        if (isRunning) {
            return <div>
                <Container>
                    Speedtest
                </Container>

                <br/>

                <div>
                    Speed - {_.round(bytesDownloaded / 1024 / 1024 * 8 / (Date.now() - startedAt) * 1000, 2)} mbps
                </div>
                <div>
                    Progress - {_.ceil(bytesDownloaded / allBytes * 100)}%
                </div>
            </div>
        }

        return (
            <div>
                <Container>
                    Speedtest
                </Container>

                <br/>

                <div>
                    Speed - {_.round(bytesDownloaded / 1024 / 1024 * 8 / (Date.now() - startedAt) * 1000, 2)} mbps
                </div>
                <div>
                    Progress - {_.ceil(bytesDownloaded / allBytes * 100)}%
                </div>

                <br/>

                <button onClick={() => {
                    console.log('onClick');

                    this._makeRequest();
                }}>Run!
                </button>
            </div>
        )
    }
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default App;
