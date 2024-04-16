const display_chart = {
  type: 'function',
  function: {
    name: 'display_chart',
    description:
      'Use this tool when rendering data as much as possible so that the user can see it in a better format. Configures data parameters for various types of charts using react-apexcharts, supporting a wide range of chart types like line, area, bar, pie, and more, according to the specified properties in the Props interface. Renders the chart with the specified data parameters. When responding to the tool_outputs just summarize the data and do not include the chart itself. The chart will be displayed in the frontend.',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Title of the chart.',
        },
        caption: {
          type: 'string',
          description:
            'Caption of the chart. Be very detailed and explain the chart.',
        },
        message: {
          type: 'string',
          description: 'Message to the user about the chart.',
        },

        type: {
          type: 'string',
          enum: [
            'line',
            'area',
            'bar',
            'pie',
            'donut',
            'radialBar',
            'scatter',
            'bubble',
            'heatmap',
            'candlestick',
            'boxPlot',
            'radar',
            'polarArea',
            'rangeBar',
            'rangeArea',
            'treemap',
          ],
          description: 'Defines the type of the chart to be rendered.',
        },
        series: {
          type: 'array',
          description: 'Array of series objects representing the chart data.',
          oneOf: [
            {
              items: {
                type: 'object',
                description:
                  'Series object representing a series in the chart.',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the series.',
                  },

                  data: {
                    type: 'array',
                    oneOf: [
                      {
                        items: {
                          // For types like bar, scatter where data points are objects
                          type: 'object',
                          properties: {
                            x: { type: 'string' },
                            y: { type: 'number' },
                          },
                          required: ['x', 'y'],
                        },
                      },
                    ],
                  },
                },
                required: ['name', 'data'],
              },
            },
          ],
        },
        width: {
          oneOf: [
            {
              type: 'string',
              description:
                'Width of the chart, which can be expressed in pixels or percentage.',
            },
            { type: 'number', description: 'Width of the chart in pixels.' },
          ],
          description: 'Specifies the width of the chart.',
        },
        height: {
          oneOf: [
            {
              type: 'string',
              description:
                'Height of the chart, which can be expressed in pixels or percentage.',
            },
            { type: 'number', description: 'Height of the chart in pixels.' },
          ],
          description: 'Specifies the height of the chart.',
        },
        options: {
          type: 'object',
          additionalProperties: true,
          description:
            'A complex object holding various configuration options specific to the type of chart being rendered.',
        },
      },
      required: ['type', 'series', 'title', 'caption', 'message'],
    },
  },
};

export default display_chart;
