/**
 * TDI-Tuning Dropdown Tests (Vanilla Javascript) v1.0
 * 
 * Copyright 2017, Samuel Laycock
 * https://github.com/samuellaycock
 * samuel.paul.laycock@gmail.com
 */

// Mock API Request

TDISelect.prototype._sendApiRequest = function() {
  var response;

    if (!this.currentSelection[7] || this.currentSelection[7] === '000') {
      response = {
        data: [
          {
            'id': 101,
            'text': 'Test text',
          },
          {
            'id': 201,
            'text': 'Test text',
          },
          {
            'id': 301,
            'text': 'Test text',
          }
        ]
      }
    } else {
      response = {
        data: {
          'name': 'Test name',
          'parentId': 'BOX15',
          'harness': [
            'FCI-D-2A',
            'FCI-D-6A'
          ],
          'engine': [
            {
              'power': {
                'ps': {
                  'stock': 101,
                  'tuned': 201,
                  'increase': 301
                },
                'bhp': {
                  'stock': 101,
                  'tuned': 201,
                  'increase': 301
                },
                'kw': {
                  'stock': 101,
                  'tuned': 201,
                  'increase': 301
                }
              },
              'torque': {
                'lb_ft': {
                  'stock': 101,
                  'tuned': 201,
                  'increase': 301
                },
                'nm': {
                  'stock': 101,
                  'tuned': 201,
                  'increase': 301
                }
              }
            }
          ],
          'instructions': []
        }
      }
    }

    return response;
}

// Initialisation

describe('TDISelect :: INITIALISATION', function() {
  var el = document.createElement('div'),
      select = new TDISelect(el);

  // Root Element
  it('ELEMENT :: should set the given element as a property', function() {
    expect(select.el).to.equal(el);
  });

  // Class Properties
  it('PROPERTIES :: should set initial property values', function() {
    expect(select.currentStage, select.finalStage, select.currentSelection, select.cache, select.open).to.exist;
  });

  // Form Element
  it('FORM :: should create the form element', function() {
    expect(select.form).to.exist;
  });

  it('FORM :: should create the form element as a form element', function() {
    expect(select.form[0].tagName).to.equal('FORM');
  });

  // Proxies
  it('PROXY :: should create the proxy container element', function() {
    expect(select.proxy.container).to.exist;
  });

  it('PROXY :: should create the proxy container element as a div element', function() {
    expect(select.proxy.container[0].tagName).to.equal('DIV');
  });

  it('PROXY :: should create the proxy list element', function() {
    expect(select.proxy.list).to.exist;
  });

  it('PROXY :: should create the proxy list element as an ul element', function() {
    expect(select.proxy.list[0].tagName).to.equal('UL');
  });

  it('PROXY :: should create the proxy stages object', function() {
    expect(select.proxy.stages).to.exist;
  });

  it('PROXY :: should create the proxy stages object with keys of numbers', function() {
    expect(select.proxy.stages).to.have.own.property(1);
  });

  it('PROXY :: should create the proxy stages object with values of ul elements', function() {
    expect(select.proxy.stages[1][0].tagName).to.equal('UL');
  });

  it('PROXY :: should create the proxy options object', function() {
    expect(select.proxy.options).to.exist;
  });

  it('PROXY :: should create the proxy options object with keys of numbers', function() {
    expect(select.proxy.options).to.have.own.property(1);
  });

  it('PROXY :: should create the proxy options object with values of objects', function() {
    expect(select.proxy.options[1]).to.be.an('object');
  });

  it('PROXY :: should create the proxy options object with values of objects of li elements', function() {
    expect(select.proxy.options[1][1][0].tagName).to.equal('LI');
  });

  // Product
  it('PRODUCT :: should create the product object', function() {
    expect(select.product).to.exist;
  });

  it('PRODUCT :: should create the product object as a div element', function() {
    expect(select.product[0].tagName).to.equal('DIV');
  });

  // Stages
  it('STAGES :: should create the stages object', function() {
    expect(select.stages).to.exist;
  });

  it('STAGES :: should create the stages object with keys of numbers', function() {
    expect(select.stages).to.have.own.property(1);
  });

  it('STAGES :: should create the stages object with values of select elements', function() {
    expect(select.stages[1][0].tagName).to.equal('SELECT');
  });

  // Navigation
  it('NAVIGATION :: should create the navigation object', function() {
    expect(select.navigation).to.exist;
  });

  it('NAVIGATION :: should create the navigation object with keys of numbers', function() {
    expect(select.navigation).to.have.own.property(1);
  });

  it('NAVIGATION :: should create the navigation object with values of input elements', function() {
    expect(select.navigation[1][0].tagName).to.equal('INPUT');
  });

  it('NAVIGATION :: should create the close button element', function() {
    expect(select.closeButton).to.exist;
  });

  it('NAVIGATION :: should create the close button element as an i element', function() {
    expect(select.closeButton[0].tagName).to.equal('I');
  });

  // Options
  it('OPTIONS :: should create the options object', function() {
    expect(select.options).to.exist;
  });

  it('OPTIONS :: should create the options object with keys of numbers', function() {
    expect(select.options).to.have.own.property(1);
  });

  it('OPTIONS :: should create the options object with values of objects', function() {
    expect(select.options[1]).to.be.an('object');
  });

  it('OPTIONS :: should create the options object with values of objects of option elements', function() {
    expect(select.options[1][1][0].tagName).to.equal('OPTION');
  });

});

// Creation

describe('TDISelect :: CREATION', function() {
  var el = document.createElement('div'),
      select = new TDISelect(el);

  // Selects
  it('SELECTS :: should create the select objects', function() {
    select.stages = select._createSelects([{'id':'test'}], el);

    expect(select.stages[1]).to.exist;
  });

  it('SELECTS :: should create the select objects as select elements', function() {
    select.stages = select._createSelects([{'id': 'test'}], el);

    expect(select.stages[1][0].tagName).to.equal('SELECT');
  });

  it('SELECTS :: should create the select objects using the given data', function() {
    select.stages = select._createSelects([{'id':'test'}], el);

    expect($(select.stages[1][0]).attr('data-type')).to.equal('test');
  });

  // Select Proxies
  it('SELECT PROXIES :: should create the select proxy objects', function() {
    select.proxy.stages = select._createSelectProxies([{'id':'test'}], el);

    expect(select.proxy.stages[1]).to.exist;
  });

  it('SELECT PROXIES :: should create the select proxy objects as ul elements', function() {
    select.proxy.stages = select._createSelectProxies([{'id':'test'}], el);

    expect(select.proxy.stages[1][0].tagName).to.equal('UL');
  });

  it('SELECT PROXIES :: should create the select proxy objects using the given data', function() {
    select.proxy.stages = select._createSelectProxies([{'id':'test'}], el);

    expect($(select.proxy.stages[1][0]).attr('data-type')).to.equal('Test');
  });

  // Options
  it('OPTIONS :: should create the option objects', function() {
    select.options[1] = select._createOptions([{'id':'1','text':'test'}], el);

    expect(select.options[1][1]).to.exist;
  });

  it('OPTIONS :: should create the option objects as select elements', function() {
    select.options[1] = select._createOptions([{'id':'1','text':'test'}], el);

    expect(select.options[1][1][0].tagName).to.equal('OPTION');
  });

  it('OPTIONS :: should create the option objects using the given data', function() {
    select.options[1] = select._createOptions([{'id':'1','text':'test'}], el);

    expect($(select.options[1][1][0]).val()).to.equal('1');
  });

  // Option Proxies
  it('OPTIONS PROXIES :: should create the option proxy objects', function() {
    select.proxy.options[1] = select._createOptionProxies([{'id':'1','text':'test'}], el);

    expect(select.proxy.options[1][1]).to.exist;
  });

  it('OPTIONS PROXIES :: should create the select objects as li elements', function() {
    select.proxy.options[1] = select._createOptionProxies([{'id':'1','text':'test'}], el);

    expect(select.proxy.options[1][1][0].tagName).to.equal('LI');
  });

  it('OPTIONS PROXIES :: should create the select objects using the given data', function() {
    select.proxy.options[1] = select._createOptionProxies([{'id':'1','text':'test'}], el);

    expect($(select.proxy.options[1][1][0]).attr('data-value')).to.equal('1');
  });

  // Product Details
  it('PRODUCT DETAILS :: should create the product detail objects', function() {
    select._showProductDetails({
      "name": "CRTD4 TWIN Channel Diesel Tuning Box Chip",
      "parentId": "BOX24",
      "harness": [
        "FCI-D-12A-29A"
      ],
      "engine": [
        {
          "power": {
            "ps": {
              "stock": 95,
              "tuned": 125,
              "increase": 30
            },
            "bhp": {
              "stock": 94,
              "tuned": 124,
              "increase": 30
            },
            "kw": {
              "stock": 70,
              "tuned": 92,
              "increase": 22
            }
          },
          "torque": {
            "lb_ft": {
              "stock": 192,
              "tuned": 242,
              "increase": 50
            },
            "nm": {
              "stock": 260,
              "tuned": 328,
              "increase": 68
            }
          }
        }
      ],
      "instructions": [
        "d2118-renault-vauxhall-comm-1.6-installation-guide-d-2-w.pdf"
      ]
    });
  
    expect($(select.product).children().eq(1).children().length).to.be.above(0);
  });

  it('PRODUCT DETAILS :: should create the product detail heading as an h1 element', function() {
    select._showProductDetails({
      "name": "CRTD4 TWIN Channel Diesel Tuning Box Chip",
      "parentId": "BOX24",
      "harness": [
        "FCI-D-12A-29A"
      ],
      "engine": [
        {
          "power": {
            "ps": {
              "stock": 95,
              "tuned": 125,
              "increase": 30
            },
            "bhp": {
              "stock": 94,
              "tuned": 124,
              "increase": 30
            },
            "kw": {
              "stock": 70,
              "tuned": 92,
              "increase": 22
            }
          },
          "torque": {
            "lb_ft": {
              "stock": 192,
              "tuned": 242,
              "increase": 50
            },
            "nm": {
              "stock": 260,
              "tuned": 328,
              "increase": 68
            }
          }
        }
      ],
      "instructions": [
        "d2118-renault-vauxhall-comm-1.6-installation-guide-d-2-w.pdf"
      ]
    });
  
    expect($(select.product).children().eq(1).children().first()[0].tagName).to.equal('H1');
  });

  it('PRODUCT DETAILS :: should create the product detail heading using the given data', function() {
    select._showProductDetails({
      "name": "CRTD4 TWIN Channel Diesel Tuning Box Chip",
      "parentId": "BOX24",
      "harness": [
        "FCI-D-12A-29A"
      ],
      "engine": [
        {
          "power": {
            "ps": {
              "stock": 95,
              "tuned": 125,
              "increase": 30
            },
            "bhp": {
              "stock": 94,
              "tuned": 124,
              "increase": 30
            },
            "kw": {
              "stock": 70,
              "tuned": 92,
              "increase": 22
            }
          },
          "torque": {
            "lb_ft": {
              "stock": 192,
              "tuned": 242,
              "increase": 50
            },
            "nm": {
              "stock": 260,
              "tuned": 328,
              "increase": 68
            }
          }
        }
      ],
      "instructions": [
        "d2118-renault-vauxhall-comm-1.6-installation-guide-d-2-w.pdf"
      ]
    });
  
    expect($(select.product).children().eq(1).children().first().html()).to.equal('CRTD4 TWIN Channel Diesel Tuning Box Chip');
  });
});

// Selection

describe('TDISelect :: SELECTION', function() {
  var el = document.createElement('div'),
      select = new TDISelect(el);
  
  it('OPTION :: should set the correct value in the current selection object', function() {
    var selectEl = select.stages[1],
      stage = $(selectEl).attr('data-stage'),
      option = select.options[1][1],
      value = $(option).val();
  
    $(selectEl).val(value);

    select._selectOption(selectEl);

    expect(select.currentSelection[stage]).to.equal(value);
  });

  it('OPTION :: should delete any later options when a previous one is changed', function() {
    var selectEl = select.stages[1],
      stage = $(selectEl).attr('data-stage'),
      option = select.options[1][1],
      value = $(option).val();
  
    $(selectEl).val(value);
    select._selectOption(selectEl);

    var nextSelectEl = select.stages[2],
        nextStage = $(nextSelectEl).attr('data-stage'),
        nextValue = 'test again';
    
    select._selectOption(nextSelectEl);

    var nextNextSelectEl = select.stages[3],
        nextNextStage = $(nextNextSelectEl).attr('data-stage'),
        nextNextValue = 'test again again';

    select._selectOption(selectEl);

    expect($(select.stages[nextNextStage]).children().length).to.equal(0);
  });

});

// Stages

describe('TDISelect :: STAGES', function() {
  var el = document.createElement('div'),
      select = new TDISelect(el);

  it('STAGE :: should set the correct stage', function() {
    var stage = 4;

    select._goToStage(stage);

    expect(select.currentStage).to.equal(stage);
  });

  it('STAGE :: should set the correct nav item as enabled', function() {
    var stage = 4;

    select._goToStage(stage);

    expect($(select.navigation[stage][0]).prop('disabled')).to.equal(false);
  });

  it('STAGE :: should set the correct nav item as active', function() {
    var stage = 4;

    select._goToStage(stage);

    expect($(select.navigation[stage][0]).prop('checked')).to.equal(true);
  });

});
