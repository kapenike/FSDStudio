// create HTML representation of form text value
function getPathSelectionValueFromFormValue(value) {
	let output = Create('div');
	getRealVariableParts(value).forEach(entry => {
		output.appendChild(entry.variable ? createPathVariableEntry(entry.variable)	: createPathRealEntry(entry.real));
	});
	return variableFieldProperSpacing(output);
}

function createPathRealEntry(entry) {
	return Create('span', {
		className: 'path_real_entry',
		innerHTML: entry
	});
}

function createPathVariableEntry(path) {
	
	let real_time_value = getRealValue('$var$'+path+'$/var$');
	if (isObject(real_time_value)) {
		real_time_value = real_time_value.display;
	}
	
	return Create('span', {
		className: 'path_variable_entry',
		contentEditable: false,
		children: [
			Create('div', {
				className: 'real_time_value',
				innerHTML: real_time_value
			}),
			document.createTextNode(path)
		],
		oncontextmenu: function (event) {
			event.stopPropagation();
			event.preventDefault();
			Select('#body').appendChild(Create('div', {
				className: 'line_popup',
				children: [
					Create('div', {
						className: 'popup_inner',
						children: [
							Create('div', {
								style: {
									padding: '8px',
									fontSize: '22px',
									float: 'left'
								},
								innerHTML: 'Inline Variable Edit'
							}),
							Create('div', {
								className: 'popup_close',
								innerHTML: '&times;',
								onclick: function () {
									Select('.line_popup').remove();
								}
							}),
							Create('input', {
								type: 'text',
								name: 'variable_path',
								id: 'variable_path_line_edit',
								value: path
							}),
							Create('button', {
								id: 'inline_variable_edit_update',
								innerHTML: 'Update',
								onclick: () => {
									// "this" is reference to original path_variable_entry not the button element
									this.innerHTML = Select('#variable_path_line_edit').value;
									let uid = this.parentNode.uid;
									// update form
									Select('#var_set_input_'+uid).inputFieldUpdate();
									// re-generate html fields for this popup to update
									Select('#var_set_input_'+uid, {
										innerHTML: '',
										children: getPathSelectionValueFromFormValue(Select('#variable_input_'+uid).value)
									});
									Select('.line_popup').remove();
								}
							})
						]
					})
				]
			}));
		}
	});
}