using API.Entities;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace Company.ClassLibrary1;
#nullable disable
public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {

    }
    public DbSet<AppUser> Users { get; set; }
    public AutoMapper.IConfigurationProvider ConfigurationProvider { get; internal set; }

    public static implicit operator DataContext(Mapper v)
    {
        throw new NotImplementedException();
    }
}
