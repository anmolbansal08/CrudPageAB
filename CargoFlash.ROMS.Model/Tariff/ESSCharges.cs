using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using CargoFlash.SoftwareFactory.Data;


namespace CargoFlash.Cargo.Model.Tariff
{

    /*
   *****************************************************************************
   Class Name:		ESS Charges     
   Purpose:		Used Traverse Structured data to Sql Server to WebPage and vice versa
                   Implemenatation of class is perfomed in WEBUIs and Services 
   Company:		CargoFlash 
   Author:			Karan Kumar
   Created On:		24 feb 2016
   Approved By:    
   Approved On:	
   *****************************************************************************
   */
    [KnownType(typeof(ESSCharges))]
    public class ESSCharges
    {


        /// <summary>
        /// SNo is primary value in Entity Account
        /// </summary>
        public string MomvementType { get; set; }

        public string Type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TypeValue { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string BillTo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int BillToSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 
        public string FlightDate { get; set; }

        public string BillToAgentName { get; set; }

        public string ShipperName { get; set; }

        public string Process { get; set; }

        public string SubProcess { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
        //public string TariffSNo { get; set; }
        //public Boolean PaymentType { get; set; }
        //public decimal PrimaryValue { get; set; }
        //public decimal SecondaryValue { get; set; }
        //    public List<ESSChargesTeans> LstESSCharges { get; set; }

        public string TariffSNo { get; set; }
        public decimal PrimaryValue { get; set; }
        public decimal SecondaryValue { get; set; }

        public List<DOHandlingCharges> LstDOHandlingCharges { get; set; }
    }
    [KnownType(typeof(ESSChargesTeans))]
    public class ESSChargesTeans
    {
        public string TariffSNo { get; set; }
        public Boolean PaymentType { get; set; }
        public decimal PrimaryValue { get; set; }
        public decimal SecondaryValue { get; set; }
    }

    [KnownType(typeof(DOHandlingCharges))]
    public class DOHandlingCharges
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
        [Order(7)]
        public string sValue { get; set; }
        [Order(8)]
        public decimal Amount { get; set; }
        [Order(9)]
        public decimal Discount { get; set; }
        [Order(10)]
        public decimal DiscountPercent { get; set; }
        [Order(11)]
        public decimal TotalTaxAmount { get; set; }
        [Order(12)]
        public decimal TaxDiscount { get; set; } = 0;
        [Order(13)]
        public decimal TaxDiscountPercent { get; set; } = 0;
        [Order(14)]
        public decimal TotalAmount { get; set; }
        [Order(15)]
        public string Rate { get; set; }
        [Order(16)]
        public string Min { get; set; }
        [Order(17)]
        public string Mode { get; set; }
        [Order(18)]
        public string ChargeTo { get; set; }
        [Order(19)]
        public string pBasis { get; set; }
        [Order(20)]
        public string sBasis { get; set; }
        [Order(21)]
        public string Remarks { get; set; }
        [Order(22)]
        public string WaveoffRemarks { get; set; }
        [Order(23)]
        public string NonReturnDays { get; set; }
        [Order(24)]
        public int IsDamaged { get; set; }
        [Order(25)]
        public string ErrorMessage { get; set; }
        [Order(26)]
        public string DescriptionRemarks { get; set; }
        [Order(27)]
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

    [KnownType(typeof(CTMCharges))]
    public class CTMCharges
    {


        /// <summary>
        /// SNo is primary value in Entity Account
        /// </summary>
        public string MomvementType { get; set; }

        public string Type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TypeValue { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string BillTo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public int BillToSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 
        //public string FlightDate { get; set; }

        public string FlightNo { get; set; }

        public string CTMSNo { get; set; }

        //public string ShipperName { get; set; }

        public string Process { get; set; }

        public string SubProcessSNo { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
        //public string TariffSNo { get; set; }
        //public Boolean PaymentType { get; set; }
        //public decimal PrimaryValue { get; set; }
        //public decimal SecondaryValue { get; set; }
        //    public List<ESSChargesTeans> LstESSCharges { get; set; }

        public string TariffSNo { get; set; }
        public decimal PrimaryValue { get; set; }
        public decimal SecondaryValue { get; set; }

        public List<DOHandlingCharges> LstCTMCharges { get; set; }
    }

    [KnownType(typeof(LUCCharges))]
    public class LUCCharges
    {


        /// <summary>
        /// SNo is primary value in Entity Account
        /// </summary>
        public string MomvementType { get; set; }

        public string Type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TypeValue { get; set; }
        /// <summary>
        /// 
        /// 
        /// </summary>
        public string BillTo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        //public int BillToSNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        /// 
        //public string FlightDate { get; set; }

        public string FlightNo { get; set; }

        public string CTMSNo { get; set; }

        //public string ShipperName { get; set; }

        public string Process { get; set; }

        public string SubProcessSNo { get; set; }

        public string CreatedBy { get; set; }

        public string UpdatedBy { get; set; }
        //public string TariffSNo { get; set; }
        //public Boolean PaymentType { get; set; }
        //public decimal PrimaryValue { get; set; }
        //public decimal SecondaryValue { get; set; }
        //    public List<ESSChargesTeans> LstESSCharges { get; set; }

        public string TariffSNo { get; set; }
        public decimal PrimaryValue { get; set; }
        public decimal SecondaryValue { get; set; }

        public List<DOHandlingCharges> LstLUCCharges { get; set; }
    }
    [KnownType(typeof(AWBSummaryArray))]
    public class AWBSummaryArray
    {
        public string Awb { get; set; }
        public int Origin { get; set; }
        public int destination { get; set; }
        public string carriercode { get; set; }
        public string AwbFlightNo { get; set; }
        public string AwbFlightDate { get; set; }
        public int pieces { get; set; }
        public decimal chweight { get; set; }
        public decimal grwt { get; set; }
        public string commodity { get; set; }
        public int AwbType { get; set; }
        public int MovementType { get; set; }
        public int BillToSNo { get; set; }
        public decimal CBM { get; set; }
        public decimal VolumeWt { get; set; }
        public int NoofHouse { get; set; }
        public string SHIPPERConsignee { get; set; }
        public int AWBOrigin { get; set; }
        public int AWBDestination { get; set; }
        public string FlightCarrierCode { get; set; }
        public string FlightNo { get; set; }
        public string FlightNoPrix { get; set; }
        public string FlightNoPrix1 { get; set; }
        public string AWBDate { get; set; }

    }
    public class SaveAtESSRequest
    {

        public List<EssHouseInfo> lstEssHouseInfo { get; set; }
        public string Type { get; set; }
        public int? NoofHouse { get; set; }
    }
    public class EssHouseInfo
    {
       

        [Order(1)]
        public int? AwbSno { get; set; }
        [Order(2)]
        public string Hawbno { get; set; }
        [Order(3)]
        public decimal? hawPieces { get; set; }
        [Order(4)]
        public decimal? hawGrossWt { get; set; }
        [Order(5)]
        public decimal? hawVolumeWt { get; set; }
        [Order(6)]
        public decimal? hawCBM { get; set; }
        [Order(7)]
        public decimal? hawChargeableWt { get; set; }
        [Order(8)]
        public string hawExcommodity { get; set; }
        [Order(9)]
        public string hawSHC { get; set; }
        [Order(10)]
        public string hawExSHIPPER { get; set; }
        [Order(11)]
        public string hawExConsignee { get; set; }

      
    }
    [KnownType(typeof(DOShipmentInfo))]
    public class DOShipmentInfo
    {
        public int PartNumber { get; set; }
        public int AWBSNo { get; set; }
        public int HAWBSNo { get; set; }
        public int PartSNo { get; set; }
        public int Pieces { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public int IsBUP { get; set; }
        public int SPHCSNo { get; set; }
        public string SPHCTransSNo { get; set; }
        public string ULDSNo { get; set; }
    }

    [KnownType(typeof(ShipperInformation))]
    public class ShipperInformation
    {
        [Order(1)]
        public string ShipperAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string ShipperName
        {
            get;
            set;
        }
        [Order(3)]
        public string ShipperName2
        {
            get;
            set;
        }

        [Order(4)]
        public string ShipperStreet
        {
            get;
            set;
        }
        [Order(5)]
        public string ShipperStreet2
        {
            get;
            set;
        }
        [Order(6)]
        public string ShipperLocation
        {
            get;
            set;
        }
        [Order(7)]
        public string ShipperState
        {
            get;
            set;
        }
        [Order(8)]
        public string ShipperPostalCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ShipperCity
        {
            get;
            set;
        }
        [Order(10)]
        public string ShipperCountryCode
        {
            get;
            set;
        }
        [Order(11)]
        public string ShipperMobile
        {
            get;
            set;
        }
        [Order(12)]
        public string ShipperMobile2
        {
            get;
            set;
        }
        [Order(13)]
        public string ShipperEMail
        {
            get;
            set;
        }
        [Order(14)]
        public string ShipperFax
        {
            get;
            set;
        }
    }

    [KnownType(typeof(ConsigneeInformation))]
    public class ConsigneeInformation
    {
        [Order(1)]
        public string ConsigneeAccountNo
        {
            get;
            set;
        }
        [Order(2)]
        public string ConsigneeName
        {
            get;
            set;
        }
        [Order(3)]
        public string ConsigneeName2
        {
            get;
            set;
        }

        [Order(4)]
        public string ConsigneeStreet
        {
            get;
            set;
        }
        [Order(5)]
        public string ConsigneeStreet2
        {
            get;
            set;
        }

        [Order(6)]
        public string ConsigneeLocation
        {
            get;
            set;
        }
        [Order(7)]
        public string ConsigneeState
        {
            get;
            set;
        }
        [Order(8)]
        public string ConsigneePostalCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ConsigneeCity
        {
            get;
            set;
        }
        [Order(10)]
        public string ConsigneeCountryCode
        {
            get;
            set;
        }
        [Order(11)]
        public string ConsigneeMobile
        {
            get;
            set;
        }
        [Order(12)]
        public string ConsigneeMobile2
        {
            get;
            set;
        }

        [Order(13)]
        public string ConsigneeEMail
        {
            get;
            set;
        }
        [Order(14)]
        public string ConsigneeFax
        {
            get;
            set;
        }
    }


}