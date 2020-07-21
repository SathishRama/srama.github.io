
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
