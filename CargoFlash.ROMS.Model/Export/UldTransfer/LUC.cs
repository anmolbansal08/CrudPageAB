using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Export.UldTransfer
{

    public class LUC
    {
        public string ULDTRANSNO { get; set; }
        public string Text_UCRCarrierCode { get; set; }
        public string Text_UCRNumber { get; set; }
        public string Text_UHFCarrierCode { get; set; }
        public string Text_UHFNumber { get; set; }
        public string hdnOriginator { get; set; }
        public string Text_IssuedDate { get; set; }
        public string Text_IssuedTime { get; set; }
        public string hdnControlReceiptNo { get; set; }
        public string hdnSendLocLHR { get; set; }
        public string Text_status { get; set; }
        public string ULD { get; set; }
        public string Text_ULD { get; set; }
        public string Text_Name { get; set; }
        public string Text_IDNumber { get; set; }
        public string Text_MobileNo { get; set; }
        public string Text_SI1 { get; set; }
        public string Text_SI2 { get; set; }
        public string Text_LoadedBy { get; set; }
        public string UserSNo { get; set; }
        public string Manualauto { get; set; }
    }

    [KnownType(typeof(LUCOut))]
    public class LUCOut
    {
        public string SNo { get; set; }
        public bool Bucr { get; set; }
        public bool Buhf { get; set; }
        public string hdnOriginator { get; set; }
        public string Span_Originator { get; set; }
        public string Text_IssuedDate { get; set; }
        public string Text_Issuetime { get; set; }
        public string hdnSendLocLHR { get; set; }
        public string span_SendLocLHR { get; set; }
        public string Text_Status { get; set; }
        public string ULD { get; set; }
        public string Text_ULD { get; set; }
        public string Text_MobileNo { get; set; }
        public string Text_Name { get; set; }
        public string Text_IDNumber { get; set; }
        public string Text_LUCInNumber { get; set; }
        public string Text_CityCode { get; set; }
        public string Text_IssuedBy { get; set; }
        public string Text_IssuedFrom { get; set; }
        public string IssuedFrom { get; set; }
        public string Text_Issuedate { get; set; }
        public string Text_Receiveddate { get; set; }
        public string Text_DemurrageCode { get; set; }
        public string Text_ODLNCode { get; set; }
        public string Text_Remarks { get; set; }
        public string Text_ReceivedBy { get; set; }
        public string AirportSNo { get; set; }
        public string LUCInNumber { get; set; }
        public string Text_ReceivedFrom { get; set; }
        public string Text_ReceivedTime { get; set; }
        public string UCRReceiptNo { get; set; }
        public string UHFReceiptNo { get; set; }
        public string RentalDays { get; set; }
        public string isrDamage { get; set; }
        public string isrdamageremarks { get; set; }

        public int ODLNCode { get; set; }

        public int Text_ReceivedBySNO { get; set; }

        public int Currentusersno { get; set; }

        public string currentuserName { get; set; }
        public string INPOUTProcessStatus { get; set; }
        public string ISDamge { get; set; }
        public string DamagedRemarks { get; set; }

    }


    [KnownType(typeof(LUCOutGrid))]
    public class LUCOutGrid
    {
        public string SNo { get; set; }
        public string ULDNumber { get; set; }
        public string ULDCode { get; set; }
        public string OwnerCode { get; set; }
        public DateTime ULDDate { get; set; }
        public string ULDTime { get; set; }
        public string UserName { get; set; }
        public string ReceivedByCityCode { get; set; }
        public string AirportName { get; set; }
        public string FinalDestination { get; set; }
        public string DAM { get; set; }
        public string UHFReceiptNo { get; set; }
        public string UCRReceiptNo { get; set; }
        public string SentLUC { get; set; }
        public int IssuedTo { get; set; }
        public int ULDCount { get; set; }
        public bool IsESS { get; set; }
        public bool Credit { get; set; }
        public bool IsAL { get; set; }
        public bool IsUCR { get; set; }
        public bool IsPayment { get; set; }
        public string ProcessStatus { get; set; }
        public string IsInbound { get; set; }
    }





}
