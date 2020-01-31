import * as turf from '@turf/turf'
import path from "path";
import CommonAction from '../../../state/Action';

import lpisChangeCases from './LpisChangeCases/actions';
import lpisChangeCasesEdited from './LpisChangeCasesEdited/actions';
import lpisChangeDates from './LpisChangeDates/actions';
import szifLpisZmenovaRizeni from './LpisZmenovaRizeni/actions';

export default {
	...CommonAction,
	specific: {
		lpisChangeCases,
		lpisChangeCasesEdited,
		lpisChangeDates,
		szifLpisZmenovaRizeni
	}
}