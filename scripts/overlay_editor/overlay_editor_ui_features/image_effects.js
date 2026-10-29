function featureImageEffects(layer) {
	return Create('div', {
		className: 'editor_section_block',
		children: [
			Create('div', {
				className: 'editor_section_title',
				innerHTML: 'Image Effects'
			}),
			Create('div', {
				className: 'row image_effects_container',
				children: [
					Create('div', {
						className: 'col',
						style: {
							width: '50%'
						},
						children: [
							Create('label', {
								children: [
									Create('input', {
										type: 'checkbox',
										className: 'image_effects_checkbox',
										checked: layer.effects.grayscale ? true : false,
										value: true,
										onchange: function () {
											getLayerById(GLOBAL.overlay_editor.active_layer).effects.grayscale = this.checked;
											printCurrentCanvas();
											olsGeneralLog();
										}
									}),
									Create('div', {
										innerHTML: 'Grayscale',
										className: 'image_effects_textlabel'
									})
								]
							})
						]
					}),
					Create('div', {
						className: 'col',
						style: {
							width: '50%'
						},
						children: [
							Create('label', {
								children: [
									Create('input', {
										className: 'image_effects_checkbox',
										type: 'checkbox',
										checked: layer.effects.mirror ? true : false,
										value: true,
										onchange: function () {
											getLayerById(GLOBAL.overlay_editor.active_layer).effects.mirror = this.checked;
											printCurrentCanvas();
											olsGeneralLog();
										}
									}),
									Create('div', {
										innerHTML: 'Mirror',
										className: 'image_effects_textlabel'
									})
								]
							})
						]
					}),
					Create('div', {
						className: 'col',
						style: {
							width: '50%'
						},
						children: [
							Create('div', {
								children: [
									Create('input', {
										className: 'image_effects_checkbox',
										type: 'checkbox',
										checked: layer.effects.shadow.active ? true : false,
										value: true,
										style: {
											backgroundColor: layer.effects.shadow.active ? '#44444420' : 'none'
										},
										onchange: function () {
											getLayerById(GLOBAL.overlay_editor.active_layer).effects.shadow.active = this.checked;
											Select('#shadow_parameters').style.display = this.checked ? 'block' : 'none';
											this.parentNode.style.backgroundColor = this.checked ? '#44444420' : 'none'
											printCurrentCanvas();
											olsGeneralLog();
										}
									}),
									Create('div', {
										innerHTML: 'Shadow',
										className: 'image_effects_textlabel'
									}),
									Create('div', {
										className: 'effect_properties',
										id: 'shadow_parameters',
										style: {
											display: layer.effects.shadow.active ? 'block' : 'none'
										},
										children: [
											Create('label', {
												innerHTML: 'Color'
											}),
											createColorPicker(layer.effects.shadow.color, function (value) {
												getLayerById(GLOBAL.overlay_editor.active_layer).effects.shadow.color = value;
												printCurrentCanvas();
												olsGeneralLog();
											}),
											Create('label', {
												innerHTML: 'Blur (<i id="blur_range" style="font-size:11px">'+layer.effects.shadow.blur+'</i>)'
											}),
											Create('input', {
												type: 'range',
												min: 0,
												max: 200,
												value: layer.effects.shadow.blur,
												step: 1,
												onchange: function () {
													Select('#blur_range').innerHTML = this.value;
													getLayerById(GLOBAL.overlay_editor.active_layer).effects.shadow.blur = this.value;
													printCurrentCanvas();
													olsGeneralLog();
												}
											}),
											Create('label', {
												innerHTML: 'X Offset (<i id="offset_left_range" style="font-size:11px">'+layer.effects.shadow.offset_left+'</i>)'
											}),
											Create('input', {
												type: 'range',
												min: -100,
												max: 100,
												value: layer.effects.shadow.offset_left,
												step: 1,
												onchange: function () {
													Select('#offset_left_range').innerHTML = this.value;
													getLayerById(GLOBAL.overlay_editor.active_layer).effects.shadow.offset_left = this.value;
													printCurrentCanvas();
													olsGeneralLog();
												}
											}),
											Create('label', {
												innerHTML: 'Y Offset (<i id="offset_right_range" style="font-size:11px">'+layer.effects.shadow.offset_right+'</i>)'
											}),
											Create('input', {
												type: 'range',
												min: -100,
												max: 100,
												value: layer.effects.shadow.offset_right,
												step: 1,
												onchange: function () {
													Select('#offset_right_range').innerHTML = this.value;
													getLayerById(GLOBAL.overlay_editor.active_layer).effects.shadow.offset_right = this.value;
													printCurrentCanvas();
													olsGeneralLog();
												}
											})
										]
									})
								]
							})
						]
					})
				]
			})
		]
	});
}