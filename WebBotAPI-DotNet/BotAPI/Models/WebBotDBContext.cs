using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace BotAPI.Models
{
    public partial class WebBotDBContext : DbContext
    {
        public WebBotDBContext()
        {
        }

        public WebBotDBContext(DbContextOptions<WebBotDBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<WebBot> WebBots { get; set; } = null!;
        public virtual DbSet<WebBotUserToken> WebBotUserTokens { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=ConnectionStrings:CouponDB");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WebBot>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.BotName).HasMaxLength(50);

                entity.Property(e => e.BotSecret).HasMaxLength(100);
            });

            modelBuilder.Entity<WebBotUserToken>(entity =>
            {
                entity.Property(e => e.ConversationId).HasMaxLength(50);

                entity.Property(e => e.Token).IsUnicode(false);

                entity.Property(e => e.TokenExpired).HasColumnType("datetime");

                entity.Property(e => e.Upn)
                    .HasMaxLength(100)
                    .HasColumnName("UPN");

                entity.Property(e => e.UserId).HasMaxLength(50);

                entity.HasOne(d => d.Bot)
                    .WithMany(p => p.WebBotUserTokens)
                    .HasForeignKey(d => d.BotId)
                    .HasConstraintName("FK_WebBotUserTokens_WebBots");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
