import React, { useState, useEffect } from "react";
import { withRouter, Redirect } from "react-router-dom";

// reactstrap components
import {
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
		if (
			document.getElementById("sel").options[
				document.getElementById("sel").selectedIndex
			].value == "0"
		) {
			flag = false;
			ErrorReason += " ,סוג הרקם ריק \n";
		}
		if (
			!document.getElementById("YES").checked &&
			!document.getElementById("NO").checked
		) {
			flag = false;
			ErrorReason += " ,אם נגרם נזק ריק \n";
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
			// mkabaz:data.mkabaz,
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
									<big>עיכון דיווח</big>
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
									<FormGroup>
										<Input
											type="select"
											name="cli"
											value={data.cli}
											onChange={handleChange}
											id="sel"
										>
											<option value={"0"}>בחר</option>
											<option value={"1"}>סתם</option>
										</Input>
									</FormGroup>

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

									{/* {data.nifga > "0" && (
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
      //  onClick={clickSubmit} 
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
