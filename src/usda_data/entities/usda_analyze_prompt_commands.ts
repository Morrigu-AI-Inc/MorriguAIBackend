export const analyze_cattle_on_feed_stats = (report) => `

===== REPORT =====
${report}
===== END REPORT =====

=== ANALYZE THE REPORT ===

Task: You will be analyzing the Cattle on Feed Statistics report from the USDA. The report contains the following statistics:

==== FORMAT ===== 
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Cattle on Feed Statistics",
  "type": "object",
  "properties": {
    "report_date": {
      "type": "string",
      "format": "date",
      "description": "The release date of the report"
    },
    "cattle_on_feed": {
      "type": "object",
      "properties": {
        "total_inventory": {
          "type": "number",
          "description": "Total number of cattle and calves on feed for the slaughter market",
          "unit": "head"
        },
        "placements": {
          "type": "object",
          "properties": {
            "total": {
              "type": "number",
              "description": "Total placements in feedlots during the reporting period",
              "unit": "head"
            },
            "by_weight_group": {
              "type": "object",
              "properties": {
                "under_600_lbs": {
                  "type": "number",
                  "unit": "head"
                },
                "600_699_lbs": {
                  "type": "number",
                  "unit": "head"
                },
                "700_799_lbs": {
                  "type": "number",
                  "unit": "head"
                },
                "800_899_lbs": {
                  "type": "number",
                  "unit": "head"
                },
                "900_999_lbs": {
                  "type": "number",
                  "unit": "head"
                },
                "1000_lbs_and_greater": {
                  "type": "number",
                  "unit": "head"
                }
              },
              "required": ["under_600_lbs", "600_699_lbs", "700_799_lbs", "800_899_lbs", "900_999_lbs", "1000_lbs_and_greater"]
            }
          },
          "required": ["total", "by_weight_group"]
        },
        "marketings": {
          "type": "number",
          "description": "Total marketings of fed cattle during the reporting period",
          "unit": "head"
        },
        "other_disappearance": {
          "type": "number",
          "description": "Total other disappearance during the reporting period",
          "unit": "head"
        }
      },
      "required": ["total_inventory", "placements", "marketings", "other_disappearance"]
    },
    "state_data": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "state": {
            "type": "string",
            "description": "Name of the state"
          },
          "inventory": {
            "type": "object",
            "patternProperties": {
              "^.*$": {
                "type": "number",
                "unit": "head",
                "description": "Inventory count for a specific date"
              }
            }
          },
          "placements": {
            "type": "object",
            "patternProperties": {
              "^.*$": {
                "type": "number",
                "unit": "head",
                "description": "Placements count for a specific date"
              }
            }
          },
          "marketings": {
            "type": "object",
            "patternProperties": {
              "^.*$": {
                "type": "number",
                "unit": "head",
                "description": "Marketings count for a specific date"
              }
            }
          },
          "other_disappearance": {
            "type": "object",
            "patternProperties": {
              "^.*$": {
                "type": "number",
                "unit": "head",
                "description": "Other disappearance count for a specific date"
              }
            }
          }
        },
        "required": ["state", "inventory", "placements", "marketings", "other_disappearance"]
      }
    },
    "root_mean_square_error": {
      "type": "object",
      "properties": {
        "on_feed": {
          "type": "number",
          "description": "Root mean square error for on feed estimates",
          "unit": "percent"
        },
        "placements": {
          "type": "number",
          "description": "Root mean square error for placements estimates",
          "unit": "percent"
        },
        "marketings": {
          "type": "number",
          "description": "Root mean square error for marketings estimates",
          "unit": "percent"
        }
      },
      "required": ["on_feed", "placements", "marketings"]
    }
  },
  "required": ["report_date", "cattle_on_feed", "state_data", "root_mean_square_error"]
}
==== END FORMAT ====

Please analyze the report and provide all of the statistics mentioned above in JSON format. Be sure to use whole numbers for the counts and decimal numbers for the root mean square errors.

==== EXAMPLE OUTPUT ==== 
{
  "report_date": "2022-02-25",
  "cattle_on_feed": {
    "total_inventory": 123456,
    "placements": {
      "total": 12345,
      "by_weight_group": {
        "under_600_lbs": 1234,
        "600_699_lbs": 1234,
        "700_799_lbs": 1234,
        "800_899_lbs": 1234,
        "900_999_lbs": 1234,
        "1000_lbs_and_greater": 1234
      }
    },
    "marketings": 12345,
    "other_disappearance": 1234
  },
  "state_data": [
    {
      "state": "Texas",
      "inventory": {
        "2022-01-01": 12345,
        "2022-02-01": 12345
      },
      "placements": {
        "2022-01-01": 1234,
        "2022-02-01": 1234
      },
      "marketings": {
        "2022-01-01": 1234,
        "2022-02-01": 1234
      },
      "other_disappearance": {
        "2022-01-01": 123,
        "2022-02-01": 123
      }
    }
  ],
  "root_mean_square_error": {
    "on_feed": 1.23,
    "placements": 1.23,
    "marketings": 1.23
  }
}

`;

export const summary_usda_report = (report) => `
    **Task**: Summarize the following USDA report. Focus on the content of the report and provide a detailed summary.

    - **Do not** focus on the people as this is government data and is trusted.
    - **Format**: Markdown format only for content (https://www.markdownguide.org/basic-syntax/)
    - **Input**: A USDA report
    - **Output**: A summary of the report
    - **Instructions**: Summarize the following USDA report. The summary should be extremely detailed and should cover all the important points in the report.

    **Report**: ${report}

    **Note**: You must only write the report summary. Do not talk to the user or provide any other information.
    `;

export const analyze_livestock_slaughter_report = (report) => `
      Task: 
      Respond in JSON format with the following metrics in the schema extracted from the USDA report. 
      Focus on the key data points and provide a structured response.
      Be very detailed and provide all the necessary data points. For state by state breakdowns, 
      provide the data for each and every state mentioned in the report. 
      When numbers are mentioned, you must supply the full and complete number you need to infer the number from the context. 
      If the description tells you how to calculate the number, you must provide the number and the calculation.

      Report: ${report}

      Use the following JSON schema for the response and provide the data points in the respective fields. You do not need to include the schema in the response. Just the data points in JSON format.
      {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "title": "Cattle Report Metrics",
        "type": "object",
        "properties": {
          "totalHeadSlaughtered": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "const": "The number of cattle slaughtered provides insight into market supply and demand."
              },
              "date": {
                "type": "string",
                "format": "date",
                "description": "Date of the data point"
              },
              "value": {
                "type": "number",
                "description": "Total head of cattle slaughtered"
              }
            },
            "required": ["description", "date", "value"]
          },
          "averageLiveWeight": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "const": "This measures the average weight of cattle before slaughter, which impacts meat yield and market pricing."
              },
              "date": {
                "type": "string",
                "format": "date",
                "description": "Date of the data point"
              },
              "value": {
                "type": "number",
                "description": "Average live weight of cattle in pounds"
              }
            },
            "required": ["description", "date", "value"]
          },
          "commercialRedMeatProduction": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "const": "This indicates the total amount of meat produced, which is critical for understanding production capacity and market availability."
              },
              "date": {
                "type": "string",
                "format": "date",
                "description": "Date of the data point"
              },
              "value": {
                "type": "number",
                "description": "Total red meat production in pounds"
              }
            },
            "required": ["description", "date", "value"]
          },
          "slaughterDistributionByState": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "const": "Understanding which states have higher cattle slaughter rates helps in analyzing regional production trends."
              },
              "states": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "state": {
                      "type": "string",
                      "description": "State name"
                    },
                    "slaughterRate": {
                      "type": "number",
                      "description": "Slaughter rate in the state"
                    }
                  },
                  "required": ["state", "slaughterRate"]
                },
                "description": "List of states with their respective slaughter rates"
              }
            },
            "required": ["description", "states"]
          },
          "dressedWeight": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "const": "The weight of the carcass after slaughter, which determines the yield of marketable meat."
              },
              "date": {
                "type": "string",
                "format": "date",
                "description": "Date of the data point"
              },
              "value": {
                "type": "number",
                "description": "Average dressed weight of cattle in pounds"
              }
            },
            "required": ["description", "date", "value"]
          },
          "feedlotData": {
            "type": "object",
            "properties": {
              "description": {
                "type": "string",
                "const": "The number of cattle in feedlots ready for slaughter can be inferred from slaughter rates and weights."
              },
              "dataInferred": {
                "type": "boolean",
                "const": true,
                "description": "Indicates whether the data is inferred"
              },
              "details": {
                "type": "string",
                "description": "Additional details about the feedlot data inference"
              }
            },
            "required": ["description", "dataInferred", "details"]
          },
          "cattleSlaughterDataByState": {
            "type": "object",
            "description": "Detailed data on cattle slaughter by state you must list all state regardless if they are mentioned in the report. If they are not mentioned, you can use 0 as the value.",
            "properties": {
              "states": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "state": {
                      "type": "string",
                      "description": "Name of the state"
                    },
                    "total_head_slaughtered": {
                      "type": "number",
                      "description": "Total head of cattle slaughtered in thousands"
                    },
                    "total_live_weight": {
                      "type": "number",
                      "description": "Total live weight of cattle slaughtered in millions of pounds"
                    },
                    "average_live_weight": {
                      "type": "number",
                      "description": "Average live weight of cattle in pounds"
                    }
                  },
                  "required": ["state", "total_head_slaughtered", "total_live_weight", "average_live_weight"]
                },
                'minItems': 52,
              }
            },
            "required": ["states"]
          }
        },
        "required": [
          "totalHeadSlaughtered",
          "averageLiveWeight",
          "commercialRedMeatProduction",
          "slaughterDistributionByState",
          "dressedWeight",
          "feedlotData",
          "cattleSlaughterDataByState"
        ]
      }
    `;
