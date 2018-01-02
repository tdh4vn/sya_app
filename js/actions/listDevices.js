import httpRequest from '../helpers/requestBuilder';
import SYAMqttServer from '../core/SYAMqttClient';

export const NODES_LOADING = 'NODES_LOADING';
export const NODES_LOAD_SUCCESS = 'NODES_LOAD_SUCCESS';
export const NODES_LOAD_FAIL = 'NODES_LOAD_FAIL';
export const NODES_RECEIVE_DATA = 'NODES_RECEIVE_DATA';
export const NODE_SHOW = 'NODE_SHOW';
export const NODE_RECEIVE_CONTROL = 'NODE_RECEIVE_CONTROL';


export const NODES_OWNER_LOADING = 'NODES_OWNER_LOADING';
export const NODES_OWNER_LOAD_SUCCESS = 'NODES_OWNER_LOAD_SUCCESS';
export const NODES_OWNER_LOAD_FAIL = 'NODES_OWNER_LOAD_FAIL';

export const ADD_NODE_ACTION = 'ADD_NODE_ACTION';
export const ADD_NODE_SUCCESS_ACTION = 'ADD_NODE_SUCCESS_ACTION';
export const ADD_NODE_FAIL_ACTION = 'ADD_NODE_FAIL_ACTION';

export const CHART_DATA_HOUR_LOADING = 'CHART_DATA_HOUR_LOADING';
export const CHART_DATA_HOUR_LOAD_SUCESS = 'CHART_DATA_HOUR_LOAD_SUCESS';
export const CHART_DATA_HOUR_LOAD_FAIL = 'CHART_DATA_HOUR_LOAD_FAIL';

export const CHART_DATA_DAILY_LOADING = 'CHART_DATA_DAILY_LOADING';
export const CHART_DATA_DAILY_LOAD_SUCCESS = 'CHART_DATA_DAILY_LOAD_SUCCESS';
export const CHART_DATA_DAILY_LOAD_FAIL = 'CHART_DATA_DAILY_LOAD_FAIL';

export const getNodes = token => async (dispatch) => {
  SYAMqttServer.getInstance().setDispatch(dispatch);
  const options = {
    method: 'GET',
  };
  dispatch({
    type: NODES_LOADING,
  });
  try {
    const response = await httpRequest(`/nodes/infos?token=${token}`, options);
    if (response.success) {
      response.data.forEach((nodeData) => {
        SYAMqttServer.getInstance().subscribeNode(nodeData._id);
      });
      dispatch({
        type: NODES_LOAD_SUCCESS,
        payload: response.data,
      });
    } else {
      dispatch({
        type: NODES_LOAD_FAIL,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: NODES_LOAD_FAIL,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};

export const addNode = (token, nodeid, password, name, description, latitude, longitude) => async (dispatch) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nodeid,
      password,
      name,
      description,
      latitude,
      longitude,
    }),
  };
  dispatch({
    type: ADD_NODE_ACTION,
  });
  try {
    const response = await httpRequest(`/nodes/add?token=${token}`, options);
    if (response.success) {
      dispatch({
        type: ADD_NODE_SUCCESS_ACTION,
        payload: {
          data: response.data,
        },
      });
    } else {
      dispatch({
        type: ADD_NODE_FAIL_ACTION,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: ADD_NODE_FAIL_ACTION,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};

export const getOwnerNodes = token => async (dispatch) => {
  const options = {
    method: 'GET',
  };
  dispatch({
    type: NODES_OWNER_LOADING,
  });
  try {
    const response = await httpRequest(`/nodes/controls?token=${token}`, options);
    if (response.success) {
      response.data.forEach((nodeData) => {
        SYAMqttServer.getInstance().subscribeNode(`${nodeData._id}/light_state`);
      });
      dispatch({
        type: NODES_OWNER_LOAD_SUCCESS,
        payload: response.data.map(item => ({
          _id: item._id,
          isPrivate: item.isPrivate,
          description: item.description,
          name: item.name,
          history_locations: item.history_locations,
          current_location: item.current_location,
          currentState: false,
        })),
      });
    } else {
      dispatch({
        type: NODES_OWNER_LOAD_FAIL,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: NODES_OWNER_LOAD_FAIL,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};

export const showDetailNode = nodeId => (dispatch) => {
  dispatch({
    type: NODE_SHOW,
    payload: nodeId,
  });
};

export const getChartDataHour = (nodeId, type, date, token) => async (dispatch) => {
  // https://seeyourair.com:8443/data/hour?type=2

  // 0 ndo, 1 qai, 2 do am
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      nodeId,
      date,
    }),
  };
  dispatch({
    type: CHART_DATA_HOUR_LOADING,
  });
  try {
    const response = await httpRequest(`/data/hour?type=${type}`, options);
    if (response.success) {
      dispatch({
        type: CHART_DATA_HOUR_LOAD_SUCESS,
        payload: {
          type,
          data: response.data,
        },
      });
    } else {
      dispatch({
        type: CHART_DATA_HOUR_LOAD_FAIL,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: CHART_DATA_HOUR_LOAD_FAIL,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};

export const getChartDataDaily = (nodeId, type, start, end, token) => async (dispatch) => {
  // https://seeyourair.com:8443/data/hour?type=2

  // 0 ndo, 1 qai, 2 do am
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
    },
    body: JSON.stringify({
      nodeId,
      start,
      end,
      type,
    }),
  };
  dispatch({
    type: CHART_DATA_DAILY_LOADING,
  });
  try {
    const response = await httpRequest('/data/daily', options);
    if (response.success) {
      dispatch({
        type: CHART_DATA_DAILY_LOAD_SUCCESS,
        payload: {
          type,
          data: response.data,
          start,
          end,
        },
      });
    } else {
      dispatch({
        type: CHART_DATA_DAILY_LOAD_FAIL,
        payload: response,
      });
    }
  } catch (e) {
    dispatch({
      type: CHART_DATA_DAILY_LOAD_FAIL,
      payload: {
        success: false,
        msg: e.toString(),
      },
    });
  }
};
