import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.pages';
import { userData } from '../test_data/user.data';
import { ProductPage } from '../pages/product.pages';
import { CheckoutPage } from '../pages/checkout.pages';
import exp from 'constants';

test('test', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    await page.goto('https://practicesoftwaretesting.com/');
    await page.locator('[data-test="nav-sign-in"]').click();
    await loginPage.loginInput.fill(userData.userLogin);
    await loginPage.passwordInput.fill(userData.userPassword);
    await loginPage.loginButton.click();
    await page.waitForTimeout(500);
    await page.getByRole('link', { name: 'Practice Software Testing -' }).click();

    ///--PRODUCT PART --///
    await productPage.productElement.click()
    await productPage.increaseQuantityButton.click();
    await productPage.addToCartButton.click();

    const productQuantityValue = await productPage.quantityCounter.textContent();

    await expect(productPage.quantityCounter).toHaveValue('2');
    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('2');
    await expect(productPage.productAddedMessage).toBeVisible();

    ///--CHECKOUT PART--///
    await page.locator('[data-test="nav-cart"]').click();

    const cartProductQuantityValue = await checkoutPage.cartProductQuantity.textContent();
    expect(productQuantityValue).toBe(cartProductQuantityValue);
});