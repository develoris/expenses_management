import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import BaseController from "./BaseController";
import BankTransferService from "../services/bankTransfer";
import JSONModel from "sap/ui/model/json/JSONModel";
import { BankTransfer } from "../model/types";

/**
 * @namespace com.tutorial.banktransfer.controller
 */
export default class Detail extends BaseController {
	private _oDataBankTransfer: BankTransferService;
	onInit(): void {
		console.log("detailm page");
		this._oDataBankTransfer = this.getOwnerComponent().services.bankTransfer;
		// this.getRouter()
		// 	.getRoute("detail")
		// 	// eslint-disable-next-line @typescript-eslint/unbound-method
		// 	.attachMatched(this._onRouteMatched, this);
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
			.getEntityById<BankTransfer>(arg.id.toString())
			.then((bankTransfer) => {
				console.log(bankTransfer);
				this.setModel(new JSONModel(bankTransfer), "bankTransfer");
				console.log("detail data", this.getDataModel("bankTransfer"));
				// this.getView().refreshAggregation()
			})
			.catch((e) => {
				console.log(e);
			});
	}
}
