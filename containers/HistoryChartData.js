const { connect } = require('react-redux');
const { bindActionCreators } = require('redux');
const { injectIntl } = require('react-intl');

const HistoryActions = require('../actions/HistoryActions');

const HistoryChart = require('../components/sections/HistoryChart');

const { bringPastSessionsToPresent } = require('../utils/time');
const { getChartMeterData, getChartAmphiroData, getChartMeterCategories, getChartMeterCategoryLabels, getChartAmphiroCategories } = require('../utils/chart');
const { getDeviceNameByKey } = require('../utils/device');
const { getLastShowerIdFromMultiple } = require('../utils/sessions');
const { getMetricMu } = require('../utils/general');


function mapStateToProps(state) {
  return {
    time: state.section.history.time,
    filter: state.section.history.filter,
    devices: state.user.profile.devices,
    activeDeviceType: state.section.history.activeDeviceType,
    timeFilter: state.section.history.timeFilter,
    data: state.section.history.data,
    comparisonData: state.section.history.comparisonData,
    width: state.viewport.width,
    forecasting: state.section.history.forecasting,
    forecastData: state.section.history.forecastData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(HistoryActions, dispatch);
}

function mergeProps(stateProps, dispatchProps, ownProps) {
  const xCategories = stateProps.activeDeviceType === 'METER' ? 
    getChartMeterCategories(stateProps.time) : 
      getChartAmphiroCategories(stateProps.timeFilter, getLastShowerIdFromMultiple(stateProps.data));

  const chartData = stateProps.data.map((devData) => {  
    if (stateProps.activeDeviceType === 'METER') {
      const xData = getChartMeterData(devData.sessions,
                          xCategories, 
                          stateProps.time
                         ).map(x => x && x[stateProps.filter] && x[stateProps.filter] ? 
                           Math.round(100 * x[stateProps.filter]) / 100
                           : null);
      return {
        name: 'SWM',
        data: xData,
        metadata: {
          device: devData.deviceKey,
          ids: xData.map(val => val ? [val.id, val.timestamp] : [null, null])
        },
      };
    } else if (stateProps.activeDeviceType === 'AMPHIRO') {
      const sessions = devData.sessions 
      .map(session => ({
        ...session,
        duration: Math.round(100 * (session.duration / 60)) / 100,
        energy: Math.round(session.energy / 10) / 100,
      }));
      const xData = getChartAmphiroData(sessions, xCategories);
      return {
        name: getDeviceNameByKey(stateProps.devices, devData.deviceKey) || '', 
        data: xData.map(x => x ? x[stateProps.filter] : null),
        metadata: {
          device: devData.deviceKey,
          ids: xData.map(val => val ? [val.id, val.timestamp] : [null, null])
        },
      };
    }
    return [];
  });

  const xCategoryLabels = stateProps.activeDeviceType === 'METER' ?
    getChartMeterCategoryLabels(xCategories, stateProps.time, ownProps.intl)
     : xCategories;

  const comparison = stateProps.comparisonData.map((devData) => {
    const xData = stateProps.activeDeviceType === 'METER' ? 
        getChartMeterData(bringPastSessionsToPresent(devData.sessions, stateProps.timeFilter),
                          xCategories, 
                          stateProps.time
                         ).map(x => x && x[stateProps.filter] && x[stateProps.filter] ? 
                           Math.round(100 * x[stateProps.filter]) / 100
                           : null)
       : 
         [];
    return ({
      name: 'SWM' +
         ` (previous ${stateProps.timeFilter})`,
      data: xData,
    });
  });
  
  const forecast = stateProps.activeDeviceType === 'METER' && stateProps.forecasting && stateProps.forecastData ? 
    [{
      name: 'Forecast',
      data: getChartMeterData(stateProps.forecastData.sessions,
                        xCategories, 
                        stateProps.time
                       ).map(x => x && x[stateProps.filter] && x[stateProps.filter] ? 
                         Math.round(100 * x[stateProps.filter]) / 100
                         : null),
      lineType: 'dashed',
      color: '#2d3480',
      fill: 0.1,
      symbol: 'emptyRectangle',
    }]
    : [];

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    xCategoryLabels,
    mu: getMetricMu(stateProps.filter), 
    chartData: [
      ...chartData,
      ...forecast,
      ...comparison,
    ],
    //chart width = viewport width - main menu - sidebar left - sidebar right - padding
    width: Math.max(stateProps.width - 130 - 160 - 160 - 20, 550),
    onPointClick: (series, index) => {
      const device = chartData[series] ? 
        chartData[series].metadata.device 
        : null;
        
      const [id, timestamp] = chartData[series] 
       && chartData[series].metadata.ids ? 
         chartData[series].metadata.ids[index] 
         : [null, null];
      dispatchProps.setActiveSession(device, id, timestamp);
    },
  };
}

const HistoryChartData = injectIntl(connect(mapStateToProps, 
                                            mapDispatchToProps, 
                                            mergeProps
                                           )(HistoryChart));
module.exports = HistoryChartData;
