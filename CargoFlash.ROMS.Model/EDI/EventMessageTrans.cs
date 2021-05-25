using System.Runtime.Serialization;
using System;
using System.Collections.Generic;

namespace CargoFlash.Cargo.Model.EDI
{
    [KnownType(typeof(EventMessageTrans))]
    public class EventMessageTrans
    {
        public int SNo { get; set; }
        public string AirlineName { get; set; }
        public string Text_AirlineName { get; set; }
        public string SubProcess { get; set; }
        public string MessageType { get; set; }
        public string CreatedBy { get; set; }
        public string UpdatedBy { get; set; }
        
    }

    //[KnownType(typeof(EventMessageGrid))]
    //public class EventMessageGrid
    //{
    //    public string HdnSubProcessName { get; set; }
    //    public string HdnMessageType { get; set; }
    //}

    [KnownType(typeof(EventMessageGridAppendGrid))]
    public class EventMessageGridAppendGrid
    {
        //public int  RowNo { get; set; }
        public Nullable<int> SNo { get; set; }
        public string EventName { get; set; }
        public string SubProcessName { get; set; }
        public string HdnSubProcessName { get; set; }
        public string MessageType { get; set; }
        public string HdnMessageType { get; set; }
        public string Origin { get; set; }
        public string HdnOrigin { get; set; }
        public string Destination { get; set; }
        public string HdnDestination { get; set; }
        public string MessageExecutionType { get; set; }
    }

    [KnownType(typeof(EventMessageTransSave))]
    public class EventMessageTransSave
    {
        public int SNo { get; set; }
        public string AirlineSNo { get; set; }
        public string UserSNo { get; set; }
        public List<EventMessageGridAppendGrid> EventTransData { get; set; }
    }

}
