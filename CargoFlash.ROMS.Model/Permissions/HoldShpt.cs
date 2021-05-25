using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(HoldShpt))]
    public class HoldShpt
    {
        public int? SNo { get; set; }
        public int AWBSNo { get; set; }
        public string MomvementType { get; set; }
        public string AWBNo { get; set; }
        public string Text_AWBNo { get; set; }
        public int CitySNo { get; set; }
        public string CityCode { get; set; }
        public string Text_CityCode { get; set; }
        public int Hold_Type { get; set; }
        public string Text_Hold_Type { get; set; }

        public DateTime? HoldOn { get; set; }

        public string HoldRemarks { get; set; }
        public bool UnHold { get; set; }
        public string Text_UnHold { get; set; }
        public DateTime? UnHoldOn { get; set; }

        public string UnHoldRemarks { get; set; }
        public string HoldByXray { get; set; }
        public int HoldBy { get; set; }
        public int UnHoldBy { get; set; }

        public string IsAutoHold { get; set; }
        public string IsAutoUnHold { get; set; }
        public int HoldPieces { get; set; }
        public string HoldGrossWeight { get; set; }
        public string Status { get; set; }
        public int PiecesOnHold { get; set; }
        public int DeliveryOrderNo { get; set; }
        public string Text_DeliveryOrderNo { get; set; }
        public int FlightNo { get; set; }
        public string Text_FlightNo { get; set; }
        public string FlightDate { get; set; }
        public string CCTRefNo { get; set; }
        public string Airport { get; set; }

    }


    [KnownType(typeof(GetHoldAwb))]
    public class GetHoldAwb
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public string HoldByXray { get; set; }
        public bool IsUnhold { get; set; }
        public string Hold { get; set; }
        public string HoldPiece { get; set; }
        public string HoldRemark { get; set; }
        public bool UnHold { get; set; }
        public string UnHoldRemark { get; set; }
        public int HdnHold { get; set; }
        public string UnHoldOn { get; set; }
        public string UnHoldBy { get; set; }
        public string IsAutoUnHold { get; set; }
        public int IsApprovedUnhold { get; set; }

    }
    [KnownType(typeof(HandlingCharge))]
    public class HandlingCharge
    {
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
        public decimal? pValue { get; set; }
        [Order(7)]
        public decimal? sValue { get; set; }
        [Order(8)]
        public decimal? Amount { get; set; }
        [Order(9)]
        public decimal? Discount { get; set; }
        [Order(10)]
        public decimal? DiscountPercent { get; set; }
        [Order(11)]
        public string Tax { get; set; }
        [Order(12)]
        public string TotalAmount { get; set; }
        [Order(13)]
        public string Rate { get; set; }
        [Order(14)]
        public string Min { get; set; }
        [Order(15)]
        public string Mode { get; set; }
        [Order(16)]
        public string ChargeTo { get; set; }
        [Order(17)]
        public string pBasis { get; set; }
        [Order(18)]
        public string sBasis { get; set; }
        [Order(19)]
        public string Remarks { get; set; }
        [Order(20)]
        public string WaveoffRemarks { get; set; }
        [Order(21)]
        public string DescriptionRemarks { get; set; }

    }
    [KnownType(typeof(HoldShptInfo))]
    public class HoldShptInfo
    {
        public int SNo { get; set; }
        public int MomvementType { get; set; }
        public int AWBSNo { get; set; }
        public int CitySNo { get; set; }
        public string CityCode { get; set; }
        public int HoldPieces { get; set; }
        public string HoldGrossWeight { get; set; }
        public int DeliveryOrderNo { get; set; }
        public int FlightNo { get; set; }
        public string FlightDate { get; set; }
    }

    [KnownType(typeof(HoldShptGrid))]
    public class HoldShptGrid
    {
        public int SNo { get; set; }
        public int AWBSNo { get; set; }
        public int HdnHold { get; set; }
        public string Hold { get; set; }
        public int HoldPices { get; set; }
        public string HoldRemarks { get; set; }
        public string UnHold { get; set; }
        public string UnholdRemarks { get; set; }

    }

}
