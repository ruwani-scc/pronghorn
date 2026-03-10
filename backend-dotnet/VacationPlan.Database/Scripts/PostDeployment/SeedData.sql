/*
Post-Deployment Script Template                            
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.
 Use SQLCMD syntax to include a file in the post-deployment script.
 Example:      :r .\myfile.sql
 Use SQLCMD syntax to reference a variable in the post-deployment script.
 Example:      :setvar TableName MyTable
               SELECT * FROM [$(TableName)]
--------------------------------------------------------------------------------------
*/

-- Seed Data for VacationPlan Database
-- This script can be used to populate initial test data

PRINT 'Starting seed data insertion...'

-- Sample User (only for development/testing)
IF NOT EXISTS (SELECT 1 FROM [dbo].[users] WHERE [email] = 'test@example.com')
BEGIN
    DECLARE @TestUserId UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO [dbo].[users] ([id], [email], [auth_provider_id], [created_at], [updated_at])
    VALUES 
        (@TestUserId, 'test@example.com', 'auth0|test123', GETUTCDATE(), GETUTCDATE());
    
    PRINT 'Test user created with ID: ' + CAST(@TestUserId AS NVARCHAR(50));
    
    -- Sample Itinerary
    DECLARE @ItineraryId UNIQUEIDENTIFIER = NEWID();
    
    INSERT INTO [dbo].[itineraries] 
        ([id], [user_id], [title], [destination], [start_date], [end_date], [description], [created_at], [updated_at])
    VALUES 
        (@ItineraryId, @TestUserId, 'Summer Vacation 2024', 'Paris, France', '2024-07-01', '2024-07-10', 
         'A wonderful trip to Paris exploring museums, cafes, and historical sites.', GETUTCDATE(), GETUTCDATE());
    
    PRINT 'Sample itinerary created with ID: ' + CAST(@ItineraryId AS NVARCHAR(50));
    
    -- Sample Itinerary Items
    INSERT INTO [dbo].[itinerary_items] 
        ([id], [itinerary_id], [category], [title], [description], [start_datetime], [end_datetime], 
         [location], [confirmation_code], [cost], [currency], [display_order], [is_completed], [created_at], [updated_at])
    VALUES 
        (NEWID(), @ItineraryId, 'accommodation', 'Hotel Eiffel', 'Boutique hotel near Eiffel Tower', 
         '2024-07-01 15:00:00', '2024-07-10 11:00:00', '12 Rue de l''Exposition, 75007 Paris', 'CONF123456', 
         1200.00, 'EUR', 1, 0, GETUTCDATE(), GETUTCDATE()),
        
        (NEWID(), @ItineraryId, 'activity', 'Louvre Museum Visit', 'Guided tour of the Louvre', 
         '2024-07-02 10:00:00', '2024-07-02 14:00:00', 'Louvre Museum, Paris', NULL, 
         45.00, 'EUR', 2, 0, GETUTCDATE(), GETUTCDATE()),
        
        (NEWID(), @ItineraryId, 'transport', 'Flight to Paris', 'Direct flight from JFK to CDG', 
         '2024-07-01 08:00:00', '2024-07-01 20:00:00', 'JFK Airport to CDG Airport', 'AA1234', 
         850.00, 'USD', 0, 0, GETUTCDATE(), GETUTCDATE()),
        
        (NEWID(), @ItineraryId, 'activity', 'Eiffel Tower Visit', 'Summit access to Eiffel Tower', 
         '2024-07-03 16:00:00', '2024-07-03 19:00:00', 'Champ de Mars, Paris', NULL, 
         26.00, 'EUR', 3, 0, GETUTCDATE(), GETUTCDATE()),
        
        (NEWID(), @ItineraryId, 'transport', 'Return Flight', 'Direct flight from CDG to JFK', 
         '2024-07-10 14:00:00', '2024-07-10 17:00:00', 'CDG Airport to JFK Airport', 'AA5678', 
         850.00, 'USD', 4, 0, GETUTCDATE(), GETUTCDATE());
    
    PRINT 'Sample itinerary items created.';
END
ELSE
BEGIN
    PRINT 'Test user already exists. Skipping seed data.';
END

PRINT 'Seed data insertion completed.'
GO
