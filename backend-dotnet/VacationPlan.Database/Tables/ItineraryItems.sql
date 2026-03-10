CREATE TABLE [dbo].[itinerary_items]
(
    [id] UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    [itinerary_id] UNIQUEIDENTIFIER NOT NULL,
    [category] NVARCHAR(50) NOT NULL,
    [title] NVARCHAR(255) NOT NULL,
    [description] NVARCHAR(MAX) NULL,
    [start_datetime] DATETIME2 NULL,
    [end_datetime] DATETIME2 NULL,
    [location] NVARCHAR(255) NULL,
    [confirmation_code] NVARCHAR(100) NULL,
    [cost] DECIMAL(10, 2) NULL,
    [currency] NVARCHAR(3) NOT NULL DEFAULT 'USD',
    [metadata] NVARCHAR(MAX) NULL,
    [display_order] INT NOT NULL DEFAULT 0,
    [is_completed] BIT NOT NULL DEFAULT 0,
    [created_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    [updated_at] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    
    CONSTRAINT [PK_itinerary_items] PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [FK_itinerary_items_itineraries] FOREIGN KEY ([itinerary_id]) 
        REFERENCES [dbo].[itineraries]([id]) 
        ON DELETE CASCADE,
    CONSTRAINT [CK_itinerary_items_valid_category] 
        CHECK ([category] IN ('accommodation', 'activity', 'transport'))
);

GO

-- Index for itinerary's items lookup
CREATE NONCLUSTERED INDEX [IX_itinerary_items_itinerary_id] 
ON [dbo].[itinerary_items] ([itinerary_id] ASC);

GO

-- Index for category filtering
CREATE NONCLUSTERED INDEX [IX_itinerary_items_category] 
ON [dbo].[itinerary_items] ([category] ASC);

GO

-- Index for ordering items within an itinerary
CREATE NONCLUSTERED INDEX [IX_itinerary_items_itinerary_display_order] 
ON [dbo].[itinerary_items] ([itinerary_id] ASC, [display_order] ASC);

GO

-- Index for date-based queries
CREATE NONCLUSTERED INDEX [IX_itinerary_items_start_datetime] 
ON [dbo].[itinerary_items] ([start_datetime] ASC)
WHERE [start_datetime] IS NOT NULL;

GO

-- Index for completion status queries
CREATE NONCLUSTERED INDEX [IX_itinerary_items_is_completed] 
ON [dbo].[itinerary_items] ([itinerary_id] ASC, [is_completed] ASC);

GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'Itinerary items representing accommodations, activities, or transport',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'itinerary_items';

GO

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description',
    @value = N'JSON metadata for category-specific fields',
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE', @level1name = N'itinerary_items',
    @level2type = N'COLUMN', @level2name = N'metadata';

GO
