import BaseService from "./BaseService.service";
export default class BankTransferMediaService extends BaseService {
	public async create<T = unknown>(newObj: T): Promise<T> {
		const { content, ...others } = newObj as Blob & { content: string };
		console.log(content);
		const result = await super.create({ mediaType: "image/png" });
		const { ID } = result as unknown as { ID: string };
		await super.modifyEntity(ID, { content }, ["content"]);
		return result as T;
	}
}
