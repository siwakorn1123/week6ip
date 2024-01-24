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

    public DbSet<UserLike> Likes { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserLike>().HasKey(pk => new { pk.SourceUserId, pk.LikedUserId });

        modelBuilder.Entity<UserLike>()
            .HasOne(userlike => userlike.SourceUser)
            .WithMany(appuser => appuser.LikedUsers)
            .HasForeignKey(userlike => userlike.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserLike>()
            .HasOne(userlike => userlike.LikedUser)
            .WithMany(appuser => appuser.LikedByUsers)
            .HasForeignKey(userlike => userlike.LikedUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
