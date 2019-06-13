const CLICK_TRESHOLD = 50;

/**
 * @exports ClickPickController
 */
class ClickPickController {
	/**
	 * Constructs a ClickPickController.
	 * @alias ClickPickController
	 * @constructor
	 * @classdesc The ClickPickController highlights picked renderables in top to bottom order. After a full pass all
	 * the renderables are highlighted.
	 * @param {WorldWindow} wwd The WorldWindow instance.
	 * @param {String[]} events An array with the events that this controller will react to.
	 * @param {Function} cb A callback function to call with the current highlighted renderables.
	 */
	constructor(wwd, cb) {
		const events = ['mousemove', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
		this.wwd = wwd;
		this.cb = cb;
		this.mouseDown = false;
		this.timeout = null;
		this.highlightedRenderables = null;

		this.eventListener = this.eventListener.bind(this, wwd, cb);

		events.forEach(event => {
			wwd.addEventListener(event, this.eventListener);
		});
	}

	eventListener(wwd, cb, event) {
		switch (event.type) {
			case 'mousemove':
				this.stopClick()
				//stop
				return;
			case 'touchstart':
				this.startClick(event)
				//start
				return;
			case 'mousedown':
				this.startClick(event)
				//start
				return;
			case 'touchend':
				this.onClickEnd(event);
				//handle? or stop
				return;	
			case 'mouseup':
				this.onClickEnd(event);
				//handle? or stop 
				return;
		}
	}


	stopClick() {
		this.timeout = null;
	}

	startClick(event) {
		this.timeout = new Date();

		const x = event.touches && event.touches[0] && event.touches[0].clientX || event.clientX;
		const y = event.touches && event.touches[0] && event.touches[0].clientY || event.clientY;

		const pickList = this.wwd.pick(this.wwd.canvasCoordinates(x, y));
		this.highlightedRenderables = this.setNextHighlightStage(pickList.objects);
	}

	onClickEnd(event) {
		if(this.timeout) {
			if(new Date() - this.timeout > CLICK_TRESHOLD) {
				this.stopClick();
				this.cb(this.highlightedRenderables, event);
			} else {
				this.stopClick();
			}
		}
	}

	/**
	 * Sets the highlight of the picked renderables.
	 * @param {Renderable[]} renderables An array of renderables.
	 * @returns {Renderable[]} An array with the highlighted renderables.
	 */
	setNextHighlightStage(renderables) {
		renderables = renderables.filter(r => {
			return !r.isTerrain;
		}).reverse();

		let numHighlighted = 0,
			currentHighlight;
		const len = renderables.length,
			highlightedRenderables = [];

		if (len === 0) {
			return highlightedRenderables;
		}

		if (len === 1) {
			renderables[0].userObject.highlighted = true;
			highlightedRenderables.push(renderables[0]);
			return highlightedRenderables;
		}

		for (let i = 0; i < len; i++) {
			if (renderables[i].userObject.highlighted) {
				numHighlighted++;
				currentHighlight = i;
				renderables[i].userObject.highlighted = false;
			}
		}

		if (numHighlighted === len) {
			renderables[0].userObject.highlighted = true;
			highlightedRenderables.push(renderables[0]);
			return highlightedRenderables;
		} else if (currentHighlight === len - 1 || numHighlighted === 0) {
			for (let i = 0; i < len; i++) {
				renderables[i].userObject.highlighted = true;
			}
			return renderables;
		} else {
			renderables[currentHighlight + 1].userObject.highlighted = true;
			highlightedRenderables.push(renderables[currentHighlight + 1]);
			return highlightedRenderables;
		}
	}
}

export default ClickPickController;