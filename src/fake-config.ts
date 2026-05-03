import type { Context } from 'hono';

function createFakeWebConfig(): string {
  const apiKey = crypto.randomUUID();

  return `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <connectionStrings>
    <add name="DefaultConnection" connectionString="Server=10.0.1.22,1433;Database=AppProductionDB;User ID=sa;Password=Str0ng!Pass#2019;Trusted_Connection=False;MultipleActiveResultSets=True;" providerName="System.Data.SqlClient" />
  </connectionStrings>
  <appSettings>
    <add key="Environment" value="Production" />
    <add key="ApiKey" value="${apiKey}" />
    <add key="SmtpHost" value="smtp.internal.corp" />
    <add key="AdminEmail" value="admin@internal.corp" />
    <add key="EnableDebug" value="false" />
  </appSettings>
  <system.web>
    <customErrors mode="Off" />
    <compilation debug="false" targetFramework="4.8" />
  </system.web>
</configuration>`;
}

export function fakeConfigResponse(_c: Context): Response {
  return new Response(createFakeWebConfig(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=UTF-8',
    },
  });
}
