function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    filteredSamples = samplesArray.filter(number => number.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSamp = filteredSamples[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSamp.otu_ids;

    var otu_labels = firstSamp.otu_labels;

    var sample_values = firstSamp.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    console.log(otu_ids);
    console.log(sample_values)
    var yticks = otu_ids.slice(0,10).map(name => name = `OTU ${name}`);
   
    
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sample_values,
      y: yticks,
      text: otu_labels,
      type: "bar",
      orientation: 'h',
      marker: {
        color: "rgb(74, 74, 187)"
      }
    };
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        autorange:'reversed'
      },
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: {
        family: 'Helvetica, neue',
        color: '#FFFFFF'
      }
      
    };
    
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
    // 1. Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        mode: 'markers',
        text: otu_labels,
        marker: {
          colorscale: 'Blues',
          size: sample_values,
          color: otu_ids
          // colorscale:
        }
      }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: {
        family: 'Helvetica, neue',
        color: '#FFFFFF'
      }
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout); 


    // 3. Create a variable that holds the washing frequency.
    let metadata = data.metadata;
    var filteredMetadata = metadata.filter(id => id.id == sample);
    let firstSample = filteredMetadata[0];
    let wFreq = firstSample.wfreq;
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: wFreq,
      title: {text: "<b>Belly Button Washing Frequency</b> <br>Scrubs per week</br>"},
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [0, 10], dtick: 2},
        bar: {color: "rgb(93, 95, 100)"},
        steps: [
          {range: [0,2], color:"red"},
          {range: [2,4], color:"orange"},
          {range: [4,6], color:"yellow"},
          {range: [6,8], color:"limegreen"},
          {range: [8,10], color:"green"},
        ]
      }
    }
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: {
        family: 'Helvetica, neue',
        color: '#FFFFFF'
        
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });

}
