/*global QUnit*/

sap.ui.define([
	"bri/open_account/controller/openacntlist.controller"
], function (Controller) {
	"use strict";

	QUnit.module("openacntlist Controller");

	QUnit.test("I should test the openacntlist controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});