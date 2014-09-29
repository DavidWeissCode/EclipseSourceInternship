tabris.load(function() {

  function drawArc(ctx, x, y, r, radFrom, radTo) {
    ctx.beginPath();
    ctx.arc(x + r, y + r, r, radFrom, radTo);
    ctx.fill();
    ctx.stroke();
  }

  function drawIndicator(ctx, x, y, activeIndex) {
    if( !activeIndex ) {
      ctx.fillStyle = "rgb(250,250,250)";//
    } else {
      ctx.fillStyle = "rgb(180,200,250)";
    }
    drawArc(ctx, x, y, 5, 0, 2*Math.PI);
  }
  //moveTo() ist doch nötig
  function drawIndicatorBar(ctx, x, y, length, activeIndex) {
    for(var i=0; i<length; i++) {
      if( i != activeIndex) {
        drawIndicator(ctx, x, y, false);
      } else {
        drawIndicator(ctx, x, y, true);
      }
      ctx.moveTo(x + 15, y);
      x = x + 15;
    }
  }
  
  var page = tabris.createPage({
    title: "Canvas Test",
    topLevel: true
  });

  var canvas = page.append("Canvas", {
    layoutData: { left: 10, right: 10, top: 10, bottom: 60 },
  });

  var nextButton = page.append("Button", {
    layoutData: { left: [5, 0], right: [5, 0], bottom: 10 },
    text: "Next"
  }).on("Selection", function() {
    if (activeIndex < 9) {
      activeIndex++;
      drawIndicatorBar(ctx, 230, 400, 10, activeIndex);
    } else {
      activeIndex = 0;
      drawIndicatorBar(ctx, 230, 400, 10, activeIndex);
    }
  });
  
  var ctx = tabris.getContext(canvas, 800, 800);

  var activeIndex = 0;

  drawIndicatorBar(ctx, 230, 400, 10, 0);
 
  page.open();

});
