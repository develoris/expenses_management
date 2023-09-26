import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import { BankTransfer, ModifybankTransfer, state } from "../model/types";
import { validateStateAppointment } from "../UTILS/validateFields";
import { ValueState } from "sap/ui/core/library";
import DateFormat from "sap/ui/core/format/DateFormat";
import Event from "sap/ui/base/Event";
import TableRow from "sap/ui/webc/main/TableRow";
import Row from "sap/ui/table/Row";
import BankTransferService from "../services/bankTransfer";
import Model from "sap/ui/model/Model";

/**
 * @namespace com.tutorial.banktransfer.controller
 */
export default class Main extends BaseController {
	_pNewBankTransferDialog: Dialog;
	oNewBankTransferDialog: Dialog;
	_pNewBankTransfer: Promise<Control | Control[]>;
	_oDataBankTransfer: BankTransferService;
	async onInit(): Promise<void> {
		this._oDataBankTransfer = this.getOwnerComponent().services.bankTransfer;
		this.initModel();
		await this.getBankTransfer();
	}
	async getBankTransfer() {
		const bankTranserList = await this._oDataBankTransfer.getList();
		this.setDataModel("bankTransferList", bankTranserList);
	}
	handleAddBankTransfer() {
		this.setProperty("state", "/isModifyDialog", "false");
		this.openModifyAndAddDialog(this.getView().getModel("modifybankTransfer"));
	}
	openModifyAndAddDialog(objToBind: Model) {
		const oView = this.getView();
		if (this._pNewBankTransferDialog === undefined) {
			this._pNewBankTransfer = Fragment.load({
				id: oView.getId(),
				name: "com.tutorial.banktransfer.fragment.addBankTransfer",
				controller: this,
			}).then((oNewBankTransferDialog) => {
				this.oNewBankTransferDialog =
					oNewBankTransferDialog instanceof Control
						? (oNewBankTransferDialog as Dialog)
						: (oNewBankTransferDialog[0] as Dialog);
				return oNewBankTransferDialog;
			});
		}

		this._pNewBankTransfer
			.then((oNewControl) => {
				const oNewBankTransferDialog = oNewControl as Dialog;
				oNewBankTransferDialog.open();
				const state = this.getView().getModel("state");
				oNewBankTransferDialog.setModel(objToBind, "modifybankTransfer");
				oNewBankTransferDialog.setModel(state, "state");
				oNewBankTransferDialog.bindElement("modifybankTransfer", objToBind);
				oNewBankTransferDialog.bindElement("state", state);
			})
			.catch(() => {});
	}
	handleDialogCancelButton() {
		this.setDataModel("modifybankTransfer", {});
		this.oNewBankTransferDialog.destroy();
	}
	handleModifyBankTransfer(oEvent: Event) {
		const otableRow = oEvent.getParameter("row" as never) as TableRow;
		const sPath = otableRow.getBindingContext("bankTransferList").getPath();
		const selectedObjRow = otableRow
			.getBindingContext("bankTransferList")
			.getModel()
			.getObject(sPath) as BankTransfer;

		this.setProperty("state", "/isModifyDialog", "true");
		selectedObjRow.period = new Date(selectedObjRow.period);
		const modyData = {
			ID: selectedObjRow.ID,
			period: new Date(selectedObjRow.period),
			amount: selectedObjRow.amount,
			note: selectedObjRow.note,
		} as ModifybankTransfer & { ID: string | number };
		this.setDataModel("modifybankTransfer", modyData);
		this.openModifyAndAddDialog(this.getModel("modifybankTransfer"));
	}

	async handleDialogAddButton() {
		const oModelData =
			this.getDataModel<ModifybankTransfer>("modifybankTransfer");
		const state = this.getDataModel<state>("state");
		const modelValidate = await validateStateAppointment(
			oModelData as object,
			["amount", "note"],
			await this.getResourceBundle()
		);
		this.setDataModel("modifybankTransfer", modelValidate);
		if (
			modelValidate._state &&
			modelValidate._state.valueState == ValueState.Error
		) {
			return;
		}
		const dateFormat = DateFormat.getDateInstance({
			pattern: "yyyy-MM-dd",
		});
		oModelData.period = dateFormat.format(oModelData.period as Date);
		if (JSON.parse(state.isModifyDialog)) {
			const ID = (oModelData as ModifybankTransfer & { ID: string | number })
				.ID;
			await this._oDataBankTransfer.modifyEntity(ID, oModelData, [
				"amount",
				"note",
				"period",
			]);
		} else {
			await this._oDataBankTransfer.create(oModelData);
		}
		this.setDataModel("modifybankTransfer", {});
		await this.getBankTransfer();
		this.handleDialogCancelButton();
	}
	initModel() {
		this.setModel(new JSONModel({ bankTransferList: [] }), "bankTransferList");
		this.setModel(
			new JSONModel({ period: new Date("2022-12-19") }),
			"modifybankTransfer"
		);
		this.setModel(new JSONModel({ isModifyDialog: true }), "state");
	}
	async onAttachmentDeletePress(oEvent: Event) {
		const sPath = (oEvent.getParameter("row" as never) as Row)
			.getBindingContext("bankTransferList")
			.getPath();

		const oPath = this.getView()
			.getModel("bankTransferList")
			.getProperty(sPath) as BankTransfer;
		await this._oDataBankTransfer.deleteByID(oPath.ID);
		await this.getBankTransfer();
	}

	onNavIndicatorsToggle(oEvent: Event) {
		alert("nav");
		const otableRow = oEvent.getParameter("row" as never) as TableRow;
		const sPath = otableRow.getBindingContext("bankTransferList").getPath();
		const selectedObjRow = otableRow
			.getBindingContext("bankTransferList")
			.getModel()
			.getObject(sPath) as BankTransfer;
		console.log(selectedObjRow);
		this.getRouter().navTo("detail", {
			id: selectedObjRow.ID,
		});
	}
}
