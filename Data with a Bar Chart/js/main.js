const w = 800;
const h = 400;
const barwidth = w / 275;

var tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

var overlay = d3
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

var svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', w + 100)
  .attr('height', h + 60);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json', function (err, data) {
  svgContainer
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 65)
    .text('Gross Domestic Product');

  svgContainer
    .append('text')
    .attr('x', w / 2 + 120)
    .attr('y', h + 50)
    .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
    .attr('class', 'info');

  const years = data.data.map(function (item) {
    var quarter;
    var temp = item[0].substring(5, 7);

    if (temp === '01') {
      quarter = 'Q1';
    } else if (temp === '04') {
      quarter = 'Q2';
    } else if (temp === '07') {
      quarter = 'Q3';
    } else if (temp === '10') {
      quarter = 'Q4';
    }

    return item[0].substring(0, 4) + ' ' + quarter;
  });

  var yearsDate = data.data.map(function (item) {
    return new Date(item[0]);
  });



  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsDate), d3.max(yearsDate)])
    .range([0, w]);
  const xAxis = d3.axisBottom().scale(xScale);
  svgContainer.append("g")
    .attr("transform", "translate(45," + (h) + ")")
    .call(xAxis)
    .attr('id', 'x-axis');


  const GDP = data.data.map(gdp => gdp[1]);
  const linearScale = d3.scaleLinear().domain([0, d3.max(GDP)]).range([0, h]);

  let scaledGDP = GDP.map(function (item) {
    return linearScale(item);
  });
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([h, 0]);

  const yAxis = d3.axisLeft(yScale);

  svgContainer.append("g")
    .attr("transform", "translate(45,0)")
    .call(yAxis)
    .attr('id', 'y-axis');

  d3.select('svg').selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(yearsDate[i]))
    .attr("y", (d, i) => h - d)
    .attr('width', barwidth)
    .attr('height', function (d) {
      return d;
    })
    .style('fill', '#33adff')
    .attr('transform', 'translate(45, 0)')
    .attr('data-date', (d, i) => data.data[i][0])
    .attr('data-gdp', (d, i) => data.data[i][1])
    .on('mouseover', function (d, i) {
      overlay
        .transition()
        .duration(0)
        .style('height', d + 'px')
        .style('width', barwidth + 'px')
        .style('opacity', 0.9)
        .style('left', i * barwidth + 0 + 'px')
        .style('top', h - d + 'px')
        .style('transform', 'translateX(45px)');
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          years[i] +
          '<br>' +
          '$' +
          GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
          ' Billion'
        )
        .attr('data-date', data.data[i][0])
        .style('left', i * barwidth + 50 + 'px')
        .style('top', h - 100 + 'px')
        .style('transform', 'translateX(45px)');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
      overlay.transition().duration(200).style('opacity', 0);
    });
}
       
);

