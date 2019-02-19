import React from 'react';
// import UIObjectSelect from 'components/containers/controls/Select/Select'
import MultiSelect from '../../../components/containers/controls/Select/Select'

class Test extends React.PureComponent {
	render() {

        const options = [
            { value: 'chocolate', label: 'Chocolate', key: 111 },
            { value: 'strawberry', label: 'Strawberry', key: 111 },
            { value: 'vanilla', label: 'Vanilla', key: 111 }
          ];

          const selectedValues = ['vanilla','strawberry'];

          

		return (
			<div className={'ptr-base-page ptr-bo-metadata-base'}>
			  <div className={'ptr-bo-metadata-base-list'}>
                test select
                <MultiSelect
                    options = {options}
                    selectedValues = {selectedValues}
                    ordered={true}
                    onChange={(evt) => {console.log('items changed ', evt)}}
                    onOptionLabelClick={(item) => {console.log('item click ', item)}}
                    onAdd={(value) => {console.log('value created ', value)}}
                    // creatable

						/>
			  </div>
			</div>
		);
	}
}

export default Test;