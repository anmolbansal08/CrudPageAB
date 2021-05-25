
// <copyright file="RoutesDetails.cs" company="Cargoflash">
//
// Created On: 24-November-2017
// Created By: Braj
// Description: RoutesDetails
//----------------------------------------------------------------------------
// Revison History:
// Please add a new line below for any update to this file
// Updated On  Updated By                     Significant Changes
// ----------------------------------------------------------------------------
//

namespace CargoFlash.Cargo.Model.Schedule
{
    #region Using Directive
    using System;
    #endregion

    /// <summary>
    /// Routes details used for update existing route and new routes
    /// </summary>
    public class RoutesDetails
    {
        /// <summary>
        /// Gets or sets daily flight sno
        /// </summary>
        public Int64? SNo { get; set; }
        /// <summary>
        /// Gets or sets aircraft sno
        /// </summary>
        public Int64? AirCraftSNo { get; set; }
        /// <summary>
        /// Gets or sets flight no
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// Gets or sets flight date
        /// </summary>
        public DateTime? FlightDate { get; set; }
        /// <summary>
        /// Gets or sets schedule date
        /// </summary>
        public DateTime? ScheduleDate { get; set; }
        /// <summary>
        /// Gets or sets flight boarding point
        /// </summary>
        public string Board { get; set; }
        /// <summary>
        /// Gets or sets flight arrival point
        /// </summary>
        public string Off { get; set; }
        /// <summary>
        /// Gets or sets ETD
        /// </summary>
        public string ETD { get; set; }
        /// <summary>
        /// Gets or sets ETA
        /// </summary>
        public string ETA { get; set; }
        /// <summary>
        /// Gets or sets flight day difference
        /// </summary>
        public int? DayDiff { get; set; }
        /// <summary>
        /// Gets or sets flight arrival day difference
        /// </summary>
        public int? ArrDayDiff { get; set; }
        /// <summary>
        /// Gets or sets for new record
        /// </summary>
        public bool IsNew { get; set; }

    }
}
