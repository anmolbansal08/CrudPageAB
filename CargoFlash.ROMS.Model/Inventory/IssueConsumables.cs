using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(IssueConsumables))]

    public class IssueConsumables
    {
        public string SNo { get; set; }
        public int IssuedToSNo { get; set; }
        public int ConsumableSNo { get; set; }
      
        public string CityCode { get; set; }
       // public string IssuedDate { get; set; }
        public DateTime? IssuedDate { get; set; }
        public string Name { get; set; }
        public string FlightDate { get; set; }
        public string FlightNo { get; set; }
        public int NoOfItem { get; set; }
        public int NoOfItems { get; set; }
        
        public string Item { get; set; }
        public bool IsBillable { get; set; }
               
        public string IssueableItem { get; set; }
        public string Text_IssuableItem { get; set; }
            
        public string IssuedTo { get; set; }
        public string Text_IssuedTo { get; set; }
        public string IssuedType { get; set; }

        public string IssueType { get; set; }
        public string IssuableItem { get; set; }

        public string IssuableItems { get; set; }
        public string Type { get; set; }





    }

    [KnownType(typeof(IssueConsumablesList))]
    public class IssueConsumablesList
    {          
        //public int SNo{get;set;}
        //public string IssueDate { get; set; }
        public int IssuedToSNo { get; set; }
        public int ConsumableSNo { get; set; }
        public int ConsumableStockTransSno { get; set; }
        public string IssueType { get; set; }
        public int NoOfItems { get; set; }
        public string ConsumableStockSno { get; set; }
        //public string FlightNo { get; set; }
       
      
        //public string ConsumablePrefix { get; set; }
        //public string ConsumableType { get; set; }
        //public string ConsumableNo { get; set; }
               
    }
}
