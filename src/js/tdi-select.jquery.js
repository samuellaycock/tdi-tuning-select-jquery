/**
 * TDI-Tuning Dropdown (jQuery) v1.0
 * 
 * Copyright 2017, Samuel Laycock
 * https://github.com/samuellaycock
 * samuel.paul.laycock@gmail.com
 */

;(function(window, $) {

  'use strict';

  // Utilities

  /**
   * capitalize()
	 * @desc capitalizes the context's first letter
   * @returns string - the capitalized string 
   */
  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }

  /**
   * createElement()
	 * @desc creates element tag from given arguments 
	 * @param string `tag` - string representing element type
   * @param object `options` - object literal defining properties of the element (id, class, type, href, method, name, value, disbaled, innerHtml, dataType, dataStage, dataIndex, appendTo)
   * @returns element - the created element
	 */
	function createElement(tag, options) {
		var el = $('<' + tag + '/>');

		if (options) {
      if (options.id) {
				$(el).attr('id', options.id);
			}
			if (options.class) {
				$(el).addClass(options.class)
			}
      if (options.type) {
        $(el).attr('type', options.type);
      }
      if (options.href) {
        $(el).attr('href', options.href);
      }
      if (options.method) {
        $(el).attr('method', options.method);
      }
      if (options.name) {
        $(el).attr('name', options.name);
      }
      if (options.value) {
        $(el).attr('value', options.value);
      }
      if (options.disabled) {
        $(el).prop('disabled', options.disabled);
      }
      if (options.dataType) {
        $(el).attr('data-type', options.dataType);
      }
      if (options.dataStage) {
        $(el).attr('data-stage', options.dataStage);
      }
      if (options.dataIndex) {
        $(el).attr('data-index', options.dataIndex);
      }
      if (options.dataValue) {
        $(el).attr('data-value', options.dataValue);
      }
			if (options.innerHtml) {
				$(el).html(options.innerHtml);
			}
			if (options.appendTo) {
				$(options.appendTo).append(el);
			}
		}

		return el;
	}

  // TDISelect Class

  /**
	 * TDISelect()
   * @param element `el` - the element to instantiate as the select object
	 */
	function TDISelect(el) {
    // set some default proprty values
    this.el = el;
    this.currentStage = 0;
    this.finalStage = 0;
    this.currentSelection = {};
    this.cache = {};
    this.open =  false;
    
    // initialise the "class"
    this._init();
	}

  /**
	 * TDISelect._init()
   * @desc initalises the TDISelect object
	 */
  TDISelect.prototype._init = function() {
    // request and retrieve API data
    var apiResponse = this._sendApiRequest(),
        data = apiResponse.data,
        stagesArray = [
          {'id': 'category'},
          {'id': 'manufacturer'},
          {'id': 'model'},
          {'id': 'fuel'},
          {'id': 'transmission'},
          {'id': 'variant'},
          {'id': 'product'}
        ];

    // create boilerplate for the form
    this.form = createElement('form', {method: 'get', appendTo: this.el});

    // create form input proxies
    this.proxy = {};
    this.proxy['container'] = createElement('div', {class: 'tdi-select-proxy', dataStage: 0, appendTo: this.el});
    this.proxy['list'] = createElement('ul', {class: 'tdi-select-proxy-section-list', appendTo: this.proxy.container});

    // create product information container
    this.product = createElement('div', {class: 'product-contain', appendTo: this.el});
    createElement('i', {class: 'icon-close product-contain-close-button', appendTo: this.product});
    createElement('div', {class: 'product-contain-content', appendTo: this.product});

    // use stages array to bootstrap selects and navigation
    this.stages = this._createSelects(stagesArray, this.form);
    this.proxy['stages'] = this._createSelectProxies(stagesArray, this.proxy.list);
    this.navigation = this._createNavigation(stagesArray, this.el);
    this.closeButton = createElement('i', {class: 'icon-close tdi-select-close-button', appendTo: this.proxy.container});

    // use first API call to set the first select elements options
    var options = this._createOptions(data, this.stages[1]);
    var optionProxies = this._createOptionProxies(data, this.proxy.stages[1]);
    this.options = {
      '1': options
    };
    this.proxy['options'] = {
      '1': optionProxies
    }

    // set event listeners
    this._initEvents();

    // set initial stage
    this._goToStage(1);
  }

  /**
	 * TDISelect._initEvents()
   * @desc creates the TDISelect object's eventListeners
	 */
  TDISelect.prototype._initEvents = function() {
    var self = this,
        stages = this.stages,
        stageProxies = this.proxy.stages,
        product = this.product,
        form = this.form,
        nav = this.navigation,
        backButton = this.navButton,
        closeButton = this.closeButton;

    // add click event to back button we've created
    $(backButton).on('click', function() {
      var currentStage = self.currentStage,
          prevStage = currentStage - 1;

      if (prevStage > 0) {
        self._goToStage(prevStage);
      }
    });

    // add click event to close button we've created
    $(closeButton).on('click', function() {
      if(self.open) {
        self.open = false;
        $(self.proxy.container).removeClass('open');
      }
    });

    // add change event to each select element we've created, except the last one
    for (var key in stages) {
      if (key < 7) {
        $(stages[key]).on('change', function() {
          self._selectOption(this);
        });
      }
    }

    // add change event to final select element we've created
    $(stages[7]).on('change', function() {
      self._selectProduct(this);
    });

    // add click event to first option proxy to set select as open
    $(stageProxies[1]).first().on('click', function() {
      if (!self.active) {
        self.open = true;
        $(self.proxy.container).addClass('open');
      }
    });

    // add click event to each nav input element we've created
    for (var key in nav) {
      $(nav[key]).on('click', function(  ) {
        self._selectNavigation(this);
      });
    }

    // add click event to product contain close button we've created
    $(product).first().on('click', function() {
      $(self.el).removeClass('show-product');
    })
  }

  /**
	 * TDISelect._createSelects()
   * @desc creates select elements using the given data array and appends them to the given element
   * @param array `data` - the data array to iterate through to create the select elements
   * @param element `el` - the element to append the select elements to
   * @returns elements - the created select elements
	 */
  TDISelect.prototype._createSelects = function(data, el) {
    var elements = {};

    // iterate through the data and create a select element for each value
    for (var i = 0; i < data.length; i++) {
      var element = createElement('select', {id: data[i].id + '-select', disabled: true, dataType: data[i].id, dataStage: i + 1, appendTo: el});

      elements[i + 1] = element || null;
    }

    // return the created selects
    return elements;
  }

  /**
	 * TDISelect._createSelectProxies()
   * @desc creates select proxy elements using the given data array and appends them to the given element
   * @param array `data` - the data array to iterate through to create the select proxy elements
   * @param element `el` - the element to append the select proxy elements to
   * @returns elements - the created select proxy elements
	 */
  TDISelect.prototype._createSelectProxies = function(data, el) {
    var elements = {};

    // iterate through the data and create a proxy for each value
    for (var i = 0; i < data.length; i++) {
      var proxyElement = createElement('li', {class: 'tdi-select-proxy-section-item', dataStage: i + 1, appendTo: el}),
          element = createElement('ul', {class: 'tdi-select-proxy-section-item-list ' + data[i].id, dataType: data[i].id.capitalize(), appendTo: proxyElement});

      elements[i + 1] = element || null;
    }

    // return the created proxies
    return elements;
  }

  /**
	 * TDISelect._createOptions()
   * @desc creates option elements using the given data array and appends them to the given element
   * @param array `data` - the data array to iterate through to create the option elements
   * @param element `el` - the element to append the option elements to
   * @returns elements - the created option elements
	 */
  TDISelect.prototype._createOptions = function(data, el) {
    var elements = {};

    // iterate through the data and create an option element for each value
    for (var i = 0; i < data.length; i++) {
      var element = createElement('option', {id: data[i].id + '-option', innerHtml: data[i].text, value: data[i].id, appendTo: el});

      elements[i + 1] = element || null;
    }

    // if we've successfully created option elements, set the parent select input as enabled
    if (Object.keys(elements).length) {
      $(el).prop('disabled', false);
    }

    // return the created options
    return elements;
  }

  /**
	 * TDISelect._createOptionproxies()
   * @desc creates option proxy elements using the given data array and appends them to the given element
   * @param array `data` - the data array to iterate through to create the option proxy elements
   * @param element `el` - the element to append the option proxy elements to
   * @returns elements - the created option proxy elements
	 */
  TDISelect.prototype._createOptionProxies = function(data, el) {
    var self = this,
        elements = {};
    
    // first, create the option list title
    createElement('li', {class: ' tdi-select-proxy-section-item-list-title', innerHtml: $(el).attr('data-type'), appendTo: el});

    // iterate through the data and create a proxy for each value
    for (var i = 0; i < data.length; i++) {
      var element = createElement('li', {id: data[i].id + '-option-proxy', innerHtml: data[i].text, dataValue: data[i].id, appendTo: el});

      // each proxy must respond to a click to update it's related select value
      $(element).on('click', function() {
        var parent = $($(this).parent()).parent(),
            stage = $(parent).attr('data-stage'),
            value = $(this).attr('data-value'),
            prevSelection = el.children('.active'),
            select = self.stages[stage];
        
        $(prevSelection).removeClass('active');
        $(this).addClass('active');

        $(select).val(value);
        $(select).change();
      });

      elements[i + 1] = element || null;
    }

    // return the created proxies
    return elements;
  }

  /**
	 * TDISelect._createNavigation()
   * @desc creates an array of input nav elements appended to the given element from the given data
   * @param string `data` - an array of data to create the input(s) from
   * @param element `el` - the element to which the created input(s) will be appended
   * @returns elements - the created navigation elements
	 */
  TDISelect.prototype._createNavigation = function(data, el) {
    // create the nav root
    var nav = createElement('ul', {class: 'tdi-select-nav', appendTo: el}),
        elements = {};

    // create back button and store it for conveniance
    this.navButton = createElement('button', {id: 'tdi-select-nav-back', class: 'tdi-select-nav-back', innerHtml: 'Back', appendTo: nav});

    // iterate given data and create a nav input for each
    for (var i = 0; i < data.length; i++) {
      var navItem = createElement('li', {id: data[i].id + '-nav', class: 'tdi-select-nav-item', appendTo: nav}),
          navInput = createElement('input', {class: 'tdi-select-nav-item-button', type: 'radio', name: 'tdi-select-nav', disabled: true, dataIndex: i + 1, appendTo: navItem});

      elements[i + 1] = navInput
    }

    // return the created nav elements object
    return elements;
  } 

  /**
	 * TDISelect._selectOption()
   * @desc handles the selection of an `option` element and regenerates the form inputs accordingly
   * @param element `el` - the `option` element that triggered the function call
   */
  TDISelect.prototype._selectOption = function(el) {
    var selection = this.currentSelection,
        stages = this.stages,
        options = this.options,
        proxies = this.proxy.stages,
        proxyOptions = this.proxy.options,
        finalStage = this.finalStage,
        nav = this.navigation,
        val = $(el).val(),
        type = $(el).attr('data-type'),
        stage = $(el).attr('data-stage'),
        nextStage = Number(stage) + 1;
    
    // set the selected value in the selection object
    selection[stage] = val;

    // if we're going back, set a dummy value for the last active selection and remove any stages after the active one
    if (stage < finalStage) {
      selection[finalStage] = '000';

      for (var key in selection) {
        if (key > stage) {
          var selectElement = stages[key],
              proxyElement = proxies[key];

          $(selectElement).empty();

          $(proxyElement).empty();

          // disable corresponding form and nav elements as they no longer have any data
          $(selectElement).prop('disabled', true);
          $(nav[key]).prop('disabled', true).removeClass('active');

          // class data clean up
          delete selection[key];
          delete options[key];
          delete proxyOptions[key];
        }
      }

      this.finalStage = nextStage;
    }

    // request and retrieve API data
    var apiResponse = this._sendApiRequest(),
        data = apiResponse.data;

    // if request is successful, create the options for the next selection
    if (!('error' in apiResponse)) {
      var optionElements = this._createOptions(data, stages[nextStage]);
      var optionProxies = this._createOptionProxies(data, proxies[nextStage]);
    }

    // add the new options array to the options object and its corresponding proxies
    options[nextStage] = optionElements;
    proxyOptions[nextStage] = optionProxies;

    // if we're not past the final stage, set the current stage value to the next one
    if (stage < 8) {
      this._goToStage(nextStage);
    }
  }

  /**
	 * TDISelect._selectProduct()
   * @desc handles the selection of an `option` element for a specific product and updates the UI accordingly
   * @param element `el` - the element that triggered the function call
	 */  
  TDISelect.prototype._selectProduct = function(el) {
    var selection = this.currentSelection,
        stage = $(el).attr('data-stage'),
        val = $(el).val();
    
    // first, make sure we update the final stage's value
    selection[stage] = val;

    // request and retrieve API data
    var apiResponse = this._sendApiRequest(),
        data = apiResponse.data;
    
    // if request is successful, show the requested product's details
    if (!('error' in apiResponse)) {
      this._showProductDetails(data);
    }
  }

  /**
	 * TDISelect._selectNavigation()
   * @desc handles click events on a nvigation input and updates the UI accordingly
   * @param element `el` - the element that triggered the function call
	 */
  TDISelect.prototype._selectNavigation = function(el) {
    // get the triggered elements index
    var index = $(el).attr('data-index');

    // update the stage
    this._goToStage(index);
  }

  /**
	 * TDISelect._showProductDetails()
   * @desc creates a new product detail UI from the given data
   * @param string `data` - a data boject to create the UI from
	 */
  TDISelect.prototype._showProductDetails = function(data) {
    var el = this.el,
        product = this.product,
        productContain = $(product).children().eq(1);

    // first, clean up the existing UI if it exists
    $(productContain).empty();

    // create the new UI boilerplate
    var productName = createElement('h1', {class: 'product-name', innerHtml: data.name, appendTo: productContain}),
        productInfo = createElement('ul', {class: 'product-info', appendTo: productContain}),
        productInfoHarness = createElement('ul', {class: 'product-harness-list', appendTo: productInfo}),
        productInfoEngine = createElement('ul', {class: 'product-engine-list', appendTo: productInfo}),
        productInfoInstructions = createElement('ul', {class: 'product-instructions-list', appendTo: productInfo});
    
    // iterate through the harness values
    for (var i = 0; i < data.harness.length; i++) {
      createElement('li', {class: 'product-harness-item', innerHtml: data.harness[i], appendTo: productInfoHarness});
    }
    
    // iterate through the engine values
    for (var i = 0; i < data.engine.length; i++) {
      for (var key in data.engine[i]) {
        if (key !== null) {
          createElement('li', {class: 'product-engine-title', innerHtml: key, appendTo: productInfoEngine});

          for (var subKey in data.engine[i][key]) {
            var subList = createElement('ul', {class: 'product-engine-sublist', appendTo: productInfoEngine}),
                subListTitle = createElement('li', {class: 'product-engine-sublist-title', innerHtml: subKey, appendTo: subList});
            
            for (var subSubKey in data.engine[i][key][subKey]) {
              var subSubList = createElement('ul', {class: 'product-engine-sublist-sublist', appendTo: subList});
              if (data.engine[i][key][subKey][subSubKey] !== null) {
                createElement('li', {class: 'product-engine-sublist-item', innerHtml: subSubKey + ': ' + data.engine[i][key][subKey][subSubKey], appendTo: subSubList});
              }
            }
          }
        }
      }
    }

    // iterate through the instruction values
    for (var i = 0; i < data.instructions.length; i++) {
      var listItem = createElement('li', {class: 'product-instructions-item', innerHtml: data.harness[i], appendTo: productInfoInstructions});
      
      createElement('a', {class: 'product-instructions-item-link', href: data.instructions[i], innerHTML: data.instructions[i], appendTo: listItem});
    }

    $(el).addClass('show-product');
  }

  /**
	 * TDISelect._goToStage()
   * @desc updates the class' stage to the given value and updates the UI accordingly
   * @param number `stage` - the element that triggered the function call
	 */
  TDISelect.prototype._goToStage = function(stage) {
    var nav = this.navigation,
        currentStage = this.currentStage,
        finalStage = this.finalStage,
        proxy = this.proxy.container,
        activeNavItem = nav[currentStage],
        navItem = nav[stage];

    // if there is an active nav item, set it to unselected
    if (activeNavItem) {
      $(activeNavItem).prop('checked', false);
      $(activeNavItem).removeClass('active');
    }

    // update the new stage's nav item to be selected
    $(navItem).prop('checked', true);
    $(navItem).prop('disabled', false);
    $(navItem).addClass('active');

    // if we're moving past the current last stage, update the last stage to match
    if (stage > finalStage) {
      this.finalStage = stage;
    }

    // update the stage values accordingly
    $(proxy).attr('data-stage', stage);
    this.currentStage = stage;
  }

  /**
	 * TDISelect._sendApiRequest()
   * @desc performs an XHR to the TDI-Tuning API.
   * @param object `options` - object literal defining query of the api request (categoryId, manufacturerId, modelId, fuelId, transmissionId, variantId, productId)
   * @returns JSON response from the API
	 */
  TDISelect.prototype._sendApiRequest = function() {
    var self = this,
        selection = this.currentSelection,
        apiUrl = 'https://tdi-tuning.com/productfinder/api/service/v1',
        apiKey = '95bb8488-a59a-4322-a670-73e2f7c16bd7',
        requestUrl = '';

    // create the base API url
    requestUrl = apiUrl + '?api-key=' + apiKey;

    // essentially iterate through selection object and create full API url
    if (selection) {
      if (selection[1]) {
        requestUrl += '&category-id=' + selection[1];
      }
      if (selection[2]) {
        requestUrl += '&manufacturer-id=' + selection[2];
      }
      if (selection[3]) {
        requestUrl += '&model-id=' + selection[3];
      }
      if (selection[4]) {
        requestUrl += '&fuel-id=' + selection[4];
      }
      if (selection[5]) {
        requestUrl += '&transmission-id=' + selection[5]
      }
      if (selection[6]) {
        requestUrl += '&variant-id=' + selection[6]
      }
      if (selection[7]) {
        requestUrl += '&product-id=' + selection[7]
      }
    }

    if (requestUrl in this.cache) {
      // if we've already sent this request, get it from the cache object
      return this.cache[requestUrl]
    } else {
      // if not, create an AJAX request
      var result = {}; 

      $.ajax({
        async: false,
        url: requestUrl,
        headers: {
          'Access-Control-Allow-Origin':'*'
        },
        dataType: 'json',
        success: function(data) {
          result['success'] = true;
          result['data'] = data;
        },
        error: function() {
          result['error'] = true;
        }
      });

      // return the result of the request
      return result;
    }
  }

  // set a global namespace for conveniance
  window.TDISelect = TDISelect;

})(window, jQuery);
