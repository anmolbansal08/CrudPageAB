using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.ULD
{
    [KnownType(typeof(ULDRepair))]
    public class ULDRepair
    {
        public Int32 ULDRepairSNo { get; set; }
        public string ULDNo { get; set; }
        public string ULDType { get; set; }
        public string Maintenancetype { get; set; }
        public string Vendor { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string RepairOrScrap { get; set; }
        public string IsQuoted { get; set; }
        public string IsApproved { get; set; }
        public string IsRepaired { get; set; }
        public string ProcessStatus { get; set; }
        public string TypeOfMaintenanceId { get; set; }
        public string VendorId { get; set; }
        public string MUldType { get; set; }
        public string IsinvoiceRcvd { get; set; }
        public string TypeOfAdditionalMaintenance { get; set; }
    }
    [KnownType(typeof(ULDRepairItem))]
    public class ULDRepairItem
    {
        public Int32 SNo { get; set; }
        public string Description { get; set; }
        public string Condition { get; set; }
        public string Remarks { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public string ULDRepairMaterialSNo { get; set; }
        public string ULDRepairSNo { get; set; }
        public string Qty { get; set; }
        public string MaterialPrice { get; set; }
        public string TotalCost { get; set; }
        public string IsApproval { get; set; }
        public string AlertEmail { get; set; }
    }
    [KnownType(typeof(ULDRepairMainCostItem))]
    public class ULDRepairMainCostItem
    {
        public string AULDRepairMaterialSNo { get; set; }
        //public string ULDRepairSNo { get; set; }
        public string AIsApproval { get; set; }
    }
    [KnownType(typeof(ULDRepairConditionModel))]
    public class ULDRepairConditionModel
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string ULDNo { get; set; }
        public string CreatedOn { get; set; }      

    }
    [KnownType(typeof(GetULDRepairGridData))]
    public class GetULDRepairGridData
    {       
        public string ULDNo { get; set; }
        public string CreatedOn { get; set; }      

    }
    /*-------------Add By Pankaj Kumar Ishwar--------------*/
    [KnownType(typeof(ULDRepairMainCost))]
    public class ULDRepairMainCost
    {
        public Int32 SNo { get; set; }
        public string MainCategory { get; set; }
        public string MaintenanceType { get; set; }
        public string ManhourCost { get; set; }
        public string TotalCost { get; set; }
        public string IsApproval { get; set; }
    }
}
