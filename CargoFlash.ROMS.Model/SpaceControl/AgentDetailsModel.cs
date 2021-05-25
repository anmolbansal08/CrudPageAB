// <copyright file="AgentDetailsModel.cs" company="Cargoflash">
//
// Created On: 14-Feb-2017
// Created By: Braj
// Description: AAgent Details Model
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
    /// Agent Details Model
    /// </summary>
    public class AgentDetailsModel
    {
        #region AgentDetails
        /// <summary>
        /// Gets or sets agent name
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// Gets or sets agent address
        /// </summary>
        public string Address { get; set; }
        /// <summary>
        /// Gets or sets agent branch name
        /// </summary>
        public string Branch { get; set; }
        /// <summary>
        /// Gets or sets agent city name
        /// </summary>
        public string City { get; set; }
        /// <summary>
        /// Gets or sets agent mobile no
        /// </summary>
        public string Mobile { get; set; }
        /// <summary>
        /// Gets or sets agent valid from
        /// </summary>
        public string ValidFrom { get; set; }
        /// <summary>
        /// Gets or sets agent valid to
        /// </summary>
        public string ValidTo { get; set; }
        /// <summary>
        /// Gets or sets agent is active or not
        /// </summary>
        public string IsActive { get; set; }
        #endregion

        #region Summary for Last 3 months
        /// <summary>
        /// Gets or sets agent total booking 
        /// </summary>
        public int TotalBooking { get; set; }
        /// <summary>
        /// Gets or sets agent total revenue 
        /// </summary>
        public decimal TotalRevenue { get; set; }
        /// <summary>
        /// Gets or sets agent total gross weight
        /// </summary>
        public decimal TotalGrossWeight { get; set; }
        #endregion

    }
}
