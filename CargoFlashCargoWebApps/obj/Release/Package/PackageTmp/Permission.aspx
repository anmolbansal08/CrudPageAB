<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Permission.aspx.cs" Inherits="Permission" %>

<%--<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title></title>
</head>
<body>
    <form id="form1" runat="server">
    <div>
    
    </div>
    </form>
</body>
</html>--%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head id="Head1" runat="server">
    <title></title>
    <link href="Styles/Grid/kendo.common.min.css" rel="stylesheet" type="text/css" />
    <link href="Styles/Grid/kendo.blueopal.min.css" rel="stylesheet" type="text/css" />
    <link href="Styles/Site.css" rel="stylesheet" type="text/css" />
    <link href="Styles/Application.css" rel="stylesheet" type="text/css" />
    <script src="PermissionScripts/jquery-1.7.2.js" type="text/javascript"></script>
    <script src="PermissionScripts/Kendo/kendo.web.js" type="text/javascript"></script>
    <script src="PermissionScripts/shortcut.js?1.1.2" type="text/javascript"></script>
    <script src="PermissionScripts/common.js" type="text/javascript"></script>
    <script src='<%=ResolveClientUrl("~/PermissionScripts/Manage/Permission.js") %>' type="text/javascript"></script>
    <link href="Styles/Permission.css" rel="stylesheet" type="text/css" />
</head>
<body>
    <form id="aspnetForm" runat="server">
        <%--<asp:ContentPlaceHolder ID="MainContent" runat="server">--%>
        <div id="vertical">
            <div id="top-pane">
                <div id="horizontal">
                    <div id="left-pane">
                        <div class="pane-content">
                            <div class="treeview-back">
                                <div id="treeview-sprites"></div>
                            </div>
                        </div>
                    </div>
                    <div id="center-pane">
                        <div class="pane-content">
                            <iframe id="iframeid" src='<%=ResolveClientUrl("~/Users.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW") %>' width="100%" frameborder="0" style="height: 500px !important;"></iframe>
                            <%--<iframe id="iframeid" src='<%=ResolveClientUrl("~/Default.aspx?Module=Users&Apps=Groups&FormAction=INDEXVIEW") %>' width="100%" frameborder="0" style="height:500px !important;"></iframe>--%>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%--</asp:ContentPlaceHolder>        --%>
    </form>
</body>
</html>

