using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Import
{
    [KnownType(typeof(CTM))]
    public class CTM
    {
        public int PoMailSNo { get; set; }
        public int ULDStockSNo { get; set; }
        public bool IsChecked { get; set; }
        public string IsOffloaded { get; set; }
    }

    [KnownType(typeof(CTMRecord))]
    public class CTMRecord
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public string FlightNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public string IsPrint { get; set; }
        public string AWBTYPE { get; set; }
        public string TRANSFERTO { get; set; }

        public string TransferAirportCode { get; set; }

    }

    [KnownType(typeof(CTMchildRecord))]
    public class CTMchildRecord
    {
        public int SNo { get; set; }
        public string AWBSNo { get; set; }
        public string TransSNo { get; set; }
        public string AWBNo { get; set; }
        public string PcsWtCbm { get; set; }
        public string AWBOrigin { get; set; }
        public string AWBDestination { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightOrigin { get; set; }
        public string FlightDestination { get; set; }
        public string FreightType { get; set; }
        public string TransferCity { get; set; }
        public string TransferDate { get; set; }
        public string TransferTo { get; set; }
        public string Text_TransferTo { get; set; }
        public string DeliverdTo { get; set; }
        public string Text_DeliverdTo { get; set; }
        public string NatureofGoods { get; set; }
        public string Remarks { get; set; }
    }
    [KnownType(typeof(CTMInsertRecord))]
    public class CTMInsertRecord
    {
        public int AWBSNo { get; set; }
        public int AWBTYPE { get; set; }
        public decimal Pieces { get; set; }
        public decimal GrWt { get; set; }

        public int DOSNO { get; set; }
        public int PDSNo { get; set; }
        public int TransferAirportSNo { get; set; }
        public int TransferCitySNo { get; set; }
        public string DateOfTransfer { get; set; }
        public int TransferTo { get; set; }
        public int TransferToSNo { get; set; }
        public string DeliverdTo { get; set; }
        public string IdCardNo { get; set; }
        public string TransferType { get; set; }
        public string NatureofGoods { get; set; }
        public string Remarks { get; set; }
        public string DailyFlightSno { get; set; }
    }


    [KnownType(typeof(CTMHandlingCharges))]
    public class CTMHandlingCharges
    {
        //public string ChargeName { get; set; }
        //public string HdnChargeName { get; set; }
        //public string Amount { get; set; }
        //public string TotalAmount { get; set; }
        //public string Payment { get; set; }
        //public string Credit { get; set; }
        //public string Remarks { get; set; }
        //public string BillTo { get; set; }
        //public string HdnBillTo { get; set; }

        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string AWBSNo { get; set; }
        [Order(3)]
        public string WaveOff { get; set; }
        [Order(4)]
        public string TariffCodeSNo { get; set; }
        [Order(5)]
        public string TariffHeadName { get; set; }
        [Order(6)]
        public string pValue { get; set; }
        [Order(6)]
        public string sValue { get; set; }
        [Order(7)]
        public decimal Amount { get; set; }
        [Order(8)]
        public string Discount { get; set; }
        [Order(9)]
        public string DiscountPercent { get; set; }
        [Order(10)]
        public decimal TotalTaxAmount { get; set; }
        [Order(11)]
        public decimal TotalAmount { get; set; }
        [Order(12)]
        public string Rate { get; set; }
        [Order(13)]
        public string Min { get; set; }
        [Order(14)]
        public string Mode { get; set; }
        [Order(15)]
        public string ChargeTo { get; set; }
        [Order(16)]
        public string pBasis { get; set; }
        [Order(17)]
        public string sBasis { get; set; }
        [Order(18)]
        public string Remarks { get; set; }
        [Order(19)]
        public string WaveoffRemarks { get; set; }
        [Order(20)]
        public string DescriptionRemarks { get; set; }
        [Order(21)]
        public string TaxPercent { get; set; }
        //[Order(5)]
        //public decimal Value { get; set; }
        //[Order(7)]
        //public string Basis { get; set; }
        //[Order(8)]
        //public string OnWt { get; set; }
        //[Order(9)]
        //public string Rate { get; set; }
        //[Order(10)]
        //public string Min { get; set; }
        //[Order(11)]
        //public string TotalTaxAmount { get; set; }
        //[Order(14)]
        //public string WaveOff { get; set; }
    }

    [KnownType(typeof(AWBInfo))]
    public class AWBInfo
    {


        [Order(1)]
        public string AWBSNO { get; set; }
        [Order(2)]
        public string CTMPieces { get; set; }
        [Order(3)]
        public string CTMGrWt { get; set; }
        [Order(4)]
        public string CTMVolWt { get; set; }
        [Order(5)]
        public string ULDStockSno { get; set; }
        [Order(6)]
        public string BULKULD { get; set; }



    }

    [KnownType(typeof(WhereConditionModel))]
    public class WhereConditionModel
    {
         public string processName { get; set; }
         public string moduleName { get; set; }
         public string appName { get; set; }
         public int CitySNo { get; set; }
         public string FlightNo { get; set; }
         public string FlightDate { get; set; }
         public bool IsBondedWareHouse { get; set; }
    }

    [KnownType(typeof(GetCTMGridData))]
    public class GetCTMGridData
    {
        public int CitySNo { get; set; }
        public string FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string IsBondedWareHouse { get; set; }
    }
}
