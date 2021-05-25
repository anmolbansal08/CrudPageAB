using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;

namespace CargoFlash.Cargo.Model
{
    public class UserLogin
    {
        public UserLogin()
        { }
        public UserLogin(UserLogin userLogin)
        {
            this.UserSNo = userLogin.UserSNo;
            this.UserRole = userLogin.UserRole;
            this.UserName = userLogin.UserName;
            this.FirstName = userLogin.FirstName;
            this.LastName = userLogin.LastName;
            this.Password = userLogin.Password;
            this.CityCode = userLogin.CityCode;
            this.CityName = userLogin.CityName;
            this.CurrencyCode = userLogin.CurrencyCode;
            this.MenuDetails = userLogin.MenuDetails;
            this.GroupSNo = userLogin.GroupSNo;
            this.OfficeSNo = userLogin.OfficeSNo;
            this.OfficeName = userLogin.OfficeName;
            this.AirportSNo = userLogin.AirportSNo;
            this.AirportCode = userLogin.AirportCode;
            this.AirportName = userLogin.AirportName;
            this.AccountSNo = userLogin.AccountSNo;
            this.CitySNo = userLogin.CitySNo;
            this.NewTerminalSNo = userLogin.NewTerminalSNo;
            this.NewTerminalName = userLogin.NewTerminalName;
            this.TerminalSNo = userLogin.TerminalSNo;
            this.DefaultTerminalSNo = userLogin.DefaultTerminalSNo;
            this.IsLogin = userLogin.IsLogin;
            this.CountrySNo = userLogin.CountrySNo;
            this.CurrencySNo = userLogin.CurrencySNo;
            this.PageRights = userLogin.PageRights;
            this.ProcessRights = userLogin.ProcessRights;
            this.SpecialRights = userLogin.SpecialRights;
            this.SysSetting = userLogin.SysSetting;
            this.WarehouseName = userLogin.WarehouseName;
            this.WarehouseSNo = userLogin.WarehouseSNo;
            this.GroupName = userLogin.GroupName;
            this.AgentName = userLogin.AgentName;
            this.AgentSNo = userLogin.AgentSNo;
            this.CurrencyName = userLogin.CurrencyName;
            this.AirlineSNo = userLogin.AirlineSNo;
            this.AirlineName = userLogin.AirlineName;
            this.AirlineCarrierCode = userLogin.AirlineCarrierCode;
            this.VAccountNo = userLogin.VAccountNo;
            this.Signature = userLogin.Signature;
            this.UserTypeName = userLogin.UserTypeName;
            this.UserType = userLogin.UserType;
            this.AllowedUserCreation = userLogin.AllowedUserCreation;
            this.MasterOffice = userLogin.MasterOffice;
            this.CountryName = userLogin.CountryName;
            this.CountryCode = userLogin.CountryCode;
        }
        public int UserSNo;
        public string UserRole;
        public string UserName;
        public string FirstName;
        public string LastName;
        public string Password;
        public string CityCode;
        public string CityName;
        public string CurrencyCode;
        public string MenuDetails;
        public int GroupSNo;
        public int OfficeSNo;
        public string OfficeName;
        public int AirportSNo;
        public string AirportCode;
        public string AirportName;
        public int AccountSNo;
        public int CitySNo;
        public int NewTerminalSNo;
        public string NewTerminalName;
        public int TerminalSNo;
        public int DefaultTerminalSNo;
        public bool IsLogin;
        public int CountrySNo;
        public string CountryName;
        public string CountryCode;
        public int CurrencySNo;
        public string WarehouseSNo { get; set; }
        public string WarehouseName { get; set; }
        public List<PageRights> PageRights { get; set; }
        public List<ProcessRights> ProcessRights { get; set; }
        public Dictionary<string, bool> SpecialRights { get; set; }
        public Dictionary<string,string> SysSetting { get; set; }
        public string GroupName { get; set; }
        public string AgentName { get; set; }
        public int AgentSNo { get; set; }
        public string CurrencyName { get; set; }
        public bool IsShowAllData { get; set; } 
        public int AirlineSNo { get; set; } 
        public string AirlineName { get; set; }
        public string AirlineCarrierCode { get; set; }
        public string VAccountNo { get; set; }
        public string Signature { get; set; }
        public string UserTypeName { get; set; }
        public string UserType { get; set; }
       public string AllowedUserCreation { get; set;}
        public string MasterOffice { get; set; }
    }

    public class PageRights
    {
        public string Apps { get; set; }
        public string PageRight { get; set; }
        public string PageName { get; set; }
        public string Hyperlink { get; set; }
    }

    public class ProcessRights
    {
        public string SubProcessSNo { get; set; }
        public string SubProcessName { get; set; }
        public bool IsView { get; set; }
        public bool IsEdit { get; set; }
        public bool IsBlocked { get; set; }
    }

    public class SpecialRights
    {
        public string PageSNo { get; set; }
        public string Code { get; set; }
        public bool IsEnabled { get; set; }
    }
    public class CaptchaResponse
    {
        public string success { get; set; }
    }

}
