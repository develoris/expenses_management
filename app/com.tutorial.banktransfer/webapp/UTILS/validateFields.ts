import { ValueState } from "sap/ui/core/library";
import { ValidateStateEntity } from "../model/types";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
interface state {
	[key: string]: ValidateStateEntity | ValueState | string;
}
type oModelObject = object & { _state?: ValidateStateEntity };
// interface IValidateFunctionsAsync {}
export const validateStateAppointment = async (
	oModelObject: oModelObject,
	fields: string[],
	i18nBundle: ResourceBundle,
	validateFunctionsSync?: ((oModelObject: oModelObject) => oModelObject)[],
	validateFunctionsAsync?: ((
		oModelObject: oModelObject
	) => Promise<oModelObject>)[]
): Promise<oModelObject> => {
	const _state = {} as state;
	//Check mandatory
	const oModelObjectNever = oModelObject as never;
	for (const key of fields) {
		const value = oModelObjectNever[key];
		if (value === undefined || value === null || value === "") {
			_state[key] = {
				valueState: ValueState.Error,
				valueStateText: i18nBundle.getText("VALUESTATE_MANDATORY"), //Inserire il campo obbligatorio"
			} as ValidateStateEntity;
			_state.valueState = ValueState.Error;
			_state.valueStateText = i18nBundle.getText("VALUESTATE_MANDATORY_FIELD");
		}
	}
	if (Object.keys(_state).length > 0) {
		oModelObject._state = _state;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
	} else if (Object.hasOwn(oModelObject, "_state") as boolean) {
		delete oModelObject._state;
	}
	// oModelObject._state = _state;

	//Check date validity
	// oAppointment = this.validateDate(oAppointment);
	if (validateFunctionsSync && validateFunctionsSync.length > 0) {
		for (const fSync of validateFunctionsSync) {
			oModelObject = fSync(oModelObject);
		}
	}
	if (validateFunctionsAsync && validateFunctionsAsync.length > 0) {
		for (const fAsync of validateFunctionsAsync) {
			oModelObject = await fAsync(oModelObject);
		}
	}
	return oModelObject;
};
