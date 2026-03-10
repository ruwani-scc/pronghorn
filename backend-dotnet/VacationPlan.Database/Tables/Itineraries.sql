CREATE TABLE [dbo].[itineraries]
(
    [id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [user_id] UNIQUEIDENTIFIER NOT NULL,
    [title] NVARCHAR(255) NOT NULL,
    [destination] NVARCHAR(255) NULL,
    [start_date] DATE NOT NULL,
    [end_date] DATE NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT [PK_itineraries] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_itineraries_users] FOREIGN KEY ([user_id]) 
        REFERENCES [dbo].[users]([id]) 
        ON DELETE CASCADE,
    CONSTRAINT [CK_itineraries_valid_dates] CHECK ([end_date] >= [start_date])
);

GO

-- Index for user's itineraries lookup
CREATE NONCLUSTERED INDEX [IX_itineraries_user_id] 
ON [dbo].[itineraries] ([user_id] ASC);

GO

-- Index for date range queries
CREATE NONCLUSTERED INDEX [IX_itineraries_dates] 
ON [dbo].[itineraries] ([start_date] ASC, [end_date] ASC);

GO

-- Index for sorting by creation date
CREATE NONCLUSTERED INDEX [IX_itineraries_created_at] 
ON [dbo].[itineraries] ([created_at] DESC);

GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'Trip itineraries with basic information',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'itineraries';

GO
