# bpmn-js-properties-panel

[![Build Status](https://travis-ci.org/bpmn-io/bpmn-js-properties-panel.svg?branch=master)](https://travis-ci.org/bpmn-io/bpmn-js-properties-panel)

This is properties panel extension for [bpmn-js](https://github.com/bpmn-io/bpmn-js).

[![bpmn-js-properties-panel screenshot](https://raw.githubusercontent.com/bpmn-io/bpmn-js-properties-panel/master/docs/screenshot.png "Screenshot of the bpmn-js modeler + properties panel")](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel)


## Features

The properties panel allows users to edit invisible BPMN properties in a convenient way.

Some of the features are:

* Edit element ids, multi-instance details and more
* Edit execution related [Camunda](http://camunda.org) properties
* Redo and undo (plugs into the [bpmn-js](https://github.com/bpmn-io/bpmn-js) editing cycle)


## Usage

Provide two HTML elements, one for the properties panel and one for the BPMN diagram:

​```html
<div class="modeler">
  <div id="canvas"></div>
  <div id="properties"></div>
</div>
​```

Bootstrap [bpmn-js](https://github.com/bpmn-io/bpmn-js) with the properties panel and a [properties provider](https://github.com/bpmn-io/bpmn-js-properties-panel/tree/master/lib/provider):

​```javascript
var BpmnJS = require('bpmn-js/lib/Modeler'),
​    propertiesPanelModule = require('bpmn-js-properties-panel'),
​    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/bpmn');

var bpmnJS = new BpmnJS({
  additionalModules: [
​    propertiesPanelModule,
​    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
​    parent: '#properties'
  }
});
​```


### Dynamic Attach/Detach

You may attach or detach the properties panel dynamically to any element on the page, too:

​```javascript
var propertiesPanel = bpmnJS.get('propertiesPanel');

// detach the panel
propertiesPanel.detach();

// attach it to some other element
propertiesPanel.attachTo('#other-properties');
​```


### Use with Camunda properties

In order to be able to edit [Camunda](https://camunda.org) related properties, use the [camunda properties provider](https://github.com/bpmn-io/bpmn-js-properties-panel/tree/master/lib/provider/camunda).
In addition, you need to define the `camunda` namespace via [camunda-bpmn-moddle](https://github.com/camunda/camunda-bpmn-moddle).

​```javascript
var BpmnJS = require('bpmn-js/lib/Modeler'),
​    propertiesPanelModule = require('bpmn-js-properties-panel'),
​    // use Camunda properties provider
​    propertiesProviderModule = require('bpmn-js-properties-panel/lib/provider/camunda');

// a descriptor that defines Camunda related BPMN 2.0 XML extensions
var camundaModdleDescriptor = require('camunda-bpmn-moddle/resources/camunda');

var bpmnJS = new BpmnJS({
  additionalModules: [
​    propertiesPanelModule,
​    propertiesProviderModule
  ],
  container: '#canvas',
  propertiesPanel: {
​    parent: '#properties'
  },
  // make camunda prefix known for import, editing and export
  moddleExtensions: {
​    camunda: camundaModdleDescriptor
  }
});

...
​```


## Additional Resources

* [Issue tracker](https://github.com/bpmn-io/bpmn-js-properties-panel)
* [Forum](https://forum.bpmn.io)
* [Example Project](https://github.com/bpmn-io/bpmn-js-examples/tree/master/properties-panel)


## Development

### Running the tests

​```bash
npm install

export TEST_BROWSERS=Chrome
npm run all
​```


## License

MIT



## 我的Fock改动情况

1. lib\provider\camunda\CamundaPropertiesProvider.js里getTabs方法为右侧扩展栏的的tab返回，应要求只保留第一个，所以注释掉了除第一个外的其他

   ```
   this.getTabs = function(element) {
   	...
       var generalTab = {
         id: 'general',
         label: translate('General'),
         groups: createGeneralTabGroups(
           element, bpmnFactory,
           elementRegistry, elementTemplates, translate)
       };
   	...
       return [
         generalTab,
         /*variablesTab,
         connectorTab,
         formsTab,
         listenersTab,
         inputOutputTab,
         fieldInjectionsTab,
         extensionsTab*/
       ];
     };
   ```

2. 新增一个DisableTextField和checkbox来实现禁用的输入框，其实实际是通过给resource增加一个方法，这里直接范围false，可根据实际情况改写这个方法

   ```
   resource.editable=function() {
     return false;
   };
   ```

3.  新增一个radioEntryFactory来实现单选功能，

   ```
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
    console.log(resource)
    return resource;
   };
   
   module.exports = radioBox;
   ```

   一般实现一个entryFactory，只需要生成一个返回以下属性的resource对象的

   ```
   return {
     id: options.id,
     description: (options.description || ''),
     get: (options.get || defaultGet),//对于input如何取值
     set: (options.set || defaultSet),//对于input变化如何更新值
     validate: (options.validate || defaultValidate),//验证输入
     html: ''//界面
   };
   ```

4.  给name输入框增加必填属性，只需在上面的validate属性改写，如下

   ```
   validate: function(element, values) {
    //console.log(element,values[modelProperty])
    return values[modelProperty]?{}:{[modelProperty]:'请输入名称'};
   }
   ```

5. 对于一些复杂的扩展，比如需要调用接口渲染数据，为了跟react结合，这里就不在该项目改动，只是提供个react root节点供ReactDom.render提供根节点
