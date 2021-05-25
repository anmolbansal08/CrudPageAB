using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Runtime.Serialization;


namespace CargoFlash.Cargo.Model.Permissions
{
    [KnownType(typeof(ProcessDependency))]
    public class ProcessDependency
    {
        public Int32 SNo { get; set; }
        public string  AirlineName { get; set; }
        public string Text_AirlineSNo { get; set; }
        public string CityName { get; set; }
        public string Text_CitySNo { get; set; }
        public string AirportName { get; set; }
        public string Text_AirportSNo { get; set; }
        public string TerminalName { get; set; }
        public string Text_TerminalSNo { get; set; }
        public Int32 TransactionType { get; set; }
        public string Text_TransactionType { get; set; }
        public string  TransactionTypeName { get;set; }

        public Int32 AirlineSNo { get; set; }
        public Int32 CitySNo { get; set; }
        public Int32 AirportSNo { get; set; }
        public Int32 TerminalSNo { get; set; }

        public Int32 hdnEditSno { get; set; }
    }


    [KnownType(typeof(ProcessDependencyCollection))]
    public class ProcessDependencyCollection
    {
        #region Public Properties
        public List<ProcessDependency> processdependencyList { get; set; }
        //public List<UserCityTrans> usercitytranstype { get; set; }
        #endregion
    }

    [KnownType(typeof(ProcessDependencyGridAppendGrid))]
    public class ProcessDependencyGridAppendGrid
    {
        //public int  RowNo { get; set; }
        public Nullable<int> SNo { get; set; }
       
        public string SubProcessName { get; set; }
        public string HdnSubProcessName { get; set; }
        public string AWBStatusType { get; set; }
        public string HdnAWBStatusType { get; set; }
        public string DependSubProcessName { get; set; }
        public string HdnDependSubProcessName { get; set; }
        public string ReturnMessage { get; set; }
     
    }

    [KnownType(typeof(ProcessDependencyTransSave))]
    public class ProcessDependencyTransSave
    {
        public int SNo { get; set; }
        public Int32 AirlineSNo { get; set; }
        public Int32 CitySNo { get; set; }
        public Int32 AirportSNo { get; set; }
        public Int32 TerminalSNo { get; set; }
        public Int16  TransactionType { get; set; }
        public Int32 hdnEditSno { get; set; }
        public List<ProcessDependencyGridAppendGrid> ProcessDependencyTransData { get; set; }
        
    }


}
