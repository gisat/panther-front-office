const getAbsoluteElementPosition = (element) => {
	const rect = element.getBoundingClientRect();
	const docEl = document.documentElement;
	const top = rect.top + window.pageYOffset - docEl.clientTop;
	const left = rect.left + window.pageXOffset - docEl.clientLeft;;

	return {
		top,
		left,
	}
}

//top
const getTopPossition = (origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint) => {
	const top = hoveredElemen ? hoveredElemen.getBoundingClientRect().top : origPosY;
	const posY = top - padding - height;
	const topAbsoplute = hoveredElemen ? getAbsoluteElementPosition(hoveredElemen).top : origPosY;
	const posYAbsoplute = topAbsoplute - padding - height;
	let posX;
	let posXIncrement;
	switch (referencePoint) {
		case 'center':
			posXIncrement = -(width / 2);
			break;
		case 'corner':
			posXIncrement = 0; //left top/bottom corner
			break;
	};

	const overflowRight = (origPosX + posXIncrement + width + padding) >  BBox[1];
	const overflowLeft = (origPosX + posXIncrement - padding) <  BBox[3];

	if(overflowRight) {
		posX = BBox[1] - padding - width;
	} else if(overflowLeft) {
		posX = BBox[3] + padding;
	} else {
		posX = origPosX + posXIncrement;
	}

	const boundingRect = [posYAbsoplute, posX + width, posYAbsoplute + height, posX];

	// return [posX, posY]
	return {
		position: {posX: posX - BBox[3], posY: posY},
		boundingRect,
	}
}

//bottom
const getBottomPossition = (origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint) => {
	const bottom = hoveredElemen ? hoveredElemen.getBoundingClientRect().top + hoveredElemen.offsetHeight : origPosY;
	const posY = bottom + padding;
	const bottomAbsoplute = hoveredElemen ? getAbsoluteElementPosition(hoveredElemen).top + hoveredElemen.offsetHeight : origPosY;
	const posYAbsoplute = bottomAbsoplute + padding;
	let posX;
	let posXIncrement;
	switch (referencePoint) {
		case 'center':
			posXIncrement = -(width / 2);
			break;
		case 'corner':
			posXIncrement = 0; //left top/bottom corner
			break;
	}

	const overflowRight = (origPosX + posXIncrement + width + padding) >  BBox[1];
	const overflowLeft = (origPosX + posXIncrement - padding) <  BBox[3];

	if(overflowRight) {
		posX = BBox[1] - padding - width;
	} else if(overflowLeft) {
		posX = BBox[3] + padding;
	} else {
		posX = origPosX + posXIncrement;
	}

	const boundingRect = [posYAbsoplute, posX + width, posYAbsoplute + height, posX];

	return {
		position: {posX: posX - BBox[3], posY: posY},
		boundingRect,
	}
}

//right
const getRightPossition = (origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint) => {
	const rightAbsoplute = hoveredElemen ? getAbsoluteElementPosition(hoveredElemen).left + hoveredElemen.offsetWidth : origPosX;
	const posXAbsoplute = rightAbsoplute + padding;
	let posY;
	let posYIncrement;
	switch (referencePoint) {
		case 'center':
				posYIncrement = -(height / 2)
			break;
		case 'corner':
				posYIncrement = 0; //left/right top corner
			break;
	}

	const overflowTop = (origPosY + posYIncrement - padding) <  BBox[0];
	const overflowBottom = (origPosY + posYIncrement + height + padding) >  BBox[2];

	if(overflowTop) {
		posY = BBox[0] + padding;
	} else if(overflowBottom) {
		posY = BBox[2] - padding - height;
	} else {
		posY = origPosY + posYIncrement;
	}

	const boundingRect = [posY + height, posXAbsoplute + width, posY, posXAbsoplute];

	return {
		position: {posX: posXAbsoplute - BBox[3], posY: posY - BBox[0]},
		boundingRect,
	}
}

//left
const getLeftPossition = (origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint) => {
	const leftAbsoplute = hoveredElemen ? getAbsoluteElementPosition(hoveredElemen).left : origPosX;
	const posXAbsoplute = leftAbsoplute - padding - width;
	let posY;
	let posYIncrement;
	switch (referencePoint) {
		case 'center':
				posYIncrement = -(height / 2)
			break;
		case 'corner':
				posYIncrement = 0; //left/right top corner
			break;
	}

	const overflowTop = (origPosY + posYIncrement - padding) <  BBox[0];
	const overflowBottom = (origPosY + posYIncrement + height + padding) >  BBox[2];

	if(overflowTop) {
		posY = BBox[0] + padding;
	} else if(overflowBottom) {
		posY = BBox[2] - padding - height;
	} else {
		posY = origPosY + posYIncrement;
	}

	const boundingRect = [posY + height, posXAbsoplute + width, posY, posXAbsoplute];

	return {
		position: {posX: posXAbsoplute - BBox[3], posY: posY - BBox[0]}, //relative to element
		boundingRect,
	}
}

const checkBoundatiesConflict = (innerBoundingRect, padding, BBox) => {
	const topInside = innerBoundingRect[0] - padding >= BBox[0];
	const rightInside = innerBoundingRect[1] + padding <= BBox[1];
	const bottomInside = innerBoundingRect[2] + padding <= BBox[2];
	const leftInside = innerBoundingRect[3] - padding >= BBox[3];
	return !(topInside && rightInside && bottomInside && leftInside);
}

const getTootlipPosition = (referencePoint, positions, BBox, padding) => {
    const getPosition = (position, origPosX, origPosY, width, height, hoveredElemen) => {
        let conflict = true;
        let pos = null;
        switch (position) {
            case 'top':
                const topPos = getTopPossition(origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint);
                conflict = checkBoundatiesConflict(topPos.boundingRect, padding, BBox);
                pos = {
                    'position': topPos,
                    conflict
                }
                break;
            case 'bottom':
                const bottomPos = getBottomPossition(origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint);
                conflict = checkBoundatiesConflict(bottomPos.boundingRect, padding, BBox);
                pos = {
                    'position': bottomPos,
                    conflict
                }
                break;
            case 'left':
                const leftPos = getLeftPossition(origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint);
                conflict = checkBoundatiesConflict(leftPos.boundingRect, padding, BBox);
                pos = {
                    'position': leftPos,
                    conflict
                }
                break;
            case 'right':
                const rightPos = getRightPossition(origPosX, origPosY, width, height, hoveredElemen, padding, BBox, referencePoint);
                conflict = checkBoundatiesConflict(rightPos.boundingRect, padding, BBox);
                pos = {
                    'position': rightPos,
                    conflict
                }
                break;
            default:
                break;
        }
        return pos;
    }

    return (origPosX, origPosY, width, height, hoveredElemen) => {

        let validPosition = null;

        for (const position of positions) {
            const pos = getPosition(position, origPosX, origPosY, width, height, hoveredElemen);

            if(!pos.conflict) {
                validPosition = {
                    top: pos.position.position.posY,
                    left: pos.position.position.posX,
                    width
                };
                break;
            }
        }


        if(!validPosition) {
            const pos = getPosition(positions[0], origPosX, origPosY, width, height, hoveredElemen);
            
            validPosition = {
                top: pos.position.position.posY,
                left: pos.position.position.posX,
                width
            };
        }

        return validPosition;
    }
}


export {
	getTootlipPosition,
	getAbsoluteElementPosition,
}