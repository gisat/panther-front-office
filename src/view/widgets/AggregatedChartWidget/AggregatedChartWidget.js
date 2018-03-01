import {select, csvParse, scaleBand, scaleLinear, scaleOrdinal, max, stack, axisBottom, axisLeft} from 'd3';


import Widget from '../Widget';

import './AggregatedChartWidget.css';

let Config = window.Config;
let resize = window.resize;

/**
 * @param options {Object}
 * @param options.elementId {String} ID of widget
 * @param options.filter {Filter} instance of class for data filtering
 * @param options.targetId {String} ID of an element in which should be the widget rendered
 * @param options.name {String} Name of the widget
 * @param options.stateStore {StateStore}
 * @constructor
 */
let $ = window.$;
class AggregatedChartWidget extends Widget {
    constructor(options) {
        super(options);

        this._settings = null;

        this._filter = options.filter;
        this._stateStore = options.stateStore;
    };

    /**
     * It rebuilds the widget.
     */
    build(sets) {
        if (!this._resizeListener) {
            this._resizeListener = true;
            this.addOnResizeListener();
        }
        this._initializeResize = false;
        this.handleLoading("hide");

        $('#floater-functional-urban-area-result').addClass('open');
        $('#floater-functional-urban-area-result .floater-body').empty();
        // Append chart for each Set.
        let charts = Object.keys(sets).map(function (set) {
            return '<h3>' + sets[set].name + '</h3><svg id="stacked-' + set + '" width="500" height="500"></svg>';
        }).join(' ');
        $('#floater-functional-urban-area-result .floater-body').append(
            '<div id="chart">' + charts + '</div>'
        );

        let setsToSend = [];
        Object.keys(sets).forEach(function (setName) {
            let set = {
                id: sets[setName].id,
                name: sets[setName].name,
                categories: sets[setName].categories
            };
            set.categories = Object.keys(set.categories).map(function (category) {
                set.categories[category].attributes = set.categories[category].data;
                return set.categories[category];
            });

            setsToSend.push(set);
        });

        let self = this;
        let current = this._stateStore.current();
        $.post(Config.url + 'rest/data/aggregated', {
            sets: setsToSend,
            areaTemplate: current.analyticalUnitLevel,
            periods: current.periods,
            places: current.places
        }, result => {
            result.sets.forEach(function (set) {
                let colors = set.set.categories.map(function (category) {
                    return category.color;
                });
                self.generateChart(set.csv, 'svg#stacked-' + set.set.id, colors);
            })
        });
    };

    generateChart(csv, chartId, colors) {
        let svg = select(chartId),
            margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let x = scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.05)
            .align(0.1);

        let y = scaleLinear()
            .rangeRound([height, 0]);

        let z = scaleOrdinal()
            .range(colors); // The colors needs to be retrieved as part.

        let data = csvParse(csv, function (d, i, columns) {
            let t;
            for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
            d.total = t;
            return d;
        });

        let keys = data.columns.slice(1);

        data.sort(function (a, b) {
            return b.total - a.total;
        });
        x.domain(data.map(function (d) {
            return d.State;
        }));
        y.domain([0, max(data, function (d) {
            return d.total;
        })]).nice();
        z.domain(keys);

        g.append("g")
            .selectAll("g")
            .data(stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.data.State);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("height", function (d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth());

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(axisBottom(x));

        g.append("g")
            .attr("class", "axis")
            .call(axisLeft(y).ticks(null, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Amount");

        let legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) {
                return d;
            });
    };

    rebuild() {
    };

    /**
     * Rebuild widget on resize
     */
    addOnResizeListener() {
        let self = this;
        let id = this._widgetSelector.attr("id");
        let resizeElement = document.getElementById(id);

        let timeout;
        resize.addResizeListener(resizeElement, function () {
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                if (self._initializeResize) {
                    self.build();
                }
                self._initializeResize = true;
            }, 500);
        });
    };
}

export default AggregatedChartWidget;