// <copyright file="CreditLimitReportRequest.cs" company="Cargoflash">
//
// Created On: 01-Oct-2017
// Created By: Braj
// Description: Capacity Request Model
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>
namespace CargoFlash.Cargo.Model.Report
{


    #region Using Directive
    using System;
    using System.Runtime.Serialization;

    #endregion
    /// <summary>
    /// Credit Limit Report Request model
    /// </summary>
    /// 
    public class CreditLimitReportRequest
    {
        /// <summary>
        /// Gets or sets office sno
        /// </summary>
        /// 
        public int? OfficeSNo { get; set; }
        /// <summary>
        /// Gets or sets account sno
        /// </summary>
        public int? AccountSNo { get; set; }
        /// <summary>
        /// Gets or sets valid From
        /// </summary>
        public string ValidFrom { get; set; }
        /// <summary>
        /// Gets or sets valid To
        /// </summary>
        public string ValidTo { get; set; }
        /// <summary>
        /// currency for search
        /// </summary>
        public int CurrencySNo { get; set; }
        public int AirlineSNo { get; set; }
        public string TransactionMode { get; set; }

        // Add AwbRefType && AwbNumber By UMAR ON 31-Jul-2018, use for Credit limit report model
        public int AwbRefType { get; set; }
        public int AwbNumber { get; set; }
        public string BgType { get; set; }
        public int IsAutoProcess { get; set; }

    }

}
