const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const puppeteer = require('puppeteer');

const urls = [
  'resources_sobject_quickactions_default_values',
  'intro_rest',
  'intro_what_is_rest_api',
  'rest_rns',
  'intro_rest_compatible_editions',
  'intro_rest_resources',
  'intro_rest_architecture',
  'intro_oauth_and_connected_apps',
  'headers',
  'intro_curl',
  'intro_valid_date_formats',
  'errorcodes',
  'api_rest_eol',
  'quickstart',
  'dome_user_tasks',
  'using_resources_getting_info_about_my_org',
  'using_resources_working_with_object_metadata',
  'using_resources_working_with_records',
  'dome_event_series_delete',
  'using_resources_working_with_searches_and_queries',
  'dome_sobject_rich_text_image_retrieve',
  'dome_sobject_insert_update_blob',
  'dome_sobject_blob_retrieve',
  'using_resources_working_with_recently_viewed',
  'using_resources_managing_user_passwords',
  'using_resources_working_with_processes',
  'using_resources_event_log_files',
  'using_composite_resources',
  'openapi_beta',
  'resources_list',
  'resources_versions',
  'resources_discoveryresource',
  'resources_limits',
  'resources_describeGlobal',
  'resources_sobject_basic_info',
  'resources_sobject_basic_info_get',
  'resources_sobject_basic_info_post',
  'resources_sobject_describe',
  'resources_getdeleted',
  'resources_getupdated',
  'resources_sobject_named_layouts',
  'resources_sobject_retrieve',
  'resources_sobject_retrieve_get',
  'resources_sobject_retrieve_patch',
  'resources_sobject_retrieve_delete',
  'resources_sobject_upsert',
  'resources_sobject_upsert_get',
  'resources_sobject_upsert_post',
  'resources_sobject_upsert_patch',
  'resources_sobject_upsert_delete',
  'resources_sobject_upsert_head',
  'resources_sobject_blob_retrieve',
  'resources_sobject_approvallayouts',
  'resources_sobject_approvallayouts_get',
  'resources_sobject_approvallayouts_head',
  'resources_sobject_approvallayouts_process',
  'resources_sobject_approvallayouts_process_get',
  'resources_sobject_approvallayouts_process_head',
  'resources_sobject_compactlayouts',
  'resources_sobject_compactlayouts_get',
  'resources_sobject_compactlayouts_head',
  'resources_sobject_layouts',
  'resources_sobject_layouts_get',
  'resources_sobject_layouts_head',
  'resources_sobject_layouts_multiple_rts',
  'resources_sobject_layouts_multiple_rts_get',
  'resources_sobject_layouts_multiple_rts_head',
  'resources_sobject_layouts_global',
  'resources_sobject_layouts_global_get',
  'resources_sobject_layouts_global_head',
  'resources_sobject_platformaction',
  'resources_sobject_quickactions',
  'resources_sobject_quickactions_get',
  'resources_sobject_quickactions_head',
  'resources_sobject_quickactions_specific_action',
  'resources_sobject_quickactions_specific_action_get',
  'resources_sobject_quickactions_specific_action_post',
  'resources_sobject_quickactions_specific_action_head',
  'resources_sobject_quickactions_detail',
  'resources_sobject_quickactions_detail_get',
  'resources_sobject_quickactions_detail_head',
  'resources_sobject_quickactions_default_values_get',
  'resources_sobject_quickactions_default_values_head',
  'resources_sobject_quickactions_default_values_id',
  'resources_sobject_quickactions_default_values_id_get',
  'resources_sobject_quickactions_default_values_id_head',
  'resources_sobject_rich_text_image_retrieve',
  'resources_sobject_relationships',
  'resources_sobject_relationships_get',
  'resources_sobject_relationships_patch',
  'resources_sobject_relationships_delete',
  'resources_sobject_suggest_articles_case',
  'resources_sobject_suggest_articles_ID',
  'resources_sobject_user_password',
  'resources_sobject_user_password_get',
  'resources_sobject_user_password_post',
  'resources_sobject_user_password_delete',
  'resources_sobject_user_password_head',
  'resources_sobject_self_service_user_password',
  'resources_sobject_self_service_user_password_get',
  'resources_sobject_self_service_user_password_post',
  'resources_sobject_self_service_user_password_delete',
  'resources_sobject_self_service_user_password_head',
  'resources_sobject_eventschema',
  'resources_event_eventschema',
  'resources_appmenu_get',
  'resources_appmenu',
  'resources_appmenu_items_get',
  'resources_appmenu_head',
  'resources_appmenu_mobile_web',
  'resources_compact_layouts',
  'resources_consent',
  'resources_consent_write',
  'resources_embeddedserviceconfigdescribe',
  'resources_actions_invocable',
  'resources_actions_invocable_custom',
  'resources_actions_invocable_standard',
  'resources_listview',
  'resources_listviewdescribe',
  'resources_listviewresults',
  'resources_listviews',
  'resources_knowledge_support',
  'resources_search_parameterized',
  'resources_portability',
  'resources_process_approvals',
  'resources_process_rules',
  'resources_process_rule_object',
  'resources_process_rules_object',
  'resources_opportunitylineitemschedules',
  'resources_query',
  'resources_query_more_results',
  'resources_queryall',
  'resources_queryall_more_results',
  'resources_query_performance_feedback',
  'resources_quickactions',
  'resources_recentlistviews',
  'resources_recent_items',
  'resources_record_count',
  'resources_relevant_items',
  'resources_knowledge_retrieve_language',
  'resources_search',
  'resources_search_scope_order',
  'resources_search_layouts',
  'resources_lightning_togglemetrics',
  'resources_lightning_usagebyapptypemetrics',
  'resources_lightning_usagebybrowsermetrics',
  'resources_lightning_usagebypagemetrics',
  'resources_lightning_usagebyflexipagemetrics',
  'resources_lightning_exitbypagemetrics',
  'resources_ls_intro',
  'resources_search_suggest_records',
  'resources_search_suggest_title_matches',
  'resources_search_suggest_queries',
  'resources_survey_translation',
  'resources_tabs',
  'resources_themes',
  'resources_composite_composite',
  'resources_composite_graph',
  'resources_composite_batch',
  'resources_composite_sobject_tree',
  'resources_composite_sobjects_collections',
];

async function fetchAndSaveHtml(url, index) {
  const base =
    'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/';
  const fullUrl = `${base}${url}.htm`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(fullUrl, {
    waitUntil: 'networkidle0',
  });

  page
    .content()

    // axios
    //   .get(fullUrl, {
    //     headers: {
    //       'User-Agent':
    //         'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    //     },
    //     maxRedirects: 5, // Limit the number of redirects
    //   })
    .then((response) => {
      // .then((response) => {
      // const response = response.data;
      console.log('response', response);
      const $ = cheerio.load(response);
      const specificBlock = $('.container').text();
      console.log('specificBlock', specificBlock);
      if (specificBlock) {
        const modifiedUrl = url.replace(/\//g, '-');

        fs.writeFile(
          // `../tap-hubspot/docs/${modifiedUrl}.html`,
          // replace forward slashes with dashes
          `../../../../../ai-taps/ai-tap-salesforce/docs/${modifiedUrl}.html`,
          specificBlock,
          (err) => {
            if (err) {
              console.log(modifiedUrl);
              console.error('Error writing to file:', err);
            } else {
              console.log(
                `Successfully saved the HTML block from ${url} to ${modifiedUrl}.html`,
              );
            }
          },
        );
      } else {
        console.log(url);
        console.log(`The specified HTML block was not found in ${url}.`);
      }
    })
    .catch((error) => {
      console.error('Error fetching the page:', error);
    })
    .finally(() => {
      // Wait for 1 second before making the next request
      if (index < urls.length - 1) {
        setTimeout(() => fetchAndSaveHtml(urls[index + 1], index + 1), 300);
      }
    });
}

// Start the loop with the first URL
if (urls.length > 0) {
  fetchAndSaveHtml(urls[0], 0);
} else {
  console.log('No URLs provided.');
}
