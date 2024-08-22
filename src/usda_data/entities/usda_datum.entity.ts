export class UsdaDatum {}


export class LSTKReportRegex {
  static readonly title_issn =
    /^(Livestock Slaughter)\n+ISSN:\s+(\d{4}-\d{4})$/gm;
  static readonly release_date =
    /Released\s+([A-Za-z]+\s+\d{1,2},\s+\d{4}),\s+by\s+the\s+National\s+Agricultural\s+Statistics\s+Service/gm;
  static readonly june_weekdays_saturdays_info =
    /(?<month>\b[A-Z][a-z]+\s+\d{4})\s+contained\s+(?<weekdays>\d{1,2})\s+weekdays\s+\(including\s+(?<holidays>\d)\s+holiday\)\s+and\s+(?<saturdays>\d)\s+Saturdays\./gm;
  static readonly commercial_red_meat_produced =
    /Commercial\s+red\s+meat\s+production\s+for\s+the\s+United\s+States\s+totaled\s+([\d.]+)\s+(billion|million|thousand)\s+pounds\s+in\s+(\w+),\s+(up|down)\s+(\d+)\s+percent\s+from\s+the\s+([\d.]+)\s+\2\s+pounds\s+produced\s+in\s+\3\s+\d{4}\./gm;
  static readonly beef_production_slaughter_details =
    /Beef\s+production,\s+at\s+([\d.]+)\s+(billion|million|thousand)\s+pounds,\s+was\s+(\d+)\s+percent\s+(below|down)\s+the\s+previous\s+year\.\s+Cattle\s+slaughter\s+totaled\s+([\d.]+)\s+(million|thousand)\s+head,\s+(down)\s+(\d+)\s+percent\s+from\s+June\s+\d{4}\.\s+The\s+average\s+live\s+weight\s+was\s+(up|down)\s+(\d+)\s+pounds\s+from\s+the\s+previous\s+year,\s+at\s+([\d,]+)\s+pounds\./gm;
  static readonly veal_production_slaughter_weights =
    /Veal\s+production\s+totaled\s+([\d.]+)\s+(million|billion)\s+pounds,\s+(\d+)\s+percent\s+(below|down)\s+June\s+a\s+year\s+ago\.\s+Calf\s+slaughter\s+totaled\s+([\d,]+)\s+head,\s+(down)\s+(\d+)\s+percent\s+from\s+June\s+\d{4}\.\s+The\s+average\s+live\s+weight\s+was\s+(up|down)\s+(\d+)\s+pounds\s+from\s+last\s+year,\s+at\s+([\d,]+)\s+pounds\./gm;
  static readonly table_extract =
    /-{10,}\n[\s\S]*?\n-{10,}\n([\s\S]*? : [\s\S]*?)\n-{10,}/gm;
  private reportText = '';

  constructor(reportText: string) {
    this.reportText = reportText;
  }

  extractTitleAndISSN() {
    const matches = this.reportText.matchAll(LSTKReportRegex.title_issn);

    return Array.from(matches).map((match) => {
      return {
        title: 'Livestock Slaughter',
        issn: '',
      };
    });
  }

  extractReleaseDate() {
    const matches = this.reportText.matchAll(LSTKReportRegex.release_date);
    return Array.from(matches).map((match) => {
      return match[1];
    });
  }

  extractJuneWeekdaysSaturdaysInfo() {
    const matches = this.reportText.matchAll(
      LSTKReportRegex.june_weekdays_saturdays_info,
    );
    return Array.from(matches).map((match) => {
      return {
        month: match[1],
        weekdays: match[2],
        holidays: match[3],
        saturdays: match[4],
      };
    });
  }

  extractCommercialRedMeatProduced() {
    const matches = this.reportText.matchAll(
      LSTKReportRegex.commercial_red_meat_produced,
    );
    return Array.from(matches).map((match) => {
      return {
        amount: match[1],
        unit: match[2],
        change: match[3],
        percent_change: match[4],
        previous_year_amount: match[5],
      };
    });
  }

  extractTables() {
    const matches = this.reportText.matchAll(LSTKReportRegex.table_extract);
    return Array.from(matches).map((match) => {
      return match[1];
    });
  }

  runExtractionJob() {
    const title_issn = this.extractTitleAndISSN();
    const release_date = this.extractReleaseDate();
    const june_weekdays_saturdays_info =
      this.extractJuneWeekdaysSaturdaysInfo();
    const commercial_red_meat_produced =
      this.extractCommercialRedMeatProduced();

    // const tables = this.extractTables();

    return {
      title_issn,
      release_date,
      june_weekdays_saturdays_info,
      commercial_red_meat_produced,
      // tables,
    };
  }
}