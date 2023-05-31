sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/ui/core/util/File",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/ui/core/util/Export"
], function (Controller,MessageBox,File,ExportTypeCSV, Export) {
	"use strict";

	return Controller.extend("bri.open_account.controller.openacntlist", {
		onInit: function () {
			this.router = sap.ui.core.UIComponent.getRouterFor(this);
			this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
			this.omdelItem = this.getOwnerComponent().getModel("Item_Model");
			// this.data = {
			// 	results: [{
			// 		data1: "123"
			// 	}]
			// };
			// var oModelData = new sap.ui.model.json.JSONModel();
			// oModelData.setData(this.data);
			// this.getView().setModel(oModelData, "tableLists");
		},
		_handleRouteMatched: function (oEvent) {
			console.log(window.FlagRefresh);
			if (window.FlagRefresh) {
				if (window.Trkno1) {
					console.log(Trkno1);
					// this.clearFilter(oEvent);
					this.getView().byId("trackfrom").setValue(window.Trkno1);

					// this.getView().byId("trackfrom").setValue(window.Trkno1);
					// this.getView().byId("trackfrom").setValue(window.FromTrackNumber);
					console.log(window.Trkno1);

				}
				this.onSearch();
				window.FlagRefresh = false;
			}
		},
		// onSearch: function (oEvent) {
		// 	this.getView().byId("trackTable").setVisible(true);
		// 	this.getView().byId("downloadBtn").setVisible(true);
		// },
		onSearch: function () {
			debugger;
			this._OpenBusyDialog();

			// this.getView().byId("downloadBtn").setVisible(true);
			// this.getView().byId("trackTable").setVisible(true);
			var trackNofrom = this.getView().byId("trackfrom").getValue().trim();
			var trackNoTo = this.getView().byId("trackto").getValue().trim();
			var companycode = this.getView().byId("copmcod").getValue().trim();
			var vendor = this.getView().byId("vendor").getValue().trim();
			var paymentdate = this.getView().byId("pay_date").getValue().trim();

			var flag = 1;
			if ((trackNofrom == "") && (trackNoTo == "") && (companycode == "") && (vendor == "") && (paymentdate == "")) {
				MessageBox.error("Please Filter Atleast By Any One Criteria");
				this.getView().byId('trackTable').setVisible(false);
				this.getView().byId('downloadBtn').setVisible(false);
				this._CloseBusyDialog();
				flag = 0;
				return false;

			} else if (trackNofrom != "" && trackNoTo != "") {
				if (trackNofrom > trackNoTo) {
					MessageBox.error("Track No From Cannot be Greater Than Track No To", {
						onClose: function (oEvent) {
							var _self = this;
							$(document).keydown(function (oEvent) {
								if (oEvent.keyCode == 13) {
									oEvent.preventDefault();
									_self.window.close();
								}
							});
						}
					});

					this.getView().byId('trackTable').setVisible(false);
					this.getView().byId('downloadBtn').setVisible(false);
					this._CloseBusyDialog();
					flag = 0;
				}
			}

			if ((trackNofrom == "") && (trackNoTo !== "")) {
				MessageBox.error("Please Select Track No From");
				this._CloseBusyDialog();
				flag = 0;
				return false;
			}
			if (flag) {
				var filters = new Array();
				var filterval = "";
				if (companycode !== "") {
					filterval = new sap.ui.model.Filter("consigncod", sap.ui.model.FilterOperator.EQ, companycode);
					filters.push(filterval);
				}
				if (vendor !== "") {
					filterval = new sap.ui.model.Filter("lifnr", sap.ui.model.FilterOperator.EQ, vendor);
					filters.push(filterval);

				}
				if (paymentdate !== "") {

					var SplitRange = paymentdate.split(" - ");
					var SplitDatePartFrom = SplitRange[0].split("/");
					var InDt_from = SplitDatePartFrom[2].trim() + "-" + SplitDatePartFrom[1].trim() + "-" + SplitDatePartFrom[0].trim();
					var SplitDatePartTo = SplitRange[1].split("/");
					var IndDt_to = SplitDatePartTo[2].trim() + "-" + SplitDatePartTo[1].trim() + "-" + SplitDatePartTo[0].trim();
					filterval = new sap.ui.model.Filter("pay_date", sap.ui.model.FilterOperator.BT, InDt_from, IndDt_to);
					filters.push(filterval);

				}

				if (trackNoTo && trackNofrom) {
					filterval = new sap.ui.model.Filter("intno", sap.ui.model.FilterOperator.BT, trackNofrom, trackNoTo);
				} else if (trackNofrom) {
					filterval = new sap.ui.model.Filter("intno", sap.ui.model.FilterOperator.EQ, trackNofrom);
				} else if (trackNoTo) {
					filterval = new sap.ui.model.Filter("intno", sap.ui.model.FilterOperator.EQ, trackNoTo);
				}

				filters.push(filterval);
				var sorters = [];
				var sortval = new sap.ui.model.Sorter("intno", true, false);
				sorters.push(sortval);
				this.Listread(filters, sorters);
			}

		},
		Listread: function (filters, sorters) {
			var _self = this;
			_self.omdelItem.read("/xBRIxopen_account_hdr", {
				filters: filters,
				sorters: sorters,
				success: function (oData) {
					console.log(oData);
					if (oData.results.length <= 0) {
						MessageBox.error("No Matching Result(s) Found for the Filter");
						_self.getView().byId('trackTable').setVisible(false);
						_self.getView().byId('downloadBtn').setVisible(false);
						_self._CloseBusyDialog();
					} else {
						_self.tempjson = {
							results: []
						};
						_self.tempjson.results = _self.tempjson.results.concat(oData.results);
						var oModelData = new sap.ui.model.json.JSONModel();
						oModelData.setData(_self.tempjson);
						_self.getView().setModel(oModelData, "tableLists");
						_self.getView().byId("trackTable").setVisible(true);
						_self.getView().byId('downloadBtn').setVisible(true);
						_self.getView().byId("table_footer").setText("No. of Records : " + _self.tempjson.results.length);
						_self._CloseBusyDialog();

					}
				},
				error: function (error) {
					MessageBox.error("Something Went Wrong . Please Try again Later");
					// onClose: function (oActn) {}
					_self._CloseBusyDialog();
				}
			});
		},
		onPressCreate: function (oEvent) {
			this.router.navTo("openacntCreate", {
				mode: "C",
			});
		},
		handleLinkPress: function (oEvent) {
			debugger;
			this.SelectedText = oEvent.getSource().getText();
			this.router.navTo("openacntDisplay", {
				mode: "U",
				intno: this.SelectedText
			});
		},
		handleValueHelptrknofrm: function (oEvent) {
			debugger;
			var sInputValue = oEvent.getSource().getValue();
			this.inputId = oEvent.getSource().getId();
			if (!this._valueHelpDialogtrknofrm) {
				this._valueHelpDialogtrknofrm = sap.ui.xmlfragment("bri.open_account.view.fragments.TrackNoFrm", this);
				this.getView().addDependent(this._valueHelpDialogtrknofrm);
			}
			this._valueHelpDialogtrknofrm.open(sInputValue);
		},

		_handleValueHelpSearchtrknofrm: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new sap.ui.model.Filter(
				"intno",
				sap.ui.model.FilterOperator.Contains, sValue
			);
			oEvent.getSource().getBinding("items").filter([oFilter]);

		},

		_handleValueHelpClosetrknofrm: function (oEvent) {
			if (oEvent.getParameter("selectedItem")) {
				var oSelectedItem = oEvent.getParameter("selectedItem").getTitle();
				if (oSelectedItem) {
					var reqNoInputFrom = this.getView().byId(this.inputId);
					reqNoInputFrom.setValue(oSelectedItem);
				}
				oEvent.getSource().getBinding("items").filter([]);
			}
			//this.pressenter(oEvent);
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
				// this.getView().byId("lifnr").setValue(oEvent.getParameter("selectedItem").getTitle());
				// this.getView().byId("vendordes").setText(oEvent.getParameter("selectedItem").getDescription());
				if (_self.oSelectedItemvendor) {
					var reqNoInputFrom = this.getView().byId(this.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItemvendor);
				}
				// if (_self.oSelectedItemvendor != "") {
				// 	_self.getView().byId("idIconTabBar").setVisible(true);
				// 	_self.getView().byId("idIconTabBa1r").setVisible(true);
				// 	_self.getView().byId("save").setVisible(true);
				// 	_self.itemget();

				// }
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
				// _self.getView().byId("consigncod").setValue(oEvent.getParameter("selectedItem").getTitle());
				// _self.getView().byId("compdes").setText(oEvent.getParameter("selectedItem").getDescription());
				if (_self.oSelectedItemCompany) {
					var reqNoInputFrom = _self.getView().byId(_self.inputId);
					reqNoInputFrom.setValue(_self.oSelectedItemCompany);
				}
				// _self.getView().byId("lebelMode2").setVisible(true);
				oEvent.getSource().getBinding("items").filter([]);
			}
		},
		exportToExcel: function () {
			var _self = this;
			var oTable = this.getView().byId("trackTable");
			var that = this;
			var aColumns = oTable.getColumns();
			var aItems = oTable.getRows();
			var aTemplate = [];
			for (var i = 0; i < aColumns.length; i++) {
				var pathName = "";
				var oColumn = {};
				if (aItems.length > 0 && i < aColumns.length) {
					pathName = aItems[0].getCells()[i].getBinding("text").getPath();
				}
				if (pathName == "intno" || pathName == "lifnr" || pathName == "consigncod" ||
					pathName == "pay_date" || pathName == "inco1" || pathName == "due_date" ||
					pathName == "balance" || pathName == "totamtpaid" || pathName == "totinvval") {
					oColumn = {
						name: aColumns[i].getLabel().getText(),
						template: {
							content: {
								// path: null,
								formatter: function (value) {
									if (value) {
										if (value instanceof Date) {
											var NewDateform = value;
										} else if (value.indexOf("T00:00:00")) {
											return value;
										} else { }
										var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
										var day = ("0" + NewDateform.getDate()).slice(-2);
										var fnDate = [day, mnth, NewDateform.getFullYear()].join("/");
										var output = fnDate;
										return output;
									}
								}
							}
						}
					};
				} else {
					oColumn = {
						name: aColumns[i].getLabel().getText(),
						template: {
							content: {
								path: null
							}
						}
					};
				}
				if (aItems.length > 0 && i < aColumns.length) {
					oColumn.template.content.path = aItems[0].getCells()[i].getBinding("text").getPath();
				}
				aTemplate.push(oColumn);
			}
			/*	var Obj = {
				name: "Downloaded Date",
				template: {
					content: {
						path: "curdate",
						formatter: function (value) {
							if (value) {
								if (value instanceof Date) {
									var NewDateform = value;
								} else if (value.indexOf("T00:00:00")) {
									return value;
								} else {}
								var mnth = ("0" + (NewDateform.getMonth() + 1)).slice(-2);
								var day = ("0" + NewDateform.getDate()).slice(-2);
								var fnDate = [day, mnth, NewDateform.getFullYear()].join("/");
								var output = fnDate;
								return output;
							}
						}
					}
				}
			};
			aTemplate.push(Obj);*/

			var data = oTable.getModel("tableLists");
			var MyAray = data.oData.results;
			var Dateobj = new Date();
			for (var i = 0; i < MyAray.length; i++) {
				MyAray[i].curdate = Dateobj;
			}
			data.oData.results = MyAray;
			var oExport = new sap.ui.core.util.Export({
				exportType: new sap.ui.core.util.ExportTypeCSV({
					fileExtension: "xls",
					separatorChar: "\t",
					charset: "utf-8",
					mimeType: "application/vnd.ms-excel:base64"
				}),
				models: oTable.getModel("tableLists"),
				rows: {
					path: "/results"
				},
				columns: aTemplate
			});
			oExport.saveFile().always(function () {
				this.destroy();
			});

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