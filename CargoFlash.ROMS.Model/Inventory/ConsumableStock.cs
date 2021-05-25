using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Inventory
{
    [KnownType(typeof(ConsumableStock))]

    public class ConsumableStock
    {
        public string SNo { get; set; }
        public int ConsumableSNo { get; set; }
        public int NoOfItems { get; set; }
        public string UpdatedOn { get; set; }
        public string CityCode { get; set; }
        public string Item { get; set; }
        public string Type { get; set; }
        
        public int CStockSNo { get; set; }
        public int AddStock { get; set; }
        public string Numbered{get;set;}
        public string ConsumablesName{get;set;}
        public string IsActive { get; set; }
        public int CosnumableStockTransSno { get; set; }
        public int Owner { get; set; }
        public string Text_Owner { get; set; }

        public int OwnerName { get; set; }
        public string Text_OwnerName { get; set; }
        public string TareWeight { get; set; }

        public string AirportName { get; set; }
    }

    [KnownType(typeof(ConsumableStockGrid))]
    public class ConsumableStockGrid
    {

        public string SNo { get; set; }
        public string ConsumablePrefix { get; set; }
         public string ConsumableType { get; set; }
        public string ConsumableNo { get; set; }
         public string IsActive { get; set; }
     

    }
}
