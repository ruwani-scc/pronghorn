using Microsoft.EntityFrameworkCore;
using VacationPlan.Core.Models;

namespace VacationPlan.Infrastructure.Data;

/// <summary>
/// Entity Framework Core DbContext for VacationPlan database
/// </summary>
public class VacationPlanDbContext : DbContext
{
    public VacationPlanDbContext(DbContextOptions<VacationPlanDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Itinerary> Itineraries { get; set; } = null!;
    public DbSet<ItineraryItem> ItineraryItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.AuthProviderId).IsUnique();
            entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
            entity.Property(e => e.AuthProviderId).IsRequired().HasMaxLength(255);
            
            // Configure timestamps
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAddOrUpdate();
        });

        // Itinerary configuration
        modelBuilder.Entity<Itinerary>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.UserId);
            entity.HasIndex(e => new { e.StartDate, e.EndDate });
            entity.HasIndex(e => e.CreatedAt);
            
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Destination).HasMaxLength(255);
            entity.Property(e => e.Description).HasColumnType("text");
            
            // Date validation constraint
            entity.HasCheckConstraint("valid_dates", "end_date >= start_date");
            
            // Configure timestamps
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAddOrUpdate();

            // Relationship with User
            entity.HasOne(e => e.User)
                .WithMany(u => u.Itineraries)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // ItineraryItem configuration
        modelBuilder.Entity<ItineraryItem>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.ItineraryId);
            entity.HasIndex(e => e.Category);
            entity.HasIndex(e => new { e.ItineraryId, e.DisplayOrder });
            entity.HasIndex(e => e.StartDatetime);
            
            entity.Property(e => e.Category)
                .IsRequired()
                .HasMaxLength(50);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).HasColumnType("text");
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.ConfirmationCode).HasMaxLength(100);
            entity.Property(e => e.Cost).HasPrecision(10, 2);
            entity.Property(e => e.Currency).HasMaxLength(3).HasDefaultValue("USD");
            entity.Property(e => e.Metadata).HasColumnType("jsonb");
            entity.Property(e => e.DisplayOrder).HasDefaultValue(0);
            entity.Property(e => e.IsCompleted).HasDefaultValue(false);
            
            // Category validation constraint
            entity.HasCheckConstraint(
                "valid_category", 
                "category IN ('accommodation', 'activity', 'transport')"
            );
            
            // Configure timestamps
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAdd();
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("NOW()")
                .ValueGeneratedOnAddOrUpdate();

            // Relationship with Itinerary
            entity.HasOne(e => e.Itinerary)
                .WithMany(i => i.Items)
                .HasForeignKey(e => e.ItineraryId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Auto-update UpdatedAt timestamps
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is User user)
                user.UpdatedAt = DateTime.UtcNow;
            else if (entry.Entity is Itinerary itinerary)
                itinerary.UpdatedAt = DateTime.UtcNow;
            else if (entry.Entity is ItineraryItem item)
                item.UpdatedAt = DateTime.UtcNow;
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
