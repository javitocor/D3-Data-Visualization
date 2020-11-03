const width = 960, height = 600;
const color_domain = [4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100]
const ext_color_domain = [0, 4, 12, 20, 28, 36, 44, 52, 60, 68, 76, 84, 92, 100]
const legend_labels = ["4%", "12%", "20%", "28%", "36%", "44%", "52%", "60%", "68%", "76%", "84%", "92%", "100%"]
const color = d3.scale.threshold()
.domain(color_domain)
.range(["#dcdcdc", "#d0d6cd", "#bdc9be", "#aabdaf", "#97b0a0", "#84a491", "#719782", "#5e8b73", "#4b7e64", "#387255", "#256546", "#125937", "#004d28"]);

const tooltip = d3.select(".visHolder").append("div")
  .attr("id", "tooltip")
  .style("opacity", 0);

const svg = d3.select(".visHolder").append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("margin", "0px auto");

const legend = svg.selectAll("g.legend")
  .data(ext_color_domain)
  .enter().append("g")
  .attr("id", "legend");

const ls_w = 73, ls_h = 20;

legend.append("rect")
  .attr("x", function (d, i) { return width - (i * ls_w) - ls_w; })
  .attr("y", 550)
  .attr("width", ls_w)
  .attr("height", ls_h)
  .style("fill", function (d, i) { return color(d); })
  .style("opacity", 0.8);

legend.append("text")
  .attr("x", function (d, i) { return width - (i * ls_w) - ls_w; })
  .attr("y", 590)
  .text(function (d, i) { return legend_labels[i]; });

const legend_title = "Educational percentage";

svg.append("text")
  .attr("x", 10)
  .attr("y", 540)
  .attr("class", "legend_title")
  .text(function () { return legend_title });
const path = d3.geo.path()

queue()
  .defer(d3.json, "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json")
  .defer(d3.json, "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json")
  .await(ready);

function ready(error, education, counties) {
  svg
    .append('g')
    .attr('class', 'counties')
    .selectAll('path')
    .data(topojson.feature(counties, counties.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('data-fips', function (d) {
      return d.id;
    })
    .attr('data-education', d => {
      const result = education.filter(function (obj) {
        return obj.fips === d.id;
      });
      if (result[0]) {
        return result[0].bachelorsOrHigher;
      }
      console.log('could find data for: ', d.id);
      return 0;
    })
    .attr('fill', d =>{
      const result = education.filter(function (obj) {
        return obj.fips === d.id;
      });
      if (result[0]) {
        return color(result[0].bachelorsOrHigher);
      }
      return color(0);
    })
    .attr('d', path)
    .on('mouseover', function (d) {
      tooltip.style('opacity', 0.9);
      tooltip
        .html(function () {
          var result = education.filter(function (obj) {
            return obj.fips === d.id;
          });
          if (result[0]) {
            return (
              result[0]['area_name'] +
              ', ' +
              result[0]['state'] +
              ': ' +
              result[0].bachelorsOrHigher +
              '%'
            );
          }
          return 0;
        })
        .attr('data-education', function () {
          var result = education.filter(function (obj) {
            return obj.fips === d.id;
          });
          if (result[0]) {
            return result[0].bachelorsOrHigher;
          }
          return 0;
        })
        .style('left', d3.event.pageX + 10 + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
    });
};

