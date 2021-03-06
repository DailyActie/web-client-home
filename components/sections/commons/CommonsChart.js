const React = require('react');
const bs = require('react-bootstrap');
const { LineChart } = require('react-echarts');
const { TimeNavigator, CustomTimeNavigator } = require('../../helpers/Navigators');

const theme = require('../../chart/themes/history');

function CommonsChart(props) {
  const { _t, isAfterToday, handlePrevious, handleNext, time, timeFilter, chartData, chartCategories, chartFormatter, width, actions } = props;
  const { setDataQueryAndFetch } = actions;
  return (
    <div className="history-chart-area">
      { 
        timeFilter === 'custom' ?  
          <CustomTimeNavigator 
            updateTime={(newTime) => { 
               setDataQueryAndFetch({ time: newTime });
            }}
            time={time}
          />
          :
          <TimeNavigator 
            handlePrevious={handlePrevious} 
            handleNext={handleNext}
            hasNext={!isAfterToday}
            time={time}
          />
      }
      <LineChart 
        width={width}
        height={380}
        theme={theme}
        xAxis={{
          data: chartCategories,
          boundaryGap: true,
        }}
        yAxis={{
          formatter: chartFormatter,
        }}
        colors={theme.colors}
        series={chartData.map(s => ({
          ...s,
        }))}
      />
      <div style={{ marginTop: 20 }} />
    </div>
  );
}

module.exports = CommonsChart;
