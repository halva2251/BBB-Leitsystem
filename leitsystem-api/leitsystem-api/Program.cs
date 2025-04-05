using leitsystem_api.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
/*builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(8080);
});*/
builder.Services.AddControllers();

builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

/*using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<DataContext>();
    try
    {
        dbContext.Database.Migrate();
    }
    catch (Microsoft.Data.SqlClient.SqlException ex) when (ex.Number == 1801) // 1801 = "database already exists"
    {
        // Log the exception and continue, or handle accordingly.
    }
}*/

app.Run();
