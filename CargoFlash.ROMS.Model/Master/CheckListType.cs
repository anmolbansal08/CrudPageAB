using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.Master
{
    [KnownType(typeof(CheckListType))]
    public class CheckListType
    {
        public int SNo { get; set; }
        public string Name { get; set; }
        public int For { get; set; }
        public int SHC { get; set; }
        public string AirlineName { get; set; }
        public string AirlineSNo { get; set; }
        public string AirportName { get; set; }
        public int AirportSNo { get; set; }
        public string SPHCCode { get; set; }
        public int SPHCSNo { get; set; }
        public string SPHCGroupName { get; set; }
        public int SPHCGroupSNo { get; set; }
        public bool IsIATA { get; set; }
        public bool IsSAS { get; set; }
        public int EnteredBy { get; set; }
        public string ISIATA { get; set; }
        public string ISSAS { get; set; }
        public string Text_SPHCCode { get; set; }
        public string Text_AirportName { get; set; }
        public string Text_AirlineName { get; set; }
        public string Text_For { get; set; }
        public string Text_SHC { get; set; }
        public int CopyFrom { get; set; }
        public string Text_CopyFrom { get; set; }
        public string ChecklistVersion { get; set; }
        public string GeneralHeader { get; set; }
        public string GeneralFooter { get; set; }
        public string ColumnName1 { get; set; }
        public string ColumnName2 { get; set; }
        public string ColumnName3 { get; set; }
        public string Type { get; set; }
        public string Text_Type { get; set; }
        public string SPHCSubGroupSNo { get; set; }
        public string Text_SPHCSubGroupSNo { get; set; }
    }

    [KnownType(typeof(CheckListTypeAppend))]
    public class CheckListTypeAppend
    {
        public string SNo { get; set; }
        public string SectionHeader { get; set; }
        public string SrNo { get; set; }
        public string Name { get; set; }
        public bool HideHeader { get; set; }
        public decimal PRIORITY { get; set; }
        public string SectionFooter { get; set; }
        public Int16 CLTSNo { get; set; }
        public string HideHeaderTxt { get; set; }
        public string HideHeaderRead { get; set; }
    }


    [KnownType(typeof(CheckListDetail))]
    public class CheckListDetail
    {
        public string SNo { get; set; }
        public string HdnName { get; set; }
        public string SrNo { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int PRIORITY { get; set; }
        public bool Y { get; set; }
        public bool N { get; set; }
        public bool NA { get; set; }
        public bool Remarks { get; set; }
        public bool Column1 { get; set; }
        public bool Column2 { get; set; }
        public bool Column3 { get; set; }
        public string YTxt { get; set; }
        public string NTxt { get; set; }
        public string NATxt { get; set; }
        public string RemarksTxt { get; set; }
        public string Column1Txt { get; set; }
        public string Column2Txt { get; set; }
        public string Column3Txt { get; set; }
        public bool Document { get; set; }
        public bool Mandatory { get; set; }
        public string YRead { get; set; }
        public string NRead { get; set; }
        public string NARead { get; set; }
        public string RemarksRead { get; set; }
        public string Column1Read { get; set; }
        public string Column2Read { get; set; }
        public string Column3Read { get; set; }
        public string vDescription { get; set; }
    }
}
