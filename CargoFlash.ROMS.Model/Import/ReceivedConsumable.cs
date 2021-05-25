using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Import
{


    [KnownType(typeof(ReceivedConsumable))]
    public class ReceivedConsumable
    {
        public int SNo { get; set; }
        public Int64 DailyFlightSNo { get; set; }
        public String Airline { get; set; }
        public String FlightNo { get; set; }
        /*For MultCity */
        public string FlightOrg { get; set; }
        public string FlightDest { get; set; }
        /*For MultCity */
        public DateTime? FlightDate { get; set; }
        public String Item { get; set; }
        public String Origin { get; set; }
        public String Destination { get; set; }
        public int Quantity { get; set; }
        public string ProcessStatus { get; set; }
        public String ULDNo { get; set; }
        public Boolean Numbered { get; set; }
        public int ConsumableSno { get; set; }
        public string ReceivedType { get; set; }
    }

    [KnownType(typeof(ReceivedConsumableList))]
    public class ReceivedConsumableList
    {

     public int ConsumableSNo {get;set;}
     public string  ConsumablePrefix {get;set;}
     public string ConsumableType{get;set;}
     public int  ConsumableNo{get;set;}
     public string EquipmentNo{get;set;}
     public int Quantity{get;set;}
     public int IssuedType{get;set;}
     public int IssuedTo { get; set; }
            }
}
