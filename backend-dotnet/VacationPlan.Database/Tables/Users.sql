CREATE TABLE [dbo].[users]
(
    [id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [email] NVARCHAR(255) NOT NULL,
    [auth_provider_id] NVARCHAR(255) NOT NULL,
    [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT [PK_users] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [UQ_users_email] UNIQUE NONCLUSTERED ([email] ASC),
    CONSTRAINT [UQ_users_auth_provider_id] UNIQUE NONCLUSTERED ([auth_provider_id] ASC)
);

GO

-- Index for faster lookups by email
CREATE NONCLUSTERED INDEX [IX_users_email] 
ON [dbo].[users] ([email] ASC);

GO

-- Index for faster lookups by auth provider ID
CREATE NONCLUSTERED INDEX [IX_users_auth_provider_id] 
ON [dbo].[users] ([auth_provider_id] ASC);

GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'User accounts with external authentication',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'users';

GO
