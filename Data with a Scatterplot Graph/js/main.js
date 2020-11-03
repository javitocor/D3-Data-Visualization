const w = 800;
const h = 400;
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

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json', function(err, data){
  svgContainer
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 15)
    .text('Time in Minutes')
    .style('font-weight', '800');

  svgContainer
    .append('text')
    .attr('x', w / 2 )
    .attr('y', h + 50)
    .text('Year')
    .style('font-weight', '800')
    .style('font-size', '16')
    .attr('class', 'info');

  const yearsDate = data.map(item=> item.Year);
  
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(yearsDate) - 1, d3.max(yearsDate) + 1])
    .range([0, w]);
  const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d'));
  svgContainer.append("g")
    .attr("transform", "translate(55," + (h) + ")")
    .call(xAxis)
    .attr('id', 'x-axis');

  const timeFormat = d3.timeFormat('%M:%S');
  data.forEach(function (d) {
    let parsedTime = d.Time.split(':');
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]));
  });
  
  const yScale = d3.scaleTime()
    .domain(d3.extent(data, function (d) {
      return d.Time;
    }))
    .range([0, h]);
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);
  svgContainer.append("g")
    .attr("transform", "translate(55,0)")
    .call(yAxis)
    .attr('id', 'y-axis');

  d3.select('svg').selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 6)
    .attr('data-xvalue', d => d.Year)
    .attr('data-yvalue', d => d.Time)
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(d.Time))
    .attr('transform', 'translate(55, 0)')
    .style('fill', d=>{
      return d.Doping === '' ? 'blue' : 'red'
    })
    .on('mouseover', function (d, i) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          'Name: ' + d.Name + ', ' + d.Nationality +
          '<br>' +
          'Year: '+ d.Year + ' Time: ' + timeFormat(d.Time) +
          '<br>' +
          d.Doping
        )
        .attr('data-year', data[i].Year)
        .style('left', xScale(d.Year)  + 0 + 'px')
        .style('top', d3.event.pageY -130 + 'px')
        .style('font-size', '13')
        .style('transform', 'translateX(55px)');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
    });
    
    const legendContainer = svgContainer.append('g')
                                      .attr('id', 'legend')
                                      .attr("transform", "translate(50,130)")
                                      .attr('width', '130')
                                      .attr('height', '60')

    legendContainer.append('rect')
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
      .text('No Doping allegations');

      legendContainer.append('rect')
      .attr('x', w - 18)
      .attr('y', 30)
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', 'red');
  
      
      legendContainer
        .append('text')
        .attr('x', w - 24)
        .attr('y', 39)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text('Doping allegations');
});