using FluentValidation;
using VacationPlan.Core.DTOs;
using VacationPlan.Core.Models;

namespace VacationPlan.Core.Validators;

/// <summary>
/// Validator for UpdateItemDto
/// </summary>
public class UpdateItemValidator : AbstractValidator<UpdateItemDto>
{
    public UpdateItemValidator()
    {
        RuleFor(x => x.Category)
            .Must(c => ItemCategory.IsValid(c!))
            .WithMessage($"Category must be one of: {string.Join(", ", ItemCategory.ValidCategories)}")
            .When(x => !string.IsNullOrEmpty(x.Category));

        RuleFor(x => x.Title)
            .MaximumLength(255).WithMessage("Title must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Title));

        RuleFor(x => x.Description)
            .MaximumLength(5000).WithMessage("Description must not exceed 5000 characters")
            .When(x => !string.IsNullOrEmpty(x.Description));

        RuleFor(x => x.EndDatetime)
            .GreaterThan(x => x.StartDatetime!.Value)
            .WithMessage("End datetime must be greater than start datetime")
            .When(x => x.StartDatetime.HasValue && x.EndDatetime.HasValue);

        RuleFor(x => x.Location)
            .MaximumLength(255).WithMessage("Location must not exceed 255 characters")
            .When(x => !string.IsNullOrEmpty(x.Location));

        RuleFor(x => x.ConfirmationCode)
            .MaximumLength(100).WithMessage("Confirmation code must not exceed 100 characters")
            .When(x => !string.IsNullOrEmpty(x.ConfirmationCode));

        RuleFor(x => x.Cost)
            .GreaterThan(0).WithMessage("Cost must be positive")
            .LessThanOrEqualTo(999999.99m).WithMessage("Cost must not exceed 999999.99")
            .When(x => x.Cost.HasValue);

        RuleFor(x => x.Currency)
            .Length(3).WithMessage("Currency must be a 3-letter code")
            .Matches(@"^[A-Z]{3}$").WithMessage("Currency must be uppercase letters only")
            .When(x => !string.IsNullOrEmpty(x.Currency));

        RuleFor(x => x.DisplayOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Display order must be non-negative")
            .When(x => x.DisplayOrder.HasValue);
    }
}
