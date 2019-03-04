import S from 'string';
import './style.css';

let polyglot = window.polyglot;
let $ = window.$;

class Tour {
	constructor(options) {
		this.addTriggerListener();
	};

	addTriggerListener() {
		$("#top-toolbar").off("click.tour").on("click.tour", "#top-toolbar-tour", this.onTourStart.bind(this));
	}

	onTourQuit() {
		// this._tour.stop();
		this._tourOverlay.removeClass("open");
	}

	onTourStart() {
		this._tour.depart();
		this._tourOverlay.addClass('open');
	}

	rebuild(type) {
		if (this._tourOverlay) {
			this._tourOverlay.remove();
		}

		if (this._tourLegs) {
			this._tourLegs.remove();
		}

		let content = this.getContentByType(type);
		this.build(content);
	}

	build(content) {
		var html = S(`
			<div class="tour-overlay" id="tour-overlay">
			
			</div>
			<ol class="tourbus-legs" id={{id}}>
				{{content}}
			</ol>
		`).template({
			id: 'app-tour',
			content: content
		}).toString();
		$('body').append(html);

		this._tourOverlay = $('#tour-overlay');
		this._tourLegs = $('#app-tour');
		this._tour = $.tourbus('#' + 'app-tour',{
			leg: {
				zindex: 99999
			},
			onStop: this.onTourQuit.bind(this),
			onLegStart: function( leg, bus ) {
				leg.$target.addClass('highlighted-target');
			},
			onLegEnd: function( leg, bus ) {
				leg.$target.removeClass('highlighted-target');
			}
		});
	}

	getContentByType(type) {
		if (type === "eo4sd") {
			return `
				<li data-el='#view-selector' data-orientation='bottom' data-align='center'>
					<h2>View selection</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
					<div class="tour-buttons">
						<a href='#' class='tour-button primary tourbus-next'>Next</a>
						<a href='#' class='tour-button tourbus-stop'>Quit</a>
					</div>
				</li>
				<li data-el='#top-toolbar-features' data-orientation='bottom' data-align='center'>
					<h2>Tool bar</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
					<div class="tour-buttons">
						<a href='#' class='tour-button primary tourbus-next'>Next</a>
						<a href='#' class='tour-button tourbus-stop'>Quit</a>
					</div>
				</li>
				<li data-orientation="centered" data-class="force-right">
					<h2>Maps</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
					<div class="tour-buttons">
						<a href='#' class='tour-button primary tourbus-next'>Next</a>
						<a href='#' class='tour-button tourbus-stop'>Quit</a>
					</div>
				</li>
				<li data-el='#sidebar-reports' data-orientation='left' data-align='center'>
					<h2>Charts & tables</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s</p>
					<div class="tour-buttons">
						<a href='#' class='tour-button primary tourbus-stop'>Start browsing!</a>
					</div>
				</li>
			`;
		}
	}
}

export default Tour;