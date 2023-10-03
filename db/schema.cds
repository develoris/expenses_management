using {managed} from '@sap/cds/common';

namespace expensesManagement;

entity banktransfer : managed {
    key ID       : UUID;
        amount   : Double;
        note     : String(255);
        period   : Date;
        active   : Boolean default 'true';
        fileName : String;
// image    : LargeBinary @Core.ContentDisposition.Filename: fileName;
}

entity banktransferMedia {
    key ID        : UUID;

        //     @Core.MediaType  : mediaType
        //     content   : LargeBinary;

        //     @Core.IsMediaType: true
        //     mediaType : String;
        //     fileName  : String;
        //     url       : String default '';
        content   : LargeBinary @Core.MediaType: mediaType;
        mediaType : String      @Core.IsMediaType;

}
