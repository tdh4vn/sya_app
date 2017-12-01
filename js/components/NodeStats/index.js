import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, View, processColor, TouchableOpacity, Picker } from 'react-native';
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Card,
  Left,
  Right,
  CardItem,
  Body,
  Segment,
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StockLine } from 'react-native-pathjs-charts';
import {
  getChartDataHour,
  getChartDataDaily,
} from '../../actions/listDevices';
import moment from 'moment';
import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis, VictoryStack, VictoryLine, VictoryZoomContainer } from 'victory-native';
import { LineChart } from 'react-native-charts-wrapper';
import DatePicker from 'react-native-datepicker';
import { DatePickerDialog } from 'react-native-datepicker-dialog';
import { Dropdown } from 'react-native-material-dropdown';
require('moment/locale/vi');
moment.locale('vi');

class NodeStats extends Component {
  static propTypes = {
    nodeIdSelected: React.PropTypes.any,
    nodes: React.PropTypes.any,
    navigation: React.PropTypes.any,
    user: React.PropTypes.any,
    dispatch: React.PropTypes.any,
    tempHourChartData: React.PropTypes.any,
    humHourChartData: React.PropTypes.any,
    aqiHourChartData: React.PropTypes.any,
    tempDailyChartData: React.PropTypes.any,
    humDailyChartData: React.PropTypes.any,
    aqiDailyChartData: React.PropTypes.any,
    listDevices: React.PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataTemp: null,
      dataHum: null,
      dataAqi: null,
      viewMode: 0, // 0 by hour, 1 by day
      startDate: new Date(),
      startDateText: moment(new Date()).format('DD/MM/YYYY'),
      endDate: new Date(),
      endDateText: moment(new Date()).format('DD/MM/YYYY'),
      legend: {
        enabled: true,
        textColor: processColor('blue'),
        textSize: 12,
        position: 'BELOW_CHART_LEFT',
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 20,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
        custom: {
          colors: [processColor('red'), processColor('green'), processColor('blue')],
          labels: ['Cao nhất', 'Trung bình', 'Thấp nhất'],
        },
      },
      marker: {
        enabled: true,
        digits: 2,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white'),
      },
    };
    getChartDataHour(props.nodeIdSelected, 0, new Date().getTime(), props.user.token)(props.dispatch);
    getChartDataHour(props.nodeIdSelected, 1, new Date().getTime(), props.user.token)(props.dispatch);
    getChartDataHour(props.nodeIdSelected, 2, new Date().getTime(), props.user.token)(props.dispatch);
  }


  componentWillReceiveProps(nextProps) {
    const { viewMode } = this.state;
    const dataChartTemp = {
      dataSets: [{ values: [] }],
    };

    const dataChartHum = {
      dataSets: [{ values: [] }],
    };

    const dataChartAqi = {
      dataSets: [{ values: [] }],
    };

    if ((viewMode === 0 && nextProps.tempHourChartData.length > 0) || (viewMode === 1 && nextProps.tempDailyChartData.length > 0)) {
      const maxData = [];
      const minData = [];
      const avgData = [];
      if (viewMode === 0) {
        for (let i = 0; i <= 23; i++) {
          const marker = 'Không có dữ liệu';
          maxData.push({
            y: 0,
            x: i,
            marker,
          });
          minData.push({
            y: 0,
            x: i,
            marker,
          });
          avgData.push({
            y: 0,
            x: i,
            marker,
          });
        }
      }
      const arrayData = viewMode === 0 ? nextProps.tempHourChartData : nextProps.tempDailyChartData;
      let xAxis = [];
      arrayData.forEach((item, index) => {
        if (viewMode === 1) {
          xAxis.push(moment(item.date).format('DD/MM'));
          maxData.push({
            x: index,
            y: item.max,
            marker: `Cao nhất: ${parseFloat(Math.round(item.max * 100) / 100).toFixed(2)}°C`,
          });
          minData.push({
            x: index,
            y: item.min,
            marker: `Thấp nhất: ${parseFloat(Math.round(item.min * 100) / 100).toFixed(2)}°C`,
          });
          avgData.push({
            x: index,
            y: item.avg,
            marker: `Trung bình: ${parseFloat(Math.round(item.avg * 100) / 100).toFixed(2)}°C`,
          });
        } else {
          const idx = parseInt(moment(item.date).hours(), 10);
          maxData[idx].y = item.max;
          maxData[idx].marker = `Cao nhất: ${parseFloat(Math.round(item.max * 100) / 100).toFixed(2)}°C`;
          minData[idx].y = item.min;
          minData[idx].marker = `Thấp nhất: ${parseFloat(Math.round(item.min * 100) / 100).toFixed(2)}°C`;
          avgData[idx].y = item.avg;
          avgData[idx].marker = `Trung bình: ${parseFloat(Math.round(item.avg * 100) / 100).toFixed(2)}°C`;
        }
      });
      dataChartTemp.dataSets = [{
        values: maxData,
        label: 'Cao nhất',
        config: {
          lineWidth: 1,
          drawValues: false,
          highlightColor: processColor('red'),
          color: processColor('red'),
          drawFilled: false,
          fillColor: processColor('red'),
          fillAlpha: 60,
        },
      }, {
        values: avgData,
        label: 'Trung bình',
        config: {
          lineWidth: 1,
          drawValues: false,
          drawCubicIntensity: 0.4,
          circleRadius: 2,
          drawHighlightIndicators: false,
          color: processColor('green'),
          drawFilled: false,
          fillColor: processColor('green'),
          fillAlpha: 45,
          circleColor: processColor('green'),
        },
      }, {
        values: minData,
        label: 'Thấp nhất',
        config: {
          lineWidth: 1,
          drawValues: false,
          color: processColor('blue'),
          drawFilled: false,
          fillColor: processColor('blue'),
          fillAlpha: 50,
        },
      }];
      if (viewMode === 0) {
        xAxis = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
      }
      this.setState({
        dataTemp: dataChartTemp,
        xAxis: {
          valueFormatter: xAxis,
          position: 'BOTTOM',
        },
      });
    }

    if ((viewMode === 0 && nextProps.aqiHourChartData.length > 0) || (viewMode === 1 && nextProps.aqiDailyChartData.length > 0)) {
      const maxData = [];
      const minData = [];
      const avgData = [];
      if (viewMode === 0) {
        for (let i = 0; i <= 23; i++) {
          const marker = 'Không có dữ liệu';
          maxData.push({
            y: 0,
            x: i,
            marker,
          });
          minData.push({
            y: 0,
            x: i,
            marker,
          });
          avgData.push({
            y: 0,
            x: i,
            marker,
          });
        }
      }
      const arrayData = viewMode === 0 ? nextProps.aqiHourChartData : nextProps.aqiDailyChartData;
      let xAxis = [];
      arrayData.forEach((item, index) => {
        if (viewMode === 1) {
          xAxis.push(moment(item.date).format('DD/MM'));
          maxData.push({
            x: index,
            y: item.max,
            marker: `Cao nhất: ${parseFloat(Math.round(item.max * 100) / 100).toFixed(0)}`,
          });
          minData.push({
            x: index,
            y: item.min,
            marker: `Thấp nhất: ${parseFloat(Math.round(item.min * 100) / 100).toFixed(0)}`,
          });
          avgData.push({
            x: index,
            y: item.avg,
            marker: `Trung bình: ${parseFloat(Math.round(item.avg * 100) / 100).toFixed(0)}`,
          });
        } else {
          const idx = parseInt(moment(item.date).hours(), 10);
          maxData[idx].y = item.max;
          maxData[idx].marker = `Cao nhất: ${parseFloat(Math.round(item.max * 100) / 100).toFixed(0)}`;
          minData[idx].y = item.min;
          minData[idx].marker = `Thấp nhất: ${parseFloat(Math.round(item.min * 100) / 100).toFixed(0)}`;
          avgData[idx].y = item.avg;
          avgData[idx].marker = `Trung bình: ${parseFloat(Math.round(item.avg * 100) / 100).toFixed(0)}`;
        }
      });
      dataChartAqi.dataSets = [{
        values: maxData,
        label: 'Cao nhất',
        config: {
          lineWidth: 1,
          drawValues: false,
          highlightColor: processColor('red'),
          color: processColor('red'),
          drawFilled: false,
          fillColor: processColor('red'),
          fillAlpha: 60,
        },
      }, {
        values: avgData,
        label: 'Trung bình',
        config: {
          lineWidth: 1,
          drawValues: false,
          drawCubicIntensity: 0.4,
          circleRadius: 2,
          drawHighlightIndicators: false,
          color: processColor('green'),
          drawFilled: false,
          fillColor: processColor('green'),
          fillAlpha: 45,
          circleColor: processColor('green'),
        },
      }, {
        values: minData,
        label: 'Thấp nhất',
        config: {
          lineWidth: 1,
          drawValues: false,
          color: processColor('blue'),
          drawFilled: false,
          fillColor: processColor('blue'),
          fillAlpha: 50,
        },
      }];
      if (viewMode === 0) {
        xAxis = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
      }
      this.setState({
        dataAqi: dataChartAqi,
        xAxis: {
          valueFormatter: xAxis,
          position: 'BOTTOM',
        },
      });
    }

    if ((viewMode === 0 && nextProps.humHourChartData.length > 0) || (viewMode === 1 && nextProps.humDailyChartData.length > 0)) {
      const maxData = [];
      const minData = [];
      const avgData = [];
      if (viewMode === 0) {
        for (let i = 0; i <= 23; i++) {
          const marker = 'Không có dữ liệu';
          maxData.push({
            y: 0,
            x: i,
            marker,
          });
          minData.push({
            y: 0,
            x: i,
            marker,
          });
          avgData.push({
            y: 0,
            x: i,
            marker,
          });
        }
      }
      const arrayData = viewMode === 0 ? nextProps.humHourChartData : nextProps.humDailyChartData;
      let xAxis = [];
      arrayData.forEach((item, index) => {
        if (viewMode === 1) {
          xAxis.push(moment(item.date).format('DD/MM'));
          maxData.push({
            x: index,
            y: item.max,
            marker: `Cao nhất: ${parseFloat(Math.round(item.max * 100) / 100).toFixed(0)}%`,
          });
          minData.push({
            x: index,
            y: item.min,
            marker: `Thấp nhất: ${parseFloat(Math.round(item.min * 100) / 100).toFixed(0)}%`,
          });
          avgData.push({
            x: index,
            y: item.avg,
            marker: `Trung bình: ${parseFloat(Math.round(item.avg * 100) / 100).toFixed(0)}%`,
          });
        } else {
          const idx = parseInt(moment(item.date).hours(), 10);
          maxData[idx].y = item.max;
          maxData[idx].marker = `Cao nhất: ${parseFloat(Math.round(item.max * 100) / 100).toFixed(0)}%`;
          minData[idx].y = item.min;
          minData[idx].marker = `Thấp nhất: ${parseFloat(Math.round(item.min * 100) / 100).toFixed(0)}%`;
          avgData[idx].y = item.avg;
          avgData[idx].marker = `Trung bình: ${parseFloat(Math.round(item.avg * 100) / 100).toFixed(0)}%`;
        }
      });
      dataChartHum.dataSets = [{
        values: maxData,
        label: 'Cao nhất',
        config: {
          lineWidth: 1,
          drawValues: false,
          highlightColor: processColor('red'),
          color: processColor('red'),
          drawFilled: false,
          fillColor: processColor('red'),
          fillAlpha: 60,
        },
      }, {
        values: avgData,
        label: 'Trung bình',
        config: {
          lineWidth: 1,
          drawValues: false,
          drawCubicIntensity: 0.4,
          circleRadius: 2,
          drawHighlightIndicators: false,
          color: processColor('green'),
          drawFilled: false,
          fillColor: processColor('green'),
          fillAlpha: 45,
          circleColor: processColor('green'),
        },
      }, {
        values: minData,
        label: 'Thấp nhất',
        config: {
          lineWidth: 1,
          drawValues: false,
          color: processColor('blue'),
          drawFilled: false,
          fillColor: processColor('blue'),
          fillAlpha: 50,
        },
      }];
      if (viewMode === 0) {
        xAxis = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
      }
      this.setState({
        dataHum: dataChartHum,
        xAxis: {
          valueFormatter: xAxis,
          position: 'BOTTOM',
        },
      });
    }
  }

  onStartDatePick = (date) => {
    this.setState({ startDate: date, startDateText: moment(date).format('DD/MM/YYYY') });
    // getChartDataHour(this.props.nodeIdSelected, 0, date.getTime(), this.props.user.token)(this.props.dispatch);
    // getChartDataHour(this.props.nodeIdSelected, 1, date.getTime(), this.props.user.token)(this.props.dispatch);
    // getChartDataHour(this.props.nodeIdSelected, 2, date.getTime(), this.props.user.token)(this.props.dispatch);
  }

  onEndDatePick = (date) => {
    this.setState({ endDate: date, endDateText: moment(date).format('DD/MM/YYYY') });
    // getChartDataHour(this.props.nodeIdSelected, 0, date.getTime(), this.props.user.token)(this.props.dispatch);
    // getChartDataHour(this.props.nodeIdSelected, 1, date.getTime(), this.props.user.token)(this.props.dispatch);
    // getChartDataHour(this.props.nodeIdSelected, 2, date.getTime(), this.props.user.token)(this.props.dispatch);
  }

  onStartDatePress = () => {
    let { startDate } = this.state;

    if (!startDate || startDate == null) {
      startDate = new Date();
      this.setState({
        startDate,
      });
    }

    // To open the dialog
    this.startDateDialog.open({
      date: startDate,
      maxDate: new Date(), // To restirct future date
    });
  }

  onEndDatePress = () => {
    let { endDate } = this.state;

    if (!endDate || endDate == null) {
      endDate = new Date();
      this.setState({
        endDate,
      });
    }

    // To open the dialog
    this.endDateDialog.open({
      date: endDate,
      maxDate: new Date(), // To restirct future date
    });
  }

  onSearchData = () => {
    const { viewMode, startDate, endDate } = this.state;
    if (viewMode === 0) {
      getChartDataHour(this.props.nodeIdSelected, 0, startDate.getTime(), this.props.user.token)(this.props.dispatch);
      getChartDataHour(this.props.nodeIdSelected, 1, startDate.getTime(), this.props.user.token)(this.props.dispatch);
      getChartDataHour(this.props.nodeIdSelected, 2, startDate.getTime(), this.props.user.token)(this.props.dispatch);
    } else {
      getChartDataDaily(this.props.nodeIdSelected, 0, startDate.getTime(), endDate.getTime(), this.props.user.token)(this.props.dispatch);
      getChartDataDaily(this.props.nodeIdSelected, 1, startDate.getTime(), endDate.getTime(), this.props.user.token)(this.props.dispatch);
      getChartDataDaily(this.props.nodeIdSelected, 2, startDate.getTime(), endDate.getTime(), this.props.user.token)(this.props.dispatch);
    }
  }

  render() {
    const { nodeIdSelected } = this.props;
    let data;
    if (this.props.nodes) {
      this.props.nodes.data.forEach((item) => {
        if (item._id === nodeIdSelected) {
          data = item;
        }
      });
    }
    return (
      <Container>
        <Header >
          <Left>
            <Button
              transparent
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon active name="ios-arrow-back" />
            </Button>
          </Left>
          <Body>
            <Title>{data.name}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Card>
            <Picker
              selectedValue={this.state.valuePicker}
              onValueChange={(itemValue, itemIndex) => this.setState({ valuePicker: itemValue, viewMode: itemIndex })}
            >
              <Picker.Item label="Xem theo giờ" value="BY_HOUR" />
              <Picker.Item label="Xem theo ngày" value="BY_DAY" />
            </Picker>
            <TouchableOpacity
              onPress={this.onStartDatePress}
            >
              <View
                style={{
                  borderColor: '#ABABAB',
                  borderWidth: 0.5,
                  padding: 0,
                  margin: 8,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  height: 38,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    marginLeft: 5,
                    borderWidth: 0,
                    color: '#121212',
                  }}
                >{this.state.startDateText}</Text>
              </View>
            </TouchableOpacity>
            {this.state.viewMode === 1 && <TouchableOpacity
              onPress={this.onEndDatePress}
            >
              <View
                style={{
                  borderColor: '#ABABAB',
                  borderWidth: 0.5,
                  padding: 0,
                  margin: 8,
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                  borderBottomLeftRadius: 4,
                  borderBottomRightRadius: 4,
                  height: 38,
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    marginLeft: 5,
                    borderWidth: 0,
                    color: '#121212',
                  }}
                >{this.state.endDateText}</Text>
              </View>
            </TouchableOpacity>}
            <CardItem footer>
              <Right>
                <Button iconLeft light onPress={this.onSearchData}>
                  <Icon name="ios-stats" />
                  <Text>Xem dữ liệu</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
          {this.state.dataAqi && <Card>
            <CardItem header>
              <Text>Chất lượng không khí</Text>
            </CardItem>
            <LineChart
              style={{ flex: 1, width: '100%', height: 300 }}
              data={this.state.dataAqi}
              chartDescription={{ text: 'Chất lượng không khí' }}
              legend={this.state.legend}
              marker={this.state.marker}
              xAxis={this.state.xAxis}
              drawGridBackground={false}
              borderColor={processColor('teal')}
              borderWidth={1}
              drawBorders={false}
              touchEnabled
              dragEnabled
              scaleEnabled
              scaleXEnabled
              scaleYEnabled={false}
              pinchZoom
              doubleTapToZoomEnabled
              dragDecelerationEnabled
              dragDecelerationFrictionCoef={0.99}
              keepPositionOnRotation={false}
              onSelect={this.handleSelect}
            />
          </Card>}
          {this.state.dataTemp && <Card>
            <CardItem header>
              <Text>Nhiệt độ</Text>
            </CardItem>
            <LineChart
              style={{ flex: 1, width: '100%', height: 300 }}
              data={this.state.dataTemp}
              chartDescription={{ text: 'Nhiệt độ' }}
              legend={this.state.legend}
              marker={this.state.marker}
              xAxis={this.state.xAxis}
              drawGridBackground={false}
              borderColor={processColor('teal')}
              borderWidth={1}
              drawBorders={false}
              touchEnabled
              dragEnabled
              scaleEnabled
              scaleXEnabled
              scaleYEnabled={false}
              pinchZoom
              doubleTapToZoomEnabled
              dragDecelerationEnabled
              dragDecelerationFrictionCoef={0.99}
              keepPositionOnRotation={false}
              onSelect={this.handleSelect}
            />
          </Card>}
          {this.state.dataHum && <Card>
            <CardItem header>
              <Text>Độ ẩm</Text>
            </CardItem>
            <LineChart
              style={{ flex: 1, width: '100%', height: 300 }}
              data={this.state.dataHum}
              chartDescription={{ text: 'Độ ẩm' }}
              legend={this.state.legend}
              marker={this.state.marker}
              xAxis={this.state.xAxis}
              drawGridBackground={false}
              borderColor={processColor('teal')}
              borderWidth={1}
              drawBorders={false}
              touchEnabled
              dragEnabled
              scaleEnabled
              scaleXEnabled
              scaleYEnabled={false}
              pinchZoom
              doubleTapToZoomEnabled
              dragDecelerationEnabled
              dragDecelerationFrictionCoef={0.99}
              keepPositionOnRotation={false}
              onSelect={this.handleSelect}
            />
          </Card>}
        </Content>
        <DatePickerDialog ref={(ref) => { this.startDateDialog = ref; }} onDatePicked={this.onStartDatePick} />
        <DatePickerDialog ref={(ref) => { this.endDateDialog = ref; }} onDatePicked={this.onEndDatePick} />
      </Container>
    );
  }
}

NodeStats.navigationOptions = {
  header: null,
};

const mapDispatchToProps = dispatch => ({
  dispatch,
});

const mapStateToProps = state => ({
  nodes: state.listDevices.nodes,
  flag: state.listDevices.flag,
  nodeIdSelected: state.listDevices.nodeIdSelected,
  tempHourChartData: state.listDevices.tempHourChartData,
  aqiHourChartData: state.listDevices.aqiHourChartData,
  humHourChartData: state.listDevices.humHourChartData,
  tempDailyChartData: state.listDevices.tempDailyChartData,
  aqiDailyChartData: state.listDevices.aqiDailyChartData,
  humDailyChartData: state.listDevices.humDailyChartData,
  user: state.user,
});
export default connect(mapStateToProps, mapDispatchToProps)(NodeStats);
