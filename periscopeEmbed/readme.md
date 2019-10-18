# Periscope Embed Plugin

This plugin lets you easily embed Periscope charts and dashboards into a Sisense dashboard.

## Embedding a Chart

To embed a chart, set all 3 values: API Key, Dashboard ID, and Chart ID.

## Embedding a Dashboard

To embed a dashboard, only set the API Key and Dashboard ID. Leave the Chart ID blank.

## Other Options
  
- Visible Filters - Applies only to dashboards. Sets which filters are available for the user to change.
  
- Data Latency - Minimum "freshness" of the data in minutes. For example, if this is set to 10, then the data returned by the chart will be at *most* 10 minutes old.

- Drilldown Dimension - If your Periscope chart has a drilldown enabled, you must specify the Sisense dimension to be filtered based on that drilldown. For example, if your drilldown returns a value that is stored in the `platform` column of the `users` table, then your drilldown dimension would be `[users.platform]`.

## Setting the Default API Key and Site Name

You can apply a default API Key in line 10 of the `widget.js` file. For example, if your API Key is `e179017a-62b0-4996-8a38-e91aa9f1` and your site's name is `my-periscope-site`, you would set:
```
style: {
    //set default API key and site name here
    authtoken: 'e179017a-62b0-4996-8a38-e91aa9f1'
    site: 'my-periscope-site'
},
```
The values set here will show up by default in the API Key and Site Name fields. You will still be able to overwrite it at the widget level when necessary.

## Responding to Filters

Embedded Periscope charts will respond to Sisense filters (other than date filters) as long as the filter exists on the Periscope dashboard with the same name as the filter in Sisense.

## Applying Filters

Embedded Periscope charts can apply filters to the Sisense dashboard if the chart has a drilldown enabled within Periscope and the drilldown dimension is set in the embedded widget.
