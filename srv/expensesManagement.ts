import { Service } from "@sap/cds/apis/services";

export default (expensesManagement: Service) => {
  expensesManagement.after("READ", "banktransfer", (each) => {
    return;
  });
};
