import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import BankTransferService from "../services/bankTransfer";
import { BankTransfer } from "../model/types";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace com.tutorial.banktransfer.controller
 */
export default class Detail extends BaseController {
	private _oDataBankTransfer: BankTransferService;
	onInit() {
		this.setModel(new JSONModel({ note: "test note" }), "bankTransfer");
		this._oDataBankTransfer = this.getOwnerComponent().services.bankTransfer;

		this.getRouter()
			.getRoute("detail")
			// eslint-disable-next-line @typescript-eslint/unbound-method
			.attachPatternMatched(this._onRouteMatched, this);
	}
	_onRouteMatched(oEvent: Route$MatchedEvent) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const that = this;
		const arg = oEvent.getParameter("arguments") as { id: string };
		that._oDataBankTransfer
			.getList()
			.then(async () => {
				// this.setModel(new JSONModel(res), "bankTransfer");
				const resByID =
					await that._oDataBankTransfer.getEntityById<BankTransfer>(
						arg.id.toString()
					);

				this.setDataModel("bankTransfer", resByID);
			})
			.catch((e) => {
				console.log(e);
			});
	}
}
