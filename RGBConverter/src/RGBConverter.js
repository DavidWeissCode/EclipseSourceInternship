function RGBConverter() {
}

RGBConverter.prototype.arrayToRGBString = function( rgbArray ) {
  if( rgbArray[0] < 0 || rgbArray[0] > 255 ||
      rgbArray[1] < 0 || rgbArray[1] > 255 ||
      rgbArray[2] < 0 || rgbArray[2] > 255 ){
    throw new Error("RGB values must be within [0,255]");
  }
  return "rgb(" + rgbArray[0] + ", " + rgbArray[1] + ", " + rgbArray[2] + ")";
};

RGBConverter.prototype.rgbStringToArray = function( rgbString ) {
  var rgbArray = [];
  var regex = /^rgb\(\s*([0]|[1-9]\d?|[1]\d{2}|2([0-4]\d|5[0-5]))\s*,\s*([0]|[1-9]\d?|[1]\d{2}|2([0-4]\d|5[0-5]))\s*,\s*([0]|[1-9]\d?|[1]\d{2}|2([0-4]\d|5[0-5]))\s*\)$/;
  
  if( !rgbString.match(regex) ) {
    throw new Error("This is not a valid rgb() string pattern");
  }
  var rString = rgbString.replace(regex, "$1");
  var gString = rgbString.replace(regex, "$3");
  var bString = rgbString.replace(regex, "$5");

  rgbArray[0] = parseInt(rString);
  rgbArray[1] = parseInt(gString);
  rgbArray[2] = parseInt(bString);

  return rgbArray;
};
