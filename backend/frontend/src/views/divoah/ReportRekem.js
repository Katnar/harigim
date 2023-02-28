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
} from "reactstrap";
import axios from "axios";
import history from "history.js";
import { toast } from "react-toastify";
import { produce } from "immer";
import { generate } from "shortid";
import { isAuthenticated } from "auth";
import MultiSelect from "components/general/Select/AnimatedMultiSelect";
import Select from "components/general/Select/AnimatedSelect";
import deletepic from "assets/img/delete.png";
import CarTypesFilterObjectRekem from "components/general/CarTypeFilter/CarTypesFilterObjectRekem";
import Background from "components/general/Background/Background";

const Report = ({ props }) => {
	const { user } = isAuthenticated();
	const digits_only = (string) =>
		[...string].every((c) => "0123456789".includes(c));
	const [infohurtarray, setinfohurtarray] = useState([]);
	const [cartypesfilterarray, setCartypesfilterarray] = useState([]);

	const [data, setData] = useState({
		name: "",
		lastname: "",
		personalnumber: "",
		cellphone: "",
		pikodrep: "",
		ogdarep: "",
		hativarep: "",
		gdod: "",
		gdodrep: "",
		mkabaz: "",
		arraymkabaz: [],
		zadik: "",
		typevent: "רקם",
		resevent: "0",
		cli: "0",
		yn: "",
		selneshek: "0",
		whap: "0",
		amlahtype: "0",
		rekemtype: "0",
		mazavrekem: "0",
		dwork: "0",
		mataftype: "0",
		apitype: "0",
		mholaztype: "0",
		// mhalztype:"0",
		pirot: "",
		datevent: "",
		mikom: "",
		nifga: "",
		dt: "0",
		hurtarray: [],

		error: false,
		successmsg: false,
		loading: false,
		redirectToReferrer: false,
	});

	//* pikod data
	const [gdods, setGdods] = useState([]);
	const [hativas, setHativas] = useState([]);
	const [ogdas, setOgdas] = useState([]);
	const [pikods, setPikods] = useState([]);
	//* pikodrep data
	const [gdodsrep, setGdodsrep] = useState([]);
	const [hativasrep, setHativasrep] = useState([]);
	const [ogdasrep, setOgdasrep] = useState([]);
	const [pikodsrep, setPikodsrep] = useState([]);
	// * cardata
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
				//? should work need to test on real db
				.get(`http://localhost:8000/api/mkabaz/mkabazsbyrekem/${magadid}`)
				.then((response) => {
					for (let j = 0; j < response.data.length; j++)
						tempmagadmkabazs.push(response.data[j]);
				})
				.catch((error) => {
					console.log(error);
				});
			console.log(tempmagadmkabazs);
			setMkabazs(tempmagadmkabazs);
		}
	};

	//* manmarit
	const loadPikods = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				setPikods(response.data);
				// setPikodsrep(response.data);
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
		// setOgdasrep(temppikodsogdas);
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
		// setHativasrep(tempogdashativas)
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
		// setGdodsrep(temphativasgdods);
	};

	//* rep

	const loadPikodsrep = async () => {
		await axios
			.get("http://localhost:8000/api/pikod")
			.then((response) => {
				// setPikods(response.data);
				setPikodsrep(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const loadOgdasrep = async (pikodids) => {
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
		// setOgdas(temppikodsogdas);
		setOgdasrep(temppikodsogdas);
	};

	const loadHativasrep = async (ogdaids) => {
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
		// setHativas(tempogdashativas);
		setHativasrep(tempogdashativas);
	};

	const loadGdodsrep = async (hativaids) => {
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
		// setGdods(temphativasgdods);
		setGdodsrep(temphativasgdods);
	};

	//* handle changes

	function handleChange(evt) {
		const value = evt.target.value;
		if (evt.target.name != "cellphone" && evt.target.name != "zadik") {
			setData({ ...data, [evt.target.name]: value });
		} else {
			if (digits_only(value)) {
				setData({ ...data, [evt.target.name]: value });
			} else {
				// console.log("you used letter in the phone number");
				toast.error("לא ניתן לכתוב אותיות בשדה זה");
			}
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
			ErrorReason += " ,שם ריק \n";
		}
		if (data.lastname == "") {
			flag = false;
			ErrorReason += " ,שם משפחה ריק \n";
		}
		if (data.personalnumber == "") {
			flag = false;
			ErrorReason += " ,מס אישי ריק \n";
		}
		if (data.cellphone == "") {
			flag = false;
			ErrorReason += " ,טלפון ריק \n";
		}
		// if (
		//   document.getElementById("pikod").options[
		//     document.getElementById("pikod").selectedIndex
		//   ].value == "בחר"
		// ) {
		//   flag = false;
		//   ErrorReason += " פיקוד ריק \n";
		// }
		// if (
		//   document.getElementById("ogda").options[
		//     document.getElementById("ogda").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " אוגדה ריק \n";
		// }
		// if (
		//   document.getElementById("hativa").options[
		//     document.getElementById("hativa").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " חטיבה ריק \n";
		// }
		// if (
		//   document.getElementById("gdod").options[
		//     document.getElementById("gdod").selectedIndex
		//   ].value == "0"
		// ) {
		//   flag = false;
		//   ErrorReason += " גדוד ריק \n";
		// }
		if (
			document.getElementById("res").options[
				document.getElementById("res").selectedIndex
			].value == "0"
		) {
			flag = false;
			ErrorReason += " ,סיבת האירוע ריקה \n";
		}
		// if (
		// 	document.getElementById("sel").options[
		// 		document.getElementById("sel").selectedIndex
		// 	].value == "0"
		// ) {
		// 	flag = false;
		// 	ErrorReason += " ,סוג הרקם ריק \n";
		// }
		if (
			!document.getElementById("YES").checked &&
			!document.getElementById("NO").checked
		) {
			flag = false;
			ErrorReason += " ,אם נגרם נזק ריק \n";
		}
		if (
			!document.getElementById("delt").checked &&
			!document.getElementById("notDelt").checked
		) {
			flag = false;
			ErrorReason += " ,אם נגרם נזק לכלי ריק \n";
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
			SendFormData(event);
		} else {
			toast.error(ErrorReason);
		}
	};

	const SendFormData = (event) => {
		event.preventDefault();
		setData({
			...data,
			loading: true,
			successmsg: false,
			error: false,
			NavigateToReferrer: false,
		});
		const requestData = {
			name: data.name,
			lastname: data.lastname,
			personalnumber: data.personalnumber,
			cellphone: data.cellphone,
			pikodrep: data.pikodrep,
			ogdarep: data.ogdarep,
			hativarep: data.hativarep,
			gdod: data.gdod,
			gdodrep: data.gdodrep,
			mkabaz: data.mkabaz,
			arraymkabaz: cartypesfilterarray,
			zadik: data.zadik,
			dt: data.dt,
			typevent: data.typevent,
			resevent: data.resevent,
			yn: data.yn,
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
			hurtarray: infohurtarray,
		};
		console.log("In the SendFormData Func");
		console.log(requestData);

		console.groupCollapsed("Axios");

		if (!requestData.gdod == "") {
			if (!requestData.gdodrep == "") {
				axios
					.post(`http://localhost:8000/report/add`, requestData)
					.then((res) => {
						console.groupCollapsed("Axios then");
						console.log(res);
						setData({
							...data,
							loading: false,
							error: false,
							successmsg: true,
						});
						toast.success(` הדיווח נשלח בהצלחה`);
						if (user.role == "0") {
							history.push(`/odot`);
						} else if (user.role == "1") {
							history.push(`/dashamal`);
						} else if (user.role == "2") {
							history.push(`/dashadmin`);
						}
						console.log(res.data);
						console.groupEnd();
					})
					.catch((error) => {
						console.groupCollapsed("Axios catch error");
						console.log(error);
						toast.error("שגיאה בשליחת הדיווח");
						setData({
							...data,
							errortype: error.response.data.error,
							loading: false,
							error: true,
						});
						console.groupEnd();
					});
				console.groupEnd();
			} else {
				toast.error("לא הוזנה יחידה מדווחת");
			}
		} else {
			toast.error("לא הוזנה יחידה מנמרית");
		}
	};

	const initWithUserData = () => {
		setData({
			...data,
			name: user.name,
			lastname: user.lastname,
			personalnumber: user.personalnumber,
		});
		loadPikods();
		loadPikodsrep();
		getMagadals();
	};

	useEffect(() => {
		initWithUserData();
	}, []);

	// * ------ manmarit --------------------------------
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
	//* ------ rep ----------------------------------------------------------------
	useEffect(() => {
		setOgdasrep([]);
		loadOgdasrep(data.pikodrep);
	}, [data.pikodrep]);

	useEffect(() => {
		setHativasrep([]);
		loadHativasrep(data.ogdarep);
	}, [data.ogdarep]);

	useEffect(() => {
		setGdodsrep([]);
		loadGdodsrep(data.hativarep);
	}, [data.hativarep]);
	//* ------ magdal .... --------------------------------
	useEffect(() => {
		setMagads([]);
		getMagads(data.magadal);
	}, [data.magadal]);

	useEffect(() => {
		setMkabazs([]);
		getMkabazs(data.magad);
	}, [data.magad]);

	useEffect(() => {
		setMkabazs([]);
		getMkabazs();
	}, [data.mkabaz]);

	useEffect(() => {
		setCartypesfilterarray([]);
	}, []);

	return (
		<Background>
			<Container className="mt--8 pb-5">
				<Row className="justify-content-center">
					<Col
						lg="20"
						md="7"
					>
						<Card className="shadow border-0">
							<CardBody className="px-lg-5 py-lg-5">
								<div className="text-center text-muted mb-4">
									<big>שליחת דיווח</big>
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

									{/*//* --------------------------------------- rep ------------------------------------------- */}
									<div className="text-center text-muted mb-4">
										<small>פרטי יחידה מדווחת</small>
									</div>

									<Row style={{ paddingTop: "2px" }}>
										{!data.ogdarep ? (
											<Col
												style={{
													justifyContent: "right",
													alignContent: "right",
													textAlign: "right",
												}}
											>
												<h6>פיקוד</h6>
												<Select
													data={pikodsrep}
													handleChange2={handleChange2}
													name={"pikodrep"}
													val={data.pikodrep ? data.pikodrep : undefined}
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
													data={pikodsrep}
													handleChange2={handleChange2}
													name={"pikodrep"}
													val={data.pikodrep ? data.pikodrep : undefined}
													isDisabled={true}
												/>
											</Col>
										)}

										<>
											{data.pikodrep && !data.hativarep ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>אוגדה</h6>
													<Select
														data={ogdasrep}
														handleChange2={handleChange2}
														name={"ogdarep"}
														val={data.ogdarep ? data.ogdarep : undefined}
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
														data={ogdasrep}
														handleChange2={handleChange2}
														name={"ogdarep"}
														val={data.ogdarep ? data.ogdarep : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{data.ogdarep && !data.gdodrep ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>חטיבה</h6>
													<Select
														data={hativasrep}
														handleChange2={handleChange2}
														name={"hativarep"}
														val={data.hativarep ? data.hativarep : undefined}
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
														data={hativasrep}
														handleChange2={handleChange2}
														name={"hativarep"}
														val={data.hativarep ? data.hativarep : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>

										<>
											{data.hativarep ? (
												<Col
													style={{
														justifyContent: "right",
														alignContent: "right",
														textAlign: "right",
													}}
												>
													<h6>גדוד</h6>
													<Select
														data={gdodsrep}
														handleChange2={handleChange2}
														name={"gdodrep"}
														val={data.gdodrep ? data.gdodrep : undefined}
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
														data={gdodsrep}
														handleChange2={handleChange2}
														name={"gdodrep"}
														val={data.gdodrep ? data.gdodrep : undefined}
														isDisabled={true}
													/>
												</Col>
											)}
										</>
									</Row>
									{/* //* ----------------------------------------- manmarit ---------------------------------------------- */}

									<div className="text-center text-muted mb-4">
										<small>פרטי יחידה מנמרית</small>
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
											<option value={"4"}>טעות אנוש</option>
											<option value={"3"}>לא ידוע</option>
										</Input>
									</FormGroup>

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										סוג הרק"ם
									</div>
									<Row style={{ padding: "0px" }}>
										<Col
											style={{
												display: "flex",
												justifyContent: "right",
												paddingTop: "15px",
												paddingRight: "0px",
											}}
										>
											<Button
												style={{ width: "100px", padding: "10px" }}
												type="button"
												onClick={() => {
													setCartypesfilterarray((currentSpec) => [
														...currentSpec,
														{ id: generate() },
													]);
												}}
											>
												הוסף רק"ם
											</Button>
										</Col>
									</Row>

									{cartypesfilterarray.map((cartypesfilterobject, index) => {
										return (
											<CarTypesFilterObjectRekem
												user={user}
												cartypesfilterobject={cartypesfilterobject}
												index={index}
												setCartypesfilterarray={setCartypesfilterarray}
											/>
										);
									})}

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										האם נגרם נזק לרק"ם
									</div>

									<div style={{ textAlign: "right" }}>
										<FormGroup
											check
											inline
										>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
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
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
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

									{/* //* ------------------ dt checker ----------------------- */}
									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										האם מצריך המשך טיפול
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
												כן
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
												לא
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
											value={data.datevent}
											onChange={handleChange}
											min={"1900-01-01T00:00:00"}
											max={"2100-01-01T00:00:00"}
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

									<div style={{ textAlign: "right", paddingTop: "10px" }}>
										האם יש נפגעים
									</div>
									<div
										className="mb-2"
										style={{ textAlign: "right" }}
									>
										<FormGroup
											check
											inline
										>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<Input
													// placeholder="ללא נפגעים "
													name="nifga"
													type="radio"
													value="1"
													onChange={handleChange}
												/>
												כן
											</div>
										</FormGroup>

										<FormGroup
											check
											inline
										>
											<div style={{ textAlign: "right", paddingTop: "10px" }}>
												<Input
													// placeholder="הוסף נפגעים"
													name="nifga"
													type="radio"
													value="0"
													onChange={handleChange}
												/>
												ללא נפגעים
											</div>
										</FormGroup>
									</div>

									{data.nifga > "0" && (
										<>
											<div>
												{infohurtarray.length == 0 ? (
													<Row>
														<Col
															style={{ display: "flex", textAlign: "right" }}
														>
															<Button
																style={{ width: "100px", padding: "5px" }}
																type="button"
																onClick={() => {
																	setinfohurtarray((currentSpec) => [
																		...currentSpec,
																		{ id: generate() },
																	]);
																}}
															>
																הוסף נפגע
															</Button>
														</Col>
													</Row>
												) : (
													infohurtarray.map((p, index) => {
														return (
															<div>
																{index == 0 ? (
																	<Row>
																		<Col
																			style={{
																				display: "flex",
																				textAlign: "right",
																			}}
																		>
																			<Button
																				style={{
																					width: "100px",
																					padding: "5px",
																				}}
																				type="button"
																				onClick={() => {
																					setinfohurtarray((currentSpec) => [
																						...currentSpec,
																						{ id: generate() },
																					]);
																				}}
																			>
																				הוסף נפגע
																			</Button>
																		</Col>
																	</Row>
																) : null}
																{
																	<Row>
																		<Col
																			xs={12}
																			md={4}
																		>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					דרגת הפציעה
																				</p>
																				<Input
																					onChange={(e) => {
																						const dargahurt = e.target.value;
																						if (e.target.value != "בחר")
																							setinfohurtarray((currentSpec) =>
																								produce(currentSpec, (v) => {
																									v[index].dargahurt =
																										dargahurt;
																								})
																							);
																					}}
																					value={p.dargahurt}
																					type="select"
																					placeholder="דרגת הפציעה"
																				>
																					<option value={"בחר"}>{"בחר"}</option>
																					<option value={"קל"}>{"קל"}</option>
																					<option value={"בינוני"}>
																						{"בינוני"}
																					</option>
																					<option value={"קשה"}>{"קשה"}</option>
																					<option value={"מת"}>{"מת"}</option>
																				</Input>
																			</div>
																		</Col>
																		<Col
																			xs={12}
																			md={4}
																		>
																			<div>
																				<p
																					style={{
																						margin: "0px",
																						float: "right",
																					}}
																				>
																					מספר ימי מחלה
																				</p>
																				<Input
																					onChange={(e) => {
																						const mikomhurt = e.target.value;
																						if (e.target.value != "")
																							setinfohurtarray((currentSpec) =>
																								produce(currentSpec, (v) => {
																									v[index].mikomhurt =
																										mikomhurt;
																								})
																							);
																					}}
																					value={p.mikomhurt}
																					type="number"
																					placeholder="0"
																				/>
																			</div>
																		</Col>
																	</Row>
																}
																<Button
																	type="button"
																	onClick={() => {
																		setinfohurtarray((currentSpec) =>
																			currentSpec.filter((x) => x.id !== p.id)
																		);
																	}}
																>
																	<img
																		src={deletepic}
																		height="20px"
																	></img>
																</Button>
															</div>
														);
													})
												)}
											</div>
										</>
									)}

									<div className="text-center">
										<button
											onClick={clickSubmit}
											className="btn-new-blue"
										>
											שליחה
										</button>
									</div>
								</Form>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Background>
	);
};
export default withRouter(Report);
