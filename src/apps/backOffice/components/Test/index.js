import React from 'react';
import chroma from 'chroma-js';

import './style.scss';

class Test extends React.PureComponent {
	render() {
		let lightBase;
		// let lightBase = [
		// 	'#fffefc',
		// 	'#f0f0ef',
		// 	'#d7d7d5',
		// 	'#bebdbb',
		// 	'#9d9c9b',
		// 	'#81807e',
		// 	'#676664',
		// 	'#4d4c4b',
		// 	'#353433',
		// 	'#1f1e1d',
		// 	'#040300'
		// ];

		let scaleComputation = (x) => Math.pow(x, 1/6)*(0.5*(1+(Math.sin(Math.PI*x-Math.PI/2))));
		const ITEMS = 13;
		let step = 1/(ITEMS - 1);

		let computedScale = [];
		for (let i=0; i <= 1; i += step) {
			computedScale.push(scaleComputation(i));
		}


		let scale = [0, 0.04, 0.08, 0.13, 0.22, 0.33, 0.45, 0.55, 0.62, 0.7, 0.8, 0.9, 1];
		let darkScale = [0, 0.1, 0.17, 0.28, 0.36, 0.43, 0.55, 0.65, 0.78, 0.87, 0.92, 0.96, 1];




		let baseScale = chroma.scale(['#fffefc','#040300']).mode('lrgb').correctLightness();
		let accentScale = chroma.scale(['#fffefc', '#2ab2ad', '#040300']).mode('lab').correctLightness();
		let accentScaleLrgb = chroma.scale(['#fffefc', '#2ab2ad', '#040300']).mode('lrgb').correctLightness();
		let accentScale2 = chroma.scale(['#fffefc', '#4535b2', '#040300']).mode('lab').correctLightness();
		let accentScale3 = chroma.scale(['#fffefc', '#b2802d', '#040300']).mode('lab').correctLightness();
		let accentScale4 = chroma.scale(['#fffefc', chroma('#fff310').luminance(0.5), '#040300']).mode('lab').correctLightness();
		let accentScale5 = chroma.scale(['#fffefc', '#27ad2e', '#040300']).mode('lab').correctLightness();
		let accentScale6 = chroma.scale(['#fffefc', '#ad162b', '#040300']).mode('lab').correctLightness();
		let accentScale7 = chroma.scale(['#fffefc', '#90daf8', '#040300']).mode('lab').correctLightness();

		let boBaseScale = chroma.scale(['#c7c5c2', '#040300']).mode('lab').correctLightness();
		let boAccentScale = chroma.scale(['#c7c5c2', '#227773', '#040300']).mode('lab').correctLightness();

		// let darkBase = [
		// 	'#fffefc',
		// 	'#f0f0ef',
		// 	'#d7d7d5',
		// 	'#bebdbb',
		// 	'#9d9c9b',
		// 	'#81807e',
		// 	'#676664',
		// 	'#4d4c4b',
		// 	'#353433',
		// 	'#1f1e1d',
		// 	'#040300'
		// ];

		return (
			<div className="ptr-bo-test">
				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: baseScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{computedScale.map(value => (<div style={{background: baseScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: baseScale(1 - value).hex()}}/>))}
				</div>

				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{computedScale.map(value => (<div style={{background: accentScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale(1 - value).hex()}}/>))}
				</div>

				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScaleLrgb(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScaleLrgb(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale2(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale2(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale3(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale3(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale4(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale4(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale5(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale5(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale6(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale6(1 - value).hex()}}/>))}
				</div>

				<div className="testy ptr-light">
					{scale.map(value => (<div style={{background: accentScale7(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale7(1 - value).hex()}}/>))}
				</div>


				<div className="testy ptr-bo-colours">
					{scale.map(value => (<div style={{background: boBaseScale(value).hex()}}/>))}
				</div>
				<div className="testy t2 ptr-bo-colours">
					{scale.map(value => (<div style={{background: boAccentScale(value).hex()}}/>))}
				</div>
				<div className="testy t3 ptr-bo-colours">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
			</div>
		);
	}
}

export default Test;