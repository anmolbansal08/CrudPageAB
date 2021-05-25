using System;
using System.Web;
using System.ComponentModel;

namespace CargoFlash.SoftwareFactory.WebUI.Adapters
{
    /// <summary>
    /// Specifies the Form View modes of a HTML Form.
    /// </summary>
    public enum DisplayModeType
    {
        /// <summary>
        /// Blank Form View
        /// </summary>
        New = 0,
        /// <summary>
        /// Edit Form View
        /// </summary>
        Edit = 1,
        /// <summary>
        /// Delete Form View
        /// </summary>
        Delete = 2,
        /// <summary>
        /// ReadOnly Form View
        /// </summary>
        ReadOnly = 3,
        /// <summary>
        /// ADJUSTMENT Form View
        /// </summary>
        Adjustment = 4,
        /// <summary>
        /// SEARCH Form View
        /// </summary>
        Search = 5,
        /// <summary>
        /// SEARCH Form View
        /// </summary>
        Save = 6,
    }
}
