const w = 950;
const h = 500;
const barwidth = w / 35;

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', w + 100)
  .attr('height', h + 60);

var fader = function (color) {
  return d3.interpolateRgb(color, '#fff')(0.2);
},
  color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json', function (err, data) {

  const root = d3.hierarchy(data).sum(function (d) { return d.value })
  d3.treemap()
    .size([w, h])
    .padding(1)
    (root)

  svgContainer
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
    .attr('class', 'tile')
    .attr('x', function (d) { return d.x0; })
    .attr('y', function (d) { return d.y0; })
    .attr('width', function (d) { return d.x1 - d.x0; })
    .attr('height', function (d) { return d.y1 - d.y0; })
    .style("stroke", "black")
    .attr('data-name', function (d) {
      return d.data.name;
    })
    .attr('data-category', function (d) {
      return d.data.category;
    })
    .attr('data-value', function (d) {
      return d.data.value;
    })
    .attr('fill', function (d) {
      return color(d.data.category);
    })
    .on('mousemove', function (d) {
      tooltip.style('opacity', 0.9);
      tooltip
        .html(
          'Name: ' +
          d.data.name +
          '<br>Category: ' +
          d.data.category +
          '<br>Value: ' +
          d.data.value
        )
        .attr('data-value', d.data.value)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 'px');
    })
    .on('mouseout', function () {
      tooltip.style('opacity', 0);
    });

  svgContainer
    .selectAll('text')
    .data(root.leaves())
    .enter()
    .append('text')
    .selectAll('tspan')
    .data(d => {
      return d.data.name.split(/(?=[A-Z][^A-Z])/g) // split the name of movie
        .map(v => {
          return {
            text: v,
            x0: d.x0,                        // keep x0 reference
            y0: d.y0                         // keep y0 reference
          }
        });
    })
    .enter()
    .append('tspan')
    .attr("x", (d) => d.x0 + 5)
    .attr("y", (d, i) => d.y0 + 15 + (i * 10))       // offset by index 
    .text((d) => d.text)
    .attr("font-size", "0.6em")
    .attr("fill", "white");

  var categories = root.leaves().map(function (nodes) {
    return nodes.data.category;
  });
  categories = categories.filter(function (category, index, self) {
    return self.indexOf(category) === index;
  });
  const legendContainer = svgContainer.append('g')
    .attr('id', 'legend')
    .attr("transform", "translate(-500,500)")
    .attr('width', '130')
    .attr('height', '60')

  legendContainer.append('g')
  .attr('transform', 'translate(60, 100)')
  .selectAll('g')
  .data(categories)
  .enter()
  .append('g')

  legendContainer.append('rect')
    .attr('class', 'legend-item')
    .attr('x', w - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', 'blue');


  legendContainer
    .append('text')
    .attr('x', w - 24)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'end')
    .text(function (d) {
      return d;
    });

  
});