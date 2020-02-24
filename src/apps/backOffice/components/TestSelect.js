import React from 'react';
import {AddValue, Button, MultiSelect} from '@gisatcz/ptr-atoms';

class Test extends React.PureComponent {
	render() {

        const options = [
            { value: 'chocolate', label: 'Chocolate', key: 111 },
            { value: 'strawberry', label: 'Strawberry', key: 111 },
            { value: 'vanilla', label: 'Vanilla', key: 111 }
          ];

          const selectedValues = ['vanilla','strawberry'];


		return (
			<div className={'ptr-base-page ptr-bo-page-base'}>
			  <div className={'ptr-bo-page-base-list'}>
                test select
                <div>
                  <AddValue
                    option={{label:"Add items"}} 
                    onOptionLabelClick={(item) => {console.log('ADD item click ', item)}}
                    />
                </div>

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
				<div style={{margin: 10}}>
					<h1>Normal size</h1>
					<Button>Basic</Button>
					<Button primary>Primary</Button>
					<Button secondary>Secondary</Button>

					<h1>Normal size with icon</h1>
					<Button icon="delete">Basic</Button>
					<Button icon="download">Basic</Button>
					<Button icon="plus">Basic</Button>
					<Button primary icon="delete">Primary</Button>
					<Button primary icon="download">Primary</Button>
					<Button primary icon="plus">Primary</Button>
					<Button secondary icon="delete">Secondary</Button>
					<Button secondary icon="download">Secondary</Button>
					<Button secondary icon="plus">Secondary</Button>

					<h1>Small size</h1>
					<Button small>Basic</Button>
					<Button small primary>Primary</Button>
					<Button small secondary>Secondary</Button>

					<h1>Small size with icon</h1>
					<Button small icon="delete">Basic</Button>
					<Button small icon="download">Basic</Button>
					<Button small icon="plus">Basic</Button>

					<h1>Large size</h1>
					<Button large>Basic</Button>
					<Button large primary>Primary</Button>
					<Button large secondary>Secondary</Button>

					<h1>Normal size with icon</h1>
					<Button large icon="delete">Basic</Button>
					<Button large icon="download">Basic</Button>
					<Button large icon="plus">Basic</Button>
					<Button large primary icon="delete">Primary</Button>
					<Button large primary icon="download">Primary</Button>
					<Button large primary icon="plus">Primary</Button>
					<Button large secondary icon="delete">Secondary</Button>
					<Button large secondary icon="download">Secondary</Button>
					<Button large secondary icon="plus">Secondary</Button>

					<h1>Disabled</h1>
					<Button disabled>Basic</Button>
					<Button disabled primary>Primary</Button>
					<Button disabled secondary>Secondary</Button>

					<h1>Disabled with icon</h1>
					<Button disabled icon="delete">Basic</Button>
					<Button disabled primary icon="download">Basic</Button>
					<Button disabled secondary icon="plus">Basic</Button>

					<h1>TODO: Inverted</h1>
					<Button inverted>Basic</Button>
					<Button inverted primary>Primary</Button>
					<Button inverted secondary>Secondary</Button>

					<h1>Invisible</h1>
					<Button invisible>Basic</Button>

					<h1>Ghost</h1>
					<Button ghost>Basic</Button>
					<Button ghost primary>Primary</Button>

					<h1>Ghost with icon</h1>
					<Button ghost icon="delete">Basic</Button>
					<Button ghost primary icon="download">Basic</Button>

					<h1>Ghost large</h1>
					<Button ghost large>Basic</Button>
					<Button ghost large primary>Primary</Button>

					<h1>Ghost large with icon</h1>
					<Button ghost large icon="delete">Basic</Button>
					<Button ghost large primary icon="plus">Basic</Button>

					<h1>Ghost disabled</h1>
					<Button ghost disabled>Basic</Button>
					<Button ghost disabled primary>Primary</Button>

					<h1>Circular</h1>
					<Button circular icon="delete"></Button>
					<Button circular primary icon="plus"></Button>
					<Button circular secondary icon="edit"></Button>

					<h1>Circular large</h1>
					<Button circular large icon="expand"></Button>
					<Button circular large primary icon="search"></Button>
					<Button circular large secondary icon="restore"></Button>

				</div>
			</div>
		);
	}
}

export default Test;