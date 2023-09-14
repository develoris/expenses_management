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
import Sorter from "sap/ui/model/Sorter";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";

/**
 * @namespace com.tutorial.banktransfer.controller
 */
export default class Main extends BaseController {
	_pNewBankTransferDialog: Dialog;
	oNewBankTransferDialog: Dialog;
	_pNewBankTransfer: Promise<Control | Control[]>;
	_oRow: TableRow;
	_oBankTranferBinding: ODataListBinding;
	async onInit(): Promise<void> {
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
	}
	handleAddBankTransfer() {
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
				const newBankTransfer = this.getView().getModel("newBankTransfer");
				oNewBankTransferDialog.setModel(newBankTransfer, "newBankTransfer");
				oNewBankTransferDialog.bindElement("newBankTransfer", newBankTransfer);
			})
			.catch(() => {});
	}

	handleDialogCancelButton() {
		this.oNewBankTransferDialog.destroy();
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
		const oBankTransferContext =
			this._oBankTranferBinding.create(newbankTranser);
		await oBankTransferContext.created();
	}
	initModel() {
		this.setModel(new JSONModel({ bankTransferList: [] }), "bankTransferList");
		this.setModel(new JSONModel({}), "newBankTransfer");
	}
	async onAttachmentDeletePress(oEvent: Event) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
		const sPath = (oEvent.getParameter("row" as never) as any).oBindingContexts
			.bankTransferList.sPath as string;

		const oPath = this.getView()
			.getModel("bankTransferList")
			.getProperty(sPath) as BankTransfer;
		const bankTransferBinding = this._oBankTranferBinding.filter([
			new Filter("ID", FilterOperator.EQ, oPath.ID),
		]);

		const bankTranserContext = await bankTransferBinding.requestContexts();
		await bankTranserContext[0].delete();
		await this.getBankTransfer();
	}
}
