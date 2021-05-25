using System;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Embargo))]
    public class Embargo
    {

        public Int32 SNo { get; set; }
        public string EmbargoName { get; set; }
        public int AirlineSNo { get; set; }
        public string AccountSNo { get; set; }        
        public Nullable<int> OriginCountrySNo { get; set; }
        public Nullable<int> DestinationCountrySNo { get; set; }
        public Nullable<int> OriginAirportSNo { get; set; }
        public Nullable<int> DestinationAirportSNo { get; set; }
        //public int OriginLocalZoneSNo { get; set; }
        //public int DestinationLocalZoneSNo { get; set; }
        public Nullable<int> OriginCitySNo { get; set; }
        public Nullable<int> DestinationCitySNo { get; set; }
        public Nullable<DateTime> ValidFrom { get; set; }
        public Nullable<DateTime> ValidTo { get; set; }
        public double MaxWeight { get; set; }
        public Nullable<int> FreightType { get; set; }
        public string Reason { get; set; }
        public bool IsActive { get; set; }
        ///Modified by VSingh on 07 Jan 2017 to add IsSoftEmbargo 
        public bool IsSoftEmbargo { get; set; }
        public string EmbargoType { get; set; }
        ///Modified by VSingh on 07 Jan 2017 to add IsSoftEmbargo 
        public string SHC { get; set; }
        public string Commodity { get; set; }
        public string Product { get; set; }
        public string Aircraft { get; set; }
        public string Flight { get; set; }
        //public bool IsExcludeSHC { get; set; }
        //public bool IsExcludeCommodity { get; set; }
        //public bool IsExcludeProduct { get; set; }
        //public bool IsExcludeAircraft { get; set; }
        //public bool IsExcludeFlight { get; set; }
        public bool ConfigType { get; set; }
        public Nullable<int> LimitOn { get; set; }
        public Nullable<int> Period { get; set; }
        public double AllowedWeight {  get; set; }
        public Nullable<int> ApplicableOn { get; set; }
        public string DaysOfOps { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        //public bool ExcludeCustomer { get; set; }
        //public string Customer { get; set; }


        public string Text_AirlineSNo { get; set; }
        public string Text_AccountSNo { get; set; }
        public string Text_Commodity { get; set; }
        //public string Text_Customer { get; set; }
        public string Text_SHC { get; set; }
        public string Text_Product { get; set; }
        public string Text_Aircraft { get; set; }
        public string Text_Flight { get; set; }
        public string Text_FreightType { get; set; }
        public string Active { get; set; }
        public string Origin { get; set; }
        public string Destination { get; set; }
        public string Text_OriginCountrySNo { get; set; }
        public string Text_DestinationCountrySNo { get; set; }
        public string Text_OriginCitySNo { get; set; }
        public string Text_DestinationCitySNo { get; set; }
        public string Text_OriginAirportSNo { get; set; }
        public string Text_DestinationAirportSNo { get; set; }
        //public string Text_IsExcludeSHC { get; set; }
        //public string Text_IsExcludeCommodity { get; set; }
        //public string Text_IsExcludeFlight { get; set; }
        //public string Text_IsExcludeProduct { get; set; }
        //public string Text_IsExcludeAircraft { get; set; }
        public string Text_ConfigType { get; set; }
        public string Text_LimitOn { get; set; }
        public string Text_Period { get; set; }
        public string Text_AllowedWeight { get; set; }
        public string Text_ApplicableOn { get; set; }
        public string Text_DaysOfOps { get; set; }
        public string ExcludeCommodity { get; set; }
        public string Text_ExcludeCommodity { get; set; }
        public string RefNo { get; set; }
        /*************************************/
        public string ExcludeSHC { get; set; }
        public string Text_ExcludeSHC { get; set; }
        public string ExcludeProduct { get; set; }
        public string Text_ExcludeProduct { get; set; }

        public string ExcludeAircraft { get; set; }
        public string Text_ExcludeAircraft { get; set; }
        public string ExcludeAccountSNo { get; set; }
        public string Text_ExcludeAccountSNo { get; set; }

        public string ExcludeFlight { get; set; }
        public string Text_ExcludeFlight { get; set; }
        public string AgentsAirline { get; set; }
        public string Text_AgentsAirline { get; set; }
        /*************************************/
        public string Text_CreatedBy { get; set; }
        public string Text_UpdatedBy { get; set; }
    }
}
