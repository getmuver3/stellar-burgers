import fs from 'node:fs';
import path from 'node:path';

import { expect, test, type Locator, type Page } from '@playwright/test';

const harsDir = path.resolve('tests/hars');

type Ingredient = {
  _id: string;
  name: string;
  type: string;
  price: number;
  calories: number;
};

type HarFile = {
  log: {
    entries: {
      response: {
        content: {
          text?: string;
        };
      };
    }[];
  };
};

const readHarResponse = <T,>(fileName: string): T => {
  const har = JSON.parse(fs.readFileSync(path.join(harsDir, fileName), 'utf8')) as HarFile;
  const text = har.log.entries[0]?.response.content.text;

  if (!text) {
    throw new Error(`В HAR-файле ${fileName} нет тела ответа`);
  }

  return JSON.parse(text) as T;
};

const routeHar = (page: Page, fileName: string, url: string): Promise<void> =>
  page.routeFromHAR(path.join(harsDir, fileName), {
    notFound: 'abort',
    update: false,
    url,
  });

const ingredients = readHarResponse<{ data: Ingredient[] }>('ingredients.har').data;

const ingredientByType = (type: string): Ingredient => {
  const ingredient = ingredients.find((item) => item.type === type);

  if (!ingredient) {
    throw new Error(`В HAR нет ингредиента типа «${type}»`);
  }

  return ingredient;
};

const bun = ingredientByType('bun');
const main = ingredientByType('main');
const sauce = ingredientByType('sauce');

const accessToken = 'test-accessToken';
const refreshToken = 'test-refreshToken';

const mockUser = readHarResponse<{ user: { email: string; name: string } }>('user.har').user;

const orderNumber = readHarResponse<{ order: { number: number } }>('order.har').order.number;

const ingredientCard = (page: Page, name: string): Locator =>
  page
    .locator('li')
    .filter({ hasText: name })
    .filter({ has: page.getByRole('button', { name: 'Добавить', exact: true }) });

const addIngredient = async (page: Page, name: string): Promise<void> => {
  await ingredientCard(page, name)
    .getByRole('button', { name: 'Добавить', exact: true })
    .click();
};

const openIngredientDetails = async (
  page: Page,
  ingredient: Ingredient
): Promise<void> => {
  await ingredientCard(page, ingredient.name).getByRole('link').click();

  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: ingredient.name, exact: true })
  ).toBeVisible();
  await expect(page.getByText('Калории, ккал')).toBeVisible();
  await expect(
    page
      .locator('li')
      .filter({ hasText: 'Калории, ккал' })
      .getByText(String(ingredient.calories), { exact: true })
  ).toBeVisible();
  await expect(page).toHaveURL(new RegExp(`/ingredients/${ingredient._id}$`));
};

const expectModalClosed = async (page: Page): Promise<void> => {
  await expect(page.getByRole('heading', { name: 'Детали ингредиента' })).toBeHidden();
  await expect(page.getByTestId('modal-overlay')).toBeHidden();
  await expect(page.getByText('Калории, ккал')).toBeHidden();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
};

const installAuthTokens = async (page: Page): Promise<void> => {
  await page.context().addCookies([
    {
      name: 'accessToken',
      value: accessToken,
      url: 'http://localhost:4000',
    },
  ]);

  await page.addInitScript((token: string) => {
    localStorage.setItem('refreshToken', token);
  }, refreshToken);
};

const mockOrderApi = async (page: Page): Promise<void> => {
  await routeHar(page, 'user.har', '**/api/auth/user');
  await routeHar(page, 'order.har', '**/api/orders');
};

const expectAuthTokens = async (page: Page): Promise<void> => {
  const cookies = await page.context().cookies('http://localhost:4000');
  const storedRefreshToken = await page.evaluate(() =>
    localStorage.getItem('refreshToken')
  );

  expect(cookies.find((item) => item.name === 'accessToken')?.value).toBe(accessToken);
  expect(storedRefreshToken).toBe(refreshToken);
};

const expectConstructorEmpty = async (page: Page): Promise<void> => {
  const constructor = page.getByTestId('constructor');

  await expect(constructor.getByText('Выберите булки')).toHaveCount(2);
  await expect(constructor.getByText('Выберите начинку')).toHaveCount(1);
  await expect(page.getByTestId('constructor-bun-1')).toHaveCount(0);
  await expect(page.getByTestId('constructor-bun-2')).toHaveCount(0);
  await expect(page.getByTestId('order-summ').locator('p')).toHaveText('0');
};

const expectOrderModalClosed = async (page: Page): Promise<void> => {
  await expect(page.getByTestId('order-number')).toBeHidden();
  await expect(page.getByText('идентификатор заказа')).toBeHidden();
  await expect(page.getByText('Ваш заказ начали готовить')).toBeHidden();
  await expect(page.getByTestId('modal-overlay')).toBeHidden();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
};

test.describe('constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await routeHar(page, 'ingredients.har', '**/api/ingredients');
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
    await expect(page.getByText(bun.name)).toBeVisible();
  });

  test.describe('add ingredients to constructor works correctly', () => {
    test('добавляет булку в конструктор', async ({ page }) => {
      await addIngredient(page, bun.name);

      await expect(page.getByTestId('constructor-bun-1')).toContainText(
        `${bun.name} (верх)`
      );
      await expect(page.getByTestId('constructor-bun-2')).toContainText(
        `${bun.name} (низ)`
      );
      await expect(
        page.getByTestId('constructor').getByText('Выберите булки')
      ).toHaveCount(0);
      await expect(ingredientCard(page, bun.name).locator('.counter__num')).toHaveText(
        '2'
      );
      await expect(page.getByTestId('order-summ')).toContainText(String(bun.price * 2));
    });

    test('добавляет начинки в конструктор', async ({ page }) => {
      await addIngredient(page, main.name);
      await addIngredient(page, sauce.name);

      const fillings = page.getByTestId('constructor-ingredients');

      await expect(fillings).toContainText(main.name);
      await expect(fillings).toContainText(sauce.name);
      await expect(fillings.getByText('Выберите начинку')).toHaveCount(0);
      await expect(ingredientCard(page, main.name).locator('.counter__num')).toHaveText(
        '1'
      );
      await expect(ingredientCard(page, sauce.name).locator('.counter__num')).toHaveText(
        '1'
      );
      await expect(page.getByTestId('order-summ')).toContainText(
        String(main.price + sauce.price)
      );
    });
  });

  test.describe('модальные окна ингредиента', () => {
    test('открывается и закрывается по крестику', async ({ page }) => {
      await openIngredientDetails(page, main);

      await page.getByRole('button', { name: 'Закрыть' }).click();

      await expectModalClosed(page);
    });

    test('закрывается по клику на оверлей', async ({ page }) => {
      await openIngredientDetails(page, sauce);

      await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });

      await expectModalClosed(page);
    });
  });

  test.describe('создание заказа', () => {
    test.beforeEach(async ({ page }) => {
      await installAuthTokens(page);
      await mockOrderApi(page);

      const userLoaded = page.waitForResponse(
        (response) =>
          response.url().includes('/api/auth/user') &&
          response.request().method() === 'GET' &&
          response.ok()
      );

      await page.reload();
      await userLoaded;

      await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
      await expect(page.getByRole('link', { name: mockUser.name })).toBeVisible();
      await expect(page.getByText(bun.name)).toBeVisible();
    });

    test('оформляет заказ и закрывает модальное окно', async ({ page }) => {
      await expectAuthTokens(page);

      await addIngredient(page, bun.name);
      await addIngredient(page, main.name);
      await addIngredient(page, sauce.name);

      await expect(page.getByTestId('constructor-bun-1')).toContainText(
        `${bun.name} (верх)`
      );
      await expect(page.getByTestId('constructor-bun-2')).toContainText(
        `${bun.name} (низ)`
      );
      await expect(page.getByTestId('constructor-ingredients')).toContainText(main.name);
      await expect(page.getByTestId('constructor-ingredients')).toContainText(
        sauce.name
      );

      const orderRequest = page.waitForRequest(
        (request) => request.url().includes('/api/orders') && request.method() === 'POST'
      );

      await page.getByRole('button', { name: 'Оформить заказ' }).click();

      const request = await orderRequest;

      expect(request.headers().authorization).toBe(accessToken);
      expect(request.postDataJSON()).toEqual({
        ingredients: [bun._id, main._id, sauce._id, bun._id],
      });

      await expect(page.getByTestId('order-number')).toHaveText(String(orderNumber));
      await expect(page.getByText('идентификатор заказа')).toBeVisible();
      await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();
      await expect(page.getByTestId('modal-overlay')).toBeVisible();
      await expect(page).toHaveURL('/');

      await expectConstructorEmpty(page);

      await page.getByRole('button', { name: 'Закрыть' }).click();

      await expectOrderModalClosed(page);
      await expectConstructorEmpty(page);
    });
  });
});
