import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";
import Dialog from "sap/m/Dialog";
import Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import { BankTransfer, NewbankTransfer } from "../model/types";
import { validateStateAppointment } from "../UTILS/validateFields";
import { ValueState } from "sap/ui/core/library";
import DateFormat from "sap/ui/core/format/DateFormat";
import Event from "sap/ui/base/Event";
import TableRow from "sap/ui/webc/main/TableRow";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import Row from "sap/ui/table/Row";

/**
 * @namespace com.tutorial.banktransfer.controller
 */
export default class Main extends BaseController {
	_pNewBankTransferDialog: Dialog;
	oNewBankTransferDialog: Dialog;
	_pNewBankTransfer: Promise<Control | Control[]>;
	_oRow: TableRow;
	_oBankTranferBinding: ODataListBinding;
	_oEvent: Event;
	async onInit(): Promise<void> {
		console.log(
			"BankTransferList",
			await this.getOwnerComponent().services.bankTransfer.getList<BankTransfer>()
		);
		this.initModel();
		const oModel = this.getOwnerComponent().getModel() as ODataModelV4;
		this._oBankTranferBinding = oModel.bindList("/banktransfer", null, [], [], {
			/*$expand: 'BlindBankTransfers'*/
			$$getKeepAliveContext: true,
		});
		await this.getBankTransfer();
	}
	async getBankTransfer() {
		const oBankTransferContex =
			await this._oBankTranferBinding.requestContexts();
		const bankTransferList = oBankTransferContex.map(
			(o) => o.getObject() as BankTransfer
		);
		(this.getView().getModel("bankTransferList") as JSONModel).setData(
			bankTransferList
		);
		console.log("stop");
	}
	handleAddBankTransfer() {
		(this.getModel("state") as JSONModel).setProperty(
			"/isModifyDialog",
			"false"
		);
		this.openModifyAndAddDialog();
	}
	openModifyAndAddDialog() {
		const oView = this.getView();
		this.getOwnerComponent().getModel();
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
				const newBankTransfer = this.getView().getModel("newBankTransfer");
				const state = this.getView().getModel("state");
				oNewBankTransferDialog.setModel(newBankTransfer, "newBankTransfer");
				oNewBankTransferDialog.setModel(state, "state");
				oNewBankTransferDialog.bindElement("newBankTransfer", newBankTransfer);
				oNewBankTransferDialog.bindElement("state", state);
			})
			.catch(() => {});
	}
	handleDialogCancelButton() {
		this.oNewBankTransferDialog.destroy();
	}
	handleModifyBankTransfer(oEvent: Event) {
		// this._oEvent = oEvent;
		// this._oRow = oEvent.getParameter("row" as never) as TableRow;
		// this._oRow.get
		// const path
		const otableRow = oEvent.getParameter("row" as never) as TableRow;
		const sPath = otableRow.getBindingContext("bankTransferList").getPath();
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const selctedObjRow = otableRow
			.getBindingContext("bankTransferList")
			.getObject(sPath) as BankTransfer;
		// (this._oRow.getBindingContext("bankTransferList").getModel() as JSONModel);

		(this.getModel("state") as JSONModel).setProperty(
			"/isModifyDialog",
			"true"
		);
		this.openModifyAndAddDialog();
	}
	getModelNewBankTransfer(): NewbankTransfer {
		return (
			this.getModel("newBankTransfer") as JSONModel
		).getData() as NewbankTransfer;
	}
	async handleDialogAddButton() {
		const oModelData = this.getModelNewBankTransfer();

		const modelValidate = await validateStateAppointment(
			oModelData as object,
			["amount", "note"],
			await this.getResourceBundle()
		);
		(this.getModel("newBankTransfer") as JSONModel).setData(modelValidate);
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
		await this.createNewBankTransfer(oModelData);
		(this.getModel("newBankTransfer") as JSONModel).setData({});
		await this.getBankTransfer();
		this.handleDialogCancelButton();
	}
	async createNewBankTransfer(newbankTranser: NewbankTransfer) {
		// il nuovo vero
		const oBankTransferContext =
			this._oBankTranferBinding.create(newbankTranser);
		await oBankTransferContext.created();

		// l'update
		// const oBankTransferContext2 = this._oBankTranferBinding.create(
		// 	new JSONModel({
		// 		ID: "85726248-cd9f-43d0-8e27-bb9aee9d5295",
		// 		amount: 983,
		// 		note: "questo è il bonifico di giugno",
		// 	})
		// );
		// await oBankTransferContext2.created();
	}
	initModel() {
		this.setModel(new JSONModel({ bankTransferList: [] }), "bankTransferList");
		this.setModel(new JSONModel({}), "newBankTransfer");
		this.setModel(new JSONModel({ isModifyDialog: true }), "state");
	}
	async onAttachmentDeletePress(oEvent: Event) {
		const sPath = (oEvent.getParameter("row" as never) as Row)
			.getBindingContext("bankTransferList")
			.getPath();

		const oPath = this.getView()
			.getModel("bankTransferList")
			.getProperty(sPath) as BankTransfer;
		const bankTransferBinding = this._oBankTranferBinding.filter([
			new Filter("ID", FilterOperator.EQ, oPath.ID),
		]);
		const bankTranserContext = await bankTransferBinding.requestContexts();
		await bankTranserContext[0].delete();
		this._oBankTranferBinding.filter([]);

		await bankTranserContext[0].setProperty(
			bankTranserContext[0].getPath() + "/amount",
			987
		);
		const groupId = (
			bankTranserContext[0].getModel() as ODataModelV4
		).getGroupId() as unknown as string;
		(bankTranserContext[0].getModel() as ODataModelV4)
			.submitBatch(groupId)
			.then(async () => {
				console.log("then");
				this.getView().getModel().refresh();
				this._oBankTranferBinding.filter([]);
				await this.getBankTransfer();
				console.log("then");
			})
			.catch(() => {
				console.log("ciao");
			});
	}
}
