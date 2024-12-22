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
    const userAlreadyLoggedMessageText = `Hello ${userData.userName} ${userData.userLastName}, you are already logged in. You can proceed to checkout.`
    const paymentMethodBankTransfer = 'bank-transfer';

    await page.goto('https://practicesoftwaretesting.com/');
    await page.locator('[data-test="nav-sign-in"]').click();
    await loginPage.loginInput.fill(userData.userLogin);
    await loginPage.passwordInput.fill(userData.userPassword);
    await loginPage.loginButton.click();
    await page.waitForTimeout(500);
    await page.getByRole('link', { name: 'Practice Software Testing -' }).click();

    /// --PRODUCT PART --///
    await productPage.productElement.click()
    await productPage.increaseQuantityButton.click();
    await productPage.addToCartButton.click();

    const productQuantityValue = await productPage.quantityCounter.textContent();
    const productPriceValue = await productPage.priceElement.textContent();

    await expect(productPage.quantityCounter).toHaveValue('2');
    await expect(page.locator('[data-test="cart-quantity"]')).toHaveText('2');
    await expect(productPage.productAddedMessage).toBeVisible();

    /// --CHECKOUT PART --///

    //CHECKOUT step 1//
    await page.locator('[data-test="nav-cart"]').click();

    const cartProductQuantityValue = await checkoutPage.cartProductQuantity.textContent();
    const cartProductPriceValue = await checkoutPage.cartProductPrice.textContent();

    expect(productQuantityValue).toBe(cartProductQuantityValue);
    expect(productPriceValue).toContain(cartProductPriceValue);

    await checkoutPage.proceedButton1.click();

    //CHECKOUT step 2//
    const userLoggedInMessage = await checkoutPage.userAlreadyLoggedInMessage.textContent();

    expect(userLoggedInMessage).toBe(userAlreadyLoggedMessageText);

    await checkoutPage.proceedButton2.click();

    //CHECKOUT step 3//
    await expect(checkoutPage.billingAdressHeader).toBeVisible();
    await checkoutPage.proceedButton3.click();

    //CHECKOUT step 4//
    await (checkoutPage.paymentMethod).selectOption(paymentMethodBankTransfer);
    await checkoutPage.bankNameInput.fill(userData.userBank);
    await checkoutPage.bankAccountInput.fill(userData.userBankAccountName);
    await checkoutPage.bankNumberInput.fill(userData.userBankAccountNumber);
    await checkoutPage.paymentConfirmButton.click();
    await expect(checkoutPage.successPaymentMessage).toBeVisible();
    await checkoutPage.paymentConfirmButton.click();
    await expect(checkoutPage.orderConfirmation).toBeVisible();
});