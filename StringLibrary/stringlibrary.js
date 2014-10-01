tabris.load(function() {

  function manipulate() {
    var testString = textLabel.get("text");
    manipulatedTextLabel.set("text", S(testString).left(5).s + "\n" + "\n" +
                                     S(testString).right(13) + "\n" + "\n" +
                                     "it contains 'do' " + S(testString).contains("do") + "\n" + "\n" +
                                     "is numeric " + S(testString).isNumeric() + "\n" + "\n" +
                                     "it contains 'o' " + S(testString).count("o") + " times"
    );
  }

  var page = tabris.createPage({
    title: "Using the string.js library",
    topLevel: true
  });

  var textLabel = page.append("Label", {
    layoutData: { left: 0, right: 0, top: [10, 0], bottom: [55, 0] },
    text: "Let's do some string manipulation!",
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

  var manipulatedTextLabel = page.append("Label", {
    layoutData: { left: 0, right: 0, top: [60, 0], bottom: 0 },
    text: "",
    font: [["arial"], 25, true, false],
    alignment: "center"
  });

  page.open();

});
