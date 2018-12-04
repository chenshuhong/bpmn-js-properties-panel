'use strict';

var is = require('bpmn-js/lib/util/ModelUtil').is,
    entryFactory = require('../../../factory/EntryFactory');


module.exports = function(group, element, translate) {
  if (is(element, 'camunda:Assignable')) {

	  var selectOptions = [
		  { value: 'workNode', name: '审批型节点',explain:'节点类型说明：当前节点必须有单用户/多用户会签决定同意or拒绝，才触发下一个节点的流转。<br>节点动作：“同意”、“拒绝”' },
		  { value: 'approvalNode', name: '事务型节点',explain:'节点类型说明：当前节点受理人在执行完任务并确认后，即触发下一节点的流转。<br/>节点动作：“完成处理”' },
	  ];

	  group.entries.push(entryFactory.radioBox({
		  id: 'nodeType',
		  label: translate('节点类型'),
		  selectOptions: selectOptions,
		  modelProperty: 'nodeType',
		  defaultSelect: 'workNode'
	  }));

    // Assignee
    group.entries.push(entryFactory.textField({
      id: 'assignee',
      label: translate('Assignee'),
      modelProperty: 'assignee'
    }));

    // Candidate Users
    group.entries.push(entryFactory.textField({
      id: 'candidateUsers',
      label: translate('Candidate Users'),
      modelProperty: 'candidateUsers'
    }));

    // Candidate Groups
    group.entries.push(entryFactory.textField({
      id: 'candidateGroups',
      label: translate('Candidate Groups'),
      modelProperty: 'candidateGroups'
    }));

    // Due Date
    group.entries.push(entryFactory.textField({
      id: 'dueDate',
      description: translate('The due date as an EL expression (e.g. ${someDate} or an ISO date (e.g. 2015-06-26T09:54:00)'),
      label: translate('Due Date'),
      modelProperty: 'dueDate'
    }));

    // FollowUp Date
    group.entries.push(entryFactory.textField({
      id: 'followUpDate',
      description: translate('The follow up date as an EL expression (e.g. ${someDate} or an ' +
				'ISO date (e.g. 2015-06-26T09:54:00)'),
      label: translate('Follow Up Date'),
      modelProperty: 'followUpDate'
    }));

    // priority
    group.entries.push(entryFactory.textField({
      id: 'priority',
      label: translate('Priority'),
      modelProperty: 'priority'
    }));
  }
};
