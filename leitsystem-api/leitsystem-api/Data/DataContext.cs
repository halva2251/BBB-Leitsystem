using leitsystem_api.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace leitsystem_api.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public DbSet<Building> Buildings { get; set; }
        public DbSet<Floor> Floors { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<AccessPoint> AccessPoints { get; set; }
        public DbSet<RoomAccesspoint> RoomAccesspoints { get; set; }
        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure composite primary key for RoomAccesspoint.
            modelBuilder.Entity<RoomAccesspoint>()
                .HasKey(ra => new { ra.RoomId, ra.AccesspointId });

            // Configure many-to-many relationship between Room and AccessPoint.
            modelBuilder.Entity<RoomAccesspoint>()
                .HasOne(ra => ra.Room)
                .WithMany(r => r.RoomAccesspoints)
                .HasForeignKey(ra => ra.RoomId);

            modelBuilder.Entity<RoomAccesspoint>()
                .HasOne(ra => ra.AccessPoint)
                .WithMany(a => a.RoomAccesspoints)
                .HasForeignKey(ra => ra.AccesspointId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
