import { ValueState } from "sap/ui/core/library";

export interface ModifybankTransfer {
	amount: number;
	note: string;
	period: Date | string;
}
export interface BankTransfer {
	ID: string;
	amount: number;
	note: string;
	period: Date;
	active: boolean;
}
export interface ValidateStateEntity {
	valueState?: ValueState;
	valueStateText?: string;
}

export interface state {
	isModifyDialog: "true" | "false";
}
