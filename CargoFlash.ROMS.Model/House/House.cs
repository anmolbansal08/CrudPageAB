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
    [KnownType(typeof(HouseGridData))]
    public class HouseGridData
    {
        public string ProcessStatus { get; set; }// Added By manoj Kumar on 2.7.2015
        public Int64 SNo { get; set; }
        public string HAWBNo { get; set; }
        public string AWBNo { get; set; }
        public string HAWBDate { get; set; }
        public string OriginCity { get; set; }
        public string DestinationCity { get; set; }
        public decimal GrossWeight { get; set; }
        public decimal VolumeWeight { get; set; }
        public decimal ChargeableWeight { get; set; }
        public string CommodityCode { get; set; }
        public int Pieces { get; set; }
        public int AccPcs { get; set; }
        public decimal AccGrWt { get; set; }
        public decimal AccVolWt { get; set; }
    }

    [KnownType(typeof(HouseCheckListGridData))]
    public class HouseCheckListGridData
    {
        public Int64 SNo { get; set; }
        public string SrNo { get; set; }
        public string Description { get; set; }
        public string Y { get; set; }
        public string N { get; set; }
        public string NA { get; set; }
    }

    [KnownType(typeof(HouseShippingBillGridData))]
    public class HouseShippingBillGridData
    {
        public Int64 SNo { get; set; }
        public Int64 ShippingBillNo { get; set; }
        public string MessageType { get; set; }
        public string AWBNo { get; set; }
        public string AWBType { get; set; }
        public string LEONo { get; set; }
    }

}