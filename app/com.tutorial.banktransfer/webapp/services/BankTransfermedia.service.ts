import BaseService from "./BaseService.service";
import { Readable, PassThrough } from "stream";
export default class BankTransferMediaService extends BaseService {
	public async create<T = unknown>(newObj: T): Promise<T> {
		const { content, ...others } = newObj as Blob & { content: string };
		console.log(content);
		const result = await super.create({ mediaType: "image/png" });
		const { ID } = result as unknown as { ID: string };
		await super.modifyEntity(ID, { content }, ["content"]);
		return result as T;
	}
	// _formatResult(decodedMedia, mediaType) {
	// 	// const readable = new Readable();
	// 	const readable = new ReadableStream();
	// 	const result = new Array();
	// 	readable.push(decodedMedia);
	// 	readable.push(null);
	// 	return {
	// 		value: readable,
	// 		"*@odata.mediaContentType": mediaType,
	// 	};
	// }
}
