import React, { useState, useEffect } from "react";

import { Link, withRouter, Redirect } from "react-router-dom";
import {
	Button,
	Card,
	CardHeader,
	Container,
	CardBody,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Col,
	Collapse,
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { toast } from "react-toastify";
import { Line, Pie, Doughnut, PolarArea } from "react-chartjs-2";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import Background from "components/general/Background/Background";

import { isAuthenticated } from "auth";

const AdminSignInForm = () => {
	const [reportDB, setReportDB] = useState([]);
	const [isError, setIsError] = useState(false);

	const [data, setData] = useState([]);
	const [reportDBOgda, setReportDBOgda] = useState([]);

	const [gdods, setGdods] = useState([]);
	const [hativas, setHativas] = useState([]);
	const [ogdas, setOgdas] = useState([]);
	const [pikods, setPikods] = useState([]);
	//* options
	const [gdodsop, setGdodsop] = useState([]);
	const [hativasop, setHativasop] = useState([]);
	const [ogdasop, setOgdasop] = useState([]);
	const [pikodsop, setPikodsop] = useState([]);

	const [gdodim, setGdodim] = useState([]);

	// const [filter, setFilter] = useState([]);

	const { user } = isAuthenticated();

	const [collapseOpen, setcollapseOpen] = React.useState(false);
	const toggleCollapse = () => {
		setcollapseOpen(!collapseOpen);
	};

	const animatedComponents = makeAnimated();

	const eventTypeArray = {
		בחר: "",
		1: "תאונת כלי רכב",
		2: "התהפכות",
		3: "הנתקות גלגל",
		4: "שריפה",
		5: "אירוע נשק / תחמושת",
		6: 'תאונת עבודה אנשי טנ"א',
		7: "פריקת מטפים",
		8: "אפידמיה",
		9: "חילוץ",
		10: 'נזק לתשתיות אחזקה / הח"י',
		11: "אי קיום שגרת אחזקה",
		12: "אחר",
		רקם: 'רק"ם',
	};

	const loadPikods = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikods(response.data);
				// console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadGdodim = async () => {
		await axios
			.get("http://localhost:8000/api/gdod")
			.then((response) => {
				setGdodim(response.data);
				// console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadOgdas = async (pikodids) => {
		let temppikodids = pikodids;
		if (temppikodids != undefined && !temppikodids.isArray) {
			temppikodids = [pikodids];
		}
		let temppikodsogdas = [];
		if (temppikodids != undefined && temppikodids.length > 0) {
			for (let i = 0; i < temppikodids.length; i++) {
				await axios
					.post("http://localhost:8000/api/ogda/ogdasbypikodid", {
						pikod: temppikodids[i],
					})
					.then((response) => {
						for (let j = 0; j < response.data.length; j++)
							temppikodsogdas.push(response.data[j]);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		setOgdas(temppikodsogdas);
	};

	const loadHativas = async (ogdaids) => {
		let tempogdaids = ogdaids;
		if (tempogdaids != undefined && !tempogdaids.isArray) {
			tempogdaids = [ogdaids];
		}
		let tempogdashativas = [];
		if (tempogdaids != undefined && tempogdaids.length > 0) {
			for (let i = 0; i < tempogdaids.length; i++) {
				await axios
					.post("http://localhost:8000/api/hativa/hativasbyogdaid", {
						ogda: tempogdaids[i],
					})
					.then((response) => {
						for (let j = 0; j < response.data.length; j++)
							tempogdashativas.push(response.data[j]);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		setHativas(tempogdashativas);
	};

	const loadGdods = async (hativaids) => {
		let temphativaids = hativaids;
		if (temphativaids != undefined && !temphativaids.isArray) {
			temphativaids = [hativaids];
		}
		let temphativasgdods = [];
		if (temphativaids != undefined && temphativaids.length > 0) {
			for (let i = 0; i < temphativaids.length; i++) {
				await axios
					.post("http://localhost:8000/api/gdod/gdodsbyhativaid", {
						hativa: temphativaids[i],
					})
					.then((response) => {
						for (let j = 0; j < response.data.length; j++)
							temphativasgdods.push(response.data[j]);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		setGdods(temphativasgdods);
	};

	// const loadReports = () => {
	// 	//* help tool for checking if ReportDB is an array so the map function will work on him
	// 	let arrayTester = [];
	// 	//* geting all the reports
	// 	axios
	// 		.get(`http://localhost:8000/report/`)
	// 		.then((res) => {
	// 			res.data.map((item, index) => {
	// 				// console.log(res.data[index]._id);
	// 				//* taking the id of etch report and geting all its data (like in the cardatamodal)
	// 				axios
	// 					.get(`http://localhost:8000/report/${res.data[index]._id}`)
	// 					.then((response) => {
	// 						// console.log(response);
	// 						// let tempuser = { ...response.data };
	// 						// setData(tempuser);
	// 						let tempcardata = response.data[0];
	// 						// console.log(tempcardata);
	// 						arrayTester.push(tempcardata);
	// 						// tempcardata.slice();
	// 						if (arrayTester.length === res.data.length) {
	// 							console.log(arrayTester);
	// 							console.log(reportDB);
	// 							setReportDB(arrayTester);
	// 						}
	// 					})
	// 					.catch((error) => {
	// 						console.log(error);
	// 					});
	// 				loadPikods();
	// 			});
	// 			// console.log(response.data);
	// 			// console.log(reportDBItem);
	// 			// setReportDB(reportDBItem);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 			setIsError(true);
	// 		});
	// };

	const loadReports = () => {
		axios.get(`http://localhost:8000/report/readall`).then((res) => {
			// console.log(res);
			// console.log(res.data);
			setReportDB(res.data);
		});
	};

	function handleChange2(selectedOption, name) {
		if (!(selectedOption.value == "בחר"))
			setData({ ...data, [name]: selectedOption.value });
		else {
			let tempdata = { ...data };
			delete tempdata[name];
			setData(tempdata);
		}
	}

	function handleChange(evt) {
		const value = evt.target.value;
		console.log(evt.target.value);
		console.log(evt.target.name);
		setData({ ...data, [evt.target.name]: value });
		console.log(new Date(data.fromdate).setHours(0, 0, 0, 0));
		console.log(data.todate);
	}

	function setoptions(pk, og, ht, gd) {
		setPikodsop(
			pk.map((item, index) => {
				let val = pk[index]._id;
				let lab = pk[index].name;
				return { value: val, label: lab };
			})
		);
		setOgdasop(
			og.map((item, index) => {
				let val = og[index]._id;
				let lab = og[index].name;
				return { value: val, label: lab };
			})
		);
		setHativasop(
			ht.map((item, index) => {
				let val = ht[index]._id;
				let lab = ht[index].name;
				return { value: val, label: lab };
			})
		);
		setGdodsop(
			gd.map((item, index) => {
				let val = gd[index]._id;
				let lab = gd[index].name;
				return { value: val, label: lab };
			})
		);
	}

	function convertToObj(a, b) {
		if (a.length != b.length || a.length == 0 || b.length == 0) {
			return null;
		}
		let obj = {};

		// Using the foreach method
		a.forEach((k, i) => {
			obj[k] = b[i];
		});
		return obj;
	}

	function handleChange8(selectedOption, name) {
		// console.log(selectedOption[0].value);
		// console.log(name);
		if (!(selectedOption.value == "בחר")) {
			let tempvalues = [];
			let tempnames = [];
			for (let i = 0; i < selectedOption.length; i++) {
				tempvalues.push(selectedOption[i].value);
				tempnames.push(selectedOption[i].label);
			}
			// console.log(tempvalues);
			// console.log(tempnames);
			// console.log(name.name);
			if (tempvalues.length > 0) {
				setData({ ...data, [name.name]: tempvalues });
			} else {
				// console.log(name.name);
				if (name.name == "hativa") {
					delete data.hativa;
					setData({ ...data });
				}
				if (name.name == "ogda") {
					delete data.ogda;
					setData({ ...data });
				}
				if (name.name == "pikod") {
					delete data.pikod;
					setData({ ...data });
				}
			}

			console.log(data);
			// console.log(data.pikod);
			// console.log(data.ogda);
			// console.log(data.hativa);
			// console.log(data.pikod.map((item,index) => {

			// }));
		} else {
			let tempfilter = { ...data };
			delete tempfilter[name];
			setData(tempfilter);
			console.log(tempfilter);
		}
	}

	const options = {
		//* on civil
		responsive: true,
		plugins: {
			legend: {
				display: false,
			},
		},
	};
	//* on Army :
	/*
			responsive: true,
			legend: {
				display: false,
			},
	};
	 */

	const labels = [
		"תאונת כלי רכב",
		"התהפכות",
		"הנתקות גלגל",
		"שריפה",
		"אירוע נשק / תחמושת",
		'תאונת עבודה אנשי טנ"א',
		"פריקת מטפים",
		"אפידמיה",
		"חילוץ",
		'נזק לתשתיות אחזקה / הח"י',
		"אי קיום שגרת אחזקה",
		"אחר",
		'רק"ם',
	];

	function sumtypereport(arr1, arr2, arr3) {
		let alldata = [];
		for (let i = 0; i < arr1.length; i++) {
			let sum = 0;
			for (let j = 0; j < arr2.length; j++) {
				if (arr3[arr2[j].typevent] == arr1[i]) sum++;
			}
			alldata[i] = sum;
		}
		return alldata;
	}

	const reportEvent = reportDB.filter((report) =>
		data.pikod.includes(report.pikod)
	);

	const dataevent = {
		labels: labels,
		datasets: [
			{
				label: "# of Votes",
				data: sumtypereport(labels, reportEvent, eventTypeArray),
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	function sumpikods(arr1, arr2) {
		let sumallpikods = [];
		for (let i = 0; i < arr1.length; i++) {
			let sum = 0;
			for (let j = 0; j < arr2.length; j++) {
				if (arr2[j].pikod == arr1[i]._id) sum++;
			}
			sumallpikods[i] = sum;
		}
		return sumallpikods;
	}

	const datapikod = {
		labels: pikods.map((pikod, index) => pikod.name),
		datasets: [
			{
				label: "# of Votes",
				data: sumpikods(pikods, reportDB),
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	function getcolor() {
		const r = Math.floor(Math.random() * 255);
		const g = Math.floor(Math.random() * 255);
		const b = Math.floor(Math.random() * 255);
		return "rgb(" + r + "," + g + "," + b + ")";
	}

	function randomcolor(arr1) {
		const colors = [];
		for (let i = 0; i < arr1.length; i++) {
			colors.push(getcolor());
			console.log(colors);
		}
		return colors;
	}

	function sumogda(arr1, arr2) {
		let sumallogdas = [];
		for (let i = 0; i < arr1.length; i++) {
			let sum = 0;
			for (let j = 0; j < arr2.length; j++) {
				if (arr2[j].ogda == arr1[i]._id) sum++;
			}
			sumallogdas[i] = sum;
		}
		return sumallogdas;
	}

	const arryogda = ogdas.filter((ogda, index) => {
		try {
			if (data.pikod.includes(ogda.pikod)) {
				return ogda.pikod;
			}
		} catch (error) {
			return datapikod;
		}
	});

	// const reportDBPikod = reportDB.filter((report) =>
	// 	data.pikod.includes(report.pikod)
	// );

	const dataeventOgda = {
		labels: labels,
		datasets: [
			{
				label: "# of Votes",
				data: sumtypereport(labels, reportDBOgda, eventTypeArray),
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderWidth: 1,
			},
		],
	};

	const datapikodFilttered = {
		labels: pikods.map((pikod, index) => pikod.name),
		datasets: [
			{
				label: "# of Votes",
				data: sumpikods(pikods, reportDBOgda),
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderWidth: 1,
			},
		],
	};
	// console.log(arryogda);

	const dataogda = {
		labels: arryogda.map((ogda) => ogda.name),
		datasets: [
			{
				label: "# of Votes",
				data: sumogda(arryogda, reportDB),
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderColor: ["rgba(200, 200, 200, 0.75)"],
				borderWidth: 1,
			},
		],
	};

	function sumhativa(arr1, arr2) {
		let sumallhativas = [];
		for (let i = 0; i < arr1.length; i++) {
			let sum = 0;
			for (let j = 0; j < arr2.length; j++) {
				if (arr2[j].hativa == arr1[i]._id) sum++;
			}
			sumallhativas[i] = sum;
		}
		return sumallhativas;
	}

	const arryhativa = hativas.filter((hativa, index) => {
		try {
			if (data.ogda.includes(hativa.ogda)) {
				return hativa.ogda;
			}
		} catch (error) {}
	});

	const datahativa = {
		labels: arryhativa.map((hativa) => hativa.name),
		datasets: [
			{
				label: "# of Votes",
				data: sumhativa(arryhativa, reportDB),
				backgroundColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
					"rgba(157, 241, 223, 1)",
					"rgba(130, 0, 0, 1)",
					"rgba(78, 108, 80, 1)",
					"rgba(207, 77, 206, 1)",
					"rgba(61, 23, 102, 1)",
					"rgba(0, 255, 246, 1)",
					"rgba(255, 173, 188, 1)",
				],
				borderColor: ["rgba(200, 200, 200, 0.75)"],
				borderWidth: 1,
			},
		],
	};

	function sumgdod(arr1, arr2) {
		let sumallgdods = [];
		for (let i = 0; i < arr1.length; i++) {
			let sum = 0;
			for (let j = 0; j < arr2.length; j++) {
				if (arr2[j].gdod == arr1[i]._id) sum++;
			}
			sumallgdods[i] = sum;
		}
		return sumallgdods;
	}
	// const arryhativa = hativas.filter((hativa, index) => {
	// 	if (data.ogda.includes(hativa.ogda)) {
	// 		return hativa.ogda;
	// 	}
	// });
	const arrygdod = gdods.filter((gdod, index) => {
		try {
			if (data.hativa.includes(gdod.hativa)) {
				return gdod.hativa;
			}
		} catch (error) {}
	});

	const datagdod = {
		labels: arrygdod.map((gdod) => gdod.name),
		datasets: [
			{
				label: "# of Votes",
				data: sumgdod(arrygdod, reportDB),
				backgroundColor: randomcolor(arrygdod),
				borderColor: ["rgba(200, 200, 200, 0.75)"],
				borderWidth: 1,
			},
		],
	};

	useEffect(() => {
		try {
			setReportDBOgda(
				reportDB.filter((report) => data.ogda.includes(report.ogda))
			);
		} catch (error) {
			setReportDBOgda(reportDB);
		}
	}, [data]);

	const initWithUserData = () => {
		setData({
			...data,
			pikod: user.pikod,
		});
		loadReports();
		loadPikods();
		loadGdodim();
		// loadOgdas(pikods);
	};

	useEffect(() => {
		initWithUserData();
	}, []);

	useEffect(() => {
		setOgdas([]);
		loadOgdas(data.pikod);
	}, [data.pikod]);

	useEffect(() => {
		setHativas([]);

		loadHativas(data.ogda);
	}, [data.ogda]);

	useEffect(() => {
		setGdods([]);
		loadGdods(data.hativa);
	}, [data.hativa]);

	useEffect(() => {
		setoptions(pikods, ogdas, hativas, gdods);
		// console.log(pikodsop);
	}, [gdods, hativas, ogdas, pikods]);

	function getname(idnum, arr) {
		for (let i = 0; i < arr.length; i++) {
			if (arr[i]._id == idnum) return arr[i].name;
		}
	}

	return (
		<Background>
			<Container className="mt--8 pb-5">
				<Row>
					<div style={{ width: "100%", margin: "auto", textAlign: "right" }}>
						<Button
							onClick={toggleCollapse}
							style={{}}
						>
							סינון
						</Button>
						<Collapse isOpen={collapseOpen}>
							<Card style={{ background: "rgb(228,228,228,0.2)" }}>
								<Row style={{ margin: "0px" }}>
									<Col
										xs={12}
										md={8}
										style={{ textAlign: "right" }}
									>
										<Row>
											<Col
												xs={12}
												md={6}
											>
												<div style={{ textAlign: "right" }}>מתאריך</div>
												<Input
													placeholder="תאריך התחלה"
													type="date"
													name="fromdate"
													value={data.fromdate}
													onChange={handleChange}
												/>
											</Col>
											<Col
												xs={12}
												md={6}
											>
												<div style={{ textAlign: "right" }}>עד תאריך</div>
												<Input
													placeholder="תאריך סיום"
													type="date"
													name="todate"
													value={data.todate}
													onChange={handleChange}
												/>
											</Col>
										</Row>

										<Row style={{ paddingTop: "10px", marginBottom: "15px" }}>
											<>
												{!data.hativa ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>אוגדה</h6>
														<Select
															closeMenuOnSelect={false}
															components={animatedComponents}
															isMulti
															options={ogdasop}
															onChange={handleChange8}
															name={"ogda"}
															val={data.ogda ? data.ogda : undefined}
														/>
													</Col>
												) : (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>אוגדה</h6>
														<Select
															components={animatedComponents}
															isMulti
															options={ogdasop}
															onChange={handleChange8}
															name={"ogda"}
															val={data.ogda ? data.ogda : undefined}
															isDisabled={true}
															// isDisabled={
															// 	!data.hativa
															// 		? true
															// 		: data.hativa.length < 1
															// 		? false
															// 		: true
															// }
														/>
													</Col>
												)}
											</>

											<>
												{data.ogda && !data.gdod ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>חטיבה</h6>
														<Select
															components={animatedComponents}
															isMulti
															options={hativasop}
															onChange={handleChange8}
															name={"hativa"}
															val={data.hativa ? data.hativa : undefined}
														/>
													</Col>
												) : (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>חטיבה</h6>
														<Select
															components={animatedComponents}
															isMulti
															options={hativasop}
															onChange={handleChange8}
															name={"hativa"}
															val={data.hativa ? data.hativa : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</>
										</Row>
									</Col>
								</Row>
							</Card>
						</Collapse>
					</div>
				</Row>
				<Row>
					<Col lg="12">
						<Card className="card-chart">
							<CardHeader>
								<h3 className="card-category text-center">טבלת אירועים</h3>
							</CardHeader>
							<CardBody>
								<table
									className="tablesorter"
									responsive
								>
									<thead className="text-primary">
										<tr>
											<th
												className="text-center"
												style={{ width: "20%" }}
											>
												יחידה מנמרית{" "}
											</th>
											<th
												className="text-center"
												style={{ width: "30%" }}
											>
												סוג אירוע
											</th>
											<th
												className="text-center"
												style={{ width: "50%" }}
											>
												פירוט האירוע
											</th>
										</tr>
									</thead>
									{data.fromdate && data.todate ? (
										<>
											{data.length == 0 && !data.pikod ? (
												<tbody>
													{reportDB
														.filter(
															(report) =>
																new Date(report.datevent).setHours(
																	0,
																	0,
																	0,
																	0
																) >=
																	new Date(data.fromdate).setHours(
																		0,
																		0,
																		0,
																		0
																	) &&
																new Date(report.datevent).setHours(
																	0,
																	0,
																	0,
																	0
																) <= new Date(data.todate).setHours(0, 0, 0, 0)
														)
														.slice(0, 5)
														.map((report, index) => (
															<tr>
																<td>
																	<p>{getname(report.gdod, gdodim)}</p>
																</td>
																<td>{eventTypeArray[report.typevent]}</td>
																<td>
																	<div
																		style={{
																			width: "100%",
																			height: "50px",
																			margin: "0",
																			padding: "0",
																			overflow: "auto",
																		}}
																	>
																		{report.pirot}
																	</div>
																</td>
															</tr>
														))}
												</tbody>
											) : data.pikod ? (
												<tbody>
													{reportDB
														.filter(
															(report) =>
																new Date(report.datevent).setHours(
																	0,
																	0,
																	0,
																	0
																) >=
																	new Date(data.fromdate).setHours(
																		0,
																		0,
																		0,
																		0
																	) &&
																new Date(report.datevent).setHours(
																	0,
																	0,
																	0,
																	0
																) <= new Date(data.todate).setHours(0, 0, 0, 0)
														)
														.slice(0, 5)
														.map((report, index) =>
															data.pikod.includes(report.pikod) ? (
																<tr>
																	<td>
																		<p>{getname(report.gdod, gdodim)}</p>
																	</td>
																	<td>{eventTypeArray[report.typevent]}</td>
																	<td>
																		<div
																			style={{
																				width: "100%",
																				height: "50px",
																				margin: "0",
																				padding: "0",
																				overflow: "auto",
																			}}
																		>
																			{report.pirot}
																		</div>
																	</td>
																</tr>
															) : null
														)}
												</tbody>
											) : !data.pikod ? (
												<tbody>
													{reportDB
														.filter(
															(report) =>
																new Date(report.datevent).setHours(
																	0,
																	0,
																	0,
																	0
																) >=
																	new Date(data.fromdate).setHours(
																		0,
																		0,
																		0,
																		0
																	) &&
																new Date(report.datevent).setHours(
																	0,
																	0,
																	0,
																	0
																) <= new Date(data.todate).setHours(0, 0, 0, 0)
														)
														.slice(0, 5)
														.map((report, index) => (
															<tr>
																<td>
																	<p>{getname(report.gdod, gdodim)}</p>
																</td>
																<td>{eventTypeArray[report.typevent]}</td>
																<td>
																	<div
																		style={{
																			width: "100%",
																			height: "50px",
																			margin: "0",
																			padding: "0",
																			overflow: "auto",
																		}}
																	>
																		{report.pirot}
																	</div>
																</td>
															</tr>
														))}
												</tbody>
											) : null}
										</>
									) : (
										<>
											{data.length == 0 && !data.pikod ? (
												<tbody>
													{reportDB.slice(0, 5).map((report, index) => (
														<tr>
															<td>
																<p>{getname(report.gdod, gdodim)}</p>
															</td>
															<td>{eventTypeArray[report.typevent]}</td>
															<td>
																<div
																	style={{
																		width: "100%",
																		height: "50px",
																		margin: "0",
																		padding: "0",
																		overflow: "auto",
																	}}
																>
																	{report.pirot}
																</div>
															</td>
														</tr>
													))}
												</tbody>
											) : data.pikod ? (
												<tbody>
													{reportDB.slice(0, 5).map((report, index) =>
														data.pikod.includes(report.pikod) ? (
															<tr>
																<td>
																	<p>{getname(report.gdod, gdodim)}</p>
																</td>
																<td>{eventTypeArray[report.typevent]}</td>
																<td>
																	<div
																		style={{
																			width: "100%",
																			height: "50px",
																			margin: "0",
																			padding: "0",
																			overflow: "auto",
																		}}
																	>
																		{report.pirot}
																	</div>
																</td>
															</tr>
														) : null
													)}
												</tbody>
											) : !data.pikod ? (
												<tbody>
													{reportDB.slice(0, 5).map((report, index) => (
														<tr>
															<td>
																<p>{getname(report.gdod, gdodim)}</p>
															</td>
															<td>{eventTypeArray[report.typevent]}</td>
															<td>
																<div
																	style={{
																		width: "100%",
																		height: "50px",
																		margin: "0",
																		padding: "0",
																		overflow: "auto",
																	}}
																>
																	{report.pirot}
																</div>
															</td>
														</tr>
													))}
												</tbody>
											) : null}
										</>
									)}
								</table>
							</CardBody>
						</Card>
					</Col>
				</Row>
				<Row>
					<Col lg="6">
						<Card className="card-chart">
							<CardHeader>
								<h3 className="card-category text-center">
									{" "}
									אירועים לפי סוג אירוע
								</h3>
							</CardHeader>
							<CardBody>
								{!data.ogda && !data.hativa ? (
									<Doughnut
										data={dataevent}
										options={options}
									/>
								) : (
									<Doughnut
										data={dataeventOgda}
										options={options}
									/>
								)}
							</CardBody>
						</Card>
					</Col>
					{!data.ogda ? (
						<Col lg="6">
							<Card className="card-chart">
								<CardHeader>
									<h3 className="card-category text-center">
										{" "}
										מספר אירועים לפי אוגדה
									</h3>
								</CardHeader>
								<CardBody>
									{!data.ogda ? (
										<Doughnut
											data={dataogda}
											options={options}
										/>
									) : //* was removed
									/*
									<Doughnut
										data={datapikodFilttered}
										options={options}
									/>
									*/
									null}
								</CardBody>
							</Card>
						</Col>
					) : null}
					{!data.pikod && !data.ogda && !data.hativa ? (
						<Col lg="6">
							<Card className="card-chart">
								<CardHeader>
									<h3 className="card-category text-center">
										{" "}
										{}
										מספר אירועים לפי אוגדה
									</h3>
								</CardHeader>
								<CardBody>
									<Doughnut
										data={dataogda}
										options={options}
									/>
								</CardBody>
							</Card>
						</Col>
					) : null}
					<>
						{data.ogda && !data.hativa ? (
							<Col lg="6">
								<Card className="card-chart">
									<CardHeader>
										<h3 className="card-category text-center">
											{" "}
											מספר אירועים לפי חטיבה
										</h3>
									</CardHeader>
									<CardBody>
										<Doughnut
											data={datahativa}
											options={options}
										/>
									</CardBody>
								</Card>
							</Col>
						) : null}
					</>
					<>
						{data.hativa ? (
							<Col lg="6">
								<Card className="card-chart">
									<CardHeader>
										<h3 className="card-category text-center">
											{" "}
											מספר אירועים לפי גדוד
										</h3>
									</CardHeader>
									<CardBody>
										<Doughnut
											data={datagdod}
											options={options}
										/>
									</CardBody>
								</Card>
							</Col>
						) : null}
					</>
				</Row>
			</Container>
		</Background>
	);
};

export default AdminSignInForm;
