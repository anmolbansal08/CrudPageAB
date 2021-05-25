// <copyright file="HDQRemarks.cs" company="Cargoflash">
//
// Created On: 28-APR-2018
// Created By: Braj
// Description: HDQ Remarks
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//
// </copyright>

namespace CargoFlash.Cargo.Model.SpaceControl
{
    #region Using Directive
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    #endregion

    /// <summary>
    /// HDQ Remarks
    /// </summary>
    public class HDQRemarks
    {
        /// <summary>
        /// Gets or sets SNo
        /// </summary>
        public int? SNo { get; set; }
        public int? FlightPlanSNo { get; set; }
        public int? DailyFlightSNo { get; set; }
        public int? AWBSNo { get; set; }
        public int? AirportSNo { get; set; }
        public string Remarks { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedOn { get; set; }
        public bool? IsActive { get; set; }
    }
}
