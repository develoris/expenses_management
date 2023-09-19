import Filter from "sap/ui/model/Filter";
// import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModelV4 from "sap/ui/model/odata/v4/ODataModel";

export default class BaseService {
	private modelBindList: string;
	private model: ODataModelV4;
	private entityBindList: ODataListBinding;
	constructor(model: ODataModelV4, modelBindList: string) {
		this.modelBindList = modelBindList;
		this.model = model;
		this.entityBindList = this.model.bindList(modelBindList, null, [], [], {
			$$getKeepAliveContext: true,
		});
	}
	public async getList<T = unknown>(): Promise<T[]> {
		const entityContexts = await this.entityBindList.requestContexts();
		return entityContexts.map(
			(entityContext) => entityContext.getObject() as T
		);
	}

	public async getListWithFilter<T = unknown>(
		filters: Array<Filter>
	): Promise<T[]> {
		const entityBinding = this.model
			.bindList(this.modelBindList)
			.filter(filters); //use new listbinding instance - otherwise not all books will be in the list
		const entityContexts = await entityBinding.requestContexts();
		return entityContexts.map(
			(entityContext) => entityContext.getObject() as T
		);
	}
	public async getEntityById<T = unknown>(id: number): Promise<T> {
		const entityBinding = this.model.getKeepAliveContext(
			`${this.modelBindList}(${id})`
		);
		return (await entityBinding.requestObject()) as T;
	}
	public async create<T = unknown>(newObj: T): Promise<T> {
		const entityContext = this.entityBindList.create(newObj);
		(await entityContext.created()) as T;
		return entityContext.getObject() as T;
	}

	public async deleteByID<T = string | number>(id: T): Promise<void> {
		const entityBinding = this.model.getKeepAliveContext(
			`${this.modelBindList}(${id as string | number})`
		);
		await entityBinding.delete();
	}
}
