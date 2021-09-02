import React, { Component } from 'react';
import './App.css';
import autoBind from 'react-autobind';
import Line from './components/line';
import { Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap"
import Footer from './assets/footer.jpg';
import {isMobile} from 'react-device-detect';

function toTimestamp(strDate) {
  let datum = Date.parse(strDate);
  return datum;
}

function base64ToHex(str) {
  const raw = atob(str);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += (hex.length === 2 ? hex : '0' + hex);
  }
  return result.toUpperCase();
}

function hexStringtoHexArray(str) {
  let result = [];
  for (let i = 0; i < str.length; i += 2) {
    result.push(parseInt(str.substr(i, 2), 16));
  }
  return result;
}

function hexArraytoCharArray(arr) {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(String.fromCharCode(arr[i]));
  }
  return result;
}

function charArraytoString(array) {
  let result = '';
  for (let i = 0; i < array.length; i++) {
    if (array[i] !== '\n' && array[i] !== '\r') {
      result += array[i];
    }
  }
  return result;
}

function processing(input) {
  let result = base64ToHex(input);
  result = hexStringtoHexArray(result);
  result = hexArraytoCharArray(result);
  result = charArraytoString(result);
  result = result.split(',');
  return result;
}

processing("MCwzNi4xMA0K")

var curr = new Date();
var date = curr.toISOString().substr(0, 10);

class App extends Component {
  constructor(props) {
    super(props);
    autoBind(this);
    this.state = {
      data1: [{
        label: "Temp",
        data: []
      },
      {
        label: "High Temp",
        data: []
      },
      {
        label: "Low Temp",
        data: []
      }],
      data2: [{
        label: "PPM",
        data: []
      },
      {
        label: "Good",
        data: []
      },
      {
        label: "Moderate",
        data: []
      },
      {
        label: "Unhealthy (sensitive groups)",
        data: []
      },
      {
        label: "Unhealthy",
        data: []
      },
      {
        label: "Very Unhealthy",
        data: []
      },
      {
        label: "Hazardous",
        data: []
      }],
      isLoading: true,
    }
    this.unirest = require('unirest');
  }

  dateCallback(date) {
    this.setState({
      isLoading: true
    }, () => {
    console.log(date.target.value)
    const start = toTimestamp(date.target.value) / 1000;
    const end = start + 86400;

    this.unirest('GET', 'https://jn6rfqa9h4.execute-api.us-east-2.amazonaws.com/He-alth-aws-database')
      .headers({
        'min': start,
        'max': end,
        'device': 'M5Device'
      })
      .end((res) => {
        if (res.error) throw new Error(res.error);
        let temp1 = this.state.data1;
        let temp2 = this.state.data2;
        temp1[0].data = [];
        temp1[1].data = [{ primary: res.body[0].Report * 1000, secondary: 37 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 37 }];
        temp1[2].data = [{ primary: res.body[0].Report * 1000, secondary: 35 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 35 }];
        temp2[0].data = [];
        temp2[1].data = [{ primary: res.body[0].Report * 1000, secondary: 50 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 50 }];
        temp2[2].data = [{ primary: res.body[0].Report * 1000, secondary: 100 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 100 }];
        temp2[3].data = [{ primary: res.body[0].Report * 1000, secondary: 150 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 150 }];
        temp2[4].data = [{ primary: res.body[0].Report * 1000, secondary: 200 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 200 }];
        temp2[5].data = [{ primary: res.body[0].Report * 1000, secondary: 300 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 300 }];
        temp2[6].data = [{ primary: res.body[0].Report * 1000, secondary: 500 }, { primary: res.body[res.body.length - 1].Report * 1000, secondary: 500 }];
        for (let i = 0; i < res.body.length; i++) {
          if ("AP8A/w==" === res.body[i].payload.payload) {
            continue; // Avoid failed payload
          }
          temp1[0].data.push({ primary: res.body[i].Report * 1000, secondary: processing(res.body[i].payload.payload)[1] })
          temp2[0].data.push({ primary: res.body[i].Report * 1000, secondary: processing(res.body[i].payload.payload)[0] })
        }
        this.setState({
          data1: temp1,
          data2: temp2,
          isLoading: false
        });
      });
    });
  }

  componentDidMount() {
    var date_event = { target: { value: date } };
    this.dateCallback(date_event)
  }

  render() {
    if(isMobile){
      return (
        <div style={{width:"100%"}}>
          <header className="App-headerM">
            <h1> Healthium</h1>
            Select Date:
            <Input style={{ fontSize: "1.3rem" }} defaultValue={date} onChange={this.dateCallback} type="date" min="2021-05-01" max={date} />
          </header>
          <body className="App-bodyM">
            <Row md="1">
              <Col xs="12" style={{ padding: "20px" }}>
                <Card style={{ background: "white", borderRadius: "5px" }}>
                  <CardHeader>
                    <h3 style={{ color: "black" }}>Clients Temperature{" "}
                      {
                        this.state.isLoading ?
                          <>
                            <span style={{ color: "red" }}>
                              loading...
                            </span>
                          </>
                          :
                          <>
                          </>
                      }
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div style={{ padding: "0px" }}>
                      <Line data={this.state.data1} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" style={{ padding: "20px" }}>
                <Card style={{ background: "white", borderRadius: "5px" }}>
                  <CardHeader>
                    <h3 style={{ color: "black" }}>Enviroment PPM{" "}
                      {
                        this.state.isLoading ?
                          <>
                            <span style={{ color: "red" }}>
                              loading...
                            </span>
                          </>
                          :
                          <>
                          </>
                      }</h3>
                  </CardHeader>
                  <CardBody>
                    <div style={{ padding: "20px" }}>
                      <Line data={this.state.data2} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </body>
          <footer className="App-footer">
            <img alt="footer" height="100%" style={{ objectFit: "fill" }} src={Footer}></img>
          </footer>
        </div>
      );
    }
    else{
      return (
        <div className="App">
          <header className="App-header">
            <h1> Healthium</h1>
            Select Date:
            <Input style={{ fontSize: "1.8rem" }} defaultValue={date} onChange={this.dateCallback} type="date" min="2021-05-01" max={date} />
          </header>
          <body className="App-body">
            <Row md="2">
              <Col xs="6" style={{ padding: "20px" }}>
                <Card style={{ background: "white", borderRadius: "5px" }}>
                  <CardHeader>
                    <h3 style={{ color: "black" }}>Clients Temperature{" "}
                      {
                        this.state.isLoading ?
                          <>
                            <span style={{ color: "red" }}>
                              loading...
                            </span>
                          </>
                          :
                          <>
                          </>
                      }
                    </h3>
                  </CardHeader>
                  <CardBody>
                    <div style={{ padding: "20px" }}>
                      <Line data={this.state.data1} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="6" style={{ padding: "20px" }}>
                <Card style={{ background: "white", borderRadius: "5px" }}>
                  <CardHeader>
                    <h3 style={{ color: "black" }}>Enviroment PPM{" "}
                      {
                        this.state.isLoading ?
                          <>
                            <span style={{ color: "red" }}>
                              loading...
                            </span>
                          </>
                          :
                          <>
                          </>
                      }</h3>
                  </CardHeader>
                  <CardBody>
                    <div style={{ padding: "20px" }}>
                      <Line data={this.state.data2} />
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </body>
          <footer className="App-footer">
            <img alt="footer" height="100%" style={{ objectFit: "fill" }} src={Footer}></img>
          </footer>
        </div>
      );
    }
  }
}

export default App;
