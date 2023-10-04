import cds from "@sap/cds";
import { Service } from "@sap/cds/apis/services";

export default (expensesManagement: Service) => {
  console.log("ciao");
  const em = expensesManagement;
  const { banktransferMedia } = em.entities("expensesManagement");
  em.after("GET", "banktransfer", () => {
    console.log(banktransferMedia);
    return;
  });

  em.on(["CREATE", "POST"], "banktransfermedia", () => {
    console.log("create image");
  });

  /**
   * Handler method called before creating data entry
   * for entity Mediafile.
   */
  //    em.before('CREATE', banktransferMedia, async (req) => {
  //     const db = await cds.connect.to("db");
  //     // Create Constructor for SequenceHelper
  //     // Pass the sequence name and db
  //     const SeqReq = new SequenceHelper({
  //         sequence: "MEDIA_ID",
  //         db: db,
  //     });
  //     //Call method getNextNumber() to fetch the next sequence number
  //     let seq_no = await SeqReq.getNextNumber();
  //     // Assign the sequence number to id element
  //     req.data.id = seq_no;
  //     //Assign the url by appending the id
  //     req.data.url = `/media/MediaFile(${req.data.id})/content`;
  // });
};
