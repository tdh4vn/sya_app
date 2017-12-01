import { Client, Message } from 'react-native-paho-mqtt';
import { MQTT_URL } from '../constains/config';
import { NODES_RECEIVE_DATA } from '../actions/listDevices';

let instance = null;

export default class SYAMQTTClient {
  constructor() {
    this.nodeSubcribeList = [];
    this.isSubcribed = false;
    this.myStorage = {
      setItem: (key, item) => {
        this.myStorage[key] = item;
      },
      getItem: key => this.myStorage[key],
      removeItem: (key) => {
        delete this.myStorage[key];
      },
    };
    this.client = new Client({ uri: MQTT_URL, clientId: `RN_APP_001 ${new Date().getTime()}`, storage: this.myStorage });
    this.client.on('connectionLost', (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log(responseObject.errorMessage);
      }
    });
    this.client.on('messageReceived', (message) => {
      const data = message.payloadString.split(' ');
      if (data[0] !== message.destinationName && this.dispatch) {
        this.dispatch({
          type: NODES_RECEIVE_DATA,
          payload: {
            nodeId: message.destinationName,
            data: {
              temp: Number(data[0]),
              hum: Number(data[1]),
              pm2: Number(data[2]),
              lastUpdated: new Date().toISOString(),
            },
          },
        });
      }
    });

    // connect the client
    this.client.connect()
      .then(() => {
        // Once a connection has been made, make a subscription and send a message.
        this.nodeSubcribeList.forEach((nodeid) => {
          this.client.subscribe(nodeid);
        });
        this.isSubcribed = true;
      })
      .then(() => {
        const message = new Message('Hello');
        message.destinationName = 'World';
        this.client.send(message);
      })
      .catch((responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log(`onConnectionLost:${responseObject.errorMessage}`);
        }
      });
  }

  static getInstance = () => {
    if (!instance) {
      instance = new SYAMQTTClient();
    }
    return instance;
  }

  subscribeNode = (nodeId) => {
    if (this.isSubcribed) {
      if (this.nodeSubcribeList.indexOf(nodeId) > -1) {
        this.client.subscribe(nodeId);
      }
    }
    this.nodeSubcribeList.push(nodeId);
  }

  setDispatch = (dispatch) => {
    this.dispatch = dispatch;
  }
}

