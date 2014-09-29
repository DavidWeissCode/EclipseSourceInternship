/*!
 * tabris.js 2014-08-11
 *
 * Copyright (c) 2014 EclipseSource.
 * All rights reserved.
 */
/*global util: true */

util = {

  extend: function( target ) {
    for( var i = 1; i < arguments.length; i++ ) {
      var source = arguments[i];
      for( var name in source ) {
        target[name] = source[name];
      }
    }
    return target;
  },

  pick: function( object, keys ) {
    var result = {};
    for( var key in object ) {
      if( keys.indexOf( key ) !== -1 ) {
        result[key] = object[key];
      }
    }
    return result;
  },

  omit: function( object, keys ) {
    var result = {};
    for( var key in object ) {
      if( keys.indexOf( key ) === -1 ) {
        result[key] = object[key];
      }
    }
    return result;
  },

  bind: function( fn, context ) {
    return function() {
      return fn.apply( context, arguments );
    };
  },

  extendPrototype : function( fn, target ) {
    var Helper = function(){};
    Helper.prototype = fn.prototype;
    return util.extend( new Helper(), target );
  }

};

(function() {

  util.colorArrayToString = function(array) {
    var r = array[0];
    var g = array[1];
    var b = array[2];
    var a = array.length === 3 ? 1 : Math.round(array[3] * 100 / 255) / 100;
    return "rgba(" + r + ', ' + g + ', ' + b + ', ' + a + ')';
  };

  util.colorStringToArray = function(str) {
    // #xxxxxx
    if (/^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/.test(str)) {
      return [
        parseInt(RegExp.$1, 16),
        parseInt(RegExp.$2, 16),
        parseInt(RegExp.$3, 16),
        255
      ];
    }
    // #xxx
    if (/^#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/.test(str)) {
      return [
        parseInt(RegExp.$1, 16) * 17,
        parseInt(RegExp.$2, 16) * 17,
        parseInt(RegExp.$3, 16) * 17,
        255
      ];
    }
    // #rgb(r, g, b)
    if (/^rgb\s*\(\s*([+\-]?[0-9]+)\s*,\s*([+\-]?[0-9]+)\s*,\s*([+\-]?[0-9]+)\s*\)$/.test(str)) {
      return [
        Math.max(0, Math.min(255, parseInt(RegExp.$1))),
        Math.max(0, Math.min(255, parseInt(RegExp.$2))),
        Math.max(0, Math.min(255, parseInt(RegExp.$3))),
        255
      ];
    }
    // rgba(r, g, b, a)
    if (/^rgba\s*\(\s*([+\-]?[0-9]+)\s*,\s*([+\-]?[0-9]+)\s*,\s*([+\-]?[0-9]+)\s*,\s*([+\-]?([0-9]*\.)?[0-9]+)\s*\)$/.test(str))
    {
      return [
        Math.max(0, Math.min(255, parseInt(RegExp.$1))),
        Math.max(0, Math.min(255, parseInt(RegExp.$2))),
        Math.max(0, Math.min(255, parseInt(RegExp.$3))),
        Math.round(Math.max(0, Math.min(1, parseFloat(RegExp.$4))) * 255)
      ];
    }
    // named colors
    if (str in NAMES) {
      var rgb = NAMES[str];
      return [rgb[0], rgb[1], rgb[2], 255];
    }
    throw new Error("invalid color");
  };

  /*
   * Basic color keywords as defined in CSS 3
   * See http://www.w3.org/TR/css3-color/#html4
   */
  var NAMES = {
    black : [0, 0, 0],
    silver : [192, 192, 192],
    gray : [128, 128, 128],
    white : [255, 255, 255],
    maroon : [128, 0, 0],
    red : [255, 0, 0],
    purple : [128, 0, 128],
    fuchsia : [255, 0, 255],
    green : [0, 128, 0],
    lime : [0, 255, 0],
    olive : [128, 128, 0],
    yellow : [255, 255, 0],
    navy : [0, 0, 128],
    blue : [0, 0, 255],
    teal : [0, 128, 128],
    aqua : [0, 255, 255]
  };

})();

/*global tabris: true */

(function() {

  tabris = util.extend( function( id ) {
    return id in tabris._proxies ? tabris._proxies[ id ] : new tabris.Proxy( id );
  }, {

    _loadFunctions: [],
    _proxies: {},

    load: function( fn ) {
      tabris._loadFunctions.push( fn );
    },

    create: function( type, properties ) {
      if( !tabris._nativeBridge ) {
        throw new Error( "tabris.js not started" );
      }
      var id = generateId();
      return tabris.Proxy.create( id, type, properties );
    },

    _start: function( nativeBridge ) {
      tabris._nativeBridge = nativeBridge;
      var i = 0;
      while( i < tabris._loadFunctions.length ) {
        tabris._loadFunctions[i++].call();
      }
    },

    _notify: function( id, event, param ) {
      var proxy = tabris._proxies[ id ];
      if( proxy ) {
        proxy._notifyListeners( event, [param] );
      }
    },

    _reset: function() {
      this._loadFunctions = [];
      this._proxies = {};
    }

  });

  var idSequence = 1;

  var generateId = function() {
    return "o" + ( idSequence++ );
  };

})();

/*global window: true*/

tabris.Window = function() {
};

tabris.Window.create = function() {

  var wnd = new tabris.Window();
  var taskSequence = 0;
  var timers = {};

  function createTimer( fn, delay, repeat ) {
    var taskId = taskSequence++;
    var timer = tabris.create( "tabris.Timer", {
      delay : delay,
      repeat: repeat
    }).on( "Run", function() {
      fn.call();
      if( !repeat ) {
        timer.dispose();
        delete timers[taskId];
      }
    }).call( "start" );
    timers[taskId] = timer;
    return taskId;
  }

  wnd.setTimeout = function( fn, delay ) {
    return createTimer( fn, delay, false );
  };

  wnd.setInterval = function( fn, delay ) {
    return createTimer( fn, delay, true );
  };

  wnd.clearTimeout = wnd.clearInterval = function( taskId ) {
    var timer = timers[taskId];
    if( timer ) {
      timer.call( "cancel", {});
      timer.dispose();
      delete timers[taskId];
    }
  };

  return wnd;
};

if( typeof window === "undefined" ) {
  window = tabris.Window.create();
  window.tabris = tabris;
}

/*global console: true */

tabris.Console = function() {
  var console = this;
  ["log", "info", "warn", "error"].forEach(function(name) {
    console[name] = function() {
      var args = Array.prototype.slice.call(arguments, 0);
      tabris._nativeBridge.call("tabris.Console", name, {args: args});
    };
  });
};

// TODO [rst] when window is the global object, should we use window.console instead?
if(typeof console === "undefined") {
  console = new tabris.Console();
}

(function() {

  tabris.Proxy = function( id ) {
    this.id = id;
    tabris._proxies[id] = this;
  };

  tabris.Proxy.create = function( id, type, properties ) {
    var proxy = new tabris.Proxy( id );
    var factory = tabris.Proxy._factories[type in tabris.Proxy._factories ? type : "default"];
    return factory( proxy, type, properties );
  };

  tabris.Proxy._factories = {
    "Button": function( proxy, type, properties ) {
      return proxy._create( "rwt.widgets.Button", util.extend( { style: ["PUSH"] }, properties ));
    },
    "CheckBox": function( proxy, type, properties ) {
      return proxy._create( "rwt.widgets.Button", util.extend( { style: ["CHECK"] }, properties ));
    },
    "RadioButton": function( proxy, type, properties ) {
      return proxy._create( "rwt.widgets.Button", util.extend( { style: ["RADIO"] }, properties ));
    },
    "ToggleButton": function( proxy, type, properties ) {
      return proxy._create( "rwt.widgets.Button", util.extend( { style: ["TOGGLE"] }, properties ));
    },
    "Text": function( proxy, type, properties ) {
      var style = textTypeToStyle[ properties.type ] || textTypeToStyle[ "default" ];
      return proxy._create( "rwt.widgets.Text", util.extend( { style: style }, properties ));
    },
    "default": function( proxy, type, properties ) {
      return proxy._create( type, properties );
    }
  };

  tabris.Proxy.prototype = {

    _create: function( type, properties ) {
      if( properties && properties.parent ) {
        this._parent = properties.parent;
        this._parent._addChild( this );
      }
      tabris._nativeBridge.create( this.id, encodeType( type ), encodeProperties( properties ) );
      return this;
    },

    append: function( type, properties ) {
      this._checkDisposed();
      return tabris.create( type, util.extend( {}, properties, { parent: this } ) );
    },

    get: function( name ) {
      this._checkDisposed();
      return decodeProperty( name, tabris._nativeBridge.get( this.id, name ) );
    },

    set: function( arg1, arg2 ) {
      this._checkDisposed();
      var properties;
      if( typeof arg1 === "string" ) {
        properties = {};
        properties[arg1] = arg2;
      } else {
        properties = arg1;
      }
      tabris._nativeBridge.set( this.id, encodeProperties( properties ) );
      return this;
    },

    call: function( method, parameters ) {
      this._checkDisposed();
      tabris._nativeBridge.call( this.id, method, parameters );
      return this;
    },

    on: function( event, listener ) {
      this._checkDisposed();
      if( this._addListener( event, listener ) ) {
        tabris._nativeBridge.listen( this.id, event, true );
      }
      return this;
    },

    off: function( event, listener ) {
      this._checkDisposed();
      if( this._removeListener( event, listener ) ) {
        tabris._nativeBridge.listen( this.id, event, false );
      }
      return this;
    },

    dispose: function() {
      if( !this._isDisposed ) {
        tabris._nativeBridge.destroy( this.id );
        this._destroy();
        if( this._parent ) {
          this._parent._removeChild( this );
        }
        this._isDisposed = true;
      }
    },

    _destroy: function() {
      if( this._children ) {
        for( var i = 0; i < this._children.length; i++ ) {
          this._children[i]._destroy();
        }
      }
      this._notifyListeners( "Dispose", [{}] );
      this._listeners = null;
      delete tabris._proxies[this.id];
    },

    _addListener: function( event, listener ) {
      if( !this._listeners ) {
        this._listeners = [];
      }
      if( !( event in this._listeners ) ) {
        this._listeners[ event ] = [];
      }
      this._listeners[ event ].push( listener );
      return this._listeners[ event ].length === 1;
    },

    _removeListener: function( event, listener ) {
      if( this._listeners && event in this._listeners ) {
        var index = this._listeners[ event ].indexOf( listener );
        if( index !== -1 ) {
          this._listeners[ event ].splice( index, 1 );
          return this._listeners[ event ].length === 0;
        }
      }
      return false;
    },

    _notifyListeners: function( event, args ) {
      if( this._listeners && event in this._listeners ) {
        var listeners = this._listeners[event];
        for( var i = 0; i < listeners.length; i++ ) {
          listeners[i].apply( this, args );
        }
      }
    },

    _addChild: function( child ) {
      if( !this._children ) {
        this._children = [];
      }
      this._children.push( child );
    },

    _removeChild: function( child ) {
      if( this._children ) {
        var index = this._children.indexOf( child );
        if( index !== -1 ) {
          this._children.splice( index, 1 );
        }
      }
    },

    _checkDisposed: function() {
      if( this._isDisposed ) {
        throw new Error( "Object is disposed" );
      }
    }

  };

  function encodeProperties( properties ) {
    var result = {};
    for( var key in properties ) {
      result[key] = encodeProperty( key, properties[key] );
    }
    return result;
  }

  function encodeProperty( name, value ) {
    if( name === "foreground" || name === "background" ) {
      return encodeColor( value );
    } else if( name === "layoutData" ) {
      return encodeLayoutData( value );
    } else if( name === "rowTemplate" ) {
      return encodeRowTemplate( value );
    }
    return encodeProxyToId( value );
  }

  function encodeColor( value ) {
    return util.colorStringToArray( value );
  }

  function encodeRowTemplate( template ) {
    return template.map( encodeTemplateCell );
  }

  function encodeTemplateCell( cell ) {
    var result = {};
    for( var key in cell ) {
      if( key === "foreground" || key === "background" ) {
        result[key] = encodeColor( cell[key] );
      } else {
        result[key] = cell[key];
      }
    }
    return result;
  }

  function encodeLayoutData( layoutData ) {
    var result = {};
    for( var key in layoutData ) {
      if( Array.isArray( layoutData[key] ) ) {
        result[key] = layoutData[key].map( encodeProxyToId );
      } else {
        result[key] = encodeProxyToId( layoutData[key] );
      }
    }
    return result;
  }

  function encodeProxyToId( value ) {
    return value instanceof tabris.Proxy ? value.id : value;
  }

  function encodeType( type ) {
    if( type.indexOf( '.' ) === -1 ) {
      return "rwt.widgets." + type;
    }
    return type;
  }

  function decodeProperty( name, value ) {
    if( name === "foreground" || name === "background" ) {
      return decodeColor( value );
    }
    return value;
  }

  function decodeColor( value ) {
    return util.colorArrayToString( value );
  }

  var textTypeToStyle = {
    "password" : ["BORDER", "PASSWORD"],
    "search" : ["BORDER", "SEARCH"],
    "multiline" : ["BORDER", "MULTI"],
    "default" : ["BORDER"]
  };

})();

tabris.UIProxy = function() {
  this._pages = [];
};

tabris.UIProxy.prototype = {

  _create: function() {
    var self = this;
    tabris.create( "rwt.widgets.Display" );
    tabris._shell = tabris.create( "rwt.widgets.Shell", {
      style: ["NO_TRIM"],
      mode: "maximized",
      active: true,
      visibility: true
    });
    tabris._shell.on( "Close", function() {
      tabris._shell.dispose();
    });
    this._ui = tabris.create( "tabris.UI", {
      shell: tabris._shell.id
    });
    this._ui.on( "ShowPage", function( properties ) {
      var page = tabris._proxies[ properties.pageId ];
      self.setActivePage( page );
    });
    this._ui.on( "ShowPreviousPage", function() {
      self.getActivePage().close();
    });
    return this;
  },

  _install: function( target ) {
    target.createAction = util.bind( this.createAction, this );
    target.createPage = util.bind( this.createPage, this );
  },

  setActivePage: function( page ) {
    this._pages.push( page );
    this._ui.set( "activePage", page.id );
  },

  getActivePage: function() {
    return this._pages[ this._pages.length - 1 ];
  },

  setLastActivePage: function() {
    this._pages.pop();
    var page = this.getActivePage();
    if( page ) {
      this._ui.set( "activePage", page.id );
    }
  },

  createAction: function( properties, handler ) {
    var action = tabris.create( "tabris.Action", util.extend( {}, properties, {
      parent: this._ui
    }));
    if( typeof handler === "function" ) {
      action.on( "Selection", handler );
    }
    return action;
  },

  createPage: function( properties ) {
    return tabris.PageProxy.create( this, properties );
  }
};

tabris.load( function() {
  new tabris.UIProxy()._create()._install( tabris );
});

tabris.PageProxy = function( uiProxy ) {
  this._uiProxy = uiProxy;
};

tabris.PageProxy.create = function( uiProxy, properties ) {
  return new tabris.PageProxy( uiProxy )._create( properties );
};

tabris.PageProxy.prototype = {

  _PAGE_PROPS: ["title", "image", "style", "topLevel"],

  _create: function( properties ) {
    var compositeProperties = util.extend( util.omit( properties, this._PAGE_PROPS ), {
      parent: tabris._shell,
      layoutData: { left: 0, right: 0, top: 0, bottom: 0 }
    });
    this._composite = tabris.create( "rwt.widgets.Composite", compositeProperties );
    var pageProperties = util.extend( util.pick( properties, this._PAGE_PROPS ), {
      parent: this._uiProxy._ui,
      control: this._composite.id
    });
    this._page = tabris.create( "tabris.Page", pageProperties );
    // temporary fix to make UIProxy listener on ShowPreviousPage work, see issue 38
    this._page.close = util.bind( function() { this.close(); }, this );
    return this;
  },

  append: function( type, properties ) {
    return this._composite.append( type, properties );
  },

  get: function( property ) {
    if( this._PAGE_PROPS.indexOf( property ) !== -1 ) {
      return this._page.get( property );
    }
    return this._composite.get( property );
  },

  set: function( arg1, arg2 ) {
    var properties;
    if( typeof arg1 === "string" ) {
      properties = {};
      properties[arg1] = arg2;
    } else {
      properties = arg1;
    }
    this._page.set( util.pick( properties, this._PAGE_PROPS ) );
    this._composite.set( util.omit( properties, this._PAGE_PROPS ) );
    return this;
  },

  call: function( method, parameters ) {
    this._composite.call( method, parameters );
    return this;
  },

  on: function( event, listener ) {
    this._composite.on( event, listener );
    return this;
  },

  off: function( event, listener ) {
    this._composite.off( event, listener );
    return this;
  },

  dispose: function() {
    this._composite.dispose();
    this._page.dispose();
  },

  open: function() {
    this._uiProxy.setActivePage( this._page );
  },

  close: function() {
    this._composite.dispose();
    this._uiProxy.setLastActivePage();
    this._page.dispose();
  }

};

(function() {

  tabris.CanvasContext = function (gc) {
    this.gc = gc;
    this._lineWidth = 1;
    this._lineCap = "butt";
    this._lineJoin = "miter";
    this._fillStyle = [0, 0, 0, 255];
    this._strokeStyle = [0, 0, 0, 255];
    this._operations = [];
    Object.defineProperty(this, "fillStyle", {
      get: function() {
        return util.colorArrayToString(this._fillStyle);
      },
      set: function(str) {
        try {
          this._fillStyle = util.colorStringToArray(str);
          this._operations.push(["fillStyle", this._fillStyle]);
        } catch( error ) {
          console.warn("Unsupported value for fillStyle: " + str);
        }
      }
    });
    Object.defineProperty(this, "strokeStyle", {
      get: function() {
        return util.colorArrayToString(this._strokeStyle);
      },
      set: function(str) {
        try {
          this._strokeStyle = util.colorStringToArray(str);
          this._operations.push(["strokeStyle", this._strokeStyle]);
        } catch( error ) {
          console.warn("Unsupported value for strokeStyle: " + str);
        }
      }
    });
    Object.defineProperty(this, "lineWidth", {
      get: function() {
        return this._lineWidth;
      },
      set: function(value) {
        if(value > 0) {
          this._lineWidth = value;
          this._operations.push(["lineWidth", value]);
        } else {
          console.warn("Unsupported value for lineWidth: " + value);
        }
      }
    });
    Object.defineProperty(this, "lineCap", {
      get: function() {
        return this._lineCap;
      },
      set: function(value) {
        if(value in validLineCaps) {
          this._lineCap = value;
          this._operations.push(["lineCap", value]);
        } else {
          console.warn("Unsupported value for lineCap: " + value);
        }
      }
    });
    Object.defineProperty(this, "lineJoin", {
      get: function() {
        return this._lineJoin;
      },
      set: function(value) {
        if(value in validLineJoins) {
          this._lineJoin = value;
          this._operations.push(["lineJoin", value]);
        } else {
          console.warn("Unsupported value for lineJoin: " + value);
        }
      }
    });

  };

  tabris.CanvasContext.prototype = {

    beginPath: function () {
      this._operations.push(["beginPath"]);
    },

    closePath: function () {
      this._operations.push(["closePath"]);
    },

    lineTo: function (x, y) {
      this._operations.push(["lineTo", x, y]);
    },

    moveTo: function (x, y) {
      this._operations.push(["moveTo", x, y]);
    },

    bezierCurveTo: function (cp1x, cp1y, cp2x, cp2y, x, y) {
      this._operations.push(["bezierCurveTo", cp1x, cp1y, cp2x, cp2y, x, y]);
    },

    quadraticCurveTo: function (cpx, cpy, x, y) {
      this._operations.push(["quadraticCurveTo", cpx, cpy, x, y]);
    },

    rect: function (x, y, width, height) {
      this._operations.push(["rect", x, y, width, height]);
    },

    arc: function(x, y, radius, startAngle, endAngle) {
      this._operations.push(["ellipse", x, y, radius, radius, 0, startAngle, startAngle + endAngle, endAngle < 0]);
    },

    fillRect: function (x, y, width, height) {
      this._operations.push(["beginPath"], ["rect", x, y, width, height]);
      this.fill();
    },

    strokeRect: function (x, y, width, height) {
      this._operations.push(["beginPath"], ["rect", x, y, width, height]);
      this.stroke();
    },

    fillText: function (text, x, y /*, maxWidth*/) {
      this._operations.push(["fillText", text, false, false, false, x, y]);
      this._flush();
    },

    strokeText: function (text, x, y /*, maxWidth*/) {
      this._operations.push(["strokeText", text, false, false, false, x, y]);
      this._flush();
    },

    fill: function() {
      this._operations.push(["fill"]);
      this._flush();
    },

    stroke: function() {
      this._operations.push(["stroke"]);
      this._flush();
    },

    _flush: function() {
      this.gc.call("draw", { "operations": this._operations });
      console.log(this._operations);
      this._operations = [];
    }
  };

  tabris.getContext = function( canvas ) {
    if( !canvas._gc ) {
      canvas._gc = canvas.append("GC", {}).call("init", {
        width: 500,
        height: 500,
        fillStyle: [150, 200, 200, 200]
      });
    }
    if( !canvas._ctx ) {
      canvas._ctx = new tabris.CanvasContext( canvas._gc );
    }
    return canvas._ctx;
  };

  var validLineCaps ={ "butt": true, "round": true, "square": true };
  var validLineJoins ={ "bevel": true, "miter": true, "round": true };

})();
