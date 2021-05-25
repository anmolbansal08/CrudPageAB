using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Report
{
    [KnownType(typeof(WarehouseAccountReport))]
    public class WarehouseAccountReport
    {
        public int SNo { get; set; }
        public string WarehouseLocation { get; set; }
        public string IssuedDate { get; set; }
        public string ArrivalDate { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string FlightNo { get; set; }
        public string AirlineCode { get; set; }
        public string Operator { get; set; }
        public string Customer { get; set; }
        public string NPWP { get; set; }
        public string Address { get; set; }
        public string Commodity { get; set; }
        public string DeliveryBillNo { get; set; }
        public string AWBNo { get; set; }
        public string BTBNo { get; set; }
        public string HouseAWBNo { get; set; }
        public string DeliveryOrderNo { get; set; }
        public string Days { get; set; }
        public string NumberofPieces { get; set; }
        public string GrossWeight { get; set; }
        public string ChargeableWeight { get; set; }
        public string WarehouseSharingAngkasaPura { get; set; }
        public string WarehouseSharingGaruda { get; set; }
        public string WarehouseSharingGapura { get; set; }
        public string AdministrationFee { get; set; }
        public string PJPK2UFee { get; set; }
        public string KadeFee { get; set; }
        public string OtherRevenuefromKadeFee { get; set; }
        public string RushHandlingServices { get; set; }
        public string Vatout { get; set; }
        public string TotalCharges { get; set; }
        public string CommissiononCreditCard { get; set; }
        public string TotalPayment { get; set; }
        public string Difference { get; set; }
        public string PaymentType { get; set; }
        public string BankProvider { get; set; }
        public string CardType { get; set; }
        public string VirtualAccountNumber { get; set; }
        public string CustomerCode { get; set; }
        public string Remarks { get; set; }
    }
}
