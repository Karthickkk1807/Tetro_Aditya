using log4net.Config;
using log4net;
using Microsoft.AspNetCore.Authorization;
using Org.BouncyCastle.Crypto.Operators;
using System.Security.Claims;
using TetroONE.Models;
using TetroONE;

namespace TetroONE.Extension
{
	public class LoggerMiddleware
	{
		private readonly RequestDelegate _next;
		private readonly string _connectionString = string.Empty;
		public LoggerMiddleware(RequestDelegate next, IConfiguration configuration)
		{
			_next = next;

			_connectionString = Convert.ToString(configuration["ConnectionStrings:TetroONE"]);
		}
		public async Task InvokeAsync(HttpContext context)
		{
			int? userid = null;
			string controllerName = string.Empty, actionName = string.Empty;

			try
			{
				var claim = context.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
				if (claim != null && int.TryParse(claim.Value, out int parsedUserId))
				{
					userid = parsedUserId;
				}
				var userAgent = context.Request.Headers["User-Agent"].ToString();
				bool? isAllowAnonymous = context.GetEndpoint()?.Metadata.Any(x => x.GetType() == typeof(AllowAnonymousAttribute));
				if (!Convert.ToBoolean(isAllowAnonymous) && isAllowAnonymous != null)
				{
					var routeValues = context.GetRouteData()?.Values;
					controllerName = routeValues["controller"]?.ToString();
					actionName = routeValues["action"]?.ToString();

				}
				await _next(context);
			}
			catch (Exception ex)
			{
				HandleException(context, ex, userid ?? 0, controllerName, actionName);
				//context.Response.Redirect(context.Request.Path);
				context.Response.Redirect("/Home", permanent: false);
			}
		}

		private async void HandleException(HttpContext context, Exception ex, int userId, string controllerName, string actionName)
		{
			HandleException Get = new HandleException()
			{
				CreatedBy = userId,
				Controller = controllerName,
				Method = actionName,
				Error = ex.Message,

			};
			GenericTetroONE.Execute(_connectionString, "USP_InsertExceptionHandler", Get);

			int statusCode = ex switch
			{
				UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
				KeyNotFoundException => StatusCodes.Status404NotFound,
				ArgumentException => StatusCodes.Status400BadRequest,
				_ => StatusCodes.Status500InternalServerError // Default to 500
			};

			context.Response.ContentType = "application/json";
			context.Response.StatusCode = (int)statusCode;
			await context.Response.WriteAsJsonAsync(Get);

		}


	}
}