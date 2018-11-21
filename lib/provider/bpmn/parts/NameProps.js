'use strict';

var nameEntryFactory = require('./implementation/Name'),
    is = require('bpmn-js/lib/util/ModelUtil').is,
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    cmdHelper = require('../../../helper/CmdHelper');

module.exports = function(group, element, translate) {

  function setGroupName(element, values) {
    var bo = getBusinessObject(element),
        categoryValueRef = bo.categoryValueRef || {};

    return cmdHelper.updateBusinessObject(element, categoryValueRef, {
      value: values.categoryValue
    });
  }

  function getGroupName(element) {
    var bo = getBusinessObject(element),
        value = (bo.categoryValueRef || {}).value;

    return { categoryValue: value };
  }

  if (!is(element, 'bpmn:Collaboration')) {

    var options;
    if (is(element, 'bpmn:TextAnnotation')) {
      options = { modelProperty: 'text', label: translate('Text') };
    } else if (is(element, 'bpmn:Group')) {
      options = {
        modelProperty: 'categoryValue',
        label: translate('Category Value'),
        get: getGroupName,
        set: setGroupName
      };
    }

    // name
    group.entries = group.entries.concat(nameEntryFactory(element, options, translate));

  }

};
