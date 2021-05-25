
// <copyright file="ScheduleFlightSearchRequest.cs" company="Cargoflash">
//
// Created On: 02-Sep-2017
// Created By: Braj
// Description: Flight Search Request model
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
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.Linq;
    using System.Text;
    using System.Threading.Tasks;
    using System.Runtime.Serialization;
    #endregion

    public class ScheduleFlightSearchRequest
    {
        /// <summary>
        /// Gets or sets flight no value
        /// </summary>
        public string FlightNo { get; set; }
        /// <summary>
        /// Gets or sets flight date
        /// </summary>
        public DateTime FlightDate { get; set; }
        /// <summary>
        /// Gets or sets flight origin
        /// </summary>
        public string Origin { get; set; }
        /// <summary>
        /// Gets or sets flight destination
        /// </summary>
        public string Destination { get; set; }
        /// <summary>
        /// Gets or sets Aircraft registration 
        /// </summary>
        public string ACRegYes { get; set; }

        public string ACRegNo { get; set; }
        public string AvlCap { get; set; }

    }

    public class ViewHistory
    {
            public List<Int64> dfSNo { get; set; }
            public string FlightNo { get; set; }
            public string FlightDate { get; set; }

    }
}
