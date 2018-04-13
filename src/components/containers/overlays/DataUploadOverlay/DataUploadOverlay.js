import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import path from "path";
import fetch from "isomorphic-fetch";
import config from "../../../../config";

class DataUploadOverlay extends React.PureComponent {

	static propTypes = {
		open: PropTypes.bool
	};

	static defaultProps = {
		scopeId: 4043
	};

	constructor(props) {
		super(props);
		this.state = {
			name: ''
		};

		this.handleNameChange = this.handleNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	close() {
		this.props.closeOverlay();
	}

	handleNameChange(event) {
		this.setState({
			name: event.target.value
		});
	}

	handleSubmit(event){
		event.preventDefault();

		// basic validation
		if (this.state.name.length === 0){
			window.alert("Name is missing!");
			return;
		}
		if (this.fileInputBefore.files.length === 0 || !this.fileInputAfter.files.length === 0){
			window.alert("Choose both files!");
			return;
		}
		this.upload();
	}

	upload(){
		let data = new FormData();
		data.append('name', this.state.name);
		data.append('scopeId', this.props.scopeId);
		data.append('changeReviewFileBefore', this.fileInputBefore.files[0]);
		data.append('changeReviewFileAfter', this.fileInputAfter.files[0]);
		let url = config.apiBackendProtocol + '://' + path.join(config.apiBackendHost, config.apiBackendSzifPath);

		fetch(url, {
			method: 'POST',
			body: data
		}).then(
			response => {
				console.log('#### upload data Response', response);
				if (response.ok) {
					window.alert("Upload was successful!");
				} else {
					window.alert("Upload wasn't successful! Error: " + response.message);
				}
			},
			error => {
				console.log('#### upload data error', error);
				window.alert("Upload wasn't successful! Error: " + error);
			}).catch(err => {
				window.alert("Upload wasn't successful! Error: " + err);
		});
	}

	render() {
		let classes = classnames("ptr-overlay", {
			"open": this.props.open
		});
		let form = this.renderForm();

		return (
			<div className={classes}>
				<div className="ptr-overlay-header">
					<h2 className="ptr-overlay-title">Data upload</h2>
					<div onClick={this.close.bind(this)} className="ptr-overlay-close">{'\u2716'}</div>
				</div>
				<div className="ptr-overlay-content">{form}</div>
			</div>
		);
	}

	renderForm(){
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Name
					<input type="text" value={this.state.name} onChange={this.handleNameChange} />
				</label>
				<label>
					Change review (original state)
					<input
						type="file"
						ref={input => {
							this.fileInputBefore = input;
						}}
					/>
				</label>
				<label>
					Change review (changed state)
					<input
						type="file"
						ref={input => {
							this.fileInputAfter = input;
						}}
					/>
				</label>
				<input type="submit" value="Upload"/>
			</form>
		);
	}

}

export default DataUploadOverlay;
