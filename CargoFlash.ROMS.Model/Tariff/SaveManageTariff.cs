

using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Tariff
{
    [KnownType(typeof(SaveManageTariff))]
    public class SaveManageTariff
    {
        public int SNo { get; set; }
        public string TariffFor { get; set; }
        public string TariffForValue { get; set; }
        public string Location { get; set; }
        public string Text_Location { get; set; }
        public string TariffName { get; set; }
        public string Text_TariffName { get; set; }
        public string TariffCode { get; set; }
        public string Text_TariffCode { get; set; }
        public string TariffBasis { get; set; }
        public string ShipmentType { get; set; }
        public string ShipmentTypeValue { get; set; }
        public string ApplicableFor { get; set; }
        public string ApplicableForValue { get; set; }
        public string ChargeTo { get; set; }
        public string ChargeToValue { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
       //public DateTime? ValidFrom_ { get; set; }
     // public DateTime? ValidTo_ { get; set; }

        public String FreightType { get; set; }
        public String Text_FreightType { get; set; }
        public String BuildUpType { get; set; }
        public String BuildUpTypeValue { get; set; }
        public string Minimum { get; set; }
        public string BasedOn { get; set; }
        public string BasedOnValue { get; set; }
        public string Mandatory { get; set; }
        public string ESS { get; set; }
        public bool IsMandatory { get; set; }
        public bool IsESS { get; set; }
        public string FreightPercentValue { get; set; }
        public string Remarks { get; set; }
        public string Currency { get; set; }
        public string Text_Currency { get; set; }
        public string Tax { get; set; }
        public string Text_Tax { get; set; }
        public string SPHC { get; set; }
        public string Text_SPHC { get; set; }
        public string Agent { get; set; }
        public string Text_Agent { get; set; }
        public string Airline { get; set; }
        public string Text_Airline { get; set; }
        public string strData { get; set; }
        public string strRevenueData { get; set; }
        public string ActionType { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public string Ratetype { get; set; }
        public string Chargetype { get; set; }
        public string Text_Inventory { get; set; }
        public string Inventory { get; set; }
        public string Process { get; set; }
        public string Text_Process { get; set; }
        public string SubProcess { get; set; }
        public string Text_SubProcess { get; set; }
        public string IsFlatRate { get; set; }
        public string Text_FlatRate { get; set; }
        public Boolean IsSurcharge { get; set; }
        public string Text_IsSurcharge { get; set; }
        public string Days { get; set; }
        public string MON { get; set; }
        public string TUE { get; set; }
        public string WED { get; set; }
        public string THU { get; set; }
        public string FRI { get; set; }
        public string SAT { get; set; }
        public string SUN { get; set; }
        public string HallDays { get; set; }

        public Boolean IsMON { get; set; }
        public Boolean IsTUE { get; set; }
        public Boolean IsWED { get; set; }
        public Boolean IsTHU { get; set; }
        public Boolean IsFRI { get; set; }
        public Boolean IsSAT { get; set; }
        public Boolean IsSUN { get; set; }

        public string Value { get; set; }

        public string SHCGroup { get; set; }
        public string Text_SHCGroup { get; set; }
        public string LocationMulti { get; set; }
        public string Text_LocationMulti { get; set; }
        public string TruckDestination { get; set; }
        public string Text_TruckDestination { get; set; }

        public string TariffIdName { get; set; }

        public string Warehousefacility { get; set; }
        public string Text_Warehousefacility { get; set; }
        public string AccountTypeId { get; set; }
        public string Text_AccountTypeId { get; set; }
        public string SlideScale { get; set; }
        public Boolean IsSlideScale { get; set; }
        public string EditableUnit { get; set; }
        public Boolean IsEditableUnit { get; set; }

        public string Domestic { get; set; }
        public string IsDomestic { get; set; }
        public string RushHandling { get; set; }

        public Boolean IsRushHandling { get; set; }
        public string WHLocationTypeSNo { get; set; }
        public string Text_WHLocationTypeSNo { get; set; }
        public string DemurrageCast { get; set; }
        public string TotalCost { get; set; }
        public string ULDType { get; set; }
        public string Text_ULDType { get; set; }
        public string Accounttype { get; set; }
        public string Text_Accounttype { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }

    }

  
}
