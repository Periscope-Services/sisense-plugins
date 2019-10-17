prism.registerWidget("periscopeEmbed", {
    name: "periscopeEmbed",
    family: "embedding",
    title: "Periscope Embed",
    iconSmall: "/plugins/periscopeEmbed/favicon180.png",
    styleEditorTemplate: "/plugins/periscopeEmbed/styler.html",
    hideNoResults: true,
    style: {
	//set default auth token and site name here
        //authtoken: 'your_api_key' 
        //site: 'your_site_name'
    },
    options: {
        title: false
    },
    // sizing must be stated
    sizing: {

        minHeight: 128, //header
        maxHeight: 2048,
        minWidth: 128,
        maxWidth: 2048,
        height: 640,
        defaultWidth: 512
    },
    data: {

        selection: [],
        defaultQueryResult: {},

        panels: [{
            name: 'filters',
            type: 'filters',
            metadata: {

                types: ['dimensions'],
                maxitems: -1
            }
        }],
    },
    render: function(widget, args) {
        var scriptUrl = 'https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.1/sha.js';
        
	// ignore redraws -- the iframe will resize itself, no reason to go back to the API for this
	if (args.reason == 'widgetredraw'){
            return
        }

        $.getScript(scriptUrl, function(dataObj, textStatus) {
            apiKey = widget.style.authtoken
            dashboardId = widget.style.dashboardid
            chartId = widget.style.chartid
            
            var data = {
                dashboard: dashboardId,
                embed: 'v2'
            };
            if (chartId) {
                data.chart = chartId;
            }
            
            dashboardFilters = widget.dashboard.filters.$$items
            
            embedFilters = []
            for (let dashboardFilter of dashboardFilters) {
                if (dashboardFilter.jaql.datatype == 'datetime') {
                    continue
                }
                
                embedFilters.push({
                    'name': dashboardFilter.jaql.title,
                    'value': dashboardFilter.jaql.filter.members
                })
            }
            
            data.filters = embedFilters
            
            if (widget.style.visiblefilters){
                if (widget.style.visiblefilters.includes(',')){
                    visibleFilters = widget.style.visiblefilters.split(',')
                }
                else {
                    visibleFilters = widget.style.visiblefilters.split('\n')
                }
                data.visible = visibleFilters
            }
            
            if (widget.style.datats){
                now = Math.floor(new Date().getTime() / 1000)
                data_ts = now - (widget.style.datats * 60)
                data.data_ts = data_ts
            }
            
            console.log(data)
            
            var escapedQS = escape(JSON.stringify(data));
            var path = `/api/embedded_dashboard?data=${escapedQS}`;
            // Use SHA to generate signature with API key
            var sha = new jsSHA('SHA-256', 'TEXT');
            sha.setHMACKey(apiKey, 'TEXT');
            sha.update(path);
            signature = sha.getHMAC('HEX');
            // Build and return final periscope URL
            var url = `https://app.periscopedata.com${path}&signature=${signature}`;

            // If the IFrame exists, only updates the url
            var $frame = $(args.element).find("iframe");

            if ($frame.length > 0) {
                $frame.attr("src", url);
            }

            // Add the IFrame to the widget
            else {
                $frame = $("<iframe></iframe>");

                $frame.attr("src", url);
                $frame.attr("marginwidth", 10);

                var $frameContainer = $("<div class='periscopeEmbed'></div>");
                $frameContainer.append($frame);
                $(args.element).append($frameContainer);
                
                addDrilldownHandler(window, widget)
                
                var r = function (r, i) {
			        var o = ["super", "contributor", "admin", "dataDesigner", "dataAdmin"];
				    o.includes(prism.user.roleName) && (i.items.push(
                        {
				            type: "separator"
				        }
                    ), i.items.push(
                        {
					        caption: "Edit in Periscope",
						    execute: function () {
                                url = `https://app.periscopedata.com/app/${widget.style.site}/${widget.style.dashboardid}`
                                if (widget.style.chartid) {
							        url = url + `/?widget=${widget.style.chartid}`
                                }
                                window.location.href = url
						    }
					    }
                    ))
				};
                if (widget.style.site){
			        widget.on("beforewidgetmenu", r), widget.on("beforewidgetindashboardmenu", r)
                }
            }
            
            
        });
			}
});


function addDrilldownHandler(elem, widget) {
    elem.addEventListener('message', function(event) {
        console.log(event)
        drilldown_source_chart = event.srcElement.chartId
        console.log(widget)
        
        console.log(event.data.event_type + ' ' + drilldown_source_chart)
                    
        if (event.data.event_type != "drilldown" || drilldown_source_chart != widget.style.chartid) {
            return
        }
                        
        for (let filter_value of event.data.filter_values){
            if (filter_value.filter_name == 'date_range'){
                filter = {
                    jaql: {
                        dim: widget.style.dim,
                        datasource: widget.dashboard.datasource,
                        datatype: "datetime",
                        filter: {
                            from: filter_value.column_value,
                            to: filter_value.column_value
                        },
                        title: filter_value.filter_name,
                        level: 'days',
                        merged: true
                    }
                }
            }
            else{
                filter = {
                    jaql: {
                        dim: widget.style.dim,
                        datasource: widget.dashboard.datasource,
                        datatype: "text",
                        filter: {
                            members: [filter_value.column_value]
                        },
                        title: filter_value.filter_name,
                        merged: true
                    }
                }
            }
            
            console.log(filter)
                        
            filterOptions = {
				save: true,
				refresh: true,
				unionIfSameDimensionAndSameType: true
			}	

            widget.dashboard.filters.update(filter, filterOptions)
                        
        }
    }, false);
}
