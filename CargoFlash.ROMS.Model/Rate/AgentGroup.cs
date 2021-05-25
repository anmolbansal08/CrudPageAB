using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Rate
{
    [KnownType(typeof(AgentGroup))]
    public class AgentGroup
    {
        public int SNo { get; set; }
        public string AgentGroupName { get; set; }
        public int GroupLevel { get; set; }
        public int CountrySNo { get; set; }
        public int CitySNo { get; set; }
        public String AccountSNo { get; set; }
        public Boolean IsActive { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        public String Text_GroupLevel { get; set; }
        public String Text_CountrySNo { get; set; }
        public String Text_CitySNo { get; set; }
        public String Text_AccountSNo { get; set; }
        
        public String Text_IsActive { get; set; }
        
        
       
     }
}

