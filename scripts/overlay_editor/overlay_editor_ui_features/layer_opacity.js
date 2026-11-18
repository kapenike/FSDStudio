function featureLayerOpacity(layer) {
	return Create('div', {
		className: 'editor_section_block',
		children: [
			Create('div', {
				className: 'editor_section_title',
				innerHTML: 'Layer Opacity'
			}),
			Create('div', {
				className: 'row',
				children: [
					Create('div', {
						className: 'col',
						style: {
							width: '82%',
							padding: '0',
						},
						children: [
							Create('input', {
								type: 'range',
								min: 0,
								max: 100,
								value: layer.opacity,
								onchange: function () {
									Select('#current_layer_opacity').innerHTML = this.value+'%';
									getLayerById(GLOBAL.overlay_editor.active_layer).opacity = this.value;
									printCurrentCanvas();
									olsGeneralLog();
								}
							})
						]
					}),
					Create('div', {
						className: 'col',
						style: {
							padding: '4px 0 0 15px',
							width: '18%'
						},
						children: [
							Create('span', {
								id: 'current_layer_opacity',
								innerHTML: layer.opacity+'%'
							})
						]
					})
				]
			})
		]
	});
}