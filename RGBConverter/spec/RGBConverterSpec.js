describe("RGBConverter", function() {
  var rgbconverter;

  beforeEach(function() {
    rgbconverter = new RGBConverter();
  });

  it("should convert a rgbString to a rgbArray", function() {
    expect(rgbconverter.rgbStringToArray("rgb(5,23,147)")).toEqual([5,23,147]);
  });

  it("should convert a rgbArray to a rgbString", function() {
    expect(rgbconverter.arrayToRGBString([5,23,147])).toBe("rgb(5, 23, 147)");
  });

  it("should throw an exception if the string parameter is not a valid RGB value", function() {
    expect(function() {
      rgbconverter.rgbStringToArray("rgb(256,0,-5)");
    }).toThrowError("This is not a valid rgb() string pattern");
  });

  it("should throw an exception if the array parameter is not a valid RGB value", function() {
    expect(function() {
      rgbconverter.arrayToRGBString([-1,0,256]);
    }).toThrowError("RGB values must be within [0,255]");
  });

});
