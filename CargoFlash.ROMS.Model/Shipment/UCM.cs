using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Shipment
{
    [KnownType(typeof(UCM))]
    public class UCM
    {
        public int SNo { get; set; }
        public int AirlineSNo { get; set; }
        public string Text_AirlineSNo { get; set; }
        public DateTime? FlightDate { get; set; }
        public string FlightNo { get; set; }
        public string Text_FlightNo { get; set; }
        public int UCMType { get; set; }
        public string Text_UCMType { get; set; }
        public string Text_CarrierCode { get; set; }
        public string MessageType { get; set; }
        public string Text_MessageType { get; set; }
        public string Auto { get; set; }
        public string IsNillUCM { get; set; }
        public string Station { get; set; }
        public string FlightRoute { get; set; }
        public string CityCode { get; set; }
        public string Createdat { get; set; }
        public string CreatedBy { get; set; }
        public string ProcessBy { get; set; }

    }

    [KnownType(typeof(UCMDetail))]
    public class UCMDetail
    {
        public string SNo { get; set; }
        public string ULDName { get; set; }
        public string ContentType { get; set; }
        public string DestinationAirportCode { get; set; }
    }

    //[KnownType(typeof(UCMDetailNew))]
    //public class UCMDetailNew
    //{
    //    public string SNo { get; set; }
    //    public string ULDName { get; set; }
    //    public string ContentType { get; set; }
    //    public string DestinationAirportCode { get; set; }
    //}

    [KnownType(typeof(UCMDetailTrans))]
    public class UCMDetailTrans
    {
        public int SNo { get; set; }
        public string HdnULDName { get; set; }
        public string ULDName { get; set; }
        public string BUPType { get; set; }
        public string HdnBasePallet { get; set; }
        public string BasePallet { get; set; }
        public string ContentType { get; set; }
        public string EULDType { get; set; }
        public string HdnEULDType { get; set; }
        public string ESerialNo { get; set; }
        public string EOwnerCode { get; set; }

    }
}
