// Dummy data for illustration purposes
const dummyData = [
    { name: "Sample 1", value: "This is a sample JSON object." },
    { name: "Sample 2", value: "This is another sample JSON object." }
    // ... you can add more sample data or fetch it from a database
  ];
  
  exports.chase = (req, res) => {
      res.render('testing/chase', { jsonData: dummyData });
  };
  
  exports.greg = (req, res) => {
      res.render('testing/greg', { jsonData: dummyData });
  };
  
  exports.jakob = (req, res) => {
      res.render('testing/jakob', { jsonData: dummyData });
  };  

  exports.lauren = (req, res) => {
      res.render('testing/lauren', { jsonData: dummyData });
  };
  
  exports.mustafa = (req, res) => {
      res.render('testing/mustafa', { jsonData: dummyData });
  };
  
  exports.fiona = (req, res) => {
      res.render('testing/fiona', { jsonData: dummyData });
  };
  