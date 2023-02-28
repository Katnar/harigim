/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
	// eslint-disable-next-line no-unused-vars
	Button,
	Card,
	CardHeader,
	CardBody,
	CardTitle,
	Container,
	FormGroup,
	Form,
	Input,
	InputGroupAddon,
	InputGroupText,
	InputGroup,
	Row,
	Alert,
	Spinner,
	Label,
	Col,
} from "reactstrap";
import { produce } from "immer";
import { generate } from "shortid";
import axios from "axios";
import history from "history.js";
import { toast } from "react-toastify";
import Select from "components/general/Select/AnimatedSelect";

const EditReport = ({ match }) => {
	const [data, setData] = useState({
		name: "",
		lastname: "",
		personalnumber: "",
		cellphone: "",
		typevent: "",
		resevent: "",
		yn: "",
		status: "",
		selneshek: "",
		whap: "",
		amlahtype: "",
		rekemtype: "",
		mazavrekem: "",
		dwork: "",
		mataftype: "",
		apitype: "",
		mholaztype: "",
		pirot: "",
		datevent: "",
		mikom: "",
		nifga: "",

		error: false,
		successmsg: false,
		loading: false,
		redirectToReferrer: false,
		//
	});

	const [gdods, setGdods] = useState([]);
	const [hativas, setHativas] = useState([]);
	const [ogdas, setOgdas] = useState([]);
	const [pikods, setPikods] = useState([]);
	const [mkabazsMataf, setMkabazsMataf] = useState([]);
	const [indexM, setIndexM] = useState(0);

	const [mkabazs, setMkabazs] = useState([]);
	const [magads, setMagads] = useState([]);
	const [magadals, setMagadals] = useState([]);

	const getMagadals = async () => {
		await axios
			.get(`http://localhost:8000/api/magadal`)
			.then((response) => {
				setMagadals(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getMagads = async (magadalid) => {
		let tempmagadalsmagads = [];
		if (magadalid != undefined) {
			await axios
				.get(`http://localhost:8000/api/magad/magadsbymagadal/${magadalid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadalsmagads.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setMagads(tempmagadalsmagads);
		}
	};

	const getMkabazs = async (magadid) => {
		let tempmagadmkabazs = [];
		if (magadid != undefined) {
			await axios
				.get(`http://localhost:8000/api/mkabaz/mkabazsbymagad/${magadid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadmkabazs.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			setMkabazs(tempmagadmkabazs);
		}
	};

	const getMkabazsMataf = async () => {
		await axios
			.get(`http://localhost:8000/api/mkabaz`)
			.then((response) => {
				setMkabazsMataf(response.data);
				// console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadPikods = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikods(response.data);
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

	function handleChange(evt) {
		const value = evt.target.value;
		setData({ ...data, [evt.target.name]: value });
	}

	async function matafHandleChange(selectedOption, name) {
		if (!(selectedOption.value == "בחר")) {
			let i = mkabazsMataf.map((item, index) => {
				return mkabazsMataf[index].name;
			});
			console.log(1);
			let nameIndex = await i.indexOf(selectedOption.label);
			// console.log(selectedOption.label);
			console.log(nameIndex);
			await setIndexM(nameIndex);
			// console.log(mkabazsMataf[nameIndex]);
			console.log(indexM);
			console.log(mkabazsMataf[indexM].matafEngine);
			console.log(mkabazsMataf[indexM].matafCre);

			setData({ ...data, [name]: selectedOption.value });
		} else {
			let tempdata = { ...data };
			console.log(tempdata);
			delete tempdata[name];
			setData(tempdata);
		}
	}

	function handleChange2(selectedOption, name) {
		if (!(selectedOption.value == "בחר"))
			setData({ ...data, [name]: selectedOption.value });
		else {
			let tempdata = { ...data };
			delete tempdata[name];
			setData(tempdata);
		}
	}

	const clickSubmit = (event) => {
		CheckSignUpForm(event);
	};

	const CheckSignUpForm = (event) => {
		event.preventDefault();
		var flag = true;
		var ErrorReason = "";
		if (data.name == "") {
			flag = false;
			ErrorReason += " שם ריק \n";
		}
		if (data.lastname == "") {
			flag = false;
			ErrorReason += " שם משפחה ריק \n";
		}
		if (data.personalnumber == "") {
			flag = false;
			ErrorReason += " מס אישי ריק \n";
		}
		if (data.cellphone == "") {
			flag = false;
			ErrorReason += " טלפון ריק \n";
		}
		if (
			document.getElementById("seltype").options[
				document.getElementById("seltype").selectedIndex
			].value == "בחר"
		) {
			flag = false;
			ErrorReason += " סוג אירוע ריק \n";
		}

		if (
			data.typevent === "1" ||
			data.typevent === "2" ||
			data.typevent === "3" ||
			data.typevent === "4"
		) {
			if (
				document.getElementById("res").options[
					document.getElementById("res").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סיבת האירוע ריקה \n";
			}
			if (
				!document.getElementById("YES").checked &&
				!document.getElementById("NO").checked
			) {
				flag = false;
				ErrorReason += " ,אם נגרם נזק לכלי ריק \n";
			}
		}
		if (data.typevent === "5") {
			if (
				document.getElementById("neshek").options[
					document.getElementById("neshek").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג הנשק ריק \n";
			}
			if (
				!document.getElementById("YES").checked &&
				!document.getElementById("NO").checked
			) {
				flag = false;
				ErrorReason += " ,אם נגרם נזק ריק \n";
			}
			if (
				document.getElementById("what").options[
					document.getElementById("what").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += " מה התרחש באירוע ריק \n";
			}
		}
		if (data.typevent === "6") {
			if (
				document.getElementById("when").options[
					document.getElementById("when").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "מתי הנפגע ריק \n";
			}
			if (data.amlah == "") {
				flag = false;
				ErrorReason += " סוג האמלח ריק \n";
			}
		}
		if (data.typevent === "7") {
			if (
				document.getElementById("mataf").options[
					document.getElementById("mataf").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג מטף ריק \n";
			}
			// if (
			// 	document.getElementById("rekem").options[
			// 		document.getElementById("rekem").selectedIndex
			// 	].value == "0"
			// ) {
			// 	flag = false;
			// 	ErrorReason += " סוג הרק'ם ריק \n";
			// }
			if (
				document.getElementById("mazav").options[
					document.getElementById("mazav").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "מצב הרק'ם ריק \n";
			}
			if (
				document.getElementById("dwork").options[
					document.getElementById("dwork").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += " האם בוצע במהלך עבודה ריק  \n";
			}
			if (
				!document.getElementById("YES").checked &&
				!document.getElementById("NO").checked
			) {
				flag = false;
				ErrorReason += " ,אם בפירוק / הרכבה ריק \n";
			}
		}
		if (data.typevent === "8") {
			if (
				document.getElementById("apidmia").options[
					document.getElementById("apidmia").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג אפידמיה ריק \n";
			}
		}
		if (data.typevent === "9") {
			if (
				document.getElementById("mholaz").options[
					document.getElementById("mholaz").selectedIndex
				].value == "0"
			) {
				flag = false;
				ErrorReason += "סוג הכלי המחולץ ריק \n";
			}
			// if (
			//   document.getElementById("mhalz").options[
			//     document.getElementById("mhalz").selectedIndex
			//   ].value == "0"
			// ) {
			//   flag = false;
			//   ErrorReason += "סוג הכלי המחלץ ריק \n";
			// }
		}
		if (data.pirot == "") {
			flag = false;
			ErrorReason += "  פירוט האירוע ריק \n";
		}
		if (data.mikom == "") {
			flag = false;
			ErrorReason += " ,מיקום ריק \n";
		}

		if (!data.datevent) {
			flag = false;
			ErrorReason += " ,תאריך ריק \n";
		}
		if (data.nifga == "") {
			flag = false;
			ErrorReason += "כמות הנפגעים ריקה \n";
		}

		if (flag == true) {
			FixUser(event);
		} else {
			toast.error(ErrorReason);
		}
	};

	const FixUser = (event) => {
		event.preventDefault();
		UpdateReport(event);
	};

	const UpdateReport = () => {
		var reportid = match.params.formId;
		const report = {
			name: data.name,
			lastname: data.lastname,
			personalnumber: data.personalnumber,
			cellphone: data.cellphone,
			pikod: data.pikod,
			ogda:data.ogda,
			hativa:data.hativa,
			gdod:data.gdod,
			typevent: data.typevent,
			resevent: data.resevent,
			magadal: data.magadal,
			// magad:data.magad,
			mkabaz: data.mkabaz,
			yn: data.yn,
			status: data.dt != undefined || null ? data.dt : data.status,
			selneshek: data.selneshek,
			whap: data.whap,
			amlahtype: data.amlahtype,
			rekemtype: data.rekemtype,
			mazavrekem: data.mazavrekem,
			dwork: data.dwork,
			mataftype: data.mataftype,
			apitype: data.apitype,
			mholaztype: data.mholaztype,
			// mhalztype: data.mhalztype,
			pirot: data.pirot,
			datevent: data.datevent,
			mikom: data.mikom,
			nifga: data.nifga,
		};

		axios
			.put(`http://localhost:8000/report/update/${reportid}`, report)
			.then((response) => {
				toast.success(`הדיווח עודכן בהצלחה`);
				history.push(`/SummarizingReport`);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const init = () => {
		var reportid = match.params.formId;
		axios
			.get(`http://localhost:8000/report/${reportid}`)
			.then((response) => {
				let tempuser = { ...response.data };
				setData(tempuser);
			})
			.catch((error) => {
				console.log(error);
			});
		loadPikods();
		getMagadals();
	};

	useEffect(() => {
		init();
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
		setMagads([]);
		getMagads(data.magadal);
	}, [data.magadal]);

	useEffect(() => {
		setMkabazs([]);
		getMkabazs(data.magad);
	}, [data.magad]);

	useEffect(() => {
		setMkabazsMataf([]);
		getMkabazsMataf();
	}, [data.mkabaz]);

	// todo: add a way to get the mkbatz

	return (
		<div>
			<Container className="mt--8 pb-5">
				<Row className="justify-content-center">
					<Col
						lg="20"
						md="7"
					>
						<Card className="shadow border-0">
							<CardBody className="px-lg-5 py-lg-5">
								<div className="text-center text-muted mb-4">
									<big>עדכון דיווח</big>
								</div>
								<div className="text-center text-muted mb-4">
									<small>פרטי מדווח</small>
								</div>
								<Form role="form">
									<FormGroup dir="rtl">
										<Input
											placeholder="שם פרטי"
											name="name"
											type="text"
											value={data.name}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup dir="rtl">
										<Input
											placeholder="שם משפחה"
											name="lastname"
											type="text"
											value={data.lastname}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup
										className="mb-3"
										dir="rtl"
									>
										<Input
											placeholder="מספר אישי"
											name="personalnumber"
											type="string"
											maxlength="7"
											value={data.personalnumber}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup
										className="mb-3"
										dir="rtl"
									>
										<Input
											placeholder="טלפון נייד"
											name="cellphone"
											type="tel"
											maxlength="10"
											value={data.cellphone}
											onChange={handleChange}
										/>
									</FormGroup>

									<div className="text-center text-muted mb-4">
										<small>פרטי יחידה מדווחת</small>
									</div>

									<Row style={{ paddingTop: "2px" }}>
										{!data.ogda ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>פיקוד</h6>
												<Select
													data={pikods}
													handleChange2={handleChange2}
													name={"pikod"}
													val={data.pikod ? data.pikod : undefined}
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
												<h6>פיקוד</h6>
												<Select
													data={pikods}
													handleChange2={handleChange2}
													name={"pikod"}
													val={data.pikod ? data.pikod : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										<>
											{data.pikod && !data.hativa ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>אוגדה</h6>
													<Select
														data={ogdas}
														handleChange2={handleChange2}
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
														data={ogdas}
														handleChange2={handleChange2}
														name={"ogda"}
														val={data.ogda ? data.ogda : undefined}
														isDisabled={true}
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
														data={hativas}
														handleChange2={handleChange2}
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
														data={hativas}
														handleChange2={handleChange2}
														name={"hativa"}
														val={data.hativa ? data.hativa : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{data.hativa ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>גדוד</h6>
													<Select
														data={gdods}
														handleChange2={handleChange2}
														name={"gdod"}
														val={data.gdod ? data.gdod : undefined}
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
													<h6>גדוד</h6>
													<Select
														data={gdods}
														handleChange2={handleChange2}
														name={"gdod"}
														val={data.gdod ? data.gdod : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>
									</Row>

									<div
										className="text-center text-muted mb-4"
										style={{ paddingTop: "20px" }}
									>
										<small>פרטי אירוע</small>
									</div>

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										סוג אירוע
									</div>
									<FormGroup>
										<Input
											placeholder="סוג אירוע"
											type="select"
											name="typevent"
											value={data.typevent}
											onChange={handleChange}
											id="seltype"
										>
											<option value={"בחר"}>בחר</option>
											<option value={"1"}>תאונת כלי רכב</option>
											<option value={"2"}>התהפכות</option>
											<option value={"3"}>הנתקות גלגל</option>
											<option value={"4"}>שריפה</option>
											<option value={"5"}>אירועי נשק / תחמושת</option>
											<option value={"6"}>תאונת עבודה אנשי טנ"א</option>
											<option value={"7"}>פריקת מטפים</option>
											<option value={"8"}>אפידמיה</option>
											<option value={"9"}>חילוץ</option>
											<option value={"10"}>נזק לתשתיות אחזקה / הח"י</option>
											<option value={"11"}>אי קיום שגרת אחזקה</option>
											<option value={"12"}>אחר</option>
										</Input>
									</FormGroup>

									{/* תאונת כלי רכב, שריפה, הנתקות גלגל,התהפכות */}

									{(data.typevent === "1" ||
										data.typevent === "2" ||
										data.typevent === "3" ||
										data.typevent === "4") && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סיבת האירוע
											</div>
											<FormGroup>
												<Input
													type="select"
													name="resevent"
													value={data.resevent}
													onChange={handleChange}
													id="res"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>תאונה</option>
													<option value={"2"}>כשל טכני</option>
													<option value={"3"}>טעות אנוש</option>
													<option value={"4"}>לא ידוע</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הכלי
											</div>
											<Row>
												{!data.magad ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
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
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{data.magadal && !data.mkabaz ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
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
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{data.magad && !data.makat ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מקבץ</h6>
														<Select
															data={mkabazs}
															handleChange2={handleChange2}
															name={"mkabaz"}
															val={data.mkabaz ? data.mkabaz : undefined}
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
														<h6>מקבץ</h6>
														<Select
															data={mkabazs}
															handleChange2={handleChange2}
															name={"mkabaz"}
															val={data.mkabaz ? data.mkabaz : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</Row>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												האם נגרם נזק לכלי
											</div>
											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="yn"
															value={true}
															onChange={handleChange}
															id="YES"
														/>
														כן
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="NO"
															name="yn"
															value={false}
															onChange={handleChange}
														/>
														לא
													</div>
												</FormGroup>
											</div>
										</>
									)}

									{/* אירוע נשק */}

									{data.typevent === "5" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הנשק
											</div>
											<FormGroup>
												<Input
													type="select"
													name="selneshek"
													value={data.selneshek}
													onChange={handleChange}
													id="neshek"
												>
													<option value={"0"}>בחר</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												האם נגרם נזק לנשק
											</div>

											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="yn"
															value={true}
															onChange={handleChange}
															id="YES"
														/>
														כן
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="NO"
															name="yn"
															value={false}
															onChange={handleChange}
														/>
														לא
													</div>
												</FormGroup>
											</div>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												מה התרחש באירוע
											</div>
											<FormGroup>
												<Input
													type="select"
													name="whap"
													value={data.whap}
													onChange={handleChange}
													id="what"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>פיצוץ נשק</option>
													<option value={"2"}>פיצוץ תחמושת</option>
													<option value={"3"}>פליטת כדור</option>
													<option value={"4"}>גרימת נזק לנשק</option>
													<option value={"5"}>אחר</option>
												</Input>
											</FormGroup>
										</>
									)}

									{/*  תאונת עבודה אנשי טנ"א */}

									{data.typevent === "6" && (
										<>
											<p
												style={{
													textAlign: "right",
													color: "red",
													fontSize: "10px",
												}}
											>
												{" "}
												*תאונת עבודה - כל אירוע בו קיים ימי מחלה (מיום מחלה אחד
												ומעלה)
											</p>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												מתי נפגע
											</div>
											<FormGroup>
												<Input
													type="select"
													name="wnifga"
													value={data.wnifga}
													onChange={handleChange}
													id="when"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>במהלך פעילות אחזקתית</option>
													<option value={"2"}>במהלך פעילות שגרתית</option>
													<option value={"3"}>תרגיל</option>
													<option value={"4"}>פעילות מבצעית</option>
													<option value={"5"}>אחר</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												ממה נפגע
											</div>
											<FormGroup>
												<Input
													type="text"
													name="amlahtype"
													value={data.amlahtype}
													onChange={handleChange}
													id="amlah"
												></Input>
											</FormGroup>
										</>
									)}

									{/* פריקת מטפים*/}

									{/*//* ------- פריקת מטפים ------------------*/}

									{data.typevent === "7" && (
										<>
											<Row>
												{!data.magad ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
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
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{!data.magadal && !data.mkabaz ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
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
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{!data.magad && !data.makat ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מקבץ</h6>
														<Select
															data={mkabazsMataf}
															handleChange2={matafHandleChange}
															val={data.mkabaz ? data.mkabaz : undefined}
															id="mkabazM"
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
														<h6>מקבץ</h6>
														<Select
															data={mkabazsMataf}
															handleChange2={matafHandleChange}
															val={data.mkabaz ? data.mkabaz : undefined}
															isDisabled={true}
															id="mkabazM"
														/>
													</Col>
												)}
											</Row>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג המטף
											</div>
											<FormGroup>
												{/* {console.log(mkabazsMataf)} */}
												{/* {console.log(mkabazsMataf[indexM])}
												{console.log(mkabazsMataf[indexM].matafEngine)}
												{console.log(mkabazsMataf[indexM].matafCre)} */}

												{mkabazsMataf[indexM] ==
												undefined ? null : mkabazsMataf[indexM].matafEngine &&
												  mkabazsMataf[indexM].matafCre ? (
													<Input
														type="select"
														name="mataftype"
														value={data.mataftype}
														onChange={handleChange}
														id="mataf"
													>
														<option value={"0"}>בחר</option>
														<option value={"1"}>תא מנוע</option>
														<option value={"2"}>תא צוות</option>
														<option value={"3"}>תא מנוע ותא צוות</option>
													</Input>
												) : mkabazsMataf[indexM].matafEngine ? (
													<Input
														type="select"
														name="mataftype"
														value={data.mataftype}
														onChange={handleChange}
														id="mataf"
													>
														<option value={"0"}>בחר</option>
														<option value={"1"}>תא מנוע</option>
													</Input>
												) : mkabazsMataf[indexM].matafCre ? (
													<Input
														type="select"
														name="mataftype"
														value={data.mataftype}
														onChange={handleChange}
														id="mataf"
													>
														<option value={"0"}>בחר</option>
														<option value={"2"}>תא צוות</option>
													</Input>
												) : (
													<Input
														type="select"
														name="mataftype"
														value={data.mataftype}
														onChange={handleChange}
														id="mataf"
													>
														<option value={"0"}>בחר</option>
														<option value={""}>לא נמצאו כלים </option>
													</Input>
												)}
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												מצב הרק"ם במהלך הפריקה
											</div>
											<FormGroup>
												<Input
													type="select"
													name="mazavrekem"
													value={data.mazavrekem}
													onChange={handleChange}
													id="mazav"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>סטטי</option>
													<option value={"2"}>בתנועה</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												האם בוצע במהלך עבודה
											</div>
											<FormGroup>
												<Input
													type="select"
													name="dwork"
													value={data.dwork}
													onChange={handleChange}
													id="dwork"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>אחזקתית טנ"א</option>
													<option value={"2"}>תקשוב</option>
												</Input>
											</FormGroup>

											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												במהלך פירוק / הרכבה
											</div>

											<div style={{ textAlign: "right" }}>
												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															name="yn"
															value={true}
															onChange={handleChange}
															id="YES"
														/>
														כן
													</div>
												</FormGroup>

												<FormGroup
													check
													inline
												>
													<div
														style={{ textAlign: "right", paddingTop: "10px" }}
													>
														<Input
															type="radio"
															id="NO"
															name="yn"
															value={false}
															onChange={handleChange}
														/>
														לא
													</div>
												</FormGroup>
											</div>
										</>
									)}

									{/* אפידמיה */}

									{data.typevent === "8" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג האפידמיה
											</div>
											<FormGroup>
												<Input
													type="select"
													name="apitype"
													value={data.apitype}
													onChange={handleChange}
													id="apidmia"
												>
													<option value={"0"}>בחר</option>
													<option value={"1"}>תפעולית</option>
													<option value={"2"}>אחזקתית</option>
												</Input>
											</FormGroup>
										</>
									)}

									{/*//* -------------- חילוץ  ----------*/}

									{data.typevent === "9" && (
										<>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												סוג הכלי המחולץ
											</div>
											<Row>
												{!data.magad ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
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
														<h6>מאגד על</h6>
														<Select
															data={magadals}
															handleChange2={handleChange2}
															name={"magadal"}
															val={data.magadal ? data.magadal : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{data.magadal && !data.mkabaz ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
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
														<h6>מאגד</h6>
														<Select
															data={magads}
															handleChange2={handleChange2}
															name={"magad"}
															val={data.magad ? data.magad : undefined}
															isDisabled={true}
														/>
													</Col>
												)}

												{data.magad && !data.makat ? (
													<Col
														style={{
															justifyContent: "right",
															alignContent: "right",
															textAlign: "right",
														}}
													>
														<h6>מקבץ</h6>
														<Select
															data={mkabazs}
															handleChange2={handleChange2}
															name={"mkabaz"}
															val={data.mkabaz ? data.mkabaz : undefined}
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
														<h6>מקבץ</h6>
														<Select
															data={mkabazs}
															handleChange2={handleChange2}
															name={"mkabaz"}
															val={data.mkabaz ? data.mkabaz : undefined}
															isDisabled={true}
														/>
													</Col>
												)}
											</Row>
											{/* <div style={{ textAlign: "right", paddingTop: "10px" }}>
        סוג הכלי המחלץ
      </div>
     <FormGroup>
        <Input
          type="select"
          name="mhalztype"
          value={data.mhalztype}
          onChange={handleChange}
          id="mhalz"
        >
          <option value={"0"}>בחר</option>
        </Input>
      </FormGroup>
*/}
										</>
									)}
									{/*//* ------------- status checker ------------------ */}
									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										סטטוס
									</div>
									<div style={{ textAlign: "right" }}>
										<FormGroup
											check
											inline
										>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<Input
													type="radio"
													name="dt"
													value="1"
													onChange={handleChange}
													id="delt"
												/>
												סגור
											</div>
										</FormGroup>

										<FormGroup
											check
											inline
										>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<Input
													type="radio"
													id="notDelt"
													name="dt"
													value="0"
													onChange={handleChange}
												/>
												בטיפול
											</div>
										</FormGroup>
									</div>

									<FormGroup dir="rtl">
										<Input
											placeholder="פירוט האירוע"
											name="pirot"
											type="textarea"
											value={data.pirot}
											onChange={handleChange}
										/>
									</FormGroup>

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										תאריך אירוע
									</div>
									<FormGroup dir="rtl">
										<Input
											placeholder="תאריך אירוע"
											name="datevent"
											type="datetime-local"
											value={data.datevent.slice(0, 21)}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup dir="rtl">
										<Input
											placeholder="מיקום האירוע"
											name="mikom"
											type="string"
											value={data.mikom}
											onChange={handleChange}
										/>
									</FormGroup>

									<FormGroup dir="rtl">
										<Input
											placeholder="כמה נפגעים היו באירוע"
											name="nifga"
											type="number"
											value={data.nifga}
											onChange={handleChange}
										/>
									</FormGroup>
									{/* 
       {data.nifga > "0" && (
        <>
          <div style={{ textAlign: "right", paddingTop: "10px" }}>
            מצב הנפגע
          </div>
          <FormGroup>
            <Input
              type="select"
              name="mazavnifga"
              value={data.mazavnifga}
              onChange={handleChange}
              id="mazav"
            >
              <option value={"0"}>בחר</option>
              <option value={"1"}>קל</option>
              <option value={"2"}>בינוני</option>
              <option value={"3"}>קשה</option>
              <option value={"4"}>נהרג</option>
            </Input>
          </FormGroup>

          <FormGroup dir="rtl">
        <Input
          placeholder="מיקום הפגיעה בגוף"
          name="mikompgia"
          type="string"
          value={data.mikompgia}
          onChange={handleChange}
        />
      </FormGroup> 
      <div style={{ textAlign: 'right', paddingTop: '10px' }}>
      <button
    //    onClick={clickSubmit} 
       className="btn btn-primary">
          +
     </button>
     </div>
      </>
      )} */}

									<div className="text-center">
										<button
											onClick={clickSubmit}
											className="btn-new-blue"
										>
											עדכן
										</button>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
export default withRouter(EditReport);
