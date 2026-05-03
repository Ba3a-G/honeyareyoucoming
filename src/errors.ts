import type { Context } from 'hono';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function fakeIisError(_c: Context, path: string): Response {
  const safePath = escapeHtml(path);
  const body = `<!DOCTYPE html>
<html>
  <head>
    <title>Server Error in '/' Application.</title>
    <style>
      body { margin:0; background:#ffffcc; color:#000; font-family:"Verdana",sans-serif; }
      .page { padding:18px 22px 28px; }
      h1 { margin:0 0 10px; font-size:26px; font-weight:normal; }
      h2 { margin:0 0 16px; font-size:20px; color:#990000; font-weight:normal; }
      p { margin:0 0 14px; font-size:13px; line-height:1.45; }
      .trace { margin:18px 0; padding:12px; border:1px solid #c0c0c0; background:#fff7e7; font-family:"Courier New",monospace; font-size:12px; white-space:pre-wrap; }
      .footer { margin-top:22px; font-size:12px; color:#333; }
    </style>
  </head>
  <body>
    <div class="page">
      <h1>Server Error in '/' Application.</h1>
      <h2>Runtime Error</h2>
      <p>An application error occurred on the server. The current custom error settings for this application prevent the details of the application error from being viewed remotely.</p>
      <p>Requested URL: ${safePath}</p>
      <div class="trace">[HttpUnhandledException (0x80004005): Exception of type 'System.Web.HttpUnhandledException' was thrown.]
System.Web.HttpUnhandledException
System.Web.UI.Page.HandleError(Exception e) +184
System.Web.UI.Page.ProcessRequestMain(Boolean includeStagesBeforeAsyncPoint, Boolean includeStagesAfterAsyncPoint) +5824
System.Web.UI.Page.ProcessRequest(Boolean includeStagesBeforeAsyncPoint, Boolean includeStagesAfterAsyncPoint) +178
System.Web.UI.Page.ProcessRequest() +71

Version Information:
Source File: c:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Temporary ASP.NET Files\\root\\7f3b8c1d\\admin_default.aspx.cs
Stack File: c:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\System.Web.dll</div>
      <div class="footer">
        ASP.NET Version: 4.0.30319.0<br>
        Microsoft .NET Framework Version: 4.0.30319; ASP.NET Version: 4.0.30319.547
      </div>
    </div>
  </body>
</html>`;

  return new Response(body, {
    status: 500,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
    },
  });
}
