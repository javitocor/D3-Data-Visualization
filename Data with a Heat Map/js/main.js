d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', function(err, data){
  const w = 5 * Math.ceil(data.monthlyVariance.length / 12);
  const h = 33 * 12;
  const barwidth = w / 35;

  function color(value) {
    if(value <= 3){
      return 'green';
    } else if(value > 3 && value <= 6){
      return 'blue';
    } else if( value > 6 && value <=9) {
      return 'orange';
    } else if( value > 9) {
      return 'red';
    }
  }
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
  
  svgContainer
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -200)
    .attr('y', 30)
    .text('MONTHS')
    .style('font-weight', '800');

  svgContainer
    .append('text')
    .attr('x', w / 2 )
    .attr('y', h + 60)
    .text('Year')
    .style('font-weight', '800')
    .style('font-size', '19')
    .attr('class', 'info');

  const yearsDate = data.monthlyVariance.map(item=> item.year)
  const xScale = d3
    .scaleLinear()
    .domain([d3.min(yearsDate), d3.max(yearsDate)])
    .range([0, w]);
  const xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format('d')).ticks(20);
  svgContainer.append("g")
    .attr("transform", "translate(85," + (h+20) + ")")
    .call(xAxis)
    .style('font-size', '16')
    .attr('id', 'x-axis');

  function monthLet(value) {
    if(value == 1){
      return 'JAN'
    } else if(value == 2){
      return 'FEB'
    } else if(value == 3){
      return 'MAR'
    } else if(value == 4){
      return 'APR'
    } else if(value == 5){
      return 'MAY'
    } else if(value == 6){
      return 'JUN'
    } else if(value == 7){
      return 'JUL'
    } else if(value == 8){
      return 'AUG'
    } else if(value == 9){
      return 'SEP'
    } else if(value == 10){
      return 'OCT'
    } else if(value == 11){
      return 'NOV'
    } else if(value == 12){
      return 'DEC'
    }
  }
  const monthsDate = data.monthlyVariance.map(item=> {
    return monthLet(item.month)
  })
  console.log(monthsDate)
  const yScale = d3.scaleTime()
    .domain([new Date().setMonth(0),new Date().setMonth(11)])
    .range([0, h]);
  const tickValues = Array(12).fill(1).map((val, index) => new Date().setMonth(index));
  const yAxis = d3.axisLeft(yScale)
      .tickValues(tickValues)
      .tickFormat(d3.timeFormat("%B"))
      .tickSize(5, 1);
  svgContainer.append("g")
    .attr("transform", "translate(85,20)")
    .call(yAxis)
    .style('font-size', '15')
    .attr('id', 'y-axis')
    .attr("width", h/12 - 400);

    d3.select('svg').selectAll('.cell')
    .data(data.monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', d => monthLet(d.month)) 
    .attr('data-year', d => d.year)
    .attr('data-temp', d => data.baseTemperature + d.variance)
    .attr('x', d=> xScale(d.year))
    .attr('y', d=> yScale(new Date().setMonth(d.month)))
    .attr('width', '5')
    .attr('height', '20')
    .attr('fill', d=>color(data.baseTemperature + d.variance))
    .attr('transform', "translate(85, -35)")
    .on('mouseover', function (d, i) {
      tooltip.transition().duration(200).style('opacity', 0.9);
      tooltip
        .html(
          'YEAR: ' + d.year + ' - ' + monthLet(d.month) +
          '<br>' +
          'TEMP: '+ d3.format('+.2f')(data.baseTemperature + d.variance) + 
          '<br>' +
          'VARIANCE: ' + d3.format('+.1f')(d.variance) + '&#8451;'
        )
        .attr('data-year', data.monthlyVariance[i].year)
        .style('left', xScale(d.year)  + 0 + 'px')
        .style('top', d3.event.pageY -130 + 'px')
        .style('font-size', '13')
        .style('transform', 'translateX(55px)');
    })
    .on('mouseout', function () {
      tooltip.transition().duration(200).style('opacity', 0);
    });
});