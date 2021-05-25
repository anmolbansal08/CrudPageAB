using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Export.UldTransfer
{
    [KnownType(typeof(UldOut))]
    public class UldOut
    {
        public int DemurrageCode { get; set; }
        public int FinalDestination { get; set; }
        public int IssuedTo { get; set; }
        public int ODLNCode { get; set; }
        public int ReceivedBy { get; set; }
        public bool Damaged { get; set; }
        public string ReceivedByCode { get; set; }
        public string Text_DamageCondition { get; set; }
        public string Text_DemurrageCode { get; set; }
        public string Text_FinalDestination { get; set; }
        public string Text_IssuedDate { get; set; }
        public string Text_IssuedTime { get; set; }
        public string Text_IssuedTo { get; set; }
        public string Text_ODLNCode { get; set; }
        public string Text_ReceivedBy { get; set; }
        public string Text_ULDNumber { get; set; }
        public string ULDCode { get; set; }
        public string ULDNumber { get; set; }
        public int UserSNo { get; set; }
        public int AirportSNo { get; set; }
        public int IssuedBy { get; set; }
        public string Text_IssuedBy { get; set; }
        public string Text_Remarks { get; set; }
        public int TransferBy { get; set; }
        public string Text_TransferBy { get; set; }
        public string Text_TransferPoint { get; set; }
        public string IsAvailable { get; set; }
        public string CurrLocation { get; set; }
        public int IsInbound { get; set; }
        public int Rentaldays { get; set; }
        public int IsMsgSent { get; set; }
        public string IsInboundSno { get; set; }
        public string LUCInNumber { get; set; }

    }
    [KnownType(typeof(UldOutType))]
    public class UldOutType
    {
        public string UldSno { get; set; }
        public string uldIsdamage { get; set; }
        public string IsAvailable { get; set; }
        public string IsServiceable { get; set; }
        public string uldremarks { get; set; }
        public string UldType { get; set; }
        public string UldNumber { get; set; }
        public string ULDCode { get; set; }
    }
    [KnownType(typeof(UldOutGird))]
    public class UldOutGird
    {
        public string SNo { get; set; }
        public string ULDNumber { get; set; }
        public string Text_ULDNumber { get; set; }
        public string ULDCode { get; set; }
        public string Transferby { get; set; }
        public string Text_TransferBy { get; set; }
        public string Text_ReceivedBy { get; set; }
        public DateTime IssuedDateTime { get; set; }
        public int IsMsgSent { get; set; }
        public int IsConsumables { get; set; }
        public int IsMage { get; set; }
        public string IsInbound { get; set; }
        public string IsInboundSno { get; set; }
        public string IssuedTo { get; set; }
    }

    [KnownType(typeof(ConsumableOuterGrid))]
    public class ConsumableOuterGrid
    {
        public string SNo { get; set; }
        public string ULDTransferSNo { get; set; }
        public string Consumables { get; set; }
        public string HdnConsumables { get; set; }
        public string Text_Consumables { get; set; }
        public string GrossWt { get; set; }
        public string Stock { get; set; }
        public string TransferBy { get; set; }
    }

    [KnownType(typeof(EssOuterGrid))]
    public class EssOuterGrid
    {
        public string SNo { get; set; }
        public string ULDTransferSNo { get; set; }
        public string ServiceName { get; set; }
        public string HdnServiceName { get; set; }
        public string Text_ServiceSNo { get; set; }
        public string PrimaryValue { get; set; }
        public string SecondaryValue { get; set; }
        public string Charges { get; set; }
        public string Mode { get; set; }
    }

    [DataContract]
    public class UploadedFile
    {
        [DataMember]
        public string FilePath { get; set; }

        [DataMember]
        public string FileLength { get; set; }

        [DataMember]
        public string FileName { get; set; }

        //Other information. On upload only path and size are obvious.
        //...
    }

}
