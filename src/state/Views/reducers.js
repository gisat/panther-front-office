import ActionTypes from '../../constants/ActionTypes';
import _ from 'lodash';

const INITIAL_STATE = {
	data: [{
		"key": 4038,
		"changed": "2018-04-09T15:08:41.171Z",
		"conf": {
			"name": "Georgia - L3 Comparison EO/Reference Statistics",
			"description": "",
			"language": "en",
			"dataset": 3443,
			"theme": 3449,
			"visualization": 3931,
			"location": 3445
		}
	},
		{
			"key": 4056,
			"changed": "2018-04-11T14:25:14.535Z",
			"conf": {
				"name": "Ukazka fallow land on fields",
				"description": "zmeny mezi 2016 a 2017 - diry v klasifikaci",
				"language": "en",
				"dataset": 3443,
				"theme": 3449,
				"visualization": 3621,
				"location": 3445
			}
		},
		{
			"key": 4234,
			"changed": "2018-04-17T17:19:23.906Z",
			"conf": {
				"name": "Visualization of invasive species occurence",
				"description": "Case study - Černotín",
				"language": "cz",
				"dataset": 432,
				"theme": 434,
				"visualization": null,
				"location": 433
			}
		},
		{
			"key": 4238,
			"changed": "2018-04-19T07:34:09.787Z",
			"conf": {
				"name": "18/664/EPU/1/0020487",
				"description": "Ukázkové view",
				"language": "en",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4281,
			"changed": "2018-04-24T11:40:59.605Z",
			"conf": {
				"name": "17/547/EPU/1/0024026",
				"description": "31.3.2017 - Uživatel vyčistil celý DPB",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4282,
			"changed": "2018-04-24T11:44:25.182Z",
			"conf": {
				"name": "17/438/EPU/2/0006353",
				"description": "2.2.2017 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4283,
			"changed": "2018-04-24T11:59:47.755Z",
			"conf": {
				"name": "17/436/EPU/2/0018353",
				"description": "16.3.2017 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4284,
			"changed": "2018-04-24T12:10:53.806Z",
			"conf": {
				"name": "16/219/EPU/2/0013126",
				"description": "15.3.2016 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4285,
			"changed": "2018-04-24T12:26:27.238Z",
			"conf": {
				"name": "17/550/EPU/2/0007413",
				"description": "13.1.2017 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4286,
			"changed": "2018-04-24T12:35:17.572Z",
			"conf": {
				"name": "17/655/EPU/2/0009872",
				"description": "20.2.2017 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4287,
			"changed": "2018-04-24T12:46:12.914Z",
			"conf": {
				"name": "17/664/EPU/2/0042547",
				"description": "12.5.2017 - Ortofoto neaktuální, aktuální stav v terénu odpovídá LPIS",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4288,
			"changed": "2018-04-24T13:01:47.080Z",
			"conf": {
				"name": "17/759/EPU/1/0024749",
				"description": "3.4.2017 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4289,
			"changed": "2018-04-24T13:09:02.400Z",
			"conf": {
				"name": "17/759/EPU/1/0035631",
				"description": "26.4.2017 - Změna kultury po snímkování",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4290,
			"changed": "2018-04-24T13:14:01.143Z",
			"conf": {
				"name": "17/759/EPU/2/0024367",
				"description": "31.3.2017 - Potvrdit, že stávající zákres DPB je správně",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4291,
			"changed": "2018-04-24T13:29:55.947Z",
			"conf": {
				"name": "15/226/EPU/1/1052476",
				"description": "11.11.2015 - není patrná skutečná kultura - vysázený les",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4295,
			"changed": "2018-04-24T13:46:03.180Z",
			"conf": {
				"name": "17/554/EPU/1/0055949",
				"description": "7.12.2017 - Na snímku vypadá že výklenek ve východní části DPB je zemědělsky obhospodařován ale ve skutečnosti na podzim bylo provedeno shrnutí ornice na hromadu.",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4296,
			"changed": "2018-04-25T10:23:23.939Z",
			"conf": {
				"name": "",
				"description": "",
				"language": "en",
				"dataset": 3443,
				"theme": 3449,
				"visualization": 3622,
				"location": 3445
			}
		},
		{
			"key": 4297,
			"changed": "2018-04-25T14:55:52.504Z",
			"conf": {
				"name": "EPU Test",
				"description": "",
				"language": "en",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4299,
			"changed": "2018-04-26T07:39:43.116Z",
			"conf": {
				"name": "Test1",
				"description": "",
				"language": "en",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4300,
			"changed": "2018-04-26T07:40:09.668Z",
			"conf": {
				"name": "Test2",
				"description": "",
				"language": "en",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4303,
			"changed": "2018-04-26T07:51:39.178Z",
			"conf": {
				"name": "Test",
				"description": "",
				"language": "en",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4307,
			"changed": "2018-04-26T13:27:13.074Z",
			"conf": {
				"name": "Zkouška",
				"description": "zkušební popis",
				"language": "cz",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4309,
			"changed": "2018-04-26T15:23:53.221Z",
			"conf": {
				"name": "",
				"description": "",
				"language": "en",
				"dataset": 3747,
				"theme": 3957,
				"visualization": null,
				"location": 3950
			}
		},
		{
			"key": 4437,
			"changed": "2018-06-08T11:20:23.200Z",
			"conf": {
				"name": "Nádraží Bubny",
				"description": "",
				"language": "en",
				"dataset": 3971,
				"theme": 3973,
				"visualization": null,
				"location": 3975
			}
		},
		{
			"key": 4440,
			"changed": "2018-06-08T12:49:30.495Z",
			"conf": {
				"name": "Default",
				"description": "",
				"language": "en",
				"dataset": 3971,
				"theme": 3973,
				"visualization": null,
				"location": "All places"
			}
		},
		{
			"key": 4447,
			"changed": "2018-06-11T06:03:34.602Z",
			"conf": {
				"name": "Ďáblice",
				"description": "",
				"language": "en",
				"dataset": 3971,
				"theme": 3973,
				"visualization": null,
				"location": "All places"
			}
		},
		{
			"key": 4471,
			"changed": "2018-06-13T08:54:37.800Z",
			"conf": {
				"name": "Editing",
				"description": "",
				"language": "en",
				"dataset": 3971,
				"theme": 3973,
				"visualization": null,
				"location": 3975
			}
		},
		{
			"key": 4491,
			"changed": "2018-06-21T11:38:54.490Z",
			"conf": {
				"name": "Test pro nepřihlášeného",
				"description": "",
				"language": "en",
				"dataset": 3971,
				"theme": 3973,
				"visualization": null,
				"location": "All places"
			}
		},
		{
			"key": 4506,
			"changed": "2018-07-02T16:43:56.899Z",
			"conf": {
				"name": "Prepared Testing Around Dablice",
				"description": "",
				"language": "en",
				"dataset": 3971,
				"theme": 3973,
				"visualization": null,
				"location": "All places"
			}
		},
		{
			"key": 4513,
			"changed": "2018-07-04T09:28:08.259Z",
			"conf": {
				"name": "mbabic_eo4ep_georgia",
				"description": "",
				"language": "en",
				"dataset": 3443,
				"theme": 3449,
				"visualization": 3931,
				"location": 3445
			}
		},
		{
			"key": 4514,
			"changed": "2018-07-04T09:28:52.585Z",
			"conf": {
				"name": "mbabic_eo4ep_armenia",
				"description": "",
				"language": "en",
				"dataset": 3443,
				"theme": 3449,
				"visualization": 3931,
				"location": 3445
			}
		},
		{
			"key": 4515,
			"changed": "2018-07-04T10:23:58.593Z",
			"conf": {
				"name": "mbabic_eo4ep_georgia_v1",
				"description": "",
				"language": "en",
				"dataset": 3443,
				"theme": 3449,
				"visualization": 3621,
				"location": 3445
			}
		},
		{
			"key": 4516,
			"changed": "2018-07-04T10:40:42.905Z",
			"conf": {
				"name": "mbabic_eo4ep_georgia_v2",
				"description": "",
				"language": "en",
				"dataset": 3443,
				"theme": 3449,
				"visualization": 3629,
				"location": 3445
			}
		}
	]
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		default:
			return state;
	}
}
