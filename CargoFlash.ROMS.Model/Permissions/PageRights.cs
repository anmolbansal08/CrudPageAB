using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;

namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(PageRights))]
    public class PageRights
    {
        public Int32 MSNo { get; set; }
        public Int32 SNo { get; set; }
        public Int32 PageSNo { get; set; }
        public string PageName { get; set; }
        public Int32 RightsSNo { get; set; }
        public bool Create { get; set; }
        public bool Edit { get; set; }
        public bool Delete { get; set; }
        public bool Read { get; set; }
        public bool GroupCreate { get; set; }
        public bool GroupEdit { get; set; }
        public bool GroupDelete { get; set; }
        public bool GroupRead { get; set; }
        public int SNo1 { get; set; }
        public int SNo2 { get; set; }
        public int SNo3 { get; set; }
        public int SNo4 { get; set; }

        public bool IsSubProcess { get; set; }
        public bool IsGroupSubProcess { get; set; }
        public bool IsStatusAccessibility { get; set; }
        public string Hyperlink { get; set; }
        public Nullable<Int32> MenuSNo { get; set; }
        public int CreatedBy { get; set; }
        public Nullable<DateTime> CreatedOn { get; set; }
        public int UpdatedBy { get; set; }
        public Nullable<DateTime> UpdatedOn { get; set; }
    }

    [KnownType(typeof(CustomizedGrid))]
    public class CustomizedGrid
    {
        public static int GroupSNo { get; set; }
        public static int UserSNo { get; set; }
        public static int PageSNo { get; set; }
        public static string GroupName { get; set; }
        public static string UserName { get; set; }
        public static string lRecordID { get; set; }
        public static string UserGroupPage { get; set; }
    }
}
