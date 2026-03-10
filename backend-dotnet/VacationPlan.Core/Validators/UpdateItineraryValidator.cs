using FluentValidation;
using VacationPlan.Core.DTOs;

namespace VacationPlan.Core.Validators;

/// <summary>
/// Validator for UpdateItineraryDto
/// </summary>
public class UpdateItineraryValidator : AbstractValidator<UpdateItineraryDto>
{
    public UpdateItineraryValidator()
    {
        RuleFor(x => x.Title)
            .MaximumLength(255).WithMessage("Title must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Destination)
            .MaximumLength(255).WithMessage("Destination must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Destination));

        RuleFor(x => x)
            .Must(x => x.EndDate!.Value >= x.StartDate!.Value)
            .WithMessage("End date must be greater than or equal to start date")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x)
            .Must(x => (x.EndDate!.Value.DayNumber - x.StartDate!.Value.DayNumber) <= 365)
            .WithMessage("Trip duration cannot exceed 365 days")
            .When(x => x.StartDate.HasValue && x.EndDate.HasValue);

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("Description must not exceed 5000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}
