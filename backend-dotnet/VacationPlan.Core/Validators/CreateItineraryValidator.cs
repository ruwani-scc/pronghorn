using FluentValidation;
using VacationPlan.Core.DTOs;

namespace VacationPlan.Core.Validators;

/// <summary>
/// Validator for CreateItineraryDto
/// </summary>
public class CreateItineraryValidator : AbstractValidator<CreateItineraryDto>
{
    public CreateItineraryValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Title is required")
            .MaximumLength(255).WithMessage("Title must not exceed 255 characters");

        RuleFor(x => x.Destination)
            .MaximumLength(255).WithMessage("Destination must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Destination));

        RuleFor(x => x.StartDate)
            .NotEmpty().WithMessage("Start date is required");

        RuleFor(x => x.EndDate)
            .NotEmpty().WithMessage("End date is required")
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("End date must be greater than or equal to start date");

        RuleFor(x => x)
            .Must(x => (x.EndDate.DayNumber - x.StartDate.DayNumber) <= 365)
            .WithMessage("Trip duration cannot exceed 365 days")
            .When(x => x.StartDate != default && x.EndDate != default);

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("Description must not exceed 5000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));
    }
}
