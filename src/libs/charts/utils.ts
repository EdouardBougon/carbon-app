export const getOptions = (bidsData: number[][], asksData: number[][]) => {
  return {
    chart: {
      type: 'area',
      zoomType: 'xy',
      backgroundColor: '#000000',
      borderColor: '#000000',
    },
    title: {
      text: ' ',
    },
    xAxis: {
      minPadding: 0,
      maxPadding: 0,
      plotLines: [
        {
          color: 'rgba(255, 255, 255, 0.25)',
          opacity: 0.75,
          value: 0.1523,
          width: 1.5,
          label: {
            text: ' ',
            rotation: 90,
          },
        },
      ],
      title: {},
      tickWidth: 0,
      lineWidth: 0,
      labels: {
        style: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    },
    yAxis: [
      {
        lineWidth: 0,
        gridLineWidth: 0,
        title: null,
        tickWidth: 0,
        tickLength: 5,
        tickPosition: 'inside',
        labels: {
          x: 50,
          enabled: false,
        },
      },
      {
        opposite: true,
        linkedTo: 0,
        lineWidth: 0,
        gridLineWidth: 0,
        title: null,
        tickWidth: 0,
        tickLength: 5,
        tickPosition: 'inside',
        labels: {
          style: {
            color: 'rgba(255, 255, 255, 0.6)',
          },
        },
      },
    ],
    legend: {
      enabled: false,
    },
    plotOptions: {
      area: {
        fillOpacity: 0.2,
        lineWidth: 1,
        step: 'center',
      },
    },
    tooltip: {
      headerFormat:
        '<span style="font-size=10px;">Price: {point.key}</span><br/>',
      valueDecimals: 2,
    },
    series: [
      {
        name: 'Asks',
        data: asksData,
        color: 'rgba(216, 99, 113, 0.8)',
      },
      {
        name: 'Bids',
        data: bidsData,
        color: 'rgba(0, 181, 120, 0.8);',
      },
    ],
  };
};
