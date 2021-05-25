<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Users.aspx.cs" Inherits="Users" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
    <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
<head id="Head1" runat="server">
    <title></title>
    <link href="Styles/Application.css" rel="stylesheet" type="text/css" />
    <link href="Styles/Site.css" rel="stylesheet" type="text/css" />
    <link type="text/css" rel="stylesheet" href="Styles/Grid/kendo.common.min.css" />
    <link type="text/css" rel="stylesheet" href="Styles/grid/kendo.blueopal.min.css" />
    <link type="text/css" rel="stylesheet" href="Styles/validator.theme.red.css" />
    <link href="Styles/CfiMessage.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="Styles/CfiMessageResponsive.css" />
    <link type="text/css" rel="stylesheet" href="Styles/jquery-ui/jquery-ui-1.10.2.custom.css" />
    <link type="text/css" rel="stylesheet" href="Styles/jquery.appendGrid-1.3.2.css" />
    <script src="PermissionScripts/jquery-1.7.2.js" type="text/javascript"></script>
    <script src="PermissionScripts/Kendo/kendo.web.js" type="text/javascript"></script>
    <script src="PermissionScripts/shortcut.js?1.1.2" type="text/javascript"></script>
    <script src="PermissionScripts/common.js" type="text/javascript"></script>
    <script src="PermissionScripts/Manage/Permission.js" type="text/javascript"></script>
    <script src="PermissionScripts/Manage/manage-permission.js" type="text/javascript"></script>
    <script src="PermissionScripts/CfiMessage.js" type="text/javascript"></script>
    <script type="text/javascript" src="PermissionScripts/jquery-ui-1.10.2.custom.min.js"></script>
    <script type="text/javascript" src="PermissionScripts/jquery.appendGrid-1.3.2.js"></script>
    <style type="text/css">
        div.k-window
        {
            left:150px !important;
        }
        .k-grid-header .k-header:first-child, .k-grid tbody td:first-child, .k-grid tfoot td:first-child
        {
            border-left-width:0px !important;
        }
    </style> 
</head>
<body style="background-color:White;">
    <form id="aspnetForm" runat="server">
        <div>     
            <%=myCurrentFrom.ToString() %>
        </div>
    </form>
</body>
</html>
