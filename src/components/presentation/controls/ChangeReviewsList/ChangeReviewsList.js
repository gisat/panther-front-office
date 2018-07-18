import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import './ChangeReviewsList.css';
import Button from "../../atoms/Button";
import Icon from "../../atoms/Icon";
import InputText from "../../atoms/InputText/InputText";

class ChangeReviewsList extends React.PureComponent {

	static propTypes = {};

	constructor(props){
		super(props);
	}

	render() {
		return (
			<div className="ptr-change-reviews-list">
				<div className="ptr-change-reviews-list-header">
					<h2 className="ptr-change-reviews-list-title">Změnová řízení</h2>
					<div className="ptr-change-reviews-list-buttons">
						<InputText
							placeholder="Vyhledat"
							transparent
						>
							<Icon icon="search"/>
						</InputText>
						<Button
							icon="plus"
							secondary>
							Přidat řízení
						</Button>
					</div>
				</div>
				<div className="ptr-change-reviews-list-body">
					<div className="ptr-table change-reviews-table">
						<div className="ptr-table-header">
							<div className="ptr-table-header-item">Stav</div>
							<div className="ptr-table-header-item">Spisová značka</div>
							<div className="ptr-table-header-item">Zadáno</div>
							<div className="ptr-table-header-item">Připraveno</div>
							<div className="ptr-table-header-item buttons"></div>
						</div>
						<div className="ptr-table-body">
							<div className="ptr-table-row">
								<div className="ptr-table-row-record">
									<div className="ptr-table-row-item state"><Icon icon="circle" color="green"/>Schváleno</div>
									<div className="ptr-table-row-item">18/6BJ/2785455/CDX</div>
									<div className="ptr-table-row-item">22. 12. 2022 (22:22)</div>
									<div className="ptr-table-row-item">22. 12. 2022 (22:22)</div>
									<div className="ptr-table-row-item buttons">
										<div className="ptr-table-row-action">
											<Button small>Zobrazit</Button>
										</div>
										<div className="ptr-table-row-show-details"><Icon icon="dots" /></div>
									</div>
								</div>
							</div>
							<div className="ptr-table-row">
								<div className="ptr-table-row-record">
									<div className="ptr-table-row-item state"><Icon icon="circle" color="green"/>Schváleno</div>
									<div className="ptr-table-row-item">18/6BJ/2785/1477</div>
									<div className="ptr-table-row-item">22. 12. 2022 (22:22)</div>
									<div className="ptr-table-row-item">1. 1. 1925 (07:35)</div>
									<div className="ptr-table-row-item buttons">
										<div className="ptr-table-row-action">
											<Button small>Zobrazit</Button>
										</div>
										<div className="ptr-table-row-show-details"><Icon icon="dots" /></div>
									</div>
								</div>
							</div>
							<div className="ptr-table-row">
								<div className="ptr-table-row-record">
									<div className="ptr-table-row-item state"><Icon icon="circle" color="orange"/>Zpracováno</div>
									<div className="ptr-table-row-item">18/6BJ/278</div>
									<div className="ptr-table-row-item">12. 1. 2002 (22:22)</div>
									<div className="ptr-table-row-item">1. 12. 2002 (07:22)</div>
									<div className="ptr-table-row-item buttons">
										<div className="ptr-table-row-action">
											<Button small>Zobrazit</Button>
										</div>
										<div className="ptr-table-row-show-details"><Icon icon="dots" /></div>
									</div>
								</div>
								<div className="ptr-table-row-details">
									Detaily..TBD
								</div>
							</div>
							<div className="ptr-table-row">
								<div className="ptr-table-row-record">
									<div className="ptr-table-row-item state"><Icon icon="circle" color="red"/>Zadáno</div>
									<div className="ptr-table-row-item">18/6BJ/2785455/CDX</div>
									<div className="ptr-table-row-item">22. 12. 2022 (22:22)</div>
									<div className="ptr-table-row-item">22. 12. 2022 (22:22)</div>
									<div className="ptr-table-row-item buttons">
										<div className="ptr-table-row-action">
											<Button small>Zobrazit</Button>
										</div>
										<div className="ptr-table-row-show-details"><Icon icon="dots" /></div>
									</div>
								</div>
							</div>
							<div className="ptr-table-row">
								<div className="ptr-table-row-record">
									<div className="ptr-table-row-item state"><Icon icon="circle" color="red"/>Zadáno</div>
									<div className="ptr-table-row-item">18/6BJ/278</div>
									<div className="ptr-table-row-item">12. 1. 2002 (22:22)</div>
									<div className="ptr-table-row-item">1. 12. 2002 (07:22)</div>
									<div className="ptr-table-row-item buttons">
										<div className="ptr-table-row-action">
											<Button small>Zobrazit</Button>
										</div>
										<div className="ptr-table-row-show-details"><Icon icon="dots" /></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default ChangeReviewsList;