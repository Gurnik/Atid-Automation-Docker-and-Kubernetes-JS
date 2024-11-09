const { Builder, By, until } = require("selenium-webdriver");
const { assert } = require("chai");
const chrome = require("selenium-webdriver/chrome");

describe("Sanity test", function () {
  this.timeout(3000);
  let driver;

  before(async function () {
    let options = new chrome.Options();
    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .usingServer("http://localhost:4444")
      .build();
    await driver
      .manage()
      .window()
      .setRect({ width: 1920, height: 1080, x: 620, y: 0 });

    await driver.get("https://www.saucedemo.com/");
    //await driver.sleep(3000);
    await login("standard_user", "secret_sauce");
  });

  it("test01_count_items", async function () {
    await selectAllItems();
    await verifyNumberOfItemsInCart("6");
  });

  after(async function () {
    await driver.quit();
  });

  async function login(username, password) {
    await driver.findElement(By.id("user-name")).sendKeys(username);
    await driver.findElement(By.id("password")).sendKeys(password);
    await driver.findElement(By.id("login-button")).click();
  }

  async function selectAllItems() {
    let items = await driver.findElements(By.className("inventory_item_name"));
    for (let i = 0; i < items.length; i++) {
      items = await driver.findElements(By.className("inventory_item_name"));
      await items[i].click();
      let addToCartButton = await driver.findElement(
        By.css("button[class='btn btn_primary btn_small btn_inventory", 2000)
      );
      await driver.wait(until.elementIsVisible(addToCartButton), 2000);
      await addToCartButton.click();
      let backButton = await driver.findElement(
        By.id("back-to-products"),
        2000
      );
      await driver.wait(until.elementIsVisible(backButton), 2000);
      await backButton.click();
    }
  }

  async function verifyNumberOfItemsInCart(expected) {
    let actual = await driver
      .findElement(By.className("shopping_cart_badge"))
      .getText();
    assert.strictEqual(actual, expected);
  }
});
