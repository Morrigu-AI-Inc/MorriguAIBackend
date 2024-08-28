import { Injectable } from '@nestjs/common';
import { CreateImportyetiDto } from './dto/create-importyeti.dto';
import { UpdateImportyetiDto } from './dto/update-importyeti.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ImportYetiShipment } from 'src/db/schemas/ImportYeti';
import { Model } from 'mongoose';
import { sleep } from 'openai/core';
import { GATSCommodity, HS6Commodity } from 'src/db/schemas/GATSSchemas';

@Injectable()
export class ImportyetiService {
  constructor(
    @InjectModel('ImportYetiShipment')
    private importyetiModel: Model<ImportYetiShipment>,

    @InjectModel('HS6Commodity')
    private gatsCommoditiesModel: Model<HS6Commodity>,

    // @InjectModel('GATSCommodity')
    // // private gatsCommoditiesModel: Model<
  ) {}

  create() {
    return 'This action adds a new importyeti';
  }

  findAll() {
    return `This action returns all importyeti`;
  }

  findOne(id: number) {
    return `This action returns a #${id} importyeti`;
  }

  update(id: number) {
    return `This action updates a #${id} importyeti`;
  }

  remove(id: number) {
    return `This action removes a #${id} importyeti`;
  }

  // we are iterating the date down from today to 1980 and then paginating the data
  async init() {
    const endpoints = {
      power: {
        url: 'https://api.importyeti.com/api/bols/power',
        description: 'Get power data',
      },
      powerSuppliers: {
        url: 'https://api.importyeti.com/api/bols/power-suppliers',
        description: 'Get power suppliers data',
      },
      powerCompanies: {
        url: 'https://api.importyeti.com/api/bols/power-companies',
        description: 'Get power companies data',
      },
    };

    // include cookies in the request
    const response = {
      headers: {
        'Set-Cookie':
          'importyeti_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiSmFzb25AbW9ycmlndS5haSIsImlhdCI6MTcyMzc0ODY4OCwiZXhwIjoxNzI2MzQwNjg4fQ.uI79UmIJTn1st7aXpQOrxScPouer93TmbWxnJ3Gat-w; cf_clearance=vxuqQrHIdCM0oABtXNx9J2S0npo0n._QaL9XFq_fILc-1724456808-1.2.1.1-agwczBkLohohpCJ5PTL3lirJ08Q2IqufJowiTk_hk.rJ8T6438uR9PBzZkkQGuClofK4sqTKERUJAWy3nwBsGJBBTWWkID5RDblq663l9wU5MSjBOsaiS7wwlzHdsdVzSxGCOWuF6X4wg_UqPe3NbsuBR2jFuO7QC7lF1ZMiGme5JAPt4XIMo9pbM__QUwxiedo.18RAg35XWdTIcx5szUZIdXseADCUH8mNIi5XRobOpMRObATcnUPzlweS31zCa3uFkS45fYahT5Vw8Mw0sOq.UCAruMR5gvgxyMqZM2ur72mxS8AMX7QRdE6DWwRnBjuRgqK7fNCwlO57Oe7rMotx4OjcD8OExtvE7J7XZ1lQ_JgxCwe2QgmbEvedkUf0aAx50__ExNmGv3zwAEjeOA; AWSALB=7mzGYF7yaA9BZ+MTksndBNgK4us7bMiSSevWbq0oWFT0qWpCYZB+9PI2c9Bh75z4NAOX/Ohbq4QW7hRMRc8fb9l8UeoA4ZR/Ol8miq1UGY/zmDZm2xW9T40KWp86; AWSALBCORS=7mzGYF7yaA9BZ+MTksndBNgK4us7bMiSSevWbq0oWFT0qWpCYZB+9PI2c9Bh75z4NAOX/Ohbq4QW7hRMRc8fb9l8UeoA4ZR/Ol8miq1UGY/zmDZm2xW9T40KWp86; _ga_L3P3RK1QKT=GS1.1.1724456808.11.1.1724456826.0.0.0',
      },
    };

    // we need to iterate the paginate

    let page = 1;
    const size = 10000;
    const today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();
    let stop = false;
    let totalBOLS = 0;

    while (!stop) {
      let date = `${dd}/${mm}/${yyyy}`;
      console.log('date', date);

      do {
        try {
          const resp = await fetch(endpoints.power.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Cookie: response.headers['Set-Cookie'],
            },
            body: JSON.stringify({
              fieldItems: [
                {
                  fieldName: 'arrival_date',
                  value: date,
                  queryType: 'EXACT_PHRASE',
                },
              ],
              optionalFilterStates: {
                has_contact_info: false,
                has_website: false,
                only_lcl: false,
                use_raw: false,
              },
              pagination: {
                from: (page - 1) * size,
                size: size,
              },
            }),
          });

          const respp = await resp.json();

          const { totalBols: totals, data, isGenericSearch } = respp;

          if (page === 1) {
            totalBOLS = totals;
          }

          console.log('There are ', totalBOLS, ' total records');

          const shipments = data.map((shipment) => {
            return {
              shipment,
            };
          });

          const results = await this.importyetiModel.insertMany(shipments);

          if (data.length < size) {
            // a page with same size
            break; // Exit pagination loop if we have fewer results than page size
          }
          page++; // Increment page to fetch the next set of results

          await sleep(2000);
        } catch (error) {
          console.error('Error fetching data:', error);
          break; // Exit if there's an error
        }
      } while (true);

      // Move to the previous day
      today.setDate(today.getDate() - 1);
      dd = String(today.getDate()).padStart(2, '0');
      mm = String(today.getMonth() + 1).padStart(2, '0');
      yyyy = today.getFullYear();
      page = 1;
      totalBOLS = 0;

      if (date === '01/01/1980') {
        stop = true;
      }
    }
  }

  async getShipmentDetails() {
    const resp = await fetch(
      'https://www.marinetraffic.com/en/ais/get_info_window_json?asset_type=ship&id=5826884',
      {
        headers: {
          accept: 'application/json, text/plain, */*',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          priority: 'u=1, i',
          'sec-ch-ua':
            '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"macOS"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'vessel-image': '000393e50fa61ca6b384a994857bf1a99305',
          'x-newrelic-id': 'undefined',
          'x-requested-with': 'XMLHttpRequest',
          cookie:
            '_cfuvid=ThV3Q5UN2wbtta8AtFS8auOxcJbn2i8JZY9IrPTFokg-1723750746958-0.0.1.1-604800000; vTo=1; usprivacy=1N--; SERVERID=app8nzs; euconsent-v2=CQDZLIAQDZLIAAKA1AENDgCsAP_AAEPAAAwIg1NX_H__bW9r8X7_aft0eY1P9_j77sQxBhfJE-4F3LvW_JwXx2E5NF36tqoKmRoEu3ZBIUNlHJHUTVmwaogVryHsakWcoTNKJ6BkkFMRM2dYCF5vm4tjeQKY5_p_d3fx2D-t_dv839zzz8VHn3e5fue0-PCdU5-9Dfn9fRfb-9IP9_78v8v8_l_rk2_eT13_pcvr_D--f_87_XW-9_cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQagCzDQuIAuyJCQm0DCKBACIKwgIoEAAAAJA0QEALgwKdgYBLrCRACBFAAcEAIQAUZAAgAAEgAQiACQIoEAAEAgEAAIAEAgEADAwADgAtBAIAAQHQMUwoAFAsIEiMiIUwIQoEggJbKBBKCoQVwgCLDAigERsFAAgCQEVgACAsXgMASAlYkECXUG0AABAAgFFKFQik_MAQ4Jmy1V4om0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAACAA.f_gAAAAAAAAA; addtl_consent=1~43.3.9.6.9.13.6.4.15.9.5.2.11.8.1.3.2.10.33.4.6.9.17.2.9.20.7.20.5.20.7.2.2.1.4.40.4.14.9.3.10.6.2.9.6.6.9.8.33.5.3.1.27.1.17.10.9.1.8.6.2.8.3.4.146.65.1.17.1.18.25.35.5.18.9.7.41.2.4.18.24.4.9.6.5.2.14.18.7.3.2.2.8.28.8.6.3.10.4.20.2.17.10.11.1.3.22.16.2.6.8.6.11.6.5.33.11.8.11.28.12.1.5.2.17.9.6.40.17.4.9.15.8.7.3.12.7.2.4.1.7.12.13.22.13.2.6.8.10.1.4.15.2.4.9.4.5.4.7.13.5.15.17.4.14.10.15.2.5.6.2.2.1.2.14.7.4.8.2.9.10.18.12.13.2.18.1.1.3.1.1.9.7.2.16.5.19.8.4.8.5.4.8.4.4.2.14.2.13.4.2.6.9.6.3.2.2.3.7.3.6.10.11.6.3.19.8.3.3.1.2.3.9.19.26.3.10.13.4.3.4.6.3.3.3.3.1.1.1.6.11.3.1.1.11.6.1.10.13.3.2.2.4.3.2.2.7.15.7.14.4.3.4.5.4.3.2.2.5.5.3.9.7.9.1.5.3.7.10.11.1.3.1.1.2.1.3.2.6.1.12.8.1.3.1.1.2.2.7.7.1.4.3.6.1.2.1.4.1.1.4.1.1.2.1.8.1.7.4.3.3.3.5.3.15.1.15.10.28.1.2.2.12.3.4.1.6.3.4.7.1.3.1.4.1.5.3.1.3.4.1.5.2.3.1.2.2.6.2.1.2.2.2.4.1.1.1.2.2.1.1.1.1.2.1.1.1.2.2.1.1.2.1.2.1.7.1.7.1.1.1.1.2.1.4.2.1.1.9.1.6.2.1.6.2.3.2.1.1.1.2.5.2.4.1.1.2.2.1.1.7.1.2.2.1.2.1.2.3.1.1.2.4.1.1.1.6.3.6.4.5.5.4.1.2.3.1.4.3.2.2.3.1.1.1.1.12.1.3.1.1.2.2.1.6.3.3.5.2.7.1.1.2.5.1.9.5.1.3.1.8.4.5.1.9.1.1.1.2.1.1.1.4.2.13.1.1.3.1.2.2.3.1.2.1.1.1.2.1.3.1.1.1.1.2.4.1.5.1.2.4.3.10.2.9.7.2.2.1.3.3.1.6.1.2.5.1.1.2.6.4.2.1.200.200.100.300.400.100.100.100.400.1700.304.596.100.1000.800.500.400.200.200.500.1300.801.99.506.95.1399.1100.100.4302.1798.1400.1300.200.100.800.900.100.200.700.100.800.2000.900; _gid=GA1.2.611943249.1723750750; _hjSessionUser_1149958=eyJpZCI6ImRmM2FmYWRlLTZjOGQtNTM4ZC1iZjg5LWI5ODEzMmMyYzQyYSIsImNyZWF0ZWQiOjE3MjM3NTA3NTAyNjEsImV4aXN0aW5nIjp0cnVlfQ==; hubspotutk=17ebba387a258df6ee6a825e512b7053; __hssrc=1; panoramaId_expiry=1724355550659; _cc_id=3f3707636a2c299a4afcf960da6e63e8; panoramaId=3c480e3809da870977d8653a63974945a702010319892de467e772bf6c46b4b8; _fbp=fb.1.1723750757186.480571128171129830; CAKEPHP=3s4iba75feumk3pnoo4cr78cm6; _hjHasCachedUserAttributes=true; NPS_86adfcee_last_seen=1723750831696; __zlcmid=1NGmwl7SGP5F9pK; _pubcid=f0113cf7-367d-4d39-aa93-ab534206f222; _pubcid_cst=gSwkLLQs3w%3D%3D; _lr_env_src_ats=false; _gcl_au=1.1.716848216.1723750750.1075222160.1723827456.1723827572; _lfa=LF1.1.266675ccda86069d.1723827978839; cf_clearance=jvqjVoGUVwf0bKpnX0lurBvQCi.ZjQEDZvg8pSYTunY-1723852909-1.2.1.1-LKM3MuQFSyWkrqwQOSy.zXmb94lkWd75QJptUMcIRBXUkPm8LtoHvJjeAdcxKCKTiILpT0BAxHBdTBsqIl53UkFi3uC2_slhoV3903KrRLuMsIpI2gl5uCoJwmNCk.Sr6KSyXDKlm79gxnD2oxiyQZdEUa4usCrmKg0e3ZbxLhw7yIcvOEvjmcCF8L90BH.7Zf1xVfAS5xMHksZsa1bHTPbw0ODzCfhf2_Idg7gjmbucHXhZ7T5paA_rfdgh.n.E4Jy7ddybwE8Ud1pUgP0EmmBbfLOrr8Ty5jnfx6cXWtM8shJ8jNkaV82kD_tSYKS2sTr_Fpmgr707p7R9y57ybNYI7T.Yiya_O8pxTPC4KdkVzwKH6dZLqs7gkzgrB2ne; _hjSession_1149958=eyJpZCI6ImNiZTJjODc5LWFiYWYtNDhjMy05NTYwLTU1ZGI3MGExMzA3ZiIsImMiOjE3MjM4NjI0MTA1NjUsInMiOjEsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; __hstc=153128807.17ebba387a258df6ee6a825e512b7053.1723750750433.1723852910469.1723862905549.5; __cf_bm=lVibwRwAWKAKZ8sFMvOP5pF7k4H87yhWe7.e5JiTnh0-1723863031-1.0.1.1-Idu.dHR_Q6erA6zwMWOB3lyp_dDAbp9dOYzpeng.prSvDe2joqYaIgEAVjlSOkCs2YyliB.SQqHdLDEUcZzh_Q; __gads=ID=675f0f6031d5104e:T=1723750750:RT=1723863479:S=ALNI_MavjdD6wsenyt5nIOUvuPCHBtJ3jw; __gpi=UID=00000ecb5c1118e0:T=1723750750:RT=1723863479:S=ALNI_MamXRchF5cKaazcuIemBOouFKQuOQ; __eoi=ID=8e4baf5d2354be81:T=1723750750:RT=1723863479:S=AA-AfjbxOMQ6zGHemmf-0jIOqjot; mp_017900c581ab83839036748f85e0877f_mixpanel=%7B%22distinct_id%22%3A%20%227179169%22%2C%22%24device_id%22%3A%20%22191578d175bd0c-09d63759ab76f5-19525637-3427cc-191578d175bd0c%22%2C%22%24search_engine%22%3A%20%22google%22%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22%24user_id%22%3A%20%227179169%22%7D; _ga=GA1.1.1572086165.1723750750; __hssc=153128807.6.1723862905549; _tfpvi=OTJjMmM1ZDQtODk2NS00NDY5LTllOWEtYmViMjcwMjIxODMyIy0xLTY%3D; cto_bundle=qTfZiV8wUHdsbWklMkJoM2FoaFg3UjMlMkZoWVclMkZKN3clMkZVcGFZS2J0RWpmSkdWc0VwVDdqNjhlc2dJSjdOTlZlR2pzSmQxSzclMkZLOVR6Sk5FUFdNdkp4cDNqSmFOazF0MXhldWxKVE1NTHNkalZNZlJKdDhtWEhNNmMlMkJoVk9GeXRXOTglMkJLN2JUb1pLWFFQendRUyUyQjEwYW4lMkJMSGhKckllVlJFbk1OWTRHam1YdHp3dzc0cm1GbiUyQjc0TkI4WFFDT2gydzdCZ1g5eEU1bXlxUENpREdIR1VjMXdFUzhZRUtHNUplQ1dhJTJGMjBtc3VRd0p4VnVQT2ZkaE1veW9FU1UzTzBHYkx6czJGR1pxdWRaTUVFRnpZSEhTc0hEdHViZlElM0QlM0Q; cto_bidid=wNUC_19MZXNUaVFDMndOR1dVZ2d2Nm1LZXlvVjNPcTh0VFRvWHNLcjlxdFk2OHFHMDByb2lvZWUxQno4MnZMbGtBRyUyQnhZVzF2ZFJkaGtndFA1b1hLRkxyTlp0UmdpZFJ3cDdXSnFHQ2pBalJocXdObktmdng1VmQ0Z0lDeHVnTVVaTlE5RVVhbnMxZjBManlrSDBPUzVmZE5yZyUzRCUzRA; _ga_0PK0N4C9B7=GS1.1.1723862905.5.1.1723863831.60.0.0',

          'Referrer-Policy': 'strict-origin-when-cross-origin',
        },
        body: null,
        method: 'GET',
      },
    );

    const data = await resp.json();

    console.log('resp', data);

    return data;
  }

  async station() {
    const resp = await fetch(
      'https://shipfinder.co/endpoints/shipMetaData.php?mmsi=477665200&ts=1723919849&_=1723919907055',
      {
        headers: {
          accept: 'application/json, text/javascript, */*; q=0.01',
          'accept-language': 'en-US,en;q=0.9',
          'cache-control': 'no-cache',
          pragma: 'no-cache',
          priority: 'u=1, i',

          'sec-fetch-dest': 'empty',

          'x-requested-with': 'XMLHttpRequest',
          cookie:
            'sf={"center":"44.0893,-42.611627","zoom":3,"mapType":"default","measurement":"metric","tooltipValue":"name","disableEstimation":false,"showStoppedShipsIcon":true,"shipInfoInPopout":false,"optimise":true}; __utma=99208284.538959058.1723919623.1723919623.1723919623.1; __utmc=99208284; __utmz=99208284.1723919623.1.1.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); __utmt=1; __gads=ID=782edadc5745f31d:T=1723919622:RT=1723919622:S=ALNI_MYI3kh9PjbLbsIgHLKlNAKfAFQrgg; __gpi=UID=00000eb693a6600c:T=1723919622:RT=1723919622:S=ALNI_MarXlU8dncriSfkfqp5PCDKMcuHzQ; __eoi=ID=2b3a7426010ed888:T=1723919622:RT=1723919622:S=AA-AfjY6UYiwYXbDHBXX6L4ZXs-y; __utmb=99208284.2.10.1723919623; cf_clearance=jHBtNYi.Qow431EaPBVg.F4adv1sb.HJOkDjj_yGMpY-1723919636-1.2.1.1-JZaPs71YNpVH8UcaTN2lXConlQKu9xblFvjUV2rINFKuA9Z_riiFdWyF8Lz_4sF1zsO45VhBEh0Rt6RTkIPTbbXL3w_TFjTYqUz8qImvvmS1D0vFbwA4m8mDUSt2Fxt3yAy8z4qv5Tyz8egV1Rcf6jATu8LtPYKoTa_0UnDq1ZgiHKks8k2b17R1w1_j.gq0nA2D1.sYcNEfHKRKxFAAzTNeZwJLz2RmrHPOwBs3torgrNbL2Nr5HDvZnab2E55KbSl1DSeZl6VQkYLte9x1tXaftoCnIiES8D70advs4mGqF1xtUOzVCFJfwnhwEqC0fKj5gNevxvpJn.Fu5vFOI2StMUaGYPj8i12Nh_P0gvIzrZ2RFgS0H6Jh8K3l8iymIZbj0KJNwhHvZegVl6xvxg; FCNEC=%5B%5B%22AKsRol-_zJLHh65KTFwJCQmQWLDOG3wvxAgtiNvBSj2Jgwpmcyfd-ifHm4F5Ng_GIJF1FYN3x8yRQnog2OqWdMpQxBU7MblKY62NLjTWxJjSjtCjUxRPl5M_AExBR7vBQjxZdsMogROJ6uII0v_jylRLJs6uqt57tA%3D%3D%22%5D%5D',
        },
        body: null,
        method: 'GET',
      },
    );

    const data = await resp.json();

    return data;
  }

  // month is formatted as "MM/YYYY" with a leading zero
  async getTopTenTradedInMonth(month: string, year: string) { // by number of hscode occurrences
    const aggr = [
      {
        $match: {
          'shipment.arrival_date': {
            $regex: `.*\\/${month}\\/${year}$`,
            $options: 'i',
          },
          'shipment.hs_code': { $ne: "000000" },
        },
      },
      {
        $group: {
          _id: '$shipment.hs_code',
          hs_code_description: { $first: '$shipment.hs_code_description' },
          count: { $sum: 1 },
          
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ];

    const results = await this.importyetiModel.aggregate(aggr as any);

    const _ids = results.map((result) => result._id);

    // hs_code starts with 6 digits
    const commodities = await this.gatsCommoditiesModel.find({
      hS6Code: { $in: _ids },
    });

    console.log(commodities);

    return results;
  }
}
