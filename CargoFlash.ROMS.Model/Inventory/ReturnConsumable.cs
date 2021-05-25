using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using System.ComponentModel;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(ReturnConsumable))]

    public class ReturnConsumable
    {
        public int SNo { get; set; }
        public string NoOFItem { get; set; }
        public string ReturnType { get; set; }
        public string ReturnFrom { get; set; }
        public string ReturnDate { get; set; }

        public string UpdatedBy { get; set; }


    }
     [KnownType(typeof(ReturnConsumableGrid))]
    public class ReturnConsumableGrid
    {
        public int SNo { get; set; }
        public string Item { get; set; }
        public string ReturnType { get; set; }
        public string ReturnFrom { get; set; }
        public string NoOFItem { get; set; }
       // public string ReturnDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string Type { get; set; }
   }

     [KnownType(typeof(ReturnConsumableTrans))]

     public class ReturnConsumableTrans
     {
         public int SNo { get; set; }
         public string NoOFItems { get; set; }
         public string ReturnType { get; set; }
         public string ReturnFrom { get; set; }
         public string ReturnDate { get; set; }
         public string Text_ReturnFrom { get; set; }
         public string ReturnableItem { get; set; }
         public string Text_ReturnableItem { get; set; }
         public string Text_ReturnType { get; set; }

     }



     [KnownType(typeof(ReturnConsumablesList))]
     public class ReturnConsumablesList
     {
         
         public int ReturnToSNo { get; set; }
         public int ConsumableSNo { get; set; }
         public int ConsumableStockTransSno { get; set; }
         public string ReturnType { get; set; }
         public int NoOfItems { get; set; }
         public int IssueConsumableSno { get; set; }
      

     }
}
