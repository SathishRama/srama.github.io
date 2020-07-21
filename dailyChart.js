
//const data2 = d3.csv('https://raw.githubusercontent.com/SathishRama/srama.github.io/master/test_covid.csv')
function dailyChart() {
       const data2 = d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
        .then(function(data2){
              
              var dateRange = [];
              var caseRange = [];
              var newcaseRange = [];
              var k = 0 ;
              var formatTime = d3.timeFormat("%Y-%m-%d");
              
              var dateCounts = d3.nest()
                  .key(function(d) { return Date.parse(d.date)})
                  .rollup(function(v) {return d3.sum(v,function(d) {return d.cases})})
                  .entries(data2);

              dateCounts = dateCounts.filter(function(d) {return d.key > Date.parse('2020/03/01')})

              var newCases = d3.entries(dateCounts);

              dateCounts.forEach(function(each) {
                //dateRange[k] = Date.parse(each.key)
                dateRange[k] = each.key
                caseRange[k] = each.value
                
                if (k < 1) {
                  newCases[0].value = each.value ;
                }
                else {
                  newCases[k].value = each.value - dateCounts[k-1].value ;
                }
                //console.log(" After else block " , each.key , each.value , newCases[k].value)
                newcaseRange[k] = newCases[k].value ;
                k++;
              });

              console.log("Date Ranges " , d3.min(dateRange) , d3.max(dateRange));

              xs = d3.scaleBand().domain(dateRange).range([0,1300]);
              ys = d3.scaleLinear().domain([0,d3.max(newcaseRange)]).range([200,0]);

              d3.select(".myDivDailyChart").select("svg").append("g")
                .attr("transform","translate(50,50)")
                .call(d3.axisLeft(ys));
              
              d3.select(".myDivDailyChart").select("svg").append("g")
                .attr("transform","translate(50,250)")
                .call(d3.axisBottom(xs)
                       .tickFormat(d3.timeFormat("%m.%d"))
                     //.ticks(d3.time.months)
                       .tickSize(3, 0)
                     //.tickFormat(d3.timeFormat("%m"))
                        
                  )
                .selectAll("text") 
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

              d3.select(".myDivDailyChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .append("path")                       
                .datum(newCases)              
                .attr("d",d3.line()
                            .x(function(d,i) {return xs(dateRange[d.key])})
                            .y(function(d,i) {return ys(d.value) })
                    )
                  .attr('fill','none')
                  .attr('stroke-width',2)
                  .attr('stroke','black');

        })
        .catch(function() {
              console.log(Error)
        });
}

function stateChart() {
//const data = d3.csv('https://raw.githubusercontent.com/SathishRama/srama.github.io/master/us-states.csv')
        var marginx = 50;
        var marginy = 100;
        const data2 = d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
        .then(function(data){            
              var statecounts = d3.nest()
                  .key(function(d) {return d.state }).sortKeys(d3.ascending)
                  .rollup(function(v) { return d3.max( v, function(d) { return parseInt(d.cases)})})
                  .entries(data);           
              var statelist = [] ;
              var statecases = [] ;
              var k = 0 ;
              
              statecounts.forEach( function(each) {
                statelist[k] = each.key ;
                statecases[k] = each.value ;
                k++ ;
                //console.log(each.key , each.value);
              });                          
              
              colorScale = d3.scaleLinear().domain([0,d3.max(statecases)]).range(["lightblue","red"]);             
              xs = d3.scaleBand().domain(statelist).range([0,1300]);
              ys = d3.scaleLinear().domain([0,d3.max(statecases)]).range([200,0]);

              d3.select(".myDivStateChart").select("svg").append("g")
                .attr("transform","translate(50,50)")
                .call(d3.axisLeft(ys));
              d3.select(".myDivStateChart").select("svg").append("g")
                .attr("transform","translate(50,250)")
                .call(d3.axisBottom(xs))
                .selectAll("text") 
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

              d3.select(".myDivStateChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .selectAll('rect')
                //.append("path")
                .data(statecounts)
                .enter()
                .append('rect')
                  .attr('x',function(d,i) {return xs(d.key)})
                  .attr('y',function(d,i) {return ys(d.value)})
                  //.attr('y',function(d,i) {return (100)})
                  .attr('width',xs.bandwidth())
                  .attr('height',function(d) {return (200 - ys(d.value))})
                  .attr('fill', function(d) {return (colorScale(d.value))})
                  .attr('stroke','black');

        })
        .catch(function() {
              console.log(Error)
        });         
}
function countyChart() {

        var marginx = 50;
        var marginy = 100;
        
        //const data = d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
        const data = d3.csv('https://raw.githubusercontent.com/SathishRama/srama.github.io/master/us-counties.csv')
        //const data3 = d3.csv('test_counties.csv')
        
        var default_state = 'Alabama'
        
        .then(function(data){            
              var countycounts = d3.nest()
                  .filter(function(d) {return d.state == default_state})
                  .key(function(d) {return d.county }).sortKeys(d3.ascending)
                  .rollup(function(v) { return d3.max( v, function(d) { return parseInt(d.cases)})})
                  .entries(data3);           
              var countylist = [] ;
              var countycases = [] ;
              var k = 0 ;
              
              statecounts.forEach( function(each) {
                countyist[k] = each.key ;
                countycases[k] = each.value ;
                k++ ;
                //console.log(each.key , each.value);
              });                          
              
              colorScale = d3.scaleLinear().domain([0,d3.max(countycases)]).range(["lightblue","red"]);             
              xs = d3.scaleBand().domain(countylist).range([0,1300]);
              ys = d3.scaleLinear().domain([0,d3.max(countycases)]).range([200,0]);

              d3.select(".myDivStateChart").select("svg").append("g")
                .attr("transform","translate(50,50)")
                .call(d3.axisLeft(ys));
              d3.select(".myDivStateChart").select("svg").append("g")
                .attr("transform","translate(50,250)")
                .call(d3.axisBottom(xs))
                .selectAll("text") 
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

              d3.select(".myDivStateChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .selectAll('rect')
                //.append("path")
                .data(countycounts)
                .enter()
                .append('rect')
                  .attr('x',function(d,i) {return xs(d.key)})
                  .attr('y',function(d,i) {return ys(d.value)})
                  //.attr('y',function(d,i) {return (100)})
                  .attr('width',xs.bandwidth())
                  .attr('height',function(d) {return (200 - ys(d.value))})
                  .attr('fill', function(d) {return (colorScale(d.value))})
                  .attr('stroke','black');

        })
        .catch(function() {
              console.log(Error)
        });         
}