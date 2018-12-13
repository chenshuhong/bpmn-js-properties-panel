'use strict';

var domQuery = require('min-dom').query;

var entryFieldDescription = require('./EntryFieldDescription');
var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject

var textField = function(options, defaultParameters) {

  // Default action for the button next to the input-field
  var defaultButtonAction = function(element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);
    input.value = '';

    return true;
  };

  // default method to determine if the button should be visible
  var defaultButtonShow = function(element, inputNode) {
    var input = domQuery('input[name="' + options.modelProperty + '"]', inputNode);

    return input.value !== '';
  };


  var resource = defaultParameters,
      label = options.label || resource.id,
      dataValueLabel = options.dataValueLabel,
      buttonLabel = (options.buttonLabel || 'X'),
      actionName = (typeof options.buttonAction != 'undefined') ? options.buttonAction.name : 'clear',
      actionMethod = (typeof options.buttonAction != 'undefined') ? options.buttonAction.method : defaultButtonAction,
      showName = (typeof options.buttonShow != 'undefined') ? options.buttonShow.name : 'canClear',
      showMethod = (typeof options.buttonShow != 'undefined') ? options.buttonShow.method : defaultButtonShow,
      canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
      canBeHidden = !!options.hidden && typeof options.hidden === 'function',
      description = options.description;

  resource.html =
		'<label for="camunda-' + resource.id + '-select" ' +
		(canBeDisabled ? 'data-disable="isDisabled" ' : '') +
		(canBeHidden ? 'data-show="isHidden" ' : '') +
		(dataValueLabel ? 'data-value="' + dataValueLabel + '"' : '') + '>'+ label +'</label>' +
		'<div class="bpp-field-wrapper" ' +
		(canBeDisabled ? 'data-disable="isDisabled"' : '') +
		(canBeHidden ? 'data-show="isHidden"' : '') +
		'>' +
		'<input id="camunda-' + resource.id + '" type="text" name="' + options.modelProperty+'" ' +
		(canBeDisabled ? 'data-disable="isDisabled"' : '') +
		(canBeHidden ? 'data-show="isHidden"' : '') +
		' />' +
		'<button class="' + actionName + '" data-action="' + actionName + '" data-show="' + showName + '" ' +
		(canBeDisabled ? 'data-disable="isDisabled"' : '') +
		(canBeHidden ? ' data-show="isHidden"' : '') + '>' +
		'<span>' + buttonLabel + '</span>' +
		'</button>' +
	  '<input id="camunda-' + resource.id + '-select" type="text" ' +
	  ' />' +
		'<div id="root-'+resource.id +'"></div>' +
		'</div>';

  // add description below text input entry field
  if (description) {
    resource.html += entryFieldDescription(description);
  }

  resource[actionName] = actionMethod;
  resource[showName] = showMethod;

  if (canBeDisabled) {
    resource.isDisabled = function() {
      return options.disabled.apply(resource, arguments);
    };
  }

  if (canBeHidden) {
    resource.isHidden = function() {
      return !options.hidden.apply(resource, arguments);
    };
  }
	
	resource.setControlValue = function(element, entryNode, inputNode, inputName, newValue) {
		var bo = getBusinessObject(element);
		console.log(bo)
		var value = bo.get( options.modelProperty)
		var selectedString = bo.get('selected')||null
		var selectedValue = JSON.parse(selectedString)
		console.log(selectedValue)
		if (value){
			var userNameArray = []
			selectedValue&&selectedValue.map(user=>{
				userNameArray.push(user.userName)
			})
			entryNode.querySelector('#camunda-' + options.id + '-select').value = userNameArray.join()
		}else {
			entryNode.querySelector('#camunda-' + options.id + '-select').value = ''
		}
		
	};

  resource.cssClasses = ['bpp-textfield'];

  return resource;
};

module.exports = textField;
