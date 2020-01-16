import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import Button from "../../../../components/common/atoms/Button";

class SzifMapView extends React.PureComponent {
	static propTypes = {
		screenKey: PropTypes.string,
		switchScreen: PropTypes.func
	};

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="szifLpisZmenovaRizeni-map-view">
				<Button onClick={this.props.switchScreen}>Zpět</Button>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta consequat eros, in ornare neque cursus sit amet. Aenean pharetra eu neque sodales suscipit. Integer nec quam et diam lobortis egestas. Quisque semper ante ut metus vehicula pretium. Sed et metus auctor, pharetra metus id, posuere nunc. Phasellus facilisis venenatis convallis. Duis venenatis semper dui, vel gravida ipsum. Pellentesque posuere nulla id faucibus ultrices. Vivamus consequat ullamcorper imperdiet. Aenean ipsum risus, elementum at magna eget, rhoncus tincidunt mauris.

				Cras a nisi tincidunt, blandit dolor eu, dignissim magna. Fusce condimentum nibh sed sem auctor lacinia. Nunc sit amet dolor sem. Donec purus lorem, egestas consequat metus vel, vehicula eleifend enim. Ut congue vel mauris id dignissim. Quisque sit amet pretium justo. Nulla eget lorem gravida, tristique eros quis, placerat purus. Vivamus dapibus lobortis dolor at cursus. Praesent quis erat at ipsum rhoncus faucibus. Integer neque nisl, ultrices eget diam dapibus, luctus auctor tellus. Phasellus non cursus ex. Nulla fringilla purus eu enim tincidunt tempor. Vestibulum sit amet elementum nisl. Phasellus porta est eu dui condimentum, id vestibulum enim rutrum. Nam velit arcu, faucibus non ullamcorper a, aliquet sed libero.

				Nam magna massa, eleifend et nibh ac, egestas eleifend risus. Nam elit ante, iaculis eget rhoncus vel, viverra id purus. Vestibulum tristique ut magna id convallis. Etiam dapibus eu lacus at commodo. Donec in ipsum ut diam pretium mattis vitae sed lectus. Maecenas dictum risus tortor, a tincidunt diam convallis porta. Vestibulum ultricies enim ut efficitur semper. Donec ornare mauris vel tortor dignissim blandit. Aenean quis ultricies ex. Pellentesque faucibus vulputate ultrices. Mauris egestas velit id eros rutrum, id consequat est fermentum. Donec finibus cursus placerat. Sed ut ultrices lacus. Aenean nec pharetra massa.

				Donec pretium turpis ac quam pellentesque, eget facilisis tortor sollicitudin. Vestibulum id purus id ex feugiat scelerisque. Fusce pretium bibendum purus, a congue justo suscipit eu. Phasellus tellus mauris, commodo sit amet nisl blandit, dapibus volutpat mi. Donec mollis eros vitae turpis sagittis sagittis. Morbi sit amet tristique risus, et hendrerit diam. In vitae facilisis nisl, id scelerisque leo.

				Ut venenatis ut dolor quis pretium. Cras quis iaculis libero. Mauris efficitur auctor justo at cursus. Vivamus tincidunt condimentum volutpat. Sed auctor semper enim nec posuere. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras pellentesque velit semper, vehicula mauris ut, tincidunt massa. Mauris at orci nunc. Maecenas in ante porta nibh volutpat tempor tincidunt a turpis. Etiam sed convallis nibh, id interdum mi.
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed porta consequat eros, in ornare neque cursus sit amet. Aenean pharetra eu neque sodales suscipit. Integer nec quam et diam lobortis egestas. Quisque semper ante ut metus vehicula pretium. Sed et metus auctor, pharetra metus id, posuere nunc. Phasellus facilisis venenatis convallis. Duis venenatis semper dui, vel gravida ipsum. Pellentesque posuere nulla id faucibus ultrices. Vivamus consequat ullamcorper imperdiet. Aenean ipsum risus, elementum at magna eget, rhoncus tincidunt mauris.

				Cras a nisi tincidunt, blandit dolor eu, dignissim magna. Fusce condimentum nibh sed sem auctor lacinia. Nunc sit amet dolor sem. Donec purus lorem, egestas consequat metus vel, vehicula eleifend enim. Ut congue vel mauris id dignissim. Quisque sit amet pretium justo. Nulla eget lorem gravida, tristique eros quis, placerat purus. Vivamus dapibus lobortis dolor at cursus. Praesent quis erat at ipsum rhoncus faucibus. Integer neque nisl, ultrices eget diam dapibus, luctus auctor tellus. Phasellus non cursus ex. Nulla fringilla purus eu enim tincidunt tempor. Vestibulum sit amet elementum nisl. Phasellus porta est eu dui condimentum, id vestibulum enim rutrum. Nam velit arcu, faucibus non ullamcorper a, aliquet sed libero.

				Nam magna massa, eleifend et nibh ac, egestas eleifend risus. Nam elit ante, iaculis eget rhoncus vel, viverra id purus. Vestibulum tristique ut magna id convallis. Etiam dapibus eu lacus at commodo. Donec in ipsum ut diam pretium mattis vitae sed lectus. Maecenas dictum risus tortor, a tincidunt diam convallis porta. Vestibulum ultricies enim ut efficitur semper. Donec ornare mauris vel tortor dignissim blandit. Aenean quis ultricies ex. Pellentesque faucibus vulputate ultrices. Mauris egestas velit id eros rutrum, id consequat est fermentum. Donec finibus cursus placerat. Sed ut ultrices lacus. Aenean nec pharetra massa.

				Donec pretium turpis ac quam pellentesque, eget facilisis tortor sollicitudin. Vestibulum id purus id ex feugiat scelerisque. Fusce pretium bibendum purus, a congue justo suscipit eu. Phasellus tellus mauris, commodo sit amet nisl blandit, dapibus volutpat mi. Donec mollis eros vitae turpis sagittis sagittis. Morbi sit amet tristique risus, et hendrerit diam. In vitae facilisis nisl, id scelerisque leo.

				Ut venenatis ut dolor quis pretium. Cras quis iaculis libero. Mauris efficitur auctor justo at cursus. Vivamus tincidunt condimentum volutpat. Sed auctor semper enim nec posuere. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras pellentesque velit semper, vehicula mauris ut, tincidunt massa. Mauris at orci nunc. Maecenas in ante porta nibh volutpat tempor tincidunt a turpis. Etiam sed convallis nibh, id interdum mi.
			</div>
		);
	}
}

export default SzifMapView;
