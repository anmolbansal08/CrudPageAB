using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
//using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.House
{    
    [KnownType(typeof(ShipmentInformation))]
    public class ShipmentInformation
    {
        [Order(1)]
        public string IsCourier
        {
            get;
            set;
        }
        [Order(2)]
        public string ShowSlacDetails
        {
            get;
            set;
        }
        [Order(3)]
        public string HAWBNo
        {
            get;
            set;
        }
        [Order(4)]
        public string AgentBranchSNo
        {
            get;
            set;
        }
        [Order(5)]
        public string HAWBTotalPieces
        {
            get;
            set;
        }
        [Order(6)]
        public string CommoditySNo
        {
            get;
            set;
        }
        [Order(7)]
        public string GrossWeight
        {
            get;
            set;
        }
        [Order(8)]
        public string VolumeWeight
        {
            get;
            set;
        }
        [Order(9)]
        public string ChargeableWeight
        {
            get;
            set;
        }
        [Order(10)]
        public string Pieces
        {
            get;
            set;
        }
        [Order(11)]
        public string ProductSNo
        {
            get;
            set;
        }
        [Order(12)]
        public string IsPrepaid
        {
            get;
            set;
        }
        [Order(13)]
        public string OriginCity
        {
            get;
            set;
        }
        [Order(14)]
        public string DestinationCity
        {
            get;
            set;
        }
        [Order(15)]
        public string XRayRequired
        {
            get;
            set;
        }
        [Order(16)]
        public string HAWBDate
        {
            get;
            set;
        }
        [Order(17)]
        public string NatureOfGoods
        {
            get;
            set;
        }
        [Order(18)]
        public string AWBSNo
        {
            get;
            set;
        }
        [Order(18)]
        public string AWBNo
        {
            get;
            set;
        }
    }

    [KnownType(typeof(HAWBSPHC))]
    public class HAWBSPHC
    {
        [Order(1)]
        public string HAWBSNo
        {
            get;
            set;
        }
        [Order(2)]
        public string HAWBNo
        {
            get;
            set;
        }
        [Order(3)]
        public string SPHCCode
        {
            get;
            set;
        }
    }

    [KnownType(typeof(HAWBSPHCTrans))]
    public class HAWBSPHCTrans
    {
        [Order(1)]
        public string SNo
        {
            get;
            set;
        }
        [Order(2)]
        public string HAWBSNo
        {
            get;
            set;
        }
        [Order(3)]
        public string HAWBNo
        {
            get;
            set;
        }
        [Order(4)]
        public string SPHCCode
        {
            get;
            set;
        }
        [Order(5)]
        public string UNNo
        {
            get;
            set;
        }
        [Order(6)]
        public string SPHCClassSNo
        {
            get;
            set;
        }
        [Order(7)]
        public string IsRadioActive
        {
            get;
            set;
        }
        [Order(8)]
        public string MCBookingSNo
        {
            get;
            set;
        }
        [Order(9)]
        public string SubRisk
        {
            get;
            set;
        }
        [Order(10)]
        public string RamCat
        {
            get;
            set;
        }
        [Order(11)]
        public string UnPackingGroupImpCode
        {
            get;
            set;
        }
        [Order(12)]
        public string CaoX
        {
            get;
            set;
        }
        [Order(13)]
        public string ImpCode
        {
            get;
            set;
        }
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
        public string ShipperStreet
        {
            get;
            set;
        }
        [Order(4)]
        public string ShipperLocation
        {
            get;
            set;
        }
        [Order(5)]
        public string ShipperState
        {
            get;
            set;
        }
        [Order(6)]
        public string ShipperPostalCode
        {
            get;
            set;
        }
        [Order(7)]
        public string ShipperCity
        {
            get;
            set;
        }
        [Order(8)]
        public string ShipperCountryCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ShipperMobile
        {
            get;
            set;
        }
        [Order(10)]
        public string ShipperEMail
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
        public string ConsigneeStreet
        {
            get;
            set;
        }
        [Order(4)]
        public string ConsigneeLocation
        {
            get;
            set;
        }
        [Order(5)]
        public string ConsigneeState
        {
            get;
            set;
        }
        [Order(6)]
        public string ConsigneePostalCode
        {
            get;
            set;
        }
        [Order(7)]
        public string ConsigneeCity
        {
            get;
            set;
        }
        [Order(8)]
        public string ConsigneeCountryCode
        {
            get;
            set;
        }
        [Order(9)]
        public string ConsigneeMobile
        {
            get;
            set;
        }
        [Order(10)]
        public string ConsigneeEMail
        {
            get;
            set;
        }
    }

    [KnownType(typeof(Dimensions))]
    public class Dimensions
    {
        [Order(1)]
        public string HAWBSNo { get; set; }
        [Order(2)]
        public string Height { get; set; }
        [Order(3)]
        public string Length { get; set; }
        [Order(4)]
        public string Width { get; set; }
        [Order(5)]
        public string Pieces { get; set; }
        [Order(6)]
        public string CBM { get; set; }
        [Order(7)]
        public string Unit { get; set; }
       
    }

    [KnownType(typeof(HAWBULDTrans))]
    public class HAWBULDTrans
    {
        [Order(1)]
        public string HAWBSNo { get; set; }
        [Order(2)]
        public string ULDSNo { get; set; }
        [Order(3)]
        public string ULDNo { get; set; }
        [Order(4)]
        public string UldPieces { get; set; }
        [Order(5)]
        public string UldGrossWt { get; set; }
        [Order(6)]
        public string UldTareWt { get; set; }
        [Order(7)]
        public string UldVolWt { get; set; }
        [Order(8)]
        public string CityCode { get; set; }
        [Order(9)]
        public string MCBookingSNo { get; set; }
        [Order(10)]
        public string DNNo { get; set; }
        [Order(11)]
        public string MailDestination { get; set; }
        [Order(12)]
        public string OriginRefNo { get; set; }
        [Order(13)]
        public string ULDPivotWt { get; set; }
        [Order(14)]
        public string ULDMaxGrossWt { get; set; }
    }

    [KnownType(typeof(HouseOSIInformation))]
    public class HouseOSIInformation
    {
        [Order(1)]
        public string SCI
        {
            get;
            set;
        }
        [Order(2)]
        public string OSI
        {
            get;
            set;
        }
        [Order(3)]
        public string OCI
        {
            get;
            set;
        }
        [Order(4)]
        public string NatureOfGoods
        {
            get;
            set;
        }
        [Order(5)]
        public string Remarks
        {
            get;
            set;
        }
    }
    
    [KnownType(typeof(HAWBXRay))]
    public class HAWBXRay
    {
        [Order(1)]
        public string SNo { get; set; }
        
        [Order(2)]
        public string HAWBNo { get; set; }
        
        [Order(3)]
        public string ScannedPieces { get; set; }
        
    }

    [KnownType(typeof(HAWBLocation))]
    public class HAWBLocation
    {
        [Order(1)]
        public string SNo { get; set; }
        [Order(2)]
        public string HAWBNo { get; set; }

        [Order(3)]
        public string ScannedPieces { get; set; }

        [Order(4)]
        public string LocationSNo { get; set; }
    }

    [KnownType(typeof(ULDLocation))]
    public class ULDLocation
    {
        [Order(1)]
        public int RowNo
        {
            get;
            set;
        }

        [Order(2)]
        public string SNo
        {
            get;
            set;
        }
        [Order(3)]
        public string LocationSno
        {
            get;
            set;
        }

    }

    [KnownType(typeof(HAWBGroup))]
    public class HAWBGroup
    {
        [Order(1)]
        public string SNo
        {
            get;
            set;
        }

        [Order(2)]
        public string HAWBNo { get; set; }

        [Order(3)]
        public string NoOfPieces
        {
            get;
            set;
        }

        [Order(4)]
        public string ScannedPieces { get; set; }

        [Order(5)]
        public decimal GrossWt
        {
            get;
            set;
        }

        [Order(7)]
        public string Remarks { get; set; }

    }
    
    [KnownType(typeof(CheckListTrans))]
    public class CheckListTrans
    {
        [Order(1)]
        public string CheckListDetailSNo { get; set; }
        [Order(2)]
        public string Status { get; set; }
        [Order(3)]
        public string AWBSNo { get; set; }
        [Order(4)]
        public string EnteredBy { get; set; }
        [Order(5)]
        public string Remarks { get; set; }

    }

    [KnownType(typeof(HAWBHandlingMessage))]
    public class HAWBHandlingMessage
    {

        [Order(1)]
        public string HAWBSNo { get; set; }
        [Order(2)]
        public string HandlingMessageTypeSNo { get; set; }
        [Order(3)]
        public string Message { get; set; }

    }
    [KnownType(typeof(HAWBOSIModel))]
    public class HAWBOSIModel
    {
        [Order(1)]
        public string HAWBSNo { get; set; }
        [Order(2)]
        public string OSI { get; set; }

    }
    [KnownType(typeof(HAWBOCIModel))]
    public class HAWBOCIModel
    {
        [Order(1)]
        public string HAWBSNo { get; set; }
        [Order(2)]
        public string CountryCode { get; set; }
        [Order(3)]
        public string InfoType { get; set; }
        [Order(4)]
        public string CSControlInfoIdentifire { get; set; }
        [Order(5)]
        public string SCSControlInfoIdentifire { get; set; }
    }

    
}