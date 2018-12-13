'use strict';

var domify = require('min-dom').domify;

var forEach = require('lodash/forEach');

var entryFieldDescription = require('./EntryFieldDescription');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
	cmdHelper = require('../helper/CmdHelper');


var isList = function(list) {
	return !(!list || Object.prototype.toString.call(list) !== '[object Array]');
};

var addEmptyParameter = function(list) {
	return list.concat([ { name: '', value: '' } ]);
};

var createOption = function(option) {
	return '<option value="' + option.value + '">' + option.name + '</option>';
};

/**
 * @param  {Object} options
 * @param  {string} options.id
 * @param  {string} [options.label]
 * @param  {Array<Object>} options.selectOptions
 * @param  {string} options.modelProperty
 * @param  {boolean} options.emptyParameter
 * @param  {function} options.disabled
 * @param  {function} options.hidden
 * @param  {Object} defaultParameters
 *
 * @return {Object}
 */
var radioBox = function(options, defaultParameters) {
	var resource = defaultParameters,
		label = options.label || resource.id,
		selectOptions = options.selectOptions || [ { name: '', value: '' } ],
		modelProperty = options.modelProperty,
		emptyParameter = options.emptyParameter,
		canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
		canBeHidden = !!options.hidden && typeof options.hidden === 'function',
		defaultSelect = options.defaultSelect,
		description = options.description;
	
	
	if (emptyParameter) {
		selectOptions = addEmptyParameter(selectOptions);
	}
	
	
	resource.html =
		'<label for="camunda-' + resource.id + '"' +
		(canBeDisabled ? 'data-disable="isDisabled" ' : '') +
		(canBeHidden ? 'data-show="isHidden" ' : '') +
		'>' + label + '</label>' +
		'<div id="camunda-' + resource.id + '-radio" ' +
		(canBeDisabled ? 'data-disable="isDisabled" ' : '') +
		(canBeHidden ? 'data-show="isHidden" ' : '') +
		' data-value>';
	
	if (isList(selectOptions)) {
		forEach(selectOptions, function(option) {
			resource.html += '<div class="bpp-properties-radio-container"><label><input type="radio" name="'+modelProperty+'" value="'+ option.value+'"/>'+option.name+'</label>' +
				'<div class="bpp-properties-radio-explain"><i>?</i>' +
				'<span>'+option.explain+'</span>' +
				'</div></div>';
		});
	}
	
	resource.html += '</div>';
	
	// add description below select box entry field
	if (description && typeof options.showCustomInput !== 'function') {
		resource.html += entryFieldDescription(description);
	}
	
	resource.get=function(element,node) {
		var bo = getBusinessObject(element);
		let value = bo.get(modelProperty)
		if (!value&&defaultSelect){
			//模拟点击实现首次选中
			//node.querySelector('input[value="'+defaultSelect+'"]').click()
		}
		return {
			modelProperty:value
		};
	},
		resource.set=function(element, values) {
			var res = {[modelProperty]: values[modelProperty]}
			return cmdHelper.updateProperties(element, res);
		}
	
	resource.setControlValue = function(element, entryNode, inputNode, inputName, newValue) {
		var bo = getBusinessObject(element);
		let value = bo.get(modelProperty)
		if (value){
			entryNode.querySelector('input[value="'+value+'"]').checked=true
		}else {
			entryNode.querySelector('input[value="'+defaultSelect+'"]').click()
		}
		
	};
	
	
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
	return resource;
};

module.exports = radioBox;
