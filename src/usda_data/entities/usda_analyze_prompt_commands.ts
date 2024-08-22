const common_defs_json_schema = {
  definitions: {
    regionedCattleInspectedSlaughter: {
      steers: {
        type: 'number',
        description: 'Number of steers slaughtered in 1,000 head',
      },
      heifers: {
        type: 'number',
        description: 'Number of heifers slaughtered in 1,000 head',
      },
      all_cows: {
        type: 'number',
        description: 'Number of all cows slaughtered in 1,000 head',
      },
      dairy_cows: {
        type: 'number',
        description: 'Number of dairy cows slaughtered in 1,000 head',
      },
      other_cows: {
        type: 'number',
        description: 'Number of other cows slaughtered in 1,000 head',
      },
      bulls: {
        type: 'number',
        description: 'Number of bulls slaughtered in 1,000 head',
      },
      total: {
        type: 'number',
        description: 'Total number of cattle slaughtered in 1,000 head',
      },
      calves_total: {
        type: 'number',
        description:
          'Total number of calves slaughtered in 1,000 head 0 if Y/D',
      },
    },
    all_production: {
      federally_inspected: {
        $ref: '#/definitions/production',
      },
      other: {
        $ref: '#/definitions/production',
      },
      commercial: {
        $ref: '#/definitions/production',
      },
    },
    regionedHogSheepInspectedSlaughter: {
      hogs: {
        type: 'number',
        description: 'Total number of hogs slaughtered in 1,000 head',
      },
      barrows_and_gilts: {
        type: 'number',
        description: 'Number of barrows and gilts slaughtered in 1,000 head',
      },
      sows: {
        type: 'number',
        description: 'Number of sows slaughtered in 1,000 head',
      },
      boars: {
        type: 'number',
        description: 'Number of boars slaughtered in 1,000 head',
      },
      sheep: {
        type: 'number',
        description: 'Total number of sheep slaughtered in 1,000 head',
      },
      mature_sheep: {
        type: 'number',
        description: 'Number of mature sheep slaughtered in 1,000 head',
      },
      lambs_and_yearlings: {
        type: 'number',
        description: 'Number of lambs and yearlings slaughtered in 1,000 head',
      },
    },
    classDressedWeight: {
      last_year: {
        type: 'number',
        description:
          'Average dressed weight in pounds for the last year. Use whole numbers',
      },
      last_month: {
        type: 'number',
        description:
          'Average dressed weight in pounds for the last month. Use whole numbers',
      },
      two_months_ago: {
        type: 'number',
        description:
          'Average dressed weight in pounds for two months ago. Use whole numbers',
      },
      january_to_this_month_last_year: {
        type: 'number',
        description:
          'Average dressed weight in pounds from January to this month last year. Use whole numbers',
      },
      january_to_this_month_this_year: {
        type: 'number',
        description:
          'Average dressed weight in pounds from January to this month this year. Use whole numbers',
      },
    },
    classSlaughter: {
      last_year: {
        type: 'number',
        description:
          'Number of head slaughtered in the last year use whole numbers in 1,000 head',
      },
      last_month: {
        type: 'number',
        description:
          'Number of head slaughtered in the last month use whole numbers in 1,000 head',
      },
      this_month: {
        type: 'number',
        description:
          'Number of head slaughtered in this month use whole numbers in 1,000 head',
      },
      january_to_this_month_last_year: {
        type: 'number',
        description:
          'Number of head slaughtered from January to this month last year use whole numbers in 1,000 head',
      },
      january_to_this_month_this_year: {
        type: 'number',
        description:
          'Number of head slaughtered from January to this month this year use whole numbers in 1,000 head',
      },
      this_month_as_percent_of_last_year: {
        type: 'number',
        description:
          "Percentage of this month's slaughter compared to last year. Include a negative sign if it's a decrease.",
      },
      this_month_as_percent_of_last_month: {
        type: 'number',
        description:
          "Percentage of this month's slaughter compared to last month. Include a negative sign if it's a decrease.",
      },
      this_month_as_percent_of_two_months_ago: {
        type: 'number',
        description:
          "Percentage of this month's slaughter compared to two months ago. Include a negative sign if it's a decrease.",
      },
      january_to_this_month_last_year_as_percent_of_last_year: {
        type: 'number',
        description:
          "Percentage of this year's slaughter compared to last year. Include a negative sign if it's a decrease.",
      },
      january_to_this_month_this_year_as_percent_of_this_year: {
        type: 'number',
        description:
          "Percentage of this year's slaughter compared to this year. Include a negative sign if it's a decrease.",
      },
    },
    meatProduction: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          description: 'Total meat production in pounds',
        },
        change_percent: {
          type: 'number',
          description:
            "Percentage change from the previous year. Include a negative sign if it's a decrease.",
        },
        previous_total: {
          type: 'number',
          description: 'Total production in the previous year in pounds',
        },
      },
      required: ['total', 'change_percent', 'previous_total'],
    },
    livestockProduction: {
      type: 'object',
      properties: {
        total: {
          type: 'number',
          description:
            'Total production in whole number pounds. Example: 2140000000 not 2.14 billion',
        },
        change_percent: {
          type: 'number',
          description:
            "Percentage change from the previous year. Include a negative sign if it's a decrease. Example: -9",
        },
        total_head_slaughtered: {
          type: 'number',
          description:
            'Total head slaughtered in whole number. Example: 2540000 not 2.54 million',
        },
        slaughter_change_percent: {
          type: 'number',
          description:
            "Percentage change in slaughter from June 2023. Include a negative sign if it's a decrease. Example: -12",
        },
        average_live_weight: {
          type: 'number',
          description: 'Average live weight in pounds',
        },
        average_live_weight_change: {
          type: 'number',
          description:
            "Change in average live weight from the previous year. Use whole numbers and include a negative sign if it's a decrease. Example: 44 or -44",
        },
      },
      required: [
        'total',
        'change_percent',
        'total_head_slaughtered',
        'slaughter_change_percent',
        'average_live_weight',
        'average_live_weight_change',
      ],
    },
    timePeriod: {
      type: 'object',
      description: 'Time period for the accumulated production',
      properties: {
        start: {
          type: 'string',
          format: 'date',
          description: 'Start date of the time period',
        },
        end: {
          type: 'string',
          format: 'date',
          description: 'End date of the time period',
        },
      },
      required: ['start', 'end'],
    },
    stateProduction: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          description: 'Name of the state',
        },
        total_this_month: {
          type: 'number',
          description:
            'Total commercial red meat production in pounds for this month use whole numbers',
        },
        total_last_month: {
          type: 'number',
          description:
            'Total commercial red meat production in pounds for last month use whole numbers',
        },
        total_last_year: {
          type: 'number',
          description:
            'Total commercial red meat production in pounds for last year use whole numbers',
        },
        this_month_as_percent_of_last_year: {
          type: 'number',
          description:
            "Percentage of this month's production compared to last year. Include a negative sign if it's a decrease.",
        },
      },
      required: [
        'state',
        'total_this_month',
        'total_last_month',
        'total_last_year',
        'this_month_as_percent_of_last_year',
      ],
      additionalProperties: false,
    },
    stateSlaughterData: {
      type: 'object',
      properties: {
        state: {
          type: 'string',
          description: 'Name of the state',
        },
        slaughtered_this_year: {
          type: 'number',
          description:
            'Total commercial slaughter in pounds for this month of this year use whole numbers',
        },
        slaughtered_last_year: {
          type: 'number',
          description:
            'Total commercial slaughter in pounds for this month of last year use whole numbers',
        },
        total_live_weight_this_year: {
          type: 'number',
          description:
            'Total live weight of animals slaughtered this month of this year use whole numbers',
        },
        total_live_weight_last_year: {
          type: 'number',
          description:
            'Total live weight of animals slaughtered this month of last year use whole numbers',
        },
        avg_live_weight_this_year: {
          type: 'number',
          description:
            'Average live weight of animals slaughtered this month of this year',
        },
        avg_live_weight_last_year: {
          type: 'number',
          description:
            'Average live weight of animals slaughtered this month of last year',
        },
      },
      required: [
        'state',
        'slaughtered_this_year',
        'slaughtered_last_year',
        'total_live_weight_this_year',
        'total_live_weight_last_year',
        'avg_live_weight_this_year',
        'avg_live_weight_last_year',
      ],
    },
    table: {
      type: 'object',
      properties: {
        headers: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        rows: {
          type: 'array',
          items: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
      },
      required: ['headers', 'rows'],
    },
    production: {
      type: 'object',
      properties: {
        last_year: {
          type: 'number',
          description:
            'Total beef production in pounds for last year in whole numbers',
        },
        last_month: {
          type: 'number',
          description:
            'Total beef production in pounds for last month in whole numbers',
        },
        this_month: {
          type: 'number',
          description:
            'Total beef production in pounds for this month in whole numbers',
        },
        this_month_as_percent_of_last_year: {
          type: 'number',
          description:
            "Percentage of this month's production compared to last year. Include a negative sign if it's a decrease.",
        },
        this_month_as_percent_of_last_month: {
          type: 'number',
          description:
            "Percentage of this month's production compared to last month. Include a negative sign if it's a decrease.",
        },
        total_january_to_june_last_year: {
          type: 'number',
          description:
            'Total beef production in pounds from January to June last year in whole numbers',
        },
        total_january_to_june_this_year: {
          type: 'number',
          description:
            'Total beef production in pounds from January to June this year in whole numbers',
        },
        this_year_as_percent_of_last_year: {
          type: 'number',
          description:
            "Percentage of this year's production compared to last year. Include a negative sign if it's a decrease.",
        },
        required: [
          'last_year',
          'last_month',
          'this_month',
          'this_month_as_percent_of_last_year',
          'this_month_as_percent_of_last_month',
          'total_january_to_june_last_year',
          'total_january_to_june_this_year',
          'this_year_as_percent_of_last_year',
        ],
      },
    },
  },
};

export const livestock_slaughter_report_json_schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Livestock Slaughter Metrics',
  type: 'object',
  properties: {
    // Federally Inspected Cattle and Calves Slaughter Regions and United States
    federally_inspected_cattle_calves_slaughter_regions_and_us: {
      type: 'object',
      description:
        'Federally Inspected Slaughter - Regions and United States Cattle and Calves',
      properties: {
        federally_inspected_cattle_calves_slaughter_regions_and_us: {
          type: 'object',
          description:
            'Federally Inspected Slaughter - Regions and United States Cattle and Calves',
          properties: {
            1: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            2: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            3: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            4: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            5: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            6: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            7: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            8: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            9: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            10: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
          },
          required: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        },
      },
      required: ['federally_inspected_cattle_calves_slaughter_regions_and_us'],
      additionalProperties: false,
      definitions: {
        regionedCattleInspectedSlaughter:
          common_defs_json_schema.definitions.regionedCattleInspectedSlaughter,
      },
    },
    // Federally Inspected Hogs and Sheep Slaughter Regions and United States
    federally_inspected_hogs_sheep_slaughter_regions_and_us: {
      type: 'object',
      description:
        'Federally Inspected Slaughter - Regions and United States Hogs and Sheep',
      properties: {
        federally_inspected_hogs_sheep_slaughter_regions_and_us: {
          type: 'object',
          description:
            'Federally Inspected Slaughter - Regions and United States Hogs and Sheep',
          properties: {
            1: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            2: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            3: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            4: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            5: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            6: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            7: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            8: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            9: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            10: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
          },
          required: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        },
      },
      required: ['federally_inspected_hogs_sheep_slaughter_regions_and_us'],
      additionalProperties: false,
      definitions: {
        regionedHogSheepInspectedSlaughter:
          common_defs_json_schema.definitions
            .regionedHogSheepInspectedSlaughter,
      },
    },
    // Commercial Red Meat Production Structured
    commercial_red_meat_production_structured: {
      type: 'object',
      description: 'Commercial Red Meat Production - United States',
      properties: {
        commercial_red_meat_production_structured: {
          type: 'object',
          description: 'Commercial Red Meat Production - United States',
          properties: {
            beef: { $ref: '#/definitions/production' },
            veal: { $ref: '#/definitions/production' },
            pork: { $ref: '#/definitions/production' },
            lamb: { $ref: '#/definitions/production' },
            total_red_meat: { $ref: '#/definitions/meatProduction' },
          },
          required: ['beef', 'veal', 'pork', 'lamb', 'total_red_meat'],
          additionalProperties: false,
        },
      },
      required: ['commercial_red_meat_production_structured'],
      definitions: {
        production: common_defs_json_schema.definitions.production,
        meatProduction: common_defs_json_schema.definitions.meatProduction,
      },
    },
    // Federally Inspected Red Meat Production Structured
    federally_inspected_red_meat_production_structured: {
      type: 'object',
      description: 'Federally Inspected Red Meat Production - United States',
      properties: {
        federally_inspected_red_meat_production_structured: {
          type: 'object',
          description:
            'Federally Inspected Red Meat Production - United States',
          properties: {
            beef: { $ref: '#/definitions/production' },
            veal: { $ref: '#/definitions/production' },
            pork: { $ref: '#/definitions/production' },
            lamb: { $ref: '#/definitions/production' },
            total_red_meat: {
              ...common_defs_json_schema.definitions.meatProduction,
            },
          },
          required: ['beef', 'veal', 'pork', 'lamb', 'total_red_meat'],
          additionalProperties: false,
        },
      },
      required: ['federally_inspected_red_meat_production_structured'],
      additionalProperties: false,
      definitions: {
        production: common_defs_json_schema.definitions.production,
      },
    },
    // Livestock Slaughter and Average Live Weight Structured
    livestock_slaughter_and_average_live_weight_structured: {
      type: 'object',
      description:
        'Livestock Slaughter and Average Live Weight - United States',
      properties: {
        livestock_slaughter_and_average_live_weight_structured: {
          type: 'object',
          description:
            'Livestock Slaughter and Average Live Weight - United States',
          properties: {
            cattle: {
              number_head: {
                $ref: '#/definitions/all_production',
              },
              average_live_weight: {
                $ref: '#/definitions/all_production',
              },
            },
            calves: {
              number_head: {
                $ref: '#/definitions/all_production',
              },
              average_live_weight: {
                $ref: '#/definitions/all_production',
              },
            },
            hogs: {
              number_head: {
                $ref: '#/definitions/all_production',
              },
              average_live_weight: {
                $ref: '#/definitions/all_production',
              },
            },
            sheep_and_lambs: {
              number_head: {
                $ref: '#/definitions/all_production',
              },
              average_live_weight: {
                $ref: '#/definitions/all_production',
              },
            },
            goats: {
              number_head: {
                $ref: '#/definitions/all_production',
              },
              average_live_weight: {
                $ref: '#/definitions/all_production',
              },
            },
            bison: {
              number_head: {
                $ref: '#/definitions/all_production',
              },
            },
          },
          required: [
            'cattle',
            'calves',
            'hogs',
            'sheep_and_lambs',
            'goats',
            'bison',
          ],
          additionalProperties: false,
        },
      },
      required: ['livestock_slaughter_and_average_live_weight_structured'],
      additionalProperties: false,
      definitions: {
        all_production: common_defs_json_schema.definitions.all_production,
        production: common_defs_json_schema.definitions.production,
      },
    },
    // Livestock Production Structured
    beef_production_structured: {
      beef_production_structured: {
        $ref: '#/definitions/livestockProduction',
      },
    },
    veal_production_structured: {
      veal_production_structured: {
        $ref: '#/definitions/livestockProduction',
      },
    },
    pork_production_structured: {
      pork_production_structured: {
        $ref: '#/definitions/livestockProduction',
      },
    },
    lamb_production_structured: {
      lamb_production_structured: {
        $ref: '#/definitions/livestockProduction',
      },
    },
    red_meat_production_accumulated: {
      red_meat_production_accumulated: {
        type: 'object',
        properties: {
          time_period: { ...common_defs_json_schema.definitions.timePeriod },
          total: {
            type: 'number',
            description:
              'Total commercial red meat production in the time period in pounds use whole numbers',
          },
          change_percent: {
            type: 'number',
            description:
              "Percentage change from the previous year. Include a negative sign if it's a decrease.",
          },
          notes: {
            type: 'string',
            description: 'Additional notes on the production',
          },
        },
        required: ['total', 'change_percent', 'time_period', 'notes'],
        additionalProperties: false,
      },
      required: ['red_meat_production_accumulated'],
      additionalProperties: false,
    },
    reportDate: {
      type: 'object',
      description: 'Date of the report',
      properties: {
        reportDate: {
          type: 'string',
          format: 'date',
          description: 'Date of the report',
        },
        required: ['reportDate'],
        additionalProperties: false,
      },
      required: ['reportDate'],
    },
    commercial_red_meat_production_states_structured: {
      type: 'array',
      description: 'Commercial Red Meat Production - States and United States',
      properties: {
        commercial_red_meat_production_states_structured: {
          type: 'array',
          description:
            'Commercial Red Meat Production - States and United States',
          items: { ...common_defs_json_schema.definitions.stateProduction },
        },
      },
      required: ['commercial_red_meat_production_states_structured'],
      additionalProperties: false,
    },
    commercial_slaughter_states_structured: {
      type: 'array',
      description: 'Commercial Cattle Slaughter - States and United States',
      properties: {
        commercial_slaughter_states_structured: {
          type: 'array',
          description: 'Commercial Cattle Slaughter - States and United States',
          items: { ...common_defs_json_schema.definitions.stateSlaughterData },
        },
      },
      required: ['commercial_slaughter_states_structured'],
      additionalProperties: false,
    },
    commercial_calf_slaughter_states_structured: {
      type: 'array',
      description: 'Commercial Calf Slaughter - States and United States',
      properties: {
        commercial_calf_slaughter_states_structured: {
          type: 'array',
          description: 'Commercial Calf Slaughter - States and United States',
          items: { ...common_defs_json_schema.definitions.stateSlaughterData },
        },
      },
      required: ['commercial_calf_slaughter_states_structured'],
      additionalProperties: false,
    },
    commercial_hog_slaughter_states_structured: {
      type: 'array',
      description: 'Commercial Hog Slaughter - States and United States',
      properties: {
        commercial_hog_slaughter_states_structured: {
          type: 'array',
          description: 'Commercial Hog Slaughter - States and United States',
          items: { ...common_defs_json_schema.definitions.stateSlaughterData },
        },
      },
      additionalProperties: false,
    },
    commercial_sheep_lamb_slaughter_states_structured: {
      type: 'array',
      description:
        'Commercial Sheep and Lamb Slaughter - States and United States',
      properties: {
        commercial_sheep_lamb_slaughter_states_structured: {
          type: 'array',
          description:
            'Commercial Sheep and Lamb Slaughter - States and United States',
          items: { ...common_defs_json_schema.definitions.stateSlaughterData },
        },
      },
      required: ['commercial_sheep_lamb_slaughter_states_structured'],
      additionalProperties: false,
    },
    // Livestock Slaughtered Under Federal Inspection by Class - United States
    livestock_slaughtered_federal_inspection_by_class: {
      type: 'object',
      description:
        'Livestock Slaughtered Under Federal Inspection by Class - United States',
      properties: {
        livestock_slaughtered_federal_inspection_by_class: {
          type: 'object',
          description:
            'Livestock Slaughtered Under Federal Inspection by Class - United States',
          properties: {
            cattle: {
              type: 'object',
              properties: {
                steers: { $ref: '#/definitions/classSlaughter' },
                heifers: { $ref: '#/definitions/classSlaughter' },
                all_cows: { $ref: '#/definitions/classSlaughter' },
                dairy_cows: { $ref: '#/definitions/classSlaughter' },
                other_cows: { $ref: '#/definitions/classSlaughter' },
                bulls: { $ref: '#/definitions/classSlaughter' },
                total: { $ref: '#/definitions/classSlaughter' },
              },
              required: [
                'steers',
                'heifers',
                'all_cows',
                'dairy_cows',
                'other_cows',
                'bulls',
                'total',
              ],
            },
            calves_and_vealers: { $ref: '#/definitions/classSlaughter' },
            hogs: {
              type: 'object',
              properties: {
                barrows_and_gilts: { $ref: '#/definitions/classSlaughter' },
                sows: { $ref: '#/definitions/classSlaughter' },
                boars: { $ref: '#/definitions/classSlaughter' },
                total: { $ref: '#/definitions/classSlaughter' },
              },
              required: ['barrows_and_gilts', 'sows', 'boars', 'total'],
            },
            sheep: {
              type: 'object',
              properties: {
                mature_sheep: { $ref: '#/definitions/classSlaughter' },
                lambs_and_yearlings: { $ref: '#/definitions/classSlaughter' },
                total: { $ref: '#/definitions/classSlaughter' },
              },
              required: ['mature_sheep', 'lambs_and_yearlings', 'total'],
            },
          },
          required: ['cattle', 'calves_and_vealers', 'hogs', 'sheep'],
        }
      },
      required: ['livestock_slaughtered_federal_inspection_by_class'],
      additionalProperties: false,
      definitions: {
        classSlaughter: common_defs_json_schema.definitions.classSlaughter,
      },
    },
    // Livestock Slaughtered Under Federal Inspection by Class - United States
    federally_inspected_slaughter_average_dressed_weight_by_class: {
      type: 'object',
      description:
        'Federally Inspected Slaughter Average Dressed Weight by Class - United States',
      properties: {
        federally_inspected_slaughter_average_dressed_weight_by_class: {
          type: 'object',
          description:
            'Federally Inspected Slaughter Average Dressed Weight by Class - United States',
          properties: {
            cattle: {
              type: 'object',
              properties: {
                steers: { $ref: '#/definitions/classDressedWeight' },
                heifers: { $ref: '#/definitions/classDressedWeight' },
                all_cows: { $ref: '#/definitions/classDressedWeight' },
                dairy_cows: { $ref: '#/definitions/classDressedWeight' },
                other_cows: { $ref: '#/definitions/classDressedWeight' },
                bulls: { $ref: '#/definitions/classDressedWeight' },
                totsl: { $ref: '#/definitions/classDressedWeight' },
              },
              required: [
                'steers',
                'heifers',
                'all_cows',
                'dairy_cows',
                'other_cows',
                'bulls',
                'total',
              ],
            },
            calves_and_vealers: { $ref: '#/definitions/classDressedWeight' },
            hogs: {
              type: 'object',
              properties: {
                barrows_and_gilts: { $ref: '#/definitions/classDressedWeight' },
                sows: { $ref: '#/definitions/classDressedWeight' },
                boars: { $ref: '#/definitions/classDressedWeight' },
                total: { $ref: '#/definitions/classDressedWeight' },
              },
              required: ['barrows_and_gilts', 'sows', 'boars', 'total'],
            },
            sheep: {
              type: 'object',
              properties: {
                mature_sheep: { $ref: '#/definitions/classDressedWeight' },
                lambs_and_yearlings: { $ref: '#/definitions/classDressedWeight' },
                total: { $ref: '#/definitions/classDressedWeight' },
              },
              required: ['mature_sheep', 'lambs_and_yearlings', 'total'],
            },
          },
          additionalProperties: false,
          required: ['cattle', 'calves_and_vealers', 'hogs', 'sheep'],
        },
      },
      required: ['federally_inspected_slaughter_average_dressed_weight_by_class'],
      additionalProperties: false,
      definitions: {
        classDressedWeight:
          common_defs_json_schema.definitions.classDressedWeight,
      },
    },
    federally_inspected_cattle_calves_slaughter_regions_and_us_jan_to_this_month:
      {
        type: 'object',
        description:
          'Federally Inspected Slaughter - Regions and United States Cattle and Calves January to This Month',
        properties: {
          federally_inspected_cattle_calves_slaughter_regions_and_us_jan_to_this_month: {
            type: 'object',
            description:
              'Federally Inspected Slaughter - Regions and United States Cattle and Calves January to This Month',
            properties: {
              1: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              2: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              3: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              4: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              5: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              6: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              7: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              8: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              9: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
              10: { $ref: '#/definitions/regionedCattleInspectedSlaughter' },
            },
            required: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          }
        },
        required: [
          'federally_inspected_cattle_calves_slaughter_regions_and_us_jan_to_this_month',
        ],
        additionalProperties: false,
        definitions: {
          regionedCattleInspectedSlaughter:
            common_defs_json_schema.definitions
              .regionedCattleInspectedSlaughter,
        },
      },
    federally_inspected_hogs_sheep_slaughter_regions_and_us_jan_to_this_month: {
      type: 'object',
      description:
        'Federally Inspected Slaughter - Regions and United States Hogs and Sheep January to This Month',
      properties: {
        federally_inspected_hogs_sheep_slaughter_regions_and_us_jan_to_this_month: {
          type: 'object',
          description:
            'Federally Inspected Slaughter - Regions and United States Hogs and Sheep January to This Month',
          properties: {
            1: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            2: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            3: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            4: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            5: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            6: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            7: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            8: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            9: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
            10: { $ref: '#/definitions/regionedHogSheepInspectedSlaughter' },
          },
          required: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        },
      },
      required: ['federally_inspected_hogs_sheep_slaughter_regions_and_us_jan_to_this_month'],
      additionalProperties: false,
      definitions: {
        regionedHogSheepInspectedSlaughter:
          common_defs_json_schema.definitions
            .regionedHogSheepInspectedSlaughter,
      },
    },
    federally_inspected_slaughter_percent_of_total_commercial_slaughter_us: {
      type: 'object',
      description:
        'Federally Inspected Slaughter Percent of Total Commercial Slaughter - United States',
      properties: {
        federally_inspected_slaughter_percent_of_total_commercial_slaughter_us: {
          type: 'object',
          description:
            'Federally Inspected Slaughter Percent of Total Commercial Slaughter - United States',
          properties: {
            cattle: { $ref: '#/definitions/production' },
            calves: { $ref: '#/definitions/production' },
            hogs: { $ref: '#/definitions/production' },
            sheep: { $ref: '#/definitions/production' },
          },
          required: ['cattle', 'calves', 'hogs', 'sheep'],
          additionalProperties: false,
        },
      },
      required: ['federally_inspected_slaughter_percent_of_total_commercial_slaughter_us'],
      definitions: {
        production: common_defs_json_schema.definitions.production,
      },
      additionalProperties: false,
    },
  },
};

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

export const analyze_livestock_slaughter_report = (report, properties = {}) => `
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
  "$schema": ${livestock_slaughter_report_json_schema.$schema}
  "title": ${livestock_slaughter_report_json_schema.title}
  "type": ${livestock_slaughter_report_json_schema.type}
  "properties": {
    ${JSON.stringify(properties, null, 2)}
  } 
}
`;

export const analyze_livestock_slaughter_report_part2 = (report) => `
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
      "title": "Livestock Slaughter Metrics",
      "type": "object",
      "properties": {
        "commercial_red_meat_production_states_structured": {
          "type": "array",
          "description": "Commercial red meat production by state",
          "items": {
            "type": "object",
            "properties": {
              "state": {
                "type": "string",
                "description": "Name of the state"
              },
              "total_this_month": {
                "type": "number",
                "description": "Total commercial red meat production in pounds for this month use whole numbers"
              },
              "total_last_month": {
                "type": "number",
                "description": "Total commercial red meat production in pounds for last month use whole numbers"
              },
              "total_last_year": {
                "type": "number",
                "description": "Total commercial red meat production in pounds for last year use whole numbers"
              },
              "this_month_as_percent_of_last_year": {
                "type": "number",
                "description": "Percentage of this month's production compared to last year. Include a negative sign if it's a decrease."
              }
            },
            "required": ["state", "total_this_month", "total_last_month", "total_last_year", "this_month_as_percent_of_last_year"]
          }
        },
        "commercial_slaughter_states_structured": {
          "type": "array",
          "description": "Commercial slaughter by state",
          "items": {
            "$ref": "#/definitions/stateSlaughterData"
          }
        },
        "commercial_calf_slaughter_states_structured": {
          "type": "array",
          "description": "Commercial calf slaughter by state",
          "items": {
            "$ref": "#/definitions/stateSlaughterData"
          }
        },
        "commercial_hog_slaughter_states_structured": {
          "type": "array",
          "description": "Commercial hog slaughter by state",
          "items": {
            "$ref": "#/definitions/stateSlaughterData"
          }
        },
        "commercial_sheep_lamb_slaughter_states_structured": {
          "type": "array",
          "description": "Commercial sheep and lamb slaughter by state",
          "items": {
            "$ref": "#/definitions/stateSlaughterData"
          }
        }
      },
      "definitions": {
        "stateSlaughterData": {
          "type": "object",
          "properties": {
            "state": {
              "type": "string",
              "description": "Name of the state"
            },
            "slaughtered_this_year": {
              "type": "number",
              "description": "Total commercial slaughter in pounds for this month of this year use whole numbers"
            },
            "slaughtered_last_year": {
              "type": "number",
              "description": "Total commercial slaughter in pounds for this month of last year use whole numbers"
            },
            "total_live_weight_this_year": {
              "type": "number",
              "description": "Total live weight of animals slaughtered this month of this year use whole numbers"
            },
            "total_live_weight_last_year": {
              "type": "number",
              "description": "Total live weight of animals slaughtered this month of last year use whole numbers"
            },
            "avg_live_weight_this_year": {
              "type": "number",
              "description": "Average live weight of animals slaughtered this month of this year"
            },
            "avg_live_weight_last_year": {
              "type": "number",
              "description": "Average live weight of animals slaughtered this month of last year"
            }
          },
          "required": ["state", "slaughtered_this_year", "slaughtered_last_year", "total_live_weight_this_year", "total_live_weight_last_year", "avg_live_weight_this_year", "avg_live_weight_last_year"]
        }
      }
    }
  `;
