
import { test, expect } from '@playwright/test';

test.describe('JobDescriptionStep', () => {
  test('should allow user to input job description and company context', async ({ page }) => {
    await page.goto('/wizard');

    await page.getByRole('button', { name: '2 Job Details' }).click();

    const jobDescriptionInput = page.getByRole('textbox', { name: 'Job Description *' });
    await jobDescriptionInput.fill('This is a new test job description.');
    await expect(jobDescriptionInput).toHaveValue('This is a new test job description.');

    const companyContextInput = page.getByRole('textbox', { name: 'Company Culture & Values (optional)' });
    await companyContextInput.fill('This is a new test company culture.');
    await expect(companyContextInput).toHaveValue('This is a new test company culture.');
  });

  test('should show validation error when job description is empty', async ({ page }) => {
    await page.goto('/wizard');

    await page.getByRole('button', { name: '2 Job Details' }).click();

    const jobDescriptionInput = page.getByRole('textbox', { name: 'Job Description *' });
    await jobDescriptionInput.fill('');

    await expect(page.getByText('Job description is required.')).toBeVisible();

    await jobDescriptionInput.fill('This is a new test job description.');

    await expect(page.getByText('Job description is required.')).not.toBeVisible();
  });
});
