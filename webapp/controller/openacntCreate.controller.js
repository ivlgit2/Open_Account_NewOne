sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (Controller, MessageBox, History) {
	"use strict";

	return Controller.extend("bri.open_account.controller.openacntCreate", {

		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.omodelVendor = this.getOwnerComponent().getModel("Vendor_Model");
			this.omodelCodetyp = this.getOwnerComponent().getModel("Vendor_Model");
			this.omdelItem = this.getOwnerComponent().getModel("Item_Model");
			this.tempjson = {
				results: []
			};
		},
		_handleRouteMatched: function (oEvent) {
			debugger;
			this.getView().byId("lifnr1").setValue("");
			this.getView().byId("company_name").setValue("");
			this.getView().byId("idIconTabBa1r").setVisible(false);
			this.getView().byId("idIconTabBar").setVisible(false);
			this.getView().byId("lebelMode2").setVisible(false);
			this.Cleardata();
			this.tempjson = {
				results: []
			};
			var oModelData = new sap.ui.model.json.JSONModel();
			oModelData.setData(this.tempjson);
			this.getView().setModel(oModelData, "tableLists");
			this.getView().getModel("tableLists").refresh();

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

		},
		Cleardata: function () {

			this.getView().byId("pay_date").setValue(null);
			this.getView().byId("bnkrefno").setValue(null);
			this.getView().byId("og_docdt").setValue(null);
			this.getView().byId("due_date").setValue(null);
			this.getView().byId("imp_bank").setValue(null);
			this.getView().byId("banka").setValue(null);
			this.getView().byId("accno").setValue(null);
			this.getView().byId("bankn").setValue(null);
			this.getView().byId("bank_exc_rate1").setValue(null);
			this.getView().byId("totinvval").setValue(null);
			this.getView().byId("totamtpaid").setValue(null);
			this.getView().byId("balance").setValue(null);
			this.getView().byId("paymntstt").setValue(null);
			this.getView().byId("ad_code").setValue(null);
			this.getView().byId("swift").setValue(null);
			this.getView().byId("inco1").setValue(null);
			this.getView().byId("zterm").setValue(null);
			this.getView().byId("ekorg").setValue(null);
			this.getView().byId("bsart").setValue(null);

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

		_handleValueHelpCloseVendor: async function (oEvent) {
			var _self = this;
			if (oEvent.getParameter("selectedItem")) {
				_self.oSelectedItemvendor = oEvent.getParameter("selectedItem").getTitle();
				this.getView().byId("lifnr").setValue(oEvent.getParameter("selectedItem").getTitle());
				this.getView().byId("vendordes").setText(oEvent.getParameter("selectedItem").getDescription());
				if (_self.oSelectedItemvendor) {
					var reqNoInputFrom = this.getView().byId(this.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItemvendor);
				}

				oEvent.getSource().getBinding("items").filter([]);
				if (_self.oSelectedItemvendor != "") {
					_self.getView().byId("idIconTabBar").setVisible(true);
					_self.getView().byId("idIconTabBa1r").setVisible(true);
					_self.getView().byId("save").setVisible(true);
					
					_self.AuthConfiguration("Create");
					// await _self.itemgetCodetyp();
					await _self.itemget();
					_self.itemgetCodetyp();
					_self.itemgetCountry();
					

				}
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
				_self.getView().byId("consigncod").setValue(oEvent.getParameter("selectedItem").getTitle());
				_self.getView().byId("compdes").setText(oEvent.getParameter("selectedItem").getDescription());
				if (_self.oSelectedItemCompany) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItemCompany);
				}
				_self.getView().byId("lebelMode2").setVisible(true);
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
		itemget: function () {
			debugger;
			return new Promise(async (resolve, reject) => {
				var _self = this;
				_self._OpenBusyDialog();
				_self.omdelItem.read("/xBRIxi_open_account_item", {
					success: function (oData) {
						console.log(oData);
						if (oData.results.length <= 0) {
							MessageBox.error("No Matching Result(s) Found for the Filter");
							_self._CloseBusyDialog();
						} else {
							_self.tempjson = {
								results: []
							};
							_self.tempjson.results = _self.tempjson.results.concat(oData.results);
							_self.tempjson.results = _self.tempjson.results.filter(a => a.lifnr == _self.oSelectedItemvendor);
							_self.tempjson.results = _self.tempjson.results.filter(a => a.consigncod == _self.oSelectedItemCompany);
							for (var i = 0; i < _self.tempjson.results.length; i++) {

								_self.custdate = _self.tempjson.results[i].custom_boe_date;
								_self.custom_boe_date = _self.ConvertJsonDate(_self.custdate);
								_self.tempjson.results[i].custom_boe_date = _self.custom_boe_date;

								_self.custdateata = _self.tempjson.results[i].ata;
								_self.ata = _self.ConvertJsonDate(_self.custdateata);
								_self.tempjson.results[i].ata = _self.ata;

								_self.custdateatd = _self.tempjson.results[i].atd;
								_self.atd = _self.ConvertJsonDate(_self.custdateatd);
								_self.tempjson.results[i].atd = _self.atd;

								// _self.custdatefkdt = _self.temjson1.results[i].fkdat;
								// _self.fkdat = _self.ConvertJsonDate(_self.custdatefkdt);
								// _self.temjson1.results[i].fkdat = _self.fkdat;

								_self.custdatefkdtpo_date = _self.tempjson.results[i].po_date;
								_self.po_date = _self.ConvertJsonDate(_self.custdatefkdtpo_date);
								_self.tempjson.results[i].po_date = _self.po_date;

								_self.tempjson.results[i].fkdat = "";
								_self.tempjson.results[i].db_amt = "";

							}
							var oModelData = new sap.ui.model.json.JSONModel();
							oModelData.setData(_self.tempjson);
							_self.getView().setModel(oModelData, "tableLists");

							var oTable = _self.byId("idItemTtable");
							oTable.clearSelection();

						}
						_self._CloseBusyDialog();
						resolve();
					},
					error: function (error) {
						MessageBox.error("Something Went Wrong . Please Try again Later");
						_self._CloseBusyDialog();
						reject();
					}
					
				});
				
			})

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
		itemgetCodetyp: function () {
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
					for (var i = 0; i < _self.tempjson.results.length; i++) {

						for (var a = 0; a < _self.tempjsonport.results.length; a++) {
							if (_self.tempjsonport.results[a].codtyp == _self.tempjson.results[i].pol) {
								_self.tempjson.results[i].pol_desc = _self.tempjsonport.results[a].coddesc;

							}
							if (_self.tempjsonport.results[a].codtyp == _self.tempjson.results[i].pod) {
								_self.tempjson.results[i].pod_desc = _self.tempjsonport.results[a].coddesc;

							}
						}


					}
					// _self.tempjson.results = _self.tempjson.results.concat(_self.tempjsonport.results);
					// _self.getView().getModel("tableLists").setData(_self.tempjson);
					_self.getView().getModel("tableLists").refresh();
					_self._OpenBusyDialog();
					// 	var oModelcodetyp = new sap.ui.model.json.JSONModel([]);
					// 	oModelcodetyp.setData(getData.results);
					// 	_self.getView().setModel(oModelcodetyp, "codtyp");
				},
				error: function (getData) {
					MessageBox.error("error");
					_self._OpenBusyDialog();

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
					if (_self.temjson1 != undefined) {
						for (var i = 0; i < _self.temjson1.results.length; i++) {
							for (var a = 0; a < _self.tempjsoncountry.results.length; a++) {
								if (_self.tempjsoncountry.results[a].Country == _self.temjson1.results[i].orgcntry) {
									_self.temjson1.results[i].landx = _self.tempjsoncountry.results[a].Country_Text;

								}

							}

						}
						_self.getView().getModel("list1").refresh();
					}
					// _self.tempjson.results = _self.tempjson.results.concat(_self.tempjsoncountry.results);
					// _self.getView().getModel("tableLists").setData(_self.tempjson);


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
		// BalanceCheck: function (oEvent) {
		// 	debugger;
		// 	if (_self.getView().byId("balance").getValue() == 0) {
		// 		_self.getView().byId("paymntstt").setValue("Fully Paid");
		// 	} else {
		// 		_self.getView().byId("paymntstt").setValue("Partially Paid");
		// 	}
		// },
		OnSelectChange: function (oEvent) {
			debugger;
			var _self = this;
			var oTable = _self.byId("idItemTtable");
			var lengthOfCell = oTable.getSelectedIndices().length;
			var allselect = oEvent.mParameters.selectAll;
			var rowval = oEvent.mParameters.rowIndex;

			var selectedIndex = oTable.isIndexSelected(rowval);
			if (allselect == true && rowval == 0) {

				for (var b = 0; b < _self.tempjson.results.length; b++) {
					_self.tempjson.results[b].checked = "true";
				}
				var TotalAppliedAmount = 0;
				var TotalinvAmount = 0;
				var table = oEvent.getSource();
				if (lengthOfCell >= 1) {
					for (var b = 0; b < _self.tempjson.results.length; b++) {
						var totalopamt = _self.tempjson.results[b].openacc_value;
						var totalopamt = parseFloat(totalopamt);
						var amontpayble = _self.tempjson.results[b].amount_payable;
						if (amontpayble !== undefined) {
							var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(amontpayble);
						}
						var TotalinvAmount = parseFloat(TotalinvAmount) + parseFloat(totalopamt);
						_self.getView().byId("totinvval").setValue(TotalinvAmount);
						if (_self.getView().byId("totinvval").getValue() == "") {
							_self.getView().byId("totamtpaid").setValue("0");
							_self.getView().byId("balance").setValue("0");
							// if(_self.getView().byId("balance").getValue() == 0){
							// 	_self.getView().byId("paymntstt").setValue("Fully Paid");
							// }
							// else{
							// 	_self.getView().byId("paymntstt").setValue("Partially Paid");
							// }
						} else if (amontpayble !== "") {
							_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
							var AmountApplied = _self.getView().byId("totamtpaid").getValue();
							var AmountApplied = parseFloat(AmountApplied);
						}

					}
					_self.totalinvAmount = 0;
					for (var i = 0; i < _self.tempjson.results.length; i++) {
						// if (_self.tempjson.results[i].checked == "true") {
						_self.totinv = parseFloat(_self.tempjson.results[i].openacc_value);
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
						_self.getView().byId("balance").setValue(TotalinvAmount);
					}
				} else {
					_self.getView().byId("totinvval").setValue("0");
					_self.getView().byId("totamtpaid").setValue("0");
					_self.getView().byId("balance").setValue("0");
				}
				var object1 = _self.tempjson.results[0].openacc_curr;
				for (var b = 0; b < _self.tempjson.results.length; b++) {

					if (object1 == _self.tempjson.results[b].openacc_curr) {

						const object = _self.tempjson.results[i];
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
					else {
						MessageBox.error("Cannot select item with different currency ");
						oTable.clearSelection();

					}

				}

			} else if (allselect == undefined && rowval == -1) {
				for (var b = 0; b < _self.tempjson.results.length; b++) {
					_self.tempjson.results[b].checked = "false";
				}
				_self.getView().byId("totinvval_curr").setValue("");
				_self.getView().byId("totamtpaid_curr").setValue("");
				_self.getView().byId("tcurr2").setValue("");
				_self.getView().byId("totinvval").setValue("0");
				_self.getView().byId("totamtpaid").setValue("0");
				_self.getView().byId("balance").setValue("0");
				// _self.getView().byId("bank_ex").setValue("0");
				// _self.getView().byId("amount_inr").setValue("0");
				for (var i = 0; i < _self.tempjson.results.length; i++) {
					// this.getView().byId("bank_exc_rate1").setValue(0);
					for (var i = 0; i < _self.tempjson.results.length; i++) {
						const object = _self.tempjson.results[i];
						// if (object.amount_payable != undefined) {
						object.bank_exc_rate = 0;
						object.amount_inr = object.bank_exc_rate * object.amount_payable;
						// }
					}
					_self.getView().getModel("tableLists").setData(_self.tempjson);
					_self.getView().getModel("tableLists").refresh();

				}

			}

			//********************************************
			else {

				for (var b = 0; b < _self.tempjson.results.length; b++) {



					var tblinvoicenr = _self.tempjson.results[rowval].invoicenr;
					if (_self.tempjson.results[rowval].invoicenr == _self.tempjson.results[b].invoicenr) {
						_self.tempjson.results[b].checked = selectedIndex;
						_self.tempjson.results[b].checked = _self.tempjson.results[b].checked.toString();
						if (_self.tempjson.results[b].checked == "true") {
							_self.currnyval = _self.getView().byId("totinvval_curr").getValue();
							if (_self.currnyval == "") {
								_self.openacntCurncy = _self.tempjson.results[b].openacc_curr;
								_self.getView().byId("totinvval_curr").setValue(_self.openacntCurncy);
								_self.getView().byId("totamtpaid_curr").setValue(_self.openacntCurncy);
								_self.getView().byId("tcurr2").setValue(_self.openacntCurncy);
								if (_self.tempjson.results[b].checked == "false") {

								}
							} else {
								if (_self.openacntCurncy == _self.tempjson.results[b].openacc_curr) {
									_self.openacntCurncy = _self.tempjson.results[b].openacc_curr;
									_self.getView().byId("totinvval_curr").setValue(_self.openacntCurncy);
									_self.getView().byId("totamtpaid_curr").setValue(_self.openacntCurncy);
									_self.getView().byId("tcurr2").setValue(_self.openacntCurncy);
									if (_self.tempjson.results[b].checked == "false") {

									}
								} else {
									MessageBox.error("Cannot select item with different currency ");
									oTable.removeSelectionInterval(rowval, rowval);

								}
							}
						} else {
							for (var i = 0; i < _self.tempjson.results.length; i++) {
								if (_self.tempjson.results[i].checked == "true") {
									_self.getView().byId("totinvval_curr").setValue(_self.openacntCurncy);
									_self.getView().byId("totamtpaid_curr").setValue(_self.openacntCurncy);
									_self.getView().byId("tcurr2").setValue(_self.openacntCurncy);
								} else if (lengthOfCell == 0) {

									_self.getView().byId("totinvval_curr").setValue("");
									_self.getView().byId("totamtpaid_curr").setValue("");
									_self.getView().byId("tcurr2").setValue("");
									for (var i = 0; i < _self.tempjson.results.length; i++) {
										// this.getView().byId("bank_exc_rate").setValue(0);
										for (var i = 0; i < _self.tempjson.results.length; i++) {
											const object = _self.tempjson.results[i];
											if (object.amount_payable != undefined) {
												object.bank_exc_rate = 0;
												object.amount_inr = object.bank_exc_rate * object.amount_payable;
											}
										}
										_self.getView().getModel("tableLists").setData(_self.tempjson);
										_self.getView().getModel("tableLists").refresh();

									}
								}

							}

						}
						for (var i = 0; i < this.tempjson.results.length; i++) {
							const object = this.tempjson.results[i];
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
								if ((object.bank_exc_rate) != "" && (object.amount_payable != undefined)) {
									object.amount_inr = object.bank_exc_rate * object.amount_payable;
									object.amount_inr = object.amount_inr.toFixed(2);
								}

							}
						}
						this.getView().getModel("tableLists").setData(this.tempjson);
						this.getView().getModel("tableLists").refresh();

					}
				}
				var TotalAppliedAmount = 0;
				var TotalinvAmount = 0;
				var table = oEvent.getSource();
				if (lengthOfCell >= 1) {
					for (var b = 0; b < _self.tempjson.results.length; b++) {
						// var amontpayble = _self.tempjson.results[b].amount_payable;
						// var amontpayble = parseFloat(amontpayble);
						if (_self.tempjson.results[b].checked == "true") {
							var totalopamt = _self.tempjson.results[b].openacc_value;
							var totalopamt = parseFloat(totalopamt);

							var amontpayble = _self.tempjson.results[b].amount_payable;
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

					}
					_self.totalinvAmount = 0;
					for (var i = 0; i < _self.tempjson.results.length; i++) {
						if (_self.tempjson.results[i].checked == "true") {
							_self.totinv = parseFloat(_self.tempjson.results[i].openacc_value);
							_self.totalinvAmount = parseFloat(_self.totalinvAmount) + _self.totinv;
						}
					}
					if (AmountApplied != undefined) {
						if (_self.totalinvAmount >= AmountApplied) {
							// if (AmountApplied == undefined) {
							// _self.getView().byId("balance").setValue("0");
							if (AmountApplied !== 0) {
								var balaceAmount = _self.totalinvAmount - AmountApplied;
								var balaceAmount = balaceAmount.toFixed(2);
								_self.getView().byId("balance").setValue(balaceAmount);
							} else {
								var balaceAmount = _self.totalinvAmount - AmountApplied;
								_self.getView().byId("balance").setValue(balaceAmount);
							}
						}
					} else {
						_self.getView().byId("balance").setValue(TotalinvAmount);
					}

				} else {
					_self.getView().byId("totinvval").setValue("0");
					_self.getView().byId("totamtpaid").setValue("0");
					_self.getView().byId("balance").setValue("0");
				}
				//**********selecting checked items for calculation*************

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
			for (var b = 0; b < _self.tempjson.results.length; b++) {
				_self.Invvalue = _self.tempjson.results[tableIndex].openacc_value;
				_self.Invvalue = parseFloat(_self.Invvalue);
				_self.amnoutntpayble = oEvent.getSource().getParent().getCells()[8].getValue();
				// _self.amnoutntpayble = _self.amnoutntpayble.toString();
				// _self.amnoutntpayble =_self.amnoutntpayble.toFixed(2);
				// _self.amnoutntpayble = oTable.getRows()[oTable.getSelectedIndex()].getCells()[5].mProperties.value;

				if (_self.tempjson.results[b].checked == "true") {
					if (_self.amnoutntpayble != "") {
						_self.amnoutntpayble = parseFloat(_self.amnoutntpayble);
						// _self.amnoutntpayble = _self.amnoutntpayble + ".00";
						// _self.amnoutntpayble =_self.amnoutntpayble.toFixed(2);
						_self.tempjson.results[tableIndex].amount_payable = _self.amnoutntpayble;
						// if (_self.tempjson.results[b].amount_payable != "") {
						// 	var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(_self.tempjson.results[b].amount_payable);
						// 	_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
						// 	for (var i = 0; i < _self.tempjson.results.length; i++) {
						// 		const object = _self.tempjson.results[i];
						// 		if (object.checked == "true") {
						// 			object.bank_exc_rate = _self.getView().byId("bank_exc_rate").getValue();
						// 			object.amount_inr = object.bank_exc_rate * object.amount_payable;
						// 			object.amount_inr = object.amount_inr.toFixed(2);
						// 		}
						// 	}
						// 	_self.getView().getModel("tableLists").setData(_self.tempjson);
						// 	_self.getView().getModel("tableLists").refresh();
						// } else {
						// 	var TotalAppliedAmount = _self.getView().byId("totamtpaid").getValue();
						// 	_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
						// }

						if (_self.tempjson.results[b].amount_payable == "") {
							var TotalAppliedAmount = _self.getView().byId("totamtpaid").getValue();
							_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
						} else if (_self.tempjson.results[b].amount_payable == undefined) {

						}
						else {
							var TotalAppliedAmount = parseFloat(TotalAppliedAmount) + parseFloat(_self.tempjson.results[b].amount_payable);
							_self.getView().byId("totamtpaid").setValue(TotalAppliedAmount);
							for (var i = 0; i < _self.tempjson.results.length; i++) {
								const object = _self.tempjson.results[i];
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
							_self.getView().getModel("tableLists").setData(_self.tempjson);
							_self.getView().getModel("tableLists").refresh();
						}


						var TotalinvAmount = parseFloat(TotalinvAmount) + parseFloat(_self.tempjson.results[b].openacc_value);
						TotalAppliedAmount = TotalAppliedAmount ? TotalAppliedAmount : 0;
						_self.getView().byId("totinvval").setValue(TotalinvAmount);
					} else {
						// var count = 0;
						// for (var b = 0; b < _self.tempjson.results.length; b++) {
						// 	var count = count + _self.tempjson.results[b].amount_payable;
						_self.getView().byId("totamtpaid").setValue(_self.amnoutntpayble);
						// 	_self.getView().byId("totamtpaid").setValue(count);
						// }

						for (var i = 0; i < _self.tempjson.results.length; i++) {
							const object = _self.tempjson.results[i];
							// if (object.checked == "true") {
							// object.bank_exc_rate = _self.getView().byId("bank_exc_rate").getValue();
							// object.amount_inr = object.bank_exc_rate * object.amount_payable;
							object.amount_inr = 0;
							object.amount_inr = object.amount_inr.toFixed(2);
							// }
						}
						_self.getView().getModel("tableLists").setData(_self.tempjson);
						_self.getView().getModel("tableLists").refresh();
					}

				}

			}
			_self.totalinvAmount = 0;
			for (var i = 0; i < _self.tempjson.results.length; i++) {
				if (_self.tempjson.results[i].checked == "true") {
					_self.totinv = parseFloat(_self.tempjson.results[i].openacc_value);
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

			// if (parseInt(_self.tempjson.results[tableIndex].amount_payable) > parseInt(_self.Invvalue)) {

			if (parseInt(_self.amnoutntpayble) > parseInt(_self.Invvalue)) {
				flagset = 1;
				MessageBox.error("Amount Payable is higher than Open Account Amount", {
					actions: sap.m.MessageBox.Action.Close,
					onClose: function (oAction) {
						// _self.tempjson.results[tableIndex].amount_payable = "";
						// _self.getView().byId("amount_payable").setValue("");
						_self.tempjson.results[tableIndex].amount_payable = "";
						// _self.getView().getModel("list1").refresh();
						_self.getView().getModel("tableLists").refresh();

						// var amtsetvalue = oTable.getRows()[oTable.getSelectedIndex()].getCells()[5].mProperties.value;

						var amtpplied = _self.getView().byId("totamtpaid").getValue();
						var amtpplied = parseFloat(amtpplied);
						var amntpable = parseFloat(_self.amnoutntpayble);
						var Amtapp = amtpplied - amntpable;
						if (Amtapp >= 0) {
							_self.getView().byId("totamtpaid").setValue(Amtapp);
							var amtget = _self.getView().byId("totamtpaid").getValue();
							_self.getView().getModel("tableLists").refresh();
							var balaceAmount = _self.totalinvAmount - parseFloat(amtget);
							_self.getView().byId("balance").setValue(balaceAmount);
							_self.getView().getModel("tableLists").refresh();

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
		onPressSave: function () {
			debugger;
			this._OpenBusyDialog();
			var _self = this;
			//***********************************Header create*******************************//
			// _self.oEntry = {
			// 	"to_open_account_ITEM": []
			// };
			_self.oEntry = {
				consigncod: this.getView().byId("consigncod").getValue(),
				lifnr: this.getView().byId("lifnr").getValue(),
				bnkrefno: this.getView().byId("bnkrefno").getValue(),
				og_docdt: this.getView().byId("og_docdt").getValue(),
				pay_date: this.getView().byId("pay_date").getValue(),
				due_date: this.getView().byId("due_date").getValue(),
				imp_bank: this.getView().byId("imp_bank").getValue(),
				banka: this.getView().byId("banka").getValue(),
				accno: this.getView().byId("accno").getValue(),
				bankn: this.getView().byId("bankn").getValue(),
				bank_exc_rate: this.getView().byId("bank_exc_rate1").getValue(),
				ad_code: this.getView().byId("ad_code").getValue(),
				swift: this.getView().byId("swift").getValue(),
				inco1: this.getView().byId("inco1").getValue(),
				zterm: this.getView().byId("zterm").getValue(),
				bsart: this.getView().byId("bsart").getValue(),
				ekorg: this.getView().byId("ekorg").getValue(),
				totinvval: this.getView().byId("totinvval").getValue(),
				totamtpaid: this.getView().byId("totamtpaid").getValue(),
				balance: this.getView().byId("balance").getValue(),
				totamtpaid_curr: this.getView().byId("totamtpaid_curr").getValue(),
				totinvval_curr: this.getView().byId("totinvval_curr").getValue()
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


			// if (_self.oEntry.pay_date == '') {		````````````````````````````````````````````````````````````````````````````````````````````````

			// 	_self.oEntry.pay_date = null;
			// }
			// if ((_self.oEntry.ata == '') || (_self.oEntry.ata == "")) {

			// 	_self.oEntry.ata = null;
			// }
			// if ((_self.oEntry.atd == '') || (_self.oEntry.atd == "")) {

			// 	_self.oEntry.atd = null;
			// }
			// if (_self.oEntry.bank_exc_rate == '') {

			// 	_self.oEntry.bank_exc_rate = '0.0000';
			// }
			// _self.oEntry = {
			// 	"to_open_account_ITEM": []
			// };

			_self.oEntry.to_open_account_ITEM = [];
			var _self = this;
			for (var i = 0; i < _self.tempjson.results.length; i += 1) {
				if (_self.tempjson.results[i].checked == "true") {
					if (_self.tempjson.results[i].amount_payable == "") {
						MessageBox.error("Can't Accept an item with Null Amount Payable Value");
						_self._CloseBusyDialog();
						return;
						// _self.tempjson.results[i].amount_payable="0.00";
					} else if (_self.tempjson.results[i].amount_payable == undefined) {
						MessageBox.error("Can't Accept an item with Null Amount Payable Value");
						_self._CloseBusyDialog();
						return;
						// _self.tempjson.results[i].amount_payable="0.00";
					}
					if (_self.tempjson.results[i].fkdat == "") {
						MessageBox.error("Please Fill Debit Date");
						_self._CloseBusyDialog();
						return;
					}
					if(_self.tempjson.results[i].db_amt == "") {
						MessageBox.error("Please Fill Debit Amount");
						_self._CloseBusyDialog();
						return;
					}
					if (_self.tempjson.results[i].custom_boe_date == "") {
						_self.tempjson.results[i].custom_boe_date = null;
					}
					if (_self.tempjson.results[i].bank_charges == "") {
						_self.tempjson.results[i].bank_charges = '0.000';
					}
					if ((_self.tempjson.results[i].ata == '') || (_self.tempjson.results[i].ata == "")) {

						_self.tempjson.results[i].ata = null;
					}
					if ((_self.tempjson.results[i].atd == '') || (_self.tempjson.results[i].atd == "")) {

						_self.tempjson.results[i].atd = null;
					}
					if (_self.tempjson.results[i].db_amt == "") {
						_self.tempjson.results[i].db_amt = '0.000';
					}
					_self.orgdatefkdat = _self.tempjson.results[i].fkdat;
					if ((_self.orgdatefkdat != null) || (_self.orgdatefkdat != undefined)) {
						if (_self.orgdatefkdat.includes("/")) {
							var SplitDatePart = _self.orgdatefkdat.split("/");
							_self.fkdat = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
							// _self.fkdat = _self.ConvertJsonDate(_self.orgdatefkdat);
							_self.tempjson.results[i].fkdat = _self.fkdat;
						} else {
							_self.fkdat = _self.convertToSAPdate(_self.orgdatefkdat);
							_self.tempjson.results[i].fkdat = _self.fkdat;
						}
					}
	
					_self.orgdateatd = _self.tempjson.results[i].atd;
					if ((_self.orgdateatd != null) || (_self.orgdateatd != undefined)) {
						if (_self.orgdateatd.includes("/")) {
							var SplitDatePart = _self.orgdateatd.split("/");
							_self.atd = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
							// _self.atd = _self.ConvertJsonDate(_self.orgdateatd);
							_self.tempjson.results[i].atd = _self.atd;
						} else {
							_self.atd = _self.convertToSAPdate(_self.orgdateatd);
							_self.tempjson.results[i].atd = _self.atd;
						}
					}
	
					_self.orgdateata = _self.tempjson.results[i].ata;
					if ((_self.orgdateata != null) || (_self.orgdateata != undefined)) {
						if (_self.orgdateata.includes("/")) {
							var SplitDatePart = _self.orgdateata.split("/");
							_self.ata = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
							// _self.ata = _self.ConvertJsonDate(_self.orgdateata);
							_self.tempjson.results[i].ata = _self.ata;
						} else {
							_self.ata = _self.convertToSAPdate(_self.orgdateata);
							_self.tempjson.results[i].ata = _self.ata;
						}
					}
	
					_self.orgdatepo_date = _self.tempjson.results[i].po_date;
					if ((_self.orgdatepo_date != null) || (_self.orgdatepo_date != undefined)) {
						if (_self.orgdatepo_date.includes("/")) {
							var SplitDatePart = _self.orgdatepo_date.split("/");
							_self.po_date = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
							// _self.po_date = _self.ConvertJsonDate(_self.orgdatepo_date);
							_self.tempjson.results[i].po_date = _self.po_date;
						} else {
							_self.po_date = _self.convertToSAPdate(_self.orgdatepo_date);
							_self.tempjson.results[i].po_date = _self.po_date;
						}
					}
	
					_self.orgdate = _self.tempjson.results[i].custom_boe_date;
					if ((_self.orgdate != null) || (_self.orgdate != undefined)) {
						if (_self.orgdate.includes("/")) {
							var SplitDatePart = _self.orgdate.split("/");
							_self.custom_boe_date = SplitDatePart[2] + "-" + SplitDatePart[1] + "-" + SplitDatePart[0] + "T00:00:00";
							// _self.custom_boe_date = _self.ConvertJsonDate(_self.orgdate);
							_self.tempjson.results[i].custom_boe_date = _self.custom_boe_date;
						} else {
							_self.custom_boe_date = _self.convertToSAPdate(_self.orgdate);
							_self.tempjson.results[i].custom_boe_date = _self.custom_boe_date;
						}
					}

				}
			}
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
			for (var i = 0; i < _self.tempjson.results.length; i++) {
				const object = _self.tempjson.results[i];
				if (object.checked == "true") {

					object.amount_payable = object.amount_payable + ".00";

					// if (object.bank_exc_rate.includes(".")) {


				}
			}
			_self.getView().getModel("tableLists").setData(_self.tempjson);
			_self.getView().getModel("tableLists").refresh();
			for (var i = 0; i < _self.tempjson.results.length; i += 1) {
				delete _self.tempjson.results[i].__metadata;
				delete _self.tempjson.results[i].iteno;
				delete _self.tempjson.results[i].ernam;
				delete _self.tempjson.results[i].invoice_fval;
				delete _self.tempjson.results[i].invoice_fcur;
				delete _self.tempjson.results[i].lcdocno;
				delete _self.tempjson.results[i].version;
				delete _self.tempjson.results[i].lcinvval;
				delete _self.tempjson.results[i].fccurr;
				delete _self.tempjson.results[i].ersda;
				delete _self.tempjson.results[i].aenam;
				delete _self.tempjson.results[i].laeda;
				delete _self.tempjson.results[i].timestamp;
				delete _self.tempjson.results[i].create_time;
				delete _self.tempjson.results[i].change_time;
				delete _self.tempjson.results[i].delindicator;
				delete _self.tempjson.results[i].total_invoice_net_weight;
				delete _self.tempjson.results[i].meins;
				delete _self.tempjson.results[i].total_invoice_gross_weight;
				delete _self.tempjson.results[i].invoice_bill_to_party_name;
				delete _self.tempjson.results[i].invbilptystrt;
				delete _self.tempjson.results[i].invbilptycity;
				delete _self.tempjson.results[i].invbilptypstlz;
				delete _self.tempjson.results[i].invbilptyland;
				delete _self.tempjson.results[i].flag1;
				delete _self.tempjson.results[i].openacc_flag;
				delete _self.tempjson.results[i].aprefnr;
				delete _self.tempjson.results[i].waers;
				delete _self.tempjson.results[i].boldt;
				delete _self.tempjson.results[i].consigncod;
				delete _self.tempjson.results[i].lifnr;
				if (_self.tempjson.results[i].checked == "true") {
					delete _self.tempjson.results[i].checked;
					_self.oEntry.to_open_account_ITEM.push(_self.tempjson.results[i]);
				}
			}
			_self.omdelItem.create("/xBRIxopen_account_hdr", _self.oEntry, {
				method: "POST",
				success: function (oData, response) {

					var m = JSON.parse(response.headers["sap-message"]).message;
					_self.Trkno = m.split(" ")[1];
					MessageBox.success(m, {
						actions: [sap.m.MessageBox.Action.OK],
						onClose: function (oAction) {
							if (oAction === sap.m.MessageBox.Action.OK) {
								window.FlagRefresh = true;
								// window.FromTrackNumber = _self.Trkno;
								window.Trkno1 = _self.Trkno;
								// _self.router.navTo("openacnlist", true);
								_self.router.navTo("openacntlist", true);
								_self._CloseBusyDialog();
							}
						}
					});
					//console.log(m.message);
				},
				error: function (err) {
					MessageBox.error("Something went wrong,Please try again later.");
					_self._CloseBusyDialog();
				}
			});
			//***********************************item create*******************************//

		},

		onpresscreate: async function (oEvent) {
			debugger;

			var _self = this;
			_self._OpenBusyDialog();
			// await _self.AuthConfiguration("Create");
			var Check_StatusInvItm = false;
			var Check_Status = _self.CheckRequiredFields("Create");
			if (Check_Status) {

				if (this.tempjson == undefined) {
					_self.onPressSave();
				} else if (this.tempjson.results.length > 0) {
					for (var i = 0; i < this.tempjson.results.length; i++) {
						Check_StatusInvItm = this.CheckItemRequired(JSON.parse(JSON.stringify(this.tempjson.results[i])));
						// if (!Check_StatusInvItm)
						// 	break;
						if (Check_StatusInvItm == true) {
							break;
						}
					}
				} else {
					Check_StatusInvItm = true;
				}

				// Check_StatusInvItm = true;
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
		AuthConfiguration: function (Type) {
			debugger;
			// return new Promise(async (resolve, reject) => {
			// var status = "Partially Paid";
			// var status = this.getView().byId("paymntstt").getValue();
			// if (status == "Partially Paid") {
			var stat = "96";
			// } else {
			// var stat = "97";
			// }
			if (Type == "Display") {
				var entity = "xBRIxI_UICONFIG03";
			} else if (Type == "Change") {
				var entity = "xBRIxI_UICONFIG";
			} else {
				var entity = "xBRIxI_UICONFIG";
			}
			var _self = this;
			var filters = new Array();
			var filterval = new sap.ui.model.Filter("modid", sap.ui.model.FilterOperator.EQ, "OPAC");
			filters.push(filterval);
			var filterval = new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, stat);
			filters.push(filterval);
			var filterval = new sap.ui.model.Filter("actvt", sap.ui.model.FilterOperator.EQ, "01");
			filters.push(filterval);
			this.RequiredFileds = new Array();
			this.RequiredFiledsDesc = new Array();
			this.RequiredFiledsErrorSts = new Array();
			this.RequiredFiledsDropDwn = new Array();
			this.ItemMand = new Array();
			this.ItemFiledsDesc = new Array();
			this.ItemFiledsErrorSts = new Array();
			this.ItemFiledsDropDwn = new Array();
			this.getOwnerComponent().getModel("config_model").read("/" + entity, {
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
											/*_self.RequiredFileds.push(arr[i].fldnam);
											_self.RequiredFiledsDesc.push(arr[i].flddescr);
											_self.RequiredFiledsErrorSts.push(arr[i].errstat)*/
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
					// var Visible_Model = new sap.ui.model.json.JSONModel({
					// 	Visible: true
					// });
					// this.getView().setModel(Visible_Model, "Visible_Model");
					_self._modelSetRefresh("visible_Model", _self.visibleData);
					_self._modelSetRefresh("xBRIxI_EDSGENHD_A1Type_Model", _self.xBRIxI_EDSGENHD_A1TypeData);
					_self._modelSetRefresh("xBRIxI_EDSGENHD_A2Type_Model", _self.xBRIxI_EDSGENHD_A2TypeData);

					// resolve();
				},
				error: function (error) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					// reject();
				}
				// resolve();


			});
			/*console.log(this.RequiredFileds);
			console.log(this.RequiredFiledsDesc);
			console.log(this.ItemMand);*/
			// })
		},
		_modelSetRefresh: function (modelName, modelData) {
			this.getView().getModel(modelName).setData(modelData);
			this.getView().getModel(modelName).refresh();
		},
		DecCheck1: function (oEvent) {
			debugger;
			var rowval = oEvent.getSource().getParent().getIndex();
			var oTable = this.byId("idItemTtable");
			var val = oEvent.mParameters.newValue;

			var val2 = isNaN(val);
			if ((val2) == true) {
				MessageBox.error("Only accept Numbers");
				this.tempjson.results[rowval].bank_charges = "";
			}
			if (val != "") {
				var val = parseFloat(val);
				var roundedNumber = val.toFixed(2);
				if (roundedNumber != val) {
					MessageBox.error("Error: Number should have at most two decimal places.");
					this.tempjson.results[rowval].bank_charges = "";
					// this.getView().byId("bank_charges").setValue("");
				}
			}

		},
		DecCheck2: function (oEvent) {
			debugger;
			var rowval = oEvent.getSource().getParent().getIndex();
			var oTable = this.byId("idItemTtable");
			var val = oEvent.mParameters.newValue;

			var val2 = isNaN(val);
			if ((val2) == true) {
				MessageBox.error("Only accept Numbers");
				this.tempjson.results[rowval].db_amt = "";
			}
			if (val != "") {
				var val = parseFloat(val);
				var roundedNumber = val.toFixed(2);
				if (roundedNumber != val) {
					MessageBox.error("Error: Number should have at most two decimal places.");
					this.tempjson.results[rowval].db_amt = "";
					// this.getView().byId("db_amt").setValue("");
				}
			}


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
		// Numbercheck: function (oEvent) {
		// 	debugger;
		// 	var val = oEvent.mParameters.newValue;
		// 	var val2 = isNaN(val);
		// 	if ((val2) == false) {
		// 		MessageBox.error("Only accept characters");
		// 		this.getView().byId("bnkrefno").setValue("");
		// 	}
		// 	// var val = parseFloat(val);
		// 	// var roundedNumber = val.toFixed(2);
		// 	//  if (roundedNumber != val) {
		// 	//   MessageBox.error("Error: Number should have at most two decimal places.");
		// 	//   this.getView().byId("bnkrefno").setValue("");
		// 	// }

		// },
		Numbercheck1: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				// this.getView().byId("ekorg").setValue("");
				this.getView().byId("bnkrefno").setValue("");
				// this.getView().byId("accno").setValue("");
				// this.getView().byId("bankn").setValue("");
				// this.getView().byId("ad_code").setValue("");
				// this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		Numbercheck2: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				// this.getView().byId("ekorg").setValue("");
				// this.getView().byId("bnkrefno").setValue("");
				this.getView().byId("accno").setValue("");
				// this.getView().byId("bankn").setValue("");
				// this.getView().byId("ad_code").setValue("");
				// this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		OnchangeDate: function (oEvent) {
			debugger;
			// var output = "";
			var value = oEvent.getSource().getValue();
			var currentRow = oEvent.getSource().getParent().getIndex();
			if ((value == "") || (value == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make Custom BOE Date filed as null");
				return;
			}
			else if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else if (value.indexOf("T00:00:00")) {
					var NewDateform = new Date(value.substring(0, 10));
				}
				this.tempjson.results[currentRow].custom_boe_date = NewDateform;
				this.getView().getModel("tableLists").refresh();
			}

		},
		OnchangeDateata: function (oEvent) {
			debugger;
			// var output = "";
			var value = oEvent.getSource().getValue();
			var currentRow = oEvent.getSource().getParent().getIndex();
			if ((value == "") || (value == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make ATA date filed as null");
				return;
			}
			else if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else if (value.indexOf("T00:00:00")) {
					var NewDateform = new Date(value.substring(0, 10));
				}
				this.tempjson.results[currentRow].ata = NewDateform;
				this.getView().getModel("tableLists").refresh();
			}

		},
		OnchangeDateatd: function (oEvent) {
			debugger;
			// var output = "";
			var value = oEvent.getSource().getValue();
			var currentRow = oEvent.getSource().getParent().getIndex();
			if ((value == "") || (value == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make ATD date filed as null");
				return;
			}
			else if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else if (value.indexOf("T00:00:00")) {
					var NewDateform = new Date(value.substring(0, 10));
				}
				this.tempjson.results[currentRow].atd = NewDateform;
				this.getView().getModel("tableLists").refresh();
			}

		},
		OnchangeDatedebit: function (oEvent) {
			debugger;
			// var output = "";
			var value = oEvent.getSource().getValue();
			var currentRow = oEvent.getSource().getParent().getIndex();
			if ((value == "") || (value == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make Debit Note Date filed as null");
				return;
			}
			else if (value) {
				var NewDateform = this.convertToSAPdate(value);
				// if (value instanceof Date) {
				// 	var NewDateform = value;
				// } else if (value.indexOf("T00:00:00")) {
				// 	var NewDateform = new Date(value.substring(0, 10));
				// }
				this.tempjson.results[currentRow].fkdat = NewDateform;
				this.getView().getModel("tableLists").refresh();
			}

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
		OnchangeDatepo: function (oEvent) {
			debugger;
			// var output = "";
			var value = oEvent.getSource().getValue();
			var currentRow = oEvent.getSource().getParent().getIndex();
			if ((value == "") || (value == " ")) {
				// if (val == " ") {
				MessageBox.error("Cant make Date filed as null");
				return;
			}
			else if (value) {
				if (value instanceof Date) {
					var NewDateform = value;
				} else if (value.indexOf("T00:00:00")) {
					var NewDateform = new Date(value.substring(0, 10));
				}
				this.tempjson.results[currentRow].po_date = NewDateform;
				this.getView().getModel("tableLists").refresh();
			}

		},
		Numbercheck3: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				// this.getView().byId("ekorg").setValue("");
				// this.getView().byId("bnkrefno").setValue("");
				// this.getView().byId("accno").setValue("");
				this.getView().byId("bankn").setValue("");
				// this.getView().byId("ad_code").setValue("");
				// this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		Numbercheck4: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");

				this.getView().byId("ad_code").setValue("");
				// this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		Numbercheck5: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				this.getView().byId("ekorg").setValue("");
				// this.getView().byId("bnkrefno").setValue("");
				// this.getView().byId("accno").setValue("");
				//this.getView().byId("bankn").setValue("");
				// this.getView().byId("ad_code").setValue("");
				// this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		Numbercheck: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				this.getView().byId("ekorg").setValue("");
				// this.getView().byId("bnkrefno").setValue("");
				// this.getView().byId("accno").setValue("");
				//this.getView().byId("bankn").setValue("");
				this.getView().byId("ad_code").setValue("");
				// this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		Numbercheck6: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				//this.getView().byId("ekorg").setValue("");
				// this.getView().byId("bnkrefno").setValue("");
				// this.getView().byId("accno").setValue("");
				//this.getView().byId("bankn").setValue("");
				// this.getView().byId("ad_code").setValue("");
				this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		Numbercheck7: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");
				this.getView().byId("ekorg").setValue("");

			} else {

			}
		},
		Numbercheck8: function (oEvent) {
			debugger;
			const regex = /^[a-zA-Z]+$/
			var inputValue = oEvent.mParameters.newValue;
			var check = regex.test(inputValue);
			if (check == false) {
				MessageBox.error("Only accept characters");

				this.getView().byId("bsart").setValue("");
			} else {

			}
		},
		DecCheck: function (oEvent) {
			debugger;
			var val = oEvent.mParameters.newValue;

			var val2 = isNaN(val);
			if ((val2) == true) {
				MessageBox.error("Only accept Numbers");
				this.getView().byId("bank_exc_rate1").setValue("");
			}
			if (val != "") {
				var val = parseFloat(val);
				var roundedNumber = val.toFixed(2);
				if (roundedNumber != val) {
					MessageBox.error("Error: Number should have at most two decimal places.");
					// var msg = "Error: Number should have at most four decimal places.";
					this.getView().byId("bank_exc_rate1").setValue("");
					for (var i = 0; i < this.tempjson.results.length; i++) {
						const object = this.tempjson.results[i];
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
							object.amount_inr = this.getView().byId("bank_exc_rate1").getValue() * object.amount_payable;
						}
					}
					this.getView().getModel("tableLists").setData(this.tempjson);
					this.getView().getModel("tableLists").refresh();

				}
				else {
					for (var i = 0; i < this.tempjson.results.length; i++) {
						const object = this.tempjson.results[i];
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
							if (object.amount_payable != undefined) {
								object.amount_inr = object.bank_exc_rate * object.amount_payable;
								object.amount_inr = object.amount_inr.toFixed(2);
							}

						}
					}
					this.getView().getModel("tableLists").setData(this.tempjson);
					this.getView().getModel("tableLists").refresh();
				}
			}
			else {
				for (var i = 0; i < this.tempjson.results.length; i++) {
					const object = this.tempjson.results[i];
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
				this.getView().getModel("tableLists").setData(this.tempjson);
				this.getView().getModel("tableLists").refresh();
			}






		},

	});

});