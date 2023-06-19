sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("bri.open_account.controller.openacntDisplay", {

		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.omodelVendor = this.getOwnerComponent().getModel("Vendor_Model");
			this.omodelCodetyp = this.getOwnerComponent().getModel("Vendor_Model");
			this.omdelItem = this.getOwnerComponent().getModel("Item_Model");
			// this.invoicfil = {
			// 	results: []
			// };
		},
		_handleRouteMatched: async function (oEvent) {
			debugger;

			var oModelData = new sap.ui.model.json.JSONModel();
			oModelData.setData(this.temjson1);
			this.getView().setModel(oModelData, "list1");
			this.getView().getModel("list1").refresh();

			this.temjson = {
				results: []
			};
			this.xBRIxI_EDSGENHD_A1TypeData = {};
			var xBRIxI_EDSGENHD_A1Type_Model = new sap.ui.model.json.JSONModel([]);
			xBRIxI_EDSGENHD_A1Type_Model.setData(this.xBRIxI_EDSGENHD_A1TypeData.results);
			this.getView().setModel(xBRIxI_EDSGENHD_A1Type_Model, "xBRIxI_EDSGENHD_A1Type_Model");

			this.xBRIxI_EDSGENHD_A2TypeData = {};
			var xBRIxI_EDSGENHD_A2Type_Model = new sap.ui.model.json.JSONModel([]);
			xBRIxI_EDSGENHD_A2Type_Model.setData(this.xBRIxI_EDSGENHD_A2TypeData);
			this.getView().setModel(xBRIxI_EDSGENHD_A2Type_Model, "xBRIxI_EDSGENHD_A2Type_Model");

			this.visibleData = {};
			var visible_Model = new sap.ui.model.json.JSONModel([]);
			visible_Model.setData(this.visibleData);
			this.getView().setModel(visible_Model, "visible_Model");
			var Parameter = oEvent.getParameter("arguments");
			var _self = this;
			_self.intno = Parameter.intno;
			_self.getView().byId("totinvval_curr").setValue("");
			_self.getView().byId("totamtpaid_curr").setValue("");
			_self.getView().byId("tcurr2").setValue("");
			_self.byId("idSwtichMode").setState(false);

			_self.getView().byId("ContChange").setTitle(_self.getView().getModel("i18n").getResourceBundle().getText(
				"Open Account Details for Tracking Number") + " " + ":" + " " + _self.intno);
			var filter = new Array();
			var filterval = new sap.ui.model.Filter("intno", sap.ui.model.FilterOperator.EQ, _self.intno);
			filter.push(filterval);
			this.omdelItem.read("/xBRIxopen_account_hdr", {
				filters: filter,
				urlParameters: {
					"$expand": "to_open_account_ITEM"
				},
				success: function (response) {
					if (response.results.length <= 0) {

					} else {
						_self.temjson = {
							results: []
						};
						_self.temjson.results = _self.temjson.results.concat(response.results);
						_self.consigncod = _self.temjson.results[0].consigncod;
						_self.lifnr = _self.temjson.results[0].lifnr;
						for (var i = 0; i < _self.temjson.results.length; i++) {
							_self.orgdate = _self.temjson.results[i].og_docdt;
							_self.og_docdt = _self.convertToSAPdate(_self.orgdate);
							_self.temjson.results[i].og_docdt = _self.og_docdt;
							_self.duedate = _self.temjson.results[i].due_date;
							_self.due_date = _self.convertToSAPdate(_self.duedate);
							_self.temjson.results[i].due_date = _self.due_date;
							_self.paydate = _self.temjson.results[i].pay_date;
							_self.pay_date = _self.convertToSAPdate(_self.paydate);
							_self.temjson.results[i].pay_date = _self.pay_date;
						}

						_self.companycodeGet();
						_self.vendorGet();
						var oModelData = new sap.ui.model.json.JSONModel();
						oModelData.setData(_self.temjson.results[0]);
						_self.getView().setModel(oModelData, "Lists");

						_self.paymntsts = _self.getView().byId("balance").getValue();
						if (_self.paymntsts > 0) {
							_self.getView().byId("paymntstt").setValue("Partially Paid");
							// _self.getView().byId("paymntstt").setText("Partially Paid");
						} else {
							_self.getView().byId("paymntstt").setValue("Fully Paid");
						}

					}
				},
				error: function (oError) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					//_self._CloseBusyDialog();
				}
			});
			await _self.getItem(_self.intno);
			_self.itemgetPort();
			_self.itemgetCountry();
			_self.OnChangeSwitch();
		},
		getItem: function (intno) {

			var _self = this;
			return new Promise(async (resolve, reject) => {
				_self._OpenBusyDialog();
				var oTable = _self.byId("idItemTtable");
				this.omdelItem.read("/xBRIxopen_account_ITEM", {
					success: function (response) {
						if (response.results.length <= 0) {
						} else {
							_self.temjson1 = {
								results: []
							};
							_self.temjson1.results = _self.temjson1.results.concat(response.results);
							_self.temjson1.results = _self.temjson1.results.filter(a => a.intno == intno);
							for (var i = 0; i < _self.temjson1.results.length; i++) {
								_self.temjson1.results[i].checked = "true";
							}
							for (var i = 0; i < _self.temjson1.results.length; i++) {
								_self.custdate = _self.temjson1.results[i].custom_boe_date;
								_self.custom_boe_date = _self.ConvertJsonDate(_self.custdate);
								_self.temjson1.results[i].custom_boe_date = _self.custom_boe_date;

								_self.custdateata = _self.temjson1.results[i].ata;
								_self.ata = _self.ConvertJsonDate(_self.custdateata);
								_self.temjson1.results[i].ata = _self.ata;

								_self.custdateatd = _self.temjson1.results[i].atd;
								_self.atd = _self.ConvertJsonDate(_self.custdateatd);
								_self.temjson1.results[i].atd = _self.atd;

								_self.custdatefkdt = _self.temjson1.results[i].fkdat;
								_self.fkdat = _self.ConvertJsonDate(_self.custdatefkdt);
								_self.temjson1.results[i].fkdat = _self.fkdat;

								_self.custdatefkdtpo_date = _self.temjson1.results[i].po_date;
								_self.po_date = _self.ConvertJsonDate(_self.custdatefkdtpo_date);
								_self.temjson1.results[i].po_date = _self.po_date;

							}

							var oModelData = new sap.ui.model.json.JSONModel();
							oModelData.setData(_self.temjson1);
							_self.getView().setModel(oModelData, "list1");

						}
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							if (_self.temjson1.results[i].checked == "true") {
								var cb = oTable.addSelectionInterval(i, i);
							}
						}
						_self._CloseBusyDialog();
						resolve();
					},

					error: function (oError) {
						MessageBox.error("Something Went Wrong . Please Try again Later");
						_self._CloseBusyDialog();
						reject();
					}
				});
			})
		},
		itemgetPort: function () {
			debugger;
			var _self = this;
			_self._OpenBusyDialog();
			// var pvalue = "PORT";
			// var prvaEncode = encodeURIComponent(pvalue);
			// _self.omodelCodetyp.read("/xBRIxCE_CODTYP(inparam='" + pvalue + "')/Set", {
			// _self.omdelItem.read("/xBRIxi_open_account_item", {
			_self.omodelCodetyp.read("/xBRIxI_PORT_CODTYP", {
				// urlParameters: {

				// 	"$top": "5000"

				// },
				success: function (getData) {
					// for (var i = 0; i < getData.results.length; i++) {
					// 	var oModelcodetyp = new sap.ui.model.json.JSONModel([]);
					// 	oModelcodetyp.setData(getData.results);
					// 	_self.getView().setModel(oModelcodetyp, "codtyp");
					// }
					_self.tempjsonport = {
						results: []
					};

					_self.tempjsonport.results = _self.tempjsonport.results.concat(getData.results);
					for (var i = 0; i < _self.temjson1.results.length; i++) {
						for (var a = 0; a < _self.tempjsonport.results.length; a++) {
							if (_self.tempjsonport.results[a].codtyp == _self.temjson1.results[i].pol) {
								_self.temjson1.results[i].pol_desc = _self.tempjsonport.results[a].coddesc;

							}
							if (_self.tempjsonport.results[a].codtyp == _self.temjson1.results[i].pod) {
								_self.temjson1.results[i].pod_desc = _self.tempjsonport.results[a].coddesc;

							}
						}


					}
					// _self.tempjson.results = _self.tempjson.results.concat(_self.tempjsonport.results);
					// _self.getView().getModel("tableLists").setData(_self.tempjson);
					_self.getView().getModel("list1").refresh();

					// 	var oModelcodetyp = new sap.ui.model.json.JSONModel([]);
					// 	oModelcodetyp.setData(getData.results);
					// 	_self.getView().setModel(oModelcodetyp, "codtyp");
					_self._CloseBusyDialog();
				},
				error: function (getData) {
					MessageBox.error("error");
					_self._CloseBusyDialog();

				}

			});

		},
		itemgetCountry: function () {
			debugger;
			var _self = this;
			_self._OpenBusyDialog();
			// var pvalue = "PORT";
			// var prvaEncode = encodeURIComponent(pvalue);
			// _self.omodelCodetyp.read("/xBRIxCE_CODTYP(inparam='" + pvalue + "')/Set", {
			// _self.omdelItem.read("/xBRIxi_open_account_item", {
			_self.omodelCodetyp.read("/I_Country", {
				// urlParameters: {

				// 	"$top": "5000"

				// },
				success: function (getData) {
					// for (var i = 0; i < getData.results.length; i++) {
					// 	var oModelcodetyp = new sap.ui.model.json.JSONModel([]);
					// 	oModelcodetyp.setData(getData.results);
					// 	_self.getView().setModel(oModelcodetyp, "codtyp");
					// }
					_self.tempjsoncountry = {
						results: []
					};

					_self.tempjsoncountry.results = _self.tempjsoncountry.results.concat(getData.results);
					for (var i = 0; i < _self.temjson1.results.length; i++) {
						for (var a = 0; a < _self.tempjsoncountry.results.length; a++) {
							if (_self.tempjsoncountry.results[a].Country == _self.temjson1.results[i].orgcntry) {
								_self.temjson1.results[i].landx = _self.tempjsoncountry.results[a].Country_Text;

							}

						}


					}
					// _self.tempjson.results = _self.tempjson.results.concat(_self.tempjsoncountry.results);
					// _self.getView().getModel("tableLists").setData(_self.tempjson);
					_self.getView().getModel("list1").refresh();

					// 	var oModelcodetyp = new sap.ui.model.json.JSONModel([]);
					// 	oModelcodetyp.setData(getData.results);
					// 	_self.getView().setModel(oModelcodetyp, "codtyp");
					_self._CloseBusyDialog();
				},
				error: function (getData) {
					MessageBox.error("error");
					_self._CloseBusyDialog();

				}

			});

		},
		vendorGet: function (oEvent) {
			var _self = this;

			this.omodelVendor.read("/vendor", {
				urlParameters: {
					$top: "5000"
				},
				success: function (response) {
					if (response.results.length <= 0) {

					} else {
						_self.temjsonvendor = {
							results: []
						};
						_self.temjsonvendor.results = _self.temjsonvendor.results.concat(response.results);
						for (var i = 0; i < _self.temjsonvendor.results.length; i++) {
							if (_self.temjsonvendor.results[i].lifnr == _self.lifnr) {
								_self.desVendor = _self.temjsonvendor.results[i].name1;
							} else {

							}
						}
						_self.getView().byId("vendordes").setText(_self.desVendor);
					}

				},
				error: function (oError) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					//_self._CloseBusyDialog();
				}
			});
		},
		companycodeGet: function (oEvent) {
			var _self = this;
			this.omodelVendor.read("/company_code", {
				success: function (response) {
					if (response.results.length <= 0) {

					} else {
						_self.temjsoncomp = {
							results: []
						};
						_self.temjsoncomp.results = _self.temjsoncomp.results.concat(response.results);
						for (var i = 0; i < _self.temjsoncomp.results.length; i++) {
							if (_self.temjsoncomp.results[i].bukrs == _self.consigncod) {
								_self.desComp = _self.temjsoncomp.results[i].butxt;
							} else {

							}
						}
						_self.getView().byId("compdes").setText(_self.desComp);
					}

				},
				error: function (oError) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					//_self._CloseBusyDialog();
				}
			});
		},

		handleValueHelpInvNo: function (oEvent) {
			debugger;
			// var _self = this;
			// _self._OpenBusyDialog();
			// var sInputValue = oEvent.getSource().getValue();
			// _self.inputId = oEvent.getSource().getId();
			// // _self.getIndex = oEvent.getSource().getParent().getIndex();
			// if (!_self._valueHelpDialogInv) {
			// 	_self._valueHelpDialogInv = sap.ui.xmlfragment("bri.open_account.view.fragments.InVno", _self);
			// 	_self.getView().addDependent(_self._valueHelpDialogInv);
			// }
			// _self._CloseBusyDialog();
			// _self._valueHelpDialogInv.open(sInputValue);
			var _self = this;
			_self._OpenBusyDialog();
			_self.inputId = oEvent.getSource().getId();
			_self.omdelItem.read("/xBRIxi_open_account_item", {
				success: function (getData) {
					_self.invoicfil = {
						results: []
					};
					_self.invoicfil.results = _self.invoicfil.results.concat(getData.results);
					_self.invoicfil.results = _self.invoicfil.results.filter(a => a.consigncod == _self.consigncod);
					_self.invoicfil.results = _self.invoicfil.results.filter(a => a.lifnr == _self.lifnr);
					var oModelData = new sap.ui.model.json.JSONModel();
					oModelData.setData(_self.invoicfil);
					_self.getView().setModel(oModelData, "searchHelpModel");
				}
			});
			if (!_self._valueHelpPO) {
				_self._valueHelpPO = sap.ui.xmlfragment("bri.open_account.view.fragments.InVno", _self);
				_self.getView().addDependent(_self._valueHelpPO);
			}
			_self._CloseBusyDialog();
			_self._valueHelpPO.open();
		},
		_handleValueHelpSearchinvNo: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"invoicenr",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpCloseinvNo: function (oEvent) {
			debugger;
			// var _self = this;
			// if (oEvent.getParameter("selectedItem")) {
			// 	_self.oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
			// 	if (_self.oSelectedItem) {
			// 		var reqNoInputFrom = _self.getView().byId(_self.inputId);
			// 		reqNoInputFrom.setValue(_self.oSelectedItem);
			// 		_self.CheckInvoiceDuplicates();
			// 		_self.getAddItem();
			// 	}
			// 	oEvent.getSource().getBinding("items").filter([]);
			// }
			var _self = this;
			var oSelectedItem = oEvent.getParameter("selectedContexts");
			if (oSelectedItem) {
				oSelectedItem.map(function (oContext) {
					sap.ui.getCore().byId("poNoDialog").setValue(oContext.getObject().invoicenr);
					_self.searchinv = sap.ui.getCore().byId("poNoDialog").getValue();
				});
			}

		},
		onDialogAdd: function () {
			debugger;
			var _self = this;
			_self.temjson1.results.push({
				doccat: "",
				docnr: "",
				invoicenr: "",
				invoicedt: "",
				invoiceval: "",
				invoicecur: "",
				openacc_value: "",
				openacc_curr: "",
				amount_payable: "",
				bank_exc_rate: "",
				amount_inr: "",
				pol: "",
				pol_desc: "",
				pod: "",
				pod_desc: "",
				plant: "",
				bl_no: "",
				po_date: "",
				ata: "",
				atd: "",
				orgcntry: "",
				landx: "",
				custom_boe_no: "",
				custom_boe_date: "",
				bank_charges: "",
				vbeln: "",
				fkdat: "",
				db_amt: "",
				remark: "",
				flag: "X"

			});

			var oModelData = new sap.ui.model.json.JSONModel();
			oModelData.setData(_self.temjson1);
			_self.getView().setModel(oModelData, "list1");
			_self.getAddItem();
			// _self.CheckInvoiceDuplicates();

		},
		getAddItem: function (oEvent) {
			debugger;
			var _self = this;
			var duplicflag = 0;
			var shno = "";
			var oTable = _self.byId("idItemTtable");
			// _self.getIndex = oEvent.getSource().getParent().getIndex();
			_self.omdelItem.read("/xBRIxi_open_account_item", {
				success: async function (response) {
					_self.getIndex = _self.temjson1.results.length - 1;
					_self.temjson1.results.splice(_self.getIndex, 1);
					//for (var i = 0; i < _self.temjson1.results.length; i++) {
					//	_self.temjson1.results[_self.getIndex].checked = "true";
					//}
					// _self.getView().getModel("list1").refresh();
					if (response.results.length <= 0) {

					} else {

						shno = sap.ui.getCore().byId("poNoDialog").getValue();
						if (!shno) {
							MessageBox.error("Please Input Invoice Number");
							_self.getView().getModel("list1").refresh();
							for (var i = 0; i < _self.temjson1.results.length; i++) {
								if (_self.temjson1.results[i].checked == "true") {
									var cb = oTable.addSelectionInterval(i, i);
								}
							}
						} else {
							_self.temjsoninv = {
								results: []
							};
							_self.temjsoninv.results = _self.temjsoninv.results.concat(response.results);
							_self.temjsoninv.results = _self.temjsoninv.results.filter(a => a.invoicenr == _self.searchinv);

							for (var i = 0; i < _self.temjsoninv.results.length; i++) {
								_self.custdate = _self.temjsoninv.results[i].custom_boe_date;
								_self.custom_boe_date = _self.ConvertJsonDate(_self.custdate);
								_self.temjsoninv.results[i].custom_boe_date = _self.custom_boe_date;

								_self.custdateata = _self.temjsoninv.results[i].ata;
								_self.ata = _self.ConvertJsonDate(_self.custdateata);
								_self.temjsoninv.results[i].ata = _self.ata;

								_self.custdateatd = _self.temjsoninv.results[i].atd;
								_self.atd = _self.ConvertJsonDate(_self.custdateatd);
								_self.temjsoninv.results[i].atd = _self.atd;

								_self.custdatefkdt = _self.temjsoninv.results[i].fkdat;
								_self.fkdat = _self.ConvertJsonDate(_self.custdatefkdt);
								_self.temjsoninv.results[i].fkdat = _self.fkdat;

								_self.custdatefkdtpo_date = _self.temjsoninv.results[i].po_date;
								_self.po_date = _self.ConvertJsonDate(_self.custdatefkdtpo_date);
								_self.temjsoninv.results[i].po_date = _self.po_date;
							}
							// _self.temjson1.results.splice(_self.getIndex, 0, {
							// 	// doccat: _self.temjsoninv.results[0].doccat,
							// 	// iteno: _self.temjsoninv.results[0].iteno,
							// 	doccat: _self.temjsoninv.results[0].doccat,
							// 	doccat: _self.temjsoninv.results[0].doccat,
							// 	docnr: _self.temjsoninv.results[0].docnr,
							// 	invoicenr: _self.temjsoninv.results[0].invoicenr,
							// 	invoicedt: _self.temjsoninv.results[0].invoicedt,
							// 	invoiceval: _self.temjsoninv.results[0].invoiceval,
							// 	invoicecur: _self.temjsoninv.results[0].invoicecur,
							// 	openacc_value: _self.temjsoninv.results[0].openacc_value,
							// 	openacc_curr: _self.temjsoninv.results[0].openacc_curr,
							// 	amount_payable: _self.temjsoninv.results[0].amount_payable,
							// 	pol_desc: _self.temjsoninv.results[0].pol_desc,
							// 	pod_desc: _self.temjsoninv.results[0].pod_desc,
							// 	werks: _self.temjsoninv.results[0].werks,
							// 	custom_boe_no: _self.temjsoninv.results[0].custom_boe_no,
							// 	custom_boe_date: _self.temjsoninv.results[0].custom_boe_date,
							// 	bank_charges: _self.temjsoninv.results[0].bank_charges,
							// 	remark: _self.temjsoninv.results[0].remark

							// });
							// _self.temjson1.results[_self.getIndex].iteno += _self.temjsoninv.results[0].iteno;

							//_self.temjson1.results = _self.temjson1.results.splice(_self.getIndex, 0, _self.temjsoninv.results);
							for (var i = 0; i < _self.temjson1.results.length; i++) {
								if (_self.temjson1.results[i].invoicenr == _self.temjsoninv.results[0].invoicenr) {
									duplicflag = 1;
								}
							}
							if (duplicflag == 1) {
								// MessageBox.error("Duplicate Invoie Number Cannot be Selected");
								MessageBox.error("Duplicate Invoie Number Cannot be Selected", {
									actions: sap.m.MessageBox.Action.Close,
									onClose: function (oAction) {
										_self._valueHelpInv.close();
										for (var i = 0; i < _self.temjson1.results.length; i++) {
											if (_self.temjson1.results[i].checked == "true") {
												var cb = oTable.addSelectionInterval(i, i);
											}
										}
										_self.getView().getModel("list1").refresh();
										for (var i = 0; i < _self.temjson1.results.length; i++) {
											if (_self.temjson1.results[i].checked == "true") {
												var cb = oTable.addSelectionInterval(i, i);
											}
										}
										sap.ui.getCore().byId("poNoDialog").setValue("");
									}
								});

							} else {
								_self.temjson1.results = _self.temjson1.results.concat(_self.temjsoninv.results);

								// for (var i = 0; i < _self.temjson1.results.length; i++) {
								// 	_self.temjson1.results[i].checked = "true";
								// }

								var oModelDatInv = new sap.ui.model.json.JSONModel();
								oModelDatInv.setData(_self.temjson1);
								_self.getView().setModel(oModelDatInv, "list1");
								_self.getView().getModel("list1").refresh();

								for (var i = 0; i < _self.temjson1.results.length; i++) {
									if (_self.temjson1.results[i].checked == "true") {
										var cb = oTable.addSelectionInterval(i, i);
									}
								}
								sap.ui.getCore().byId("poNoDialog").setValue("");
								_self._valueHelpInv.close();
								// _self._valueHelpPO.close();
							}
						}
					}
				},
				error: function (oError) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					//_self._CloseBusyDialog();
				}
			});
			_self.itemgetPort();
			_self.itemgetCountry();

		},
		OnchangeDate: function (oEvent) {
			debugger;
			var currentRow = oEvent.getSource().getParent().getIndex();
			var val = oEvent.getSource().getValue();
			if ((val == "") || (val == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make custom boe date filed as null");
				return;
			}
			else {
				var SplitDatePar = val.split("-");
				var SplitDatePar1 = SplitDatePar[2].slice(0, -9);
				this.temjson1.results[currentRow].custom_boe_date = SplitDatePar[0] + "-" + SplitDatePar[1] + "-" + SplitDatePar1 + "T00:00:00";
				this.getView().getModel("list1").refresh();
				// this.temjson1.results[currentRow].custom_boe_date = null;
			}

		},
		OnchangeDatepo: function (oEvent) {
			debugger;
			var currentRow = oEvent.getSource().getParent().getIndex();
			var val = oEvent.getSource().getValue();
			if ((val == "") || (val == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make date filed as null");
				return;
			}
			else {
				var SplitDatePar = val.split("-");
				var SplitDatePar1 = SplitDatePar[2].slice(0, -9);
				this.temjson1.results[currentRow].po_date = SplitDatePar[0] + "-" + SplitDatePar[1] + "-" + SplitDatePar1 + "T00:00:00";
				this.getView().getModel("list1").refresh();
				// this.temjson1.results[currentRow].custom_boe_date = null;
			}

		},
		OnchangeDateata: function (oEvent) {
			debugger;
			var currentRow = oEvent.getSource().getParent().getIndex();
			var val = oEvent.getSource().getValue();
			if ((val == "") || (val == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make ATA date filed as null");
				return;
			}
			else {
				var SplitDatePar = val.split("-");
				var SplitDatePar1 = SplitDatePar[2].slice(0, -9);
				this.temjson1.results[currentRow].ata = SplitDatePar[0] + "-" + SplitDatePar[1] + "-" + SplitDatePar1 + "T00:00:00";
				this.getView().getModel("list1").refresh();
				// this.temjson1.results[currentRow].custom_boe_date = null;
			}

		},

		OnchangeDateatd: function (oEvent) {
			debugger;
			var currentRow = oEvent.getSource().getParent().getIndex();
			var val = oEvent.getSource().getValue();
			if ((val == "") || (val == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make ATD date filed as null");
				return;
			}
			else {
				var SplitDatePar = val.split("-");
				var SplitDatePar1 = SplitDatePar[2].slice(0, -9);
				this.temjson1.results[currentRow].atd = SplitDatePar[0] + "-" + SplitDatePar[1] + "-" + SplitDatePar1 + "T00:00:00";
				this.getView().getModel("list1").refresh();
				// this.temjson1.results[currentRow].custom_boe_date = null;
			}

		},

		OnchangeDatedbt: function (oEvent) {
			debugger;
			var currentRow = oEvent.getSource().getParent().getIndex();
			var val = oEvent.getSource().getValue();
			if ((val == "") || (val == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make Debit date filed as null");
				return;
			}
			else {
				var SplitDatePar = val.split("-");
				var SplitDatePar1 = SplitDatePar[2].slice(0, -9);
				this.temjson1.results[currentRow].fkdat = SplitDatePar[0] + "-" + SplitDatePar[1] + "-" + SplitDatePar1 + "T00:00:00";
				this.getView().getModel("list1").refresh();
				// this.temjson1.results[currentRow].custom_boe_date = null;
			}

		},

		OnSelectChange: function (oEvent) {
			debugger;
			var _self = this;

			if (oEvent.mParameters.userInteraction == true) {

				var oTable = _self.byId("idItemTtable");
				var lengthOfCell = oTable.getSelectedIndices().length;
				var allselect = oEvent.mParameters.selectAll;
				var rowval = oEvent.mParameters.rowIndex;

				var selectedIndex = oTable.isIndexSelected(rowval);
				if (allselect == true && rowval == 0) {
					var TotalAppliedAmount = 0;
					var TotalinvAmount = 0;
					var table = oEvent.getSource();
					for (var b = 0; b < _self.temjson1.results.length; b++) {
						// if(_self.temjson1.results[b].checked == "false"){
						_self.temjson1.results[b].checked = "true";
						// }
					}
					if (lengthOfCell >= 1) {
						for (var b = 0; b < _self.temjson1.results.length; b++) {
							var totalopamt = _self.temjson1.results[b].openacc_value;
							var totalopamt = parseFloat(totalopamt);
							var amontpayble = _self.temjson1.results[b].amount_payable;
							if (amontpayble !== undefined) {
								var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(amontpayble);
							}
							var TotalinvAmount = parseFloat(TotalinvAmount) + parseFloat(totalopamt);
							_self.getView().byId("totinvval").setValue(TotalinvAmount);
							if (_self.getView().byId("totinvval").getValue() == "") {
								_self.getView().byId("totamtpaid").setValue("0");
								_self.getView().byId("balance").setValue("0");
							} else if (amontpayble !== "") {
								_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
								var AmountApplied = _self.getView().byId("totamtpaid").getValue();
								var AmountApplied = parseFloat(AmountApplied);
							}

						}
						_self.totalinvAmount = 0;
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							// if (_self.temjson1.results[i].checked == "true") {
							_self.totinv = parseFloat(_self.temjson1.results[i].openacc_value);
							_self.totalinvAmount = parseFloat(_self.totalinvAmount) + _self.totinv;
							// }
						}
						if (AmountApplied !== 0) {
							if (_self.totalinvAmount > AmountApplied) {
								var balaceAmount = _self.totalinvAmount - AmountApplied;
								_self.getView().byId("balance").setValue(balaceAmount);
							} else {
								if (AmountApplied == undefined) {
									_self.getView().byId("balance").setValue(totalopamt);
								} else {
									var balaceAmount = AmountApplied - _self.totalinvAmount;
									_self.getView().byId("balance").setValue(balaceAmount);
								}
							}

						} else {
							_self.getView().byId("balance").setValue(totalopamt);
						}
					} else {
						_self.getView().byId("totinvval").setValue("0");
						_self.getView().byId("totamtpaid").setValue("0");
						_self.getView().byId("balance").setValue("0");
					}
					for (var i = 0; i < _self.temjson1.results.length; i++) {
						// this.getView().byId("bank_exc_rate1").setValue(0);
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							const object = _self.temjson1.results[i];
							object.bank_exc_rate = _self.getView().byId("bank_exc_rate1").getValue();
							// if (object.bank_exc_rate.includes(".")) {
							// 	for (var i = 0; i < this.tempjson.results.length; i++) {
							// 		this.bank = this.tempjson.results[i].bank_exc_rate;
							// 		if ((this.bank != undefined) && (this.bank != 0)) {
							// 			this.bank1 = this.bank.slice(0, -2);
							// 		}

							// 	}
							// 	object.bank_exc_rate = this.bank1;

							// }
							object.amount_inr = object.bank_exc_rate * object.amount_payable;
							object.amount_inr = object.amount_inr.toFixed(2);
						}
						_self.getView().getModel("list1").setData(_self.temjson1);
						_self.getView().getModel("list1").refresh();

					}


				} else if (allselect == undefined && rowval == -1) {
					for (var b = 0; b < _self.temjson1.results.length; b++) {
						_self.temjson1.results[b].checked = "false";
					}
					_self.getView().byId("totinvval_curr").setValue("");
					_self.getView().byId("totamtpaid_curr").setValue("");
					_self.getView().byId("tcurr2").setValue("");
					_self.getView().byId("totinvval").setValue("0");
					_self.getView().byId("totamtpaid").setValue("0");
					_self.getView().byId("balance").setValue("0");

					// for (var i = 0; i < _self.temjson1.results.length; i++) {
					// 	if ((_self.temjson1.results[i].retirement == "X") && (_self.temjson1.results[i].checked == "false")) {
					// 		MessageBox.error("Cant Unselect an item once it is retire");
					// 		//  oTable.addSelectionInterval(rowval, rowval);
					// 		  return;
					// 	}
					// }

					for (var i = 0; i < _self.temjson1.results.length; i++) {
						// this.getView().byId("bank_exc_rate1").setValue(0);
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							const object = _self.temjson1.results[i];
							// if (object.checked == "true") {
							object.bank_exc_rate = 0;
							object.amount_inr = object.bank_exc_rate * object.amount_payable;
							// }
						}
						_self.getView().getModel("list1").setData(_self.temjson1);
						_self.getView().getModel("list1").refresh();

					}




				}

				//********************************************
				else {

					for (var b = 0; b < _self.temjson1.results.length; b++) {
						var tblinvoicenr = _self.temjson1.results[rowval].invoicenr;
						if (_self.temjson1.results[rowval].invoicenr == _self.temjson1.results[b].invoicenr) {
							_self.temjson1.results[b].checked = selectedIndex;
							_self.temjson1.results[b].checked = _self.temjson1.results[b].checked.toString();
							// if (_self.temjson1.results[b].checked == "false") {
							// 	var flagFlase = 1;
							// }
							if (_self.temjson1.results[b].checked == "true") {
								_self.currnyval = _self.getView().byId("totinvval_curr").getValue();
								if (_self.currnyval == "") {
									_self.openacntCurncy = _self.temjson1.results[b].openacc_curr;
									_self.getView().byId("totinvval_curr").setValue(_self.openacntCurncy);
									_self.getView().byId("totamtpaid_curr").setValue(_self.openacntCurncy);
									_self.getView().byId("tcurr2").setValue(_self.openacntCurncy);
									if (_self.temjson1.results[b].checked == "false") {

									}
								} else {
									// _self.openacntCurncy = _self.temjson1.results[b].openacc_curr;
									if (_self.currnyval == _self.temjson1.results[b].openacc_curr) {
										_self.openacntCurncy = _self.temjson1.results[b].openacc_curr;
										_self.getView().byId("totinvval_curr").setValue(_self.openacntCurncy);
										_self.getView().byId("totamtpaid_curr").setValue(_self.openacntCurncy);
										_self.getView().byId("tcurr2").setValue(_self.openacntCurncy);
										if (_self.temjson1.results[b].checked == "false") {

										}
									} else {
										MessageBox.error("Cannot select item with different currency ");
										oTable.removeSelectionInterval(rowval, rowval);

									}
								}
							} else {
								for (var i = 0; i < _self.temjson1.results.length; i++) {
									if (_self.temjson1.results[i].checked == "true") {
										_self.getView().byId("totinvval_curr").setValue(_self.openacntCurncy);
										_self.getView().byId("totamtpaid_curr").setValue(_self.openacntCurncy);
										_self.getView().byId("tcurr2").setValue(_self.openacntCurncy);
									} else if (lengthOfCell == 0) {

										_self.getView().byId("totinvval_curr").setValue("");
										_self.getView().byId("totamtpaid_curr").setValue("");
										_self.getView().byId("tcurr2").setValue("");
										for (var i = 0; i < _self.temjson1.results.length; i++) {
											// this.getView().byId("bank_exc_rate1").setValue(0);
											for (var i = 0; i < _self.temjson1.results.length; i++) {
												const object = _self.temjson1.results[i];
												// if (object.checked == "true") {
												object.bank_exc_rate = 0;
												object.amount_inr = object.bank_exc_rate * object.amount_payable;
												// }
											}
											_self.getView().getModel("list1").setData(_self.temjson1);
											_self.getView().getModel("list1").refresh();

										}
									}
									else if (_self.temjson1.results[i].checked == "false") {
										for (var i = 0; i < _self.temjson1.results.length; i++) {
											const object = _self.temjson1.results[i];

											object.bank_exc_rate = 0;
											object.amount_inr = object.bank_exc_rate * object.amount_payable;
											object.amount_inr = object.amount_inr.toFixed(2);

										}
										_self.getView().getModel("list1").setData(_self.temjson1);
										_self.getView().getModel("list1").refresh();
									}

								}

							}
							for (var i = 0; i < _self.temjson1.results.length; i++) {
								const object = _self.temjson1.results[i];
								if (object.checked == "false") {
									object.bank_exc_rate = 0;
									if (object.amount_payable != undefined) {
										object.amount_inr = object.bank_exc_rate * object.amount_payable;
										object.amount_inr = object.amount_inr.toFixed(2);
									}
								}
								else {
									object.bank_exc_rate = _self.getView().byId("bank_exc_rate1").getValue();
									// if (object.bank_exc_rate.includes(".")) {
									// 	for (var i = 0; i < this.tempjson.results.length; i++) {
									// 		this.bank = this.tempjson.results[i].bank_exc_rate;
									// 		if ((this.bank != undefined) && (this.bank != 0)) {
									// 			this.bank1 = this.bank.slice(0, -2);
									// 		}

									// 	}
									// 	object.bank_exc_rate = this.bank1;

									// }
									if (object.amount_payable != undefined) {
										object.amount_inr = object.bank_exc_rate * object.amount_payable;
										object.amount_inr = object.amount_inr.toFixed(2);
									}

								}
							}
							_self.getView().getModel("list1").setData(_self.temjson1);
							_self.getView().getModel("list1").refresh();

							if (_self.temjson1.results != undefined) {
								for (var i = 0; i < _self.temjson1.results.length; i++) {
									if ((_self.temjson1.results[i].retirement == "X") && (_self.temjson1.results[i].checked == "false")) {
										MessageBox.error("Cant Unselect an item once it is retire");
										oTable.addSelectionInterval(rowval, rowval);
										// return;
									}
								}
							}

						}
					}
					var TotalAppliedAmount = 0;
					var TotalinvAmount = 0;
					var table = oEvent.getSource();
					if (lengthOfCell >= 1) {
						// for (var c = 0; c < _self.temjson1.results.length; c++) {
						// 	if (_self.temjson1.results[c].invoicenr == "") {

						// 	}
						// 	else {
						for (var b = 0; b < _self.temjson1.results.length; b++) {
							// if (_self.temjson1.results[b].invoicenr != "") {

							// var amontpayble = _self.temjson1.results[b].amount_payable;
							// var amontpayble = parseFloat(amontpayble);
							if (_self.temjson1.results[b].checked == "true") {
								var totalopamt = _self.temjson1.results[b].openacc_value;
								var totalopamt = parseFloat(totalopamt);

								var amontpayble = _self.temjson1.results[b].amount_payable;
								if (amontpayble == "") {
									var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + amontpayble;
									_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
								} else if (amontpayble !== undefined) {
									var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(amontpayble);
								}

								var TotalinvAmount = parseFloat(TotalinvAmount) + parseFloat(totalopamt);
								_self.getView().byId("totinvval").setValue(TotalinvAmount);
								if (_self.getView().byId("totinvval").getValue() == "") {
									_self.getView().byId("totamtpaid").setValue("0");
									_self.getView().byId("balance").setValue("0");
								} else if (amontpayble !== "") {
									_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
									var AmountApplied = _self.getView().byId("totamtpaid").getValue();
									var AmountApplied = parseFloat(AmountApplied);
								}

							}

							// }
						}
						// }
						_self.totalinvAmount = 0;
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							if (_self.temjson1.results[i].checked == "true") {
								_self.totinv = parseFloat(_self.temjson1.results[i].openacc_value);
								_self.totalinvAmount = parseFloat(_self.totalinvAmount) + _self.totinv;
							}
						}
						if (_self.totalinvAmount >= AmountApplied) {
							if (AmountApplied == undefined) {
								_self.getView().byId("balance").setValue("0");
							} else if (AmountApplied !== 0) {
								var balaceAmount = _self.totalinvAmount - AmountApplied;
								var balaceAmount = balaceAmount.toFixed(2);
								_self.getView().byId("balance").setValue(balaceAmount);
							} else {
								var balaceAmount = _self.totalinvAmount - AmountApplied;
								_self.getView().byId("balance").setValue(balaceAmount);
							}
						}

					} else {
						_self.getView().byId("totinvval").setValue("0");
						_self.getView().byId("totamtpaid").setValue("0");
						_self.getView().byId("balance").setValue("0");
						_self.getView().byId("totinvval_curr").setValue("");
						_self.getView().byId("totamtpaid_curr").setValue("");
						_self.getView().byId("tcurr2").setValue("");
					}
					//**********selecting checked items for calculation*************

				}
			}
			if (_self.getView().byId("balance").getValue() == 0) {
				_self.getView().byId("paymntstt").setValue("Fully Paid");
			} else {
				_self.getView().byId("paymntstt").setValue("Partially Paid");
			}
		},

		calculateAmount: function (oEvent) {
			debugger;
			var _self = this
			var TotalAppliedAmount = 0;
			var TotalinvAmount = 0;
			var flagset = 0;
			var oTable = _self.byId("idItemTtable");
			var tableIndex = oEvent.getSource().getParent().getIndex();
			for (var b = 0; b < _self.temjson1.results.length; b++) {
				_self.Invvalue = _self.temjson1.results[tableIndex].openacc_value;
				_self.Invvalue = parseFloat(_self.Invvalue);
				_self.amnoutntpayble = oEvent.getSource().getParent().getCells()[8].getValue();


				// _self.amnoutntpayble =_self.amnoutntpayble.toFixed(2);
				// _self.amnoutntpayble = oTable.getRows()[oTable.getSelectedIndex()].getCells()[5].mProperties.value;

				if (_self.temjson1.results[b].checked == "true") {
					if (_self.amnoutntpayble != "") {
						_self.amnoutntpayble = parseFloat(_self.amnoutntpayble);
						// _self.amnoutntpayble = _self.amnoutntpayble + ".00";
						_self.temjson1.results[tableIndex].amount_payable = _self.amnoutntpayble;
						var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(_self.temjson1.results[b].amount_payable);
						_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
						var TotalinvAmount = parseFloat(TotalinvAmount) + parseFloat(_self.temjson1.results[b].openacc_value);
						TotalAppliedAmount = TotalAppliedAmount ? TotalAppliedAmount : 0;
						_self.getView().byId("totinvval").setValue(TotalinvAmount);
						/////////////////////****amountinr */
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							const object = _self.temjson1.results[i];
							if (object.checked == "true") {
								object.bank_exc_rate = _self.getView().byId("bank_exc_rate1").getValue();
								// if (object.bank_exc_rate.includes(".")) {
								// 	for (var i = 0; i < this.tempjson.results.length; i++) {
								// 		this.bank = this.tempjson.results[i].bank_exc_rate;
								// 		if ((this.bank != undefined) && (this.bank != 0)) {
								// 			this.bank1 = this.bank.slice(0, -2);
								// 		}

								// 	}
								// 	object.bank_exc_rate = this.bank1;

								// }
								object.amount_inr = object.bank_exc_rate * object.amount_payable;
								object.amount_inr = object.amount_inr.toFixed(2);
							}
						}
						_self.getView().getModel("list1").setData(_self.temjson1);
						_self.getView().getModel("list1").refresh();


					} else {
						// var getvalue = parseFloat(_self.getView().byId("totamtpaid").getValue());
						// var TotalAppliedAmount = parseFloat(_self.getView().byId("totamtpaid").getValue()) - parseFloat(_self.temjson1.results[b].amount_payable);
						_self.getView().byId("totamtpaid").setValue(_self.amnoutntpayble);
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							const object = _self.temjson1.results[i];
							// if (object.checked == "true") {
							// object.bank_exc_rate = _self.getView().byId("bank_exc_rate1").getValue();
							// object.amount_inr = object.bank_exc_rate * object.amount_payable;
							object.amount_inr = 0;
							object.amount_inr = object.amount_inr.toFixed(2);
							// }
						}
						_self.getView().getModel("list1").setData(_self.temjson1);
						_self.getView().getModel("list1").refresh();
					}

				} else if (_self.temjson1.results[b].checked == undefined) {
					if (_self.amnoutntpayble != "") {
						_self.amnoutntpayble = parseFloat(_self.amnoutntpayble);
						//  _self.amnoutntpayble =_self.amnoutntpayble.toFixed(2);
						//  _self.amnoutntpayble = _self.amnoutntpayble + ".00";
						_self.temjson1.results[tableIndex].amount_payable = _self.amnoutntpayble;
						var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(_self.temjson1.results[b].amount_payable);
						_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
						var TotalinvAmount = parseFloat(TotalinvAmount) + parseFloat(_self.temjson1.results[b].openacc_value);
						TotalAppliedAmount = TotalAppliedAmount ? TotalAppliedAmount : 0;
						_self.getView().byId("totinvval").setValue(TotalinvAmount);
					} else {
						// var getvalue = parseFloat(_self.getView().byId("totamtpaid").getValue());
						// var TotalAppliedAmount = parseFloat(_self.getView().byId("totamtpaid").getValue()) - parseFloat(_self.temjson1.results[b].amount_payable);
						_self.getView().byId("totamtpaid").setValue(_self.amnoutntpayble);
					}
				}

			}

			_self.totalinvAmount = 0;
			for (var i = 0; i < _self.temjson1.results.length; i++) {
				if (_self.temjson1.results[i].checked == "true") {
					_self.totinv = parseFloat(_self.temjson1.results[i].openacc_value);
					_self.totalinvAmount = parseFloat(_self.totalinvAmount) + _self.totinv;
				}
			}
			var AmountApplied = _self.getView().byId("totamtpaid").getValue();
			if (AmountApplied == "") {
				_self.getView().byId("balance").setValue("");
				// else  {
				// 	_self.getView().byId("balance").setValue("0");
			} else {
				var AmountApplied = parseFloat(AmountApplied);
				if (_self.totalinvAmount >= AmountApplied) {
					var balaceAmount = _self.totalinvAmount - AmountApplied;
					var balaceAmount = balaceAmount.toFixed(2);
					_self.getView().byId("balance").setValue(balaceAmount);
					_self.valueCheck = 0;
				} else {
					var balaceAmount = parseFloat(_self.getView().byId("balance").getValue());

				}

			}

			// if (parseInt(_self.temjson1.results[tableIndex].amount_payable) > parseInt(_self.Invvalue)) {

			if (parseInt(_self.amnoutntpayble) > parseInt(_self.Invvalue)) {
				flagset = 1;
				MessageBox.error("Amount Payable is higher than Open Account Amount", {
					actions: sap.m.MessageBox.Action.Close,
					onClose: function (oAction) {
						// _self.temjson1.results[tableIndex].amount_payable = "";
						// _self.getView().byId("amount_payable").setValue("");
						_self.temjson1.results[tableIndex].amount_payable = "";
						// var amtsetvalue = oTable.getRows()[oTable.getSelectedIndex()].getCells()[5].mProperties.value;
						_self.getView().getModel("list1").refresh();
						_self.getView().getModel("Lists").refresh();

						var amtpplied = _self.getView().byId("totamtpaid").getValue();
						var amtpplied = parseFloat(amtpplied);
						var amntpable = parseFloat(_self.amnoutntpayble);
						var Amtapp = amtpplied - amntpable;
						if (Amtapp >= 0) {
							_self.getView().byId("totamtpaid").setValue(Amtapp);
							var amtget = _self.getView().byId("totamtpaid").getValue();
							_self.getView().getModel("Lists").refresh();
							var balaceAmount = _self.totalinvAmount - parseFloat(amtget);
							_self.getView().byId("balance").setValue(balaceAmount);
							_self.getView().getModel("Lists").refresh();

						} else {
							_self.getView().byId("totinvval").setValue("0");
							_self.getView().byId("totamtpaid").setValue("0");
							_self.getView().byId("balance").setValue("0");
						}

					}
				});
			}
			if (_self.getView().byId("balance").getValue() == 0) {
				_self.getView().byId("paymntstt").setValue("Fully Paid");
			} else {
				_self.getView().byId("paymntstt").setValue("Partially Paid");
			}

		},
		// onUpdateLicense: function (oEvent) {
		onPressSave: function (oEvent) {
			debugger;

			this._OpenBusyDialog();
			var _self = this;
			var mParameters = {
				groupId: "updatBatch"
			};
			var _self = this;
			_self.oEntry = {
				//internal_tracking_no: this.getView().byId("internal_tracking_no").getValue() ? this.getView().byId("internal_tracking_no").getValue() : null,
				consigncod: this.getView().byId("consigncod").getValue() ? this.getView().byId("consigncod").getValue() : null,
				og_docdt: this.getView().byId("og_docdt").getValue() ? this.getView().byId("og_docdt").getValue().trim() : null,
				pay_date: this.getView().byId("pay_date").getValue() ? this.getView().byId("pay_date").getValue().trim() : null,
				due_date: this.getView().byId("due_date").getValue() ? this.getView().byId("due_date").getValue().trim() : null,
				lifnr: this.getView().byId("lifnr").getValue() ? this.getView().byId("lifnr").getValue() : null,
				bnkrefno: this.getView().byId("bnkrefno").getValue() ? this.getView().byId("bnkrefno").getValue() : null,
				imp_bank: this.getView().byId("imp_bank").getValue() ? this.getView().byId("imp_bank").getValue() : null,
				banka: this.getView().byId("banka").getValue() ? this.getView().byId("banka").getValue() : null,
				accno: this.getView().byId("accno").getValue() ? this.getView().byId("accno").getValue() : null,
				bankn: this.getView().byId("bankn").getValue() ? this.getView().byId("bankn").getValue() : null,
				bank_exc_rate: this.getView().byId("bank_exc_rate1").getValue().trim() ? this.getView().byId("bank_exc_rate1").getValue() : null,
				ad_code: this.getView().byId("ad_code").getValue() ? this.getView().byId("ad_code").getValue() : null,
				swift: this.getView().byId("swift").getValue() ? this.getView().byId("swift").getValue() : null,
				inco1: this.getView().byId("inco1").getValue() ? this.getView().byId("inco1").getValue() : null,
				zterm: this.getView().byId("zterm").getValue() ? this.getView().byId("zterm").getValue() : null,
				ekorg: this.getView().byId("ekorg").getValue() ? this.getView().byId("ekorg").getValue() : null,
				bsart: this.getView().byId("bsart").getValue() ? this.getView().byId("bsart").getValue() : null,
				totinvval: this.getView().byId("totinvval").getValue() ? this.getView().byId("totinvval").getValue() : null,
				totamtpaid: this.getView().byId("totamtpaid").getValue() ? this.getView().byId("totamtpaid").getValue() : null,
				balance: this.getView().byId("balance").getValue() ? this.getView().byId("balance").getValue() : null,

				totamtpaid_curr: this.getView().byId("totamtpaid_curr").getValue() ? this.getView().byId("totamtpaid_curr").getValue() : null,
				totinvval_curr: this.getView().byId("totinvval_curr").getValue() ? this.getView().byId("totinvval_curr").getValue() : null
				// balance: this.getView().byId("balance").getValue() ? this.getView().byId("balance").getValue() : null
			};
			// if ((_self.oEntry.og_docdt == "") || (_self.oEntry.og_docdt == null)) {
			// 	MessageBox.error("Please Fill Original Doc Refdate ");
			// 	_self._CloseBusyDialog();
			// 	return;
			// }
			// if ((_self.oEntry.pay_date == "") || (_self.oEntry.pay_date == null)) {
			// 	MessageBox.error("Please Fill Payment Date");
			// 	_self._CloseBusyDialog();
			// 	return;
			// }
			// if ((_self.oEntry.due_date == "") || (_self.oEntry.due_date == null)) {
			// 	MessageBox.error("Please Fill Due Date");
			// 	_self._CloseBusyDialog();
			// 	return;
			// }
			// if ((_self.oEntry.imp_bank == "") || (_self.oEntry.imp_bank == null)) {
			// 	MessageBox.error("Please Fill Importer Bank");
			// 	_self._CloseBusyDialog();
			// 	return;
			// }
			// if ((_self.oEntry.bank_exc_rate == "") || (_self.oEntry.bank_exc_rate == null)) {
			// 	MessageBox.error("Please Fill Bank Excange Rate");
			// 	_self._CloseBusyDialog();
			// 	return;
			// }
			for (var i = 0; i < _self.temjson1.results.length; i += 1) {
				if (_self.temjson1.results[i].custom_boe_date == "") {
					_self.temjson1.results[i].custom_boe_date = null;
				}
				if ((_self.temjson1.results[i].ata == '') || (_self.temjson1.results[i].ata == "")) {

					_self.temjson1.results[i].ata = null;
				}
				if ((_self.temjson1.results[i].atd == '') || (_self.temjson1.results[i].atd == "")) {

					_self.temjson1.results[i].atd = null;
				}
				 if (_self.temjson1.results[i].bank_charges == "") {
					_self.temjson1.results[i].bank_charges = '0.00';
				}
			}
			// if (_self.oEntry.pay_date == '') {

			// 	_self.oEntry.pay_date = null;
			// }
			// if (_self.oEntry.og_docdt == '') {

			// 	_self.oEntry.og_docdt = null;
			// }
			// if (_self.oEntry.due_date == '') {

			// 	_self.oEntry.due_date = null;
			// }
			// if (_self.oEntry.bank_exc_rate == '') {

			// 	_self.oEntry.bank_exc_rate = '0.0000';
			// }
			//********************************header update*********************************************************//

			//********************************item update*********************************************************//
			// var _self = this;

			// for (var i = 0; i < _self.temjson1.results.length; i++) {
			// 	if (_self.temjson1.results[i].checked == "true") {
			// 		// if (_self.temjson1.results[i].amnoutntpayble != undefined)
			// 			_self.amnoutntpayble = _self.amnoutntpayble + ".00";
			// 	 }
			// }


			for (var i = 0; i < _self.temjson1.results.length; i++) {
				const object = _self.temjson1.results[i];
				if (object.checked == "true") {
					// if (object.amount_payable.includes(".")) {
					if (Number.isInteger(object.amount_payable)) {

						object.amount_payable = object.amount_payable + ".00";
					}
					else {

					}

				}
			}
			_self.getView().getModel("list1").setData(_self.temjson1);
			_self.getView().getModel("list1").refresh();

			for (var i = 0; i < _self.temjson1.results.length; i += 1) {
				if (_self.temjson1.results[i].checked == "true") {
					if (_self.temjson1.results[i].amount_payable == "") {
						MessageBox.error("Can't Accept an item with Null Amount Payable Value");
						_self._CloseBusyDialog();
						return;
						// _self.temjson1.results[i].amount_payable="0.00";
					} else if (_self.temjson1.results[i].amount_payable == undefined) {
						MessageBox.error("Can't Accept an item with Null Amount Payable Value");
						_self._CloseBusyDialog();
						return;
						// _self.temjson1.results[i].amount_payable="0.00";
					}

				}
			}
			for (var i = 0; i < _self.temjson1.results.length; i += 1) {
				_self.orgdatefkdat = _self.temjson1.results[i].fkdat;
				if ((_self.orgdatefkdat != null) || (_self.orgdatefkdat != undefined)) {
					if (_self.orgdatefkdat.includes("/")) {
						var SplitDatePart = _self.orgdatefkdat.split("/");
						_self.fkdat = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
						// _self.fkdat = _self.ConvertJsonDate(_self.orgdatefkdat);
						_self.temjson1.results[i].fkdat = _self.fkdat;
					} else {
						_self.fkdat = _self.convertToSAPdate(_self.orgdatefkdat);
						_self.temjson1.results[i].fkdat = _self.fkdat;
					}
				}

				_self.orgdateatd = _self.temjson1.results[i].atd;
				if ((_self.orgdateatd != null) || (_self.orgdateatd != undefined)) {
					if (_self.orgdateatd.includes("/")) {
						var SplitDatePart = _self.orgdateatd.split("/");
						_self.atd = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
						// _self.atd = _self.ConvertJsonDate(_self.orgdateatd);
						_self.temjson1.results[i].atd = _self.atd;
					} else {
						_self.atd = _self.convertToSAPdate(_self.orgdateatd);
						_self.temjson1.results[i].atd = _self.atd;
					}
				}

				_self.orgdateata = _self.temjson1.results[i].ata;
				if ((_self.orgdateata != null) || (_self.orgdateata != undefined)) {
					if (_self.orgdateata.includes("/")) {
						var SplitDatePart = _self.orgdateata.split("/");
						_self.ata = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
						// _self.ata = _self.ConvertJsonDate(_self.orgdateata);
						_self.temjson1.results[i].ata = _self.ata;
					} else {
						_self.ata = _self.convertToSAPdate(_self.orgdateata);
						_self.temjson1.results[i].ata = _self.ata;
					}
				}

				_self.orgdatepo_date = _self.temjson1.results[i].po_date;
				if ((_self.orgdatepo_date != null) || (_self.orgdatepo_date != undefined)) {
					if (_self.orgdatepo_date.includes("/")) {
						var SplitDatePart = _self.orgdatepo_date.split("/");
						_self.po_date = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
						// _self.po_date = _self.ConvertJsonDate(_self.orgdatepo_date);
						_self.temjson1.results[i].po_date = _self.po_date;
					} else {
						_self.po_date = _self.convertToSAPdate(_self.orgdatepo_date);
						_self.temjson1.results[i].po_date = _self.po_date;
					}
				}

				_self.orgdate = _self.temjson1.results[i].custom_boe_date;
				if ((_self.orgdate != null) || (_self.orgdate != undefined)) {
					if (_self.orgdate.includes("/")) {
						var SplitDatePart = _self.orgdate.split("/");
						_self.custom_boe_date = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
						// _self.custom_boe_date = _self.ConvertJsonDate(_self.orgdate);
						_self.temjson1.results[i].custom_boe_date = _self.custom_boe_date;
					} else {
						_self.custom_boe_date = _self.convertToSAPdate(_self.orgdate);
						_self.temjson1.results[i].custom_boe_date = _self.custom_boe_date;
					}
				}







				// if (_self.temjson1.results[i].custom_boe_date == "") {
				// 	MessageBox.error("Can't save date as empty");
				// 	_self._CloseBusyDialog();
				// 	return;
				// 	// _self.temjson1.results[i].custom_boe_date = null;
				// }

				if ((_self.temjson1.results[i].checked == "true") || (_self.temjson1.results[i].retirement == "X")) {
					delete _self.temjson1.results[i].__metadata;
					delete _self.temjson1.results[i].checked;
					delete _self.temjson1.results[i].iteno;
					delete _self.temjson1.results[i].ernam;
					delete _self.temjson1.results[i].invoice_fval;
					delete _self.temjson1.results[i].invoice_fcur;
					delete _self.temjson1.results[i].lcdocno;
					delete _self.temjson1.results[i].version;
					delete _self.temjson1.results[i].lcinvval;
					delete _self.temjson1.results[i].fccurr;
					delete _self.temjson1.results[i].ersda;
					delete _self.temjson1.results[i].aenam;
					delete _self.temjson1.results[i].laeda;
					delete _self.temjson1.results[i].timestamp;
					delete _self.temjson1.results[i].create_time;
					delete _self.temjson1.results[i].change_time;
					delete _self.temjson1.results[i].delindicator;
					delete _self.temjson1.results[i].total_invoice_net_weight;
					delete _self.temjson1.results[i].meins;
					delete _self.temjson1.results[i].total_invoice_gross_weight;
					delete _self.temjson1.results[i].invoice_bill_to_party_name;
					delete _self.temjson1.results[i].invbilptystrt;
					delete _self.temjson1.results[i].invbilptycity;
					delete _self.temjson1.results[i].invbilptypstlz;
					delete _self.temjson1.results[i].invbilptyland;
					delete _self.temjson1.results[i].flag1;
					delete _self.temjson1.results[i].openacc_flag;
					delete _self.temjson1.results[i].aprefnr;
					delete _self.temjson1.results[i].waers;
					delete _self.temjson1.results[i].boldt;
					delete _self.temjson1.results[i].consigncod;
					delete _self.temjson1.results[i].lifnr;

					_self.omdelItem.update(
						"/xBRIxopen_account_ITEM(intno='" + _self.intno +
						"',docnr='" + _self.temjson1.results[
							i].docnr + "',doccat='" + _self.temjson1.results[
								i].doccat + "',invoicenr='" + _self.temjson1.results[
									i].invoicenr + "')", _self.temjson1.results[i]), mParameters;

				}
			}
			for (var i = 0; i < _self.temjson1.results.length; i += 1) {
				_self.orgdate = _self.temjson1.results[i].custom_boe_date;
				_self.custom_boe_date = _self.convertToSAPdate(_self.orgdate);
				_self.temjson1.results[i].custom_boe_date = _self.custom_boe_date;
				// if (_self.temjson1.results[i].custom_boe_date == "") {
				// 	// _self.temjson1.results[i].custom_boe_date = null;
				// 	MessageBox.error("Can't save date as empty");
				// 	_self._CloseBusyDialog();
				// 	return;
				// }
				// if (_self.temjson1.results[i].checked == "true") {
				// 	delete _self.temjson1.results[i].__metadata;
				// 	delete _self.temjson1.results[i].checked;
				// 	delete _self.temjson1.results[i].iteno;
				// 	delete _self.temjson1.results[i].ernam;
				// 	delete _self.temjson1.results[i].invoice_fval;
				// 	delete _self.temjson1.results[i].invoice_fcur;
				// 	delete _self.temjson1.results[i].lcdocno;
				// 	delete _self.temjson1.results[i].version;
				// 	delete _self.temjson1.results[i].lcinvval;
				// 	delete _self.temjson1.results[i].fccurr;
				// 	delete _self.temjson1.results[i].ersda;
				// 	delete _self.temjson1.results[i].aenam;
				// 	delete _self.temjson1.results[i].laeda;
				// 	delete _self.temjson1.results[i].timestamp;
				// 	delete _self.temjson1.results[i].create_time;
				// 	delete _self.temjson1.results[i].change_time;
				// 	delete _self.temjson1.results[i].delindicator;
				// 	delete _self.temjson1.results[i].total_invoice_net_weight;
				// 	delete _self.temjson1.results[i].meins;
				// 	delete _self.temjson1.results[i].total_invoice_gross_weight;
				// 	delete _self.temjson1.results[i].invoice_bill_to_party_name;
				// 	delete _self.temjson1.results[i].invbilptystrt;
				// 	delete _self.temjson1.results[i].invbilptycity;
				// 	delete _self.temjson1.results[i].invbilptypstlz;
				// 	delete _self.temjson1.results[i].invbilptyland;
				// 	delete _self.temjson1.results[i].flag1;
				// 	delete _self.temjson1.results[i].openacc_flag;
				// 	delete _self.temjson1.results[i].aprefnr;
				// 	delete _self.temjson1.results[i].waers;
				// 	delete _self.temjson1.results[i].boldt;
				// 	delete _self.temjson1.results[i].consigncod;
				// 	delete _self.temjson1.results[i].lifnr;
				// 	_self.omdelItem.update(
				// 		"/xBRIxopen_account_ITEM(intno='" + _self.intno +
				// 		"',docnr='" + _self.temjson1.results[
				// 			i].docnr + "',doccat='" + _self.temjson1.results[
				// 			i].doccat + "',invoicenr='" + _self.temjson1.results[
				// 			i].invoicenr + "')", _self.temjson1.results[i]), mParameters;

				// } else

				if (_self.temjson1.results[i].checked == "false") {
					// if (_self.temjson1.results[i].custom_boe_date == "") {
					// 	// _self.temjson1.results[i].custom_boe_date = null;
					// 	MessageBox.error("Can't save date as empty");
					// 	_self._CloseBusyDialog();
					// 	return;
					// }
					var flag = 0;
					var invlen = _self.getView().byId("totinvval").getValue();
					if (invlen == 0) {
						flag = 1;
					}
					if (flag == 1) {
						MessageBox.error("Atleast One item should Exists");
						_self._CloseBusyDialog();
						return true;
					}
					delete _self.temjson1.results[i].__metadata;
					delete _self.temjson1.results[i].checked;
					delete _self.temjson1.results[i].iteno;
					delete _self.temjson1.results[i].ernam;
					delete _self.temjson1.results[i].invoice_fval;
					delete _self.temjson1.results[i].invoice_fcur;
					delete _self.temjson1.results[i].lcdocno;
					delete _self.temjson1.results[i].version;
					delete _self.temjson1.results[i].lcinvval;
					delete _self.temjson1.results[i].fccurr;
					delete _self.temjson1.results[i].ersda;
					delete _self.temjson1.results[i].aenam;
					delete _self.temjson1.results[i].laeda;
					delete _self.temjson1.results[i].timestamp;
					delete _self.temjson1.results[i].create_time;
					delete _self.temjson1.results[i].change_time;
					delete _self.temjson1.results[i].delindicator;
					delete _self.temjson1.results[i].total_invoice_net_weight;
					delete _self.temjson1.results[i].meins;
					delete _self.temjson1.results[i].total_invoice_gross_weight;
					delete _self.temjson1.results[i].invoice_bill_to_party_name;
					delete _self.temjson1.results[i].invbilptystrt;
					delete _self.temjson1.results[i].invbilptycity;
					delete _self.temjson1.results[i].invbilptypstlz;
					delete _self.temjson1.results[i].invbilptyland;
					delete _self.temjson1.results[i].flag1;
					delete _self.temjson1.results[i].openacc_flag;
					delete _self.temjson1.results[i].aprefnr;
					delete _self.temjson1.results[i].waers;
					delete _self.temjson1.results[i].boldt;
					delete _self.temjson1.results[i].consigncod;
					delete _self.temjson1.results[i].lifnr;
					_self.omdelItem.remove(
						"/xBRIxopen_account_ITEM(intno='" + _self.intno +
						"',docnr='" + _self.temjson1.results[
							i].docnr + "',doccat='" + _self.temjson1.results[
								i].doccat + "',invoicenr='" + _self.temjson1.results[
									i].invoicenr + "')", mParameters);
				} else { }
				//else if ((_self.advpayitmValues2.results[e].checked == "true") && (_self.advpayitmValues2.results[e].flag == undefined))

			}

			// for (var i = 0; i < _self.temjson1.results.length; i += 1) {
			// 	// if (_self.temjson1.results[i].checked == "true") {
			// 		// if (_self.temjson1.results[i].amnoutntpayble = !undefined) {
			// 			_self.amnoutntpayble = _self.amnoutntpayble + ".00";
			// 		// }


			// 	// }
			// }
			// _self.amnoutntpayble = _self.amnoutntpayble + ".00";

			// var flag = 0;
			// var invlen = _self.getView().byId("totinvval").getValue();
			// if (invlen == 0) {
			// 	flag = 1;
			// }
			// if (flag == 1) {
			// 	MessageBox.error("Atleast Fill One item of each Invoice Number");
			// 	return true;
			// }
			var _self = this;

			this.omdelItem.update("/xBRIxopen_account_hdr('" + this.intno + "')", _self.oEntry, {
				// method: "POST",
				success: function (oData, response) {
					// var flag = 0;
					// var invlen = _self.getView().byId("totinvval").getValue();
					// if (invlen == 0) {
					// 	flag = 1;
					// }
					// if (flag == 1) {
					// 	MessageBox.error("Atleast Fill One item of each Invoice Number");
					// 	return;
					// } 
					// else 
					// {
					var msg = "Document Number:" + _self.intno + " " + "Updated Successfully";
					var m = JSON.parse(response.headers["sap-message"]).message;
					var Trkno = m.split(" ")[1];
					MessageBox.success(msg, {
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								window.FlagRefresh = true;
								window.Trkno1 = Trkno;
								_self.router.navTo("openacntlist", true);
								_self._CloseBusyDialog();

							}
						}
					});
					//}
					_self._CloseBusyDialog();

				},

				error: function (err) {
					MessageBox.error("Something went wrong,Please try again later.");
					_self._CloseBusyDialog();
				}
			});

			//_self.omodelParntEdit.submitChanges({
			//             mParameters,
			//             success: function (response, getData) {
			//                 var flag = 0;
			//                 for (var k = 0; k < _self.advpayhdrValues.results.length; k++) {
			//                     if (_self.advpayhdrValues.results[k].anetwr == "0.00") {
			//                         flag = 1;
			//                     }
			//                 }
			//                 if (flag == 0) {
			//                     var msg = "Document Number:" + _self.advrefno + " " + "Updated Successfully";
			//                 }
			//                 else {
			//                     MessageBox.error("Atleast Fill One item of each PO Number");

			//                     return;
			//                 }
			//                 MessageBox.success(msg, {
			//                     actions: [sap.m.MessageBox.Action.OK],
			//                     onClose: function (oAction) {
			//                         if (oAction === sap.m.MessageBox.Action.OK) {
			//                             _self.advpayitmValues.results.splice(0, itemLen);
			//                             _self.advpayhdrValues.results.splice(0, itemLen);
			//                             window.FlagRefresh = true;
			//                             window.advrefnofrom = _self.advrefno;
			//                             this.onNavTrigger = 0;
			//                             _self.router.navTo("app", true);
			//                             _self._CloseBusyDialog();
			//                         }
			//                     }
			//                 });
			//                 // }

			//             },
			//             error: function (err) {
			//                 MessageBox.error("Something went wrong,Please try again later.");
			//                 _self._CloseBusyDialog();
			//             }
			//         });

		},
		OnPressAccept: function (oEvent) {
			debugger;

			var _self = this;

			// , {
			// 	actions: [sap.m.MessageBox.Action.OK],
			// 	onClose: function (oAction) {
			// 		if (oAction === sap.m.MessageBox.Action.OK) {
			// 			if (sPrevHash !== undefined) {
			// 				window.history.go(-1);
			// 			} else {
			// 				_self.router.navTo("openacntlist", true);
			// 			}
			// 		}
			// 	}
			// }


			var oTable = _self.byId("idItemTtable");
			var lengthOfCell = oTable.getSelectedIndices().length;
			// var rowval = oEvent.getSource().getParent().sId.slice(33);
			// var rowval = parseFloat(rowval);
			var rowval = oEvent.getSource().getParent().getIndex();
			if (oEvent.oSource.mProperties.pressed == true) {
				MessageBox.warning("Are you sure for Retire an item?");
				_self.temjson1.results[rowval].retirement = "X";
			} else {
				MessageBox.warning("Are you sure for Unretire an item?");
				_self.temjson1.results[rowval].retirement = "";
			}
			// oTable.setEnableSelectAll(false);
			// oTable.setSelectionMode("None");
		},
		convertToSAPdate: function (value) { //alert(value);
			if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else if (value.indexOf("T00:00:00")) {
					return value;
				} else { }
				var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
				var day = ("0" + NewDateform.getDate()).slice(-2);
				var output = [NewDateform.getFullYear(), mnth, day].join("-") + "T00:00:00";
				return output;
			}
		},
		ConvertJsonDate: function (value) {
			output = "";
			if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else if (value.indexOf("T00:00:00")) {
					var NewDateform = new Date(value.substring(0, 10));
				} else {
					var formattedJsonDate = eval('new' + value.replace(/\//g, ' '));
					var NewDateform = new Date(formattedJsonDate);
				}
				var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
				var day = ("0" + NewDateform.getDate()).slice(-2);
				var output = [day, mnth, NewDateform.getFullYear()].join("/");
			}
			return output;
		},
		handleValueHelpVendor: function (oEvent) {
			this._OpenBusyDialog();
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialogVendor) {
				this._valueHelpDialogVendor = sap.ui.xmlfragment("bri.open_account.view.fragments.Vendor", this);
				this.getView().addDependent(this._valueHelpDialogVendor);
			}
			this._CloseBusyDialog();
			this._valueHelpDialogVendor.open(sInputValue);
		},
		_handleValueHelpSearchVendor: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"lifnr",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpCloseVendor: function (oEvent) {
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItemvendor = oEvent.getParameter("selectedItem").getTitle();
				// this.getView().byId("vendor").setValue(oEvent.getParameter("selectedItem").getTitle());
				_self.getView().byId("vendordes").setText(oEvent.getParameter("selectedItem").getDescription());
				if (_self.oSelectedItemvendor) {
					var reqNoInputFrom = this.getView().byId(this.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItemvendor);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		handleValueHelpCompany: function (oEvent) {
			this._OpenBusyDialog();
			var _self = this;
			var sInputValue = oEvent.getSource().getValue();
			_self.inputId = oEvent.getSource().getId();
			if (!_self._valueHelpDialogCompany) {
				_self._valueHelpDialogCompany = sap.ui.xmlfragment("bri.open_account.view.fragments.Company", _self);
				_self.getView().addDependent(_self._valueHelpDialogCompany);
			}
			_self._CloseBusyDialog();
			_self._valueHelpDialogCompany.open(sInputValue);
		},
		_handleValueHelpSearchCompany: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"bukrs",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpCloseCompany: function (oEvent) {
			debugger;
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItemCompany = oEvent.getParameter("selectedItem").getTitle();
				// _self.getView().byId("comp").setValue(oEvent.getParameter("selectedItem").getTitle());
				_self.getView().byId("compdes").setText(oEvent.getParameter("selectedItem").getDescription());
				if (_self.oSelectedItemCompany) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItemCompany);
				}
				// _self.getView().byId("lebelMode2").setVisible(true);
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		handleValueHelpImpBank: function (oEvent) {
			this._OpenBusyDialog();
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialogimpbank) {
				this._valueHelpDialogimpbank = sap.ui.xmlfragment("bri.open_account.view.fragments.ImpBank", this);
				this.getView().addDependent(this._valueHelpDialogimpbank);
			}
			this._CloseBusyDialog();
			this._valueHelpDialogimpbank.open(sInputValue);
		},
		handleValueHelpBnfBank: function (oEvent) {
			debugger;
			this._OpenBusyDialog();
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialogbnfbank) {
				this._valueHelpDialogbnfbank = sap.ui.xmlfragment("bri.open_account.view.fragments.BnfBank", this);
				this.getView().addDependent(this._valueHelpDialogbnfbank);
			}
			this._CloseBusyDialog();
			this._valueHelpDialogbnfbank.open(sInputValue);
		},
		_handleValueHelpSearchBnfBank: function (oEvent) {
			debugger;
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"banks",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpCloseBnfBank: function (oEvent) {
			debugger;
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				_self.getView().byId("swift").setValue(oEvent.getParameter("selectedItem").getInfo());
				if (_self.oSelectedItem) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		_handleValueHelpSearchImpBank: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"banks",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpCloseImpBank: function (oEvent) {
			debugger;
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (_self.oSelectedItem) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		handleValueHelpincotrm: function (oEvent) {
			this._OpenBusyDialog();
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialogincotrm) {
				this._valueHelpDialogincotrm = sap.ui.xmlfragment("bri.open_account.view.fragments.incotrm", this);
				this.getView().addDependent(this._valueHelpDialogincotrm);
			}
			this._CloseBusyDialog();
			this._valueHelpDialogincotrm.open(sInputValue);
		},
		_handleValueHelpSearchincotrm: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"inco1",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpCloseincotrm: function (oEvent) {
			debugger;
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (_self.oSelectedItem) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		handleValueHelpPaymnttrm: function (oEvent) {
			this._OpenBusyDialog();
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialogpytrm) {
				this._valueHelpDialogpytrm = sap.ui.xmlfragment("bri.open_account.view.fragments.paymntTrms", this);
				this.getView().addDependent(this._valueHelpDialogpytrm);
			}
			this._CloseBusyDialog();
			this._valueHelpDialogpytrm.open(sInputValue);
		},
		_handleValueHelpSearchpymntrm: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"codtyp",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},
		_handleValueHelpClosepymntrm: function (oEvent) {
			debugger;
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (_self.oSelectedItem) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		// addItemRow: function () {
		// 	debugger;
		// 	// this.commrate = 
		// 	var _self = this;

		// 	_self.temjson1.results.push({
		// 		// s_no: (parseInt(_self.temjson1.results.length) + 1).toString(),
		// 		iteno: "",
		// 		doccat: "",
		// 		docnr: "",
		// 		invoicenr: "",
		// 		invoicedt: "",
		// 		invoiceval: "",
		// 		invoicecur: "",
		// 		openacc_value: "",
		// 		openacc_curr: "",
		// 		amount_payable: "",
		// 		pol_desc: "",
		// 		pod_desc: "",
		// 		werks: "",
		// 		custom_boe_no: "",
		// 		custom_boe_date: "",
		// 		bank_charges: "",
		// 		remark: "",
		// 		flag: "X"

		// 	});

		// 	var oModelData = new sap.ui.model.json.JSONModel();
		// 	oModelData.setData(_self.temjson1);
		// 	_self.getView().setModel(oModelData, "list1");
		// 	// }
		// 	/*************** oModelDEPB details ***************************/

		// },
		addItemRow: function (oEvent) {
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpInv) {
				this._valueHelpInv = sap.ui.xmlfragment("bri.open_account.view.fragments.Additem", this);
				this.getView().addDependent(this._valueHelpInv);
			}

			this._valueHelpInv.open();
		},
		onPressGoBack: function () {
			//history.go(-1);
			var _self = this;
			var sPrevHash = History.getInstance().getPreviousHash();
			MessageBox.warning("Your entries will be lost if you leave this page.", {
				actions: [sap.m.MessageBox.Action.OK],
				onClose: function (oAction) {
					if (oAction === sap.m.MessageBox.Action.OK) {
						if (sPrevHash !== undefined) {
							window.history.go(-1);
						} else {
							_self.router.navTo("openacntlist", true);
						}
					}
				}
			});
		},
		OnChangeSwitch: function () {
			debugger;
			var EnabledModel = new sap.ui.model.json.JSONModel({
				enable: true
			});

			this.getView().setModel(EnabledModel, "State");


			if (this.byId("idSwtichMode").getState() === false) {
				EnabledModel.setProperty('/enable', false);
				this.AuthConfiguration("Display");
				// EnabledModelanetwr1.setProperty('/enable', false);
				this.getView().byId("save").setVisible(false);
				this.getView().byId("addItemBtns").setVisible(false);
			} else {
				this.AuthConfiguration("Change");
				EnabledModel.setProperty('/enable', true);
				// EnabledModelanetwr1.setProperty('/enable', true);
				this.getView().byId("save").setVisible(true);
				this.getView().byId("addItemBtns").setVisible(true);
			}

		},

		onUpdateLicense: function (oEvent) {
			debugger;
			var _self = this;
			var Check_StatusInvItm = false;
			var Check_Status = _self.CheckRequiredFields("Change");
			if (Check_Status) {

				if (this.temjson1.results.length > 0) {

					// if ((this.temjson1.results.length > 0) && (this.temjson1.results.length < 0)) { 
					for (var i = 0; i < this.temjson1.results.length; i++) {
						// delete this.temjson1.results[i].lifnr;
						Check_StatusInvItm = this.CheckItemRequired(JSON.parse(JSON.stringify(this.temjson1.results[i])));

						if (!Check_StatusInvItm)
							break;
					}
				} else {
					Check_StatusInvItm = true;
				}
				if (Check_StatusInvItm) {
					if (_self.Msg != "" && _self.NotValid === true) {
						MessageBox.warning(_self.Msg + " is not filled,Would you like to continue?", {
							actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
							onClose: function (oAction) {
								if (oAction === sap.m.MessageBox.Action.NO) {
									// var Data = _self.onPressSave();
								} else {
									_self.onPressSave();
								}
							}
						});
					} else {
						var Data = _self.onPressSave();
					}
				} else { }
			} else {

			}
		},
		
		_modelSetRefresh: function (modelName, modelData) {
			this.getView().getModel(modelName).setData(modelData);
			this.getView().getModel(modelName).refresh();
		},
		AuthConfiguration: function (Type) {
			debugger;

			// var status = this.getView().byId("paymntstt").getValue();
			// if (status == "Partially Paid") {
			// 	var stat = "96";
			// } else {
			// 	var stat = "97";
			// }
			if (Type == "Display") {
				var entity = "xBRIxI_UICONFIG";
				var actvt = "03";
				if (this.ItemMand) {
					for (var i = 0; i < this.ItemMand.length; i++) {
						this.byId(this.ItemMand[i]).setRequired(false);
					}
				}
				if (this.RequiredFileds) {
					for (var i = 0; i < this.RequiredFileds.length; i++) {
						this.byId(this.RequiredFileds[i]).setRequired(false);
					}
				}
			} else if (Type == "Change") {
				var entity = "xBRIxI_UICONFIG";
				var actvt = "02";

				// xBRIxI_UICONFIG02
			} else {
				var entity = "xBRIxI_UICONFIG";
				var actvt = "01";
				// this.Status = 1;
			}

			var _self = this;
			var status = this.getView().byId("paymntstt").getValue();
			if (status == "Partially Paid") {
				var stat = "96";
			} else {
				var stat = "97";
			}
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("modid", sap.ui.model.FilterOperator.EQ, "OPAC");
			filters.push(filterval);
			var filterval = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, stat);
			filters.push(filterval);

			var filterval = new sap.ui.model.Filter("actvt", sap.ui.model.FilterOperator.EQ, actvt);
			filters.push(filterval);

			// var filters = new Array();
			// if (Type == "Display") {
			// 	var entity = "xBRIxI_UICONFIG";
			// 	if (this.RequiredFileds) {
			// 		for (var i = 0; i < this.RequiredFileds.length; i++) {
			// 			this.byId(this.RequiredFileds[i]).setRequired(false);
			// 		}
			// 	}
				
			// } else if (Type == "Change") {
			// 	var filterval = new sap.ui.model.Filter("modid", sap.ui.model.FilterOperator.EQ, "OPAC");
			// 	filters.push(filterval);
			// 	var filterval = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, stat);
			// 	filters.push(filterval);
			// 	var filterval = new sap.ui.model.Filter("actvt", sap.ui.model.FilterOperator.EQ, "02");
			// 	filters.push(filterval);
			// 	var entity = "xBRIxI_UICONFIG";
			// }
			var _self = this;


			_self.RequiredFileds = new Array(); //header
			_self.RequiredFiledsDesc = new Array();
			_self.RequiredFiledsErrorSts = new Array();
			_self.RequiredFiledsDropDwn = new Array();
			_self.ItemMand = new Array(); //items fields
			_self.ItemFiledsDesc = new Array();
			_self.ItemFiledsErrorSts = new Array();
			_self.ItemFiledsDropDwn = new Array();

			_self.getOwnerComponent().getModel("config_model").read("/" + entity, {
				filters: filters,
				success: function (getData) {
					debugger;
					var arr = getData.results;
					console.log("Array");
					console.log(arr);
					for (var i = 0; i < arr.length; i++) {

						if (arr[i].entityset == "tab_") {
							_self.getView().byId('tab_' + arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
						} else
							if (arr[i].entityset == "btn_") {
								_self.getView().byId('btn_' + arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
							} else
								if (arr[i].tbl == true) {
									if (_self.getView().byId(arr[i].fldnam)) {
										_self.getView().byId(arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
									}
								} else {
									if (_self.getView().byId(arr[i].fldnam)) {
										// _self.getView().byId(arr[i].fldnam).setVisible((arr[i].visible == "true") ? true : false);
										// _self.getView().byId(arr[i].fldnam).setRequired((arr[i].required == "true") ? true : false);
										if (arr[i].required == "true") {
											if (arr[i].entityset.match("xBRIxopen_account_ITEM")) {
												_self.ItemMand.push(arr[i].fldnam);
												_self.ItemFiledsDesc.push(arr[i].flddescr);
												_self.ItemFiledsErrorSts.push(arr[i].errstat);

											} else if (arr[i].entityset.match("xBRIxopen_account_hdr")) {
												_self.RequiredFileds.push(arr[i].fldnam);
												_self.RequiredFiledsDesc.push(arr[i].flddescr);
												_self.RequiredFiledsErrorSts.push(arr[i].errstat);

											}

										}
									}
								}
					}
					eval();
					// _self.mandatoryList.results = getData.results.filter(a => a.required == "true");
					getData.results.map(function (value) {
						eval("_self.xBRIxI_EDSGENHD_A2TypeData." + value.fldnam + "_required=" + value.required);
						eval("_self.visibleData." + value.fldnam + "_visible=" + value.visible);
						// eval("_self.xBRIxI_EDSGENHD_A1TypeData." + value.fldnam + "_visible=" + value.visible);
						eval("_self.xBRIxI_EDSGENHD_A1TypeData." + value.fldnam + "_editable=" + value.editable);
						eval("_self.xBRIxI_EDSGENHD_A1TypeData." + value.fldnam + "_enable=" + value.enable);
					});

					_self._modelSetRefresh("visible_Model", _self.visibleData);
					_self._modelSetRefresh("xBRIxI_EDSGENHD_A1Type_Model", _self.xBRIxI_EDSGENHD_A1TypeData);
					_self._modelSetRefresh("xBRIxI_EDSGENHD_A2Type_Model", _self.xBRIxI_EDSGENHD_A2TypeData);

					// resolve();
				},

				error: function (error) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
				}

			});

			console.log(_self.RequiredFileds);
			console.log(_self.ItemMand);
			console.log(_self.ItemFiledsDesc);

		},
		CheckRequiredFields: function (Type) {

			var ErrorMsg = "";
			var WarningMsg = "";
			var arra = this.RequiredFileds;
			this.NotValid = false;
			var MsgType = "";
			for (var i = 0; i < this.RequiredFileds.length; i++) {

				if (this.RequiredFiledsDropDwn[i] == "true") {
					var value = this.getView().byId(this.RequiredFileds[i]).getSelectedKey();
				} else {
					var value = this.getView().byId(this.RequiredFileds[i]).getValue();
				}
				if (value == "") {
					if (this.RequiredFiledsErrorSts[i] == "E") {
						MsgType = "Error";
						this.NotValid = true;
						ErrorMsg = ErrorMsg + this.RequiredFiledsDesc[i] + ","
					} else {
						this.NotValid = true;
						WarningMsg = WarningMsg + this.RequiredFiledsDesc[i] + ","
					}
				}
			}
			if (MsgType == "Error") {
				this.Msg = ErrorMsg.substring(0, ErrorMsg.length - 1);
				MessageBox.error("Please fill " + this.Msg);
				this._CloseBusyDialog();
				return false;
			} else {
				this.Msg = WarningMsg.substring(0, WarningMsg.length - 1);
				this._CloseBusyDialog();
			}
			return true;
		},
		CheckItemRequired: function (arr, Type) {
			var ErrorMsg = "";
			var WarningMsg = "";
			var arra = this.ItemMand;
			this.NotValid = false;
			var MsgType = "";

			for (var i = 0; i < this.ItemMand.length; i++) {
				if (arr.hasOwnProperty(this.ItemMand[i])) {
					// if (this.ItemMand[i] == "invoicenrItm") {
					// 	this.ItemMand[i] = "invoicenr";
					// }
					if (arr[this.ItemMand[i]] == "" || arr[this.ItemMand[i]] == null) {

						if (this.ItemFiledsErrorSts[i] == "E") {
							MsgType = "Error";
							this.NotValid = true;
							ErrorMsg = ErrorMsg + this.ItemFiledsDesc[i] + ","
						} else {
							this.NotValid = true;
							WarningMsg = WarningMsg + this.ItemFiledsDesc[i] + ","
						}
					}
				}

			}
			if (MsgType == "Error") {
				this.Msg = ErrorMsg.substring(0, ErrorMsg.length - 1);
				MessageBox.error("Please fill " + this.Msg);
				this._CloseBusyDialog();
				return false;
			} else {
				this.Msg = WarningMsg.substring(0, WarningMsg.length - 1);
				this._CloseBusyDialog();

			}
			return true;
		},
		// Numbercheck1: function (oEvent) {
		// 	debugger;
		// 	const regex = /^[a-zA-Z]+$/
		// 	var inputValue = oEvent.mParameters.newValue;
		// 	var check = regex.test(inputValue);
		// 	if (check == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("bnkrefno").setValue("");
		// 	} else {

		// 	}
		// },
		// Numbercheck2: function (oEvent) {
		// 	debugger;
		// 	const regex = /^[a-zA-Z]+$/
		// 	var inputValue = oEvent.mParameters.newValue;
		// 	var check = regex.test(inputValue);
		// 	if (check == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("accno").setValue("");
		// 	} else {

		// 	}
		// },
		// Numbercheck3: function (oEvent) {
		// 	debugger;
		// 	const regex = /^[a-zA-Z]+$/
		// 	var inputValue = oEvent.mParameters.newValue;
		// 	var check = regex.test(inputValue);
		// 	if (check == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("bankn").setValue("");
		// 	} else {

		// 	}
		// },
		// Numbercheck4: function (oEvent) {
		// 	debugger;
		// 	const regex = /^[a-zA-Z]+$/
		// 	var inputValue = oEvent.mParameters.newValue;
		// 	var check = regex.test(inputValue);
		// 	if (check == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("ad_code").setValue("");
		// 	} else {

		// 	}
		// },
		// Numbercheck5: function (oEvent) {
		// 	debugger;
		// 	const regex = /^[a-zA-Z]+$/
		// 	var inputValue = oEvent.mParameters.newValue;
		// 	var check = regex.test(inputValue);
		// 	if (check == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("ekorg").setValue("");
		// 	} else {

		// 	}
		// },
		// Numbercheck6: function (oEvent) {
		// 	debugger;
		// 	const regex = /^[a-zA-Z]+$/
		// 	var inputValue = oEvent.mParameters.newValue;
		// 	var check = regex.test(inputValue);
		// 	if (check == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("bsart").setValue("");
		// 	} else {

		// 	}
		// },
		DecCheck: function (oEvent) {
			// debugger;
			// var val = oEvent.mParameters.newValue;
			// var val2 = isNaN(val);
			// if ((val2) == true) {
			// 	MessageBox.error("Only accept Numbers");
			// 	this.getView().byId("bank_exc_rate1").setValue("");
			// }
			// var val = parseFloat(val);
			// var roundedNumber = val.toFixed(4);
			// if (roundedNumber != val) {
			// 	MessageBox.error("Error: Number should have at most four decimal places.");
			// 	this.getView().byId("bank_exc_rate1").setValue("");
			// }

			debugger;
			var val = oEvent.mParameters.newValue;

			var val2 = isNaN(val);
			if ((val2) == true) {
				MessageBox.error("Only accept Numbers");
				this.getView().byId("bank_exc_rate1").setValue("");
			}
			if (val != "") {
				var val = parseFloat(val);
				var roundedNumber = val.toFixed(4);
				if (roundedNumber != val) {
					MessageBox.error("Error: Number should have at most four decimal places.");
					// var msg = "Error: Number should have at most four decimal places.";
					this.getView().byId("bank_exc_rate1").setValue(0);
					for (var i = 0; i < this.temjson1.results.length; i++) {
						const object = this.temjson1.results[i];
						if (object.checked == "true") {
							object.bank_exc_rate = val;
							object.bank_exc_rate = object.bank_exc_rate.toString();
							// if (object.bank_exc_rate.includes(".")) {
							// 	for (var i = 0; i < this.tempjson.results.length; i++) {
							// 		this.bank = this.tempjson.results[i].bank_exc_rate;
							// 		if ((this.bank != undefined) && (this.bank != 0)) {
							// 			this.bank1 = this.bank.slice(0, -2);
							// 		}

							// 	}
							// 	object.bank_exc_rate = this.bank1;

							// }
							object.amount_inr = this.getView().byId("bank_exc_rate1").getValue() * object.amount_payable;
						}
					}
					this.getView().getModel("list1").setData(this.temjson1);
					this.getView().getModel("list1").refresh();

				}
				else {
					for (var i = 0; i < this.temjson1.results.length; i++) {
						const object = this.temjson1.results[i];
						if (object.checked == "true") {
							object.bank_exc_rate = val;
							object.bank_exc_rate = object.bank_exc_rate.toString();
							// if (object.bank_exc_rate.includes(".")) {
							// 	for (var i = 0; i < this.tempjson.results.length; i++) {
							// 		this.bank = this.tempjson.results[i].bank_exc_rate;
							// 		if ((this.bank != undefined) && (this.bank != 0)) {
							// 			this.bank1 = this.bank.slice(0, -2);
							// 		}

							// 	}
							// 	object.bank_exc_rate = this.bank1;

							// }
							object.amount_inr = object.bank_exc_rate * object.amount_payable;
							object.amount_inr = object.amount_inr.toFixed(2);
						}
					}
					this.getView().getModel("list1").setData(this.temjson1);
					this.getView().getModel("list1").refresh();
				}
			}
			else {
				for (var i = 0; i < this.temjson1.results.length; i++) {
					const object = this.temjson1.results[i];
					if (object.checked == "true") {
						object.bank_exc_rate = val;
						// if (object.bank_exc_rate.includes(".")) {
						// 	for (var i = 0; i < this.tempjson.results.length; i++) {
						// 		this.bank = this.tempjson.results[i].bank_exc_rate;
						// 		if ((this.bank != undefined) && (this.bank != 0)) {
						// 			this.bank1 = this.bank.slice(0, -2);
						// 		}

						// 	}
						// 	object.bank_exc_rate = this.bank1;

						// }
						object.amount_inr = object.bank_exc_rate * object.amount_payable;
						object.amount_inr = object.amount_inr.toFixed(2);
					}
				}
				this.getView().getModel("list1").setData(this.temjson1);
				this.getView().getModel("list1").refresh();
			}






		},
		DecCheck1: function (oEvent) {
			debugger;
			var rowval = oEvent.getSource().getParent().getIndex();
			var val = oEvent.mParameters.newValue;
			var val2 = isNaN(val);
			if ((val2) == true) {
				MessageBox.error("Only accept Numbers");
				this.temjson1.results[rowval].bank_charges = "";
			}
			var val = parseFloat(val);
			var roundedNumber = val.toFixed(2);
			if (roundedNumber != val) {
				MessageBox.error("Error: Number should have at most two decimal places.");
				this.temjson1.results[rowval].bank_charges = "";
			}



		},
		DecCheck2: function (oEvent) {
			debugger;
			var rowval = oEvent.getSource().getParent().getIndex();
			var oTable = this.byId("idItemTtable");
			var val = oEvent.mParameters.newValue;


			if ((val == "") || (val == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make Debit Amount filed as null");
				return;
			}

			var val2 = isNaN(val);
			if ((val2) == true) {
				MessageBox.error("Only accept Numbers");
				this.temjson1.results[rowval].db_amt = "";
			}
			var val = parseFloat(val);
			var roundedNumber = val.toFixed(2);
			if (roundedNumber != val) {
				MessageBox.error("Error: Number should have at most two decimal places.");
				this.temjson1.results[rowval].db_amt = "";
				// this.getView().byId("db_amt").setValue("");
			}

		},
		onDialogExit: function (oEvent) {
			// sap.ui.getCore().byId("selectionbased").setValue("");
			// sap.ui.getCore().byId("selectionbasedon").setValue("");
			sap.ui.getCore().byId("poNoDialog").setValue("");
			this._valueHelpInv.close();
		},
		_OpenBusyDialog: function () {
			if (!this.bsdalog) {
				this.bsdalog = sap.ui.xmlfragment(this.getView().getId(), "bri.open_account.view.fragments.BusyDia", this);
				this.getView().addDependent(this.bsdalog);
			}
			this.bsdalog.open();
		},
		_CloseBusyDialog: function () {
			this.bsdalog.close();
		},
	});

});