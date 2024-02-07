using System;
using System.Text;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Services;
using Company.ClassLibrary1;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace API.Extensions;

public static class AppServiceExtention
{
    public static IServiceCollection AddAppServices(this IServiceCollection services, IConfiguration conf)
    {
        services.AddDbContext<DataContext>(opt =>
        {
            opt.UseSqlite(conf.GetConnectionString("DefaultConnection"));
        });
        services.AddCors();
        services.AddScoped<ITokenservice, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure<CloudinarySetting>(conf.GetSection("CloudinarySettings"));
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<LogUserActivity>();
        services.AddScoped<IlikesRepository, LikesRepository>();
        services.AddScoped<IMessageRepository, MessageRepository>();

        return services;

    }
}
