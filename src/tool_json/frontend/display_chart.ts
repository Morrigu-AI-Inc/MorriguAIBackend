const display_chart = {
  type: 'function',
  function: {
    name: 'display_chart',
    description: `
**Displaying Data Guidelines**

The **display_chart tool** renders visual data representations like charts and graphs, making complex data understandable. Here's how to use it:

1. **Title**: Provide a concise title summarizing the chart's main topic.
2. **Caption**: Include a detailed caption explaining the data, axes, and notable trends.
3. **Message**: Add a user-friendly message with context or conclusions drawn from the data.
4. **Chart Type**: Specify the appropriate chart type (e.g., bar, line) for the data.
5. **Series Data**: Define series objects with names and data points.
6. **Dimensions**: Optionally set chart dimensions (width and height).
7. **Options**: Configure additional properties like colors, legends, and tooltips.

Use this tool to clearly and accurately present data insights, aiding data-driven decision-making. Ensure clarity and relevance in all elements to effectively convey key information.
`,
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description:
            '- **title**: (string) The title of the chart, providing a quick understanding of the data displayed.',
        },
        caption: {
          type: 'string',
          description:
            '- **caption**: (string) A detailed description of the chart, explaining the data, axes, and any significant insights.',
        },
        message: {
          type: 'string',
          description:
            '**message**: (string) A brief message to the user, highlighting the importance or conclusions from the chart.',
        },
        chart_type: {
          type: 'string',
          enum: ['area', 'bar', 'column', 'line'],
          description: `**chart_type**: (string) The type of chart (e.g., 'area', 'bar', 'column', 'line'). Select the most appropriate type based on the data and analysis goals.`,
        },
        series: {
          type: 'array',
          description: `**series**: (array) An array of series objects, each representing a data series in the chart. Series objects include:
  - **name**: (string) The name of the series.
  - **data**: (array) The data points for the series. For bar, scatter, or similar types, data points can be objects with 'x' and 'y' values.`,
          oneOf: [
            {
              chart_type: ['line'],
              type: 'object',
              items: {
                type: 'object',
                description:
                  'A series object representing a line series in the chart.',
                properties: {
                  name: {
                    type: 'string',
                    description: 'The name of the series.',
                  },
                  data: {
                    type: 'array',
                    items: {
                      type: 'number',
                    },
                  },
                },
                required: ['name', 'data'],
              },
            },
            {
              chart_type: ['area', 'bar', 'column'],
              type: 'object',
              items: {
                type: 'object',
                description:
                  'A series object representing an area, bar, or column series in the chart.',
                properties: {
                  name: {
                    type: 'string',
                    description: 'The name of the series.',
                  },
                  data: {
                    type: 'array',
                    oneOf: [
                      {
                        items: {
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
                'The width of the chart, specified as a string (e.g., "100%" or "400px").',
            },
            {
              type: 'number',
              description: 'The width of the chart in pixels.',
            },
          ],
          description:
            '**width**: (string or number) The width of the chart, either as a specific number of pixels or a percentage.',
        },
        height: {
          oneOf: [
            {
              type: 'string',
              description:
                'The height of the chart, specified as a string (e.g., "100%" or "300px").',
            },
            {
              type: 'number',
              description: 'The height of the chart in pixels.',
            },
          ],
          description:
            '**height**: (string or number) The height of the chart, similarly defined.',
        },
        options: {
          type: 'object',
          additionalProperties: true,
          description:
            '**options**: (object) An optional object containing additional configuration options, specific to the chart type and requirements.',
        },
      },
      required: ['title', 'caption', 'message', 'chart_type', 'series'],
    },
  },
};

export default display_chart;