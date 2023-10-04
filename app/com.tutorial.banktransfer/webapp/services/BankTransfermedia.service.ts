import BaseService from "./BaseService.service";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";


export default class BankTransferMediaService extends BaseService {

	public  sendFile(
		id: string,
		obj: Blob
	) {
		return new Promise((resolve,reject) => {
			const modelPath = `${ this.model.getServiceUrl() }${this.modelBindList.substring(1) }(${id})/content`;
			const xmlHttpRequest = new XMLHttpRequest();
			xmlHttpRequest.open("PUT", modelPath, true);
			xmlHttpRequest.setRequestHeader("Content-Type", obj.type);
			xmlHttpRequest.onload = () => (resolve(xmlHttpRequest.status));
			xmlHttpRequest.onerror = (event) => (reject(event));
			xmlHttpRequest.send(obj);
		});

	}

	public async create<T = unknown>(newObj: T): Promise<T> {
		//const { content, ...others } = newObj as Blob & { content: string };
		const content = newObj;
		console.log(content);
		const result = await super.create({ mediaType: "image/png" });
		const { ID } = result as unknown as { ID: string };
		await this.sendFile(ID, content as Blob)
		return result as T;
	}
}
