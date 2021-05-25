using System.Runtime.Serialization;
using System;
using System.Collections.Generic;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(UldStack))]
    public class UldStack
    {
        public string ULDSNo { get; set; }
        //public string ConsumableSNo { get; set; }
        public int UldStackSNo { get; set; }
        public string BaseUldNo { get; set; }
        public int CountOfStack { get; set; }
        public decimal ScaleWeight { get; set; }
        public string Airline { get; set; }
        public string FlightNo { get; set; }
        //  public string FlightDate { get; set; }
        public string FlightDate { get; set; }
        public string Status { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string StackUld { get; set; }
        public string Text_StackUld { get; set; }
        public string ActionType { get; set; }
        public string AirlineSNo { get; set; }
        public string Route { get; set; }

        public string ChoosenAirline { get; set; }
        public string Text_ChoosenAirline { get; set; }

        public string OffPoint { get; set; }
        public string Text_OffPoint { get; set; }

    }
    [KnownType(typeof(UldStackTareWeight))]
    public class UldStackTareWeight
    {
        public string UldNo { get; set; }
        public decimal TareWeight { get; set; }
        public string Owner { get; set; }

    }
    [KnownType(typeof(Consumables))]
    public class Consumables
    {
        //public int SNo { get; set; }

        public string StockType { get; set; }

        public string ConsumableType { get; set; }

        public string UnitQty { get; set; }

        public string HdnConsumableType { get; set; }


        // public string ULDStackConsumablesSNo { get; set; }
    }
    [KnownType(typeof(UldStackCombined))]
    public class UldStackCombined
    {
        public List<UldStack> uldstack { get; set; }
        public List<UldStackTareWeight> uldStackTareWeight { get; set; }
        public List<Consumables> consumables { get; set; }
    }

}
