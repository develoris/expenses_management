using {expensesManagement} from '../db/schema';
using {managed} from '@sap/cds/common';

service expensesmanagementService {
    entity banktransfer as projection on expensesManagement.banktransfer
}
