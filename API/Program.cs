using Application.Activities;

var builder = WebApplication.CreateBuilder(args);

// add services to container
builder.Services.AddControllers(opt =>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});
// .AddFluentValidation(config => {
//     config.RegisterValidatorsFromAssemblyContaining<Create>();
// });

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();
builder.Services.AddValidatorsFromAssemblyContaining<Create>();

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

// configure the http request pipeline
var app = builder.Build();

// Custom middleware to handle exceptions app wide
app.UseMiddleware<ExceptionMiddleware>();

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt => opt.NoReferrer());
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt => opt
    .BlockAllMixedContent()
    .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
    .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
    .FormActions(s => s.Self())
    .FrameAncestors(s => s.Self())
    .ImageSources(s => s.Self().CustomSources("https://res.cloudinary.com"))
    .ScriptSources(s => s.Self().CustomSources("sha256-kXwZFeDqzQYQxMANlJcsdedkJvek1q5ncjzFrCq4x+I="))
);

if (app.Environment.IsDevelopment())
{
    //app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));
}
else
{
    app.Use(async (context, next) =>
    {
        context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next.Invoke();
    });
}

//app.UseHttpsRedirection();
//app.UseRouting();

// Looks for index.html in wwwroot folder
// Serve static files from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseCors("Cors Policy");

app.UseAuthentication();

app.UseAuthorization();

// app.UseEndpoints(endpoints =>
// {
//     endpoints.MapControllers();
//     endpoints.MapHub<ChatHub>("/chat");
//     endpoints.MapFallbackToController("Index", "Fallback");
// });
app.MapControllers();
app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

using (var scope = app.Services.CreateScope())
{

    var services = scope.ServiceProvider;

    try
    {

        // Attempt to apply db migrations when starting app
        var context = services.GetRequiredService<DataContext>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();

        await context.Database.MigrateAsync();

        await Seed.SeedData(context, userManager);

    }
    catch (Exception ex)
    {

        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occured during database migration");
    }
}

await app.RunAsync();