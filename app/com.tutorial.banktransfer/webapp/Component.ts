import UIComponent from "sap/ui/core/UIComponent";
import models from "./model/models";
import Device from "sap/ui/Device";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";
import BaseService from "./services/BaseService.service";
import BankTransferMediaService from "./services/BankTransfermedia.service";

/**
 * @namespace com.tutorial.banktransfer
 */
export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
	};
	public services = {
		bankTransfer: new BaseService(
			this.getModel() as ODataModelV4,
			"/banktransfer"
		),
		bankTransferMedia: new BankTransferMediaService(
			this.getModel() as ODataModelV4,
			"/banktransfermedia"
		),
	};
	private contentDensityClass: string;

	public init(): void {
		// call the base component's init function
		super.init();

		// create the device model
		this.setModel(models.createDeviceModel(), "device");

		// create the views based on the url/hash
		this.getRouter().initialize();
	}

	/**
	 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
	 * design mode class should be set, which influences the size appearance of some controls.
	 * @public
	 * @returns css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
	 */
	public getContentDensityClass(): string {
		if (this.contentDensityClass === undefined) {
			// check whether FLP has already set the content density class; do nothing in this case
			if (
				document.body.classList.contains("sapUiSizeCozy") ||
				document.body.classList.contains("sapUiSizeCompact")
			) {
				this.contentDensityClass = "";
			} else if (!Device.support.touch) {
				// apply "compact" mode if touch is not supported
				this.contentDensityClass = "sapUiSizeCompact";
			} else {
				// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
				this.contentDensityClass = "sapUiSizeCozy";
			}
		}
		return this.contentDensityClass;
	}
}
