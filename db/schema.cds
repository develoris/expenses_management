using {managed} from '@sap/cds/common';

namespace expensesManagement;

entity banktransfer : managed {
    key ID     : UUID;
        amount : Double;
        note   : String(255);
        period : Date;
        active : Boolean default 'true';
}
