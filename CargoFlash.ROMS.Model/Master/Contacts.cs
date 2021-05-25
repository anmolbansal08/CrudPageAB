using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(Contacts))]
    public class Contacts
    {
        public Int32 SNo { get; set; }
        public int ContactsType { get; set; }
        public string ContactsTypeName { get; set; }
        public string ContactsTypeDis { get; set; }
        public Int32 ContactTypeSNo { get; set; }
        public String Text_ContactTypeSNo { get; set; }
        public string Name { get; set; }
        public Int32 DepartmentSNo { get; set; }
        public String Text_DepartmentSNo { get; set; }
        public string DepartmentName { get; set; }
        public string PersonName { get; set; }
        public string Email { get; set; }
        public bool IsPrimary { get; set; }
        public string Primary { get; set; }
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string CountryCode { get; set; }
        public string Text_CountryCode { get; set; }
        public Int32 CitySNo { get; set; }
        public string Text_CitySNo { get; set; }
        public string CityCode { get; set; }
        public string PostalCode { get; set; }
        public bool IsActive { get; set; }
        public string Active { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
      
   }
}
