import React from 'react';
import chroma from 'chroma-js';
import _ from 'lodash';

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



		let func = {
			sin: x => Math.pow(x, 1/6)*(0.5*(1+(Math.sin(Math.PI*x-Math.PI/2)))),
			weightedSin: x => ((Math.pow(x, 1/6)*(0.5*(1+(Math.sin(Math.PI*x-Math.PI/2)))))*2+x)/3,
			poly4_1: x => 1.734477 * Math.pow(x,4) - 4.164844 * Math.pow(x,3) + 3.416132 * Math.pow(x,2) + 0.004750521 * x,
			poly5_1: x => 7.170323 * Math.pow(x,5) - 15.85702 * Math.pow(x,4) + 10.62491 * Math.pow(x,3) - 1.38351 * Math.pow(x,2) + 0.4479228 * x,
			poly5_2: x => 11.201544570129158 * Math.pow(x,5) - 25.281350401487394 * Math.pow(x,4) + 18.144704154311945 * Math.pow(x,3) - 3.7506861589123197 * Math.pow(x,2) + 0.6854290141573289 * x,
			poly5_3: x => 10.488784636649553 * Math.pow(x,5) - 23.378365791825725 * Math.pow(x,4) + 16.338625076736328 * Math.pow(x,3) - 3.0407060124009617 * Math.pow(x,2) + 0.5910582378695448 * x,
			poly5_3_reverse: x => -1.4299532950700888 * Math.pow(x,5) - 0.7904945513948627 * Math.pow(x,4) + 6.515917255358833 * Math.pow(x,3) - 5.8650595314990035 * Math.pow(x,2) + 2.571239466686039 * x,
			poly5_dark_1: x => -2.9570187975647215 * Math.pow(x,5) + 6.36583476976551 * Math.pow(x,4) - 4.480999912718653 * Math.pow(x,3) + 0.9219776983607566 * Math.pow(x,2) + 1.1478244379577907 * x,
			poly5_dark_2: x => 3.4127383805752163 * Math.pow(x,5) - 7.515438380430648 * Math.pow(x,4) + 5.036490434394787 * Math.pow(x,3) - 0.9939362345459315 * Math.pow(x,2) + 1.0602582306098571 * x,

		};

		const ITEMS = 21;
		let megaStep = 1000000/(ITEMS - 1); // fixing floating point precision

		let scaleBase = [];
		for (let i=0; i < ITEMS; i++) {
			scaleBase.push((i*megaStep)/1000000);
		}

		let scale = _.mapValues(func, f => _.map(scaleBase, f));

		let originalScale = [0, 0.04, 0.08, 0.13, 0.22, 0.33, 0.45, 0.55, 0.62, 0.7, 0.8, 0.9, 1];
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
				<div className="testy ptr-light" title="weightedSin">
					{scale.weightedSin.map(value => (<div style={{background: baseScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light" title="poly5_2">
					{scale.poly5_2.map(value => (<div style={{background: baseScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light" title="original">
					{originalScale.map(value => (<div style={{background: baseScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light" title="poly5_3">
					{scale.poly5_3.map(value => (<div style={{background: baseScale(value).hex()}}/>))}
				</div>

				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: baseScale(1 - value).hex()}}/>))}
				</div>

				<div className="testy ptr-light" title="weightedSin">
					{scale.weightedSin.map(value => (<div style={{background: accentScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light" title="poly5_2">
					{scale.poly5_2.map(value => (<div style={{background: accentScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light" title="original">
					{originalScale.map(value => (<div style={{background: accentScale(value).hex()}}/>))}
				</div>
				<div className="testy ptr-light" title="poly5_3">
					{scale.poly5_3.map(value => (<div style={{background: accentScale(value).hex()}}/>))}
				</div>

				<div className="testy ptr-dark" title="poly5_dark_1">
					{scale.poly5_dark_1.map(value => (<div style={{background: accentScale(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark" title="original">
					{darkScale.map(value => (<div style={{background: accentScale(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark" title="poly5_dark_2">
					{scale.poly5_dark_2.map(value => (<div style={{background: accentScale(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark" title="poly5_3_reverse">
					{scale.poly5_3_reverse.map(value => (<div style={{background: accentScale(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark" title="poly5_3">
					{scale.poly5_3.map(value => (<div style={{background: accentScale(1 - value).hex()}}/>))}
				</div>

				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScaleLrgb(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScaleLrgb(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScale2(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale2(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScale3(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale3(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScale4(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale4(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScale5(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale5(1 - value).hex()}}/>))}
				</div>
				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScale6(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale6(1 - value).hex()}}/>))}
				</div>

				<div className="testy ptr-light">
					{originalScale.map(value => (<div style={{background: accentScale7(value).hex()}}/>))}
				</div>
				<div className="testy ptr-dark">
					{darkScale.map(value => (<div style={{background: accentScale7(1 - value).hex()}}/>))}
				</div>


				<div className="testy ptr-bo-colours">
					{originalScale.map(value => (<div style={{background: boBaseScale(value).hex()}}/>))}
				</div>
				<div className="testy t2 ptr-bo-colours">
					{originalScale.map(value => (<div style={{background: boAccentScale(value).hex()}}/>))}
				</div>
				<div className="testy t3 ptr-bo-colours">
					<div/><div/><div/><div/><div/><div/><div/><div/><div/><div/><div/>
				</div>
			</div>
		);
	}
}

export default Test;