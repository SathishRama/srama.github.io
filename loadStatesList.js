console.log(" Loading States")

const data = d3.csv('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv')
    //const data3 = d3.csv('https://raw.githubusercontent.com/SathishRama/srama.github.io/master/test_counties.csv')        
    .then(function(data3){              

        var statenames = d3.nest()
            .key(function(d) {return d.state }).sortKeys(d3.ascending)
            .entries(data3);   
        var newState = [];
       
        for (i=0;i < statenames.length ; i++) {
            newState[i] = document.createElement('option');
            newState[i].innerHTML = statenames[i].key;  
            document.getElementById("state").add(newState[i]);
            //console.log("Added state : " ,  statenames[i].key)
          }                                        
    })
    .catch(function() {
        console.log(Error)
    })         
//Register chang event
const selectElement = document.querySelector("#state");
selectElement.addEventListener('change', (event) => {
  console.log("Detect change in state selection ")
  countyChart();
});

function fromdatechange() {
    
  console.log(" From date selected")

}


  
