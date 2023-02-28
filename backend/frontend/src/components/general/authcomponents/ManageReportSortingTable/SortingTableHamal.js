/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect } from "react";
import {
	useTable,
	useSortBy,
	useGlobalFilter,
	useFilters,
	usePagination,
} from "react-table";
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
import { withRouter, Redirect, Link } from "react-router-dom";
import { COLUMNSSUM } from "./ColumnsSum";
import { GlobalFilter } from "./GlobalFilter";
import CarDataFormModal from "views/divoah/CarDataFormModal";
import CarDataFormModalView from "views/divoah/CarDataFormModalView";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { isAuthenticated } from "auth";
import history from "history.js";
import { toast } from "react-toastify";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const SortingTableHamal = ({ match }) => {
	const columns = useMemo(() => COLUMNSSUM, []);
	const { user } = isAuthenticated();
	const [data, setData] = useState([]);
	const [isError, setIsError] = useState(false);
	//* the difference between the date the report was created and the date the incident happened
	const [diff, setDiff] = useState([]);
	//* check if the report was created for more than 30 days
	const [expired, setExpired] = useState([]);
	//*cardata form modal
	const [iscardataformopen, setIscardataformopen] = useState(false);
	const [cardataidformodal, setCardataidformodal] = useState(undefined);
	//* view modal
	const [isviewmodalopen, setisviewmodalopen] = useState(false);
	const [viewmodalid, setViewmodalid] = useState(undefined);

	const [reportDBPikod, setReportDBPikod] = useState([]);

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

	const [date, setDate] = useState([]);

	const [collapseOpen, setcollapseOpen] = React.useState(false);
	const toggleCollapse = () => {
		setcollapseOpen(!collapseOpen);
	};

	const animatedComponents = makeAnimated();


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
				if (name.name == "gdod") {
					delete data.gdod;
					setData({ ...data });
				}
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

	// ! alternative is to enter the timestamp to the database and then call it like we do with the other columns
	// * ------ geting only on loading the difference btween the dates --------------------------------

	useEffect(() => {
		console.log(user.personalnumber);
		if (user.role == "0") {
			history.push(`/historeport`);
		}
		// console.log(data.length);
		// * ------ making the dates subtractable --------------------------------
		//* created at:
		const creatArray = data.map((item, index) => {
			return new Date(data[index].createdAt);
		});
		//* the date the incident happened:
		const dateArray = data.map((item, index) => {
			return new Date(data[index].datevent);
		});
		//* today:
		const today = new Date();

		// * ---------- makeing sure that there are not any problems --------------------------------
		try {
			setDiff(
				creatArray.map((item, index) => {
					//* ~~ == Math.floor
					return ~~(
						(creatArray[index].getTime() - dateArray[index].getTime()) /
						86400000
					);
				})
			);
			// console.log(diff);
			// todo: maybe to reload the page if error
		} catch (error) {
			console.log(error);
		}
		try {
			setExpired(
				creatArray.map((item, index) => {
					let sum = ~~(
						(today.getTime() - creatArray[index].getTime()) /
						86400000
					);
					// console.log(`today is ${today}`);
					// console.log(creatArray[index]);
					// console.log(`${sum > 30} at ${index}`);
					return sum > 30;
				})
			);
		} catch (error) {
			console.log(error);
		}
		// console.log(expired);
	}, [data]);

	function handleChange(evt) {
		const value = evt.target.value;
		console.log(evt.target.value);
		console.log(evt.target.name);
		setDate({ ...date, [evt.target.name]: value });
		console.log(new Date(date.fromdate).setHours(0, 0, 0, 0));
		console.log(date.todate)
	}

	//* ------------ modal --------------------------------

	function Toggle(evt) {
		let index = +evt.currentTarget.id;
		console.log(index);
		console.log(expired[index]);
		if (!evt.currentTarget.value == "") {
			if (expired[index] == true) {
				toast.error("עברו שלושים ימים מאז שהדוח הוזן לא ניתן לערוך אותו");
			} else {
				if (evt.currentTarget.value == "") {
					setCardataidformodal(undefined);
				} else {
					setCardataidformodal(evt.currentTarget.value);
				}
				setIscardataformopen(!iscardataformopen);
			}
		} else {
			if (evt.currentTarget.value == "") {
				setCardataidformodal(undefined);
			} else {
				setCardataidformodal(evt.currentTarget.value);
			}
			setIscardataformopen(!iscardataformopen);
			// console.log(cardataidformodal);
		}
	}

	function ToggleForModal(evt) {
		setIscardataformopen(!iscardataformopen);
		window.location.reload();
	}

	//* ------------ modal view --------------------------------

	function ToggleView(evt) {
		if (evt.currentTarget.value == "") {
			setViewmodalid(undefined);
		} else {
			setViewmodalid(evt.currentTarget.value);
		}
		setisviewmodalopen(!isviewmodalopen);
		// console.log(cardataidformodal);
	}

	function ToggleForModalView(evt) {
		setisviewmodalopen(!isviewmodalopen);
		window.location.reload();
	}

	// ? -------------- idk if needs to be in admin route -----------------------
	//units

	// const UserDelete = (UserId) => {
	// 	axios
	// 		.post(`http://localhost:8000/api/user/remove/${UserId}`)
	// 		.then((response) => {
	// 			loadUsers();
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// };

	// const loadUsers = () => {
	// 	axios
	// 		.get("http://localhost:8000/api/usersvalidated")
	// 		.then((response) => {
	// 			setData(response.data);
	// 		})
	// 		.catch((error) => {
	// 			console.log(error);
	// 		});
	// };

	// ? ------------------- was commented out ---------------------------------
	// useEffect(() => {
	//   (async () => {
	//     console.log("================================================");
	//     console.log(user.personalnumber);
	//     const result = await axios.get(
	//       `http://localhost:8000/report/requestByPersonalnumber/${user.personalnumber}`
	//     );
	//     console.log(result);
	//     setData(result.data);
	//   })();
	// }, []);

	useEffect(() => {
		user.role === "2"
			? axios
					.get(`http://localhost:8000/report/`)
					.then((response) => {
						const reports = response.data;
						reports.reverse();
						// console.log(reports);
						setData(reports);
					})
					.catch((error) => {
						console.log(error);
						setIsError(true);
					})
			: axios
					.get(`http://localhost:8000/report/pikod/${user.pikod}`)
					.then((response) => {
						console.log(user.pikod);
						console.log(response.data);
						setData(response.data);
					})
					.catch((error) => {
						console.log(error);
						setIsError(true);
					});
	}, []);

	useEffect(() => {
		loadPikods();
		loadGdodim();
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


	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		footerGroups,

		page,
		prepareRow,
		canPreviousPage,
		canNextPage,
		pageOptions,
		pageCount,
		gotoPage,
		nextPage,
		previousPage,
		setPageSize,
		state: { pageIndex, pageSize, globalFilter },
		setGlobalFilter,
	} = useTable(
		{
			columns,
			data,
			initialState: { pageIndex: 0 },
		},

		useGlobalFilter,
		useFilters,
		useSortBy,
		usePagination
	);

	return (
		<>
		<Row>
					<div style={{ width: "100%", margin: "auto", textAlign: "right" }}>
						<Button
							onClick={toggleCollapse}
							style={{}}
						>
							סינון
						</Button>
						<Collapse isOpen={collapseOpen}>
							<Card style={{ background: "rgb(255, 255, 255)" }}>
								<Row style={{ margin: "0px" }}>
									<Col
										xs={12}
										md={8}
										style={{ textAlign: "right" }}
									>
									<Row>
                                     <Col xs={12} md={6}>
                                       <div style={{ textAlign: 'right' }}>מתאריך</div>
                                       <Input placeholder="תאריך התחלה" type="date" name="fromdate" value={date.fromdate} onChange={handleChange} />
                                     </Col>
                                     <Col xs={12} md={6}>
                                       <div style={{ textAlign: 'right' }}>עד תאריך</div>
                                       <Input placeholder="תאריך סיום" type="date" name="todate" value={date.todate} onChange={handleChange}/>
                                     </Col>
                                    </Row> 
									</Col>
								</Row>
								{user.role === "2" ? (
								<Row style={{ margin: "0px" }}>
									<Col
										xs={12}
										md={8}
										style={{ textAlign: "right" }}
									>
										<Row style={{ paddingTop: "10px", marginBottom: "15px" }}>
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
														closeMenuOnSelect={false}
														components={animatedComponents}
														isMulti
														options={pikodsop}
														// data={pikods}
														onChange={handleChange8}
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
														closeMenuOnSelect={false}
														components={animatedComponents}
														isMulti
														options={pikodsop}
														handleChange2={handleChange8}
														name={"pikod"}
														val={data.pikod ? data.pikod : undefined}
														isDisabled={true}
														// isDisabled={
														// 	!data.ogda
														// 		? true
														// 		: data.ogda.length < 1
														// 		? false
														// 		: true
														// }
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
															components={animatedComponents}
															isMulti
															options={gdodsop}
															onChange={handleChange8}
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
															components={animatedComponents}
															isMulti
															options={gdodsop}
															onChange={handleChange8}
															name={"gdod"}
															val={data.gdod ? data.gdod : undefined}
															isDisabled={true}
													/>
												</Col>
											)}
										</>
										</Row>
									</Col>
								</Row>
								):(
									<Row style={{ margin: "0px" }}>
									<Col
										xs={12}
										md={8}
										style={{ textAlign: "right" }}
									>
										<Row style={{ paddingTop: "10px", marginBottom: "15px" }}>
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
															components={animatedComponents}
															isMulti
															options={gdodsop}
															onChange={handleChange8}
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
															components={animatedComponents}
															isMulti
															options={gdodsop}
															onChange={handleChange8}
															name={"gdod"}
															val={data.gdod ? data.gdod : undefined}
															isDisabled={true}
													/>
												</Col>
											)}
										</>
										</Row>
									</Col>
								</Row>

								)}

							</Card>
						</Collapse>
					</div>
				</Row>

			<div style={{ float: "right", paddingBottom: "5px" }}>
				<ReactHTMLTableToExcel
					id="test-table-xls-button"
					className="btn-green"
					table="table-to-xls"
					filename="קובץ - סיכום דיווחים"
					sheet="קובץ - סיכום דיווחים"
					buttonText="הורד כקובץ אקסל"
					style={{ float: "right" }}
				/>
			</div>

			{/*//* ----- modals --------------------------------
				//? ++ unittype={props.unittype} unitid={props.unitid} */}
			<CarDataFormModal
				isOpen={iscardataformopen}
				cardataid={cardataidformodal}
				Toggle={Toggle}
				ToggleForModal={ToggleForModal}
			/>
			<CarDataFormModalView
				isOpen={isviewmodalopen}
				cardataid={viewmodalid}
				Toggle={ToggleView}
				ToggleForModal={ToggleForModalView}
			/>

			<GlobalFilter
				filter={globalFilter}
				setFilter={setGlobalFilter}
			/>
			<div
				className="table-responsive"
				style={{ overflow: "auto" }}
			>
				<table
					id="table-to-xls"
					{...getTableProps()}
				>
					<thead>
						{headerGroups.map((headerGroup) => (
							<tr {...headerGroup.getHeaderGroupProps()}>
								{headerGroup.headers.map((column) => (
									<th style={{ width: "20%" }}>
										<div
											{...column.getHeaderProps(column.getSortByToggleProps())}
										>
											{" "}
											{column.render("Header")}{" "}
										</div>
										<div>
											{column.canFilter ? column.render("Filter") : null}
										</div>
										<div>
											{column.isSorted
												? column.isSortedDesc
													? "🔽"
													: "⬆️"
												: ""}
										</div>
									</th>
								))}
								<th>עדכן</th>
								<th>צפייה</th>
							</tr>
						))}
					</thead>
					{date.fromdate && date.todate ? (
						<>
						<tbody {...getTableBodyProps()}>
						{page.filter((row)=>(new Date(row.original.datevent).setHours(0, 0, 0, 0) >= new Date(date.fromdate).setHours(0, 0, 0, 0) && new Date(row.original.datevent).setHours(0, 0, 0, 0) <= new Date(date.todate).setHours(0, 0, 0, 0))).map((row, index) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell) => {
										if (
											cell.column.id != "typevent" &&
											cell.column.id != "pirot" &&
											cell.column.id != "datevent"
										) {
											return (
												<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
											);
										} else {
											if (cell.column.id == "typevent") {
												if (cell.value == "1") return <td>תאונת כלי רכב</td>;
												if (cell.value == "2") return <td>התהפכות</td>;
												if (cell.value == "3") return <td>הנתקות גלגל</td>;
												if (cell.value == "4") return <td>שריפה</td>;
												if (cell.value == "5")
													return <td>אירוע נשק / תחמושת</td>;
												if (cell.value == "6")
													return <td>תאונת עבודה אנשי טנ"א</td>;
												if (cell.value == "7") return <td>פריקת מטפים</td>;
												if (cell.value == "8") return <td>אפידמיה</td>;
												if (cell.value == "9") return <td>חילוץ</td>;
												if (cell.value == "10")
													return <td>נזק לתשתיות אחזקה / הח"י</td>;
												if (cell.value == "11")
													return <td>אי קיום שגרת אחזקה</td>;
												if (cell.value == "12") return <td>אחר</td>;
												if (cell.value == "רקם") return <td>רק"ם</td>;
											}
											if (cell.column.id == "pirot") {
												return (
													<td>
														<div
															style={{
																width: "100%",
																height: "40px",
																margin: "0",
																padding: "0",
																overflow: "auto",
															}}
														>
															{cell.value}
														</div>
													</td>
												);
											}

											if (cell.column.id == "datevent") {
												return (
													<td>
														{cell.value
															.slice(0, 10)
															.split("-")
															.reverse()
															.join("-")}
													</td>
												);
											}
										}
									})}

									{row.original.typevent != "רקם" ? (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* {console.log(row.original.typevent)} */}
												<button
													className="btn-new"
													id={row.index}

													value={row.original._id}
													onClick={Toggle}
												>
													עדכן
												</button>
											</div>{" "}
										</td>
									) : (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* {console.log(row.original.typevent)} */}
												<button
													className="btn-new"
													id={row.index}
													value={row.original._id}
													onClick={Toggle}
												>
													עדכן
												</button>
											</div>{" "}
										</td>
									)}

									{/* // ? row.original._id=user._id*/}
									{/*//* -------- view report --------------- */}
									{row.original.typevent != "רקם" ? (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* // ? <button
                        className="btn-new-delete"
                        onClick={() => UserDelete(row.original._id)}
                      >
                        צפייה
                      </button> */}
												<button
													value={row.original._id}
													onClick={ToggleView}
													className="btn-new-delete"
												>
													צפייה
												</button>
											</div>
										</td>
									) : (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* // ? <button
                        className="btn-new-delete"
                        onClick={() => UserDelete(row.original._id)}
                      >
                        צפייה
                      </button> */}
												<button
													value={row.original._id}
													onClick={ToggleView}
													className="btn-new-delete"
												>
													צפייה
												</button>
											</div>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
						</>
					):(

					<tbody {...getTableBodyProps()}>
						{/* added an index so i could pull the diff for each row */}
						{page.map((row, index) => {
							prepareRow(row);
							return (
								<tr {...row.getRowProps()}>
									{row.cells.map((cell) => {
										if (
											cell.column.id != "typevent" &&
											cell.column.id != "pirot" &&
											cell.column.id != "datevent" &&
											cell.column.id != "difftime" &&
											cell.column.id != "status"
										) {
											return (
												<td {...cell.getCellProps()}>{cell.render("Cell")}</td>
											);
										} else {
											if (cell.column.id == "typevent") {
												if (cell.value == "1") return <td>תאונת כלי רכב</td>;
												if (cell.value == "2") return <td>התהפכות</td>;
												if (cell.value == "3") return <td>הנתקות גלגל</td>;
												if (cell.value == "4") return <td>שריפה</td>;
												if (cell.value == "5")
													return <td>אירוע נשק / תחמושת</td>;
												if (cell.value == "6")
													return <td>תאונת עבודה אנשי טנ"א</td>;
												if (cell.value == "7") return <td>פריקת מטפים</td>;
												if (cell.value == "8") return <td>אפידמיה</td>;
												if (cell.value == "9") return <td>חילוץ</td>;
												if (cell.value == "10")
													return <td>נזק לתשתיות אחזקה / הח"י</td>;
												if (cell.value == "11")
													return <td>אי קיום שגרת אחזקה</td>;
												if (cell.value == "12") return <td>אחר</td>;
												if (cell.value == "רקם") return <td>רק"ם</td>;
											}
											if (cell.column.id == "pirot") {
												return (
													<td>
														<div
															style={{
																width: "100%",
																height: "60px",
																margin: "0",
																padding: "0",
																overflow: "auto",
															}}
														>
															{cell.value}
														</div>
													</td>
												);
											}

											if (cell.column.id == "datevent") {
												return (
													<td>
														{cell.value
															.slice(0, 10)
															.split("-")
															.reverse()
															.join("-")}
													</td>
												);
											}

											// * ------------- added difftime --------------------------------

											if (cell.column.id == "difftime") {
												return <td>{diff[index]}</td>;
											}
											// * ------------- added status --------------------------------
											if (cell.column.id == "status") {
												if (cell.value == "0") {
													return <td>בטיפול</td>;
												}
												if (cell.value == "1") {
													return <td>סגור</td>;
												} else {
													return <td>בטיפול</td>;
												}
											}
										}
									})}
									{/*//* -------- update report --------------- */}
									{row.original.typevent != "רקם" ? (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* {console.log(row.original.typevent)} */}
												{/* <Link to={`/editreport/${row.original._id}`}> */}
												<button
													className="btn-new"
													id={row.index}
													value={row.original._id}
													onClick={Toggle}
												>
													עדכן
												</button>
											</div>{" "}
										</td>
									) : (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* {console.log(row.original.typevent)} */}
												{/* <Link to={`/editreport/${row.original._id}`}> */}
												<button
													className="btn-new"
													id={row.index}
													value={row.original._id}
													onClick={Toggle}
												>
													עדכן
												</button>
											</div>{" "}
										</td>
									)}
									{/* // ? row.original._id=user._id*/}
									{/*//* -------- view report --------------- */}
									{row.original.typevent != "רקם" ? (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* // ? <button
                        className="btn-new-delete"
                        onClick={() => UserDelete(row.original._id)}
                      >
                        צפייה
                      </button> */}
												{/* <Link to={`/wachreport/${row.original._id}`}> */}
												<button
													value={row.original._id}
													onClick={ToggleView}
													className="btn-new-delete"
												>
													צפייה
												</button>
											</div>
										</td>
									) : (
										<td role="cell">
											{" "}
											<div
												style={{
													display: "flex",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												{" "}
												{/* // ? <button
                        className="btn-new-delete"
                        onClick={() => UserDelete(row.original._id)}
                      >
                        צפייה
                      </button> */}
												{/* <Link to={`/wachreportrekem/${row.original._id}`}> */}
												<button
													value={row.original._id}
													onClick={ToggleView}
													className="btn-new-delete"
												>
													צפייה
												</button>
											</div>
										</td>
									)}
								</tr>
							);
						})}
					</tbody>
				)}

				</table>
				<div className="pagination">
					<button
						onClick={() => previousPage()}
						disabled={!canPreviousPage}
					>
						{"<"}
					</button>{" "}
					<button
						onClick={() => nextPage()}
						disabled={!canNextPage}
					>
						{">"}
					</button>{" "}
					<span>
						עמוד{" "}
						<strong>
							{pageIndex + 1} מתוך {pageOptions.length}
						</strong>{" "}
					</span>
					<span>
						| חפש עמוד:{" "}
						<input
							type="number"
							defaultValue={pageIndex + 1}
							onChange={(e) => {
								const page = e.target.value ? Number(e.target.value) - 1 : 0;
								gotoPage(page);
							}}
							style={{ width: "100px", borderRadius: "10px" }}
						/>
					</span>{" "}
					<select
						style={{ borderRadius: "10px" }}
						value={pageSize}
						onChange={(e) => {
							setPageSize(Number(e.target.value));
						}}
					>
						{[10, 20, 30, 40, 50].map((pageSize) => (
							<option
								key={pageSize}
								value={pageSize}
							>
								Show {pageSize}
							</option>
						))}
					</select>
				</div>
			</div>
		</>
	);
};
export default withRouter(SortingTableHamal);
