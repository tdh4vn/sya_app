import moment from 'moment';

import {
  NODES_LOADING,
  NODES_LOAD_SUCCESS,
  NODES_LOAD_FAIL,
  NODES_RECEIVE_DATA,
  NODE_SHOW,
  CHART_DATA_HOUR_LOAD_FAIL,
  CHART_DATA_HOUR_LOAD_SUCESS,
  CHART_DATA_HOUR_LOADING,
  CHART_DATA_DAILY_LOADING,
  CHART_DATA_DAILY_LOAD_SUCCESS,
  CHART_DATA_DAILY_LOAD_FAIL,
} from '../actions/listDevices';

const initialState = {
  nodes: {
    data: [],
    loading: false,
  },
  flag: false,
  nodeIdSelected: '',
  tempHourChartData: [],
  aqiHourChartData: [],
  humHourChartData: [],
  tempDailyChartData: [],
  aqiDailyChartData: [],
  humDailyChartData: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case NODES_LOADING: {
      return {
        ...state,
        nodes: {
          loading: true,
          data: state.nodes.data,
        },
      };
    }
    case NODES_LOAD_SUCCESS: {
      return {
        ...state,
        nodes: {
          loading: false,
          data: action.payload,
        },
      };
    }
    case NODES_LOAD_FAIL: {
      return {
        ...state,
        nodes: {
          loading: false,
        },
      };
    }
    case NODES_RECEIVE_DATA: {
      const payload = action.payload;
      const newState = Object.assign({}, state);
      newState.nodes.data.forEach((node, idx) => {
        if (node._id === payload.nodeId) {
          const newNode = {
            name: node.name,
            _id: node._id,
            location: node.location,
            description: node.description,
            rootId: node.rootId,
            now: payload.data,
          };
          newState.nodes.data[idx] = newNode;
        }
      });
      return {
        ...newState,
        flag: !newState.flag,
      };
    }
    case NODE_SHOW:
      return {
        ...state,
        nodeIdSelected: action.payload,
      };
    case CHART_DATA_HOUR_LOAD_FAIL:
      return {
        ...state,
        tempHourChartData: [],
        aqiHourChartData: [],
        humHourChartData: [],
        tempDailyChartData: [],
        aqiDailyChartData: [],
        humDailyChartData: [],
      };
    case CHART_DATA_HOUR_LOAD_SUCESS:
      if (action.payload.type === 0) {
        return {
          ...state,
          tempHourChartData: action.payload.data,
        };
      }
      if (action.payload.type === 1) {
        return {
          ...state,
          aqiHourChartData: action.payload.data,
        };
      }
      if (action.payload.type === 2) {
        return {
          ...state,
          humHourChartData: action.payload.data,
        };
      }
      return {
        ...state,
      };
    case CHART_DATA_HOUR_LOADING:
      return {
        ...state,
        tempHourChartData: [],
        aqiHourChartData: [],
        humHourChartData: [],
        tempDailyChartData: [],
        aqiDailyChartData: [],
        humDailyChartData: [],
      };
    case CHART_DATA_DAILY_LOAD_FAIL:
      return {
        ...state,
        tempHourChartData: [],
        aqiHourChartData: [],
        humHourChartData: [],
        tempDailyChartData: [],
        aqiDailyChartData: [],
        humDailyChartData: [],
      };
    case CHART_DATA_DAILY_LOAD_SUCCESS:
      if (action.payload.type === 0) {
        return {
          ...state,
          tempDailyChartData: action.payload.data,
        };
      }
      if (action.payload.type === 1) {
        return {
          ...state,
          aqiDailyChartData: action.payload.data,
        };
      }
      if (action.payload.type === 2) {
        return {
          ...state,
          humDailyChartData: action.payload.data,
        };
      }
      return {
        ...state,
      };
    case CHART_DATA_DAILY_LOADING:
      return {
        ...state,
        tempHourChartData: [],
        aqiHourChartData: [],
        humHourChartData: [],
        tempDailyChartData: [],
        aqiDailyChartData: [],
        humDailyChartData: [],
      };
    default: return state;
  }
}
