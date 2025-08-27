import { Page } from '@playwright/test';
import { mockGeminiResponses, getMockResponseType } from '../mocks/gemini-responses';

/**
 * Sets up Gemini API mocking for Playwright tests
 * Intercepts Gemini endpoints and returns consistent mock responses for extraction and matching phases
 */
export function setupGeminiMocking(page: Page, options: {
  simulateErrors?: boolean;
  errorType?: 'rateLimit' | 'serverError' | 'invalidRequest';
  delayMs?: number;
} = {}) {
  const { simulateErrors = false, errorType = 'rateLimit', delayMs = 100 } = options;

  // Intercept ALL Gemini API calls
  page.route('**/generativelanguage.googleapis.com/**', async route => {
    console.log('🎯 Intercepting Gemini API call:', route.request().url());

    // Add delay to simulate network latency
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    // Check if we should return an error
    if (simulateErrors) {
      const errorResponse = mockGeminiResponses.errors[errorType];
      const statusCode = errorType === 'rateLimit' ? 429 : errorType === 'serverError' ? 500 : 400;

      await route.fulfill({
        status: statusCode,
        contentType: 'application/json',
        body: JSON.stringify(errorResponse)
      });
      return;
    }

    // Return mock response based on prompt content
    const requestBody = route.request().postDataJSON();
    const prompt = requestBody?.contents?.[0]?.parts?.[0]?.text || '';
    const responseType = getMockResponseType(prompt);

    // Only mock extraction and matching phases (optimization uses hybridSelection.ts)
    if (responseType === 'extraction' || responseType === 'matching') {
      const mockResponse = mockGeminiResponses[responseType];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse)
      });
    } else {
      // For optimization phase, let the request go through (will use hybridSelection.ts)
      await route.continue();
    }
  });
}

/**
 * Sets up mocking to return errors for all Gemini API calls
 */
export function setupGeminiErrorMocking(page: Page, errorType: 'rateLimit' | 'serverError' | 'invalidRequest' = 'rateLimit') {
  page.route('**/generativelanguage.googleapis.com/**', async route => {
    const errorResponse = mockGeminiResponses.errors[errorType];
    const statusCode = errorType === 'rateLimit' ? 429 : errorType === 'serverError' ? 500 : 400;

    await route.fulfill({
      status: statusCode,
      contentType: 'application/json',
      body: JSON.stringify(errorResponse)
    });
  });
}

/**
 * Disables Gemini mocking (for tests that need real API calls)
 * Safely handles cleanup even if page context is destroyed
 */
export function disableGeminiMocking(page: Page) {
  try {
    page.unroute('**/generativelanguage.googleapis.com/**');
  } catch (error) {
    // Ignore errors if page context is already destroyed
    console.log('Mock cleanup: page context already destroyed, skipping unroute');
  }
}
