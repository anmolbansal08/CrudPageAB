using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

namespace CargoFlash.Cargo.Model.Accounts
{
    [KnownType(typeof(PaymentStatusReport))]
    public class PaymentStatusReport
    {
        public string SNo { get; set; }
        public string AirlineName { get; set; }
        public string AccountSNo { get; set; }
        public string RequestedID { get; set; }
        public string CityCode { get; set; }
        public string OfficeName { get; set; }
        public string AgentName { get; set; }
        public string Currency { get; set; }
        public string Amount { get; set; }
        public string PaymentMode { get; set; }
        public string RequestedDate { get; set; }
        public string RequestedBy { get; set; }
        public string RequestedRemarks { get; set; }
        public string TransactionDate { get; set; }
        public string Status { get; set; }
        public string ApprovedBy { get; set; }
        public string ApprovedOn { get; set; }
        public string ApprovedRemarks { get; set; }
        public string ReversedBy { get; set; }
        public string ReversedOn { get; set; }
        public string ReversalRemarks { get; set; }
        public string ReferenceNo { get; set; }
      
    }
    [KnownType(typeof(PaymentStatusRequest))]
    public class PaymentStatusRequest
    {
        public string PaymentType { get; set; }
        public string AgentName { get; set; }
        public string PaymentStatus { get; set; }
        public string ValidFrom { get; set; }
        public string ValidTo { get; set; }
    }
    [KnownType(typeof(DataSourceResultAppendGrid))]
    public class DataSourceResultAppendGrid
    {
        /// <summary>
        /// Represents a single page of processed data.
        /// </summary>
        public IEnumerable value { get; set; }

        /// <summary>
        /// The total number of records available.
        /// </summary>
        public int key { get; set; }

    }
}
