import {format, select, scaleOrdinal, schemeCategory10, max} from 'd3';
import _ from "lodash";

import Chart from '../Chart';

var RadarChart = {
    draw: function(id, d, options){
        var cfg = {
            radius: 5,
            w: 600,
            h: 600,
            factor: 1,
            factorLegend: .85,
            format: "",
            levels: 3,
            levelCaptions: true,
            maxValue: 0,
            radians: 2 * Math.PI,
            opacityArea: 0.5,
            ToRight: 5,
            TranslateX: 80,
            TranslateY: 30,
            ExtraWidthX: 100,
            ExtraWidthY: 100,
            color: scaleOrdinal(schemeCategory10)
        };

        if('undefined' !== typeof options){
            for(var i in options){
                if('undefined' !== typeof options[i]){
                    cfg[i] = options[i];
                }
            }
        }
        cfg.maxValue = Math.max(cfg.maxValue, max(d, function(i){return max(i.map(function(o){return o.value;}))}));
        var allAxis = (d[0].map(function(i, j){return i.axis}));
        var total = allAxis.length;
        var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
        var Format = format(cfg.format);
        select(id).select("svg").remove();

        var g = select(id)
            .append("svg")
            .attr("width", cfg.w+cfg.ExtraWidthX)
            .attr("height", cfg.h+cfg.ExtraWidthY)
            .append("g")
            .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

        var tooltip;

        //Circular segments
        for(var j=0; j<cfg.levels-1; j++){
            var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
            g.selectAll(".levels")
                .data(allAxis)
                .enter()
                .append("svg:line")
                .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
                .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
                .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
                .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
                .attr("class", "line")
                .style("stroke", "grey")
                .style("stroke-opacity", "0.75")
                .style("stroke-width", "0.3px")
                .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
        }

        //Text indicating at what % each level is
        if(cfg.levelCaptions) {
            for (var j = 0; j < cfg.levels; j++) {
                var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
                g.selectAll(".levels")
                    .data([1]) //dummy data
                    .enter()
                    .append("svg:text")
                    .attr("x", function (d) {
                        return levelFactor * (1 - cfg.factor * Math.sin(0));
                    })
                    .attr("y", function (d) {
                        return levelFactor * (1 - cfg.factor * Math.cos(0));
                    })
                    .attr("class", "legend")
                    .style("font-family", "sans-serif")
                    .style("font-size", "10px")
                    .attr("transform", "translate(" + (cfg.w / 2 - levelFactor + cfg.ToRight) + ", " + (cfg.h / 2 - levelFactor) + ")")
                    .attr("fill", "#737373")
                    .text(Format((j + 1) * cfg.maxValue / cfg.levels));
            }
        }

        var series = 0;

        var axis = g.selectAll(".axis")
            .data(allAxis)
            .enter()
            .append("g")
            .attr("class", "axis");

        axis.append("line")
            .attr("x1", cfg.w/2)
            .attr("y1", cfg.h/2)
            .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
            .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
            .attr("class", "line")
            .style("stroke", "grey")
            .style("stroke-width", "1px");

        axis.append("text")
            .attr("class", "legend")
            .text(function(d){return d})
            .style("font-family", "sans-serif")
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .attr("transform", function(d, i){return "translate(0, -10)"})
            .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
            .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});


        var dataValues = [];

        d.forEach(function(y, x){
            dataValues = [];
            g.selectAll(".nodes")
                .data(y, function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                });
            dataValues.push(dataValues[0]);
            g.selectAll(".area")
                .data([dataValues])
                .enter()
                .append("polygon")
                .attr("class", "radar-chart-serie"+series)
                .style("stroke-width", "2px")
                .style("stroke", cfg.color(series))
                .attr("points",function(d) {
                    var str="";
                    for(var pti=0;pti<d.length;pti++){
                        str=str+d[pti][0]+","+d[pti][1]+" ";
                    }
                    return str;
                })
                .style("fill", function(j, i){return cfg.color(series)})
                .style("fill-opacity", cfg.opacityArea)
                .on('mouseover', function (d){
                    var z = "polygon."+select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                });
            series++;
        });
        series=0;


        d.forEach(function(y, x){
            g.selectAll(".nodes")
                .data(y).enter()
                .append("svg:circle")
                .attr("class", "radar-chart-serie"+series)
                .attr('r', cfg.radius)
                .attr("alt", function(j){return Math.max(j.value, 0)})
                .attr("cx", function(j, i){
                    dataValues.push([
                        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)),
                        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
                    ]);
                    return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
                })
                .attr("cy", function(j, i){
                    return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
                })
                .attr("data-id", function(j){return j.axis})
                .style("fill", cfg.color(series)).style("fill-opacity", .9)
                .on('mouseover', function (d){
                    var newX =  parseFloat(select(this).attr('cx')) - 10;
                    var newY =  parseFloat(select(this).attr('cy')) - 5;

                    tooltip
                        .attr('x', newX)
                        .attr('y', newY)
                        .text(d.label || Format(d.label))
                        .transition(200)
                        .style('opacity', 1)
                        .style('display', 'block');

                    var z = "polygon."+select(this).attr("class");
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", 0.1);
                    g.selectAll(z)
                        .transition(200)
                        .style("fill-opacity", .7);
                })
                .on('mouseout', function(){
                    tooltip
                        .transition(200)
                        .style('opacity', 0)
                        .style('display', 'none');
                    g.selectAll("polygon")
                        .transition(200)
                        .style("fill-opacity", cfg.opacityArea);
                })
            // .append("svg:title")
            // .text(function(j){return Math.max(j.value, 0)*100 + " %"})
            ;

            series++;
        });
        //Tooltip
        tooltip = g.append('text')
            .style('opacity', 0)
            .style('font-family', 'sans-serif')
            .style('font-size', '13px');
    },

    test: function(msg){
        return 'message is ' + msg;
    }
};

class PolarChart extends Chart {
    rebuild() {
        var cmp = this._options.containerComponent;
        this._selectedAreas = _.cloneDeep(window.Charts.selectedAreas);

        // get and parse graph data
        let data = this.getDataForChart();

        if (data && this._data && _.isEqual(data.categories, this._data.categories)){
            return;
        } else {
            this._data = data;
			var w = 350,
				h = 350;

			// var colorscale = d3.scale.category10();

			// Legend titles
			// var LegendOptions = ['Smartphone','Tablet'];

			// Options for the Radar chart, other than default
			var chartConfig = {
				w: w,
				h: h,
				// maxValue: 0.6,
				levels: 10,
				levelCaptions: false,
				ExtraWidthX: 210,
				ExtraWidthY: 32
			};


			// Call function to draw the Radar chart
            if (data){
				RadarChart.draw(cmp.el.dom, data.chartData, chartConfig);
            }
        }
    };

    getDataForChart(){
        let allData = this._options.backendResponse.responseText ? JSON.parse(this._options.backendResponse.responseText).data : null;
        if (!this._selectedAreas || _.isEmpty(this._selectedAreas) || !allData){
            return allData;
        } else {
            let selectedData = {
                categories: [],
                chartConfig: allData.chartConfig,
                chartData: []
            };
            allData.categories.map((category, index) => {
                _.forIn(this._selectedAreas, (areas, color) =>{
					if (_.includes(areas, category)){
						selectedData.categories.push(category);
						selectedData.chartData.push(allData.chartData[index]);
					}
                });
            });
            return selectedData;
        }
    }

    clearAllSelections(){
		window.Charts.selectedAreas = null;
		this._selectedAreas = null;
		this.rebuild();
    }

	/**
	 * @param color {String} hex code of a color, which is used as key
	 */
	clearSelectionForColor(color){
		if (window.Charts.selectedAreas){
		    delete window.Charts.selectedAreas[color];
        }
        if (this._selectedAreas){
			delete this._selectedAreas[color];
        }
		this.rebuild();
	}

    onEvent(type, options){
        if (type === "selection#everythingCleared"){
            if (this.isActiveInstance()){
				this.clearAllSelections();
            }
        } else if (type === "selection#activeCleared"){
			if (this.isActiveInstance()){
			    this.clearSelectionForColor(options.color);
			}
        } else if (type === "selection#selectionChanged"){
			if (this.isActiveInstance()){
				this.rebuild();
			}

        }
    }

    isActiveInstance(){
	    return !!_.find(window.Charts.data, (chart) => {return chart.chartId === this.id});
    }
}

export default PolarChart;