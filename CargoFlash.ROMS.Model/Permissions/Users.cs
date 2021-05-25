using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(Users))]
    public class Users
    {
        //public Int32 SNo { get; set; }
        //public string FirstName { get; set; }
        //public string LastName { get; set; }
        //public string UserName { get; set; }
        //public string EMailID { get; set; }
        //public string Password { get; set; }
        //public string Mobile { get; set; }
        //public string CityCode { get; set; }
        //public string Address { get; set; }
        //public bool IsActive { get; set; }
        //public Int64 CreatedBy { get; set; }
        //public Nullable<DateTime> CreatedOn { get; set; }
        //public Int64 UpdatedBy { get; set; }
        //public Nullable<DateTime> UpdatedOn { get; set; }
        //public string Text_CityCode { get; set; }
        //public string Active { get; set; }
        //public string CreatedUser { get; set; }
        //public string UpdatedUser { get; set; }
        //public Int32 CustomerSNo { get; set; }
        //public Int32 GroupSNo { get; set; }
        //public string Text_GroupSNo { get; set; }
        //public string UserType { get; set; }
        //public string Name { get; set; }
        //public string Block { get; set; }

        public Int32 SNo { get; set; }
        public string AllowCitySNo { get; set; }
        public string Text_AllowCitySNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public string EmployeeID { get; set; }
      // public Int32 EmployeeID { get; set; }

        public string UserName { get; set; }
        public string DCity { get; set; }
        public string EMailID { get; set; }
        //public string Password { get; set; }
        public string GroupEMailID { get; set; }
        public string MobileCountryCode { get; set; }
        public string Text_MobileCountryCode { get; set; }
        public string Mobile { get; set; }
        public string DAirportSNo { get; set; }
        public string DWareHouseMasterSNo { get; set; }
        public string Text_WareHouseMasterSNo { get; set; }
        public string MultipleCity { get; set; }
        public string CityCode { get; set; }
        public Int32 CitySNo { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Text_CitySNo { get; set; }
        public string CityName { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public string Text_CityCode { get; set; }
        public string Active { get; set; }
        public string CreatedUser { get; set; }
        public string UpdatedUser { get; set; }
        public Int32 GroupSNo { get; set; }
        public Int32 AirportSNo { get; set; }
        public string Agent { get; set; }
        public string Airline { get; set; }
        
        public string Text_AirportSNo { get; set; }
        public Int32 WareHouseMasterSNo { get; set; }
        public string Text_GroupSNo { get; set; }
        public string UserType { get; set; }
        public string Name { get; set; }
        public string TempPassword { get; set; }
        public bool IsCityChangeAllowed { get; set; }
        public string CityChangeAllowed { get; set; }
        public string Text_AccessibleCitySNo { get; set; }
        public string AccessibleCitySNo { get; set; }
        public Int32 ForwarderSno { get; set; }
        public string Text_ForwarderSno { get; set; }
        public Int32 TruckerSno { get; set; }
        public string Text_TruckerSno { get; set; }
        public string AllowCity { get; set; }
        public Int32 LanguaugeSNo { get; set; }
        public string Text_LanguaugeSNo { get; set; }
        public bool OtherAirlineAccess { get; set; }
        public string OtherAirline { get; set; }
        public bool IsBlock { get; set; }
        public string Blocked { get; set; }
        public string UserTypeSNo { get; set; }
        public Int32 UserTypeValue { get; set; }
        public string Text_UserTypeValue { get; set; }
        public Int32 Designation { get; set; }
        public string Text_Designation { get; set; }
        public Int32 Terminal { get; set; }
        public string Text_Terminal { get; set; }

        public string Text_UserTypeSNo { get; set; }
        public string Text_EmployeeID { get; set; }
        public string Text_Airline { get; set; }
        public string Text_Agent { get; set; }
        public string Text_OtherAirline { get; set; }
        public string UserTypeText { get; set; }
        public string LBLOtherAirlineAccess { get; set; }

        //added by Lk Pradhan
       
       
        //added by Pankaj Khanna
        public int OfficeSNo { get; set; }
        public string Text_OfficeSNo { get; set; }

        public int NameSNo { get; set; }
        
        public string Text_NameSNo { get; set; }

        public Nullable<DateTime> UserExpairyDate { get; set; }
        // added by arman ali
        public string AirlineName { get; set; }
        public string Text_UserExpairyDate { get; set; }
        public string Text_CompanyName { get; set; }

        public string LastResetBy { get; set; }
        //added by devendra
        public string Text_Products { get; set; }

        public bool isProductAccess { get; set; }

       // public string Text_Products { get; set; }
        public string Productsno { get; set; }
        public string Otherproductaccess { get; set; }
        public string Remarks { get; set; }
        public string UserCreatedby { get; set; }
        public string IsAllowedUserCreation { get; set; }
        public string Text_IsAllowedUserCreation { get; set; }
        public string UserCreatedOn { get; set; }
        public string CreatedOntime { get; set; }
        public bool IsSpecialInvoice { get; set; }
        public string SpecialInvoice { get; set; }
        public string Text_ShowAsAgreedonAWBPrint { get; set; }
        public bool ShowAsAgreedonAWBPrint { get; set; }
      
        //Added By NEHAL
        public string Text_OverrideAsAgreedonAWBPrint { get; set; }
        public bool OverrideAsAgreedonAWBPrint { get; set; }
        public string Text_ViewRatewhileBooking { get; set; }
        public bool ViewRatewhileBooking { get; set; }
        public string Text_EnableRateTabInReservation { get; set; }
        public bool EnableRateTabInReservation { get; set; }
        public string Text_ShowBalanceCreditLimit { get; set; }
        public bool ShowBalanceCreditLimit { get; set; }

        //added by ankit kumar
        public string Agent_Master_Branch { get; set; }
        public string AgentName { get; set; }
    }

    [KnownType(typeof(NewUsers))]
    public class NewUsers
    {
        public Int32 SNo { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmployeeID { get; set; }
        public string UserName { get; set; }
        public string EMailID { get; set; }
        //public string Password { get; set; }
        public string GroupEMailID { get; set; }
        public string MobileCountryCode { get; set; }
        public string Mobile { get; set; }
        public Int32 CitySNo { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public string UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
        public Int32 GroupSNo { get; set; }
        public Int32 AirportSNo { get; set; }
        public string Agent { get; set; }
        public string Airline { get; set; }
        public bool IsCityChangeAllowed { get; set; }
        public string AllowCity { get; set; }
        public bool OtherAirlineAccess { get; set; }
        public string OtherAirline { get; set; }
        public bool IsBlock { get; set; }
        public string UserTypeSNo { get; set; }
        public Int32 UserTypeValue { get; set; }
        public Int32 Designation { get; set; }

        public Int32 Terminal { get; set; }
        public int OfficeSNo { get; set; }
        public int NameSNo { get; set; }
        public string Name { get; set; }
    }

    //[KnownType(typeof(Users))]
    //public class Users
    //{
    //    #region Public Properties
    //    public Int32 MSNo { get; set; }
    //    public Int32 SNo { get; set; }
    //    public string AllowCitySNo { get; set; }
    //    public string Text_AllowCitySNo { get; set; }
    //    public string FirstName { get; set; }
    //    public string LastName { get; set; }
    //    public string UserName { get; set; }
    //    public string DCity { get; set; }
    //    public string EMailID { get; set; }
    //    public string Password { get; set; }
    //    public string MobileCountryCode { get; set; }
    //    public string Text_MobileCountryCode { get; set; }
    //    public string Mobile { get; set; }
    //    public string DAirportSNo { get; set; }
    //    public string DWareHouseMasterSNo { get; set; }
    //    public string Text_WareHouseMasterSNo { get; set; }
    //    public string MultipleCity { get; set; }
    //    public string CityCode { get; set; }
    //    public Int32 CitySNo { get; set; }
    //    public string CompanyName { get; set; }
    //    public string Address { get; set; }
    //    public string Text_CitySNo { get; set; }
    //    public string CityName { get; set; }
    //    public bool IsActive { get; set; }
    //    public Int64 CreatedBy { get; set; }
    //    public Nullable<DateTime> CreatedOn { get; set; }
    //    public Int64 UpdatedBy { get; set; }
    //    public Nullable<DateTime> UpdatedOn { get; set; }
    //    public string Text_CityCode { get; set; }
    //    public string Active { get; set; }
    //    public string CreatedUser { get; set; }
    //    public string UpdatedUser { get; set; }
    //    public Int32 GroupSNo { get; set; }
    //    public Int32 AirportSNo { get; set; }
    //    public string Text_AirportSNo { get; set; }
    //    public Int32 WareHouseMasterSNo { get; set; }
    //    public string Text_GroupSNo { get; set; }
    //    public string UserType { get; set; }
    //    public string Name { get; set; }
    //    public string TempPassword { get; set; }
    //    public bool IsCityChangeAllowed { get; set; }
    //    public string CityChangeAllowed { get; set; }
    //    public string Text_AccessibleCitySNo { get; set; }
    //    public string AccessibleCitySNo { get; set; }
    //    public Int32 ForwarderSno { get; set; }
    //    public string Text_ForwarderSno { get; set; }
    //    public Int32 TruckerSno { get; set; }
    //    public string Text_TruckerSno { get; set; }
    //    public string AllowCity { get; set; }
    //    public Int32 LanguaugeSNo { get; set; }
    //    public string Text_LanguaugeSNo { get; set; }
    //    public bool IsBlock { get; set; }
    //    public string Blocked { get; set; }
    //    #endregion
    //}

    [KnownType(typeof(UserCollection))]
    public class UserCollection
    {
        #region Public Properties
        public List<Users> userstype { get; set; }
        //public List<UserCityTrans> usercitytranstype { get; set; }
        #endregion
    }
}
