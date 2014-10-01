tabris.load(function() {

  function manipulate() {
    var testNumber = numberLabel.get("text");
    manipulatedNumberLabel.set("text", numeral(testNumber).format('0,0.0000') + "\n" + "\n" +
                                       numeral(testNumber).format('0,0') + "\n" + "\n" +
                                       numeral(testNumber).format('0a') + "\n" + "\n" +
                                       numeral(testNumber).format('0o') + "\n" + "\n" +
                                       numeral(testNumber).format('0,0[.]00 $')
    );
  }

  var page = tabris.createPage({
    title: "Using the numeral.js library",
    topLevel: true
  });

  var numberLabel = page.append("Label", {
    layoutData: { left: 0, right: 0, top: [10, 0], bottom: [55, 0] },
    text: "10000.1234",
    font: [["arial"], 25, true, false],
    alignment: "center"
  });

  var manipulateButton = page.append("Button", {
    layoutData: { left: [40, 0], right: [40, 0], top: [45, 0], bottom: [45, 0] },
    text: "Click me!",
    font: [["arial"], 25, true, false]
  }).on("Selection", function() {
      manipulate();
  });

  var manipulatedNumberLabel = page.append("Label", {
    layoutData: { left: 0, right: 0, top: [60, 0], bottom: 0 },
    text: "",
    font: [["arial"], 25, true, false],
    alignment: "center"
  });

  page.open();

});
