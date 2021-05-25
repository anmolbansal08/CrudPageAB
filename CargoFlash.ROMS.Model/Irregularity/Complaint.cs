using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;
using CargoFlash.SoftwareFactory.Data;

namespace CargoFlash.Cargo.Model.Irregularity
{

    [KnownType(typeof(ComplaintGrid))]
    public class ComplaintGrid
    {
        public int ComplaintSNo { get; set; }
        public int ComplainSourceSNo { get; set; }
        public int ComplaintStatusSNo { get; set; }
        public string ComplaintStatusName { get; set; }
        public int CitySNo { get; set; }
        public string ComplainSourceName { get; set; }
        public string Source { get; set; }
        public DateTime RaisedDate { get; set; }
        public string AWBNo { get; set; }
        public string AccountNo { get; set; }
        public string ComplaintName { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public string EmailId { get; set; }
        public string Text_CitySNo { get; set; }
        public string Text_ComplaintStatusSNo { get; set; }
        public string Description { get; set; }
        public string Expectation { get; set; }
        public string ComplaintNo { get; set; }
        public string LastAction { get; set; }
        public string Claim { get; set; }
        public string Status { get; set; }
        public bool PreClaim { get; set; }
        public bool IsClosed { get; set; }
        public bool IsAssign { get; set; }
        public bool IsAction { get; set; }
        public bool IsEdox { get; set; }
        public bool IsEdit { get; set; }
    }

    [KnownType(typeof(ComplaintNew))]
    public class ComplaintNew
    {
        public int ComplaintSNo { get; set; }
        public int ComplaintSourceSNo { get; set; }
        public string Text_ComplaintSourceSNo { get; set; }
        public int ComplaintStatusSNo { get; set; }
        public string Text_ComplaintStatusSNo { get; set; }
        public int CitySNo { get; set; }
        public string RaisedDate { get; set; }
        public int AWBNo { get; set; }
        public string Type { get; set; }
        public string Text_AWBNo { get; set; }
        public string AccountNo { get; set; }
        public string Name { get; set; }
        public string ContactNo { get; set; }
        public string Address { get; set; }
        public string EmailId { get; set; }
        public string Text_CitySNo { get; set; }
        public string Description { get; set; }
        public string Expectation { get; set; }
        public string ComplaintNo { get; set; }
        public string LastAction { get; set; }
        public string Claim { get; set; }
        public string Status { get; set; }
        public bool PreliminaryClaim { get; set; }
        public int ComplaintIrregularityList { get; set; }
        public string Text_ComplaintIrregularityList { get; set; }
        public string ClosedDate { get; set; }
        public int LoginCitySno { get; set; }
        public string ComplaintImportancy { get; set; }
        public string Text_ComplaintImportancy { get; set; }
        public int AccountSNo { get; set; }

    }

    [KnownType(typeof(ComplaintAction))]
    public class ComplaintAction
    {
        public int ComplaintSNo { get; set; }
        public int ComplaintActionSNo { get; set; }
        public string ActionDate { get; set; }
        public string ActionDescription { get; set; }
        public string ComplaintActionStatusSNo { get; set; }
        public bool IsNotify { get; set; }
        public string EmailId { get; set; }
        public string Text_ComplaintActionSNo { get; set; }

    }
    [KnownType(typeof(ComplaintAssign))]
    public class ComplaintAssign
    {
        public int ComplaintSNo { get; set; }
        public string UserID { get; set; }
        public string AssignDate { get; set; }
        public string AssignMessage { get; set; }
        public string Text_UserID { get; set; }
        public string AssignCitySNo { get; set; }
        public string Text_AssignCitySNo { get; set; }
    }

    [KnownType(typeof(ComplaintEDoxDetail))]
    public class ComplaintEDoxDetail
    {
        [Order(1)]
        public int EDoxdocumenttypeSNo { get; set; }
        [Order(2)]
        public string DocName { get; set; }
        [Order(3)]
        public string AltDocName { get; set; }
        [Order(4)]
        public string ReferenceNo { get; set; }
        [Order(5)]
        public string Remarks { get; set; }
    }

    [KnownType(typeof(ComplainWhereConditionModel))]
    public class ComplainWhereConditionModel
    {
        public string processName { get; set; }
        public string moduleName { get; set; }
        public string appName { get; set; }
        public string searchComplainNo { get; set; }
        public string searchComplainStatus { get; set; }
        public string searchAWBNo { get; set; }
        public string SearchClaim { get; set; }
        public string LoggedInCity { get; set; } 
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string RecID { get; set; }

    }
[KnownType(typeof(GetComplaintGridData))]
    public class GetComplaintGridData
    {      
        public string searchComplainNo { get; set; }
        public string searchComplainStatus { get; set; }
        public string searchAWBNo { get; set; }
        public string SearchClaim { get; set; }
        public string LoggedInCity { get; set; } 
        public string searchFromDate { get; set; }
        public string searchToDate { get; set; }
        public string RecID { get; set; }

    }
}
