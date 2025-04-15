using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using MusiciansAppV2.Data;
using MusiciansAppV2.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

builder.Services.AddControllers();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ArtistService>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseStaticFiles();

app.UseCors("AllowAll");
app.UseRouting();

app.UseEndpoints(endpoints => { _ = endpoints.MapControllers(); });

app.MapControllers();

app.Run();