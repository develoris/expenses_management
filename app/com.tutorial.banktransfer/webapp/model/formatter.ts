export default {
	formatValue: (value: string) => {
		return value?.toUpperCase();
	},
	test: (value: string) => {
		console.log("formatter", value);
		return value;
	},
};
