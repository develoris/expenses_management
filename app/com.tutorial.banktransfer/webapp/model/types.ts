import { ValueState } from "sap/ui/core/library";

export interface NewbankTransfer {
	amount: number;
	note: string;
	period: Date | string;
}
export interface BankTransfer {
	ID: string;
	amount: number;
	notes: string;
	period: Date;
	active: boolean;
}
export interface ValidateStateEntity {
	valueState?: ValueState;
	valueStateText?: string;
}
