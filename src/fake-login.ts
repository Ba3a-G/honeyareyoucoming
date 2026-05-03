import type { Context } from 'hono';

function randomBase64(length: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  let output = '';

  for (let index = 0; index < length; index += 1) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % alphabet.length;
    output += alphabet[randomIndex];
  }

  return output;
}

function randomAlphaNumeric(length: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let output = '';

  for (let index = 0; index < length; index += 1) {
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % alphabet.length;
    output += alphabet[randomIndex];
  }

  return output;
}

function renderLoginPage(method: 'GET' | 'POST'): string {
  const failureMessage =
    method === 'POST'
      ? `<tr>
              <td colspan="2" style="padding-bottom:12px;">
                <span id="ctl00_MainContent_LoginUser_FailureText" style="color:#cc0000;font-family:Verdana,Arial,sans-serif;font-size:12px;">Your login attempt was not successful. Please try again.</span>
              </td>
            </tr>`
      : '';

  return `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
  <head>
    <title>Administration - Log In</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  </head>
  <body style="margin:0;background-color:#d8e2f0;font-family:Verdana,Arial,sans-serif;">
    <form method="post" action="/admin/Default.aspx" id="aspnetForm">
      <div style="width:100%;padding-top:60px;">
        <table cellpadding="0" cellspacing="0" border="0" align="center" style="width:420px;background-color:#ffffff;border:1px solid #8ea9c1;">
          <tr>
            <td style="background-color:#4b6c9e;color:#ffffff;padding:14px 18px;font-size:20px;font-weight:bold;">Administration - Log In</td>
          </tr>
          <tr>
            <td style="padding:24px 18px;">
              <input type="hidden" name="__VIEWSTATE" value="${randomBase64(128)}">
              <input type="hidden" name="__EVENTVALIDATION" value="${randomBase64(128)}">
              <table cellpadding="4" cellspacing="0" border="0" style="width:100%;">
                ${failureMessage}
                <tr>
                  <td style="width:140px;color:#333333;font-size:12px;">User Name:</td>
                  <td><input type="text" name="ctl00$MainContent$LoginUser$UserName" style="width:220px;border:1px solid #7f9db9;height:22px;"></td>
                </tr>
                <tr>
                  <td style="color:#333333;font-size:12px;">Password:</td>
                  <td><input type="password" name="ctl00$MainContent$LoginUser$Password" style="width:220px;border:1px solid #7f9db9;height:22px;"></td>
                </tr>
                <tr>
                  <td>&nbsp;</td>
                  <td style="padding-top:10px;"><input type="submit" value="Log In" style="background-color:#f3f3f3;border:1px solid #7f9db9;color:#333333;padding:4px 16px;font-size:12px;"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </form>
  </body>
</html>`;
}

export function fakeLoginResponse(_c: Context, method: 'GET' | 'POST'): Response {
  return new Response(renderLoginPage(method), {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Set-Cookie': `ASP.NET_SessionId=${randomAlphaNumeric(24)}; path=/; HttpOnly`,
    },
  });
}
