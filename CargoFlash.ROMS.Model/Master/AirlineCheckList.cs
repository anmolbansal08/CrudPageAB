using System.Runtime.Serialization;
using System;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(AirlineCheckList))]
    public class AirlineCheckList
    {
        public int SNo { get; set; }
        public String Code { get; set; }
        public String CheckListType { get; set; }
        public String AirlineName { get; set; }
        public String Text_Code { get; set; }
        public String Text_CheckListType { get; set; }
        public String Text_AirlineName { get; set; }
        public string SPHCGroup { get; set; }
        public string Text_SPHCGroup { get; set; }
        public String ISType { get; set; }
        public string ISGROUP { get; set; }
        public string GROUP { get; set; }
        public string name { get; set; }
    }

    [KnownType(typeof(AirlineCList))]
    public class AirlineCList
    {
        public int SNo { get; set; }
        public String AirlineSNo { get; set; }
        public String SPHCSNo { get; set; }
        public String CheckListType { get; set; }
        public string IsGroup { get; set; }
        public string SPHGroup { get; set; }
    }
}
