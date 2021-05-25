using System.Runtime.Serialization;
using System;
using System.ComponentModel.DataAnnotations;
// update by om shankar

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(EdiInboundAndOutbound))]
    public class EdiInboundAndOutbound
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public String Type { get; set; }
        public String EdiMessage { get; set; }
        public String AWBNoFlightNo { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public String Status { get; set; }

    }

    [KnownType(typeof(EdiInboundAndOutboundGridData))]
    public class EdiInboundAndOutboundGridData
    {
        public DateTime Date { get; set; }
        public String Carrier { get; set; }
        public String Type { get; set; }
        public String MessageType { get; set; }
        public String AWBNoFlightNo { get; set; }
        public String Status { get; set; }
        public String Reason { get; set; }
        public String Sender { get; set; }
        public DateTime ReceivedDate { get; set; }

    }

    [KnownType(typeof(EdiInboundAndOutboundResult))]
    public class EdiInboundAndOutboundResult
    {
        public int SNo { get; set; }
        public string FlightDate { get; set; }
        public string FlightNo { get; set; }
        public string Carrier { get; set; }
        public string EventType { get; set; }
        public string MessageType { get; set; }
        public string AWBNo { get; set; }
        public string CitySNo { get; set; }
        public string CityCode { get; set; }
        public string Status { get; set; }
        public string Reason { get; set; }
        public string ActualMessage { get; set; }
        public string SenderID { get; set; }
        public string EventDate { get; set; }
        public string MessageVersion { get; set; }

        public string ProcessedAt { get; set; }
    }

    [KnownType(typeof(InvalidRecipient))]
    public class InvalidRecipient
    {
        public int SNo { get; set; }
        public string ActualFileContent { get; set; }
        public string FileName { get; set; }
        public string FileContent { get; set; }
        public string ReadAt { get; set; }
        public string Senderaddress { get; set; }
        public string ErrorMessage { get; set; }
    }    

    [KnownType(typeof(GetMessageTrail))]
    public class GetMessageTrail
    {
        [Required]
        public int SNo { get; set; }
        public string EDIBoundType { get; set; }
    }

    [KnownType(typeof(GetutcdateByAirport))]
    public class GetutcdateByAirport
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int AirportSNo { get; set; }
    }

    [KnownType(typeof(GetEdiInboundOutbound))]
    public class GetEdiInboundOutbound
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Carrier { get; set; }
        public string CityCode { get; set; }
        public string MessageTypeCheck { get; set; }
        public string MessageType { get; set; }
        public string FlightNo { get; set; }
        public string AWBNo { get; set; }
        public string Status { get; set; }
        public string EventType { get; set; }
        public string SenderID { get; set; }
        public string FlightDate { get; set; }
        public string MessageFormat { get; set; }
        public string Reportfilter { get; set; }
    }

    [KnownType(typeof(GetInvalidRecipient))]
    public class GetInvalidRecipient
    {
        public string FromDate { get; set; }
        public string ToDate { get; set; }
       
    }
}
