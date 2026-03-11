/**
 * Custom Assertions for E2E Tests
 * Reusable assertion functions for common test scenarios
 */

import { expect, Page, Locator } from '@playwright/test';

/**
 * Assert that element contains text
 */
export async function assertElementContainsText(
  locator: Locator,
  expectedText: string,
  message?: string
): Promise<void> {
  const text = await locator.textContent();
  expect(text, message).toContain(expectedText);
}

/**
 * Assert that element has exact text
 */
export async function assertElementHasText(
  locator: Locator,
  expectedText: string,
  message?: string
): Promise<void> {
  await expect(locator, message).toHaveText(expectedText);
}

/**
 * Assert that element is visible
 */
export async function assertElementVisible(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).toBeVisible();
}

/**
 * Assert that element is not visible
 */
export async function assertElementNotVisible(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).not.toBeVisible();
}

/**
 * Assert that element is enabled
 */
export async function assertElementEnabled(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).toBeEnabled();
}

/**
 * Assert that element is disabled
 */
export async function assertElementDisabled(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).toBeDisabled();
}

/**
 * Assert URL matches pattern
 */
export async function assertURLMatches(
  page: Page,
  pattern: string | RegExp,
  message?: string
): Promise<void> {
  await expect(page, message).toHaveURL(pattern);
}

/**
 * Assert URL contains string
 */
export async function assertURLContains(
  page: Page,
  substring: string,
  message?: string
): Promise<void> {
  const url = page.url();
  expect(url, message).toContain(substring);
}

/**
 * Assert element has attribute with value
 */
export async function assertElementHasAttribute(
  locator: Locator,
  attribute: string,
  value: string | RegExp,
  message?: string
): Promise<void> {
  await expect(locator, message).toHaveAttribute(attribute, value);
}

/**
 * Assert input has value
 */
export async function assertInputHasValue(
  locator: Locator,
  expectedValue: string,
  message?: string
): Promise<void> {
  await expect(locator, message).toHaveValue(expectedValue);
}

/**
 * Assert element count
 */
export async function assertElementCount(
  locator: Locator,
  expectedCount: number,
  message?: string
): Promise<void> {
  await expect(locator, message).toHaveCount(expectedCount);
}

/**
 * Assert page title
 */
export async function assertPageTitle(
  page: Page,
  expectedTitle: string | RegExp,
  message?: string
): Promise<void> {
  await expect(page, message).toHaveTitle(expectedTitle);
}

/**
 * Assert element has class
 */
export async function assertElementHasClass(
  locator: Locator,
  className: string,
  message?: string
): Promise<void> {
  await expect(locator, message).toHaveClass(new RegExp(className));
}

/**
 * Assert element does not have class
 */
export async function assertElementNotHaveClass(
  locator: Locator,
  className: string,
  message?: string
): Promise<void> {
  await expect(locator, message).not.toHaveClass(new RegExp(className));
}

/**
 * Assert checkbox is checked
 */
export async function assertCheckboxChecked(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).toBeChecked();
}

/**
 * Assert checkbox is not checked
 */
export async function assertCheckboxNotChecked(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).not.toBeChecked();
}

/**
 * Assert select has selected option
 */
export async function assertSelectHasValue(
  locator: Locator,
  expectedValue: string,
  message?: string
): Promise<void> {
  const value = await locator.inputValue();
  expect(value, message).toBe(expectedValue);
}

/**
 * Assert element is focused
 */
export async function assertElementFocused(
  locator: Locator,
  message?: string
): Promise<void> {
  await expect(locator, message).toBeFocused();
}

/**
 * Assert array contains value
 */
export function assertArrayContains<T>(
  array: T[],
  value: T,
  message?: string
): void {
  expect(array, message).toContain(value);
}

/**
 * Assert array length
 */
export function assertArrayLength<T>(
  array: T[],
  expectedLength: number,
  message?: string
): void {
  expect(array, message).toHaveLength(expectedLength);
}

/**
 * Assert object has property
 */
export function assertObjectHasProperty(
  obj: any,
  property: string,
  message?: string
): void {
  expect(obj, message).toHaveProperty(property);
}

/**
 * Assert object property equals value
 */
export function assertObjectPropertyEquals(
  obj: any,
  property: string,
  expectedValue: any,
  message?: string
): void {
  expect(obj[property], message).toBe(expectedValue);
}

/**
 * Assert values are equal
 */
export function assertEquals<T>(
  actual: T,
  expected: T,
  message?: string
): void {
  expect(actual, message).toBe(expected);
}

/**
 * Assert values are not equal
 */
export function assertNotEquals<T>(
  actual: T,
  expected: T,
  message?: string
): void {
  expect(actual, message).not.toBe(expected);
}

/**
 * Assert value is truthy
 */
export function assertTruthy(value: any, message?: string): void {
  expect(value, message).toBeTruthy();
}

/**
 * Assert value is falsy
 */
export function assertFalsy(value: any, message?: string): void {
  expect(value, message).toBeFalsy();
}

/**
 * Assert value is null
 */
export function assertNull(value: any, message?: string): void {
  expect(value, message).toBeNull();
}

/**
 * Assert value is not null
 */
export function assertNotNull(value: any, message?: string): void {
  expect(value, message).not.toBeNull();
}

/**
 * Assert value is undefined
 */
export function assertUndefined(value: any, message?: string): void {
  expect(value, message).toBeUndefined();
}

/**
 * Assert value is defined
 */
export function assertDefined(value: any, message?: string): void {
  expect(value, message).toBeDefined();
}

/**
 * Assert string matches regex
 */
export function assertStringMatches(
  str: string,
  pattern: RegExp,
  message?: string
): void {
  expect(str, message).toMatch(pattern);
}

/**
 * Assert number is greater than
 */
export function assertGreaterThan(
  actual: number,
  expected: number,
  message?: string
): void {
  expect(actual, message).toBeGreaterThan(expected);
}

/**
 * Assert number is less than
 */
export function assertLessThan(
  actual: number,
  expected: number,
  message?: string
): void {
  expect(actual, message).toBeLessThan(expected);
}

/**
 * Assert deep equality of objects
 */
export function assertDeepEquals<T>(
  actual: T,
  expected: T,
  message?: string
): void {
  expect(actual, message).toEqual(expected);
}
