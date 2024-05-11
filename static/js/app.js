// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata=data.metadata;
    console.log("Metadata:", metadata);

    // Filter the metadata for the object with the desired sample number
    var filteredMeta=metadata.filter(obj => obj.id == parseInt(sample))[0];
    console.log("Filtered Metadata:", filteredMeta);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel=d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(filteredMeta).forEach(([key, value]) => {
      panel.append("h5").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

console.log(buildMetadata);

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples=data.samples;
    console.log("Samples:", samples);

    // Filter the samples for the object with the desired sample number
    var filteredSamples = samples.filter(obj => obj.id === sample)[0];
    console.log("Filtered Samples:", filteredSamples);

    // Get the otu_ids, otu_labels, and sample_values
    var otuIds = filteredSamples.otu_ids;
    var otuLabels = filteredSamples.otu_labels;
    var sampleValues = filteredSamples.sample_values;

    // Build a Bubble Chart
    var bubbleTrace = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'Portland'
      }
    };
    console.log("Bubble Trace:", bubbleTrace);

    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' },
      hovermode: 'closest'
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleTrace], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otuIds.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var barTrace = {
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: otuLabels.slice(0, 10).reverse(),
    };
    console.log("Bar Trace:", barTrace);
  
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' }
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barTrace], barLayout);
  });
}

console.log(buildCharts);

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;
    console.log("Names:", names);

    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach(name => {
      dropdown.append("option")
        .attr("value", name)
        .text(name);
    });

    // Get the first sample from the list
    var firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
