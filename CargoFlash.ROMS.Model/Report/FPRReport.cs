using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{

    [System.Runtime.Serialization.KnownType(typeof(FPRReportRequestModel))]
    public class FPRReportRequestModel
    {
        public string AirlineCode { get; set; }
        public string FlightNo { get; set; }
        public string OriginSNo { get; set; }
        public string DestinationSNo { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string AWBNo { get; set; }
        public int IsAutoProcess { get; set; }
    }


    [System.Runtime.Serialization.KnownType(typeof(FPRReport))]
    public class FPRReport
    {
        //AWBNo	Origin	Destination	AWBDate	PlaceOfAWB	AgentName	AgentCode	
        //FlightNo	FlightDate	ETD	ETA	AircraftType	RegistrationNo	FreightType	Pieces	GrossWeight	ChargeableWeight
        //TariffRate	ProductName	Commodity	FlightType	WeightCharge	Valulation Charge	OtherCharges	SurchargeName	
        //SurchargeValue	Tax	Total Prepaid	Part

        public int SNo { get; set; }
        public string AWBNo { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string AWBDate { get; set; }
        public string PlaceOfAWB { get; set; }
        public string AgentName { get; set; }
        public string AgentCode { get; set; }
        public string FlightNo { get; set; }
        public string Charter { get; set; }
        public string AirlineCode { get; set; }
        public string FlightDate { get; set; }
        public string ETD { get; set; }
        public string ETA { get; set; }
        public string AircraftType { get; set; }
        public string RegistrationNo { get; set; }
        public string FreightType { get; set; }
        public string Pieces { get; set; }
        public string GrossWeight { get; set; }
        public string ChargeableWeight { get; set; }
        public string TariffRate { get; set; }
        public string ProductName { get; set; }
        public string Commodity { get; set; }
        public string NatureOfGoods { get; set; }
        public string FlightType { get; set; }
        public string WeightCharge { get; set; }
        public string ValuationCharge { get; set; }
        public string OtherCharges { get; set; }
        public string SurchargeName { get; set; }
        public string SurchargeValue { get; set; }
        public string Tax { get; set; }
        public string TotalPrepaid { get; set; }
        public string Part { get; set; }
        public string OriginAirportCode { get; set; }
        public string DestinationAirportCode { get; set; }
        public string TotalDistance { get; set; }
        public string SectorDistance { get; set; }
        


    }
}
