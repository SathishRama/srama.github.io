
//const data2 = d3.csv('https://raw.githubusercontent.com/SathishRama/srama.github.io/master/test_covid.csv')
var default_msg = 'Click on one of the above trend buttons or select a state from dropdown';

function dailyChart() {

       var from_dt_sel = document.getElementById('fromdate').value
       var to_dt_sel = document.getElementById('todate').value  
       var formatTime = d3.timeFormat("%Y-%m-%d");

       if (from_dt_sel == '' | document.getElementById('fromdate').value < '2020-03-07' ) {
                from_dt_sel = formatTime(Date.parse('2020-03-08'))
                document.getElementById('fromdate').value = from_dt_sel                 
              };
        if (to_dt_sel == '') {
                to_dt_sel = formatTime(Date.parse('2020-12-31'))
              } 

       console.log("from dailyChart - dates selected : " , from_dt_sel , to_dt_sel)
       document.getElementById('charttitle').innerHTML = 'US Daily New Cases Trend'; 
       document.getElementById('charttitle').style.color='blue';
       document.getElementById('myform').style.opacity = 1;
       document.getElementById('charttrendlabel').style.opacity = 1;
       document.getElementById('charttrendtext').style.opacity = 1;

       document.getElementById('chartnavlabel').style.opacity = 1;
       document.getElementById('chartnavtext').style.opacity = 1;
       document.getElementById('chartnavtext1').style.opacity = 1;
       document.getElementById('chartnavtext2').style.opacity = 1;
       document.getElementById('chartnavtext').innerHTML =  " 1.To see trend for a date range, select the From & To dates on top right "; 
       document.getElementById('chartnavtext1').innerHTML =  " 2.To see State Wise trend chart , select the Statewise Button on the top "; 
       document.getElementById('chartnavtext2').innerHTML =  " 3.To see County Wise trend chart of a State, select the State from drop down"; 
       
       d3.select("#myChart").selectAll("svg").remove();
       d3.select("#myChart").append("svg").attr("height",360).attr("width",1400);

       const data2 = d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv')
        .then(function(data2){
              
              var dateRange = [];
              var newcaseRange = [];
              var k = 0 ;
              
              
              var dateCounts = d3.nest()
                  .key(function(d) { return Date.parse(d.date)})
                  .rollup(function(v) {return d3.sum(v,function(d) {return d.cases})})
                  .entries(data2);
                

              
  
              dateCounts = dateCounts.filter(function(d) {
                return ( d.key >= Date.parse(from_dt_sel) & d.key <= Date.parse(to_dt_sel)) 
              })
                            

              var newCases = d3.entries(dateCounts);                                          
              dateCounts.forEach(function(each) {                
                //caseRange[k] = each.value                
                if (k > 0) {
                    newCases[k-1].value = each.value - dateCounts[k-1].value ;
                    newcaseRange[k-1] = newCases[k-1].value ;
                    dateRange[k-1] = each.key
                    //console.log(" After else block " , formatTime(each.key) , each.value , newCases[k-1].value)
                }                
                
                k++;
              });  
              
              topday = newCases.filter(function(d) {return ( d.value == d3.max(newcaseRange)) }) ;
              topdate =  dateRange[topday[0].key]
              topcount = topday[0].value
              msg = "Top # of cases "+topcount+"are reported on "+formatTime(topdate) ;
              
              document.getElementById('charttrendtext').innerHTML =  msg ; 

              console.log(" Top value : " ,formatTime(dateRange[topday[0].key]), topday[0].value , msg)              

              var min_date = formatTime(d3.min(dateRange));
              var max_date = formatTime(d3.max(dateRange));
              
              console.log("Date Ranges " , min_date , max_date , newCases[0].key , newCases[0].value);

              document.getElementById('fromdate').value = min_date
              document.getElementById('todate').value = max_date          
                            
              xs = d3.scaleBand().domain(dateRange).range([0,1300]);
              ys = d3.scaleLinear().domain([0,d3.max(newcaseRange)]).range([200,0]);

              //==Annotations
              console.log("...begining anno..")              

              console.log("...ending anno..")
              //==Annotations


              d3.select("#myChart").select("svg").append("g")
                .attr("transform","translate(50,50)")
                .attr('class', 'y axis-grid')
                .call(d3.axisLeft(ys));
              
              d3.select("#myChart").select("svg").append("g")
                .attr("transform","translate(50,250)")
                .attr('class', 'x axis-grid')
                .call(d3.axisBottom(xs)
                       .tickFormat(d3.timeFormat("%m.%d"))
                       //.tickFormat(d3.timeFormat("%m"))
                       .tickSize(2, 0)
                       //.ticks(5)
                      //.tickFormat(d3.timeFormat("%m"))
                       
                        
                  )
                .selectAll("text") 
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")         
                .datum(newCases)              
                .append("path")                                      
                .attr("d",d3.line()
                            .x(function(d,i) {return xs(dateRange[d.key])})
                            .y(function(d,i) {return ys(d.value) })
                            
                    )
                  .attr('fill','none')
                  .attr('stroke-width',2)
                  .attr('stroke','MidnightBlue');

              // Annotations logic
              topday.forEach ( function(each) {
                console.log (" topday value : " , formatTime(dateRange[each.key]) , each.value)
                console.log (" x pos : " , xs(dateRange[each.key]))
                console.log (" y pos : " , ys(each.value))
              });

              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")                         
                .selectAll("circle")
                .data(topday)
                .enter()
                .append("circle")           
                .attr("cx",function(d,i) {return xs(dateRange[d.key])})
                .attr("cy",function(d,i) {return ys(d.value)})
                .attr("r",5)
                .attr("fill","none")
                .attr("stroke","red");
                
              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .selectAll("text")
                .data(topday)
                .enter()
                .append("text")           
                  .attr('x',function(d,i) {return xs(dateRange[d.key]) - 200 })
                  .attr('y',function(d,i) {return ys(d.value)})                
                  .attr("font-size", "1em")
                  .style("fill", "red")
                  .text(function(d){ return "Highest cases "+d.value+" in a day"});
              
              // Annotations logic END

        })
        .catch(function() {
              console.log(Error)
        });
    return true;
}

function stateChart() {

        document.getElementById('charttitle').innerHTML = 'US State-wise Total Cases'; 
        document.getElementById('charttitle').style.color='blue';
        document.getElementById('myform').style.opacity = 0;
        
        document.getElementById('charttrendlabel').style.opacity = 1;
        document.getElementById('charttrendtext').style.opacity = 1;      

       document.getElementById('chartnavlabel').style.opacity = 1;
       document.getElementById('chartnavtext').style.opacity = 1;
       document.getElementById('chartnavtext1').style.opacity = 1;
       document.getElementById('chartnavtext2').style.opacity = 1;
       document.getElementById('chartnavtext').innerHTML =  " 1.Hover mouse over a state bar to see exact count of cases "; 
       document.getElementById('chartnavtext1').innerHTML =  " 2.To see County Wise trend chart of a State, select the State from drop down"; 
       document.getElementById('chartnavtext2').innerHTML =  " 3.To see Daily Trend Chart, select the Daily Trend Button on the top "; 
        

       d3.select("#myChart").selectAll("svg").remove();
       d3.select("#myChart").append("svg").attr("height",360).attr("width",1400);
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
              
              colorScale = d3.scaleLinear().domain([0,d3.max(statecases)]).range(["green","red"]);             
              xs = d3.scaleBand().domain(statelist).range([0,1300]);
              ys = d3.scaleLinear().domain([0,d3.max(statecases)]).range([200,0]);              

              //==Annotations
              topstate = statecounts.filter(function(d) {return ( d.value == d3.max(statecases)) }) ;
              topstatename = topstate[0].key
              topstatecount = topstate[0].value
              console.log( "Top State " , topstatename, topstatecount )
              msg =  topstatename+" is the state with highest # of cases "+topstatecount;
              document.getElementById('charttrendtext').innerHTML =  msg ;
             
                            
              //console.log("...ending anno..")
              //==Annotations         

              d3.select("#myChart").select("svg").append("g")
                .attr("transform","translate(50,50)")
                .call(d3.axisLeft(ys));
              d3.select("#myChart").select("svg").append("g")
                .attr("transform","translate(50,250)")
                .call(d3.axisBottom(xs))
                .selectAll("text") 
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

              var tooltip = d3.select("#tooltip")
              
              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .selectAll('rect')
                //.append("path")
                .data(statecounts)
                .enter()
                .append('rect')
                .on("mouseover", function(d) {   
                  console.log(d3.event.pageX,d3.event.pageY)
                  tooltip.style("opacity",1)
                  .style("left",(d3.event.pageX)+"px")
                  .style("top",(d3.event.pageY)+"px")                 
                  .html(d.key+":"+d.value);
                  d3.select(this)
                  .attr('stroke','blue');
                })
                .on("mouseout", function(d) {       
                  d3.select(this)
                  .attr('stroke','black');
                  tooltip.style("opacity",0);
                })
                .attr('x',function(d,i) {return xs(d.key)})
                .attr('y',function(d,i) {return 190})
                .attr('width',xs.bandwidth())
                .attr('height',function(d) {return (10)})
                .attr('fill', function(d) {return (colorScale(d.value))})
                .attr('stroke','black')
                .transition().duration(2000)
                .attr('y',function(d,i) {return ys(d.value)})
                .attr('height',function(d) {return (200 - ys(d.value))});
        
              
              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")                         
                .selectAll("circle")
                .data(topstate)
                .enter()
                .append("circle")           
                .attr("cx",function(d,i) {return xs(d.key) + 10})
                .attr("cy",function(d,i) {return ys(d.value)})
                .attr("r",5)
                .attr("fill","black")
                .attr("stroke","black");

              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .selectAll("text")
                .data(topstate)
                .enter()
                .append("text")           
                  .attr('x',function(d,i) {return xs(d.key) + 20})
                  .attr('y',function(d,i) {return ys(d.value) - 10 })                
                  .attr("font-size", "1em")
                  .style("fill", "black")
                  .text(function(d){ return d.key+ " is the state with highest cases : "+d.value});


        })
        .catch(function() {
              console.log(Error)
        });    
    return true;     
}
function countyChart() {      

       console.log(" Enterred - countyChart ");
       var selected_state = document.getElementById("state").value;       
       d3.select("#myChart").selectAll("svg").remove();
       d3.select("#myChart").append("svg").attr("height",360).attr("width",1400);
       
       console.log(" Select State " , selected_state);
       
       document.getElementById('myform').style.opacity = 0;
       document.getElementById('charttrendlabel').style.opacity = 1;
       document.getElementById('charttrendtext').style.opacity = 1;  

       document.getElementById('chartnavlabel').style.opacity = 1;
       document.getElementById('chartnavtext').style.opacity = 1;
       document.getElementById('chartnavtext1').style.opacity = 1;
       document.getElementById('chartnavtext2').style.opacity = 1;
       document.getElementById('chartnavtext').innerHTML =  " 1.Hover mouse over a bar to see exact count of cases "; 
       document.getElementById('chartnavtext1').innerHTML =  " 2.To see Daily Trend Chart, select the Daily Trend Button on the top ";      
       document.getElementById('chartnavtext2').innerHTML =  " 3.To see State Wise trend chart , select the Statewise Button on the top "; 
       

       if (selected_state == '') {
          document.getElementById('charttitle').innerHTML = default_msg ;
          document.getElementById('charttitle').style.color='red';
          //document.getElementById('myform').style.opacity = 0;
          document.getElementById('charttrendlabel').style.opacity = 0;
          document.getElementById('charttrendtext').style.opacity = 0;
       }
       else {
          document.getElementById('charttitle').innerHTML = selected_state+" : "+'Total cases  by county';
          document.getElementById('charttitle').style.color='blue';   
          //document.getElementById('myform').style.opacity = 1;      
         
          var marginx = 50;
          var marginy = 100;
          //var default_state = 'Alabama' ;
          const data = d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
          //const data3 = d3.csv('https://raw.githubusercontent.com/SathishRama/srama.github.io/master/test_counties.csv')        
          .then(function(data3){    

                data3 =  data3.filter(function (d) {return d.state == selected_state})
                console.log( " min max dates : " , Math.min(data3.date), Math.max(data3.date))

                var countycounts = d3.nest()
                    .key(function(d) {return d.county }).sortKeys(d3.ascending)
                    .rollup(function(v) { return d3.max( v, function(d) { return parseInt(d.cases)})})
                    .entries(data3);                               

                var countylist = [] ;
                var countycases = [] ;
                var k = 0 ;
                
                countycounts.forEach( function(each) {
                  countylist[k] = each.key ;
                  countycases[k] = each.value ;
                  k++ ;
                  //console.log(each.key , each.value);
                });    

                colorScale = d3.scaleLinear().domain([0,d3.max(countycases)]).range(["green","red"]);             
                xs = d3.scaleBand().domain(countylist).range([0,1300]);
                ys = d3.scaleLinear().domain([0,d3.max(countycases)]).range([200,0]);

                //==Annotations
                topcounty = countycounts.filter(function(d) {return ( d.value == d3.max(countycases)) }) ;
                topcountyname = topcounty[0].key
                topcountycount = topcounty[0].value
                console.log( "Top County " , topcountyname, topcountycount )
                msg =  topcountyname+" county is reporting highest # of cases "+topcountycount;
                document.getElementById('charttrendtext').innerHTML =  msg ;
                               
                console.log("...midle of anno..")

              //==Annotations         

                d3.select("#myChart").select("svg").append("g")
                  .attr("transform","translate(50,50)")
                  .call(d3.axisLeft(ys));
                d3.select("#myChart").select("svg").append("g")
                  .attr("transform","translate(50,250)")
                  .call(d3.axisBottom(xs))
                  .selectAll("text") 
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");

                var tooltip = d3.select("#tooltip")

                d3.select("#myChart").select("svg")
                  .append('g').attr("transform","translate(50,50)")
                  .selectAll('rect')
                  //.append("path")
                  .data(countycounts)
                  .enter()
                  .append('rect')
                  .on("mouseover", function(d) {   
                        console.log(d3.event.pageX,d3.event.pageY)
                        tooltip.style("opacity",1)
                        .style("left",(d3.event.pageX)+"px")
                        .style("top",(d3.event.pageY)+"px")                 
                        .html(d.key+":"+d.value);
                        d3.select(this)
                        .attr('stroke','blue');
                      })
                      .on("mouseout", function(d) {       
                        d3.select(this)
                        .attr('stroke','black');
                        tooltip.style("opacity",0);
                      })              
                  .attr('x',function(d,i) {return xs(d.key)})
                  .attr('y',function(d,i) {return 190})
                  //.attr('y',function(d,i) {return (100)})
                  .attr('width',xs.bandwidth())
                  .attr('height',function(d) {return (10)})
                  .attr('fill', function(d) {return (colorScale(d.value))})
                  .attr('stroke','black')
                  .transition().duration(2000)
                  .attr('y',function(d,i) {return ys(d.value)})
                  .attr('height',function(d) {return (200 - ys(d.value))});

              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")                         
                .selectAll("circle")
                .data(topcounty)
                .enter()
                .append("circle")           
                .attr("cx",function(d,i) {return xs(d.key) + 10})
                .attr("cy",function(d,i) {return ys(d.value)})
                .attr("r",5)
                .attr("fill","black")
                .attr("stroke","black");

              d3.select("#myChart").select("svg")
                .append('g').attr("transform","translate(50,50)")
                .selectAll("text")
                .data(topcounty)
                .enter()
                .append("text")           
                  .attr('x',function(d,i) {return xs(d.key) + 20})
                  .attr('y',function(d,i) {return ys(d.value) - 10 })                
                  .attr("font-size", "1em")
                  .style("fill", "black")
                  .text(function(d){ return d.key+" is the county with highest cases : "+d.value});

          })
          .catch(function() {
              console.log(Error)
          })       
      }
}
